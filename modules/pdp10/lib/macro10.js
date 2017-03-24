/**
 * @fileoverview A MACRO-10 "work-alike" Mini-Assembler for the PDP-10
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
 * Elements of tblMacros.
 *
 * NOTE: The nLine property is not required; it's added for improved error reporting.
 *
 * @typedef {{
 *      name:(string),
 *      nOperand:(number),
 *      aParms:(Array.<string>),
 *      aDefaults:(Array.<string>),
 *      aValues:(Array.<string>),
 *      sText:(string),
 *      nLine:(number)
 * }}
 */
var Mac;

/**
 * Elements of tblSymbols.
 *
 * NOTE: The nLine property is not required; it's added for improved error reporting.
 *
 * @typedef {{
 *      name:(string),
 *      value:(number),
 *      nType:(number),
 *      nLine:(number)
 * }}
 */
var Sym;

/**
 * Elements of aLiterals.
 *
 * @typedef {{
 *      name:(string),
 *      aWords:(Array.<number>),
 *      aFixups:(Array.<string>)
 * }}
 */
var Lit;

/**
 * Elements of stackScopes.
 *
 * @typedef {{
 *      name:(string),
 *      aWords:(Array.<number>),
 *      aFixups:(Array.<string>),
 *      nLocation:(number),
 *      nLocationScope:(number),
 *      nLine:(number)
 * }}
 */
var Scope;

/**
 * @class Macro10
 * @property {string} sURL
 * @property {number} nAddr
 * @property {string} sOptions
 * @property {DebuggerPDP10} dbg
 * @property {function(...)} done
 * @property {number} iURL
 * @property {Array.<string>} asURLs
 * @property {Array.<string>} asLines
 * @property {number|null|undefined} nAddrStart
 */
class Macro10 {
    /**
     * Macro10(sURL, nAddr, sOptions, dbg, done)
     *
     * A "mini" version of DEC's MACRO-10 assembler, with just enough features to support the handful
     * of DEC diagnostic source code files that we choose to throw at it.
     *
     * Requests the resource(s) specified by sURL; multiple resources can be requested by separating
     * them with semicolons.
     *
     * The done() callback is called after the resource(s) have been loaded and parsed.  The caller
     * must use other methods to obtain further results (eg, getBin()).
     *
     * The callback includes a non-zero error code if there was an error (and the URL):
     *
     *      done(nErrorCode, sURL)
     *
     * We rely on the calling component (dbg) to provide a variety of helper services (eg, println(),
     * parseExpression(), etc).  This is NOT a subclass of Component, so Component services are not part
     * of this class.
     *
     * @this {Macro10}
     * @param {string} sURL (the URL(s) of the resource to be assembled)
     * @param {number|null} nAddr (the absolute address to assemble the code at, if any)
     * @param {string|null} sOptions (zero or more letter codes to control the assembly process)
     * @param {DebuggerPDP10} dbg (used to provide helper services to the Macro10 class)
     * @param {function(...)} done
     */
    constructor(sURL, nAddr, sOptions, dbg, done)
    {
        this.sURL = sURL;
        this.nAddr = nAddr || 0;
        this.sOptions = sOptions || "";
        this.dbg = dbg;
        this.done = done;

        /*
         * The next set of properties may be updated by the assembly process and queried by the caller.
         */
        this.nAddrStart = null;

        this.println("starting PCjs MACRO-10 Mini-Assembler...");

        /*
         * Initialize all the tables that MACRO-10 uses.
         *
         * The Macros (tblMacros) and Symbols (tblSymbols) tables are fairly straightforward: they are
         * indexed by a macro or symbol name, and each element is a Mac or Sym object, respectively.
         *
         * We also treat REPEAT blocks and CONDITIONAL (eg, IFE) blocks like macros, except that they are
         * anonymous, parameter-less, and immediately invoked.  REPEAT blocks are always immediately invoked
         * (repeatedly, based on the repeat count), whereas CONDITIONAL blocks are either immediately
         * invoked if the associated condition is true or skipped if the condition is false.
         *
         * Finally, we have LITERAL blocks, which are semi-anonymous (we give each one an auto-generated
         * name based on the current location) and are automatically but not immediately invoked.  Instead,
         * after we've finished processing all the lines in the original input file, we run through all
         * the LITERAL blocks in tblMacros and process the associated statement(s) at that time.
         *
         * Macros have the name that was assigned to them, REPEAT and conditional blocks have generated names
         * that match the pseudo-op (eg, "?REPEAT", "?IFE"), and LITERAL blocks have generated location-based
         * names.  All generated names use a leading question mark ('?') so that they don't conflict with
         * normal MACRO-10 symbols.
         */

        /**
         * @type {Object.<Mac>}
         */
        this.tblMacros = {};

        /**
         * @type {Object.<Sym>}
         */
        this.tblSymbols = {};

        /**
         * @type {Array.<Lit>}
         */
        this.aLiterals = [];            // array of literals

        /**
         * This keeps track of symbols suffixed with '#', which are later assembled into a variable pool,
         * following the literal pool.
         *
         * @type {Array.<string>}
         */
        this.aVariables = [];

        /**
         * @type {Array.<number>}
         */
        this.aWords = [];               // filled in by the various genXXX() functions

        /**
         * This sparse array is indexed by location, and each used entry contains an undefined symbol that
         * must be evaluated to fully resolve the word at the corresponding location.  NOTE: There's no requirement
         * that the array be sparse; we could certainly fill each unused entry with null (ie, for locations that
         * don't require a fixup).
         *
         * @type {Array.<string>}
         */
        this.aFixups = [];

        this.nLine = 0;
        this.nError = 0;
        this.nLiteral = 0;              // used to uniquely number literals

        /**
         * @type {number}
         */
        this.nLocation = this.nAddr;    // advanced by the various genXXX() functions

        /**
         * @type {number}
         */
        this.nLocationScope = -1;

        /**
         * @type {Array.<Scope>}
         */
        this.stackScopes = [];

        this.sOperator = null;          // the active operator, if any
        this.nMacroDef = 0;             // the active macro definition state
        this.sMacroDef = null;          // the active macro definition name
        this.chMacroOpen = this.chMacroClose = '';

        /*
         * This regular expression breaks each MACRO-10 line into the following elements:
         *
         *      [1]: label (with trailing semicolon), if any
         *      [2]: operator (eg, opcode mnemonic or pseudo-op), if any
         *      [3]: operator/operand whitespace separator, if any
         *      [4]: operand(s), if any
         *      [5]: comment, if any
         */
        this.reLine = /^[ \t]*([A-Z$%.?][0-9A-Z$%.]*:|)[ \t]*([A-Z$%.][0-9A-Z$%.]*|)([ \t]*)([^;]+|)(;?[\s\S]*)/i;

        this.macroCall = null;          // the active macro being called, if any

        /**
         * If an ASCII/ASCIZ/SIXBIT pseudo-op is active, chASCII is set to the separator
         * and sASCII collects the intervening character(s).
         *
         * @type {null|string}
         */
        this.chASCII = null;

        /**
         * @type {string}
         */
        this.sASCII = "";

        /**
         * @type {Array.<string>}
         */
        this.asLines = [];

        this.iURL = 0;
        this.asURLs = sURL.split(';');

        this.loadNextResource();
    }

