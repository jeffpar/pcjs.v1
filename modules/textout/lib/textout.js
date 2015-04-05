/**
 * @fileoverview Provides miscellaneous text-munging services
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 * @version 1.0
 * Created 2015-Apr-04
 *
 * Copyright © 2012-2015 Jeff Parsons <Jeff@pcjs.org>
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

var fs      = require("fs");
var path    = require("path");
var mkdirp  = require("mkdirp");
var net     = require("../../shared/lib/netlib");
var proc    = require("../../shared/lib/proclib");
var str     = require("../../shared/lib/strlib");

/**
 * TextOut()
 *
 * @constructor
 */
function TextOut()
{
    this.fDebug = false;
    this.sServerRoot = process.cwd();
    this.asLines = [];
    this.nTabWidth = 8;
    this.sTarget = "; ";
}

TextOut.asTargetRefs = ["call", "jmp", "jz", "jnz", "jc", "jnc", "ja", "jna", "js", "jns", "jo", "jno", "jl", "jnl", "jg", "jng", "jpo", "jpe"];

/*
 * Class methods
 */

/**
 * CLI()
 *
 * Provides the command-line interface for the TextOut module.
 *
 * Usage
 * ---
 *      textout --file=({path}|{URL}) [--nasm]
 *
 * Arguments
 * ---
 *      --nasm performs a variety of NASM-related processing, including:
 *
 *          collapseRepeated(): looks for series of lines containing nothing more than a "db",
 *          "dw", or something equivalent, and collapses them into a single repetition.
 *
 *          labelTargets(): looks for all JMP and CALL targets and labels them.
 *
 *          alignVertical(): looks for a predefined target string (eg, '; ') in the first line,
 *          and ensures that the same sequence in all subsequent lines starts at the same column.
 *
 *      For now, all output is written to stdout only.
 *
 * Examples
 * ---
 *      node modules/textout/bin/textout --file=devices/pc/bios/compaq/deskpro386/1988-01-28.nasm --nasm
 */
TextOut.CLI = function()
{
    var args = proc.getArgs();

    if (!args.argc) {
        console.log("usage: textout --file=({path}|{URL}) [--nasm]");
        return;
    }

    var argv = args.argv;
    var sFile = argv['file'];
    if (!sFile) {
        TextOut.logError(new Error("bad or missing input filename"));
        return;
    }

    var text = new TextOut();
    text.loadFile(sFile, function(err) {
        if (!err) {
            if (argv['nasm']) {
                text.collapseRepeated();
                text.labelTargets();
                text.alignVertical();
            }
            text.outputText();
        }
    });
};

/**
 * logError(err)
 *
 * Conditionally logs an error to the console.
 *
 * @param {Error} err
 * @return {string} the error message that was logged (or that would have been logged had logging been enabled)
 */
TextOut.logError = function(err)
{
    var sError = "";
    if (err) {
        sError = "textout error: " + err.message;
        console.log(sError);
    }
    return sError;
};

/*
 * Object methods
 */

/**
 * loadFile(sFile, done)
 *
 * @this {TextOut}
 * @param {string} sFile
 * @param {function(Error)} done
 */
TextOut.prototype.loadFile = function(sFile, done)
{
    var obj = this;
    var options = {encoding: "utf8"};
    var sFilePath = net.isRemote(sFile)? sFile : path.join(this.sServerRoot, sFile);

    if (!this.sFilePath) this.sFilePath = sFilePath;

    if (this.fDebug) console.log("loadFile(" + sFilePath + ")");

    if (net.isRemote(sFilePath)) {
        net.getFile(sFilePath, options.encoding, function(err, status, buf) {
            if (err) {
                TextOut.logError(err);
                done(err);
                return;
            }
            obj.setText(buf);
            done(null);
        });
    } else {
        fs.readFile(sFilePath, options, function(err, buf) {
            if (err) {
                TextOut.logError(err);
                done(err);
                return;
            }
            obj.setText(buf);
            done(null);
        });
    }
};

/**
 * setText(buf)
 *
 * Records the given file data in the TextOut's buffer
 *
 * @this {TextOut}
 * @param {Buffer|string} buf
 * @return {boolean}
 */
TextOut.prototype.setText = function(buf)
{
    var b, i, j, s;
    if (typeof buf == "string") {
        this.asLines = buf.split('\n');
        return true;
    }
    TextOut.logError(new Error("setText(): invalid data"));
    return false;
};

