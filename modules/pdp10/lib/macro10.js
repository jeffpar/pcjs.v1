/**
 * @fileoverview My homage to MACRO-10: a work-alike assembler for the PDP-10
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
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
 * You are required to include the above copyright notice in every modified copy of this work
 * and to display that copyright notice when the software starts running; see COPYRIGHT in
 * <http://pcjs.org/modules/shared/lib/defines.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

if (NODE) {
    var Str = require("../../shared/lib/strlib");
    var Web = require("../../shared/lib/weblib");
    var Debugger = require("../../shared/lib/debugger");
    var PDP10 = require("./defines");
    var DebuggerPDP10 = require("./debugger");
}

/**
 * @typedef {{
 *      name:(string),
 *      nOperand:(number),
 *      aParms:(string),
 *      sText:(string)
 * }}
 */
var Mac;

/**
 * @typedef {{
 *      name:(string),
 *      value:(number),
 *      fLabel:(boolean),
 *      fGlobal:(boolean),
 *      fPrivate:(boolean)
 * }}
 */
var Sym;

/**
 * @class Macro10
 * @property {string} sURL
 * @property {number} nAddr
 * @property {DebuggerPDP10} dbg
 * @property {function(Macro10,string,number)} done
 */
class Macro10 {
    /**
     * Macro10(sURL, nAddr, dbg, done)
     *
     * The done() callback is called after the resource has been loaded and parsed, with an error code
     * indicating overall success or failure.  The caller must use other methods to obtain further results.
     *
     * The callback is passed three parameters:
     *
     *      done(macro10, sURL, nErrorCode)
     *
     * If nErrorCode is zero, the assembly process completed successfully.
     *
     * For access to basic services (eg, println()), we rely on the caller.  This is NOT an extension of
     * Component, so those services are NOT part of this class.
     *
     * @this {Macro10}
     * @param {string} sURL (the URL of the resource to be assembled)
     * @param {number|null} nAddr (the absolute address to assemble the code at, if any)
     * @param {DebuggerPDP10} dbg (used to provide services like println() to the Macro10 class)
     * @param {function(Macro10,string,number)} done
     */
    constructor(sURL, nAddr, dbg, done)
    {
        this.sURL = sURL;
        this.nAddr = nAddr || 0;
        this.dbg = dbg;
        this.done = done;

        /*
         * Set up all the services we need to use.
         */
        this.println = dbg.println;

        /*
         * Initialize all the tables that MACRO-10 uses.
         *
         * The Macros and Symbols tables are fairly straightforward: they are indexed by a macro or symbol
         * name, and each index points to a Mac or Sym object, respectively.
         *
         * We also treat REPEAT blocks and conditional (eg, IFE) blocks like macros, except that they are
         * anonymous and immediately invoked as appropriate.  What does that mean?  Well, REPEAT blocks are
         * always immediately invoked (repeatedly, based on the repeat count), whereas conditional blocks are
         * either immediately invoked if the associated condition is true or skipped if the condition is false.
         *
         * Finally, we have LITERAL blocks, which are also semi-anonymous (because we give each one an
         * auto-generated label based on the current line number), but they are never immediately invoked;
         * instead, after we've finished processing all the lines in the original input file, we run through
         * all the LITERAL entries in the Macros table and process the associated statement(s).
         */
        this.tblMacros = {};
        this.tblSymbols = {};

        this.nLine = 0;
        this.nError = 0;
        this.aWords = [];               // filled in by the various genXXX() functions

        this.sOperator = null;          // the active operator, if any
        this.nMacroDef = 0;             // the active MACRO definition state
        this.sMacroDef = null;          // the active MACRO definition name
        this.chMacroOpen = this.chMacroClose = '';

        /*
         * If an ASCII/ASCIZ/SIXBIT pseudo-op is active, chASCII is set to the separator and sASCII collects
         * the intervening character(s).
         */

        /**
         * @type {null|string}
         */
        this.chASCII = null;

        /**
         * @type {string}
         */
        this.sASCII = "";

        var macro10 = this;
        Web.getResource(sURL, null, true, function(sURL, sResource, nErrorCode) {
            if (!nErrorCode) {
                nErrorCode = macro10.parseFile(sURL, sResource);
            }
            macro10.done(macro10, sURL, nErrorCode);
        });
    }