    /**
     * loadNextResource()
     *
     * @this {Macro10}
     */
    loadNextResource()
    {
        if (this.iURL == this.asURLs.length) {
            this.done(this.parseResources());
            return;
        }

        var macro10 = this;
        var sURL = this.asURLs[this.iURL++];

        this.println("loading " + Str.getBaseName(sURL));

        /*
         * We know that local resources ending with ".MAC" are actually stored with a ".txt" extension.
         */
        if (sURL.slice(-4).toUpperCase() == ".MAC") sURL += ".txt";

        Web.getResource(sURL, null, true, function processMacro10(sFile, sResource, nErrorCode) {
            if (nErrorCode) {
                macro10.done(nErrorCode, sFile);
                return;
            }
            var sText = sResource;
            if (Str.endsWith(sFile, ".html")) {
                /*
                 * We want to parse ONLY the text between <PRE>...</PRE> tags, and eliminate any HTML entities.
                 */
                sText = "";
                var match, re = /<pre>([\s\S]*?)<\/pre>/gi;
                while (match = re.exec(sResource)) {
                    var s = match[1];
                    if (s.indexOf('&') >= 0) s = s.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&');
                    sText += s;
                }
                match = sText.match(/&[a-z]+;/i);
                if (match) macro10.warning("unrecognized HTML entity: " + match[0]);
            }

            macro10.asLines = macro10.asLines.concat(sText.split(/(\r?\n)/));

            setTimeout(function() {
                macro10.loadNextResource();
            }, 0);
        });
    }

    /**
     * getBin()
     *
     * Service for the Debugger to obtain the data after a (hopefully) successful assembly process.
     *
     * @this {Macro10}
     * @return {Array.<number>}
     */
    getBin()
    {
        return this.aWords;
    }

