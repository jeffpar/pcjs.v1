/**
 * @fileoverview Common PCjs Debugger support.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jun-21
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
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

if (DEBUGGER) {
    if (NODE) {
        var str         = require("../../shared/lib/strlib");
        var Component   = require("../../shared/lib/component");
    }
}

/**
 * Debugger Address Object
 *
 * This is the basic structure; other debuggers may extend it.
 *
 *      addr            address
 *      fTemporary      true if this is a temporary breakpoint address
 *      sCmd            set for breakpoint addresses if there's an associated command string
 *      aCmds           preprocessed commands (from sCmd)
 *
 * @typedef {{
 *      addr:(number|undefined),
 *      fTemporary:(boolean|undefined),
 *      sCmd:(string|undefined),
 *      aCmds:(Array.<string>|undefined)
 * }} DbgAddr
 */
var DbgAddr;

/**
 * Debugger(parmsDbg)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsDbg
 *
 * The Debugger component is a shared component containing a subset of functionality used by
 * the other CPU-specific Debuggers (eg, DebuggerX86).  Over time, the goal is to factor out as
 * much common debugging support as possible from those components into this one.
 */
function Debugger(parmsDbg)
{
    if (DEBUGGER) {

        Component.call(this, "Debugger", parmsDbg, Debugger);

        /*
         * These keep track of instruction activity, but only when tracing or when Debugger checks
         * have been enabled (eg, one or more breakpoints have been set).
         *
         * They are zeroed by the reset() notification handler.  cInstructions is advanced by
         * stepCPU() and checkInstruction() calls.  nCycles is updated by every stepCPU() or stop()
         * call and simply represents the number of cycles performed by the last run of instructions.
         */
        this.nCycles = 0;
        this.cOpcodes = this.cOpcodesStart = 0;

        /*
         * fAssemble is true when "assemble mode" is active, false when not.
         */
        this.fAssemble = false;

        /*
         * This maintains command history.  New commands are inserted at index 0 of the array.
         * When Enter is pressed on an empty input buffer, we default to the command at aPrevCmds[0].
         */
        this.iPrevCmd = -1;
        this.aPrevCmds = [];

        /*
         * aVariables is an object with properties that grows as setVariable() assigns more variables;
         * each property corresponds to one variable, where the property name is the variable name (ie,
         * a string beginning with a letter or underscore, followed by zero or more additional letters,
         * digits, or underscores) and the property value is the variable's numeric value.  See doVar()
         * and setVariable() for details.
         *
         * Note that parseValue() parses variables before numbers, so any variable that looks like a
         * unprefixed hex value (eg, "a5" as opposed to "0xa5") will trump the numeric value.  Unprefixed
         * hex values are a convenience of parseValue(), which always calls str.parseInt() with a default
         * base of 16; however, that default be overridden with a variety of explicit prefixes or suffixes
         * (eg, a trailing period to indicate a decimal number).
         */
        this.aVariables = {};

    }   // endif DEBUGGER
}

