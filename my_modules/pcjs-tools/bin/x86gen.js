/**
 * @fileoverview This file generates PCjs 8086 mode-byte decoders.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2012-Sep-08
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of PCjs, which is part of the JavaScript Machines Project (aka JSMachines)
 * at <http://jsmachines.net/> and <http://pcjs.org/>.
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
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

try {
    /*
     * If Node is running us, this will succeed, and we'll have a print()
     * function (an alias for console.log).  If JSC is running us instead,
     * then this will fail (there is neither a global NOR a console object),
     * but that's OK, because print() is a built-in function.
     * 
     * TODO: Find a cleaner way of doing this, and while you're at it, alias
     * Node's process.argv to JSC's "arguments" array, and Node's process.exit()
     * to JSC's quit().
     */
    global.print = console.log;
} catch(err) {}

/*
 * I'm going to start by creating 4 sets of "mod,reg,r/m" aka OpMod tables:
 * 
 *      Set 0: mod,r/m is dst, size is byte, dispatch table is aOpModMemByte
 *      Set 1: mod,r/m is dst, size is word, dispatch table is aOpModMemWord
 *      Set 2: reg is dst,     size is byte, dispatch table is aOpModRegByte
 *      Set 3: reg is dst,     size is word, dispatch table is aOpModRegWord
 *      
 * See p. 3-41 of "The 8086 Book" for more details.
 */

var aDst = ["Mem", "Reg"];
var aSize = ["Byte", "Word"];
var aDisp = ["8", "16"];

/*
 * Index aREG like so: aREG[w][reg]
 */
var aREG = [
    ["AL", "CL", "DL", "BL", "AH", "CH", "DH", "BH"],
    ["AX", "CX", "DX", "BX", "SP", "BP", "SI", "DI"]
];

var w, sError = "";
var fGenMods = true;
var fGenTables = true;
var sEAFuncs = "";

