/**
 * @fileoverview Pre-process JavaScript file(s) with well-defined constants inlined
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 * @copyright © 2012-2018 Jeff Parsons
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
 * You are required to include the above copyright notice in every modified copy of this work
 * and to display that copyright notice when the software starts running; see COPYRIGHT in
 * <http://pcjs.org/modules/shared/lib/defines.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

/*
 * Options
 * ---
 * The 'includeObjectConstants' option allows replacement of constants defined within objects,
 * instead of only global constants. Use with caution, because constants defined within an object
 * scope may not be unique.  This does attempt to catch any constant collisions and completely
 * disable their replacement, but it's not foolproof.
 *
 * History
 * ---
 * Although we run all our code through Google's Closure Compiler, which does a great job of inlining
 * not only variables but also code to improve performance, JavaScript doesn't have the notion of
 * "constants", so we have to define all our constants as properties and simply trust that the Closure
 * Compiler will inline them all.  I'm not completely trusting, so I've created this script that allows
 * us to verify the compiler produces substantially the same code whether or not we inline all our
 * constants first.
 *
 * See "inline.php" for the original PHP version of this module.
 *
 * Conventions
 * ---
 * This script looks for global constant definitions of the form "Component.XXX = YYY;".
 *
 * The current approach requires all inlined constants to be defined as properties on the associated
 * class constructor (ie, as "class constants").  Life might be simpler if the Closure Compiler honored
 * "@const" references for properties, and who knows, perhaps the latest version does now; but on the
 * other hand, having my own convention relieves me from having to annotate every single constant with
 * a "@const" JSDoc tag.
 *
 * TODO: Update the C1Pjs sources to use class constants instead of "object constants", because in order
 * for C1Pjs to benefit from constant inlining, we must reply on the 'includeObjectConstants' option
 * (hack) to expand the contexts that constants may live in, which is inherently less safe.  Moreover,
 * that option prevents us from removing the original constant definitions, because constants like
 * "this.PORT_CRA" could be used in other contexts that this script will NOT catch (eg, "controller.PORT_CRA").
 *
 * TODO: Think about adding another quick hack to this tool, to convert all:
 *
 *      at-param {Debugger} dbg
 * to:
 *      at-param {Component} dbg
 *
 * prior to compilation.  The only reason I declared my "dbg" variables generically, as Component objects
 * rather than Debugger objects, was to work around compilation errors in the non-Debugger builds.
 *
 * Implementation
 * ---
 * This script uses a very simplistic replacement approach that doesn't perform any parsing, tokenizing
 * or other pre-processing of the source code, which would otherwise be required if we wanted to guarantee
 * that all our replacements precisely mirrored what JavaScript actually replaces at run-time.  For example,
 * JavaScript allows any so-called constant to be redefined at any point, and we don't attempt to catch
 * modifications.
 *
 * This is why it's important that we limit inlining to only those constants described above, and why such
 * constants must never be altered by the code using them.
 *
 * Debugging
 * ===
 * Use the following command to debug this task (after making Chrome your default browser):
 *
 *      node-debug $(which grunt) prepjs
 *
 * which required installing "node-inspector" first:
 *
 *      sudo npm install -g node-inspector
 *
 * You may also want to enable the heapdump code below, which required installing "heapdump" first:
 *
 *      npm install heapdump --save-dev
 *
 * TODO: Resolve once and for all the "process out of memory" error that occurs if we don't divide the src input
 * into smaller chunks.  See the WARNING below.
 */

'use strict';

// var heapdump = require("heapdump");

/**
 * compareConstants(a, b)
 *
 * @param {Array} a
 * @param {Array} b
 * @returns {number}
 */
var compareConstants = function(a, b)
{
    return b[0].length - a[0].length;
};

/**
 * indexOfConstant(sConstant, aConstants)
 *
 * @param {string} sConstant
 * @param {Array} aConstants
 * @returns {number} index of aConstants entry, or -1 if not found
 */
var indexOfConstant = function(sConstant, aConstants)
{
    for (var i = 0; i < aConstants.length; i++) {
        if (sConstant == aConstants[i][0]) {
            return i;
        }
    }
    return -1;
};

/**
 * findConstants(sInput)
 *
 * @param {string} sInput
 * @param {Array} aConstants
 * @param {boolean} fObjectConstants
 * @param {boolean} fReplaceConstants
 * @param {function} [fnLog]
 * @returns {string} modified input
 */
