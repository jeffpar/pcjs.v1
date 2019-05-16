/**
 * @fileoverview Gulp file for pcjs.org
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 * @copyright © Jeff Parsons 2012-2019
 *
 * This file is part of PCjs, a computer emulation software project at <https://www.pcjs.org>.
 *
 * PCjs is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * PCjs is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with PCjs.  If not,
 * see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see COPYRIGHT in /modules/shared/lib/defines.js).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

/*
 * Tasks
 *
 *      default (eg: `gulp` or `gulp default`)
 *
 *          Recompiles all machine scripts in their respective version folder (under /versions) that
 *          are out-of-date with respect to the individual files (under /modules).  The target version
 *          comes from _data/machines.json:shared.version.
 *
 *          It does this by running the `concat`, `compile`, `copy`, and `disks` tasks for all machines,
 *          in that order.
 *
 *      concat (eg: `gulp concat` or `gulp concat/{machine}`)
 *
 *          Concatenates all the individual files (under /modules) that comprise the machines's compiled
 *          script; the resulting file (eg, pcx86-uncompiled.js) becomes the input file for the Closure
 *          Compiler, which is why each machine's `compile` task lists the corresponding `concat` task as a
 *          dependency/prerequisite.
 *
 *      compile (eg: `gulp compile` `gulp compile/{machine}`)
 *
 *          For example, `gulp compile/pcx86` will recompile the current version of pcx86-uncompiled.js
 *          if it's out of date.
 *
 *      compile/devices
 *
 *          This special task compiles all the newer machines that use Device classes; you can also compile
 *          them individually, just like any other machine (eg, `gulp compile/ti57`).
 *
 *      copy (eg: `gulp copy` or `gulp copy/{machine}`)
 *
 *          Copies any other individual resources files listed in machines.json (other than scripts) to the
 *          machine's current version folder.
 *
 *      disks (eg: `gulp disks-demo`, `gulp disks-private`)
 *
 *          Updates inlined disk manifests (eg, /disks/pcx86/library.xml) from the submodule manifests
 *          (eg, /disks-demo/pcx86/library.xml), which are actually "manifests of manifests" and therefore
 *          inherently slower to load.
 *
 *      version
 *
 *          Updates the version number in all project machine XML files to match the version contained in
 *          _data/machines.json:shared.version.
 *
 *      copyright
 *
 *          Updates the copyright year in all project files to match the year contained in package.json.
 *
 * Options
 *
 *      --rebuild will force the "compile" tasks to recompile the code for the specified machines, even if the
 *      compiled code is up-to-date.
 */

 "use strict";

var gulp = require("gulp");
var gulpNewer = require("gulp-newer");
var gulpConcat = require("gulp-concat");
var gulpForEach = require("gulp-foreach");
var gulpHeader = require("gulp-header");
var gulpReplace = require("gulp-replace");
var gulpClosureCompiler = require('google-closure-compiler').gulp();
var gulpSourceMaps = require('gulp-sourcemaps');

var fs = require("fs");
var path = require("path");
var pkg = require("./package.json");

var proc = require("./modules/shared/lib/proclib.js");
var args = proc.getArgs();
var argv = args.argv;

/**
 * @typedef {Object} MachineConfig
 * @property {string} name
 * @property {string} class
 * @property {string} version (if not defined, shared.version is used instead)
 * @property {string} alias (if defined, then all the alias' properties are used instead, except for name and class)
 * @property {string} folder
 * @property {string} creator
 * @property {Array.<string>} defines
 * @property {Array.<string>} externs
 * @property {Array.<string>} scripts
 * @property {Array.<string>} styles
 * @property {Array.<string>} css
 * @property {Array.<string>} xsl
 */

/**
 * @type {Object.<string,MachineConfig>}
 */
var machines = require("./_data/machines.json");
var siteHost = "https://www.pcjs.org";

if (pkg.homepage) {
    let match = pkg.homepage.match(/^(https?:\/\/[^/]*)(.*)/);
    if (match) siteHost = match[1];
}

var aMachines = Object.keys(machines);
var aConcatTasks = [], aCompileTasks = [], aCopyTasks = [];

