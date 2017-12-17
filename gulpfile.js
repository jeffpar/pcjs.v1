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
 *      `gulp make` (or `gulp make/{machine}`)
 * 
 *          Concatenates all the individual files (under /modules) that comprise the machines's compiled
 *          script; the resulting file (eg, pcx86-uncompiled.js) becomes the input file for the Closure
 *          Compiler, which is why each machine's `compile` task lists the corresponding `make` task as a
 *          dependency/prerequisite.
 * 
 *      `gulp compile` (or `gulp compile/{machine}`)
 * 
 *          For example, `gulp compile/pcx86` will recompile the current version of the pcx86.js script
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
 *      `gulp promote`
 * 
 *          Updates the version number in all project machine XML files to match the version contained in
 *          _data/machines.json:shared.version.
 * 
 * Notes:
 * 
 *  Because the 'gulp-newer' plugin doesn't work properly with 'google-closure-compiler-js' (or perhaps
 *  because the 'google-closure-compiler-js' plugin doesn't work properly with 'gulp-newer'), you should invoke
 *  gulp for each of the major tasks in the following order:
 * 
 *      gulp make
 *      gulp compile
 *      gulp copy
 * 
 *  Alternatively, simply run `gulp` twice to ensure that any changed files get detected properly.
 * 
 *  It might be possible to have a final `make` task dynamically add all the `compile` tasks that have outdated
 *  targets and then automatically run them, but I'm not enough of a gulp expert at this point to know whether
 *  that would work, and besides, the damn plugins should just work....
 */
