/**
 * @fileoverview Gruntfile for pcjs.org
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

"use strict";

/*
 * Overview
 * --------
 * Based on the specified version in package.json, we build a matching version folder in /versions
 * for each of the machine simulations; each of those folders in turn receives compiled versions of
 * the corresponding machine simulation scripts (c1p*.js and pc*.js), along with copies of both the
 * shared and machine-specific CSS and XSL stylesheets that the scripts rely on.
 *
 * Usage
 * -----
 *      grunt [task[:target] ...] [--rebuild]
 *
 * If no tasks are specified, the "default" task alias will be run.  If --rebuild is present,
 * grunt will run the "closureCompiler" task (with closureCompiler.options.checkModified set
 * to false) followed by the "copy" task; otherwise, it will run the "closureCompiler" task
 * (with closureCompiler.options.checkModified set to true) followed by the "newer:copy" task.
 *
 * The former insures that all files are recompiled and recopied, while the latter only recompiles
 * and/or recopies those files whose "src" file(s) are newer than the corresponding "dest" file(s).
 *
 * The combination of "grunt-contrib-copy" and "grunt-newer" could have possibly been replaced
 * by "grunt-rsync", except that the latter didn't seem to support "process" functions; however,
 * it's also possible I didn't have it configured properly at the time.
 *
 * Utility Tasks
 * -------------
 *      grunt compile:      runs "closureCompiler" to produce compiled c1p*.js and pc*.js scripts
 *      grunt nocompile:    runs "concat" to produce uncompiled c1p*.js and pc*.js scripts
 *      grunt promote:      runs "replace" to promote all machine XML files to the current version
 *
 * The "grunt nocompile" task is intended for debugging only; if you use it, be sure to run
 * a final "grunt compile" (or "grunt --rebuild") and retest before pushing out a new release.
 *
 * The "manifester" Task
 * ---------------------
 * I added the "manifester" task to process manifest.xml files, which I use to record the existence
 * application archives.  "manifester" walks all the manifests and verifies that they're still valid,
 * and optionally fetches local copies of everything described.
 *
 * The "prepjs" Task
 * -----------------
 * I added the "prepjs" task to perform the same constant inlining that my old PHP script "inline.php"
 * used to do as part of the old "jsmachines.net" build process.  Unfortunately, Grunt appears to be
 * a real memory hog, and so "prepjs" had to be disabled until I could resolve that issue (see my notes
 * in "modules/grunts/prepjs/tasks/prepjs.js" for details).
 *
 * With the current version of the Closure Compiler, I don't see any measurable performance benefit
 * to doing my own inlining, but I still wanted to port the code, partly in case I discover some benefit
 * down the road (or if I think of some other pre-processing I'd like to incorporate), and partly for
 * the experience of writing my own Grunt task -- an experience I didn't find all that pleasant, due to
 * the weak documentation and unfortunate memory constraints.
 *
 * To integrate "prepjs" back into the build process, add it to the "default" task, and change the
 * "closureCompiler" task to compile the inlined code in "/tmp" (the "/tmp" folder structure mirrors
 * the "/versions" folder structure).
 */

var path = require("path");