var findConstants = function(sInput, aConstants, fObjectConstants, fReplaceConstants, fnLog) {
    var sWarning = "";
    var sConstDef = "[A-Z][A-Za-z0-9_]*";
    if (fObjectConstants) {
        sConstDef = "(?:" + sConstDef + "|this)";
    }
    var aConstDef;
    var reConstDef = new RegExp("[ \t]*(" + sConstDef + "\\.[A-Z_][A-Z0-9_\\.]*)\\s*=\\s*(.*?)\\s*;[\t ]*(?://[^\n]*|)\n", "g");
    while (aConstDef = reConstDef.exec(sInput)) {
        var i;
        var sFind = aConstDef[1];
        var sReplace = aConstDef[2];
        if (fReplaceConstants && !fObjectConstants) {
            sInput = sInput.substr(0, aConstDef.index) + sInput.substr(aConstDef.index + aConstDef[0].length);
            reConstDef.lastIndex -= aConstDef[0].length;
        }
        if ((i = indexOfConstant(sFind, aConstants)) >= 0) {
            sWarning += "/*\n * warning: multiple definitions for '" + sFind + "' (" + sReplace + ")\n */\n";
            aConstants[i][2] = -1;      // set a negative replacement count to disable this constant definition
            continue;
        }
        /*
         * If the replacement string is entirely quoted, or parenthesized, or a single constant, then we can leave
         * the replacement string as-is; otherwise, let's wrap it with parentheses (we could probably wrap everything
         * with parentheses, but I like to avoid doing that whenever it's completely unnecessary).
         */
        if (!sReplace.match(/^["'\(].*["'\)]$/) && sReplace.match(/[^A-Za-z0-9\.]/)) {
            sReplace = "(" + sReplace + ")";
        }
        if (fnLog) {
            fnLog("found '" + sFind + "' => '" + sReplace + "'");
            /*
            if (sFind == "Video.CRT.CURSOR_END") {
                fnLog("here's where we usually run of memory (" + process.cwd() + ")");
                heapdump.writeSnapshot();
            }
            */
        }
        aConstants.push([sFind, sReplace, 0]);
    }
    if (sWarning) sInput = sWarning + sInput;
    return sInput;
};

/**
 * replaceConstants(sInput, aConstants, fObjectConstants, fInConstant, fnLog)
 *
 * @param {string} sInput
 * @param {Array} aConstants
 * @param {boolean} fObjectConstants
 * @param {boolean} [fInConstant]
 * @param {function} [fnLog]
 * @returns {string} modified input
 */
var replaceConstants = function(sInput, aConstants, fObjectConstants, fInConstant, fnLog)
{
    do {
        var cReplacements = 0;
        for (var i = 0; i < aConstants.length; i++) {
            if (aConstants[i][2] < 0) continue;     // skip any replacement for which we recorded multiple definitions (ie, negative replacement count)
            var sFind = aConstants[i][0];
            var sReplace = aConstants[i][1];
            var cchFind = sFind.length;
            var cchReplace = sReplace.length;
            var iNext = 0;
            while ((iNext = sInput.indexOf(sFind, iNext)) >= 0) {
                if (fObjectConstants) {
                    /*
                     * As discussed earlier, the 'includeObjectConstants' option precludes removing any constant definitions,
                     * so we must additionally ensure that we don't inadvertently perform replacements on those definitions.
                     */
                    if (sInput.substr(iNext, 1024).match(/([A-Za-z][A-Za-z0-9_]*\.[A-Z_][A-Z0-9_\.]*)\s*=\s*(.*?)\s*;[\t ]*(?:\/\/[^\n]*|)\n/)) {
                        iNext += cchFind;
                        continue;
                    }
                }
                if (fnLog) {
                    fnLog("replaced '" + sFind + "' with '" + sReplace + "'");
                }
                sInput = sInput.substr(0, iNext) + sReplace + sInput.substr(iNext + cchFind);
                aConstants[i][2]++;
                cReplacements++;
                iNext += cchReplace;
            }
            /*
             * If we've just done any replacements within another constant, then start the process over again
             * with the longest constant, to ensure we don't perform any partial replacements.
             */
            if (fInConstant && cReplacements) break;
        }
    } while (cReplacements);
    return sInput;
};

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('prepjs', 'JS Preprocessor', function() {
        /*
         * Merge task-specific and/or target-specific options with these defaults.
         */
        var options = this.options({
            includeObjectConstants: false,
            listConstants: true,
            replaceConstants: true
        });
        /*
         * Iterate over all specified file groups.
         *
         * See http://gruntjs.com/inside-tasks#this.files, which says in part:
         *
         *      Your task should iterate over the this.files array, utilizing the src and dest
         *      properties of each object in that array. The this.files property will always be an array.
         *      The src property will also always be an array, in case your task cares about multiple
         *      source files per destination file.
         *
         * And http://gruntjs.com/configuring-tasks#files-array-format, which explains that all files
         * objects support src and dest but the 'Files Array' format supports a few additional properties:
         *
         *      filter: Either a valid fs.Stats method name or a function that is passed the matched
         *      src filepath and returns true or false;
         *
         *      nonull: If set to true then the operation will include non-matching patterns. Combined
         *      with grunt's --verbose flag, this option can help debug file path issues;
         *
         *      dot: Allow patterns to match filenames starting with a period, even if the pattern does
         *      not explicitly have a period in that spot;
         *
         *      matchBase: If set, patterns without slashes will be matched against the basename of the path
         *      if it contains slashes. For example, a?b would match the path /xyz/123/acb, but not /xyz/acb/123;
         *
         *      expand: Process a dynamic src-dest file mapping, see "Building the files object dynamically"
         *      for more information.
         */
        this.files.forEach(function(file) {

            /*
             * Allow any of our options to be set at the target level as well
             */
            var fObjectConstants = file.includeObjectConstants;
            if (fObjectConstants === undefined) fObjectConstants = options.includeObjectConstants;

            var fListConstants = file.listConstants;
            if (fListConstants === undefined) fListConstants = options.listConstants;

            var fReplaceConstants = file.replaceConstants;
            if (fReplaceConstants === undefined) fReplaceConstants = options.replaceConstants;

            /*
             * Read all file contents into src
             */
            var src = file.src.filter(function(sFilePath) {
                /*
                 * Warn on and remove invalid source files (if nonull was set)
                 */
                if (!grunt.file.exists(sFilePath)) {
                    grunt.log.warn('Source file "' + sFilePath + '" not found.');
                    return false;
                }
                return true;
            }).map(function(sFilePath) {
                /*
                 * Read a file
                 */
                return grunt.file.read(sFilePath);
            }).join("\n");

            /*
             * Find all the constants in src, and remove their definitions from src if possible
             * (ie, if fReplaceConstants is true and fObjectConstants is false).
             *
             * aConstants is the array of constant definitions, where each definition is another
             * 3-element array:
             *
             *      [0]: the original string (ie, the name of the constant)
             *      [1]: the replacement string (ie, the value of the constant)
             *      [2]: a replacement count, initialized to zero; set to -1 if a duplicate is found
             *
             * WARNING: Grunt (ie, Node) fails with the following error:
             *
             *      FATAL ERROR: CALL_AND_RETRY_2 Allocation failed - process out of memory
             *
             * when processing a large src stream (eg, on the order 1.5Mb), and it always seems to
             * die in findConstants()'s call to RegExp's exec() method.  I couldn't glean any clues
             * from the heapdump (other than observing that, yes, running Grunt generates a shitload of
             * objects and is probably not very well-tuned), so I've implemented a simple work-around:
             * divide the src stream into two parts.  If necessary, this work-around can easily be
             * generalized to N parts.  If the problem is a direct side-effect of passing very large
             * strings to the RegExp library, then this is clearly one way to avoid that problem.
             */
            var aConstants = [];
            var i = src.length/2;
            i = src.indexOf("\n", i) + 1;       // divide the src after the first linefeed beyond the midpoint
            var src1 = src.substr(0, i);
            var src2 = src.substr(i);
            // grunt.log.writeln("findConstants(src1): " + src1.length + " chars");
            src1 = findConstants(src1, aConstants, fObjectConstants, fReplaceConstants);
            // grunt.log.writeln("findConstants(src2): " + src2.length + " chars");
            src2 = findConstants(src2, aConstants, fObjectConstants, fReplaceConstants);

            /*
             * Sort the constants in order of longest definition to shortest, because we perform all the replacements
             * in array order, and we can't allow definitions that are subsets of longer definitions to be replaced first.
             */
            // grunt.log.writeln("aConstants.sort()");
            aConstants.sort(compareConstants);

            // grunt.log.writeln("replacing constants in other constants");
            aConstants.forEach(function(constant) {
                constant[1] = replaceConstants(constant[1], aConstants, fObjectConstants, true);
            });

            if (fReplaceConstants) {
                // grunt.log.writeln("replaceConstants(src1)");
                src1 = replaceConstants(src1, aConstants, fObjectConstants, false);
                // grunt.log.writeln("replaceConstants(src2)");
                src2 = replaceConstants(src2, aConstants, fObjectConstants, false);
                // grunt.log.writeln("replaceConstants() complete");
            }

            var sListing = "";

            if (fListConstants) {
                // grunt.log.writeln("listing constants");
                sListing += "/*\n * List of grunt-prepjs replacements:\n *\n";
                for (i = 0; i < aConstants.length; i++) {
                    sListing += " * " + aConstants[i][0] + " => " + aConstants[i][1]  + " (" + aConstants[i][2] + " occurrences)\n";
                }
                sListing += " */\n";
            }

            /*
             * Write the destination file
             */
            // grunt.log.writeln("writing " + f.dest);
            grunt.file.write(file.dest, sListing + src1 + src2);

            /*
             * Print a success message
             */
            grunt.log.writeln('File "' + file.dest + '" created.');
        });
    });
};
