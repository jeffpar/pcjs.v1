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
 * opUUO(0xx000 000000): Unimplemented User Operation
 *
 *  From the DEC PDP-10 System Reference Manual (May 1968), p. 2-64:
 *
 *  Store the instruction code, A and the effective address E in bits 0-8, 9-12 and 18-35 respectively of
 *  location 40; clear bits 13-17.  Execute the instruction contained in location 41.  The original contents
 *  of location 40 are lost.
 *
 *  All of these codes are equivalent when they occur in the Monitor or when time sharing is not in effect.
 *  But when a UUO appears in a user program, a code in the range 001-037 uses relocated locations 40 and 41
 *  (ie 40 and 41 in the user's block) and is thus entirely a part of and under control of the user program.
 *
 *  A code in the range 040-077 on the other hand uses unrelocated 40 and 41, and the instruction in the latter
 *  location is under control of the Monitor; these codes are thus specifically for user communication with
 *  the Monitor, which interprets them (refer to the Monitor manual for the meanings of the various codes).
 *
 *  The code 000 executes in the same way as 040-077 but is not a standard communication code: it is included
 *  so that control returns to the Monitor should a user program wipe itself out.
 *
 *  For a second processor connected to the same memory, the UUO trap is locations 140-141 instead of 40-41.
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opUUO = function(opCode)
{
};

/**
 * opUFA(130000 000000): Unnormalized Floating Add
 *
 *  From the DEC PDP-10 System Reference Manual (May 1968), p. 2-37:
 *
 *  Floating add the contents of location E to AC.  If the double length fraction in the sum is zero, clear
 *  accumulator A+1.  Otherwise normalize the sum only if the magnitude of its fractional part is >= 1, and place
 *  the high order part of the result in AC A+1.  The original contents of AC and E are unaffected.
 *
 *  NOTE: The result is placed in accumulator A+1. T his is the only arithmetic instruction that stores the result
 *  in a second accumulator, leaving the original operands intact.
 *
 *  If the exponent of the sum following the one-step normalization is > 127, set Overflow and Floating Overflow;
 *  the result stored has an exponent 256 less than the correct one.
 *
 *  SIDEBAR: The exponent of the sum is equal to that of the larger summand unless addition of the fractions
 *  overflows, in which case it is greater by 1.  Exponent overflow can occur only in the latter case.
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opUFA = function(opCode)
{
};

/**
 * opDFN(131000 000000): Double Floating Negate
 *
 *  From the DEC PDP-10 System Reference Manual (May 1968), p. 2-37:
 *
 *  Negate the double length floating point number composed of the contents of AC and location E with AC on the left.
 *  Do this by taking the twos complement of the number whose sign is AC bit 0, whose exponent is in AC bits 1-8, and
 *  whose fraction is the 54-bit string in bits 9-35 of AC and location E.  Place the high order word of the result
 *  in AC; place the low order part of the fraction in bits 9-35 of location E without altering the original contents
 *  of bits 0-8 of that location.
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opDFN = function(opCode)
{
};

/**
 * opFSC(132000 000000): Floating Scale
 *
 *  From the DEC PDP-10 System Reference Manual (May 1968), p. 2-34:
 *
 *  If the fractional part of AC is zero, clear AC.  Otherwise add the scale factor given by E to the exponent part
 *  of AC (thus multiplying AC by 2^E), normalize the resulting word bringing 0s into bit positions vacated at the
 *  right, and place the result back in AC.
 *
 *  NOTE: A negative E is represented in standard twos complement notation, but the hardware compensates for this
 *  when scaling the exponent.
 *
 *  If the exponent after normalization is > 127, set Overflow and Floating Overflow; the result stored has an
 *  exponent 256 less than the correct one.  If < -128, set Overflow, Floating Overflow and Floating Underflow;
 *  the result stored has an exponent 256 greater than the correct one.
 *
 *  SIDEBAR: This instruction can be used to float a fixed number with 27 or fewer significant bits.  To float an
 *  integer contained within AC bits 9-35,
 *
 *      FSC AC,233
 *
 *  inserts the correct exponent to move the binary point from the right end to the left of bit 9 and then normalizes
 *  (233(base 8) = 155(base 10) = 128 + 27).
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opFSC = function(opCode)
{
};

/**
 * opIBP(133000 000000): Increment Byte Pointer
 *
 *  From the DEC PDP-10 System Reference Manual (May 1968), p. 2-16:
 *
 *  Increment the byte pointer in location E as explained above.
 *
 *  FROM ABOVE: To facilitate processing a series of bytes, several of the byte instructions increment the pointer,
 *  ie, modify it so that it points to the next byte position in a set of memory locations.  Bytes are processed from
 *  left to right in a word, so incrementing merely replaces the current value of P by P - S, unless there is
 *  insufficient space in the present location for another byte of the specified size (P - S < 0).  In this case Y is
 *  increased by one to point to the next consecutive location, and P is set to 36 - S to point to the first byte at
 *  the left in the new location.
 *
 *  CAUTION: Do not allow Y to reach maximum value.  The whole pointer is incremented, so if Y is 2^18 - 1 it becomes
 *  zero and X is also incremented.  The address calculation for the pointer uses the original X, but if a priority
 *  interrupt should occur before the calculation is complete, the incremented X is used when the instruction is
 *  repeated.
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

/**
 * opIO(opCode)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opIO = function(opCode)
{
    PDP10.opUndefined.call(this, opCode);
};

/**
 * opUndefined()
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opUndefined = function(opCode)
{
};

/**
 * opKA10(opCode)
 *
 * @this {CPUStatePDP10}
 * @param {number} opCode
 */
PDP10.opKA10 = function(opCode)
{
    var op = (opCode / PDP10.OPCODE.SHIFT)|0;
    PDP10.aOpXXX_KA10[op].call(this, opCode);
};

PDP10.aOpXXX_KA10 = [
    PDP10.opUUO,                // 0o000xxx yyyyyy
    PDP10.opUUO,                // 0o001xxx yyyyyy
    PDP10.opUUO,                // 0o002xxx yyyyyy
    PDP10.opUUO,                // 0o003xxx yyyyyy
    PDP10.opUUO,                // 0o004xxx yyyyyy
    PDP10.opUUO,                // 0o005xxx yyyyyy
    PDP10.opUUO,                // 0o006xxx yyyyyy
    PDP10.opUUO,                // 0o007xxx yyyyyy
    PDP10.opUUO,                // 0o010xxx yyyyyy
    PDP10.opUUO,                // 0o011xxx yyyyyy
    PDP10.opUUO,                // 0o012xxx yyyyyy
    PDP10.opUUO,                // 0o013xxx yyyyyy
    PDP10.opUUO,                // 0o014xxx yyyyyy
    PDP10.opUUO,                // 0o015xxx yyyyyy
    PDP10.opUUO,                // 0o016xxx yyyyyy
    PDP10.opUUO,                // 0o017xxx yyyyyy
    PDP10.opUUO,                // 0o020xxx yyyyyy
    PDP10.opUUO,                // 0o021xxx yyyyyy
    PDP10.opUUO,                // 0o022xxx yyyyyy
    PDP10.opUUO,                // 0o023xxx yyyyyy
    PDP10.opUUO,                // 0o024xxx yyyyyy
    PDP10.opUUO,                // 0o025xxx yyyyyy
    PDP10.opUUO,                // 0o026xxx yyyyyy
    PDP10.opUUO,                // 0o027xxx yyyyyy
    PDP10.opUUO,                // 0o030xxx yyyyyy
    PDP10.opUUO,                // 0o031xxx yyyyyy
    PDP10.opUUO,                // 0o032xxx yyyyyy
    PDP10.opUUO,                // 0o033xxx yyyyyy
    PDP10.opUUO,                // 0o034xxx yyyyyy
    PDP10.opUUO,                // 0o035xxx yyyyyy
    PDP10.opUUO,                // 0o036xxx yyyyyy
    PDP10.opUUO,                // 0o037xxx yyyyyy
    PDP10.opUUO,                // 0o040xxx yyyyyy
    PDP10.opUUO,                // 0o041xxx yyyyyy
    PDP10.opUUO,                // 0o042xxx yyyyyy
    PDP10.opUUO,                // 0o043xxx yyyyyy
    PDP10.opUUO,                // 0o044xxx yyyyyy
    PDP10.opUUO,                // 0o045xxx yyyyyy
    PDP10.opUUO,                // 0o046xxx yyyyyy
    PDP10.opUUO,                // 0o047xxx yyyyyy
    PDP10.opUUO,                // 0o050xxx yyyyyy
    PDP10.opUUO,                // 0o051xxx yyyyyy
    PDP10.opUUO,                // 0o052xxx yyyyyy
    PDP10.opUUO,                // 0o053xxx yyyyyy
    PDP10.opUUO,                // 0o054xxx yyyyyy
    PDP10.opUUO,                // 0o055xxx yyyyyy
    PDP10.opUUO,                // 0o056xxx yyyyyy
    PDP10.opUUO,                // 0o057xxx yyyyyy
    PDP10.opUUO,                // 0o060xxx yyyyyy
    PDP10.opUUO,                // 0o061xxx yyyyyy
    PDP10.opUUO,                // 0o062xxx yyyyyy
    PDP10.opUUO,                // 0o063xxx yyyyyy
    PDP10.opUUO,                // 0o064xxx yyyyyy
    PDP10.opUUO,                // 0o065xxx yyyyyy
    PDP10.opUUO,                // 0o066xxx yyyyyy
    PDP10.opUUO,                // 0o067xxx yyyyyy
    PDP10.opUUO,                // 0o070xxx yyyyyy
    PDP10.opUUO,                // 0o071xxx yyyyyy
    PDP10.opUUO,                // 0o072xxx yyyyyy
    PDP10.opUUO,                // 0o073xxx yyyyyy
    PDP10.opUUO,                // 0o074xxx yyyyyy
    PDP10.opUUO,                // 0o075xxx yyyyyy
    PDP10.opUUO,                // 0o076xxx yyyyyy
    PDP10.opUUO,                // 0o077xxx yyyyyy
    PDP10.opUndefined,          // 0o100xxx yyyyyy
    PDP10.opUndefined,          // 0o101xxx yyyyyy
    PDP10.opUndefined,          // 0o102xxx yyyyyy
    PDP10.opUndefined,          // 0o103xxx yyyyyy
    PDP10.opUndefined,          // 0o104xxx yyyyyy
    PDP10.opUndefined,          // 0o105xxx yyyyyy
    PDP10.opUndefined,          // 0o106xxx yyyyyy
    PDP10.opUndefined,          // 0o107xxx yyyyyy
    PDP10.opUndefined,          // 0o110xxx yyyyyy
    PDP10.opUndefined,          // 0o111xxx yyyyyy
    PDP10.opUndefined,          // 0o112xxx yyyyyy
    PDP10.opUndefined,          // 0o113xxx yyyyyy
    PDP10.opUndefined,          // 0o114xxx yyyyyy
    PDP10.opUndefined,          // 0o115xxx yyyyyy
    PDP10.opUndefined,          // 0o116xxx yyyyyy
    PDP10.opUndefined,          // 0o117xxx yyyyyy
    PDP10.opUndefined,          // 0o120xxx yyyyyy
    PDP10.opUndefined,          // 0o121xxx yyyyyy
    PDP10.opUndefined,          // 0o122xxx yyyyyy
    PDP10.opUndefined,          // 0o123xxx yyyyyy
    PDP10.opUndefined,          // 0o124xxx yyyyyy
    PDP10.opUndefined,          // 0o125xxx yyyyyy
    PDP10.opUndefined,          // 0o126xxx yyyyyy
    PDP10.opUndefined,          // 0o127xxx yyyyyy
    PDP10.opUFA,                // 0o130xxx yyyyyy
    PDP10.opDFN,                // 0o131xxx yyyyyy
    PDP10.opFSC,                // 0o132xxx yyyyyy
    PDP10.opIBP,                // 0o133xxx yyyyyy
    PDP10.opILDB,               // 0o134xxx yyyyyy
    PDP10.opLDB,                // 0o135xxx yyyyyy
    PDP10.opIDPB,               // 0o136xxx yyyyyy
    PDP10.opDPB,                // 0o137xxx yyyyyy
    PDP10.opFAD,                // 0o140xxx yyyyyy
    PDP10.opFADI,               // 0o141xxx yyyyyy
    PDP10.opFADM,               // 0o142xxx yyyyyy
    PDP10.opFADB,               // 0o143xxx yyyyyy
    PDP10.opFADR,               // 0o144xxx yyyyyy
    PDP10.opFADRI,              // 0o145xxx yyyyyy
    PDP10.opFADRM,              // 0o146xxx yyyyyy
    PDP10.opFADRB,              // 0o147xxx yyyyyy
    PDP10.opFSB,                // 0o150xxx yyyyyy
    PDP10.opFSBI,               // 0o151xxx yyyyyy
    PDP10.opFSBM,               // 0o152xxx yyyyyy
    PDP10.opFSBB,               // 0o153xxx yyyyyy
    PDP10.opFSBR,               // 0o154xxx yyyyyy
    PDP10.opFSBRI,              // 0o155xxx yyyyyy
    PDP10.opFSBRM,              // 0o156xxx yyyyyy
    PDP10.opFSBRB,              // 0o157xxx yyyyyy
    PDP10.opFMP,                // 0o160xxx yyyyyy
    PDP10.opFMPI,               // 0o161xxx yyyyyy
    PDP10.opFMPM,               // 0o162xxx yyyyyy
    PDP10.opFMPB,               // 0o163xxx yyyyyy
    PDP10.opFMPR,               // 0o164xxx yyyyyy
    PDP10.opFMPRI,              // 0o165xxx yyyyyy
    PDP10.opFMPRM,              // 0o166xxx yyyyyy
    PDP10.opFMPRB,              // 0o167xxx yyyyyy
    PDP10.opFDV,                // 0o170xxx yyyyyy
    PDP10.opFDVI,               // 0o171xxx yyyyyy
    PDP10.opFDVM,               // 0o172xxx yyyyyy
    PDP10.opFDVB,               // 0o173xxx yyyyyy
    PDP10.opFDVR,               // 0o174xxx yyyyyy
    PDP10.opFDVRI,              // 0o175xxx yyyyyy
    PDP10.opFDVRM,              // 0o176xxx yyyyyy
    PDP10.opFDVRB,              // 0o177xxx yyyyyy
    PDP10.opMOV,                // 0o200xxx yyyyyy
    PDP10.opMOVI,               // 0o201xxx yyyyyy
    PDP10.opMOVM,               // 0o202xxx yyyyyy
    PDP10.opMOVS,               // 0o203xxx yyyyyy
    PDP10.opMOVS,               // 0o204xxx yyyyyy
    PDP10.opMOVSI,              // 0o205xxx yyyyyy
    PDP10.opMOVSM,              // 0o206xxx yyyyyy
    PDP10.opMOVSS,              // 0o207xxx yyyyyy
    PDP10.opMOVN,               // 0o210xxx yyyyyy
    PDP10.opMOVNI,              // 0o211xxx yyyyyy
    PDP10.opMOVNM,              // 0o212xxx yyyyyy
    PDP10.opMOVNS,              // 0o213xxx yyyyyy
    PDP10.opMOVM,               // 0o214xxx yyyyyy
    PDP10.opMOVMI,              // 0o215xxx yyyyyy
    PDP10.opMOVMM,              // 0o216xxx yyyyyy
    PDP10.opMOVMS,              // 0o217xxx yyyyyy
    PDP10.opIMUL,               // 0o220xxx yyyyyy
    PDP10.opIMULI,              // 0o221xxx yyyyyy
    PDP10.opIMULM,              // 0o222xxx yyyyyy
    PDP10.opIMULB,              // 0o223xxx yyyyyy
    PDP10.opMUL,                // 0o224xxx yyyyyy
    PDP10.opMULI,               // 0o225xxx yyyyyy
    PDP10.opMULM,               // 0o226xxx yyyyyy
    PDP10.opMULB,               // 0o227xxx yyyyyy
    PDP10.opIDIV,               // 0o230xxx yyyyyy
    PDP10.opIDIVI,              // 0o231xxx yyyyyy
    PDP10.opIDIVM,              // 0o232xxx yyyyyy
    PDP10.opIDIVB,              // 0o233xxx yyyyyy
    PDP10.opDIV,                // 0o234xxx yyyyyy
    PDP10.opDIVI,               // 0o235xxx yyyyyy
    PDP10.opDIVM,               // 0o236xxx yyyyyy
    PDP10.opDIVB,               // 0o237xxx yyyyyy
    PDP10.opASH,                // 0o240xxx yyyyyy
    PDP10.opROT,                // 0o241xxx yyyyyy
    PDP10.opLSH,                // 0o242xxx yyyyyy
    PDP10.opJFFO,               // 0o243xxx yyyyyy
    PDP10.opASHC,               // 0o244xxx yyyyyy
    PDP10.opROTC,               // 0o245xxx yyyyyy
    PDP10.opLSHC,               // 0o246xxx yyyyyy
    PDP10.opUndefined,          // 0o247xxx yyyyyy
    PDP10.opEXCH,               // 0o250xxx yyyyyy
    PDP10.opBLT,                // 0o251xxx yyyyyy
    PDP10.opAOBJP,              // 0o252xxx yyyyyy
    PDP10.opAOBJN,              // 0o253xxx yyyyyy
    PDP10.opJRST,               // 0o254xxx yyyyyy
    PDP10.opJFCL,               // 0o255xxx yyyyyy
    PDP10.opXCT,                // 0o256xxx yyyyyy
    PDP10.opUndefined,          // 0o257xxx yyyyyy
    PDP10.opPUSHJ,              // 0o260xxx yyyyyy
    PDP10.opPUSH,               // 0o261xxx yyyyyy
    PDP10.opPOP,                // 0o262xxx yyyyyy
    PDP10.opPOPJ,               // 0o263xxx yyyyyy
    PDP10.opJSR,                // 0o264xxx yyyyyy
    PDP10.opJSP,                // 0o265xxx yyyyyy
    PDP10.opJSA,                // 0o266xxx yyyyyy
    PDP10.opJRA,                // 0o267xxx yyyyyy
    PDP10.opADD,                // 0o270xxx yyyyyy
    PDP10.opADDI,               // 0o271xxx yyyyyy
    PDP10.opADDM,               // 0o272xxx yyyyyy
    PDP10.opADDB,               // 0o273xxx yyyyyy
    PDP10.opSUB,                // 0o274xxx yyyyyy
    PDP10.opSUBI,               // 0o275xxx yyyyyy
    PDP10.opSUBM,               // 0o276xxx yyyyyy
    PDP10.opSUBB,               // 0o277xxx yyyyyy
    PDP10.opCAI,                // 0o300xxx yyyyyy
    PDP10.opCAIL,               // 0o301xxx yyyyyy
    PDP10.opCAIE,               // 0o302xxx yyyyyy
    PDP10.opCAILE,              // 0o303xxx yyyyyy
    PDP10.opCAIA,               // 0o304xxx yyyyyy
    PDP10.opCAIGE,              // 0o305xxx yyyyyy
    PDP10.opCAIN,               // 0o306xxx yyyyyy
    PDP10.opCAIG,               // 0o307xxx yyyyyy
    PDP10.opCA,                 // 0o310xxx yyyyyy
    PDP10.opCAL,                // 0o311xxx yyyyyy
    PDP10.opCAE,                // 0o312xxx yyyyyy
    PDP10.opCALE,               // 0o313xxx yyyyyy
    PDP10.opCAA,                // 0o314xxx yyyyyy
    PDP10.opCAGE,               // 0o315xxx yyyyyy
    PDP10.opCAN,                // 0o316xxx yyyyyy
    PDP10.opCAG,                // 0o317xxx yyyyyy
    PDP10.opJUMP,               // 0o320xxx yyyyyy
    PDP10.opJUMPL,              // 0o321xxx yyyyyy
    PDP10.opJUMPE,              // 0o322xxx yyyyyy
    PDP10.opJUMPLE,             // 0o323xxx yyyyyy
    PDP10.opJUMPA,              // 0o324xxx yyyyyy
    PDP10.opJUMPGE,             // 0o325xxx yyyyyy
    PDP10.opJUMPN,              // 0o326xxx yyyyyy
    PDP10.opJUMPG,              // 0o327xxx yyyyyy
    PDP10.opSKIP,               // 0o330xxx yyyyyy
    PDP10.opSKIPL,              // 0o331xxx yyyyyy
    PDP10.opSKIPE,              // 0o332xxx yyyyyy
    PDP10.opSKIPLE,             // 0o333xxx yyyyyy
    PDP10.opSKIPA,              // 0o334xxx yyyyyy
    PDP10.opSKIPGE,             // 0o335xxx yyyyyy
    PDP10.opSKIPN,              // 0o336xxx yyyyyy
    PDP10.opSKIPG,              // 0o337xxx yyyyyy
    PDP10.opAOJ,                // 0o340xxx yyyyyy
    PDP10.opAOJL,               // 0o341xxx yyyyyy
    PDP10.opAOJE,               // 0o342xxx yyyyyy
    PDP10.opAOJLE,              // 0o343xxx yyyyyy
    PDP10.opAOJA,               // 0o344xxx yyyyyy
    PDP10.opAOJGE,              // 0o345xxx yyyyyy
    PDP10.opAOJN,               // 0o346xxx yyyyyy
    PDP10.opAOJG,               // 0o347xxx yyyyyy
    PDP10.opAOS,                // 0o350xxx yyyyyy
    PDP10.opAOSL,               // 0o351xxx yyyyyy
    PDP10.opAOSE,               // 0o352xxx yyyyyy
    PDP10.opAOSLE,              // 0o353xxx yyyyyy
    PDP10.opAOSA,               // 0o354xxx yyyyyy
    PDP10.opAOSGE,              // 0o355xxx yyyyyy
    PDP10.opAOSN,               // 0o356xxx yyyyyy
    PDP10.opAOSG,               // 0o357xxx yyyyyy
    PDP10.opSOJ,                // 0o360xxx yyyyyy
    PDP10.opSOJL,               // 0o361xxx yyyyyy
    PDP10.opSOJE,               // 0o362xxx yyyyyy
    PDP10.opSOJLE,              // 0o363xxx yyyyyy
    PDP10.opSOJA,               // 0o364xxx yyyyyy
    PDP10.opSOJGE,              // 0o365xxx yyyyyy
    PDP10.opSOJN,               // 0o366xxx yyyyyy
    PDP10.opSOJG,               // 0o367xxx yyyyyy
    PDP10.opSOS,                // 0o370xxx yyyyyy
    PDP10.opSOSL,               // 0o371xxx yyyyyy
    PDP10.opSOSE,               // 0o372xxx yyyyyy
    PDP10.opSOSLE,              // 0o373xxx yyyyyy
    PDP10.opSOSA,               // 0o374xxx yyyyyy
    PDP10.opSOSGE,              // 0o375xxx yyyyyy
    PDP10.opSOSN,               // 0o376xxx yyyyyy
    PDP10.opSOSG,               // 0o377xxx yyyyyy
    PDP10.opSETZ,               // 0o400xxx yyyyyy
    PDP10.opSETZI,              // 0o401xxx yyyyyy
    PDP10.opSETZM,              // 0o402xxx yyyyyy
    PDP10.opSETZB,              // 0o403xxx yyyyyy
    PDP10.opAND,                // 0o404xxx yyyyyy
    PDP10.opANDI,               // 0o405xxx yyyyyy
    PDP10.opANDM,               // 0o406xxx yyyyyy
    PDP10.opANDB,               // 0o407xxx yyyyyy
    PDP10.opANDCA,              // 0o410xxx yyyyyy
    PDP10.opANDCAI,             // 0o411xxx yyyyyy
    PDP10.opANDCAM,             // 0o412xxx yyyyyy
    PDP10.opANDCAB,             // 0o413xxx yyyyyy
    PDP10.opSETM,               // 0o414xxx yyyyyy
    PDP10.opSETMI,              // 0o415xxx yyyyyy
    PDP10.opSETMM,              // 0o416xxx yyyyyy
    PDP10.opSETMB,              // 0o417xxx yyyyyy
    PDP10.opANDCM,              // 0o420xxx yyyyyy
    PDP10.opANDCMI,             // 0o421xxx yyyyyy
    PDP10.opANDCMM,             // 0o422xxx yyyyyy
    PDP10.opANDCMB,             // 0o423xxx yyyyyy
    PDP10.opSETA,               // 0o424xxx yyyyyy
    PDP10.opSETAI,              // 0o425xxx yyyyyy
    PDP10.opSETAM,              // 0o426xxx yyyyyy
    PDP10.opSETAB,              // 0o427xxx yyyyyy
    PDP10.opXOR,                // 0o430xxx yyyyyy
    PDP10.opXORI,               // 0o431xxx yyyyyy
    PDP10.opXORM,               // 0o432xxx yyyyyy
    PDP10.opXORB,               // 0o433xxx yyyyyy
    PDP10.opIOR,                // 0o434xxx yyyyyy
    PDP10.opIORI,               // 0o435xxx yyyyyy
    PDP10.opIORM,               // 0o436xxx yyyyyy
    PDP10.opIORB,               // 0o437xxx yyyyyy
    PDP10.opANDCB,              // 0o440xxx yyyyyy
    PDP10.opANDCBI,             // 0o441xxx yyyyyy
    PDP10.opANDCBM,             // 0o442xxx yyyyyy
    PDP10.opANDCBB,             // 0o443xxx yyyyyy
    PDP10.opEQV,                // 0o444xxx yyyyyy
    PDP10.opEQVI,               // 0o445xxx yyyyyy
    PDP10.opEQVM,               // 0o446xxx yyyyyy
    PDP10.opEQVB,               // 0o447xxx yyyyyy
    PDP10.opSETCA,              // 0o450xxx yyyyyy
    PDP10.opSETCAI,             // 0o451xxx yyyyyy
    PDP10.opSETCAM,             // 0o452xxx yyyyyy
    PDP10.opSETCAB,             // 0o453xxx yyyyyy
    PDP10.opORCA,               // 0o454xxx yyyyyy
    PDP10.opORCAI,              // 0o455xxx yyyyyy
    PDP10.opORCAM,              // 0o456xxx yyyyyy
    PDP10.opORCAB,              // 0o457xxx yyyyyy
    PDP10.opSETCM,              // 0o460xxx yyyyyy
    PDP10.opSETCMI,             // 0o461xxx yyyyyy
    PDP10.opSETCMM,             // 0o462xxx yyyyyy
    PDP10.opSETCMB,             // 0o463xxx yyyyyy
    PDP10.opORCM,               // 0o464xxx yyyyyy
    PDP10.opORCMI,              // 0o465xxx yyyyyy
    PDP10.opORCMM,              // 0o466xxx yyyyyy
    PDP10.opORCMB,              // 0o467xxx yyyyyy
    PDP10.opORCB,               // 0o470xxx yyyyyy
    PDP10.opORCBI,              // 0o471xxx yyyyyy
    PDP10.opORCBM,              // 0o472xxx yyyyyy
    PDP10.opORCBB,              // 0o473xxx yyyyyy
    PDP10.opSETO,               // 0o474xxx yyyyyy
    PDP10.opSETOI,              // 0o475xxx yyyyyy
    PDP10.opSETOM,              // 0o476xxx yyyyyy
    PDP10.opSETOB,              // 0o477xxx yyyyyy
    PDP10.opHLL,                // 0o500xxx yyyyyy
    PDP10.opHLLI,               // 0o501xxx yyyyyy
    PDP10.opHLLM,               // 0o502xxx yyyyyy
    PDP10.opHLLS,               // 0o503xxx yyyyyy
    PDP10.opHRL,                // 0o504xxx yyyyyy
    PDP10.opHRLI,               // 0o505xxx yyyyyy
    PDP10.opHRLM,               // 0o506xxx yyyyyy
    PDP10.opHRLS,               // 0o507xxx yyyyyy
    PDP10.opHLLZ,               // 0o510xxx yyyyyy
    PDP10.opHLLZI,              // 0o511xxx yyyyyy
    PDP10.opHLLZM,              // 0o512xxx yyyyyy
    PDP10.opHLLZS,              // 0o513xxx yyyyyy
    PDP10.opHRLZ,               // 0o514xxx yyyyyy
    PDP10.opHRLZI,              // 0o515xxx yyyyyy
    PDP10.opHRLZM,              // 0o516xxx yyyyyy
    PDP10.opHRLZS,              // 0o517xxx yyyyyy
    PDP10.opHLLO,               // 0o520xxx yyyyyy
    PDP10.opHLLOI,              // 0o521xxx yyyyyy
    PDP10.opHLLOM,              // 0o522xxx yyyyyy
    PDP10.opHLLOS,              // 0o523xxx yyyyyy
    PDP10.opHRLO,               // 0o524xxx yyyyyy
    PDP10.opHRLOI,              // 0o525xxx yyyyyy
    PDP10.opHRLOM,              // 0o526xxx yyyyyy
    PDP10.opHRLOS,              // 0o527xxx yyyyyy
    PDP10.opHLLE,               // 0o530xxx yyyyyy
    PDP10.opHLLEI,              // 0o531xxx yyyyyy
    PDP10.opHLLEM,              // 0o532xxx yyyyyy
    PDP10.opHLLES,              // 0o533xxx yyyyyy
    PDP10.opHRLE,               // 0o534xxx yyyyyy
    PDP10.opHRLEI,              // 0o535xxx yyyyyy
    PDP10.opHRLEM,              // 0o536xxx yyyyyy
    PDP10.opHRLES,              // 0o537xxx yyyyyy
    PDP10.opHRR,                // 0o540xxx yyyyyy
    PDP10.opHRRI,               // 0o541xxx yyyyyy
    PDP10.opHRRM,               // 0o542xxx yyyyyy
    PDP10.opHRRS,               // 0o543xxx yyyyyy
    PDP10.opHLR,                // 0o544xxx yyyyyy
    PDP10.opHLRI,               // 0o545xxx yyyyyy
    PDP10.opHLRM,               // 0o546xxx yyyyyy
    PDP10.opHLRS,               // 0o547xxx yyyyyy
    PDP10.opHRRZ,               // 0o550xxx yyyyyy
    PDP10.opHRRZI,              // 0o551xxx yyyyyy
    PDP10.opHRRZM,              // 0o552xxx yyyyyy
    PDP10.opHRRZS,              // 0o553xxx yyyyyy
    PDP10.opHLRZ,               // 0o554xxx yyyyyy
    PDP10.opHLRZI,              // 0o555xxx yyyyyy
    PDP10.opHLRZM,              // 0o556xxx yyyyyy
    PDP10.opHLRZS,              // 0o557xxx yyyyyy
    PDP10.opHRRO,               // 0o560xxx yyyyyy
    PDP10.opHRROI,              // 0o561xxx yyyyyy
    PDP10.opHRROM,              // 0o562xxx yyyyyy
    PDP10.opHRROS,              // 0o563xxx yyyyyy
    PDP10.opHLRO,               // 0o564xxx yyyyyy
    PDP10.opHLROI,              // 0o565xxx yyyyyy
    PDP10.opHLROM,              // 0o566xxx yyyyyy
    PDP10.opHLROS,              // 0o567xxx yyyyyy
    PDP10.opHRRE,               // 0o570xxx yyyyyy
    PDP10.opHRREI,              // 0o571xxx yyyyyy
    PDP10.opHRREM,              // 0o572xxx yyyyyy
    PDP10.opHRRES,              // 0o573xxx yyyyyy
    PDP10.opHLRE,               // 0o574xxx yyyyyy
    PDP10.opHLREI,              // 0o575xxx yyyyyy
    PDP10.opHLREM,              // 0o576xxx yyyyyy
    PDP10.opHLRES,              // 0o577xxx yyyyyy
    PDP10.opTRN,                // 0o600xxx yyyyyy
    PDP10.opTLN,                // 0o601xxx yyyyyy
    PDP10.opTRNE,               // 0o602xxx yyyyyy
    PDP10.opTLNE,               // 0o603xxx yyyyyy
    PDP10.opTRNA,               // 0o604xxx yyyyyy
    PDP10.opTLNA,               // 0o605xxx yyyyyy
    PDP10.opTRNN,               // 0o606xxx yyyyyy
    PDP10.opTLNN,               // 0o607xxx yyyyyy
    PDP10.opTDN,                // 0o610xxx yyyyyy
    PDP10.opTSN,                // 0o611xxx yyyyyy
    PDP10.opTDNE,               // 0o612xxx yyyyyy
    PDP10.opTSNE,               // 0o613xxx yyyyyy
    PDP10.opTDNA,               // 0o614xxx yyyyyy
    PDP10.opTSNA,               // 0o615xxx yyyyyy
    PDP10.opTDNN,               // 0o616xxx yyyyyy
    PDP10.opTSNN,               // 0o617xxx yyyyyy
    PDP10.opTRZ,                // 0o620xxx yyyyyy
    PDP10.opTLZ,                // 0o621xxx yyyyyy
    PDP10.opTRZE,               // 0o622xxx yyyyyy
    PDP10.opTLZE,               // 0o623xxx yyyyyy
    PDP10.opTRZA,               // 0o624xxx yyyyyy
    PDP10.opTLZA,               // 0o625xxx yyyyyy
    PDP10.opTRZN,               // 0o626xxx yyyyyy
    PDP10.opTLZN,               // 0o627xxx yyyyyy
    PDP10.opTDZ,                // 0o630xxx yyyyyy
    PDP10.opTSZ,                // 0o631xxx yyyyyy
    PDP10.opTDZE,               // 0o632xxx yyyyyy
    PDP10.opTSZE,               // 0o633xxx yyyyyy
    PDP10.opTDZA,               // 0o634xxx yyyyyy
    PDP10.opTSZA,               // 0o635xxx yyyyyy
    PDP10.opTDZN,               // 0o636xxx yyyyyy
    PDP10.opTSZN,               // 0o637xxx yyyyyy
    PDP10.opTRC,                // 0o640xxx yyyyyy
    PDP10.opTLC,                // 0o641xxx yyyyyy
    PDP10.opTRCE,               // 0o642xxx yyyyyy
    PDP10.opTLCE,               // 0o643xxx yyyyyy
    PDP10.opTRCA,               // 0o644xxx yyyyyy
    PDP10.opTLCA,               // 0o645xxx yyyyyy
    PDP10.opTRCN,               // 0o646xxx yyyyyy
    PDP10.opTLCN,               // 0o647xxx yyyyyy
    PDP10.opTDC,                // 0o650xxx yyyyyy
    PDP10.opTSC,                // 0o651xxx yyyyyy
    PDP10.opTDCE,               // 0o652xxx yyyyyy
    PDP10.opTSCE,               // 0o653xxx yyyyyy
    PDP10.opTDCA,               // 0o654xxx yyyyyy
    PDP10.opTSCA,               // 0o655xxx yyyyyy
    PDP10.opTDCN,               // 0o656xxx yyyyyy
    PDP10.opTSCN,               // 0o657xxx yyyyyy
    PDP10.opTRO,                // 0o660xxx yyyyyy
    PDP10.opTLO,                // 0o661xxx yyyyyy
    PDP10.opTROE,               // 0o662xxx yyyyyy
    PDP10.opTLOE,               // 0o663xxx yyyyyy
    PDP10.opTROA,               // 0o664xxx yyyyyy
    PDP10.opTLOA,               // 0o665xxx yyyyyy
    PDP10.opTRON,               // 0o666xxx yyyyyy
    PDP10.opTLON,               // 0o667xxx yyyyyy
    PDP10.opTDO,                // 0o670xxx yyyyyy
    PDP10.opTSO,                // 0o671xxx yyyyyy
    PDP10.opTDOE,               // 0o672xxx yyyyyy
    PDP10.opTSOE,               // 0o673xxx yyyyyy
    PDP10.opTDOA,               // 0o674xxx yyyyyy
    PDP10.opTSOA,               // 0o675xxx yyyyyy
    PDP10.opTDON,               // 0o676xxx yyyyyy
    PDP10.opTSON,               // 0o677xxx yyyyyy
    PDP10.opIO,                 // 0o700xxx yyyyyy
    PDP10.opIO,                 // 0o701xxx yyyyyy
    PDP10.opIO,                 // 0o702xxx yyyyyy
    PDP10.opIO,                 // 0o703xxx yyyyyy
    PDP10.opIO,                 // 0o704xxx yyyyyy
    PDP10.opIO,                 // 0o705xxx yyyyyy
    PDP10.opIO,                 // 0o706xxx yyyyyy
    PDP10.opIO,                 // 0o707xxx yyyyyy
    PDP10.opIO,                 // 0o710xxx yyyyyy
    PDP10.opIO,                 // 0o711xxx yyyyyy
    PDP10.opIO,                 // 0o712xxx yyyyyy
    PDP10.opIO,                 // 0o713xxx yyyyyy
    PDP10.opIO,                 // 0o714xxx yyyyyy
    PDP10.opIO,                 // 0o715xxx yyyyyy
    PDP10.opIO,                 // 0o716xxx yyyyyy
    PDP10.opIO,                 // 0o717xxx yyyyyy
    PDP10.opIO,                 // 0o720xxx yyyyyy
    PDP10.opIO,                 // 0o721xxx yyyyyy
    PDP10.opIO,                 // 0o722xxx yyyyyy
    PDP10.opIO,                 // 0o723xxx yyyyyy
    PDP10.opIO,                 // 0o724xxx yyyyyy
    PDP10.opIO,                 // 0o725xxx yyyyyy
    PDP10.opIO,                 // 0o726xxx yyyyyy
    PDP10.opIO,                 // 0o727xxx yyyyyy
    PDP10.opIO,                 // 0o730xxx yyyyyy
    PDP10.opIO,                 // 0o731xxx yyyyyy
    PDP10.opIO,                 // 0o732xxx yyyyyy
    PDP10.opIO,                 // 0o733xxx yyyyyy
    PDP10.opIO,                 // 0o734xxx yyyyyy
    PDP10.opIO,                 // 0o735xxx yyyyyy
    PDP10.opIO,                 // 0o736xxx yyyyyy
    PDP10.opIO,                 // 0o737xxx yyyyyy
    PDP10.opIO,                 // 0o740xxx yyyyyy
    PDP10.opIO,                 // 0o741xxx yyyyyy
    PDP10.opIO,                 // 0o742xxx yyyyyy
    PDP10.opIO,                 // 0o743xxx yyyyyy
    PDP10.opIO,                 // 0o744xxx yyyyyy
    PDP10.opIO,                 // 0o745xxx yyyyyy
    PDP10.opIO,                 // 0o746xxx yyyyyy
    PDP10.opIO,                 // 0o747xxx yyyyyy
    PDP10.opIO,                 // 0o750xxx yyyyyy
    PDP10.opIO,                 // 0o751xxx yyyyyy
    PDP10.opIO,                 // 0o752xxx yyyyyy
    PDP10.opIO,                 // 0o753xxx yyyyyy
    PDP10.opIO,                 // 0o754xxx yyyyyy
    PDP10.opIO,                 // 0o755xxx yyyyyy
    PDP10.opIO,                 // 0o756xxx yyyyyy
    PDP10.opIO,                 // 0o757xxx yyyyyy
    PDP10.opIO,                 // 0o760xxx yyyyyy
    PDP10.opIO,                 // 0o761xxx yyyyyy
    PDP10.opIO,                 // 0o762xxx yyyyyy
    PDP10.opIO,                 // 0o763xxx yyyyyy
    PDP10.opIO,                 // 0o764xxx yyyyyy
    PDP10.opIO,                 // 0o765xxx yyyyyy
    PDP10.opIO,                 // 0o766xxx yyyyyy
    PDP10.opIO,                 // 0o767xxx yyyyyy
    PDP10.opIO,                 // 0o770xxx yyyyyy
    PDP10.opIO,                 // 0o771xxx yyyyyy
    PDP10.opIO,                 // 0o772xxx yyyyyy
    PDP10.opIO,                 // 0o773xxx yyyyyy
    PDP10.opIO,                 // 0o774xxx yyyyyy
    PDP10.opIO,                 // 0o775xxx yyyyyy
    PDP10.opIO,                 // 0o776xxx yyyyyy
    PDP10.opIO                  // 0o777xxx yyyyyy
];