/**
 * collapseRepeated()
 *
 * @this {TextOut}
 */
TextOut.prototype.collapseRepeated = function()
{
    for (var i = 0; i < this.asLines.length; i++) {
        var as = this.getLineParts(i);
        if (!as) continue;
        if (as[2] != "db" && as[2] != "dw") continue;
        var cCombine = 0, asLast;
        for (var j = i + 1; j < this.asLines.length; j++) {
            var asNext = this.getLineParts(j);
            if (!asNext) break;
            if (as[2] != asNext[2] || as[2] != asNext[2]) break;
            asLast = asNext;
            cCombine++;
        }
        if (cCombine > 2) {
            this.asLines[i] = "\n\ttimes\t" + (cCombine + 1) + ' ' + as[2] + ' ' + as[3] + "\t\t; " + as[4] + " - " + asLast[4] + '\n';
            this.asLines.splice(i + 1, cCombine);
        }
    }
};

/**
 * labelTargets()
 *
 * @this {TextOut}
 */
TextOut.prototype.labelTargets = function()
{
    /*
     * First pass: find all target references (eg, JMP and CALL instructions)
     */
    var i, j, as, target, aTargets = [], aHardTargets = [];

    for (i = 0; i < this.asLines.length; i++) {
        as = this.getLineParts(i);
        if (!as) continue;
        var iTarget = TextOut.asTargetRefs.indexOf(as[2]);
        if (iTarget < 0) continue;
        target = str.parseInt(as[3]);
        if (target == undefined) continue;
        if (aTargets.indexOf(target) < 0) {
            aTargets.push(target);
            if (iTarget < 2) aHardTargets.push(target);
        }
        this.asLines[i] = this.asLines[i].replace(as[3], 'l' + target.toString(16));
    }
    /*
     * Second pass: label all targets
     */
    var addr, fPrevHard = false;
    for (i = 0; i < this.asLines.length; i++) {
        as = this.getLineParts(i);
        if (!as) continue;
        addr = str.parseInt(as[4]);
        if (addr == undefined) continue;
        j = aTargets.indexOf(addr);
        if (j >= 0) {
            var fHard = (aHardTargets.indexOf(addr) >= 0);
            this.asLines[i] = (fHard || fPrevHard? "\nl" : 'l') + addr.toString(16) + ':' + this.asLines[i];
            aTargets.splice(j, 1);
        } else {
            if (fPrevHard) this.asLines[i] = '\n' + this.asLines[i];
        }
        fPrevHard = (as[2] == "jmp" || as[2] == "ret" || as[2] == "retf" || as[2] == "iret");
    }
    /*
     * Third pass: for all targets that turned out to NOT be targets, fix all references
     */
    var aMissingTargets = [];
    if (aTargets.length) {
        for (i = 0; i < this.asLines.length; i++) {
            as = this.getLineParts(i);
            if (!as) continue;
            if (as[3].charAt(0) == 'l') {
                addr = str.parseInt(as[3].substr(1));
                if (aTargets.indexOf(addr) >= 0) {
                    this.asLines[i] = this.asLines[i].replace(as[3], str.toHexWord(addr));
                    if (aMissingTargets.indexOf(addr) < 0) aMissingTargets.push(addr);
                }
            }
            if (as[5]) {
                var sASCII = "";
                var sBytes = as[5];
                for (j = 0; j < sBytes.length-1; j+=2) {
                    var k = str.parseInt(sBytes.substr(j, 2));
                    sASCII += (k < 0x20 || k >= 0x7f)? '.' : String.fromCharCode(k);
                }
                sBytes = "  " + sBytes;
                /*
                 * TODO: Determine why replace() fails when there's a trailing '$' in the replacement string;
                 * I'm working around it by appending a space.
                 */
                if (sASCII.slice(-1) == '$') sASCII += ' ';
                this.asLines[i] = this.asLines[i].replace(sBytes, sBytes + " '" + sASCII + "'");
            }
        }
        if (aTargets.length != aMissingTargets.length) {
            console.log("; warning: " + aTargets.length + " unprocessed targets (" + aMissingTargets.length + " repaired):");
            for (j = 0; j < aTargets.length; j++) {
                if (aMissingTargets.indexOf(aTargets[j]) < 0) console.log(';\t' + str.toHexWord(aTargets[j]));
            }
        }
    }
};

/**
 * alignVertical()
 *
 * @this {TextOut}
 */
