/**
 * @fileoverview Common PCjs Debugger support.
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
    var Component = require("../../shared/lib/component");
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
 * }}
 */
var DbgAddr;

/**
 * Since the Closure Compiler treats ES6 classes as @struct rather than @dict by default,
 * it deters us from defining named properties on our components; eg:
 *
 *      this['exports'] = {...}
 *
 * results in an error:
 *
 *      Cannot do '[]' access on a struct
 *
 * So, in order to define 'exports', we must override the @struct assumption by annotating
 * the class as @unrestricted (or @dict).  Note that this must be done both here and in the
 * subclass (eg, SerialPort), because otherwise the Compiler won't allow us to *reference*
 * the named property either.
 *
 * TODO: Consider marking ALL our classes unrestricted, because otherwise it forces us to
 * define every single property the class uses in its constructor, which results in a fair
 * bit of redundant initialization, since many properties aren't (and don't need to be) fully
 * initialized until the appropriate init(), reset(), restore(), etc. function is called.
 *
 * The upside, however, may be that since the structure of the class is completely defined by
 * the constructor, JavaScript engines may be able to optimize and run more efficiently.
 *
 * @unrestricted
 */
class Debugger extends Component {
    /**
     * Debugger(parmsDbg)
     *
     * The Debugger component supports the following optional (parmsDbg) properties:
     *
     *      base: the base to use for most numeric input/output (default is 16)
     *
     * The Debugger component is a shared component containing a subset of functionality used by
     * the other CPU-specific Debuggers (eg, DebuggerX86).  Over time, the goal is to factor out as
     * much common debugging support as possible from those components into this one.
     *
     * @param {Object} parmsDbg
     */
    constructor(parmsDbg) {
        if (DEBUGGER) {

            super("Debugger", parmsDbg);

            /*
             * Default base used to display all values; modified with the "s base" command.
             */
            this.nBase = +parmsDbg['base'] || 16;

            this.achGroup = ['{','}'];
            this.achAddress = ['[',']'];

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
             * aVariables is an object with properties that grow as setVariable() assigns more variables;
             * each property corresponds to one variable, where the property name is the variable name (ie,
             * a string beginning with a letter or underscore, followed by zero or more additional letters,
             * digits, or underscores) and the property value is the variable's numeric value.  See doVar()
             * and setVariable() for details.
             *
             * Note that parseValue() parses variables before numbers, so any variable that looks like a
             * unprefixed hex value (eg, "a5" as opposed to "0xa5") will trump the numeric value.  Unprefixed
             * hex values are a convenience of parseValue(), which always calls Str.parseInt() with a default
             * base of 16; however, that default be overridden with a variety of explicit prefixes or suffixes
             * (eg, a leading "0o" to indicate octal, a trailing period to indicate decimal, etc.)
             *
             * See Str.parseInt() for more details about supported numbers.
             */
            this.aVariables = {};

        }   // endif DEBUGGER
    }

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
    getRegIndex(sReg, off) {
        return -1;
    }

    /**
     * getRegValue(iReg)
     *
     * NOTE: This must be implemented by the individual debuggers.
     *
     * @this {Debugger}
     * @param {number} iReg
     * @return {number|undefined}
     */
    getRegValue(iReg) {
        return undefined;
    }

    /**
     * parseAddrReference(s, sAddr)
     *
     * Returns the given string with the given address reference replaced with the contents of that address.
     *
     * NOTE: This must be implemented by the individual debuggers.
     *
     * @this {Debugger}
     * @param {string} s
     * @param {string} sAddr
     * @return {string}
     */
    parseAddrReference(s, sAddr) {
        return s.replace('[' + sAddr + ']', "unimplemented");
    }

    /**
     * getNextCommand()
     *
     * @this {Debugger}
     * @return {string}
     */
    getNextCommand() {
        var sCmd;
        if (this.iPrevCmd > 0) {
            sCmd = this.aPrevCmds[--this.iPrevCmd];
        } else {
            sCmd = "";
            this.iPrevCmd = -1;
        }
        return sCmd;
    }

    /**
     * getPrevCommand()
     *
     * @this {Debugger}
     * @return {string|null}
     */
    getPrevCommand() {
        var sCmd = null;
        if (this.iPrevCmd < this.aPrevCmds.length - 1) {
            sCmd = this.aPrevCmds[++this.iPrevCmd];
        }
        return sCmd;
    }