    /**
     * parseFile(sPath, sContents)
     *
     * Begin the assembly process.
     *
     * @this {Macro10}
     * @param {string} sPath
     * @param {string} sContents
     * @return {number}
     */
    parseFile(sPath, sContents)
    {
        var a = this.dbg.resetVariables();
        try {
            var sText = sContents;
            if (Str.endsWith(sPath, ".html")) {
                /*
                 * We want to parse ONLY the text between <PRE>...</PRE> tags, and eliminate any HTML entities.
                 */
                sText = "";
                var match, re = /<pre>([\s\S]*?)<\/pre>/gi;
                while (match = re.exec(sContents)) {
                    var s = match[1];
                    if (s.indexOf('&') >= 0) s = s.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&');
                    sText += s;
                }
                match = sText.match(/&[a-z]+;/i);
                if (match) this.warning("unrecognized HTML entity: " + match[0]);
            }
            var i;
            var asLines = sText.split(/\r?\n/);
            for (i = 0; i < asLines.length; i++) {
                this.nLine++;
                if (!this.parseLine(asLines[i] + '\r\n')) break;
            }
        } catch(err) {
            this.println(err.message);
            this.nError = -1;
        }
        this.dbg.restoreVariables(a);
        return this.nError;
    }

    /**
     * parseLine(sLine)
     *
     * @this {Macro10}
     * @param {string} sLine (line contents)
     * @return {boolean}
     */
    parseLine(sLine)
    {
        if (this.nMacroDef) {
            if (this.nMacroDef == 1) {
                var i = sLine.indexOf(this.chMacroOpen);
                if (i >= 0) {
                    this.nMacroDef++;
                    sLine = sLine.substr(i+1);
                } else {
                    this.error("expected " + this.sOperator + " definition: " + sLine);
                }
            }
            if (this.nMacroDef > 1) {
                sLine = this.appendMacro(sLine);
            }
            if (this.nMacroDef) return true;
        }

        if (this.chASCII != null) {
            sLine = this.addASCII(sLine);
        }

        var reLine = /\s*([A-Z$%.][0-9A-Z$%.]*[:=]|)\s*([A-Z$%.][0-9A-Z$%.]*|)\s*([^;]+|)\s*(;?.*)/i;
        var match = sLine.match(reLine);
        if (!match || match[4] && match[4].slice(0, 1) != ';') {
            this.error("failed to parse line: " + sLine);
            return false;
        }

        var sLabel = match[1];
        var sOperator = match[2].toUpperCase();
        var sOperands = match[3].trim();
        var sComment = match[4].slice(1);
        if (sLabel) {
            var chSep = sLabel.slice(-1);
            sLabel = sLabel.slice(0, -1);
            if (chSep == ':') {
                this.addLabel(sLabel);
            } else {
                sOperands = sOperator + sOperands;
                sOperator = chSep;
            }
        }

        this.sOperator = sOperator;
        sOperands = sOperands.trim();

        /*
         * Check the operands for a literal.
         */
        var sLiteral = this.getLiteral(sOperands);
        if (sLiteral) {
            sOperands = sOperands.replace(sLiteral, this.addMacro(Macro10.PSEUDO_OP.LITERAL, sLiteral));
        }

        if (!this.parseMacro(sOperator, sOperands)) {

            switch (sOperator) {
            case "":
                break;                      // eg, a blank line or a line that contains only a label and/or a comment

            case "=":
                this.addAssign(sLabel, sOperands);
                break;

            case Macro10.PSEUDO_OP.ASCII:
            case Macro10.PSEUDO_OP.ASCIZ:
            case Macro10.PSEUDO_OP.SIXBIT:
                this.addASCII(sOperands);
                break;

            case Macro10.PSEUDO_OP.DEFINE:
            case Macro10.PSEUDO_OP.IFE:
            case Macro10.PSEUDO_OP.REPEAT:
                this.addMacro(sOperator, sOperands);
                break;

            case Macro10.PSEUDO_OP.PAGE:    // TODO
            case Macro10.PSEUDO_OP.SUBTTL:  // TODO
                break;

            default:
                if (DEBUG) this.println(Str.toDec(this.nLine, 5) + ": label(" + sLabel + ") operator(" + sOperator + ") operands(" + sOperands + ") comment(" + sComment + ")");
                break;
            }
        }

        if (this.nLine >= 820) {
            this.dbg.printVariable();
            this.error("temporary line limit reached");
            return false;
        }
        return true;
    }

