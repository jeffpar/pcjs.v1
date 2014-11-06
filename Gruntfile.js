/**
 * @fileoverview Gruntfile for pcjs.org
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 * @version 1.0
 * Created 2014-03-11
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of the JavaScript Machines Project (aka JSMachines) at <http://jsmachines.net/>
 * and <http://pcjs.org/>.
 *
 * JSMachines is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * JSMachines is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with JSMachines.
 * If not, see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some JSMachines files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * JSMachines Project for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

/*
 * Overview
 * ---
 * Based on the specified version in package.json, we build a matching version
 * folder in /versions for each of the machine simulations; each of those folders
 * in turn receives compiled versions of the corresponding machine simulation scripts
 * (c1p*.js and pc*.js), along with copies of both the shared and machine-specific
 * CSS and XSL stylesheets that the scripts rely on.
 *
 * Usage
 * ---
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
 * ---
 *      grunt compile:      runs "closureCompiler" to produce compiled c1p*.js and pc*.js scripts
 *      grunt nocompile:    runs "concat" to produce uncompiled c1p*.js and pc*.js scripts
 *      grunt promote:      runs "replace" to promote all machine XML files to the current version
 *
 * The "grunt nocompile" task is intended for debugging only; if you use it, be sure to run
 * a final "grunt compile" (or "grunt --rebuild") and retest before pushing out a new release.
 *
 * The "manifester" Task
 * ---
 * I added the "manifester" task to process manifest.xml files, which I use to record the existence
 * application archives.  "manifester" walks all the manifests and verifies that they're still valid,
 * and optionally fetches local copies of everything described.
 *
 * The "prepjs" Task
 * ---
 * I added the "prepjs" task to perform the same constant inlining that my old PHP script "inline.php"
 * used to do as part of the old "jsmachines.net" build process.  Unfortunately, Grunt appears to be
 * a real memory hog, and so "prepjs" had to be disabled until I could resolve that issue (see my notes
 * in "my_modules/grunts/prepjs/tasks/prepjs.js" for details).
 *
 * With the current version of the Closure Compiler, I don't see any measurable performance benefit
 * to doing my own inlining, but I still wanted to port the code, partly in case I discover some benefit
 * down the road (or if I think of some other pre-processing I'd like to incorporate), and partly for
 * the experience of writing my own Grunt task -- an experience I didn't find all that pleasant, due to
 * the weak documentation and unfortunate memory constraints.
 *
 * To integrate "prepjs" back into the build process, add it to the "default" task, and change the
 * "closureCompiler" task to compile the inlined code in "/tmp/(c1pjs|pcjs)/...".  The "/tmp" folder
 * structure mirrors the "/versions" folder structure.
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
     * from the package.json is not in string form (eg, pcJSFiles, which is an array of
     * file names).  So I create a "pkg" variable first, which allows me to do both.
     */

    /**
     * @class
     * @property {string} name
     * @property {string} version
     * @property {Array.<string>} c1pJSFiles
     * @property {Array.<string>} pcJSFiles
     * @property {Array.<string>} closureCompilerExterns
     */
    var pkg = grunt.file.readJSON("package.json");

    var tmpC1Pjs = "./tmp/c1pjs/" + pkg.version + "/c1p.js";
    var tmpPCjs = "./tmp/pcjs/" + pkg.version + "/pc.js";

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
                src: pkg.c1pJSFiles,
                dest: "./versions/c1pjs/" + pkg.version + "/c1p.js",
                options: {
                    process: function(src, filepath) {
                        return (path.basename(filepath) == "debugger.js"? "" : src);
                    }
                }
            },
            "c1p-dbg.js": {
                src: pkg.c1pJSFiles,
                dest: "./versions/c1pjs/" + pkg.version + "/c1p-dbg.js"
            },
            "pc.js": {
                src: pkg.pcJSFiles,
                dest: "./versions/pcjs/" + pkg.version + "/pc.js",
                options: {
                    process: function(src, filepath) {
                        return (path.basename(filepath) == "debugger.js"? "" : src);
                    }
                }
            },
            "pc-dbg.js": {
                src: pkg.pcJSFiles,
                dest: "./versions/pcjs/" + pkg.version + "/pc-dbg.js"
            },
            "tmp-c1pjs": {
                src: pkg.c1pJSFiles,
                dest: tmpC1Pjs,
                options: {
                    banner: '"use strict";\n\n',
                    process: function(src, filepath) {
                        return "// " + filepath + "\n\n" +
                            src.replace(/(^|\n)[ \t]*(['"])use strict\2;?\s*/g, '$1').replace(/[ \t]*if\s*\(typeof\s+(module|APP_PCJS)\s*!==\s*(['"])undefined\2\)\s*(\{[^}]*}|[^\n]*)(\n|$)/gm, '');
                    }
                }
            },
            "tmp-pcjs": {
                src: pkg.pcJSFiles,
                dest: tmpPCjs,
                options: {
                    banner: '"use strict";\n\n',
                    process: function(src, filepath) {
                        return "// " + filepath + "\n\n" +
                            src.replace(/(^|\n)[ \t]*(['"])use strict\2;?\s*/g, '$1').replace(/[ \t]*if\s*\(typeof\s+(module|APP_PCJS)\s*!==\s*(['"])undefined\2\)\s*(\{[^}]*}|[^\n]*)(\n|$)/gm, '');
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
                src: pkg.c1pJSFiles,
                dest: tmpC1Pjs
            },
            "pc.js": {
                src: pkg.pcJSFiles,
                dest: tmpPCjs
            }
        },
        closureCompiler: {
            options: {
                // [REQUIRED] Path to closure compiler
                compilerFile: "./bin/compiler.jar",

                // [OPTIONAL] set to true if you want to check if files were modified before starting compilation
                checkModified: grunt.option("rebuild")? false : true,

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
                    define: ["'SITEHOST=\"www.pcjs.org\"'", "'COMPILED=true'", "'DEBUG=false'", "'MAXDEBUG=false'"],
                    warning_level: "verbose",
                    // jscomp_off: ["checkTypes", "fileoverviewTags"],
                    // summary_detail_level: 3,
                    // formatting: "PRETTY_PRINT --debug",
                    output_wrapper: "'(function(){%output%})();'"
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
                    // create_source_map: "./tmp/c1pjs/"  + pkg.version + "/c1p.map",
                    define: ["\"APPNAME='C1Pjs'\"", "\"APPVERSION='" + pkg.version + "'\"", "DEBUGGER=false",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "MAXDEBUG=false"],
                    // output_wrapper: "'(function(){%output%})();//@ sourceMappingURL=/tmp/c1pjs/" + pkg.version + "/c1p.map'"
                    output_wrapper: "'(function(){%output%})();'"
                },
                // src: pkg.c1pJSFiles,
                src: tmpC1Pjs,
                dest: "./versions/c1pjs/"  + pkg.version + "/c1p.js"
            },
            "c1p-dbg.js": {
                TEMPcompilerOpts: {
                    // create_source_map: "./tmp/c1pjs/"  + pkg.version + "/c1p-dbg.map",
                    define: ["\"APPNAME='C1Pjs'\"", "\"APPVERSION='" + pkg.version + "'\"",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "MAXDEBUG=false"],
                    // output_wrapper: "'(function(){%output%})();//@ sourceMappingURL=/tmp/c1pjs/" + pkg.version + "/c1p-dbg.map'"
                    output_wrapper: "'(function(){%output%})();'"
                },
                // src: pkg.c1pJSFiles,
                src: tmpC1Pjs,
                dest: "./versions/c1pjs/"  + pkg.version + "/c1p-dbg.js"
            },
            "pc.js": {
                TEMPcompilerOpts: {
                    // create_source_map: "./tmp/pcjs/"  + pkg.version + "/pc.map",
                    define: ["\"APPNAME='PCjs'\"", "\"APPVERSION='" + pkg.version + "'\"", "DEBUGGER=false",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "MAXDEBUG=false"],
                    // output_wrapper: "'(function(){%output%})();//@ sourceMappingURL=/tmp/pcjs/" + pkg.version + "/pc.map'"
                    output_wrapper: "'(function(){%output%})();'"
                },
                // src: pkg.pcJSFiles,
                src: tmpPCjs,
                dest: "./versions/" + pkg.name + "/" + pkg.version + "/pc.js"
            },
            "pc-dbg.js": {
                /*
                 * Technically, this is the one case we don't need to override the default 'define' settings, but maybe it's best to be explicit.
                 */
                TEMPcompilerOpts: {
                    // create_source_map: "./tmp/pcjs/"  + pkg.version + "/pc-dbg.map",
                    define: ["\"APPNAME='PCjs'\"", "\"APPVERSION='" + pkg.version + "'\"",
                             "\"SITEHOST='www.pcjs.org'\"", "COMPILED=true", "DEBUG=false", "MAXDEBUG=false"],
                    // output_wrapper: "'(function(){%output%})();//@ sourceMappingURL=/tmp/pcjs/" + pkg.version + "/pc-dbg.map'"
                    output_wrapper: "'(function(){%output%})();'"
                },
                // src: pkg.pcJSFiles,
                src: tmpPCjs,
                dest: "./versions/" + pkg.name + "/" + pkg.version + "/pc-dbg.js"
            }
        },
        copy: {
            "c1pxsl": {
                files: [
                    {
                        cwd: "./my_modules/shared/templates/",
                        src: ["common.css", "common.xsl", "document.css", "document.xsl", "machine.xsl", "manifest.xsl", "outline.xsl"],
                        dest: "versions/c1pjs/<%= pkg.version %>/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        var s = content.replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + pkg.version + "$2");
                        s = s.replace(/"[^"]*\/?(common.css|common.xsl|components.css|components.xsl|document.css|document.xsl)"/g, '"/versions/c1pjs/' + pkg.version + '/$1"');
                        s = s.replace(/[ \t]*\/\*[^\*][\s\S]*?\*\//g, "").replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, "");
                        return s;
                    }
                }
            },
            "pcxsl": {
                files: [
                    {
                        cwd: "./my_modules/shared/templates/",
                        src: ["common.css", "common.xsl", "document.css", "document.xsl", "machine.xsl", "manifest.xsl", "outline.xsl"],
                        dest: "versions/pcjs/<%= pkg.version %>/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        var s = content.replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + pkg.version + "$2");
                        s = s.replace(/"[^"]*\/?(common.css|common.xsl|components.css|components.xsl|document.css|document.xsl)"/g, '"/versions/pcjs/' + pkg.version + '/$1"');
                        s = s.replace(/[ \t]*\/\*[^\*][\s\S]*?\*\//g, "").replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, "");
                        return s;
                    }
                }
            },
            "c1pjs": {
                files: [
                    {
                        cwd: "./my_modules/c1pjs-client/templates/",
                        src: ["components.*"],
                        dest: "versions/c1pjs/<%= pkg.version %>/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        var s = content.replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + pkg.version + "$2");
                        s = s.replace(/[ \t]*\/\*[^\*][\s\S]*?\*\//g, "").replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, "");
                        return s;
                    }
                }
            },
            "pcjs": {
                files: [
                    {
                        cwd: "./my_modules/pcjs-client/templates/",
                        src: ["components.*"],
                        dest: "versions/pcjs/<%= pkg.version %>/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        var s = content.replace(/(<xsl:variable name="APPVERSION">)[^<]*(<\/xsl:variable>)/g, "$1" + pkg.version + "$2");
                        s = s.replace(/[ \t]*\/\*[^\*][\s\S]*?\*\//g, "").replace(/[ \t]*<!--[^@]*?-->[ \t]*\n?/g, "");
                        return s;
                    }
                }
            },
            "demos": {
                files: [
                    {
                        cwd: "versions/pcjs/<%= pkg.version %>/",
                        src: ["pc.js", "pc-dbg.js", "components.css", "components.xsl"],
                        dest: "docs/pcjs/demos/",
                        expand: true
                    }
                ],
                options: {
                    process: function(content, srcPath) {
                        return content.replace(/\/versions\/\{\$APPCLASS}\/\{\$APPVERSION}\//g, "");
                    }
                }
            }
        },
        run: {
            "delete_indexes": {
                options: {cwd: "."},
                cmd: "./my_modules/htmlout/bin/delete_indexes.sh",
                args: []
            },
            "zipify_demos": {
                options: {cwd: "docs/pcjs/demos"},
                cmd: "./zip.sh",
                args: ["v" + pkg.version + ".zip"]
            }
        },
        replace: {
            "fix_source_maps": {
                src: ["./tmp/c1pjs/" + pkg.version + "/c1p*.map", "./tmp/pcjs/" + pkg.version + "/pc*.map"],
                overwrite: true,
                replacements: [
                    {
                        from: /"sources":\s*\["\.\/tmp\//g,
                        to: '"sources":["/tmp/'
                    }
                ]
            },
            "promote_to_version": {
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

    grunt.loadTasks("my_modules/grunts/manifester/tasks");
    grunt.loadTasks("my_modules/grunts/prepjs/tasks");

    grunt.registerTask("preCompiler", grunt.option("rebuild")? ["concat:tmp-c1pjs", "concat:tmp-pcjs"] : ["newer:concat:tmp-c1pjs", "newer:concat:tmp-pcjs"]);

    grunt.registerTask("compile", ["preCompiler", "closureCompiler", "replace:fix_source_maps"]);

    grunt.registerTask('nocompile', function(target) {
        if (!target) {
            grunt.task.run(["concat:c1p.js", "concat:c1p-dbg.js", "concat:pc.js", "concat:pc-dbg.js"]);
        } else {
            grunt.task.run("concat:" + target);
        }
    });
    grunt.registerTask("promote", ["replace:promote_to_version"]);
    grunt.registerTask("clean", ["run:delete_indexes"]);
    grunt.registerTask("copyFiles", grunt.option("rebuild")? ["copy"] : ["newer:copy"]);
    grunt.registerTask("default-osx", ["compile", "copyFiles", "run:zipify_demos"]);
    grunt.registerTask("default", ["compile", "copyFiles"]);
};