    /**
     * parseResources()
     *
     * Begin the assembly process.
     *
     * @this {Macro10}
     * @return {number}
     */
    parseResources()
    {
        var macro10 = this;

        /*
         * If the "preprocess" option is set, then just return the plain text we retrieved.
         */
        if (this.sOptions.indexOf('p') >= 0) {
            this.println(this.asLines.join());
            return 0;
        }

        var a = this.dbg.resetVariables();
        try {
            for (let i = 0; i < this.asLines.length; i += 2) {
                this.nLine++;
                /*
                 * Since, at this early stage, I'm not sure whether all the resources I'm interested in
                 * assembling have had their original CR/LF line endings preserved (eg, some files may have
                 * been converted to LF-only line endings), I'm going to skip over whatever line endings
                 * are in the array and insert my own uniform CR/LF sequences.
                 */
                if (!this.parseLine(this.asLines[i] + '\r\n')) break;
                /*
                 * When an END statement is encountered, nAddrStart will change from null to either undefined
                 * or a starting address.
                 */
                if (this.nAddrStart !== null) break;
            }

            if (this.nMacroDef) {
                this.error("open block from line " + this.tblMacros[this.sMacroDef].nLine);
            }

            if (this.stackScopes.length) {
                this.error("open scope from line " + this.stackScopes[0].nLine);
            }

            for (let i = 0; i < this.aLiterals.length; i++) {
                let lit = this.aLiterals[i];
                this.addSymbol(lit.name, this.nLocation, Macro10.SYMTYPE.LABEL);
                lit.aWords.forEach(function(w, nLocation) {
                    macro10.genWord(w, lit.aFixups[nLocation]);
                });

                /*
                 * TODO: Add support for "literal collapsing"; ie, if two or more literals generate the same
                 * set of values, then all instances after the first should refer back to the first (subject to
                 * exceptions identified by MACRO-10: eg, "literals that contain errors, undefined expressions,
                 * or EXTERNAL symbols.")
                 */
            }

            for (let i = 0; i < this.aVariables.length; i++) {
                let name = this.aVariables[i];
                let macro = this.tblMacros[name];
                if (!macro) {
                    /*
                     * This is more of an assert(), because it should never happen, regardless of input.
                     */
                    this.error("missing definition for variable: " + name);
                    continue;
                }
                this.parseText(macro.sText);
            }

            this.aFixups.forEach(function processFixup(sValue, nLocation){
                let value = macro10.parseExpression(sValue, undefined, nLocation);
                if (value === undefined) {
                    macro10.error("unable to parse expression: " + sValue);
                    return;
                }
                value += macro10.aWords[nLocation];
                macro10.aWords[nLocation] = macro10.truncate(value, nLocation);
            });

        } catch(err) {
            this.println(err.message);
            this.nError = -1;
        }
        this.dbg.restoreVariables(a);
        return this.nError;
    }