    /**
     * parseMacro(name, sOperands)
     *
     * @this {Macro10}
     * @param {string} name
     * @param {string} [sOperands]
     * @return {boolean}
     */
    parseMacro(name, sOperands)
    {
        var macro = this.tblMacros[name];
        if (!macro) return false;

        if (sOperands != null) {
            /*
             * Process this macro call; start by extracting macro argument values from sOperands.
             */
            var aValues = [];
            var sDelims = ',';
            if (sOperands[0] == '(') {
                sDelims += ')';
                sOperands = sOperands.substr(1);
            }
            while (sOperands) {
                sOperands = sOperands.trim();
                var sExp = this.getExpression(sOperands, sDelims);
                if (!sExp) break;
                aValues.push(sExp);
                sOperands = sOperands.substr(sExp.length + 1);
            }
            this.parseText(macro.sText, macro.aParms, aValues);
            return true;
        }

        if (name[0] != '@') return false;

        switch(name.substr(1)) {
        case Macro10.PSEUDO_OP.IFE:
            if (!macro.nOperand) {
                this.parseText(macro.sText);
            }
            break;

        case Macro10.PSEUDO_OP.REPEAT:
            while (macro.nOperand-- > 0) {
                this.parseText(macro.sText);
            }
            break;

        default:
            return false;
        }
        return true;
    }

    /**
     * isSymbolChar(ch)
     *
     * @this {Macro10}
     * @param {string} ch
     * @return {boolean}
     */
    isSymbolChar(ch)
    {
        return !!ch.match(/[0-9A-Z$%.]/i);
    }

    /**
     * parseText(sText, aParms, aValues)
     *
     * @this {Macro10}
     * @param {string} sText
     * @param {Array.<string>} [aParms]
     * @param {Array.<string>} [aValues]
     */
    parseText(sText, aParms, aValues)
    {
        var asLines = sText.split(/\r?\n/);
        for (var iLine = 0; iLine < asLines.length; iLine++) {
            var sLine = asLines[iLine] + '\r\n';
            if (aParms) {
                for (var iParm = 0; iParm < aParms.length; iParm++) {
                    var sParm = aParms[iParm];
                    var sReplace = aValues[iParm] || "";
                    var iSearch = 0;
                    while (true) {
                        var iMatch = sLine.indexOf(sParm, iSearch);
                        if (iMatch < 0) break;
                        iSearch = iMatch + 1;
                        var iMatchEnd = iMatch + sParm.length;
                        if ((!iMatch || !this.isSymbolChar(sLine[iMatch - 1])) && (iMatchEnd >= sLine.length || !this.isSymbolChar(sLine[iMatchEnd]))) {
                            sLine = sLine.substr(0, iMatch) + sReplace + sLine.substr(iMatchEnd);
                            iSearch = iMatch + sReplace.length;
                        }
                    }
                }
            }
            if (!this.parseLine(sLine)) break;
        }
    }

    /**
     * error(sError)
     *
     * @this {Macro10}
     * @param {string} sError
     */
    error(sError)
    {
        throw new Error("error" + (this.nLine? " at line " + Str.toDec(this.nLine) : "") + ": " + sError);
    }

    /**
     * warning(sWarning)
     *
     * @this {Macro10}
     * @param {string} sWarning
     */
    warning(sWarning)
    {
        this.println("warning" + (this.nLine? " at line " + Str.toDec(this.nLine) : "") + ": " + sWarning);
    }

    /**
     * getExpression(sOperands, sDelims)
     *
     * @this {Macro10}
     * @param {string} sOperands
     * @param {string} [sDelims] (eg, comma, closing parenthesis)
     * @return {string|null} (if the operands begin with an expression, return it)
     */
    getExpression(sOperands, sDelims = ",")
    {
        var i = 0;
        var sExp = null;
        var cNesting = 0;
        while (i < sOperands.length) {
            var ch = sOperands[i];
            if (sDelims.indexOf(ch) >= 0) {
                break;
            }
            if (ch == '<') {
                cNesting++;
            } else if (ch == '>') {
                if (--cNesting < 0) {
                    this.error("missing bracket(s): " + sOperands);
                    break;
                }
            }
            i++;
        }
        if (!cNesting) {
            sExp = sOperands.substr(0, i);
        }
        else if (cNesting > 0) {
            this.error("extra bracket(s): " + sOperands);
        }
        return sExp;
    }

    /**
     * getLiteral(sOperands)
     *
     * @this {Macro10}
     * @param {string} sOperands
     * @return {string|null} (if the operands contain a literal, return it)
     */
    getLiteral(sOperands)
    {
        var sLit = null;
        var cNesting = 0;
        var i = 0, iLiteral = -1;
        while (i < sOperands.length) {
            var ch = sOperands[i];
            if (ch == '[') {
                if (!cNesting++) iLiteral = i;
            }
            i++;
            if (ch == ']' && --cNesting <= 0) break;
        }
        if (cNesting < 0) {
            this.error("missing bracket(s): " + sOperands);
        }
        if (iLiteral >= 0) {
            sLit = sOperands.substr(iLiteral, i - iLiteral);
        }
        return sLit;
    }

