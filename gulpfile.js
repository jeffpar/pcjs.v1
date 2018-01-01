/**
 * @fileoverview Gulp file for pcjs.org
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 * @copyright © Jeff Parsons 2012-2017
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
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
 * Scenarios:
 * 
 *      `gulp` (aka `gulp default`)
 * 
 *          Recompiles all machine scripts in their respective version folder (under /versions) that
 *          are out-of-date with respect to the individual files (under /modules).  The target version
 *          comes from _data/machines.json:shared.version.
 *
 *          It does this by running the `concat`, `compile`, `copy`, and `disks` tasks for all machines,
 *          in that order.
 * 
 *      `gulp concat` (or `gulp concat/{machine}`)
 * 
 *          Concatenates all the individual files (under /modules) that comprise the machines's compiled
 *          script; the resulting file (eg, pcx86-uncompiled.js) becomes the input file for the Closure
 *          Compiler, which is why each machine's `compile` task lists the corresponding `concat` task as a
 *          dependency/prerequisite.
 * 
 *      `gulp compile` (or `gulp compile/{machine}`)
 * 
 *          For example, `gulp compile/pcx86` will recompile the current version of pcx86-uncompiled.js
 *          if it's out of date.
 * 
 *      `gulp compile/devices`
 * 
 *          This special task compiles all the newer machines that use Device classes; you can also compile
 *          them individually, just like any other machine (eg, `gulp compile/ti57`).
 * 
 *      `gulp copy` (or `gulp copy/{machine}`)
 * 
 *          Copies any other individual resources files listed in machines.json (other than scripts) to the
 *          machine's current version folder.
 * 
 *      `gulp disks`
 * 
 *          Updates "compiled" (inlined) disk manifests (eg, /disks/pcx86/compiled/library.xml) from the
 *          "uncompiled" manifests (eg, /disks/pcx86/library.xml), which are actually "manifests of manifests"
 *          and therefore inherently slower to load.
 * 
 *      `gulp version`
 * 
 *          Updates the version number in all project machine XML files to match the version contained in
 *          _data/machines.json:shared.version.
 *
 *      `gulp copyright`
 *
 *          Updates the copyright year in all project files to match the year contained in package.json.
 */
var gulp = require("gulp");
var gulpNewer = require("gulp-newer");
var gulpConcat = require("gulp-concat");
var gulpForEach = require("gulp-foreach");
var gulpHeader = require("gulp-header");
var gulpReplace = require("gulp-replace");
var gulpClosureCompiler = require('google-closure-compiler-js').gulp();
var gulpSequence = require("run-sequence");
var gulpSourceMaps = require('gulp-sourcemaps');

var fs = require("fs");
var path = require("path");
var pkg = require("./package.json");
var machines = require("./_data/machines.json");

var sExterns = "";

for (let i = 0; i < machines.shared.externs.length; i++) {
    let sContents = "";
    try {
        sContents = fs.readFileSync(machines.shared.externs[i], "utf8");
    } catch(err) {
        console.log(err.message);
    }
    if (sContents) {
        if (sExterns) sExterns += '\n';
        sExterns += sContents;
    }
}

var sSiteHost = "www.pcjs.org";

if (pkg.homepage) {
    let match = pkg.homepage.match(/^http:\/\/([^\/]*)(.*)/);
    if (match) sSiteHost = match[1];
}

var aMachines = Object.keys(machines);
var aConcatTasks = [], aCompileTasks = [], aCopyTasks = [];