if (DEBUGGER) {

    Component.subclass(Debugger);

    Debugger.aBinOpPrecedence = {
        '||':   0,      // logical OR
        '&&':   1,      // logical AND
        '|':    2,      // bitwise OR
        '^':    3,      // bitwise XOR
        '&':    4,      // bitwise AND
        '!=':   5,      // inequality
        '==':   5,      // equality
        '>=':   6,      // greater than or equal to
        '>':    6,      // greater than
        '<=':   6,      // less than or equal to
        '<':    6,      // less than
        '>>>':  7,      // unsigned bitwise right shift
        '>>':   7,      // bitwise right shift
        '<<':   7,      // bitwise left shift
        '-':    8,      // subtraction
        '+':    8,      // addition
        '%':    9,      // remainder
        '/':    9,      // division
        '*':    9       // multiplication
    };

    /**
     * evalExpression(aVals, aOps, cOps)
     *
     * In Node, if you set a variable to 0x80000001; ie:
     *
     *      foo=0x80000001|0
     *
     * and then calculate foo*foo using "(foo*foo).toString(2)", the result is:
     *
     *      '11111111111111111111111111111100000000000000000000000000000000'
     *
     * which is slightly incorrect because it has overflowed JavaScript's floating-point precision.
     *
     * 0x80000001 in decimal is -2147483647, so the product is 4611686014132420609, which is 0x3FFFFFFF00000001.
     *
     * @this {Debugger}
     * @param {Array.<number>} aVals
     * @param {Array.<string>} aOps
     * @param {number} [cOps] (default is all)
     * @return {boolean} true if successful, false if error
     */
    Debugger.prototype.evalExpression = function(aVals, aOps, cOps)
    {
        cOps = cOps || -1;
        while (cOps-- && aOps.length) {
            var chOp = aOps.pop();
            if (aVals.length < 2) return false;
            var valNew;
            var val2 = aVals.pop();
            var val1 = aVals.pop();
            switch(chOp) {
            case '*':
                valNew = val1 * val2;
                break;
            case '/':
                if (!val2) return false;
                valNew = val1 / val2;
                break;
            case '%':
                if (!val2) return false;
                valNew = val1 % val2;
                break;
            case '+':
                valNew = val1 + val2;
                break;
            case '-':
                valNew = val1 - val2;
                break;
            case '<<':
                valNew = val1 << val2;
                break;
            case '>>':
                valNew = val1 >> val2;
                break;
            case '>>>':
                valNew = val1 >>> val2;
                break;
            case '<':
                valNew = (val1 < val2? 1 : 0);
                break;
            case '<=':
                valNew = (val1 <= val2? 1 : 0);
                break;
            case '>':
                valNew = (val1 > val2? 1 : 0);
                break;
            case '>=':
                valNew = (val1 >= val2? 1 : 0);
                break;
            case '==':
                valNew = (val1 == val2? 1 : 0);
                break;
            case '!=':
                valNew = (val1 != val2? 1 : 0);
                break;
            case '&':
                valNew = val1 & val2;
                break;
            case '^':
                valNew = val1 ^ val2;
                break;
            case '|':
                valNew = val1 | val2;
                break;
            case '&&':
                valNew = (val1 && val2? 1 : 0);
                break;
            case '||':
                valNew = (val1 || val2? 1 : 0);
                break;
            default:
                return false;
            }
            aVals.push(valNew|0);
        }
        return true;
    };

    /**
     * getNextCommand()
     *
     * @this {Debugger}
     * @return {string}
     */
    Debugger.prototype.getNextCommand = function()
    {
        var sCmd;
        if (this.iPrevCmd > 0) {
            sCmd = this.aPrevCmds[--this.iPrevCmd];
        } else {
            sCmd = "";
            this.iPrevCmd = -1;
        }
        return sCmd;
    };

    /**
     * getPrevCommand()
     *
     * @this {Debugger}
     * @return {string|null}
     */
    Debugger.prototype.getPrevCommand = function()
    {
        var sCmd = null;
        if (this.iPrevCmd < this.aPrevCmds.length - 1) {
            sCmd = this.aPrevCmds[++this.iPrevCmd];
        }
        return sCmd;
    };

    /**
     * getRegIndex(sReg, off)
     *
     * NOTE: This must be implemented by the individual debuggers.
     *
     * @this {Debugger}
     * @param {string} sReg
     * @param {number} [off] optional offset into sReg
     * @return {number} register index, or -1 if not found
     */
    Debugger.prototype.getRegIndex = function(sReg, off)
    {
        return -1;
    };

    /**
     * getRegValue(iReg)
     *
     * NOTE: This must be implemented by the individual debuggers.
     *
     * @this {Debugger}
     * @param {number} iReg
     * @return {number|undefined}
     */
    Debugger.prototype.getRegValue = function(iReg)
    {
        return undefined;
    };

    /**
     * parseCommand(sCmd, fSave, chSep)
     *
     * @this {Debugger}
     * @param {string|undefined} sCmd
     * @param {boolean} [fSave] is true to save the command, false if not
     * @param {string} [chSep] is the command separator character (default is ';')
     * @return {Array.<string>}
     */
    Debugger.prototype.parseCommand = function(sCmd, fSave, chSep)
    {
        if (fSave) {
            if (!sCmd) {
                if (this.fAssemble) {
                    sCmd = "end";
                } else {
                    sCmd = this.aPrevCmds[this.iPrevCmd+1];
                }
            } else {
                if (this.iPrevCmd < 0 && this.aPrevCmds.length) {
                    this.iPrevCmd = 0;
                }
                if (this.iPrevCmd < 0 || sCmd != this.aPrevCmds[this.iPrevCmd]) {
                    this.aPrevCmds.splice(0, 0, sCmd);
                    this.iPrevCmd = 0;
                }
                this.iPrevCmd--;
            }
        }
        var a = [];
        if (sCmd) {
            /*
             * With the introduction of breakpoint commands (ie, quoted command sequences
             * associated with a breakpoint), we can no longer perform simplistic splitting.
             *
             *      a = sCmd.split(chSep || ';');
             *      for (var i = 0; i < a.length; i++) a[i] = str.trim(a[i]);
             *
             * We may now split on semi-colons ONLY if they are outside a quoted sequence.
             *
             * Also, to allow quoted strings *inside* breakpoint commands, we first replace all
             * DOUBLE double-quotes with single quotes.
             */
            sCmd = sCmd.toLowerCase().replace(/""/g, "'");

            var iPrev = 0;
            var chQuote = null;
            chSep = chSep || ';';
            /*
             * NOTE: Processing charAt() up to and INCLUDING length is not a typo; we're taking
             * advantage of the fact that charAt() with an invalid index returns an empty string,
             * allowing us to use the same substring() call to capture the final portion of sCmd.
             *
             * In a sense, it allows us to pretend that the string ends with a zero terminator.
             */
            for (var i = 0; i <= sCmd.length; i++) {
                var ch = sCmd.charAt(i);
                if (ch == '"' || ch == "'") {
                    if (!chQuote) {
                        chQuote = ch;
                    } else if (ch == chQuote) {
                        chQuote = null;
                    }
                }
                else if (ch == chSep && !chQuote || !ch) {
                    /*
                     * Recall that substring() accepts starting (inclusive) and ending (exclusive)
                     * indexes, whereas substr() accepts a starting index and a length.  We need the former.
                     */
                    a.push(str.trim(sCmd.substring(iPrev, i)));
                    iPrev = i + 1;
                }
            }
        }
        return a;
    };

    /**
     * parseExpression(sExp, fPrint)
     *
     * A quick-and-dirty expression parser.  It takes an expression like:
     *
     *      EDX+EDX*4+12345678
     *
     * and builds a value stack in aVals and a "binop" (binary operator) stack in aOps:
     *
     *      aVals       aOps
     *      -----       ----
     *      EDX         +
     *      EDX         *
     *      4           +
     *      ...
     *
     * We pop 1 "binop" from aOps and 2 values from aVals whenever a "binop" of lower priority than its
     * predecessor is encountered, evaluate, and push the result back onto aVals.
     *
     * Unary operators like '~' and ternary operators like '?:' are not supported; neither are parentheses.
     *
     * However, parseReference() now makes it possible to write parenthetical-style sub-expressions by using
     * {...} (braces), as well as address references by using [...] (brackets).
     *
     * Why am I using braces instead of parentheses for sub-expressions?  Because parseReference() serves
     * multiple purposes, the other being reference replacement in message strings passing through replaceRegs(),
     * and I didn't want parentheses taking on a new meaning in message strings.
     *
     * @this {Debugger}
     * @param {string|undefined} sExp
     * @param {boolean} [fPrint] is true to print all resolved values, false for quiet parsing
     * @return {number|undefined} numeric value, or undefined if sExp contains any undefined or invalid values
     */
    Debugger.prototype.parseExpression = function(sExp, fPrint)
    {
        var value;

        if (sExp) {
            /*
             * First process (and eliminate) any references, aka sub-expressions.
             */
            sExp = this.parseReference(sExp);

            var i = 0;
            var fError = false;
            var sExpOrig = sExp;
            var aVals = [], aOps = [];
            /*
             * All browsers (including, I believe, IE9 and up) support the following idiosyncrasy of a regexp split():
             * when the regexp uses a capturing pattern, the resulting array will include entries for all the pattern
             * matches along with the non-matches.  This effectively means that, in the set of expressions that we
             * support, all even entries in asValues will contain "values" and all odd entries will contain "operators".
             *
             * And although I tried to list the supported operators in "precedential" order, bitwise operators must
             * be out-of-order so that we don't mistakenly match either '>' or '<' when they're part of '>>' or '<<'.
             */
            var regExp = /(\|\||&&|\||^|&|!=|==|>=|>>>|>>|>|<=|<<|<|-|\+|%|\/|\*)/;
            var asValues = sExp.split(regExp);
            while (i < asValues.length) {
                var sValue = asValues[i++];
                var cchValue = sValue.length;
                var s = str.trim(sValue);
                if (!s) {
                    fError = true;
                    break;
                }
                var v = this.parseValue(s, null, fPrint === false);
                if (v === undefined) {
                    fError = true;
                    fPrint = false;
                    break;
                }
                aVals.push(v);
                if (i == asValues.length) break;
                var sOp = asValues[i++], cchOp = sOp.length;
                this.assert(Debugger.aBinOpPrecedence[sOp] != null);
                if (aOps.length && Debugger.aBinOpPrecedence[sOp] < Debugger.aBinOpPrecedence[aOps[aOps.length-1]]) {
                    this.evalExpression(aVals, aOps, 1);
                }
                aOps.push(sOp);
                sExp = sExp.substr(cchValue + cchOp);
            }
            if (!this.evalExpression(aVals, aOps) || aVals.length != 1) {
                fError = true;
            }
            if (!fError) {
                value = aVals.pop();
                if (fPrint) this.printValue(null, value);
            } else {
                if (fPrint) this.println("error parsing '" + sExpOrig + "' at character " + (sExpOrig.length - sExp.length));
            }
        }
        return value;
    };

    /**
     * parseAddrReference(s, sAddr)
     *
     * Returns the given string with the given address references replaced with the contents of the address.
     *
     * NOTE: This must be implemented by the individual debuggers.
     *
     * @this {Debugger}
     * @param {string} s
     * @param {string} sAddr
     * @return {string}
     */
    Debugger.prototype.parseAddrReference = function(s, sAddr)
    {
        return s.replace('[' + sAddr + ']', "unimplemented");
    };

    /**
     * parseReference(s)
     *
     * Returns the given string with any "{expression}" sequences replaced with the value of the expression,
     * and any "[address]" references replaced with the contents of the address.  Expressions are parsed BEFORE
     * addresses.  Owing to this function's simplistic parsing, nested braces/brackets are not supported
     * (define intermediate variables if needed).
     *
     * @this {Debugger}
     * @param {string} s
     * @return {string}
     */
    Debugger.prototype.parseReference = function(s)
    {
        var a;
        while (a = s.match(/\{(.*?)}/)) {
            if (a[1].indexOf('{') >= 0) break;          // unsupported nested brace(s)
            var value = this.parseExpression(a[1]);
            s = s.replace('{' + a[1] + '}', value != null? str.toHex(value) : "undefined");
        }
        while (a = s.match(/\[(.*?)]/)) {
            if (a[1].indexOf('[') >= 0) break;          // unsupported nested bracket(s)
            s = this.parseAddrReference(s, a[1]);
        }
        return this.parseSysVars(s);
    };

    /**
     * parseSysVars(s)
     *
     * Returns the given string with any recognized "$var" replaced with its value; eg:
     *
     *      $ops: the number of opcodes executed since the last time it was displayed (or reset)
     *
     * @this {Debugger}
     * @param {string} s
     * @return {string}
     */
    Debugger.prototype.parseSysVars = function(s)
    {
        var a;
        while (a = s.match(/\$([a-z]+)/i)) {
            var v = null;
            switch(a[1].toLowerCase()) {
            case "ops":
                v = this.cOpcodes - this.cOpcodesStart;
                break;
            }
            if (v == null) break;
            s = s.replace(a[0], v.toString());
        }
        return s;
    };

    /**
     * parseValue(sValue, sName, fQuiet)
     *
     * @this {Debugger}
     * @param {string|undefined} sValue
     * @param {string|null} [sName] is the name of the value, if any
     * @param {boolean} [fQuiet]
     * @return {number|undefined} numeric value, or undefined if sValue is either undefined or invalid
     */
    Debugger.prototype.parseValue = function(sValue, sName, fQuiet)
    {
        var value;
        if (sValue != null) {
            var iReg = this.getRegIndex(sValue);
            if (iReg >= 0) {
                value = this.getRegValue(iReg);
            } else {
                value = this.getVariable(sValue);
                if (value == null) value = str.parseInt(sValue, 16);
            }
            if (value == null && !fQuiet) this.println("invalid " + (sName? sName : "value") + ": " + sValue);
        } else {
            if (!fQuiet) this.println("missing " + (sName || "value"));
        }
        return value;
    };

    /**
     * printValue(sVar, value)
     *
     * @this {Debugger}
     * @param {string|null} sVar
     * @param {number|undefined} value
     * @return {boolean} true if value defined, false if not
     */
    Debugger.prototype.printValue = function(sVar, value)
    {
        var sValue;
        var fDefined = false;
        if (value !== undefined) {
            fDefined = true;
            sValue = str.toHexLong(value) + " " + value + ". (" + str.toBinBytes(value) + ")";
        }
        sVar = (sVar != null? (sVar + ": ") : "");
        this.println(sVar + sValue);
        return fDefined;
    };

    /**
     * printVariable(sVar)
     *
     * @this {Debugger}
     * @param {string} [sVar]
     * @return {boolean} true if all value(s) defined, false if not
     */
    Debugger.prototype.printVariable = function(sVar)
    {
        if (sVar) {
            return this.printValue(sVar, this.aVariables[sVar]);
        }
        var cVariables = 0;
        for (sVar in this.aVariables) {
            this.printValue(sVar, this.aVariables[sVar]);
            cVariables++;
        }
        return cVariables > 0;
    };

    /**
     * delVariable(sVar)
     *
     * @this {Debugger}
     * @param {string} sVar
     */
    Debugger.prototype.delVariable = function(sVar)
    {
        delete this.aVariables[sVar];
    };

    /**
     * getVariable(sVar)
     *
     * @this {Debugger}
     * @param {string} sVar
     * @return {number|undefined}
     */
    Debugger.prototype.getVariable = function(sVar)
    {
        return this.aVariables[sVar];
    };

    /**
     * setVariable(sVar, value)
     *
     * @this {Debugger}
     * @param {string} sVar
     * @param {number} value
     */
    Debugger.prototype.setVariable = function(sVar, value)
    {
        this.aVariables[sVar] = value;
    };

}   // endif DEBUGGER

if (NODE) module.exports = Debugger;