module.exports = function(grunt) {
    /*
     * I could have added this to the top of the file instead:
     *
     *      require("./package.json");
     *
     * but the following seems more "grunt-like".  It's also more traditional to pass
     * the package.json properties to grunt.initConfig() via a "pkg" property, like so:
     *
     *      pkg: grunt.file.readJSON("package.json");
     *
     * and then use grunt template strings such as:
     *
     *      "<%= pkg.name %>"
     *
     * which would be fine for most of my needs, but some of the information I need
     * from the package.json is not in string form (eg, machines['pcx86']['files'], which
     * is an array of file names).  So I create a "pkg" variable first, which allows me
     * to do both.
     */

    /**
     * @class
     * @property {string} name
     * @property {string} version
     * @property {Object} machines
     * @property {Array.<string>} closureCompilerExterns
     */
    var pkg = grunt.file.readJSON("package.json");

    var tmpC1P    = "./versions/c1pjs/"  + pkg.version + "/c1p-uncompiled.js";
    var tmpPCx86  = "./versions/pcx86/"  + pkg.version + "/pcx86-uncompiled.js";
    var tmpPC8080 = "./versions/pc8080/" + pkg.version + "/pc8080-uncompiled.js";
    var tmpPDP10  = "./versions/pdpjs/"  + pkg.version + "/pdp10-uncompiled.js";
    var tmpPDP11  = "./versions/pdpjs/"  + pkg.version + "/pdp11-uncompiled.js";

    grunt.initConfig({
        pkg: pkg,               // pass the "package.json" object to initConfig() as a property, too
        manifester: {
            options: {
            },
            "apps": {
                src: "./apps/**/manifest.xml"
            }
        },
        concat: {
            options: {
                // separator: ';'
            },
            "c1p.js": {
                src: pkg.machines['c1p']['files'],
                dest: "./versions/c1pjs/" + pkg.version + "/c1p.js",
                options: {
                    process: function(src, filepath) {
                        return (path.basename(filepath) == "debugger.js"? "" : src);
                    }
                }
            },
            "c1p-dbg.js": {
                src: pkg.machines['c1p']['files'],
                dest: "./versions/c1pjs/" + pkg.version + "/c1p-dbg.js"
            },
            "pcx86.js": {
                src: pkg.machines['pcx86']['files'],
                dest: "./versions/pcx86/" + pkg.version + "/pcx86.js",
                options: {
                    process: function(src, filepath) {
                        return (path.basename(filepath) == "debugger.js"? "" : src);
                    }
                }
            },
            "pcx86-dbg.js": {
                src: pkg.machines['pcx86']['files'],
                dest: "./versions/pcx86/" + pkg.version + "/pcx86-dbg.js"
            },
            "pc8080.js": {
                src: pkg.machines['pc8080']['files'],
                dest: "./versions/pc8080/" + pkg.version + "/pc8080.js",
                options: {
                    process: function(src, filepath) {
                        return (path.basename(filepath) == "debugger.js"? "" : src);
                    }
                }
            },
            "pc8080-dbg.js": {
                src: pkg.machines['pc8080']['files'],
                dest: "./versions/pc8080/" + pkg.version + "/pc8080-dbg.js"
            },
            "pdp10.js": {
                src: pkg.machines['pdp10']['files'],
                dest: "./versions/pdpjs/" + pkg.version + "/pdp10.js",
                options: {
                    process: function(src, filepath) {
                        return (path.basename(filepath) == "debugger.js"? "" : src);
                    }
                }
            },
            "pdp10-dbg.js": {
                src: pkg.machines['pdp10']['files'],
                dest: "./versions/pdpjs/" + pkg.version + "/pdp10-dbg.js"
            },
            "pdp11.js": {
                src: pkg.machines['pdp11']['files'],
                dest: "./versions/pdpjs/" + pkg.version + "/pdp11.js",
                options: {
                    process: function(src, filepath) {
                        return (path.basename(filepath) == "debugger.js"? "" : src);
                    }
                }
            },
            "pdp11-dbg.js": {
                src: pkg.machines['pdp11']['files'],
                dest: "./versions/pdpjs/" + pkg.version + "/pdp11-dbg.js"
            },
            "tmp-c1pjs": {
                src: pkg.machines['c1p']['files'],
                dest: tmpC1P,
                options: {
                    banner: '"use strict";\n\n',
                    process: function(src, filepath) {
                        return "/**\n * @copyright " + filepath.replace(/^\./, "http://pcjs.org") + " (C) Jeff Parsons 2012-2017\n */\n\n" +
                            src.replace(/(^|\n)[ \t]*(['"])use strict\2;?/g, '')
                               .replace(/^(import|export)[ \t]+[^\n]*\n/gm, '')
                               .replace(/^[ \t]*var\s+\S+\s*=\s*require\((['"]).*?\1\);/gm, '')
                               .replace(/^[ \t]*(if\s+\(NODE\)\s*|)module\.exports\s*=\s*\S+;/gm, '')
                               .replace(/\/\*\*\s*\*\s*@fileoverview[\s\S]*?\*\/\s*/g, '')
                               .replace(/[ \t]*if\s*\(NODE\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, '')
                               .replace(/[ \t]*if\s*\(typeof\s+module\s*!==\s*(['"])undefined\1\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, '')
                               .replace(/[ \t]*[A-Za-z_][A-Za-z0-9_.]*\.assert\([^\n]*\);[^\n]*/g, '');
                    }
                }
            },
            "tmp-pcx86": {
                src: pkg.machines['pcx86']['files'],
                dest: tmpPCx86,
                options: {
                    banner: '"use strict";\n\n',
                    process: function(src, filepath) {
                        return "/**\n * @copyright " + filepath.replace(/^\./, "http://pcjs.org") + " (C) Jeff Parsons 2012-2017\n */\n\n" +
                            src.replace(/(^|\n)[ \t]*(['"])use strict\2;?/g, '')
                               .replace(/^(import|export)[ \t]+[^\n]*\n/gm, '')
                               .replace(/^[ \t]*var\s+\S+\s*=\s*require\((['"]).*?\1\);/gm, '')
                               .replace(/^[ \t]*(if\s+\(NODE\)\s*|)module\.exports\s*=\s*\S+;/gm, '')
                               .replace(/\/\*\*\s*\*\s*@fileoverview[\s\S]*?\*\/\s*/g, '')
                               .replace(/[ \t]*if\s*\(NODE\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, '')
                               .replace(/[ \t]*if\s*\(typeof\s+module\s*!==\s*(['"])undefined\1\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, '')
                               .replace(/[ \t]*[A-Za-z_][A-Za-z0-9_.]*\.assert\([^\n]*\);[^\n]*/g, '');
                    }
                }
            },
            "tmp-pc8080": {
                src: pkg.machines['pc8080']['files'],
                dest: tmpPC8080,
                options: {
                    banner: '"use strict";\n\n',
                    process: function(src, filepath) {
                        return "/**\n * @copyright " + filepath.replace(/^\./, "http://pcjs.org") + " (C) Jeff Parsons 2012-2017\n */\n\n" +
                            src.replace(/(^|\n)[ \t]*(['"])use strict\2;?/g, '')
                               .replace(/^(import|export)[ \t]+[^\n]*\n/gm, '')
                               .replace(/^[ \t]*var\s+\S+\s*=\s*require\((['"]).*?\1\);/gm, '')
                               .replace(/^[ \t]*(if\s+\(NODE\)\s*|)module\.exports\s*=\s*\S+;/gm, '')
                               .replace(/\/\*\*\s*\*\s*@fileoverview[\s\S]*?\*\/\s*/g, '')
                               .replace(/[ \t]*if\s*\(NODE\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, '')
                               .replace(/[ \t]*if\s*\(typeof\s+module\s*!==\s*(['"])undefined\1\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, '')
                               .replace(/[ \t]*[A-Za-z_][A-Za-z0-9_.]*\.assert\([^\n]*\);[^\n]*/g, '');
                    }
                }
            },
            "tmp-pdp10": {
                src: pkg.machines['pdp10']['files'],
                dest: tmpPDP10,
                options: {
                    banner: '"use strict";\n\n',
                    process: function(src, filepath) {
                        return "/**\n * @copyright " + filepath.replace(/^\./, "http://pcjs.org") + " (C) Jeff Parsons 2012-2017\n */\n\n" +
                            src.replace(/(^|\n)[ \t]*(['"])use strict\2;?/g, '')
                                .replace(/^(import|export)[ \t]+[^\n]*\n/gm, '')
                                .replace(/^[ \t]*var\s+\S+\s*=\s*require\((['"]).*?\1\);/gm, '')
                                .replace(/^[ \t]*(if\s+\(NODE\)\s*|)module\.exports\s*=\s*\S+;/gm, '')
                                .replace(/\/\*\*\s*\*\s*@fileoverview[\s\S]*?\*\/\s*/g, '')
                                .replace(/[ \t]*if\s*\(NODE\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, '')
                                .replace(/[ \t]*if\s*\(typeof\s+module\s*!==\s*(['"])undefined\1\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, '')
                                .replace(/[ \t]*[A-Za-z_][A-Za-z0-9_.]*\.assert\([^\n]*\);[^\n]*/g, '');
                    }
                }
            },
            "tmp-pdp11": {
                src: pkg.machines['pdp11']['files'],
                dest: tmpPDP11,
                options: {
                    banner: '"use strict";\n\n',
                    process: function(src, filepath) {
                        return "/**\n * @copyright " + filepath.replace(/^\./, "http://pcjs.org") + " (C) Jeff Parsons 2012-2017\n */\n\n" +
                            src.replace(/(^|\n)[ \t]*(['"])use strict\2;?/g, '')
                               .replace(/^(import|export)[ \t]+[^\n]*\n/gm, '')
                               .replace(/^[ \t]*var\s+\S+\s*=\s*require\((['"]).*?\1\);/gm, '')
                               .replace(/^[ \t]*(if\s+\(NODE\)\s*|)module\.exports\s*=\s*\S+;/gm, '')
                               .replace(/\/\*\*\s*\*\s*@fileoverview[\s\S]*?\*\/\s*/g, '')
                               .replace(/[ \t]*if\s*\(NODE\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, '')
                               .replace(/[ \t]*if\s*\(typeof\s+module\s*!==\s*(['"])undefined\1\)\s*({[^}]*}|[^\n]*)(\n|$)/gm, '')
                               .replace(/[ \t]*[A-Za-z_][A-Za-z0-9_.]*\.assert\([^\n]*\);[^\n]*/g, '');
                    }
                }
            }
        },
        prepjs: {
            options: {
                includeObjectConstants: false,
                listConstants: true,
                replaceConstants: true
            },
            "c1p.js": {
                includeObjectConstants: true,
                src: pkg.machines['c1p']['files'],
                dest: tmpC1P
            },
            "pcx86.js": {
                src: pkg.machines['pcx86']['files'],
                dest: tmpPCx86
            },
            "pc8080.js": {
                src: pkg.machines['pc8080']['files'],
                dest: tmpPC8080
            },
            "pdp10.js": {
                src: pkg.machines['pdp10']['files'],
                dest: tmpPDP10
            },
            "pdp11.js": {
                src: pkg.machines['pdp11']['files'],
                dest: tmpPDP11
            }
        },
        closureCompiler: {
            options: {
                // [REQUIRED] Path to closure compiler
                compilerFile: "./bin/compiler.jar",

                // [OPTIONAL] set to true if you want to check if files were modified before starting compilation
                checkModified: !grunt.option("rebuild"),

                // [OPTIONAL] Set Closure Compiler Directives here
                compilerOpts: {
                    /*
                     * Keys will be used as directives for the compiler; values can be strings or arrays.
                     * If no value is required, use null.
                     *
                     * The directive 'externs' is treated as a special case, allowing a grunt file syntax (<config:...>, *)
                     */
                    compilation_level: "ADVANCED_OPTIMIZATIONS",
                    externs: pkg.closureCompilerExterns,
                    define: ["'SITEHOST=\"www.pcjs.org\"'", "'COMPILED=true'", "'DEBUG=false'"],
                    warning_level: "verbose",
                    language_in: "ES6",                 // this is now the default, just documenting our requirements
                    language_out: "ES5",                // this is also the default
                    // jscomp_off: ["checkTypes", "fileoverviewTags"],
                    // summary_detail_level: 3,
                    // formatting: "PRETTY_PRINT --debug",
                    output_wrapper: "\"(function(){%output%})();\""
                },

                // [OPTIONAL] Set exec method options
                execOpts: {
                    /*
                     * Set maxBuffer if you got message "Error: maxBuffer exceeded."
                     * Node default: 200*1024
                     */
                    // maxBuffer: 999999 * 1024
                },

                // [OPTIONAL] Java VM optimization options
                //
                // See: https://code.google.com/p/closure-compiler/wiki/FAQ#What_are_the_recommended_Java_VM_command-line_options?
                //
                // Setting one of these to 'true' is strongly recommended, and can reduce compile times by 50-80%
                // depending on compilation size and hardware.  On server-class hardware, such as with GitHub's Travis
                // hook, TieredCompilation should be used; on standard developer hardware, d32 may be better.
                //
                // Set as appropriate for your environment. Default for both is 'false'; do not set both to 'true'.
                d32: false,                     // will use 'java -client -d32 -jar compiler.jar'
                TieredCompilation: false        // will use 'java -server -XX:+TieredCompilation -jar compiler.jar'
            },
            "c1p.js": {
                /*
                 * [OPTIONAL] Here you can add new or override previous option of the Closure Compiler Directives.
                 *
                 * IMPORTANT! The feature is provided as a temporary solution to [Grunt Issue #738](https://github.com/gruntjs/grunt/issues/738).
                 * If/when that issue is fixed, this feature may be removed.
                 */
                TEMPcompilerOpts: {
                    create_source_map: "./versions/c1pjs/"  + pkg.version + "/c1p.map",
                    define: ["\"APPVERSION='" + pkg.version + "'\"", "DEBUGGER=false",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false"],
                    output_wrapper: "\"(function(){%output%})();//# sourceMappingURL=/versions/c1pjs/" + pkg.version + "/c1p.map\""
                 // output_wrapper: "\"(function(){%output%})();\""
                },
                // src: pkg.machines['c1p']['files'],
                src: tmpC1P,
                dest: "./versions/c1pjs/"  + pkg.version + "/c1p.js"
            },
            "c1p-dbg.js": {
                TEMPcompilerOpts: {
                    create_source_map: "./versions/c1pjs/"  + pkg.version + "/c1p-dbg.map",
                    define: ["\"APPVERSION='" + pkg.version + "'\"",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false"],
                    output_wrapper: "\"(function(){%output%})();//# sourceMappingURL=/versions/c1pjs/" + pkg.version + "/c1p-dbg.map\""
                 // output_wrapper: "\"(function(){%output%})();\""
                },
                // src: pkg.machines['c1p']['files'],
                src: tmpC1P,
                dest: "./versions/c1pjs/"  + pkg.version + "/c1p-dbg.js"
            },
            "pcx86.js": {
                TEMPcompilerOpts: {
                    create_source_map: "./versions/pcx86/"  + pkg.version + "/pcx86.map",
                    define: ["\"APPVERSION='" + pkg.version + "'\"", "DEBUGGER=false",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "BACKTRACK=false", "I386=true"],
                    output_wrapper: "\"(function(){%output%})();//# sourceMappingURL=/versions/pcx86/" + pkg.version + "/pcx86.map\""
                 // output_wrapper: "\"(function(){%output%})();\""
                },
                // src: pkg.machines['pcx86']['files'],
                src: tmpPCx86,
                dest: "./versions/pcx86/" + pkg.version + "/pcx86.js"
            },
            "pcx86-dbg.js": {
                /*
                 * Technically, this is the one case we don't need to override the default 'define' settings, but maybe it's best to be explicit.
                 */
                TEMPcompilerOpts: {
                    create_source_map: "./versions/pcx86/"  + pkg.version + "/pcx86-dbg.map",
                    define: ["\"APPVERSION='" + pkg.version + "'\"",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "BACKTRACK=false", "I386=true"],
                    output_wrapper: "\"(function(){%output%})();//# sourceMappingURL=/versions/pcx86/" + pkg.version + "/pcx86-dbg.map\""
                 // output_wrapper: "\"(function(){%output%})();\""
                },
                // src: pkg.machines['pcx86']['files'],
                src: tmpPCx86,
                dest: "./versions/pcx86/" + pkg.version + "/pcx86-dbg.js"
            },
            "pc8080.js": {
                TEMPcompilerOpts: {
                    create_source_map: "./versions/pc8080/"  + pkg.version + "/pc8080.map",
                    define: ["\"APPVERSION='" + pkg.version + "'\"",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "DEBUGGER=false"],
                    output_wrapper: "\"(function(){%output%})();//# sourceMappingURL=/versions/pc8080/" + pkg.version + "/pc8080.map\""
                 // output_wrapper: "\"(function(){%output%})();\""
                },
                // src: pkg.machines['pc8080']['files'],
                src: tmpPC8080,
                dest: "./versions/pc8080/" + pkg.version + "/pc8080.js"
            },
            "pc8080-dbg.js": {
                /*
                 * Technically, this is the one case we don't need to override the default 'define' settings, but maybe it's best to be explicit.
                 */
                TEMPcompilerOpts: {
                    create_source_map: "./versions/pc8080/"  + pkg.version + "/pc8080-dbg.map",
                    define: ["\"APPVERSION='" + pkg.version + "'\"",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "DEBUGGER=true"],
                    output_wrapper: "\"(function(){%output%})();//# sourceMappingURL=/versions/pc8080/" + pkg.version + "/pc8080-dbg.map\""
                 // output_wrapper: "\"(function(){%output%})();\""
                },
                // src: pkg.machines['pc8080']['files'],
                src: tmpPC8080,
                dest: "./versions/pc8080/" + pkg.version + "/pc8080-dbg.js"
            },
            "pdp10.js": {
                TEMPcompilerOpts: {
                    create_source_map: "./versions/pdpjs/"  + pkg.version + "/pdp10.map",
                    define: ["\"APPVERSION='" + pkg.version + "'\"",
                        "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "DEBUGGER=false"],
                    output_wrapper: "\"(function(){%output%})();//# sourceMappingURL=/versions/pdpjs/" + pkg.version + "/pdp10.map\""
                 // output_wrapper: "\"(function(){%output%})();\""
                },
                // src: pkg.machines['pdp10']['files'],
                src: tmpPDP10,
                dest: "./versions/pdpjs/" + pkg.version + "/pdp10.js"
            },
            "pdp10-dbg.js": {
                /*
                 * Technically, this is the one case we don't need to override the default 'define' settings, but maybe it's best to be explicit.
                 */
                TEMPcompilerOpts: {
                    create_source_map: "./versions/pdpjs/"  + pkg.version + "/pdp10-dbg.map",
                    define: ["\"APPVERSION='" + pkg.version + "'\"",
                        "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "DEBUGGER=true"],
                    output_wrapper: "\"(function(){%output%})();//# sourceMappingURL=/versions/pdpjs/" + pkg.version + "/pdp10-dbg.map\""
                 // output_wrapper: "\"(function(){%output%})();\""
                },
                // src: pkg.machines['pdp10']['files'],
                src: tmpPDP10,
                dest: "./versions/pdpjs/" + pkg.version + "/pdp10-dbg.js"
            },
            "pdp11.js": {
                TEMPcompilerOpts: {
                    create_source_map: "./versions/pdpjs/"  + pkg.version + "/pdp11.map",
                    define: ["\"APPVERSION='" + pkg.version + "'\"",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "DEBUGGER=false"],
                    output_wrapper: "\"(function(){%output%})();//# sourceMappingURL=/versions/pdpjs/" + pkg.version + "/pdp11.map\""
                 // output_wrapper: "\"(function(){%output%})();\""
                },
                // src: pkg.machines['pdp11']['files'],
                src: tmpPDP11,
                dest: "./versions/pdpjs/" + pkg.version + "/pdp11.js"
            },
            "pdp11-dbg.js": {
                /*
                 * Technically, this is the one case we don't need to override the default 'define' settings, but maybe it's best to be explicit.
                 */
                TEMPcompilerOpts: {
                    create_source_map: "./versions/pdpjs/"  + pkg.version + "/pdp11-dbg.map",
                    define: ["\"APPVERSION='" + pkg.version + "'\"",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "DEBUGGER=true"],
                    output_wrapper: "\"(function(){%output%})();//# sourceMappingURL=/versions/pdpjs/" + pkg.version + "/pdp11-dbg.map\""
                 // output_wrapper: "\"(function(){%output%})();\""
                },
                // src: pkg.machines['pdp11']['files'],
                src: tmpPDP11,
                dest: "./versions/pdpjs/" + pkg.version + "/pdp11-dbg.js"
            }
        },
        copy: {
            "c1pxsl": {
                files: [
                    {
                        cwd: "modules/shared/templates/",
                        src: ["common.css", "common.xsl", "document.css", "document.xsl", "machine.xsl", "manifest.xsl", "outline.xsl"],
                        dest: "versions/c1pjs/<%= pkg.version %>/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        var s = content.replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + pkg.version + "$2");
                        s = s.replace(/"[^"]*\/?(common.css|common.xsl|components.css|components.xsl|document.css|document.xsl)"/g, '"/versions/c1pjs/' + pkg.version + '/$1"');
                        s = s.replace(/[ \t]*\/\*[^*][\s\S]*?\*\//g, "").replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, "");
                        return s;
                    }
                }
            },
            "c1pjs": {
                files: [
                    {
                        cwd: "modules/c1pjs/templates/",
                        src: ["components.*"],
                        dest: "versions/c1pjs/<%= pkg.version %>/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        var s = content.replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + pkg.version + "$2");
                        s = s.replace(/[ \t]*\/\*[^*][\s\S]*?\*\//g, "").replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, "");
                        return s;
                    }
                }
            },
            "pcx86": {
                files: [
                    {
                        cwd: "modules/shared/templates/",
                        src: ["common.css", "common.xsl", "components.*", "document.css", "document.xsl", "machine.xsl", "manifest.xsl", "outline.xsl"],
                        dest: "versions/pcx86/<%= pkg.version %>/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        var s = content.replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + pkg.version + "$2");
                        s = s.replace(/"[^"]*\/?(common.css|common.xsl|components.css|components.xsl|document.css|document.xsl)"/g, '"/versions/pcx86/' + pkg.version + '/$1"');
                        s = s.replace(/[ \t]*\/\*[^*][\s\S]*?\*\//g, "").replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, "");
                        return s;
                    }
                }
            },
            "pc8080": {
                files: [
                    {
                        cwd: "modules/shared/templates/",
                        src: ["common.css", "common.xsl", "components.*", "document.css", "document.xsl", "machine.xsl", "manifest.xsl", "outline.xsl"],
                        dest: "versions/pc8080/<%= pkg.version %>/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        var s = content.replace(/(<xsl:variable name="APPCLASS">)[^<]*(<\/xsl:variable>)/g, "$1pc8080$2");
                        s = s.replace(/(<xsl:variable name="APPNAME">)[^<]*(<\/xsl:variable>)/g, "$1PC8080$2");
                        s = s.replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + pkg.version + "$2");
                        s = s.replace(/"[^"]*\/?(common.css|common.xsl|components.css|components.xsl|document.css|document.xsl)"/g, '"/versions/pc8080/' + pkg.version + '/$1"');
                        s = s.replace(/[ \t]*\/\*[^*][\s\S]*?\*\//g, "").replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, "");
                        return s;
                    }
                }
            },
            "pdp10": {
                files: [
                    {
                        cwd: "modules/shared/templates/",
                        src: ["common.css", "common.xsl", "components.*", "document.css", "document.xsl", "machine.xsl", "manifest.xsl", "outline.xsl"],
                        dest: "versions/pdpjs/<%= pkg.version %>/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        var s = content.replace(/(<xsl:variable name="APPCLASS">)[^<]*(<\/xsl:variable>)/g, "$1pdp10$2");
                        s = s.replace(/(<xsl:variable name="APPNAME">)[^<]*(<\/xsl:variable>)/g, "$1PDPjs$2");
                        s = s.replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + pkg.version + "$2");
                        s = s.replace(/"[^"]*\/?(common.css|common.xsl|components.css|components.xsl|document.css|document.xsl)"/g, '"/versions/pdpjs/' + pkg.version + '/$1"');
                        s = s.replace(/[ \t]*\/\*[^*][\s\S]*?\*\//g, "").replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, "");
                        return s;
                    }
                }
            },
            "pdp11": {
                files: [
                    {
                        cwd: "modules/shared/templates/",
                        src: ["common.css", "common.xsl", "components.*", "document.css", "document.xsl", "machine.xsl", "manifest.xsl", "outline.xsl"],
                        dest: "versions/pdpjs/<%= pkg.version %>/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        var s = content.replace(/(<xsl:variable name="APPCLASS">)[^<]*(<\/xsl:variable>)/g, "$1pdp11$2");
                        s = s.replace(/(<xsl:variable name="APPNAME">)[^<]*(<\/xsl:variable>)/g, "$1PDPjs$2");
                        s = s.replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + pkg.version + "$2");
                        s = s.replace(/"[^"]*\/?(common.css|common.xsl|components.css|components.xsl|document.css|document.xsl)"/g, '"/versions/pdpjs/' + pkg.version + '/$1"');
                        s = s.replace(/[ \t]*\/\*[^*][\s\S]*?\*\//g, "").replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, "");
                        return s;
                    }
                }
            },
            "examples": {
                files: [
                    {
                        cwd: "versions/pcx86/<%= pkg.version %>/",
                        src: ["pcx86.js", "pcx86-dbg.js", "components.css", "components.xsl"],
                        dest: "apps/pcx86/examples/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        return content.replace(/\/versions\/\{\$APPCLASS}\/\{\$APPVERSION}\//g, "");
                    }
                }
            },
            "manifests": {
                files: [
                    {
                        cwd: "disks/pcx86/",
                        src: ["library.xml", "samples.xml", "shareware/pcsig08/pcsig08.xml", "private/library.xml"],
                        dest: "disks/pcx86/compiled/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        /*
                         * This function mimics what components.xsl normally does for disk manifests referenced
                         * by the FDC machine component.  Compare it to the following template in components.xsl:
                         * 
                         *      <xsl:template match="manifest[not(@ref)]" mode="component">
                         * 
                         * This code is not perfect (it doesn't process "link" attributes, for example, which is why
                         * we've left machines that use the samples.xml disk library alone), but for machines that use
                         * library.xml, having them use compiled/library.xml instead speeds up loading significantly.
                         * 
                         * Granted, after the first machine has fetched all the individual manifest files, your
                         * browser should do a reasonably good job using cached copies for all subsequent machines,
                         * but even then, there's still a noticeable delay.
                         */
                        var contentOrig = content;
                        var reManifest = /([ \t]*)<manifest.*? ref="(.*?)".*?\/>/g, matchManifest;
                        while ((matchManifest = reManifest.exec(contentOrig))) {
                            var sFile = matchManifest[2];
                            var sManifest = grunt.file.read(path.join('.', sFile));
                            if (!sManifest) continue;
                            var sPrefix = "", sDefaultName = "Unknown", match;
                            match = sManifest.match(/<title(?: prefix="(.*?)"|)[^>]*>(.*?)<\/title>/);
                            if (match) {
                                sPrefix = match[1];
                                sDefaultName = match[2];
                                match = sManifest.match(/<version.*?>(.*?)<\/version>/);
                                if (match) sDefaultName += ' ' + match[1];
                            }
                            var reDisk, matchDisk, sDisks = "";
                            reDisk = /<disk.*? href="([^"]*)".*?\/>/g;
                            while ((matchDisk = reDisk.exec(sManifest))) {
                                if (sDisks) sDisks += "\n";
                                sDisks += matchManifest[1] + "<disk path=\"" + matchDisk[1] + "\">" + sDefaultName + "</disk>";
                            }
                            reDisk = /<disk.*? href="([^"]*)".*?>([\S\s]*?)<\/disk>/g;
                            while ((matchDisk = reDisk.exec(sManifest))) {
                                if (sDisks) sDisks += "\n";
                                var matchName = matchDisk[2].match(/<name.*?>(.*?)<\/name>/);
                                var sName = matchName? ((sPrefix? sPrefix + ": " : "") + matchName[1]) : sDefaultName;
                                sDisks += matchManifest[1] + "<disk path=\"" + matchDisk[1] + "\">" + sName + "</disk>";
                            }
                            content = content.replace(matchManifest[0], sDisks);
                        }
                        return content;
                    }
                }
            }
        },
        run: {
            "delete-indexes": {
                options: {cwd: "."},
                cmd: "./modules/htmlout/bin/delete_indexes.sh",
                args: []
            },
            "zip-examples": {
                options: {cwd: "apps/pcx86/examples"},
                cmd: "./zip.sh",
                args: ["v" + pkg.version + ".zip"]
            }
        },
        replace: {
            "fix-source-maps": {
                src: [
                    "./versions/c1pjs/" + pkg.version + "/c1p*.map",
                    "./versions/pcx86/" + pkg.version + "/pc*.map",
                    "./versions/pcx8008/" + pkg.version + "/pc*.map",
                    "./versions/pdpjs/" + pkg.version + "/pdp*.map"
                ],
                overwrite: true,
                replacements: [
                    {
                        from: /"sources":\s*\["\.\/versions\//g,
                        to: '"sources":["/versions/'
                    }
                ]
            },
            "promote-to-version": {
                src: ["apps/**/*.xml", "devices/**/*.xml", "disks/**/*.xml", "pubs/**/*.xml"],
                overwrite: true,
                replacements: [
                    {
                        from: /href="\/versions\/([^\/]*)\/[0-9\.]*\/(machine|manifest|outline)\.xsl"/g,
                        to: 'href="/versions/$1/<%= pkg.version %>/$2.xsl"'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-closure-tools");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-newer");
    grunt.loadNpmTasks("grunt-run");
    grunt.loadNpmTasks("grunt-text-replace");
    
 // grunt.loadTasks("modules/grunts/manifester/tasks");
    
    grunt.loadTasks("modules/grunts/prepjs/tasks");

    grunt.registerTask("preCompiler", grunt.option("rebuild")? ["concat:tmp-c1pjs", "concat:tmp-pcx86", "concat:tmp-pc8080", "concat:tmp-pdp10", "concat:tmp-pdp11"] : ["newer:concat:tmp-c1pjs", "newer:concat:tmp-pcx86", "newer:concat:tmp-pc8080", "newer:concat:tmp-pdp10", "newer:concat:tmp-pdp11"]);

    grunt.registerTask("compile", ["preCompiler", "closureCompiler", "replace:fix-source-maps"]);

    grunt.registerTask('nocompile', function(target) {
        if (!target) {
            grunt.task.run(["concat:c1p.js", "concat:c1p-dbg.js", "concat:pcx86.js", "concat:pcx86-dbg.js"]);
        } else {
            grunt.task.run("concat:" + target);
        }
    });
    grunt.registerTask("promote", ["replace:promote-to-version"]);
    grunt.registerTask("clean", ["run:delete-indexes"]);
    grunt.registerTask("copyfiles", grunt.option("rebuild")? ["copy"] : ["newer:copy"]);
    grunt.registerTask("default-osx", ["compile", "copyfiles", "run:zip-examples"]);
    grunt.registerTask("default", ["compile", "copyfiles"]);
};