aMachines.forEach(function(machineType) {
    if (machineType == "shared") return;

    let machineConfig = machines[machineType];
    let machineName = machineConfig.name;
    let machineClass = machineConfig.class;

    while (machineConfig && machineConfig.alias) {
        machineConfig = machines[machineConfig.alias];
    }

    let machineVersion = (machineConfig.version || machines.shared.version);
    let machineReleaseDir = "./versions/" + machineConfig.folder + "/" + machineVersion;
    let machineReleaseFile  = machineType + ".js";
    let machineUncompiledFile  = machineType + "-uncompiled.js";
    let machineDefines = {};

    if (machineConfig.defines) {
        for (let i = 0; i < machineConfig.defines.length; i++) {
            let define = machineConfig.defines[i];
            switch(define) {
            case "APPVERSION":
                machineDefines[define] = machineVersion;
                break;
            case "SITEHOST":
                machineDefines[define] = sSiteHost;
                break;
            case "BACKTRACK":
            case "DEBUG":
                machineDefines[define] = false;
                break;
            case "COMPILED":
            case "DEBUGGER":
            case "I386":
            default:
                machineDefines[define] = true;
                break;
            }
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
        if (dstTime < srcTime) aMachinesOutdated.push(machineType);
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
                    .pipe(gulpHeader('/**\n * @copyright ' + file.path.replace(/.*\/(modules\/.*)/, "http://pcjs.org/$1") + ' (C) Jeff Parsons 2012-2017\n */\n\n'))
                    .pipe(gulpReplace(/(^|\n)[ \t]*(['"])use strict\2;?/g, ""))
                    .pipe(gulpReplace(/^(import|export)[ \t]+[^\n]*\n/gm, ""))
                    .pipe(gulpReplace(/^[ \t]*var\s+\S+\s*=\s*require\((['"]).*?\1\);/gm, ""))
                    .pipe(gulpReplace(/^[ \t]*(if\s+\(NODE\)\s*|)module\.exports\s*=\s*\S+;/gm, ""))
                    .pipe(gulpReplace(/\/\*\*\s*\*\s*@fileoverview[\s\S]*?\*\/\s*/g, ""))
                    .pipe(gulpReplace(/[ \t]*if\s*\(NODE\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, ""))
                    .pipe(gulpReplace(/[ \t]*if\s*\(typeof\s+module\s*!==\s*(['"])undefined\1\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, ""))
                    .pipe(gulpReplace(/\/\*\*[^@]*@typedef\s*{[A-Z][A-Za-z0-9_]+}\s*(\S+)\s*([\s\S]*?)\*\//g, function(match, type, props) {
                        let sType = "/** @typedef {{ ";
                        let sProps = "";
                        let reProps = /@property\s*{([^}]*)}\s*(\[|)([^\s\]]+)]?/g, matchProps;
                        while (matchProps = reProps.exec(props)) {
                            if (sProps) sProps += ", ";
                            sProps += matchProps[3] + ": " + (matchProps[2]? ("(" + matchProps[1] + "|undefined)") : matchProps[1]);
                        }
                        sType += sProps + " }} */\nvar " + type + ";";
                        return sType;
                    }))
                    .pipe(gulpReplace(/[ \t]*[A-Za-z_][A-Za-z0-9_.]*\.assert\([^\n]*\);[^\n]*/g, ""))
                }))        
            .pipe(gulpConcat(machineUncompiledFile))
            .pipe(gulpHeader('"use strict";\n\n'))
            .pipe(gulp.dest(machineReleaseDir));
    });

    let taskCompile = "compile/" + machineType;
    aCompileTasks.push(taskCompile);
    gulp.task(taskCompile, ["concat/" + machineType], function() {
        let stream = gulp.src(srcFile /*, {base: './'} */);
        if (aMachinesOutdated.indexOf(machineType) >= 0) {
            stream.pipe(gulpSourceMaps.init())
                  .pipe(gulpClosureCompiler({
                    assumeFunctionWrapper: true,
                    compilationLevel: 'ADVANCED',
                    defines: machineDefines,
                    externs: [{src: sExterns}],
                    warningLevel: 'VERBOSE',
                    languageIn: "ES6",                          // this is now the default, just documenting our requirements
                    languageOut: "ES5",                         // this is also the default
                    outputWrapper: '(function(){%output%})()',
                    jsOutputFile: machineReleaseFile,           // TODO: This must vary according to debugger/non-debugger releases
                    createSourceMap: true
                  }))
                  .pipe(gulpSourceMaps.write('./'))             // gulp-sourcemaps automatically adds the sourcemap url comment
                  .pipe(gulp.dest(machineReleaseDir));
        }
        return stream;
    });

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
});

gulp.task("concat", aConcatTasks);

gulp.task("compile", aCompileTasks);

gulp.task("compile/devices", [
    "compile/leds",
    "compile/ti42",
    "compile/ti55",
    "compile/ti57"
]);

gulp.task("copy", aCopyTasks);

gulp.task("disks", function() {
    let baseDir = "./disks/pcx86/";
    let targetDir = baseDir + "compiled/";
    return gulp.src([
            "disks/pcx86/library.xml",
            "disks/pcx86/samples.xml",
            "disks/pcx86/shareware/pcsig08/pcsig08.xml",
            "disks/pcx86/private/library.xml"
        ], {base: baseDir})
        .pipe(gulpReplace(/([ \t]*)<manifest.*? ref="(.*?)".*?\/>/g, function(match, sIndent, sFile) {
            /*
             * This function mimics what components.xsl normally does for disk manifests referenced by the FDC
             * machine component.  Compare it to the following template in components.xsl:
             * 
             *      <xsl:template match="manifest[not(@ref)]" mode="component">
             * 
             * This code is not perfect (it doesn't process <link> elements, for example), but for machines
             * that used library.xml, having them use compiled/library.xml instead speeds up loading significantly.
             * 
             * Granted, after the first machine has fetched all the individual manifest files, your browser should
             * do a reasonably good job using cached copies for all subsequent machines, but even then, there's
             * still a noticeable delay.
             */
            let sDisks = match;
            let sFilePath = path.join('.', sFile);
            try {
                let sManifest = fs.readFileSync(sFilePath, {encoding: 'utf8'});
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
                        sDisks += sIndent + "<disk path=\"" + matchDisk[1] + "\">" + sDefaultName + "</disk>";
                    }
                    reDisk = /<disk.*? href="([^"]*)".*?>([\S\s]*?)<\/disk>/g;
                    while ((matchDisk = reDisk.exec(sManifest))) {
                        if (sDisks) sDisks += "\n";
                        var matchName = matchDisk[2].match(/<name.*?>(.*?)<\/name>/);
                        var sName = matchName? ((sPrefix? sPrefix + ": " : "") + matchName[1]) : sDefaultName;
                        sDisks += sIndent + "<disk path=\"" + matchDisk[1] + "\">" + sName + "</disk>";
                    }
                    return sDisks;
                }
            } catch(err) {
                console.log(err.message);
            }
            return sDisks;
        }))
        .pipe(gulp.dest(targetDir));
});

gulp.task("version", function() {
    let baseDir = "./";
    return gulp.src(["apps/**/*.xml", "devices/**/*.xml", "disks/**/*.xml", "pubs/**/*.xml"], {base: baseDir})
        .pipe(gulpReplace(/href="\/versions\/([^\/]*)\/[0-9.]*\/(machine|manifest|outline)\.xsl"/g, 'href="/versions/$1/' + machines.shared.version + '/$2.xsl"'))
        .pipe(gulp.dest(baseDir));
});

gulp.task("copyright", function() {
    let baseDir = "./";
    /*
     * TODO: Although I've added the 'skipBinary' option to gulpReplace(), to avoid mucking up files like ATT4425.ttf,
     * it would also be nice if we could avoid rewriting ANY file that contains no matches, because Gulp's default behavior
     * seems to be rewrite EVERYTHING, at least when we're doing these sorts of "in place" operations.
     */
    return gulp.src(["devices/**/*.js", "modules/**/*", "**/*.md", "_layouts/*.html"], {base: baseDir})
    return gulp.src(["devices/**/*.js", "modules/**/*", "**/*.md", "_layouts/*.html", "*.js"], {base: baseDir})
        .pipe(gulpReplace(/(Copyright[ \S]+?)( Jeff Parsons)( +201\d-)[0-9]+/gi, '$1$3' + pkg.year + '$2', {skipBinary: true}))
        .pipe(gulpReplace(/(Copyright|\u00A9)( +201\d-)[0-9]+(.*?Jeff Parsons|.*?twitter_username)/gi, '$1$2' + pkg.year + '$3', {skipBinary: true}))
        .pipe(gulp.dest(baseDir));
});

gulp.task("default", function() {
    gulpSequence(
        "concat", "compile", "copy", "disks"
    );
});