var gulp = require("gulp");
var newer = require("gulp-newer");
var concat = require("gulp-concat");
var foreach = require("gulp-foreach");
var header = require("gulp-header");
var replace = require("gulp-replace");
var closureCompiler = require('google-closure-compiler-js').gulp();
var sequence = require("run-sequence");
var sourcemaps = require('gulp-sourcemaps');

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
var aMakeTasks = [], aCompileTasks = [], aCopyTasks = [];

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
    let sTask = "make/" + machineType;
    let machineFiles = machineConfig.css || machines.shared.css;
    machineFiles = machineFiles.concat(machineConfig.xsl || machines.shared.xsl);
    aMakeTasks.push(sTask);
    gulp.task(sTask, function() {
        return gulp.src(machineConfig.scripts)
            .pipe(newer(path.join(machineReleaseDir, machineUncompiledFile)))
            .pipe(foreach(function(stream, file){
                return stream
                    .pipe(header('/**\n * @copyright ' + file.path.replace(/.*\/(modules\/.*)/, "http://pcjs.org/$1") + ' (C) Jeff Parsons 2012-2017\n */\n\n'))
                    .pipe(replace(/(^|\n)[ \t]*(['"])use strict\2;?/g, ""))
                    .pipe(replace(/^(import|export)[ \t]+[^\n]*\n/gm, ""))
                    .pipe(replace(/^[ \t]*var\s+\S+\s*=\s*require\((['"]).*?\1\);/gm, ""))
                    .pipe(replace(/^[ \t]*(if\s+\(NODE\)\s*|)module\.exports\s*=\s*\S+;/gm, ""))
                    .pipe(replace(/\/\*\*\s*\*\s*@fileoverview[\s\S]*?\*\/\s*/g, ""))
                    .pipe(replace(/[ \t]*if\s*\(NODE\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, ""))
                    .pipe(replace(/[ \t]*if\s*\(typeof\s+module\s*!==\s*(['"])undefined\1\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, ""))
                    .pipe(replace(/\/\*\*[^@]*@typedef\s*{[A-Z][A-Za-z0-9_]+}\s*(\S+)\s*([\s\S]*?)\*\//g, function(match, type, props) {
                        let sType = "/** @typedef {{ ";
                        let sProps = "";
                        let reProps = /@property\s*{([^}]*)}\s*(\[|)([^\s\]]+)\]?/g, matchProps;
                        while (matchProps = reProps.exec(props)) {
                            if (sProps) sProps += ", ";
                            sProps += matchProps[3] + ": " + (matchProps[2]? ("(" + matchProps[1] + "|undefined)") : matchProps[1]);
                        }
                        sType += sProps + " }} */\nvar " + type + ";";
                        return sType;
                    }))
                    .pipe(replace(/[ \t]*[A-Za-z_][A-Za-z0-9_.]*\.assert\([^\n]*\);[^\n]*/g, ""))
                }))        
            .pipe(concat(machineUncompiledFile))
            .pipe(header('"use strict";\n\n'))
            .pipe(gulp.dest(machineReleaseDir));
    });
    /*
     * The newer() plugin doesn't seem to work properly with the closureCompiler() plugin;
     * if the destination file is newer than the source, the compiler still gets invoked, but
     * with a screwed-up stream, resulting in bogus errors.  My solution is to compare filetimes
     * myself, and if the destination file is newer, then don't even add the 'compile' task.
     */
    sTask = "compile/" + machineType;
    let srcFile = path.join(machineReleaseDir, machineUncompiledFile);
    let dstFile = path.join(machineReleaseDir, machineReleaseFile);
    try {
        let srcStat = fs.statSync(srcFile);
        let dstStat = fs.statSync(dstFile);
        let srcTime = new Date(srcStat.mtime);
        let dstTime = new Date(dstStat.mtime);
        if (dstTime > srcTime) sTask = "";
    } catch(err) {
        // console.log(err.message);
    }
    if (sTask) {
        aCompileTasks.push(sTask);
        gulp.task(sTask, ["make/" + machineType], function() {
            return gulp.src(srcFile /*, {base: './'} */)
                .pipe(sourcemaps.init())
                .pipe(closureCompiler({
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
                .pipe(sourcemaps.write('./'))                   // gulp-sourcemaps automatically adds the sourcemap url comment
                .pipe(gulp.dest(machineReleaseDir));
        });
    }
    sTask = "copy/" + machineType;
    aCopyTasks.push(sTask);
    gulp.task(sTask, function() {
        return gulp.src(machineFiles)
            .pipe(newer(machineReleaseDir))
            .pipe(replace(/(<xsl:variable name="APPCLASS">)[^<]*(<\/xsl:variable>)/g, '$1' + machineClass + '$2'))
            .pipe(replace(/(<xsl:variable name="APPNAME">)[^<]*(<\/xsl:variable>)/g, '$1' + machineName + '$2'))
            .pipe(replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + machineVersion + "$2"))
            .pipe(replace(/"[^"]*\/?(common.css|common.xsl|components.css|components.xsl|document.css|document.xsl)"/g, '"' + machineReleaseDir.substr(1) + '/$1"'))
            .pipe(replace(/[ \t]*\/\*[^*][\s\S]*?\*\//g, ""))
            .pipe(replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, ""))
            .pipe(gulp.dest(machineReleaseDir));
    });
});

gulp.task("make", aMakeTasks);

gulp.task("compile", aCompileTasks);

gulp.task("compile/devices", [
    "compile/leds",
    "compile/ti42",
    "compile/ti55",
    "compile/ti57"
]);

gulp.task("copy", aCopyTasks);

gulp.task("promote", function() {
    let baseDir = "./";
    return gulp.src(["apps/**/*.xml", "devices/**/*.xml", "disks/**/*.xml", "pubs/**/*.xml"], {base: baseDir})
        .pipe(newer(baseDir))
        .pipe(replace(/href="\/versions\/([^\/]*)\/[0-9\.]*\/(machine|manifest|outline)\.xsl"/g, 'href="/versions/$1/' + machines.shared.version + '/$2.xsl"'))
        .pipe(gulp.dest(baseDir));
});

gulp.task("default", function() {
    sequence(
        "make", "compile", "copy"
    );
});