if (!fGenMods) {

    var sOps = "", cOps = 0;

    for (var op = 0x00; op <= 0xFF; op++) {

        var i, iReg, sOp, sOpCode, sOperator, sDst, sDstReg;

        if (op >= 0x40 && op <= 0x4F) {
            i = op - 0x40;
            iReg = i % 8;
            sOpCode = (op < 0x48? "INC" : "DEC");
            sOperator = (op < 0x48? "+" : "-");
            sDst = aREG[1][iReg];
            sDstReg = "this.reg." + aREG[1][iReg];
            print("    /**");
            print("     * @this {X86CPU}");
            print("     *");
            print("     * op=0x" + toHex(op, 2) + " (" + sOpCode.toLowerCase() + " " + sDst + ")");
            print("     */");
            sOp = "op" + sOpCode + sDst;
            print("    " + sOp + ": function() {");
            print("        " + sDstReg + " = (" + sDstReg + " " + sOperator + " 1) & 0xffff;");
            print("    },");
            if (sOps) sOps += ((cOps % 4)? ", " : ",\n");
            sOps += "        this." + sOp;
            cOps++;
        }
        else if (op >= 0x50 && op <= 0x5F) {
            i = op - 0x50;
            iReg = i % 8;
            sOpCode = (op < 0x58? "PUSH" : "POP");
            sDst = aREG[1][iReg];
            sDstReg = "this.reg." + aREG[1][iReg];
            print("    /**");
            print("     * @this {X86CPU}");
            print("     *");
            print("     * op=0x" + toHex(op, 2) + " (" + sOpCode.toLowerCase() + " " + sDst + ")");
            print("     */");
            sOp = "op" + sOpCode + sDst;
            print("    " + sOp + ": function() {");
            if (op < 0x58) {
                print("        this.pushWord(" + sDstReg + ");");
            }
            else {
                print("        " + sDstReg + " = this.popWord();");
            }
            print("    },");
            if (sOps) sOps += ((cOps % 4)? ", " : ",\n");
            sOps += "        this." + sOp;
            cOps++;
        }
        else if (op == 0x90) {
            if (sOps) sOps += ((cOps % 4)? ", " : ",\n");
            sOps += "        this.opNOP";
            cOps++;
        }
        else if (op >= 0x91 && op <= 0x97) {
            i = op - 0x90;
            iReg = i % 8;
            sOpCode = "XCHG";
            sDst = aREG[1][iReg];
            sDstReg = "this.reg." + aREG[1][iReg];
            print("    /**");
            print("     * @this {X86CPU}");
            print("     *");
            print("     * op=0x" + toHex(op, 2) + " (" + sOpCode.toLowerCase() + " AX," + sDst + ")");
            print("     */");
            sOp = "op" + sOpCode + sDst;
            print("    " + sOp + ": function() {");
            print("        var temp = this.regAX; this.regAX = " + sDstReg + "; " + sDstReg + " = temp;");
            print("    },");
            if (sOps) sOps += ((cOps % 4)? ", " : ",\n");
            sOps += "        this." + sOp;
            cOps++;
        }
        else if (op >= 0xB0 && op <= 0xBF) {
            i = op - 0xB0;
            w = (i < 8? 0 : 1);
            i = i % 8;
            sDst = aREG[w][i].toLowerCase();
            print("    /**");
            print("     * @this {X86CPU}");
            print("     *");
            print("     * op=0x" + toHex(op, 2) + " (mov " + aREG[w][i] + "," + aSize[w].toLowerCase() + ")");
            print("     */");
            sOp = "opMOV" + aREG[w][i] + aDisp[w];
            print("    " + sOp + ": function() {");
            var sRegSet = "", sRegSetEnd = null;
            if (w == 1) {
                sRegSet = "this.reg" + aREG[1][i] + " = ";
            }
            else {
                if (i < 4) {
                    sRegSet = "this.reg" + aREG[1][i] + " = (this.reg" + aREG[1][i] + " & ~0xff) | ";
                }
                else {
                    sRegSet = "this.reg" + aREG[1][i - 4] + " = (this.reg" + aREG[1][i - 4] + " & 0xff) | ";
                    sRegSetEnd = " << 8";
                }
            }
            print("        " + sRegSet + (sRegSetEnd? "(" : "") + "this.getIP" + aSize[w] + "()" + (sRegSetEnd? (sRegSetEnd + ")") : "") + ";");
            print("    },");
            if (sOps) sOps += ((cOps % 4)? ", " : ",\n");
            sOps += "        this." + sOp;
            cOps++;
        }
    }

    if (fGenTables) print("    this.aOpCodeFuncs = [");
    if (fGenTables) print(sOps);
    if (fGenTables) print("    ];");
}
else {

    /*
     * Index aMOD like so: aMOD[mod]
     */
    var aMOD = ["mem", "mem+d8", "mem+d16", "reg"];

    /*
     * Index aRM like so: aRM[mod][w][r_m], forcing w to 0 unless mod is 3
     */
    var aRM = [
        [["BX+SI", "BX+DI", "BP+SI", "BP+DI", "SI", "DI", "d16", "BX"], []],
        [["BX+SI+d8", "BX+DI+d8", "BP+SI+d8", "BP+DI+d8", "SI+d8", "DI+d8", "BP+d8", "BX+d8"], []],
        [["BX+SI+d16", "BX+DI+d16", "BP+SI+d16", "BP+DI+d16", "SI+d16", "DI+d16", "BP+d16", "BX+d16"], []],
        [["AL", "CL", "DL", "BL", "AH", "CH", "DH", "BH"], ["AX", "CX", "DX", "BX", "SP", "BP", "SI", "DI"]]
    ];

    var cOpMods, mrm;
    var sOpMods, sOpMod, sContainer;

    print('"use strict";\n');
    print("var X86Mods = {};\n");

    for (var d = 0; d <= 1 && !sError; d++) {

        for (w = 0; w <= 1 && !sError; w++) {

            cOpMods = 0;
            sOpMods = "";

            sContainer = "X86Mods"; // + aDst[d].substr(0, 1) + aSize[w].substr(0, 1);

            if (fGenTables) print(sContainer + " = {");

            for (mrm = 0x00; mrm <= 0xff && !sError; mrm++) {
                sOpMod = genMode(d, w, mrm);
                if (sOpMod) {
                    if (sOpMods) sOpMods += ((cOpMods % 4)? ", " : ",\n");
                    sOpMods += "    " + sContainer + "." + sOpMod;
                    cOpMods++;
                }
            }

            if (fGenTables) print("};\n");

            if (fGenTables) print("X86Mods.aOpMod" + aDst[d] + aSize[w] + " = [");
            if (fGenTables) print(sOpMods);
            if (fGenTables) print("];\n");
        }
    }

    for (w = 0; w <= 1 && !sError; w++) {

        cOpMods = 0;
        sOpMods = "";

        sContainer = "X86Mods"; // + "G" + aSize[w].substr(0, 1);

        if (fGenTables) print(sContainer + " = {");

        for (mrm = 0x00; mrm <= 0xff && !sError; mrm++) {
            sOpMod = genMode(0, w, mrm, "Grp");
            if (sOpMod) {
                if (sOpMods) sOpMods += ((cOpMods % 4)? ", " : ",\n");
                sOpMods += "    " + sContainer + "." + sOpMod;
                cOpMods++;
            }
        }

        if (fGenTables) print("};\n");

        if (fGenTables) print("X86Mods.aOpMod" + "Grp" + aSize[w] + " = [");
        if (fGenTables) print(sOpMods);
        if (fGenTables) print("];\n");
    }

    if (sEAFuncs) {
        print("var X86Mods = {\n" + sEAFuncs + "};\n");
    }
}

