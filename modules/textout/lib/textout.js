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

/**
 * TextOut()
 *
 * @constructor
 */
function TextOut()
{
    this.fDebug = false;
    this.sServerRoot = process.cwd();
    this.sText = null;
    this.nTabWidth = 8;
    this.sTarget = "; ";
}

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
 *      textout --file=({path}|{URL}) [--alignvert]
 *
 * Arguments
 * ---
 *      --alignvert looks for tabs preceding certain characters (eg, ';') in the first line, and endeavors
 *      to ensure that the same tab+character combination(s) in all subsequent lines start at the same column.
 *
 *      For now, all output is written to stdout only.
 *
 * Examples
 * ---
 *      node modules/textout/bin/textout --file=devices/pc/bios/compaq/deskpro386/1988-01-28.nasm --alignvert
 */
TextOut.CLI = function()
{
    var args = proc.getArgs();

    if (!args.argc) {
        console.log("usage: textout --file=({path}|{URL}) [--alignvert]");
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
            if (argv['alignvert']) {
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
        this.sText = buf;
        return true;
    }
    TextOut.logError(new Error("setText(): invalid data"));
    return false;
};

/**
 * alignVertical()
 *
 * @this {TextOut}
 */
TextOut.prototype.alignVertical = function()
{
    if (!this.sText) return;

    var asLines = this.sText.split('\n');

    var iTarget = -1;
    if (asLines.length) {
        iTarget = this.findTarget(asLines[0]);
    }
    if (iTarget < 0) return;

    if (this.fDebug) console.log("target vertical alignment: " + (iTarget + 1));

    var iLine, fModified = false;

    for (iLine = 1; iLine < asLines.length; iLine++) {
        var iVictim;
        var sLine = asLines[iLine];
        var fModifiedLine = false;
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
            fModifiedLine = true;
        }
        if (fModifiedLine) {
            asLines[iLine] = sLine;
            fModified = true;
        }
    }

    if (fModified) {
        this.sText = "";
        for (iLine = 0; iLine < asLines.length; iLine++) {
            if (this.sText) this.sText += '\n';
            this.sText += asLines[iLine];
        }
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
 * outputText(sOutputFile, fOverwrite)
 *
 * @this {TextOut}
 * @param {string} [sOutputFile]
 * @param {boolean} [fOverwrite]
 */
TextOut.prototype.outputText = function(sOutputFile, fOverwrite)
{
    if (this.sText) {
        if (sOutputFile) {
            try {
                if (fs.existsSync(sOutputFile) && !fOverwrite) {
                    console.log(sOutputFile + " exists, use --overwrite to rewrite");
                } else {
                    var sDirName = path.dirname(sOutputFile);
                    if (!fs.existsSync(sDirName)) mkdirp.sync(sDirName);
                    fs.writeFileSync(sOutputFile, this.sText);
                    console.log(this.sText.length + "-byte file saved as " + sOutputFile);
                }
            } catch(err) {
                TextOut.logError(err);
            }
        } else {
            console.log(this.sText);
        }
    }
};

module.exports = TextOut;