TextOut.prototype.alignVertical = function()
{
    var iTarget = this.asLines.length? this.findTarget(this.asLines[0]) : -1;
    if (iTarget < 0) return;

    if (this.fDebug) console.log("target vertical alignment: " + (iTarget + 1));

    for (var iLine = 1; iLine < this.asLines.length; iLine++) {
        var iVictim;
        var sLine = this.asLines[iLine];
        while ((iVictim = this.findTarget(sLine)) != iTarget) {
            if (iVictim < 0) break;

            if (this.fDebug) console.log("line " + (iLine + 1) + ": current vertical alignment: " + (iVictim + 1));

            if (iVictim > iTarget) {
                if (!this.iTargetIndex) break;
                var ch = sLine.charAt(this.iTargetIndex-1);
                if (ch != ' ' && ch != '\t') break;
                sLine = sLine.substr(0, this.iTargetIndex-1) + sLine.substr(this.iTargetIndex);
            } else {
                sLine = sLine.substr(0, this.iTargetIndex) + ' ' + sLine.substr(this.iTargetIndex);
            }
        }
        this.asLines[iLine] = sLine;
    }
};

/**
 * findTarget(sSrc, fDebug)
 *
 * This does not return the physical 0-based index of sTarget within sSrc, but rather the logical
 * 0-based position, taking into account tab stops, based on the current nTabWidth setting.
 *
 * @this {TextOut}
 * @param {string} sSrc
 * @param {boolean} [fDebug]
 * @return {number} logical position of sTarget within sSrc, -1 if not found
 */
TextOut.prototype.findTarget = function(sSrc, fDebug)
{
    var i = 0, iPos = 0, iTarget;

    if (fDebug) console.log('findTarget("' + sSrc + '")');

    if ((iTarget = sSrc.indexOf(this.sTarget, i)) >= 0) {
        /*
         * i is a physical position, whereas iPos is the logical position (ie, taking into account tab stops),
         * so we have to walk i up to iTarget, advancing iPos as we go.
         */
        while (i < iTarget) {
            var ch = sSrc.charAt(i++);
            if (ch != '\t') {
                iPos++;
            } else {
                iPos = iPos + (this.nTabWidth - (iPos % this.nTabWidth));
            }
            if (fDebug) console.log('\t"' + ch + '": index=' + (i - 1) + ', pos=' + iPos);
        }
        this.iTargetIndex = iTarget;
        iTarget = iPos;
    }
    return iTarget;
};

/**
 * getLineParts(iLine)
 *
 * Returns the following array:
 *
 *      asParts[1]: label
 *      asParts[2]: operation
 *      asParts[3]: operand(s)
 *      asParts[4]: offset
 *      asParts[5]: byte sequence
 *
 * or null if the line does not contain all of the above.
 *
 * @this {TextOut}
 * @param {number} iLine
 * @return {Array.<string>}
 */
TextOut.prototype.getLineParts = function(iLine)
{
    var as = this.asLines[iLine].match(/^\n?([^\s:]+:|)\s*([^\s;]+)\s*([^;]*?)\s*;\s*([0-9A-F]+)\s*([0-9A-F]+)\s*$/);
    if (as) {
        if (as[2] == "add" && as[3] == "[bx+si],al") {
            as[2] = "dw";
            as[3] = "0x0000";
        }
    }
    return as;
};

/**
 * outputText(sOutputFile, fOverwrite)
 *
 * @this {TextOut}
 * @param {string} [sOutputFile]
 * @param {boolean} [fOverwrite]
 */
TextOut.prototype.outputText = function(sOutputFile, fOverwrite)
{
    if (this.asLines.length) {
        var sText = "";
        for (var iLine = 0; iLine < this.asLines.length; iLine++) {
            if (sText) sText += '\n';
            sText += this.asLines[iLine];
        }
        if (sOutputFile) {
            try {
                if (fs.existsSync(sOutputFile) && !fOverwrite) {
                    console.log(sOutputFile + " exists, use --overwrite to rewrite");
                } else {
                    var sDirName = path.dirname(sOutputFile);
                    if (!fs.existsSync(sDirName)) mkdirp.sync(sDirName);
                    fs.writeFileSync(sOutputFile, sText);
                    console.log(sText.length + "-byte file saved as " + sOutputFile);
                }
            } catch(err) {
                TextOut.logError(err);
            }
        } else {
            console.log(sText);
        }
    }
};

module.exports = TextOut;
