/**
 * @fileoverview Implements PDP-10 opcode handlers.
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
    var PDP10 = require("./defines");
}

/**
 * opUUO(000000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opUUO = function(opCode)
{
};

/**
 * opUFA(130000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opUFA = function(opCode)
{
};

/**
 * opDFN(131000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opDFN = function(opCode)
{
};

/**
 * opFSC(132000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFSC = function(opCode)
{
};

/**
 * opIBP(133000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIBP = function(opCode)
{
};

/**
 * opILDB(134000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opILDB = function(opCode)
{
};

/**
 * opLDB(135000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opLDB = function(opCode)
{
};

/**
 * opIDPB(136000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIDPB = function(opCode)
{
};

/**
 * opDPB(137000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opDPB = function(opCode)
{
};

/**
 * opFAD(140000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFAD = function(opCode)
{
};

/**
 * opFADI(141000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFADI = function(opCode)
{
};

/**
 * opFADM(142000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFADM = function(opCode)
{
};

/**
 * opFADB(143000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFADB = function(opCode)
{
};

/**
 * opFADR(144000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFADR = function(opCode)
{
};

/**
 * opFADRI(145000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFADRI = function(opCode)
{
};

/**
 * opFADRM(146000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFADRM = function(opCode)
{
};

/**
 * opFADRB(147000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFADRB = function(opCode)
{
};

/**
 * opFSB(150000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFSB = function(opCode)
{
};

/**
 * opFSBI(151000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFSBI = function(opCode)
{
};

/**
 * opFSBM(152000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFSBM = function(opCode)
{
};

/**
 * opFSBB(153000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFSBB = function(opCode)
{
};

/**
 * opFSBR(154000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFSBR = function(opCode)
{
};

/**
 * opFSBRI(155000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFSBRI = function(opCode)
{
};

/**
 * opFSBRM(156000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFSBRM = function(opCode)
{
};

/**
 * opFSBRB(157000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFSBRB = function(opCode)
{
};

/**
 * opFMP(160000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFMP = function(opCode)
{
};

/**
 * opFMPI(161000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFMPI = function(opCode)
{
};

/**
 * opFMPM(162000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFMPM = function(opCode)
{
};

/**
 * opFMPB(163000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFMPB = function(opCode)
{
};

/**
 * opFMPR(164000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFMPR = function(opCode)
{
};

/**
 * opFMPRI(165000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFMPRI = function(opCode)
{
};

/**
 * opFMPRM(166000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFMPRM = function(opCode)
{
};

/**
 * opFMPRB(167000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFMPRB = function(opCode)
{
};

/**
 * opFDV(170000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFDV = function(opCode)
{
};

/**
 * opFDVI(171000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFDVI = function(opCode)
{
};

/**
 * opFDVM(172000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFDVM = function(opCode)
{
};

/**
 * opFDVB(173000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFDVB = function(opCode)
{
};

/**
 * opFDVR(174000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFDVR = function(opCode)
{
};

/**
 * opFDVRI(175000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFDVRI = function(opCode)
{
};

/**
 * opFDVRM(176000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFDVRM = function(opCode)
{
};

/**
 * opFDVRB(177000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFDVRB = function(opCode)
{
};

/**
 * opMOV(200000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOV = function(opCode)
{
};

/**
 * opMOVI(201000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVI = function(opCode)
{
};

/**
 * opMOVM(200000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVM = function(opCode)
{
};

/**
 * opMOVS(200000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVS = function(opCode)
{
};

/**
 * opMOVSI(205000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVSI = function(opCode)
{
};

/**
 * opMOVSM(206000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVSM = function(opCode)
{
};

/**
 * opMOVSS(207000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVSS = function(opCode)
{
};

/**
 * opMOVN(210000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVN = function(opCode)
{
};

/**
 * opMOVNI(211000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVNI = function(opCode)
{
};

/**
 * opMOVNM(212000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVNM = function(opCode)
{
};

/**
 * opMOVNS(213000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVNS = function(opCode)
{
};

/**
 * opMOVMI(215000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVMI = function(opCode)
{
};

/**
 * opMOVMM(216000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVMM = function(opCode)
{
};

/**
 * opMOVMS(217000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMOVMS = function(opCode)
{
};

/**
 * opIMUL(220000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIMUL = function(opCode)
{
};

/**
 * opIMULI(221000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIMULI = function(opCode)
{
};

/**
 * opIMULM(222000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIMULM = function(opCode)
{
};

/**
 * opIMULB(223000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIMULB = function(opCode)
{
};

/**
 * opMUL(224000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMUL = function(opCode)
{
};

/**
 * opMULI(225000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMULI = function(opCode)
{
};

/**
 * opMULM(226000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMULM = function(opCode)
{
};

/**
 * opMULB(227000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opMULB = function(opCode)
{
};

/**
 * opIDIV(230000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIDIV = function(opCode)
{
};

/**
 * opIDIVI(231000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIDIVI = function(opCode)
{
};

/**
 * opIDIVM(232000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIDIVM = function(opCode)
{
};

/**
 * opIDIVB(233000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIDIVB = function(opCode)
{
};

/**
 * opDIV(234000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opDIV = function(opCode)
{
};

/**
 * opDIVI(235000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opDIVI = function(opCode)
{
};

/**
 * opDIVM(236000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opDIVM = function(opCode)
{
};

/**
 * opDIVB(237000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opDIVB = function(opCode)
{
};

/**
 * opASH(240000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opASH = function(opCode)
{
};

/**
 * opROT(241000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opROT = function(opCode)
{
};

/**
 * opLSH(242000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opLSH = function(opCode)
{
};

/**
 * opJFFO(243000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJFFO = function(opCode)
{
};

/**
 * opASHC(244000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opASHC = function(opCode)
{
};

/**
 * opROTC(245000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opROTC = function(opCode)
{
};

/**
 * opLSHC(246000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opLSHC = function(opCode)
{
};

/**
 * opEXCH(250000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opEXCH = function(opCode)
{
};

/**
 * opBLT(251000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opBLT = function(opCode)
{
};

/**
 * opAOBJP(252000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOBJP = function(opCode)
{
};

/**
 * opAOBJN(253000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOBJN = function(opCode)
{
};

/**
 * opJRST(254000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJRST = function(opCode)
{
};

/**
 * opJFCL(255000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJFCL = function(opCode)
{
};

/**
 * opXCT(256000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opXCT = function(opCode)
{
};

/**
 * opPUSHJ(260000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opPUSHJ = function(opCode)
{
};

/**
 * opPUSH(261000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opPUSH = function(opCode)
{
};

/**
 * opPOP(262000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opPOP = function(opCode)
{
};

/**
 * opPOPJ(263000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opPOPJ = function(opCode)
{
};

/**
 * opJSR(264000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJSR = function(opCode)
{
};

/**
 * opJSP(265000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJSP = function(opCode)
{
};

/**
 * opJSA(266000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJSA = function(opCode)
{
};

/**
 * opJRA(267000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJRA = function(opCode)
{
};

/**
 * opADD(270000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opADD = function(opCode)
{
};

/**
 * opADDI(271000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opADDI = function(opCode)
{
};

/**
 * opADDM(272000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opADDM = function(opCode)
{
};

/**
 * opADDB(273000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opADDB = function(opCode)
{
};

/**
 * opSUB(274000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSUB = function(opCode)
{
};

/**
 * opSUBI(275000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSUBI = function(opCode)
{
};

/**
 * opSUBM(276000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSUBM = function(opCode)
{
};

/**
 * opSUBB(277000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSUBB = function(opCode)
{
};

/**
 * opCAI(300000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAI = function(opCode)
{
};

/**
 * opCAIL(301000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAIL = function(opCode)
{
};

/**
 * opCAIE(302000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAIE = function(opCode)
{
};

/**
 * opCAILE(303000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAILE = function(opCode)
{
};

/**
 * opCAIA(304000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAIA = function(opCode)
{
};

/**
 * opCAIGE(305000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAIGE = function(opCode)
{
};

/**
 * opCAIN(306000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAIN = function(opCode)
{
};

/**
 * opCAIG(307000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAIG = function(opCode)
{
};

/**
 * opCA(310000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCA = function(opCode)
{
};

/**
 * opCAL(311000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAL = function(opCode)
{
};

/**
 * opCAE(312000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAE = function(opCode)
{
};

/**
 * opCALE(313000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCALE = function(opCode)
{
};

/**
 * opCAA(314000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAA = function(opCode)
{
};

/**
 * opCAGE(315000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAGE = function(opCode)
{
};

/**
 * opCAN(316000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAN = function(opCode)
{
};

/**
 * opCAG(317000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCAG = function(opCode)
{
};

/**
 * opJUMP(320000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJUMP = function(opCode)
{
};

/**
 * opJUMPL(321000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJUMPL = function(opCode)
{
};

/**
 * opJUMPE(322000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJUMPE = function(opCode)
{
};

/**
 * opJUMPLE(323000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJUMPLE = function(opCode)
{
};

/**
 * opJUMPA(324000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJUMPA = function(opCode)
{
};

/**
 * opJUMPGE(325000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJUMPGE = function(opCode)
{
};

/**
 * opJUMPN(326000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJUMPN = function(opCode)
{
};

/**
 * opJUMPG(327000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opJUMPG = function(opCode)
{
};

/**
 * opSKIP(330000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSKIP = function(opCode)
{
};

/**
 * opSKIPL(331000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSKIPL = function(opCode)
{
};

/**
 * opSKIPE(332000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSKIPE = function(opCode)
{
};

/**
 * opSKIPLE(333000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSKIPLE = function(opCode)
{
};

/**
 * opSKIPA(334000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSKIPA = function(opCode)
{
};

/**
 * opSKIPGE(335000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSKIPGE = function(opCode)
{
};

/**
 * opSKIPN(336000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSKIPN = function(opCode)
{
};

/**
 * opSKIPG(337000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSKIPG = function(opCode)
{
};

/**
 * opAOJ(340000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOJ = function(opCode)
{
};

/**
 * opAOJL(341000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOJL = function(opCode)
{
};

/**
 * opAOJE(342000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOJE = function(opCode)
{
};

/**
 * opAOJLE(343000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOJLE = function(opCode)
{
};

/**
 * opAOJA(344000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOJA = function(opCode)
{
};

/**
 * opAOJGE(345000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOJGE = function(opCode)
{
};

/**
 * opAOJN(346000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOJN = function(opCode)
{
};

/**
 * opAOJG(347000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOJG = function(opCode)
{
};

/**
 * opAOS(350000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOS = function(opCode)
{
};

/**
 * opAOSL(351000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOSL = function(opCode)
{
};

/**
 * opAOSE(352000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOSE = function(opCode)
{
};

/**
 * opAOSLE(353000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOSLE = function(opCode)
{
};

/**
 * opAOSA(354000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOSA = function(opCode)
{
};

/**
 * opAOSGE(355000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOSGE = function(opCode)
{
};

/**
 * opAOSN(356000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOSN = function(opCode)
{
};

/**
 * opAOSG(357000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAOSG = function(opCode)
{
};

/**
 * opSOJ(360000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOJ = function(opCode)
{
};

/**
 * opSOJL(361000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOJL = function(opCode)
{
};

/**
 * opSOJE(362000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOJE = function(opCode)
{
};

/**
 * opSOJLE(363000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOJLE = function(opCode)
{
};

/**
 * opSOJA(364000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOJA = function(opCode)
{
};

/**
 * opSOJGE(365000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOJGE = function(opCode)
{
};

/**
 * opSOJN(366000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOJN = function(opCode)
{
};

/**
 * opSOJG(367000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOJG = function(opCode)
{
};

/**
 * opSOS(370000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOS = function(opCode)
{
};

/**
 * opSOSL(371000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOSL = function(opCode)
{
};

/**
 * opSOSE(372000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOSE = function(opCode)
{
};

/**
 * opSOSLE(373000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOSLE = function(opCode)
{
};

/**
 * opSOSA(374000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOSA = function(opCode)
{
};

/**
 * opSOSGE(375000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOSGE = function(opCode)
{
};

/**
 * opSOSN(376000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOSN = function(opCode)
{
};

/**
 * opSOSG(377000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSOSG = function(opCode)
{
};

/**
 * opSETZ(400000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETZ = function(opCode)
{
};

/**
 * opSETZI(401000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETZI = function(opCode)
{
};

/**
 * opSETZM(402000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETZM = function(opCode)
{
};

/**
 * opSETZB(403000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETZB = function(opCode)
{
};

/**
 * opAND(404000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opAND = function(opCode)
{
};

/**
 * opANDI(405000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDI = function(opCode)
{
};

/**
 * opANDM(406000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDM = function(opCode)
{
};

/**
 * opANDB(407000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDB = function(opCode)
{
};

/**
 * opANDCA(410000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCA = function(opCode)
{
};

/**
 * opANDCAI(411000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCAI = function(opCode)
{
};

/**
 * opANDCAM(412000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCAM = function(opCode)
{
};

/**
 * opANDCAB(413000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCAB = function(opCode)
{
};

/**
 * opSETM(414000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETM = function(opCode)
{
};

/**
 * opSETMI(415000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETMI = function(opCode)
{
};

/**
 * opSETMM(416000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETMM = function(opCode)
{
};

/**
 * opSETMB(417000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETMB = function(opCode)
{
};

/**
 * opANDCM(420000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCM = function(opCode)
{
};

/**
 * opANDCMI(421000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCMI = function(opCode)
{
};

/**
 * opANDCMM(422000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCMM = function(opCode)
{
};

/**
 * opANDCMB(423000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCMB = function(opCode)
{
};

/**
 * opSETA(424000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETA = function(opCode)
{
};

/**
 * opSETAI(425000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETAI = function(opCode)
{
};

/**
 * opSETAM(426000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETAM = function(opCode)
{
};

/**
 * opSETAB(427000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETAB = function(opCode)
{
};

/**
 * opXOR(430000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opXOR = function(opCode)
{
};

/**
 * opXORI(431000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opXORI = function(opCode)
{
};

/**
 * opXORM(432000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opXORM = function(opCode)
{
};

/**
 * opXORB(433000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opXORB = function(opCode)
{
};

/**
 * opIOR(434000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIOR = function(opCode)
{
};

/**
 * opIORI(435000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIORI = function(opCode)
{
};

/**
 * opIORM(436000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIORM = function(opCode)
{
};

/**
 * opIORB(437000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIORB = function(opCode)
{
};

/**
 * opANDCB(440000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCB = function(opCode)
{
};

/**
 * opANDCBI(441000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCBI = function(opCode)
{
};

/**
 * opANDCBM(442000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCBM = function(opCode)
{
};

/**
 * opANDCBB(443000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opANDCBB = function(opCode)
{
};

/**
 * opEQV(444000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opEQV = function(opCode)
{
};

/**
 * opEQVI(445000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opEQVI = function(opCode)
{
};

/**
 * opEQVM(446000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opEQVM = function(opCode)
{
};

/**
 * opEQVB(447000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opEQVB = function(opCode)
{
};

/**
 * opSETCA(450000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETCA = function(opCode)
{
};

/**
 * opSETCAI(451000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETCAI = function(opCode)
{
};

/**
 * opSETCAM(452000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETCAM = function(opCode)
{
};

/**
 * opSETCAB(453000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETCAB = function(opCode)
{
};

/**
 * opORCA(454000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCA = function(opCode)
{
};

/**
 * opORCAI(455000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCAI = function(opCode)
{
};

/**
 * opORCAM(456000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCAM = function(opCode)
{
};

/**
 * opORCAB(457000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCAB = function(opCode)
{
};

/**
 * opSETCM(460000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETCM = function(opCode)
{
};

/**
 * opSETCMI(461000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETCMI = function(opCode)
{
};

/**
 * opSETCMM(462000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETCMM = function(opCode)
{
};

/**
 * opSETCMB(463000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETCMB = function(opCode)
{
};

/**
 * opORCM(464000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCM = function(opCode)
{
};

/**
 * opORCMI(465000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCMI = function(opCode)
{
};

/**
 * opORCMM(466000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCMM = function(opCode)
{
};

/**
 * opORCMB(467000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCMB = function(opCode)
{
};

/**
 * opORCB(470000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCB = function(opCode)
{
};

/**
 * opORCBI(471000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCBI = function(opCode)
{
};

/**
 * opORCBM(472000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCBM = function(opCode)
{
};

/**
 * opORCBB(473000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opORCBB = function(opCode)
{
};

/**
 * opSETO(474000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETO = function(opCode)
{
};

/**
 * opSETOI(475000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETOI = function(opCode)
{
};

/**
 * opSETOM(476000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETOM = function(opCode)
{
};

/**
 * opSETOB(477000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opSETOB = function(opCode)
{
};

/**
 * opHLL(500000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLL = function(opCode)
{
};

/**
 * opHLLI(501000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLI = function(opCode)
{
};

/**
 * opHLLM(502000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLM = function(opCode)
{
};

/**
 * opHLLS(503000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLS = function(opCode)
{
};

/**
 * opHRL(504000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRL = function(opCode)
{
};

/**
 * opHRLI(505000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLI = function(opCode)
{
};

/**
 * opHRLM(506000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLM = function(opCode)
{
};

/**
 * opHRLS(507000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLS = function(opCode)
{
};

/**
 * opHLLZ(510000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLZ = function(opCode)
{
};

/**
 * opHLLZI(511000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLZI = function(opCode)
{
};

/**
 * opHLLZM(512000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLZM = function(opCode)
{
};

/**
 * opHLLZS(513000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLZS = function(opCode)
{
};

/**
 * opHRLZ(514000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLZ = function(opCode)
{
};

/**
 * opHRLZI(515000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLZI = function(opCode)
{
};

/**
 * opHRLZM(516000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLZM = function(opCode)
{
};

/**
 * opHRLZS(517000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLZS = function(opCode)
{
};

/**
 * opHLLO(520000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLO = function(opCode)
{
};

/**
 * opHLLOI(521000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLOI = function(opCode)
{
};

/**
 * opHLLOM(522000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLOM = function(opCode)
{
};

/**
 * opHLLOS(523000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLOS = function(opCode)
{
};

/**
 * opHRLO(524000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLO = function(opCode)
{
};

/**
 * opHRLOI(525000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLOI = function(opCode)
{
};

/**
 * opHRLOM(526000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLOM = function(opCode)
{
};

/**
 * opHRLOS(527000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLOS = function(opCode)
{
};

/**
 * opHLLE(530000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLE = function(opCode)
{
};

/**
 * opHLLEI(531000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLEI = function(opCode)
{
};

/**
 * opHLLEM(532000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLEM = function(opCode)
{
};

/**
 * opHLLES(533000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLLES = function(opCode)
{
};

/**
 * opHRLE(534000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLE = function(opCode)
{
};

/**
 * opHRLEI(535000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLEI = function(opCode)
{
};

/**
 * opHRLEM(536000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLEM = function(opCode)
{
};

/**
 * opHRLES(537000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRLES = function(opCode)
{
};

/**
 * opHRR(540000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRR = function(opCode)
{
};

/**
 * opHRRI(541000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRRI = function(opCode)
{
};

/**
 * opHRRM(542000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRRM = function(opCode)
{
};

/**
 * opHRRS(543000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRRS = function(opCode)
{
};

/**
 * opHLR(544000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLR = function(opCode)
{
};

/**
 * opHLRI(545000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLRI = function(opCode)
{
};

/**
 * opHLRM(546000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLRM = function(opCode)
{
};

/**
 * opHLRS(547000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLRS = function(opCode)
{
};

/**
 * opHRRZ(550000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRRZ = function(opCode)
{
};

/**
 * opHRRZI(551000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRRZI = function(opCode)
{
};

/**
 * opHRRZM(552000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRRZM = function(opCode)
{
};

/**
 * opHRRZS(553000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRRZS = function(opCode)
{
};

/**
 * opHLRZ(554000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLRZ = function(opCode)
{
};

/**
 * opHLRZI(555000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLRZI = function(opCode)
{
};

/**
 * opHLRZM(556000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLRZM = function(opCode)
{
};

/**
 * opHLRZS(557000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLRZS = function(opCode)
{
};

/**
 * opHRRO(560000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRRO = function(opCode)
{
};

/**
 * opHRROI(561000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRROI = function(opCode)
{
};

/**
 * opHRROM(562000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRROM = function(opCode)
{
};

/**
 * opHRROS(563000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRROS = function(opCode)
{
};

/**
 * opHLRO(564000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLRO = function(opCode)
{
};

/**
 * opHLROI(565000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLROI = function(opCode)
{
};

/**
 * opHLROM(566000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLROM = function(opCode)
{
};

/**
 * opHLROS(567000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLROS = function(opCode)
{
};

/**
 * opHRRE(570000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRRE = function(opCode)
{
};

/**
 * opHRREI(571000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRREI = function(opCode)
{
};

/**
 * opHRREM(572000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRREM = function(opCode)
{
};

/**
 * opHRRES(573000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHRRES = function(opCode)
{
};

/**
 * opHLRE(574000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLRE = function(opCode)
{
};

/**
 * opHLREI(575000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLREI = function(opCode)
{
};

/**
 * opHLREM(576000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLREM = function(opCode)
{
};

/**
 * opHLRES(577000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opHLRES = function(opCode)
{
};

/**
 * opTRN(600000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRN = function(opCode)
{
};

/**
 * opTLN(601000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLN = function(opCode)
{
};

/**
 * opTRNE(602000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRNE = function(opCode)
{
};

/**
 * opTLNE(603000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLNE = function(opCode)
{
};

/**
 * opTRNA(604000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRNA = function(opCode)
{
};

/**
 * opTLNA(605000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLNA = function(opCode)
{
};

/**
 * opTRNN(606000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRNN = function(opCode)
{
};

/**
 * opTLNN(607000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLNN = function(opCode)
{
};

/**
 * opTDN(610000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDN = function(opCode)
{
};

/**
 * opTSN(611000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSN = function(opCode)
{
};

/**
 * opTDNE(612000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDNE = function(opCode)
{
};

/**
 * opTSNE(613000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSNE = function(opCode)
{
};

/**
 * opTDNA(614000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDNA = function(opCode)
{
};

/**
 * opTSNA(615000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSNA = function(opCode)
{
};

/**
 * opTDNN(616000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDNN = function(opCode)
{
};

/**
 * opTSNN(617000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSNN = function(opCode)
{
};

/**
 * opTRZ(620000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRZ = function(opCode)
{
};

/**
 * opTLZ(621000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLZ = function(opCode)
{
};

/**
 * opTRZE(622000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRZE = function(opCode)
{
};

/**
 * opTLZE(623000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLZE = function(opCode)
{
};

/**
 * opTRZA(624000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRZA = function(opCode)
{
};

/**
 * opTLZA(625000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLZA = function(opCode)
{
};

/**
 * opTRZN(626000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRZN = function(opCode)
{
};

/**
 * opTLZN(627000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLZN = function(opCode)
{
};

/**
 * opTDZ(630000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDZ = function(opCode)
{
};

/**
 * opTSZ(631000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSZ = function(opCode)
{
};

/**
 * opTDZE(632000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDZE = function(opCode)
{
};

/**
 * opTSZE(633000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSZE = function(opCode)
{
};

/**
 * opTDZA(634000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDZA = function(opCode)
{
};

/**
 * opTSZA(635000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSZA = function(opCode)
{
};

/**
 * opTDZN(636000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDZN = function(opCode)
{
};

/**
 * opTSZN(637000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSZN = function(opCode)
{
};

/**
 * opTRC(640000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRC = function(opCode)
{
};

/**
 * opTLC(641000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLC = function(opCode)
{
};

/**
 * opTRCE(642000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRCE = function(opCode)
{
};

/**
 * opTLCE(643000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLCE = function(opCode)
{
};

/**
 * opTRCA(644000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRCA = function(opCode)
{
};

/**
 * opTLCA(645000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLCA = function(opCode)
{
};

/**
 * opTRCN(646000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRCN = function(opCode)
{
};

/**
 * opTLCN(647000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLCN = function(opCode)
{
};

/**
 * opTDC(650000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDC = function(opCode)
{
};

/**
 * opTSC(651000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSC = function(opCode)
{
};

/**
 * opTDCE(652000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDCE = function(opCode)
{
};

/**
 * opTSCE(653000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSCE = function(opCode)
{
};

/**
 * opTDCA(654000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDCA = function(opCode)
{
};

/**
 * opTSCA(655000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSCA = function(opCode)
{
};

/**
 * opTDCN(656000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDCN = function(opCode)
{
};

/**
 * opTSCN(657000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSCN = function(opCode)
{
};

/**
 * opTRO(660000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRO = function(opCode)
{
};

/**
 * opTLO(661000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLO = function(opCode)
{
};

/**
 * opTROE(662000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTROE = function(opCode)
{
};

/**
 * opTLOE(663000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLOE = function(opCode)
{
};

/**
 * opTROA(664000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTROA = function(opCode)
{
};

/**
 * opTLOA(665000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLOA = function(opCode)
{
};

/**
 * opTRON(666000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTRON = function(opCode)
{
};

/**
 * opTLON(667000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTLON = function(opCode)
{
};

/**
 * opTDO(670000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDO = function(opCode)
{
};

/**
 * opTSO(671000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSO = function(opCode)
{
};

/**
 * opTDOE(672000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDOE = function(opCode)
{
};

/**
 * opTSOE(673000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSOE = function(opCode)
{
};

/**
 * opTDOA(674000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDOA = function(opCode)
{
};

/**
 * opTSOA(675000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSOA = function(opCode)
{
};

/**
 * opTDON(676000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTDON = function(opCode)
{
};

/**
 * opTSON(677000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opTSON = function(opCode)
{
};

/**
 * opBLKI(700000 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opBLKI = function(opCode)
{
};

/**
 * opDATAI(700040 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opDATAI = function(opCode)
{
};

/**
 * opBLKO(700100 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opBLKO = function(opCode)
{
};

/**
 * opDATAO(700140 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opDATAO = function(opCode)
{
};

/**
 * opCONO(700200 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCONO = function(opCode)
{
};

/**
 * opCONI(700240 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCONI = function(opCode)
{
};

/**
 * opCONSZ(700300 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCONSZ = function(opCode)
{
};

/**
 * opCONSO(700340 000000)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opCONSO = function(opCode)
{
};