    /**
     * addASCII(sOperands)
     *
     * @this {Macro10}
     * @param {string} sOperands
     * @return {string} (returns whatever portion of the string was not part of an ASCII pseudo-op)
     */
    addASCII(sOperands)
    {
        var sRemain = sOperands;
        if (this.chASCII == null) {
            this.chASCII = this.sASCII = "";
            if (sOperands) {
                this.chASCII = sOperands[0];
                sRemain = sOperands = sOperands.substr(1);
            }
        }
        if (this.chASCII) {
            var i = sOperands.indexOf(this.chASCII);
            if (i < 0) {
                sRemain = "";
            } else {
                sRemain = sOperands.substr(i + 1);
                sOperands = sOperands.substr(0, i);
                this.chASCII = null;
            }
            this.sASCII += sOperands;
        }
        if (this.chASCII == null) {
            this.genASCII();
        }
        return sRemain;
    }

    /**
     * addAssign(sName, sExp)
     *
     * @this {Macro10}
     * @param {string} sName
     * @param {string} sExp
     */
    addAssign(sName, sExp)
    {
        var value = this.dbg.parseExpression(sExp);
        if (value === undefined) {
            this.error("parseExpression(" + sExp + ")");
            return;
        }
        this.addSymbol(sName, value);
    }

    /**
     * addLabel(sLabel)
     *
     * @this {Macro10}
     * @param {string} sLabel
     */
    addLabel(sLabel)
    {
        this.addSymbol(sLabel, this.nAddr, true);
    }

    /**
     * addMacro(sOperator, sOperands)
     *
     * If sOperator is DEFINE, then a macro definition is expected.  If it's REPEAT, then we're starting a
     * REPEAT block instead.
     *
     * REPEAT blocks piggy-back on this code because they're essentially anonymous immediately-invoked macros;
     * we use an illegal MACRO-10 symbol ('@REPEAT') to name the anonymous macro while it's being defined, and the
     * macro's nOperand field will contain the repeat count (-1 for regular macros).
     *
     * The piggy-backing continues with other pseudo-ops like IFE, which again contain an anonymous block of text
     * that is immediately invoked if the criteria associated with the expression stored in the nOperand field is
     * satisfied.  That satisfaction occurs (or doesn't occur) when parseMacro() is called, once the macro has
     * been fully defined.
     *
     * @this {Macro10}
     * @param {string} sOperator
     * @param {string} sOperands
     * @return {string}
     */
    addMacro(sOperator, sOperands)
    {
        var match, name, aParms, nOperand, iBracket;

        this.chMacroOpen = '<';
        this.chMacroClose = '>';

        if (sOperator == Macro10.PSEUDO_OP.DEFINE) {
            match = sOperands.match(/([A-Z$%.][0-9A-Z$%.]*)\s*(\([^)]*\)|)\s*(<|)(.*)/i);
            if (!match) {
                this.error("unrecognized " + sOperator + " definition: " + sOperands);
                return "";
            }
            /*
             * TODO: Tighten up this parsing at some point.  All this is doing is extracting entire symbols
             * from within the parentheses, if any; it's NOT ensuring that those symbols are comma-separated
             * with no other intervening characters.
             */
            name = match[1];
            aParms = match[2].match(/[A-Z$%.][0-9A-Z$%.]*/g);
            nOperand = -1;
            iBracket = 3;
        }
        else if (sOperator == Macro10.PSEUDO_OP.LITERAL) {
            this.chMacroOpen = '[';
            this.chMacroClose = ']';
            name = '@' + Str.toDec(this.nLine, 5);
            match = [sOperands[0], sOperands.substr(1)];
            aParms = [];
            nOperand = this.nLine;
            iBracket = 0;
        }
        else {
            var sExp = this.getExpression(sOperands);
            if (!sExp) {
                this.error("missing " + sOperator + " expression: " + sOperands);
                return "";
            }
            sOperands = sOperands.substr(sExp.length + 1);
            sExp = sExp.trim();
            match = sOperands.match(/\s*(<|)(.*)/i);
            name = '@' + sOperator;
            aParms = [];
            nOperand = this.dbg.parseExpression(sExp);
            iBracket = 1;
        }

        /*
         * Now we need to set a global parsing state: we are either about to receive a macro definition on
         * subsequent lines (1), the definition has already started on the current line (2), or the definition
         * started and ended on the current line (0).
         */
        name = name.toUpperCase();
        this.nMacroDef = 1;