function genMode(d, w, mrm, sGroup, sRO) {
    var mod = (mrm >> 6);
    var reg = (mrm >> 3) & 0x7;
    var r_m = (mrm & 0x7);
    var sRegGet = null;
    var sRegSet = null;
    var sRegSetBegin = "", sRegSetEnd = "";
    if (!w) {
        switch (reg) {
        case 0:
            sRegGet = "this.regAX & 0xff";
            sRegSet = "this.regAX = (this.regAX & ~0xff) | ";
            break;
        case 1:
            sRegGet = "this.regCX & 0xff";
            sRegSet = "this.regCX = (this.regCX & ~0xff) | ";
            break;
        case 2:
            sRegGet = "this.regDX & 0xff";
            sRegSet = "this.regDX = (this.regDX & ~0xff) | ";
            break;
        case 3:
            sRegGet = "this.regBX & 0xff";
            sRegSet = "this.regBX = (this.regBX & ~0xff) | ";
            break;
        case 4:
            sRegGet = "this.regAX >> 8";
            sRegSet = "this.regAX = (this.regAX & 0xff) | ";
            sRegSetEnd = " << 8";
            break;
        case 5:
            sRegGet = "this.regCX >> 8";
            sRegSet = "this.regCX = (this.regCX & 0xff) | ";
            sRegSetEnd = " << 8";
            break;
        case 6:
            sRegGet = "this.regDX >> 8";
            sRegSet = "this.regDX = (this.regDX & 0xff) | ";
            sRegSetEnd = " << 8";
            break;
        case 7:
            sRegGet = "this.regBX >> 8";
            sRegSet = "this.regBX = (this.regBX & 0xff) | ";
            sRegSetEnd = " << 8";
            break;
        default:
            sError = "unrecognized w=0 reg: " + reg;
            break;
        }
    }
    else {
        switch (reg) {
        case 0:
            sRegGet = "this.regAX";
            break;
        case 1:
            sRegGet = "this.regCX";
            break;
        case 2:
            sRegGet = "this.regDX";
            break;
        case 3:
            sRegGet = "this.regBX";
            break;
        case 4:
            sRegGet = "this.regSP";
            break;
        case 5:
            sRegGet = "this.regBP";
            break;
        case 6:
            sRegGet = "this.regSI";
            break;
        case 7:
            sRegGet = "this.regDI";
            break;
        default:
            sError = "unrecognized w=1 reg: " + reg;
            break;
        }
    }
    /*
     * The 8086/8088 cycle counts below come from p.3-48 of "The 8086 Book", where it discusses EA
     * ("effective address") calculations and the number of execution cycles required for each type
     * of calculation.
     * 
     * 
     */
    var fInline = true;
    var nCycles = null;
    var sModAddr = null;
    var sModFunc = null;
    var sModRegGet = null;
    var sModRegSet = null;
    var sModRegSetBegin = "", sModRegSetEnd = "";
    var sModRegSeg = "this.segData";
    switch (mod) {
    case 0:
        switch (r_m) {
        case 0:
            sModAddr = "this.regBX + this.regSI";
            sModFunc = "BXSI";
            nCycles = "this.nEACyclesBaseIndex";        // 8086: 7
            break;
        case 1:
            sModAddr = "this.regBX + this.regDI";
            sModFunc = "BXDI";
            nCycles = "this.nEACyclesBaseIndexExtra";   // 8086: 8
            break;
        case 2:
            sModAddr = "this.regBP + this.regSI";
            sModFunc = "BPSI";
            sModRegSeg = "this.segStack";
            nCycles = "this.nEACyclesBaseIndexExtra";   // 8086: 8
            break;
        case 3:
            sModAddr = "this.regBP + this.regDI";
            sModFunc = "BPDI";
            sModRegSeg = "this.segStack";
            nCycles = "this.nEACyclesBaseIndex";        // 8086: 7
            break;
        case 4:
            sModAddr = "this.regSI";
            sModFunc = "SI";
            nCycles = "this.nEACyclesBase";             // 8086: 5
            break;
        case 5:
            sModAddr = "this.regDI";
            sModFunc = "DI";
            nCycles = "this.nEACyclesBase";             // 8086: 5
            break;
        case 6:
            sModAddr = "this.getIPWord()";
            sModFunc = "D16";
            nCycles = "this.nEACyclesDisp";             // 8086: 6
            break;
        case 7:
            sModAddr = "this.regBX";
            sModFunc = "BX";
            nCycles = "this.nEACyclesBase";             // 8086: 5
            break;
        default:
            sError = "unrecognized mod=0 r/m: " + r_m;
            break;
        }
        break;
    case 1:
        switch (r_m) {
        case 0:
            sModAddr = "this.regBX + this.regSI + this.getIPDisp()";
            sModFunc = "BXSID8";
            nCycles = "this.nEACyclesBaseIndexDisp";        // 8086: 11
            break;
        case 1:
            sModAddr = "this.regBX + this.regDI + this.getIPDisp()";
            sModFunc = "BXDID8";
            nCycles = "this.nEACyclesBaseIndexDispExtra";   // 8086: 12
            break;
        case 2:
            sModAddr = "this.regBP + this.regSI + this.getIPDisp()";
            sModFunc = "BPSID8";
            sModRegSeg = "this.segStack";
            nCycles = "this.nEACyclesBaseIndexDispExtra";   // 8086: 12
            break;
        case 3:
            sModAddr = "this.regBP + this.regDI + this.getIPDisp()";
            sModFunc = "BPDID8";
            sModRegSeg = "this.segStack";
            nCycles = "this.nEACyclesBaseIndexDisp";        // 8086: 11
            break;
        case 4:
            sModAddr = "this.regSI + this.getIPDisp()";
            sModFunc = "SID8";
            nCycles = "this.nEACyclesBaseDisp";             // 8086: 9
            break;
        case 5:
            sModAddr = "this.regDI + this.getIPDisp()";
            sModFunc = "DID8";
            nCycles = "this.nEACyclesBaseDisp";             // 8086: 9
            break;
        case 6:
            sModAddr = "this.regBP + this.getIPDisp()";
            sModFunc = "BPD8";
            sModRegSeg = "this.segStack";
            nCycles = "this.nEACyclesBaseDisp";             // 8086: 9
            break;
        case 7:
            sModAddr = "this.regBX + this.getIPDisp()";
            sModFunc = "BXD8";
            nCycles = "this.nEACyclesBaseDisp";             // 8086: 9
            break;
        default:
            sError = "unrecognized mod=1 r/m: " + r_m;
            break;
        }
        break;
    case 2:
        switch (r_m) {
        case 0:
            sModAddr = "this.regBX + this.regSI + this.getIPWord()";
            sModFunc = "BXSID16";
            nCycles = "this.nEACyclesBaseIndexDisp";        // 8086: 11
            break;
        case 1:
            sModAddr = "this.regBX + this.regDI + this.getIPWord()";
            sModFunc = "BXDID16";
            nCycles = "this.nEACyclesBaseIndexDispExtra";   // 8086: 12
            break;
        case 2:
            sModAddr = "this.regBP + this.regSI + this.getIPWord()";
            sModFunc = "BPSID16";
            sModRegSeg = "this.segStack";
            nCycles = "this.nEACyclesBaseIndexDispExtra";   // 8086: 12
            break;
        case 3:
            sModAddr = "this.regBP + this.regDI + this.getIPWord()";
            sModFunc = "BPDID16";
            sModRegSeg = "this.segStack";
            nCycles = "this.nEACyclesBaseIndexDisp";        // 8086: 11
            break;
        case 4:
            sModAddr = "this.regSI + this.getIPWord()";
            sModFunc = "SID16";
            nCycles = "this.nEACyclesBaseDisp";             // 8086: 9
            break;
        case 5:
            sModAddr = "this.regDI + this.getIPWord()";
            sModFunc = "DID16";
            nCycles = "this.nEACyclesBaseDisp";             // 8086: 9
            break;
        case 6:
            sModAddr = "this.regBP + this.getIPWord()";
            sModFunc = "BPD16";
            sModRegSeg = "this.segStack";
            nCycles = "this.nEACyclesBaseDisp";             // 8086: 9
            break;
        case 7:
            sModAddr = "this.regBX + this.getIPWord()";
            sModFunc = "BXD16";
            nCycles = "this.nEACyclesBaseDisp";             // 8086: 9
            break;
        default:
            sError = "unrecognized mod=2 r/m: " + r_m;
            break;
        }
        break;
    case 3:
        if (!w) {
            switch (r_m) {
            case 0:
                sModRegGet = "this.regAX & 0xff";
                sModRegSet = "this.regAX = (this.regAX & ~0xff) | ";
                break;
            case 1:
                sModRegGet = "this.regCX & 0xff";
                sModRegSet = "this.regCX = (this.regCX & ~0xff) | ";
                break;
            case 2:
                sModRegGet = "this.regDX & 0xff";
                sModRegSet = "this.regDX = (this.regDX & ~0xff) | ";
                break;
            case 3:
                sModRegGet = "this.regBX & 0xff";
                sModRegSet = "this.regBX = (this.regBX & ~0xff) | ";
                break;
            case 4:
                sModRegGet = "this.regAX >> 8";
                sModRegSet = "this.regAX = (this.regAX & 0xff) | ";
                sModRegSetEnd = " << 8";
                break;
            case 5:
                sModRegGet = "this.regCX >> 8";
                sModRegSet = "this.regCX = (this.regCX & 0xff) | ";
                sModRegSetEnd = " << 8";
                break;
            case 6:
                sModRegGet = "this.regDX >> 8";
                sModRegSet = "this.regDX = (this.regDX & 0xff) | ";
                sModRegSetEnd = " << 8";
                break;
            case 7:
                sModRegGet = "this.regBX >> 8";
                sModRegSet = "this.regBX = (this.regBX & 0xff) | ";
                sModRegSetEnd = " << 8";
                break;
            default:
                sError = "unrecognized w=0 mod=3 r/m: " + r_m;
                break;
            }
        }
        else {
            switch (r_m) {
            case 0:
                sModRegGet = "this.regAX";
                break;
            case 1:
                sModRegGet = "this.regCX";
                break;
            case 2:
                sModRegGet = "this.regDX";
                break;
            case 3:
                sModRegGet = "this.regBX";
                break;
            case 4:
                sModRegGet = "this.regSP";
                break;
            case 5:
                sModRegGet = "this.regBP";
                break;
            case 6:
                sModRegGet = "this.regSI";
                break;
            case 7:
                sModRegGet = "this.regDI";
                break;
            default:
                sError = "unrecognized w=1 mod=3 r/m: " + r_m;
                break;
            }
        }
        break;
    default:
        sError = "unrecognized mod: " + mod;
        break;
    }

    if (sError) {
        print(sError);
        return null;
    }

    sOpMod = "opMod" + (sGroup? sGroup + (sRO? sRO : "") : aDst[d]) + aSize[w] + toHex(mrm, 2);

    var sTemp = aSize[w].charAt(0).toLowerCase();

    if (sGroup) {
        /*
         * Use this to generate ModRM decoders that accept an array (ie, "group") of functions, and pass along an implied argument as well 
         */
        if (sRO && reg != 7) {
            sOpMod = "opMod" + (sGroup? sGroup : aDst[d]) + aSize[w] + toHex(mrm, 2);
            return sOpMod;
        }

        print("    /**");
        print("     * @this {X86CPU}");
        print("     * @param {Array.<function(number,number)>} afnGrp");
        print("     * @param {function()} fnSrc");
        print("     *");
        print("     * mod=" + toMod(d, mod) + "  reg=" + toReg(d, w, reg, sGroup) + "  r/m=" + toRM(mod, w, r_m));
        print("     */");
        print("    " + sOpMod + ": function(afnGrp, fnSrc) {");

        if (sModAddr) {
            if (sModAddr.indexOf("+") > 0)
                sModAddr = "((" + sModAddr + ") & 0xffff)";
            if (!d) {
                if (reg == 7 && sRO) {
                    if (sModFunc) {
                        if (fInline) {
                            print("        afnGrp[" + reg + "].call(this, this.getEA" + aSize[w] + "(" + sModRegSeg + ", " + sModAddr + "), fnSrc.call(this));");
                        } else {
                            sModFunc = "read" + sModFunc + aSize[w];
                            print("        var addr = X86Mods." + sModFunc + ".call(this);");
                            print("        afnGrp[" + reg + "].call(this, this.getEA" + aSize[w] + "(addr), fnSrc.call(this));");
                            genEAFunc(sModFunc, "this.regEA = " + sModRegSeg + "[1] + " + sModAddr);
                        }
                    } else {
                        print("        this.regEA = " + sModRegSeg + "[1] + " + sModAddr + ";");
                        print("        afnGrp[" + reg + "].call(this, this.getEA" + aSize[w] + "(this.regEA), fnSrc.call(this));");
                    }
                }
                else {
                    if (sModFunc) {
                        if (fInline) {
                            print("        var " + sTemp + " = afnGrp[" + reg + "].call(this, this.modEA" + aSize[w] + "(" + sModRegSeg + ", " + sModAddr + "), fnSrc.call(this));");
                            print("        this.setEA" + aSize[w] + "(" + sTemp + ");");
                        } else {
                            sModFunc = "write" + sModFunc + aSize[w];
                            print("        var addr = X86Mods." + sModFunc + ".call(this);");
                            print("        var " + sTemp + " = afnGrp[" + reg + "].call(this, this.modEA" + aSize[w] + "(addr), fnSrc.call(this));");
                            print("        this.setEA" + aSize[w] + "(addr, " + sTemp + ");");
                            genEAFunc(sModFunc, "this.regEAWrite = " + sModRegSeg + "[1] + " + sModAddr);
                        }
                    } else {
                        print("        this.regEAWrite = " + sModRegSeg + "[1] + " + sModAddr + ";");
                        print("        var " + sTemp + " = afnGrp[" + reg + "].call(this, this.modEA" + aSize[w] + "(this.regEAWrite), fnSrc.call(this));");
                        print("        this.setEA" + aSize[w] + "(this.regEAWrite, " + sTemp + ");");
                    }
                }
                if (nCycles !== null)
                    print("        this.nStepCycles -= " + nCycles + ";");
            }
        }
        else if (sModRegGet) {
            if (!sModRegSet) {
                sModRegSet = sModRegGet + " = ";
                sTemp = null;
            }
            if (sModRegSetEnd) {
                sModRegSetBegin = "(";
                sModRegSetEnd += ")";
            }
            if (reg == 7 && sRO) {
                print("        afnGrp[" + reg + "].call(this, " + sModRegGet + ", fnSrc.call(this));");
            } else {
                if (!sTemp) {
                    print("        " + sModRegSet + sModRegSetBegin + "afnGrp[" + reg + "].call(this, " + sModRegGet + ", fnSrc.call(this))" + sModRegSetEnd + ";");
                } else {
                    print("        var " + sTemp + " = afnGrp[" + reg + "].call(this, " + sModRegGet + ", fnSrc.call(this));");
                    print("        " + sModRegSet + sModRegSetBegin + sTemp + sModRegSetEnd + ";");
                }
            }
        }
    }
    else {

        /*
         * Is this OpMod a duplicate OpMod?  Specifically, when mod is 3 and d is 0, the destination is a register specified by r_m,
         * which should match the OpMod handler for when mod' == 3 and d' == 1 and reg' == r_m and r_m' == reg.
         */
        if (mod == 3 && !d) {
            var mrmPrime = (mod << 6) | (r_m << 3) | reg;
            sOpMod = "opMod" + aDst[1] + aSize[w] + toHex(mrmPrime, 2);
            return sOpMod;
        }

        print("    /**");
        print("     * @this {X86CPU}");
        print("     * @param {function(number,number)} fn (dst,src)");
        print("     *");
        print("     * mod=" + toMod(d, mod) + "  reg=" + toReg(d, w, reg) + "  r/m=" + toRM(mod, w, r_m));
        print("     */");
        print("    " + sOpMod + ": function(fn) {");

        if (sModAddr && sRegGet) {

            if (sModAddr.indexOf("+") > 0)
                sModAddr = "((" + sModAddr + ") & 0xffff)";
            if (!d) {
                if (sModFunc) {
                    if (fInline) {
                        print("        var " + sTemp + " = fn.call(this, this.modEA" + aSize[w] + "(" + sModRegSeg + ", " + sModAddr + "), " + sRegGet + ");");
                        print("        this.setEA" + aSize[w] + "(" + sTemp + ");");
                    } else {
                        sModFunc = "write" + sModFunc + aSize[w];
                        print("        var addr = X86Mods." + sModFunc + ".call(this);");
                        print("        var " + sTemp + " = fn.call(this, this.modEA" + aSize[w] + "(addr), " + sRegGet + ");");
                        print("        this.setEA" + aSize[w] + "(addr, " + sTemp + ");");
                        genEAFunc(sModFunc, "this.regEAWrite = " + sModRegSeg + "[1] + " + sModAddr);
                    }
                } else {
                    print("        this.regEAWrite = " + sModRegSeg + "[1] + " + sModAddr + ";");
                    print("        var " + sTemp + " = fn.call(this, this.modEA" + aSize[w] + "(this.regEAWrite), " + sRegGet + ");");
                    print("        this.setEA" + aSize[w] + "(this.regEAWrite, " + sTemp + ");");
                }
            }
            else {
                if (!sRegSet) {
                    sRegSet = sRegGet + " = ";
                    sTemp = null;
                }
                if (sRegSetEnd) {
                    sRegSetBegin = "(";
                    sRegSetEnd += ")";
                }
                if (sModFunc) {
                    if (fInline) {
                        if (!sTemp) {
                            print("        " + sRegSet + sRegSetBegin + "fn.call(this, " + sRegGet + ", this.getEA" + aSize[w] + "(" + sModRegSeg + ", " + sModAddr + "))" + sRegSetEnd + ";");
                        } else {
                            print("        var " + sTemp + " = fn.call(this, " + sRegGet + ", this.getEA" + aSize[w] + "(" + sModRegSeg + ", " + sModAddr + "));");
                            print("        " + sRegSet + sRegSetBegin + sTemp + sRegSetEnd + ";");
                        }
                    } else {
                        sModFunc = "read" + sModFunc + aSize[w];
                        print("        var addr = X86Mods." + sModFunc + ".call(this);");
                        if (!sTemp) {
                            print("        " + sRegSet + sRegSetBegin + "fn.call(this, " + sRegGet + ", this.getEA" + aSize[w] + "(addr))" + sRegSetEnd + ";");
                        } else {
                            print("        var " + sTemp + " = fn.call(this, " + sRegGet + ", this.getEA" + aSize[w] + "(addr));");
                            print("        " + sRegSet + sRegSetBegin + sTemp + sRegSetEnd + ";");
                        }
                        genEAFunc(sModFunc, "this.regEA = " + sModRegSeg + "[1] + " + sModAddr);
                    }
                } else {
                    print("        this.regEA = " + sModRegSeg + "[1] + " + sModAddr + ";");
                    if (!sTemp) {
                        print("        " + sRegSet + sRegSetBegin + "fn.call(this, " + sRegGet + ", this.getEA" + aSize[w] + "(this.regEA))" + sRegSetEnd + ";");
                    } else {
                        print("        var " + sTemp + " = fn.call(this, " + sRegGet + ", this.getEA" + aSize[w] + "(this.regEA));");
                        print("        " + sRegSet + sRegSetBegin + sTemp + sRegSetEnd + ";");
                    }
                }
            }
            if (nCycles !== null)
                print("        this.nStepCycles -= " + nCycles + ";");
        }
        else if (sModRegGet && sRegGet) {
            if (!d) {
                if (!sModRegSet) {
                    sModRegSet = sModRegGet + " = ";
                    sTemp = null;
                }
                if (sModRegSetEnd) {
                    sModRegSetBegin = "(";
                    sModRegSetEnd += ")";
                }
                if (!sTemp) {
                    print("        " + sModRegSet + sModRegSetBegin + "fn.call(this, " + sModRegGet + ", " + sRegGet + ")" + sModRegSetEnd + ";");
                } else {
                    print("        var " + sTemp + " = fn.call(this, " + sModRegGet + ", " + sRegGet + ");");
                    print("        " + sModRegSet + sModRegSetBegin + sTemp + sModRegSetEnd + ";");
                }
            }
            else {
                if (!sRegSet) {
                    sRegSet = sRegGet + " = ";
                    sTemp = null;
                }
                if (sRegSetEnd) {
                    sRegSetBegin = "(";
                    sRegSetEnd += ")";
                }
                if (!sTemp) {
                    print("        " + sRegSet + sRegSetBegin + "fn.call(this, " + sRegGet + ", " + sModRegGet + ")" + sRegSetEnd + ";");
                } else {
                    print("        var " + sTemp + " = fn.call(this, " + sRegGet + ", " + sModRegGet + ");");
                    print("        " + sRegSet + sRegSetBegin + sTemp + sRegSetEnd + ";");
                }
            }
        }
    }

    print("    }" + (mrm < 0xff? "," : ""));

    return sOpMod;
}