    /**
     * parseCommand(sCmd, fSave, chSep)
     *
     * @this {Debugger}
     * @param {string|undefined} sCmd
     * @param {boolean} [fSave] is true to save the command, false if not
     * @param {string} [chSep] is the command separator character (default is ';')
     * @return {Array.<string>}
     */
    parseCommand(sCmd, fSave, chSep) {
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
             *      for (var i = 0; i < a.length; i++) a[i] = Str.trim(a[i]);
             *
             * We may now split on semi-colons ONLY if they are outside a quoted sequence.
             *
             * Also, to allow quoted strings *inside* breakpoint commands, we first replace all
             * DOUBLE double-quotes with single quotes.
             */
            sCmd = sCmd.replace(/""/g, "'");

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
                    a.push(Str.trim(sCmd.substring(iPrev, i)));
                    iPrev = i + 1;
                }
            }
        }
        return a;
    }

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
    evalExpression(aVals, aOps, cOps) {
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
    }

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
     * predecessor is encountered, evaluate, and push the result back onto aVals.  Unary operators like
     * '~' and ternary operators like '?:' are not supported.
     *
     * parseReference() makes it possible to write parenthetical-style sub-expressions by using whatever
     * characters achGroup contains (default is braces}.  Address references are resolved using the characters
     * in achAddress (default is brackets).
     *
     * Why not always use parentheses for sub-expressions?  Because parseReference() serves multiple purposes,
     * the other being reference replacement in message strings passing through replaceRegs(), and some
     * Debuggers don't want parentheses taking on a new meaning in message strings.
     *
     * However, a Debugger can override these choices by modifying achGroup and/or achAddress, if there's no
     * conflict in its replaceRegs() implementation.
     *
     * @this {Debugger}
     * @param {string|undefined} sExp
     * @param {boolean} [fPrint] is true to print all resolved values, false for quiet parsing
     * @return {number|undefined} numeric value, or undefined if sExp contains any undefined or invalid values
     */
    parseExpression(sExp, fPrint) {
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
                var s = Str.trim(sValue);
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
    }

    /**
     * parseReference(s)
     *
     * Returns the given string with any "{expression}" sequences replaced with the value of the expression,
     * and any "[address]" references replaced with the contents of the address.  Expressions are parsed BEFORE
     * addresses.
     *
     * @this {Debugger}
     * @param {string} s
     * @return {string}
     */
    parseReference(s) {
        var a;
        var chOpen = this.achGroup[0];
        var chClose = this.achGroup[1];
        var chEscape = (chOpen == '(' || chOpen == '{' || chOpen == '[')? '\\' : '';
        var chInnerEscape = (chOpen == '['? '\\' : '');
        var reSubExp = new RegExp(chEscape + chOpen + "([^" + chInnerEscape + chOpen + chInnerEscape + chClose + "]+)" + chEscape + chClose);
        while (a = s.match(reSubExp)) {
            var value = this.parseExpression(a[1]);
            var sSearch = chOpen + a[1] + chClose;
            var sReplace = value != null? this.toStrBase(value) : "undefined";
            /*
             * Note that by default, the String replace() method only replaces the FIRST occurrence,
             * and there MIGHT be more than one occurrence of the expression we just parsed, so we could
             * do this instead:
             *
             *      s = s.split(sSearch).join(sReplace);
             *
             * However, that's knd of an expensive (slow) solution, and it's not strictly necessary, since
             * any additional identical expressions will be picked up on a subsequent iteration through this loop.
             */
            s = s.replace(sSearch, sReplace);
        }
        if (this.achAddress.length) {
            chOpen = this.achAddress[0];
            chClose = this.achAddress[1];
            chEscape = (chOpen == '(' || chOpen == '{' || chOpen == '[')? '\\' : '';
            chInnerEscape = (chOpen == '['? '\\' : '');
            reSubExp = new RegExp(chEscape + chOpen + "([^" + chInnerEscape + chOpen + chInnerEscape + chClose + "]+)" + chEscape + chClose);
            while (a = s.match(reSubExp)) {
                s = this.parseAddrReference(s, a[1]);
            }
        }
        return this.parseSysVars(s);
    }

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
    parseSysVars(s) {
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
    }

    /**
     * parseValue(sValue, sName, fQuiet)
     *
     * @this {Debugger}
     * @param {string|undefined} sValue
     * @param {string|null} [sName] is the name of the value, if any
     * @param {boolean} [fQuiet]
     * @return {number|undefined} numeric value, or undefined if sValue is either undefined or invalid
     */
    parseValue(sValue, sName, fQuiet) {
        var value;
        if (sValue != null) {
            var iReg = this.getRegIndex(sValue);
            if (iReg >= 0) {
                value = this.getRegValue(iReg);
            } else {
                value = this.getVariable(sValue);
                if (value == null) {
                    value = Str.parseInt(sValue, this.nBase);
                }
            }
            if (value == null && !fQuiet) this.println("invalid " + (sName? sName : "value") + ": " + sValue);
        } else {
            if (!fQuiet) this.println("missing " + (sName || "value"));
        }
        return value;
    }

    /**
     * printValue(sVar, value)
     *
     * @this {Debugger}
     * @param {string|null} sVar
     * @param {number|undefined} value
     * @return {boolean} true if value defined, false if not
     */
    printValue(sVar, value) {
        var sValue;
        var fDefined = false;
        if (value !== undefined) {
            fDefined = true;
            sValue = Str.toHex(value, 0, true) + " " + value + ". " + Str.toOct(value, 0, true) + " " + Str.toBinBytes(value, 4, true);
            if (value >= 0x20 && value < 0x7F) {
                sValue += " '" + String.fromCharCode(value) + "'";
            }
        }
        sVar = (sVar != null? (sVar + ": ") : "");
        this.println(sVar + sValue);
        return fDefined;
    }

    /**
     * resetVariables()
     *
     * @this {Debugger}
     * @return {Object}
     */
    resetVariables() {
        var a = this.aVariables;
        this.aVariables = {};
        return a;
    }

    /**
     * restoreVariables(a)
     *
     * @this {Debugger}
     * @param {Object} a (from previous resetVariables() call)
     */
    restoreVariables(a) {
        this.aVariables = a;
    }

    /**
     * printVariable(sVar)
     *
     * @this {Debugger}
     * @param {string} [sVar]
     * @return {boolean} true if all value(s) defined, false if not
     */
    printVariable(sVar) {
        if (sVar) {
            return this.printValue(sVar, this.aVariables[sVar]);
        }
        var cVariables = 0;
        for (sVar in this.aVariables) {
            this.printValue(sVar, this.aVariables[sVar]);
            cVariables++;
        }
        return cVariables > 0;
    }

    /**
     * delVariable(sVar)
     *
     * @this {Debugger}
     * @param {string} sVar
     */
    delVariable(sVar) {
        delete this.aVariables[sVar];
    }

    /**
     * getVariable(sVar)
     *
     * @this {Debugger}
     * @param {string} sVar
     * @return {number|undefined}
     */
    getVariable(sVar) {
        return this.aVariables[sVar];
    }

    /**
     * setVariable(sVar, value)
     *
     * @this {Debugger}
     * @param {string} sVar
     * @param {number} value
     */
    setVariable(sVar, value) {
        this.aVariables[sVar] = value;
    }

    /**
     * toStrBase(n, nBits)
     *
     * Use this instead of Str's toOct()/toDec()/toHex() to convert numbers to the Debugger's default base.
     *
     * TODO: The 32-bit limitation on n is imposed by the Str functions we call, not us.  Consider modifying
     * those functions to support a higher number of bits (eg, 36), using arithmetic operators instead of bit-wise
     * operators, and increasing the maximum number of supported bits to at least 52, while still using JavaScript
     * floating-point numbers as the underlying data type.
     *
     * For now, the only component that really cares about supporting more than 32 bits (eg, 36 bits) is the PDP-10
     * Debugger, which currently uses its own functions (eg, toStrWord()) to divide quantities into smaller (eg, 18-bit)
     * values.
     *
     * @this {Debugger}
     * @param {number|null|undefined} n (interpreted as a 32-bit value)
     * @param {number} [nBits] (-1 to strip leading zeros, 0 to allow a variable number of digits)
     * @return {string}
     */
    toStrBase(n, nBits = 0) {
        var s;
        switch(this.nBase) {
        case 8:
            s = Str.toOct(n, nBits > 0? ((nBits + 2)/3)|0 : 0);
            break;
        case 10:
            /*
             * The multiplier is actually Math.log(2)/Math.log(10), but an approximation is more than adequate.
             */
            s = Str.toDec(n, nBits > 0? Math.ceil(nBits * 0.3) : 0);
            break;
        case 16:
        default:
            s = Str.toHex(n, nBits > 0? ((nBits + 3) >> 2) : 0);
            break;
        }
        return (nBits < 0? Str.stripLeadingZeros(s) : s);
    }
}

if (DEBUGGER) {

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

}   // endif DEBUGGER

if (NODE) module.exports = Debugger;