        var sText = "";
        if (match[iBracket]) {                          // if there IS also an opening bracket...
            this.nMacroDef = 2;                         // then the macro definition has begun
            sText = match[iBracket + 1];
            if (sText.slice(-1) == this.chMacroClose) { // and if there is ALSO a closing bracket...
                this.nMacroDef = 0;                     // the macro definition has ended as well
                sText = sText.slice(0, -1);
            }
        }

        this.tblMacros[name] = {
            name:     name,
            aParms:   aParms,
            nOperand: nOperand,
            sText:    sText
        };

        if (!this.nMacroDef) {
            this.parseMacro(name);
        } else {
            this.sMacroDef = name;
        }
        return name;
    }

    /**
     * appendMacro(sLine)
     *
     * @this {Macro10}
     * @param {string} sLine
     * @return {string}
     */
    appendMacro(sLine)
    {
        var sRemain = "";
        for (var i = 0; i < sLine.length; i++) {
            if (sLine[i] == this.chMacroOpen) {
                this.nMacroDef++;
            } else if (sLine[i] == this.chMacroClose) {
                this.nMacroDef--;
                if (this.nMacroDef == 1) {
                    this.nMacroDef = 0;
                    sRemain = sLine.substr(i + 1);
                    sLine = sLine.substr(0, i);
                    break;
                }
            }
        }
        var name = this.sMacroDef || "";
        this.tblMacros[name].sText += sLine;
        if (!this.nMacroDef) {
            this.sMacroDef = null;
            this.parseMacro(name);
        }
        return sRemain;
    }

    /**
     * addSymbol(name, value, fLabel, fGlobal, fPrivate)
     *
     * @this {Macro10}
     * @param {string} name
     * @param {number} value
     * @param {boolean} [fLabel] (default is false, meaning the symbol is an assignment)
     * @param {boolean} [fGlobal] (default is false, meaning the symbol is local to the current file)
     * @param {boolean} [fPrivate] (default is false, meaning the symbol has visibility to the caller)
     */
    addSymbol(name, value, fLabel = false, fGlobal = false, fPrivate = false)
    {
        name = name.toUpperCase().substr(0, 6);
        if (fLabel && this.tblSymbols[name] !== undefined) {
            this.error("label " + name + " redefined");
            return;
        }
        this.tblSymbols[name] = {
            name:     name,
            value:    value,
            fLabel:   fLabel,
            fGlobal:  fGlobal,
            fPrivate: fPrivate
        };
        this.dbg.setVariable(name, value);
    }

    /**
     * genASCII()
     *
     * Based on the last operator, generate the appropriate ASCII/ASCIZ/SIXBIT data.
     *
     * @this {Macro10}
     */
    genASCII()
    {
        var n = 0, w = 0;       // number of characters in current word, and current word
        var bits, shift;        // bits per character, and bits to left-shift next character
        var cch = this.sASCII.length;
        if (this.sOperator == Macro10.PSEUDO_OP.ASCIZ) cch++;
        for (var i = 0; i < cch; i++) {
            if (!n) {
                w = 0; shift = 29; bits = 7;
                if (this.sOperator == Macro10.PSEUDO_OP.SIXBIT) {
                    bits--; shift++;
                }
            }
            /*
             * If we're processing an ASCIZ pseudo-op, then yes, we will fetch one character beyond
             * the end of sASCII, which will return NaN, but when we mask a falsey value like NaN, we
             * get zero, so it's all good.
             */
            var c = this.sASCII.charCodeAt(i) & 0o177;
            /*
             * If we're doing 6-bit encoding, then perform the conversion of lower-case to upper-case,
             * and then adjust/mask.
             */
            if (bits == 6) {
                if (c >= 0x61 && c <= 0x7A) c -= 0x20;
                c = (c + 0o40) & 0o77;
            }
            w += c * Math.pow(2, shift);
            shift -= bits;
            n++;
            if (shift < 0) {
                this.genWord(w);
                n = 0;
            }
        }
        if (n) this.genWord(w);
    }

    /**
     * genWord(w)
     *
     * @this {Macro10}
     * @param {number} w
     */
    genWord(w)
    {
        this.aWords[this.nAddr++] = w;
    }
}

Macro10.PSEUDO_OP = {
    ASCII:  "ASCII",
    ASCIZ:  "ASCIZ",
    SIXBIT: "SIXBIT",
    DEFINE: "DEFINE",
    LITERAL:"LITERAL",
    IFE:    "IFE",
    REPEAT: "REPEAT",
    PAGE:   "PAGE",
    SUBTTL: "SUBTTL",
};