function genEAFunc(sFuncName, sFuncBody) {
    if (sEAFuncs.indexOf(sFuncName) < 0) {
        sEAFuncs += "    /**\n";
        sEAFuncs += "     * @this {X86CPU}\n";
        sEAFuncs += "     * @return {number}\n";
        sEAFuncs += "     */\n";
        sEAFuncs += "    " + sFuncName + ": function() {\n";
        sEAFuncs += "        return (" + sFuncBody + ");\n";
        sEAFuncs += "    },\n";
    }
}

function toMod(d, mod) {
    return toBin(mod, 2) + " (" + aMOD[mod] + ":" + (d? "src" : "dst") + ")";
}

function toReg(d, w, reg, sGroup) {
    return toBin(reg, 3) + " (" + (sGroup? "afnGrp[" + reg + "]" : aREG[w][reg] + ":" + (d? "dst" : "src")) + ")";
}

function toRM(mod, w, r_m) {
    return toBin(r_m, 3) + " (" + aRM[mod][mod < 3? 0 : w][r_m] + ")";
}

function toBin(v, len) {
    var s = "0000000000000000" + v.toString(2);
    return s.slice(s.length - (len === undefined? 8 : (len < 16? len : 16)));
}

function toHex(v, len) {
    var s = "00000000" + v.toString(16);
    return s.slice(s.length - (len === undefined? 4 : (len < 8? len : 8))).toUpperCase();
}