    /**
     * parseLine(sLine, aParms, aValues, aDefaults)
     *
     * @this {Macro10}
     * @param {string} sLine (line contents)
     * @param {Array.<string>} [aParms]
     * @param {Array.<string>} [aValues]
     * @param {Array.<string>} [aDefaults]
     * @return {boolean}
     */
    parseLine(sLine, aParms, aValues, aDefaults)
    {
        var i;
        if (this.nMacroDef) {
            if (this.nMacroDef == 1) {
                i = sLine.indexOf(this.chMacroOpen);
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

        var fParse = true;
        var sLabel, sOperator = "", sSeparator, sOperands, sRemainder;

        while (fParse) {
            var matchLine = sLine.match(this.reLine);
            if (!matchLine || matchLine[5] && matchLine[5].slice(0, 1) != ';') {
                this.error("failed to parse line: " + sLine);
                return false;
            }
            fParse = false;
            sOperator = matchLine[2].toUpperCase();
            if (sOperator == Macro10.PSEUDO_OP.IRP || sOperator == Macro10.PSEUDO_OP.IRPC) {
                aParms = null;
            }
            if (aParms) {
                for (var iParm = 0; iParm < aParms.length; iParm++) {
                    var sParm = aParms[iParm];
                    var sReplace = aValues[iParm] || aDefaults[iParm] || "";
                    var iSearch = 0;
                    var iLimit = sLine.length - matchLine[5].length;    // set the limit at the start of the comment, if any
                    while (iSearch < iLimit) {
                        var iMatch = sLine.indexOf(sParm, iSearch);
                        if (iMatch < 0) break;
                        iSearch = iMatch + 1;
                        var iMatchEnd = iMatch + sParm.length;
                        var chPre = '', chPost = '';
                        if ((!iMatch || !this.isSymbolChar(chPre = sLine[iMatch - 1])) && (iMatchEnd >= sLine.length || !this.isSymbolChar(chPost = sLine[iMatchEnd]))) {
                            /*
                             * If the "concatenation character" (') appears before (or after) the symbol being replaced, remove it.
                             */
                            if (chPre == "'") iMatch--;
                            if (chPost == "'") iMatchEnd++;
                            sLine = sLine.substr(0, iMatch) + sReplace + sLine.substr(iMatchEnd);
                            iSearch = iMatch + sReplace.length;
                            fParse = true;
                        }
                    }
                }
                aParms = null;
            }
        }

        sLabel = matchLine[1];
        sSeparator = matchLine[3];
        sOperands = matchLine[4].trim();
        sRemainder = matchLine[4] + matchLine[5];

        if (sLabel) {
            sLabel = sLabel.slice(0, -1);
            this.addSymbol(sLabel, this.nLocation, Macro10.SYMTYPE.LABEL);
        }

        var matchOp;
        if (sOperator && (matchOp = sOperands.match(/^([=:]+)(.*)/))) {
            var nType = 0;
            sLabel = sOperator;
            sOperator = matchOp[1];
            sOperands = matchOp[2];
            if (sOperator == '==') {
                nType |= Macro10.SYMTYPE.PRIVATE;
            }
            else if (sOperator == '=:') {
                nType |= Macro10.SYMTYPE.INTERNAL;
            }
            this.addSymbol(sLabel, sOperands, nType);
            sOperator = sOperands = "";
        }

        if (!sOperator && !sOperands) return true;

        this.sOperator = sOperator;

        /*
         * Check the operands for a literal.  If the line contains and/or ends with a literal
         * we record it and replace it with an internal symbol.  We assume only one literal per line,
         * especially since they can be open-ended (ie, continue for multiple lines).
         */
        var sLiteral = this.getLiteral(sOperands);
        if (sLiteral) {
            sOperands = sOperands.replace(sLiteral, this.addMacro(Macro10.PSEUDO_OP.LITERAL, this.getLiteral(sRemainder)));
        }

        /*
         * Check the operands for any reserved symbols (ie, symbols with a trailing '#', such as "USER#").
         */
        var sSymbol;
        while (sSymbol = this.getReserved(sOperands)) {
            sOperands = sOperands.replace(sSymbol, sSymbol.slice(0, -1));
        }

        if (!this.parseMacro(sOperator, sOperands)) {

            switch (sOperator) {
            case Macro10.PSEUDO_OP.ASCII:
            case Macro10.PSEUDO_OP.ASCIZ:
            case Macro10.PSEUDO_OP.SIXBIT:
                this.addASCII(sRemainder);
                break;

            case Macro10.PSEUDO_OP.END:
                this.addEND(sOperands);
                break;

            case Macro10.PSEUDO_OP.EXP:
                this.addEXP(sOperands);
                break;

            case Macro10.PSEUDO_OP.XWD:
                this.addXWD(sOperands);
                break;

            case Macro10.PSEUDO_OP.DEFINE:
            case Macro10.PSEUDO_OP.IFE:
            case Macro10.PSEUDO_OP.IFN:
            case Macro10.PSEUDO_OP.IRP:
            case Macro10.PSEUDO_OP.IRPC:
            case Macro10.PSEUDO_OP.REPEAT:
                this.addMacro(sOperator, sRemainder);
                break;

            case Macro10.PSEUDO_OP.PAGE:    // TODO
            case Macro10.PSEUDO_OP.SUBTTL:  // TODO
            case Macro10.PSEUDO_OP.TITLE:   // TODO
                break;

            default:
                this.addWord(sOperator, sSeparator, sOperands);
                break;
            }
        }
        return true;
    }

    /**
     * parseLiteral(name, sText)
     *
     * This is like parseText() except that we first set up a new scope, which includes new aWords and aFixups
     * arrays.
     *
     * @this {Macro10}
     * @param {string} name
     * @param {string} sText
     */
    parseLiteral(name, sText)
    {
        this.pushScope(name);
        this.parseText(sText);
        this.popScope();
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
        var i;
        var macro = this.tblMacros[name];
        if (!macro) return false;

        if (sOperands != null) {
            var macroPrev = this.macroCall;
            this.macroCall = macro;
            macro.aValues = this.getValues(sOperands, true);
            this.parseText(macro.sText, macro.aParms, macro.aValues, macro.aDefaults);
            /*
             * WARNING: Our simplistic approach to macro expansion and processing means that recursive macros
             * (such as the SHIFT macro in /apps/pdp10/tests/macro10/TEXT.MAC) could blow the stack.  Nothing bad
             * should happen (other than a JavaScript stack limit exception aborting the assembly), but it begs
             * the question: did MACRO-10 perform any tail recursion optimizations or other tricks to prevent macros
             * from running amok, or could they blow MACRO-10's stack just as easily?
             */
            this.macroCall = macroPrev;
            return true;
        }

        if (name[0] != '?') return false;

        var sOperator = name.substr(1);

        switch(sOperator) {
        case Macro10.PSEUDO_OP.IFE:
            if (!macro.nOperand) {
                this.parseText(macro.sText);
            }
            break;

        case Macro10.PSEUDO_OP.IFN:
            if (macro.nOperand) {
                this.parseText(macro.sText);
            }
            break;

        case Macro10.PSEUDO_OP.IRP:
        case Macro10.PSEUDO_OP.IRPC:
            for (i = 0; i < macro.aValues.length; i++) {
                this.parseText(macro.sText, macro.aParms, [macro.aValues[i]], []);
            }
            break;

        case Macro10.PSEUDO_OP.REPEAT:
            while (macro.nOperand-- > 0) {
                this.parseText(macro.sText);
            }
            break;

        default:
            this.parseLiteral(name, macro.sText);
            break;
        }
        return true;
    }

    /**
     * parseText(sText, aParms, aValues, aDefaults)
     *
     * @this {Macro10}
     * @param {string} sText
     * @param {Array.<string>} [aParms]
     * @param {Array.<string>} [aValues]
     * @param {Array.<string>} [aDefaults]
     */
    parseText(sText, aParms, aValues, aDefaults)
    {
        var asLines = sText.split(/\r?\n/);
        for (var iLine = 0; iLine < asLines.length; iLine++) {
            var sLine = asLines[iLine] + '\r\n';
            if (!this.parseLine(sLine, aParms, aValues, aDefaults)) break;
        }
    }

    /**
     * pushScope(name)
     *
     * @this {Macro10}
     * @param {string} name
     */
    pushScope(name)
    {
        this.stackScopes.push(
            {name, aWords: this.aWords, aFixups: this.aFixups, nLocation: this.nLocation, nLocationScope: this.nLocationScope, nLine: this.nLine}
        );
        this.aWords = [];
        this.aFixups = [];
        this.nLocationScope = this.nLocation;
        this.nLocation = 0;
    }

    /**
     * popScope()
     *
     * @this {Macro10}
     */
    popScope()
    {
        if (!this.stackScopes.length) {
            this.error("scope nesting error");
            return;
        }
        var name = this.stackScopes[this.stackScopes.length - 1].name;
        this.aLiterals.push({name, aWords: this.aWords, aFixups: this.aFixups});
        var scope = this.stackScopes.pop();
        this.aWords = scope.aWords;
        this.aFixups = scope.aFixups;
        this.nLocation = scope.nLocation;
        this.nLocationScope = scope.nLocationScope;
        if (!this.stackScopes.length && this.nLocationScope != -1) {
            this.error("scope restore error");
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
     * getExpression(sOperands, sDelim)
     *
     * @this {Macro10}
     * @param {string} sOperands
     * @param {string} [sDelim] (eg, comma, closing parenthesis)
     * @return {string|null} (if the operands begin with an expression, return it)
     */
    getExpression(sOperands, sDelim = ",")
    {
        var i = 0;
        var fQuotes = false;
        var sOperand = null;
        var cNesting = 0;
        while (i < sOperands.length) {
            var ch = sOperands[i++];
            if (ch == '"') {
                fQuotes = !fQuotes;
                continue;
            }
            if (fQuotes) continue;
            if (sDelim.indexOf(ch) >= 0) {
                i--;
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
        }
        if (!cNesting) {
            sOperand = sOperands.substr(0, i);
        }
        else if (cNesting > 0) {
            this.error("extra bracket(s): " + sOperands);
        }
        return sOperand;
    }

    /**
     * parseExpression(sOperand, fPass1, nLocation)
     *
     * This is a wrapper around the Debugger's parseExpression() function to take care of some
     * additional requirements we have, such as interpreting a period as the current location and
     * interpreting two expressions separated by two commas as the left and right 18-bit halves
     * of a 36-bit value.
     *
     * @this {Macro10}
     * @param {string} sOperand
     * @param {boolean|undefined} [fPass1]
     * @param {number|undefined} [nLocation]
     * @return {number|undefined}
     */
    parseExpression(sOperand, fPass1, nLocation)
    {
        var result;
        /*
         * Check for the "double comma" syntax that MACRO-10 uses to express a 36-bit value as two 18-bit halves,
         * and invoke ourselves recursively for each half.
         */
        var match = sOperand.match(/^([^,]*),,([^,]*)$/);
        if (!match) {
            if (nLocation === undefined) nLocation = (this.nLocationScope >= 0? this.nLocationScope : this.nLocation);
            /*
             * Check for the "period" syntax that MACRO-10 uses to represent the value of the current location.
             * The Debugger's parseInstruction() method understands that syntax, but its parseExpression() method
             * does not.
             *
             * Note that the Debugger's parseInstruction() replaces any period not PRECEDED by a decimal
             * digit with the current address, because our Debuggers' only other interpretation of a period
             * is as the suffix of a decimal integer, whereas MACRO-10's only other interpretation of a period
             * is (I think) as the decimal point within a floating-point number, so here we only replace
             * periods that are not FOLLOWED by a decimal digit.
             */
            result = this.dbg.parseExpression(sOperand.replace(/\.([^0-9]|$)/g, this.dbg.toStrBase(nLocation, -1) + "$1"), fPass1);
            if (result === undefined) {
                this.error("error parsing expression: " + sOperand);
            }
        } else {
            var wLeft = match[1]? this.parseExpression(match[1], fPass1, nLocation) : 0;
            if (wLeft !== undefined) {
                var wRight = match[2]? this.parseExpression(match[2], fPass1, nLocation) : 0;
                if (wRight !== undefined) {
                    /*
                     * NOTE: These must be combined as UNSIGNED values, so that's what we tell truncate() to produce.
                     */
                    result = this.dbg.truncate(wLeft, 18, true) * Math.pow(2, 18) + this.dbg.truncate(wRight, 18, true);
                }
            }
        }
        return result;
    }

    /**
     * getLiteral(sOperands)
     *
     * Check the operands for a literal (ie, an expression starting with a square bracket).
     *
     * @this {Macro10}
     * @param {string} sOperands
     * @return {string} (if the operands contain a literal, return it)
     */
    getLiteral(sOperands)
    {
        var cNesting = 0;
        var sLiteral = "";
        var i = 0, iBegin = -1, iEnd = sOperands.length;
        while (i < sOperands.length) {
            var ch = sOperands[i];
            if (ch == ';') break;
            if (ch == '[') {
                if (!cNesting++) iBegin = i;
            }
            i++;
            if (ch == ']' && --cNesting <= 0) {
                iEnd = i;
                break;
            }
        }
        if (cNesting < 0) {
            this.error("missing bracket(s): " + sOperands);
        }
        if (iBegin >= 0) {
            sLiteral = sOperands.substr(iBegin, iEnd - iBegin);
        }
        return sLiteral;
    }

    /**
     * getDefaults(aParms)
     *
     * Check the given array of macro parameters for default values, remove them, and return them in a parallel array.
     *
     * @this {Macro10}
     * @param {Array.<string>} aParms
     * @return {Array.<string>}
     */
    getDefaults(aParms)
    {
        var aDefaults = [];
        for (var i = 0; i < aParms.length; i++) {
            var j = aParms[i].indexOf('<');
            if (j >= 0) {
                var k = aParms[i].lastIndexOf('>');
                if (k < 0) k = aParms[i].length;
                aDefaults[i] = aParms[i].substr(j, k - j);
                aParms[i] = aParms[i].substr(0, j);
            }
        }
        return aDefaults;
    }

    /**
     * getReserved(sOperands)
     *
     * Check the operands for any reserved symbols (ie, symbols with a trailing '#', such as "USER#").
     *
     * @this {Macro10}
     * @param {string} sOperands
     * @return {string|null} (if the operands contain a reserved symbol, return it)
     */
    getReserved(sOperands)
    {
        var match, sReserved = null;
        if (match = sOperands.match(/([A-Z$%.][0-9A-Z$%.]*)#/i)) {
            sReserved = match[0];
            var sLabel = match[1];
            var name = '?' + sLabel;
            if (this.tblMacros[name] !== undefined) {
                this.error("reserved symbol redefined: " + sReserved);
            }
            var aParms, aDefaults, aValues;
            aParms = aDefaults = aValues = [];
            this.tblMacros[name] = {
                name: name,
                nOperand: Macro10.MACRO_OP.RESERVED,
                aParms,
                aDefaults,
                aValues,
                sText: sLabel + ": 0",
                nLine: this.nLine
            };
            this.aVariables.push(name);
        }
        return sReserved;
    }

    /**
     * getSymbol(sOperands)
     *
     * Check the operands for a symbol.  TODO: Use this method?
     *
     * @this {Macro10}
     * @param {string} sOperands
     * @return {string|null} (if the operands contain a symbol, return it)
     */
    getSymbol(sOperands)
    {
        var match = sOperands.match(/([A-Z$%.][0-9A-Z$%.]*)/i);
        return match && match[1] || null;
    }

    /**
     * getValues(sOperands, fParens)
     *
     * @this {Macro10}
     * @param {string} sOperands
     * @param {boolean} [fParens] (true to strip any parens from around the entire operands)
     * @return {Array.<string>}
     */
    getValues(sOperands, fParens)
    {
        var aValues = [];
        if (fParens) sOperands = sOperands.replace(/^\(?(.*?)\)?$/, "$1");
        while (sOperands) {
            sOperands = sOperands.trim();
            var sOperand = this.getExpression(sOperands);
            if (!sOperand) break;
            aValues.push(sOperand);
            sOperands = sOperands.substr(sOperand.length + 1);
        }
        return aValues;
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
     * addMacro(sOperator, sOperands)
     *
     * If sOperator is DEFINE, then a macro definition is expected.  If it's REPEAT, then we're starting a
     * REPEAT block instead.
     *
     * REPEAT blocks piggy-back on this code because they're essentially anonymous immediately-invoked macros;
     * we use an illegal MACRO-10 symbol ('?REPEAT') to name the anonymous macro while it's being defined, and the
     * macro's nOperand field will contain the repeat count.
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
        var i, match, name, nOperand, aParms, aDefaults, aValues, iMatch;

        this.chMacroOpen = '<';
        this.chMacroClose = '>';
        aParms = aDefaults = aValues = [];

        if (sOperator == Macro10.PSEUDO_OP.DEFINE) {
            /*
             * This is a DEFINE (macro) block.
             */
            match = sOperands.match(/([A-Z$%.][0-9A-Z$%.]*)\s*(\([^)]*\)|)\s*(<|)([\s\S]*)/i);
            if (!match) {
                this.error("unrecognized " + sOperator + ": " + sOperands);
                return sOperands;
            }
            name = match[1];
            /*
             * If this macro has defined parameters, parse them (and any defaults) now.
             */
            if (match[2]) {
                aParms = this.getValues(match[2], true);
                aDefaults = this.getDefaults(aParms);
            }
            nOperand = Macro10.MACRO_OP.DEFINE;
            iMatch = 3;
        }
        else if (sOperator == Macro10.PSEUDO_OP.LITERAL) {
            /*
             * This is a LITERAL block.
             */
            this.chMacroOpen = '[';
            this.chMacroClose = ']';
            name = '?' + Str.toDec(++this.nLiteral, 5);
            if (this.tblMacros[name] !== undefined) {
                this.error("literal symbol redefined: " + name);
            }
            match = [sOperands[0], sOperands.substr(1)];
            nOperand = Macro10.MACRO_OP.LITERAL;
            iMatch = 0;
        }
        else if (sOperator == Macro10.PSEUDO_OP.IRP || sOperator == Macro10.PSEUDO_OP.IRPC) {
            /*
             * IRP (and IRPC) blocks are very similar to DEFINE blocks, but they define exactly ONE macro parameter
             * with NO parentheses (whereas regular macros always define their parameters, if any, WITH parentheses),
             * and then the IRP (or IRPC) block is immediately invoked with the corresponding value from the
             * enclosing macro.
             */
            if (!this.macroCall) {
                this.error(sOperator + " outside of macro");
            }
            match = sOperands.match(/([A-Z$%.][0-9A-Z$%.]*)\s*,\s*(<|)([\s\S]*)/i);
            if (!match) {
                this.error("unrecognized " + sOperator + ": " + sOperands);
                return sOperands;
            }
            for (i = 0; i < this.macroCall.aParms.length; i++) {
                if (match[1] == this.macroCall.aParms[i]) break;
            }
            if (i == this.macroCall.aParms.length) {
                this.error("invalid " + sOperator + " parameter: " + match[1]);
                return sOperands;
            }
            name = '?' + sOperator;
            aParms = [match[1]];
            if (sOperator == Macro10.PSEUDO_OP.IRPC) {
                aValues = this.macroCall.aValues[i].split("");
            } else {
                aValues = this.getValues(this.macroCall.aValues[i]);
            }
            nOperand = aValues.length;
            iMatch = 2;
        }
        else {
            /*
             * This must be a REPEAT or CONDITIONAL block.
             */
            var sOperand = this.getExpression(sOperands);
            if (!sOperand) {
                this.error("missing " + sOperator + " expression: " + sOperands);
                return sOperands;
            }
            sOperands = sOperands.substr(sOperand.length + 1);
            sOperand = sOperand.trim();
            match = sOperands.match(/\s*(<|)([\s\S]*)/i);
            name = '?' + sOperator;
            /*
             * The expression is either a repeat count or a condition.  Either way, we must be able to
             * resolve it now, so we don't set fPass1 (but that doesn't mean it's the second pass, either).
             */
            nOperand = this.parseExpression(sOperand) || 0;
            iMatch = 1;
        }

        /*
         * Now we need to set a global parsing state: we are either about to receive a macro definition on
         * subsequent lines (1), the definition has already started on the current line (2), or the definition
         * started and ended on the current line (0).
         */
        name = name.toUpperCase();
        this.nMacroDef = 1;
        this.sMacroDef = name;
        this.tblMacros[name] = {name, nOperand, aParms, aDefaults, aValues, sText: "", nLine: this.nLine};

        if (match[iMatch]) {                            // if there is an opening bracket
            this.nMacroDef = 2;                         // then the macro definition has started
            this.appendMacro(match[iMatch + 1]);
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
     * addEND()
     *
     * Processes the END pseudo-op.
     *
     * @this {Macro10}
     * @param {string} sOperands
     */
    addEND(sOperands)
    {
        if (!sOperands) {
            this.nAddrStart = this.nAddr;
        } else {
            this.nAddrStart = this.parseExpression(sOperands, true);
            if (this.nAddrStart === undefined) {
                this.error("unrecognized expression: " + sOperands);
            }
        }
    }

    /**
     * addEXP()
     *
     * Processes the EXP pseudo-op.
     *
     * @this {Macro10}
     * @param {string} sOperands
     */
    addEXP(sOperands)
    {
        var w = this.parseExpression(sOperands, true);
        if (w !== undefined) {
            this.genWord(w, this.dbg.sUndefined);
        } else {
            this.error("unrecognized expression: " + sOperands);
        }
    }

    /**
     * addSymbol(name, value, nType)
     *
     * @this {Macro10}
     * @param {string} name
     * @param {number|string} value
     * @param {number} [nType]
     */
    addSymbol(name, value, nType = 0)
    {
        name = name.toUpperCase().substr(0, 6);
        if ((nType & Macro10.SYMTYPE.LABEL) && this.tblSymbols[name] !== undefined) {
            this.error("label " + name + " redefined");
            return;
        }
        if (typeof value == 'string') {
            var v = this.parseExpression(value);
            if (v === undefined) {
                this.error("parseExpression(" + value + ")");
                return;
            }
            value = v;
        }
        var sym = this.tblSymbols[name];
        if (sym) {
            sym.value = value;
            sym.nType = nType;
            sym.nLine = this.nLine;
        } else {
            this.tblSymbols[name] = {name, value, nType, nLine: this.nLine};
        }
        this.dbg.setVariable(name, value);
    }

    /**
     * addWord(sOperator, sSeparator, sOperands)
     *
     * @this {Macro10}
     * @param {string} sOperator
     * @param {string} sSeparator
     * @param {string} sOperands
     */
    addWord(sOperator, sSeparator, sOperands)
    {
        var w = -1;

        var sExp = (sOperator + sSeparator + sOperands).trim();

        if (sOperands.indexOf(",,") < 0) {
            w = this.dbg.parseInstruction(sOperator, sOperands, this.nLocation, true);
        }

        if (w < 0) w = this.parseExpression(sExp, true);

        if (w !== undefined) {
            this.genWord(w, this.dbg.sUndefined);
        } else {
            this.error("unrecognized expression: " + sExp);
        }
    }

    /**
     * addXWD()
     *
     * Processes the XWD pseudo-op.
     *
     * Since the XWD pseudo-op appears to be equivalent to two values separated by two commas, which addEXP() must also
     * support, we can piggy-back on addExp().
     *
     * @this {Macro10}
     * @param {string} sOperands
     */
    addXWD(sOperands)
    {
        this.addEXP(sOperands.replace(",", ",,"));
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
     * genWord(value, sFixup)
     *
     * @this {Macro10}
     * @param {number} value (default value for the current location)
     * @param {string|null|undefined} [sFixup] (optional fixup value to evaluate later)
     */
    genWord(value, sFixup)
    {
        this.aWords[this.nLocation] = this.truncate(value);
        if (sFixup != null) this.aFixups[this.nLocation] = sFixup;
        this.nLocation++;
    }

    /**
     * truncate(value, nLocation)
     *
     * @this {Macro10}
     * @param {number} value
     * @param {number} [nLocation]
     * @return {number}
     */
    truncate(value, nLocation = this.nLocation)
    {
        var w = this.dbg.truncate(value || 0, 36, true);
        if (value < -PDP10.INT_LIMIT || value >= PDP10.WORD_LIMIT) {
            this.warning("truncated value " + Str.toOct(value) + " at location " + Str.toOct(nLocation) + " to " + Str.toOct(w));
        }
        return w;
    }

    /**
     * println(s)
     *
     * @this {Macro10}
     * @param {string} s
     */
    println(s)
    {
        if (!this.dbg) {
            console.log(s);
        } else {
            this.dbg.println(s);
        }
    }
}

Macro10.SYMTYPE = {
    LABEL:      0x01,
    PRIVATE:    0x02,
    INTERNAL:   0x04
};

Macro10.PSEUDO_OP = {
    ASCII:      "ASCII",
    ASCIZ:      "ASCIZ",
    DEFINE:     "DEFINE",
    END:        "END",
    EXP:        "EXP",
    IFE:        "IFE",
    IFN:        "IFN",
    IRP:        "IRP",
    IRPC:       "IRPC",
    LITERAL:    "LITERAL",      // this is a pseudo-pseudo-op, used for internal purposes
    PAGE:       "PAGE",
    REPEAT:     "REPEAT",
    SIXBIT:     "SIXBIT",
    SUBTTL:     "SUBTTL",
    TITLE:      "TITLE",
    XWD:        "XWD"
};

/*
 * This enumerates the kinds of macros stored in tblMacros.  The nOperand field should contain
 * one of these values, unless it's a REPEAT or CONDITIONAL block, in which case it will contain
 * either a repeat count or conditional value.
 */
Macro10.MACRO_OP = {
    DEFINE:         -1,
    LITERAL:        -2,
    RESERVED:       -3,
};