aMachines.forEach(function(machineType) {
    if (machineType == "shared") return;

    /**
     * @type {MachineConfig}
     */
    let machineConfig = machines[machineType];
    let machineName = machineConfig.name;
    let machineClass = machineConfig.class;

    while (machineConfig && machineConfig.alias) {
        machineConfig = machines[machineConfig.alias];
    }

    let machineDefines = [];
    let machineVersion = machineConfig.version || machines.shared.version;
    let machineReleaseDir = "./versions/" + machineConfig['folder'] + "/" + machineVersion;
    let machineReleaseFile  = machineType + ".js";
    let machineUncompiledFile  = machineType + "-uncompiled.js";

    if (machineConfig.defines) {
        for (let i = 0; i < machineConfig.defines.length; i++) {
            let define = machineConfig.defines[i], value = undefined;
            switch(define) {
            case "APPVERSION":
            case "VERSION":
                value = machineVersion;
                break;
            case "SITEURL":
                value = siteHost;
                break;
            case "BACKTRACK":
            case "DEBUG":
                value = false;
                break;
            case "COMPILED":
            case "DEBUGGER":
            case "I386":
            default:
                value = true;
                break;
            }
            machineDefines.push(define + '=' + value);
        }
    }

    let machineFiles = machineConfig.css || machines.shared.css;
    machineFiles = machineFiles.concat(machineConfig.xsl || machines.shared.xsl);

    /*
     * The gulpNewer() plugin doesn't seem to work properly with the closureCompiler() plugin;
     * if the destination file is newer than the source, the compiler still gets invoked, but
     * with an incomplete stream, resulting in bogus errors.  My work-around is to compare filetimes
     * myself, marking the machine as "outdated" ONLY if the destination file is older, and then
     * change the appropriate "compile" tasks to simply ignore any machines that aren't outdated.
     *
     * Since this code runs *before* any of the actual tasks, the "outdated" machines array must
     * ALSO be updated by any "concat" task that recreates one of the uncompiled input files.
     */
    let aMachinesOutdated = [];
    let srcFile = path.join(machineReleaseDir, machineUncompiledFile);
    let dstFile = path.join(machineReleaseDir, machineReleaseFile);
    try {
        let srcStat = fs.statSync(srcFile);
        let dstStat = fs.statSync(dstFile);
        let srcTime = new Date(srcStat.mtime);
        let dstTime = new Date(dstStat.mtime);
        if (dstTime < srcTime || argv['rebuild']) aMachinesOutdated.push(machineType);
    } catch(err) {
        // console.log(err.message);
    }

    let taskConcat = "concat/" + machineType;
    aConcatTasks.push(taskConcat);
    gulp.task(taskConcat, function() {
        return gulp.src(machineConfig.scripts)
            .pipe(gulpNewer(path.join(machineReleaseDir, machineUncompiledFile)))
            .pipe(gulpForEach(function(stream, file) {
                aMachinesOutdated.push(machineType);
                return stream
                    .pipe(gulpHeader('/**\n * @copyright ' + file.path.replace(/.*\/(modules\/.*)/, "https://www.pcjs.org/$1") + ' (C) Jeff Parsons 2012-2019\n */\n\n'))
                    .pipe(gulpReplace(/(^|\n)[ \t]*(['"])use strict\2;?/g, ""))
                    .pipe(gulpReplace(/^(import|export)[ \t]+[^\n]*\n/gm, ""))
                    .pipe(gulpReplace(/^[ \t]*var\s+\S+\s*=\s*require\((['"]).*?\1\)[^;]*;/gm, ""))
                    .pipe(gulpReplace(/^[ \t]*(if\s+\(NODE\)\s*|)module\.exports\s*=\s*[^;]*;/gm, ""))
                    .pipe(gulpReplace(/\/\*\*\s*\*\s*@fileoverview[\s\S]*?\*\/\s*/g, ""))
                    .pipe(gulpReplace(/[ \t]*if\s*\(NODE\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, ""))
                    .pipe(gulpReplace(/[ \t]*if\s*\(typeof\s+module\s*!==?\s*(['"])undefined\1\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, ""))
                    .pipe(gulpReplace(/\/\*\*[^@]*@typedef\s*{([A-Z][A-Za-z0-9_<>.]+)}\s*(\S+)\s*([\s\S]*?)\*\//g, function(match, def, type, props) {
                        let sType = "/** @typedef {", sProps = "";
                        let reProps = /@property\s*{([^}]*)}\s*(\[|)([^\s\]]+)]?/g, matchProps;
                        while ((matchProps = reProps.exec(props))) {
                            if (sProps) sProps += ", ";
                            sProps += matchProps[3] + ": " + (matchProps[2]? ("(" + matchProps[1] + "|undefined)") : (matchProps[1].indexOf('|') < 0? matchProps[1] : "(" + matchProps[1] + ")"));
                        }
                        if (!sProps) {
                            sType += def;
                        } else {
                            sType += "{ " + sProps + " }";
                        }
                        sType += "} */\nvar " + type + ";";
                        return sType;
                    }))
                    .pipe(gulpReplace(/[ \t]*(if *\(DEBUG\) *|)[A-Za-z_][A-Za-z0-9_.]*\.assert\([^\n]*\);[^\n]*/g, ""))
                }))
            .pipe(gulpConcat(machineUncompiledFile))
            .pipe(gulpHeader('"use strict";\n\n'))
            .pipe(gulp.dest(machineReleaseDir));
    });

    let taskCompile = "compile/" + machineType;
    aCompileTasks.push(taskCompile);
    gulp.task(taskCompile, function() {
        let stream = gulp.src(srcFile /*, {base: './'} */);
        if (aMachinesOutdated.indexOf(machineType) >= 0) {
            stream.pipe(gulpSourceMaps.init())
                  .pipe(gulpClosureCompiler({
                    assume_function_wrapper: true,
                    compilation_level: 'ADVANCED',
                    define: machineDefines,
                    externs: machines.shared.externs,
                    warning_level: 'VERBOSE',
                    language_in: 'ES6',                          // this is now the default, just documenting our requirements
                    language_out: 'ES5',                         // this is also the default
                    output_wrapper: '(function(){%output%})()',
                    js_output_file: machineReleaseFile,           // NOTE: if we go back to doing debugger/non-debugger releases, this must be updated
                    create_source_map: true
                  }))
                  .pipe(gulpSourceMaps.write('./'))             // gulp-sourcemaps automatically adds the sourcemap url comment
                  .pipe(gulp.dest(machineReleaseDir));
        }
        return stream;
    });

    if (machineFiles.length) {
        let taskCopy = "copy/" + machineType;
        aCopyTasks.push(taskCopy);
        gulp.task(taskCopy, function() {
            return gulp.src(machineFiles)
                .pipe(gulpNewer(machineReleaseDir))
                .pipe(gulpReplace(/(<xsl:variable name="APPCLASS">)[^<]*(<\/xsl:variable>)/g, '$1' + machineClass + '$2'))
                .pipe(gulpReplace(/(<xsl:variable name="APPNAME">)[^<]*(<\/xsl:variable>)/g, '$1' + machineName + '$2'))
                .pipe(gulpReplace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + machineVersion + "$2"))
                .pipe(gulpReplace(/"[^"]*\/?(common.css|common.xsl|components.css|components.xsl|document.css|document.xsl)"/g, '"' + machineReleaseDir.substr(1) + '/$1"'))
                .pipe(gulpReplace(/[ \t]*\/\*[^*][\s\S]*?\*\//g, ""))
                .pipe(gulpReplace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, ""))
                .pipe(gulp.dest(machineReleaseDir));
        });
    }
});

gulp.task("concat", gulp.parallel(...aConcatTasks));
gulp.task("compile", gulp.parallel(...aCompileTasks));
gulp.task("compile/devices", gulp.parallel("compile/leds", "compile/ti42", "compile/ti55", "compile/ti57"));
gulp.task("copy", gulp.series(...aCopyTasks));

let matchRef = function(match, sIndent, sFile) {
    /*
     * This function mimics what components.xsl normally does for disk manifests referenced by the FDC
     * machine component.  Compare it to the following template in components.xsl:
     *
     *      <xsl:template match="manifest[not(@ref)]" mode="component">
     *
     * This code is not perfect (it doesn't process <link> elements, for example), but for machines
     * that use library.xml, having them use an inlined library.xml instead speeds up loading significantly.
     *
     * Granted, after the first machine has fetched all the individual manifest files, your browser should
     * do a reasonably good job using cached copies for all subsequent machines, but even then, there's
     * still a noticeable delay.
     */
    let sDisks = match;
    let sFilePath = path.join('.', sFile);
    try {
        let sManifest = /** @type {string} */ (fs.readFileSync(sFilePath, {encoding: 'utf8'}));
        if (sManifest) {
            sDisks = "";
            let sPrefix = "", sDefaultName = "Unknown";
            let matchTitle = sManifest.match(/<title(?: prefix="(.*?)"|)[^>]*>(.*?)<\/title>/);
            if (matchTitle) {
                sPrefix = matchTitle[1];
                sDefaultName = matchTitle[2];
                let matchVersion = sManifest.match(/<version.*?>(.*?)<\/version>/);
                if ( matchVersion) sDefaultName += ' ' +  matchVersion[1];
            }
            let reDisk, matchDisk;
            reDisk = /<disk.*? href="([^"]*)".*?\/>/g;
            while ((matchDisk = reDisk.exec(sManifest))) {
                if (sDisks) sDisks += "\n";
                let urlDisk = matchDisk[1];
                if (urlDisk.indexOf("http") != 0 && !fs.existsSync(path.join('.', urlDisk))) {
                    console.log("warning: disk image '" + urlDisk + "' may not exist");
                }
                sDisks += sIndent + "<disk path=\"" + urlDisk + "\">" + sDefaultName + "</disk>";
            }
            reDisk = /<disk.*? href="([^"]*)".*?>([\S\s]*?)<\/disk>/g;
            while ((matchDisk = reDisk.exec(sManifest))) {
                if (sDisks) sDisks += "\n";
                let matchName = matchDisk[2].match(/<name.*?>(.*?)<\/name>/);
                let sName = matchName? ((sPrefix? sPrefix + ": " : "") + matchName[1]) : sDefaultName;
                let urlDisk = matchDisk[1];
                if (urlDisk.indexOf("http") != 0 && !fs.existsSync(path.join('.', urlDisk))) {
                    console.log("warning: disk image '" + urlDisk + "' may not exist");
                }
                sDisks += sIndent + "<disk path=\"" + urlDisk + "\">" + sName + "</disk>";
            }
            return sDisks;
        }
    } catch(err) {
        console.log(err.message);
    }
    return sDisks;
};

gulp.task("disks-demo", function() {
    let replaceRefs = gulpReplace(/([ \t]+)<manifest.*? ref="(.*?)".*?\/>/g, matchRef);
    return gulp.src([
            "disks-demo/pcx86/library.xml",
            "disks-demo/pcx86/samples.xml",
            "disks-demo/pcx86/shareware/pcsig08/library.xml",
        ], {base: "disks-demo/pcx86/"})
        .pipe(replaceRefs)
        .pipe(gulp.dest("disks/pcx86/")
    );
});

gulp.task("disks-private", function() {
    let replaceRefs = gulpReplace(/([ \t]+)<manifest.*? ref="(.*?)".*?\/>/g, matchRef);
    return gulp.src([
            "disks-private/pcx86/**/library.xml",
            "disks-private/pcx86/**/manifest.xml",
            "disks-private/pcx86/**/machine.xml",
            "disks-private/pcx86/**/README.md"
        ], {base: "disks-private/pcx86/"})
        .pipe(replaceRefs)
        .pipe(gulp.dest("disks/pcx86/private/")
    );
});

gulp.task("disks", gulp.parallel("disks-demo", "disks-private"));

gulp.task("version", function() {
    let baseDir = "./";
    return gulp.src(["apps/**/*.xml", "devices/**/*.xml", "disks/**/*.xml", "disks-demo/**/*.xml", "disks-game/**/*.xml", "disks-private/**/*.xml", "pubs/**/*.xml"], {base: baseDir})
        .pipe(gulpReplace(/href="\/versions\/([^/]*)\/[0-9.]*\/(machine|manifest|outline)\.xsl"/g, 'href="/versions/$1/' + machines.shared.version + '/$2.xsl"'))
        .pipe(gulp.dest(baseDir));
});

gulp.task("copyright", function(done) {
    let baseDir = "./";
    /*
     * TODO: Although I've added the 'skipBinary' option to gulpReplace(), to avoid mucking up files like ATT4425.ttf,
     * it would also be nice if we could avoid rewriting ANY file that contains no matches, because Gulp's default behavior
     * seems to be rewrite EVERYTHING, at least when we're doing these sorts of "in place" operations.
     */
    return gulp.src(["devices/**/*.js", "modules/**/*", "**/*.md", "_layouts/*.html", "*.js"], {base: baseDir})
        .pipe(gulpReplace(/(Copyright[ \S]+?)( Jeff Parsons)( +201\d-)[0-9]+/gi, '$1$3' + pkg.year + '$2', {skipBinary: true}))
        .pipe(gulpReplace(/(Copyright|\u00A9)( +201\d-)[0-9]+(.*?Jeff Parsons|.*?twitter_username)/gi, '$1$2' + pkg.year + '$3', {skipBinary: true}))
        .pipe(gulp.dest(baseDir));
});

gulp.task("default", gulp.series("concat", "compile", "copy", "disks"));
