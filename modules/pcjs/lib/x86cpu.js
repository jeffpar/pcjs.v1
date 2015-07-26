/**
 * @fileoverview Implements PCjs 8086/8088 CPU logic.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Sep-05
 *
 * Copyright © 2012-2015 Jeff Parsons <Jeff@pcjs.org>
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

if (typeof module !== 'undefined') {
    var str         = require("../../shared/lib/strlib");
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var Messages    = require("./messages");
    var Bus         = require("./bus");
    var Memory      = require("./memory");
    var State       = require("./state");
    var CPU         = require("./cpu");
    var X86         = require("./x86");
    var X86Seg      = require("./x86seg");
}

if (!I386) {
    /*
     * These are the original ModRM decoders, which were simpler and faster because they could treat all
     * word instructions as 16-bit, assume bits 15-31 of all registers were always zero, and use masking
     * constants instead of variables.  If I386 is enabled, these decoders are not used, and the compiler
     * will eliminate them from the compiled code.
     */
    if (typeof module !== 'undefined') {
        var X86ModB     = require("./x86modb");
        var X86ModW     = require("./x86modw");
    }
} else {
    /*
     * These are the more general-purpose ModRM decoders, required for I386 support.  The current addressing
     * mode (16-bit or 32-bit) dynamically selects the appropriate set of decoders.
     */
    if (typeof module !== 'undefined') {
        var X86ModB16   = require("./x86modb16");
        var X86ModW16   = require("./x86modw16");
        var X86ModB32   = require("./x86modb32");
        var X86ModW32   = require("./x86modw32");
        var X86ModSIB   = require("./x86modsib");
    }
}

/**
 * X86CPU(parmsCPU)
 *
 * The X86CPU class uses the following (parmsCPU) properties:
 *
 *      model: a number (eg, 8088) that should match one of the X86.MODEL values
 *
 * This extends the CPU class and passes any remaining parmsCPU properties to the CPU class
 * constructor, along with a default speed (cycles per second) based on the specified (or default)
 * CPU model number.
 *
 * The X86CPU class was initially written to simulate a 8086/8088 microprocessor, although over time
 * it has evolved to support later microprocessors (eg, the 80186/80188 and the 80286, including
 * protected-mode support).
 *
 * This is a logical simulation, not a physical simulation, and performance is critical, second only
 * to the accuracy of the simulation when running real-world x86 software.  Consequently, it takes a
 * few liberties with the operation of the simulated hardware, especially with regard to timings,
 * little-used features, etc.  We do make an effort to maintain accurate instruction cycle counts,
 * but there are many other obstacles (eg, prefetch queue, wait states) to achieving perfect timings.
 *
 * For example, our 8237 DMA controller performs all DMA transfers immediately, since internally
 * they are all memory-to-memory, and attempting to interleave DMA cycles with instruction execution
 * cycles would hurt overall performance.  Similarly, 8254 timer counters are updated only on-demand.
 *
 * The 8237 and 8254, along with the 8259 interrupt controller and several other "chips", are combined
 * into a single ChipSet component, to keep the number of components we juggle to a minimum.
 *
 * All that being said, this does not change the overall goal: to produce as accurate a simulation as
 * possible, within the limits of what JavaScript allows and how precisely/predictably it behaves.
 *
 * @constructor
 * @extends CPU
 * @param {Object} parmsCPU
 */
function X86CPU(parmsCPU)
{
    this.model = parmsCPU['model'] || X86.MODEL_8088;

    var nCyclesDefault = 0;
    switch(this.model) {
    case X86.MODEL_8088:
    default:
        nCyclesDefault = 4772727;
        break;
    case X86.MODEL_80286:
        nCyclesDefault = 6000000;
        break;
    case X86.MODEL_80386:
        nCyclesDefault = 16000000;
        break;
    }

    CPU.call(this, parmsCPU, nCyclesDefault);

    /*
     * Initialize processor operation to match the requested model
     */
    this.initProcessor();

    /*
     * List of software interrupt notification functions: aIntNotify is an array, indexed by
     * interrupt number, of 2-element sub-arrays that, in turn, contain:
     *
     *      [0]: registered component
     *      [1]: registered function to call for every software interrupt
     *
     * The registered function is called with the linear address (LIP) following the software interrupt;
     * if any function returns false, the software interrupt will be skipped (presumed to be emulated),
     * and no further notification functions will be called.
     *
     * NOTE: Registered functions are called only for INT N instructions -- *not* INT 0x03 or INTO or the
     * INT 0x00 generated by a divide-by-zero or any other kind of interrupt (nor any interrupt simulated
     * with PUSHF/CALLF).
     *
     * aIntReturn is a hash of return address notifications set up by software interrupt notification
     * functions that want to receive return notifications.  A software interrupt function must call
     * cpu.addIntReturn(fn).
     *
     * WARNING: There's no mechanism in place to insure that software interrupt return notifications don't
     * get "orphaned" if an interrupt handler bypasses the normal return path (INT 0x24 is one example of an
     * "evil" software interrupt).
     */
    this.aIntNotify = [];
    this.aIntReturn = [];

    /*
     * Since aReturnNotify is a "sparse array", this global count gives the CPU a quick way of knowing whether
     * or not RETF or IRET instructions need to bother calling checkIntReturn().
     */
    this.cIntReturn = 0;

    /*
     * A variety of stepCPU() state variables that don't strictly need to be initialized before the first
     * stepCPU() call, but it's good form to do so.
     */
    this.resetCycles();
    this.aFlags.fComplete = this.aFlags.fDebugCheck = false;

    /*
     * If there are no live registers to display, then updateStatus() can skip a bit....
     */
    this.cLiveRegs = 0;

    /*
     * We're just declaring aMemBlocks and associated Bus parameters here; they'll be initialized by initMemory()
     * when the Bus is initialized.
     */
    this.aBusBlocks = this.aMemBlocks = [];
    this.nBusMask = this.nMemMask = 0;
    this.nBlockShift = this.nBlockSize = this.nBlockLimit = this.nBlockTotal = this.nBlockMask = 0;

    if (SAMPLER) {
        /*
         * For now, we're just going to sample LIP values (well, LIP + cycle count)
         */
        this.nSamples = 50000;
        this.nSampleFreq = 1000;
        this.nSampleSkip = 0;
        this.aSamples = new Array(this.nSamples);
        for (var i = 0; i < this.nSamples; i++) this.aSamples[i] = -1;
        this.iSampleNext = 0;
        this.iSampleFreq = 0;
        this.iSampleSkip = 0;
    }

    /*
     * This initial resetRegs() call is important to create all the registers (eg, the X86Seg registers),
     * so that if/when we call restore(), it will have something to fill in.
     */
    this.resetRegs();
}

Component.subclass(X86CPU, CPU);

X86CPU.CYCLES_8088 = {
    nWordCyclePenalty:          4,      // NOTE: accurate for the 8088/80188 only (on the 8086/80186, it applies to odd addresses only)
    nEACyclesBase:              5,      // base or index only (BX, BP, SI or DI)
    nEACyclesDisp:              6,      // displacement only
    nEACyclesBaseIndex:         7,      // base + index (BP+DI and BX+SI)
    nEACyclesBaseIndexExtra:    8,      // base + index (BP+SI and BX+DI require an extra cycle)
    nEACyclesBaseDisp:          9,      // base or index + displacement
    nEACyclesBaseIndexDisp:     11,     // base + index + displacement (BP+DI+n and BX+SI+n)
    nEACyclesBaseIndexDispExtra:12,     // base + index + displacement (BP+SI+n and BX+DI+n require an extra cycle)
    nOpCyclesAAA:               4,      // AAA, AAS, DAA, DAS, TEST acc,imm
    nOpCyclesAAD:               60,
    nOpCyclesAAM:               83,
    nOpCyclesArithRR:           3,      // ADC, ADD, AND, OR, SBB, SUB, XOR and CMP reg,reg cycle time
    nOpCyclesArithRM:           9,      // ADC, ADD, AND, OR, SBB, SUB, and XOR reg,mem (and CMP mem,reg) cycle time
    nOpCyclesArithMR:           16,     // ADC, ADD, AND, OR, SBB, SUB, and XOR mem,reg cycle time
    nOpCyclesArithMID:          1,      // ADC, ADD, AND, OR, SBB, SUB, XOR and CMP mem,imm cycle delta
    nOpCyclesCall:              19,
    nOpCyclesCallF:             28,
    nOpCyclesCallWR:            16,
    nOpCyclesCallWM:            21,
    nOpCyclesCallDM:            37,
    nOpCyclesCLI:               2,
    nOpCyclesCompareRM:         9,      // CMP reg,mem cycle time (same as nOpCyclesArithRM on an 8086 but not on a 80286)
    nOpCyclesCWD:               5,
    nOpCyclesBound:             33,     // N/A if 8086/8088, 33-35 if 80186/80188 (TODO: Determine what the range means for an 80186/80188)
    nOpCyclesInP:               10,
    nOpCyclesInDX:              8,
    nOpCyclesIncR:              3,      // INC reg, DEC reg
    nOpCyclesIncM:              15,     // INC mem, DEC mem
    nOpCyclesInt:               51,
    nOpCyclesInt3D:             1,
    nOpCyclesIntOD:             2,
    nOpCyclesIntOFall:          4,
    nOpCyclesIRet:              32,
    nOpCyclesJmp:               15,
    nOpCyclesJmpF:              15,
    nOpCyclesJmpC:              16,
    nOpCyclesJmpCFall:          4,
    nOpCyclesJmpWR:             11,
    nOpCyclesJmpWM:             18,
    nOpCyclesJmpDM:             24,
    nOpCyclesLAHF:              4,      // LAHF, SAHF, MOV reg,imm
    nOpCyclesLEA:               2,
    nOpCyclesLS:                16,     // LDS, LES
    nOpCyclesLoop:              17,     // LOOP, LOOPNZ
    nOpCyclesLoopZ:             18,     // LOOPZ, JCXZ
    nOpCyclesLoopNZ:            19,     // LOOPNZ
    nOpCyclesLoopFall:          5,      // LOOP
    nOpCyclesLoopZFall:         6,      // LOOPZ, JCXZ
    nOpCyclesMovRR:             2,
    nOpCyclesMovRM:             8,
    nOpCyclesMovMR:             9,
    nOpCyclesMovRI:             10,
    nOpCyclesMovMI:             10,
    nOpCyclesMovAM:             10,
    nOpCyclesMovMA:             10,
    nOpCyclesDivBR:             80,     // range of 80-90
    nOpCyclesDivWR:             144,    // range of 144-162
    nOpCyclesDivBM:             86,     // range of 86-96
    nOpCyclesDivWM:             154,    // range of 154-172
    nOpCyclesIDivBR:            101,    // range of 101-112
    nOpCyclesIDivWR:            165,    // range of 165-184
    nOpCyclesIDivBM:            107,    // range of 107-118
    nOpCyclesIDivWM:            171,    // range of 171-190
    nOpCyclesMulBR:             70,     // range of 70-77
    nOpCyclesMulWR:             113,    // range of 113-118
    nOpCyclesMulBM:             76,     // range of 76-83
    nOpCyclesMulWM:             124,    // range of 124-139
    nOpCyclesIMulBR:            80,     // range of 80-98
    nOpCyclesIMulWR:            128,    // range of 128-154
    nOpCyclesIMulBM:            86,     // range of 86-104
    nOpCyclesIMulWM:            134,    // range of 134-160
    nOpCyclesNegR:              3,      // NEG reg, NOT reg
    nOpCyclesNegM:              16,     // NEG mem, NOT mem
    nOpCyclesOutP:              10,
    nOpCyclesOutDX:             8,
    nOpCyclesPopAll:            51,     // N/A if 8086/8088, 51 if 80186, 83 if 80188 (TODO: Verify)
    nOpCyclesPopReg:            8,
    nOpCyclesPopMem:            17,
    nOpCyclesPushAll:           36,     // N/A if 8086/8088, 36 if 80186, 68 if 80188 (TODO: Verify)
    nOpCyclesPushReg:           11,     // NOTE: "The 8086 Book" claims this is 10, but it's an outlier....
    nOpCyclesPushMem:           16,
    nOpCyclesPushSeg:           10,
    nOpCyclesPrefix:            2,
    nOpCyclesCmpS:              18,
    nOpCyclesCmpSr0:            9-2,    // reduced by nOpCyclesPrefix
    nOpCyclesCmpSrn:            17-2,   // reduced by nOpCyclesPrefix
    nOpCyclesLodS:              12,
    nOpCyclesLodSr0:            9-2,    // reduced by nOpCyclesPrefix
    nOpCyclesLodSrn:            13-2,   // reduced by nOpCyclesPrefix
    nOpCyclesMovS:              18,
    nOpCyclesMovSr0:            9-2,    // reduced by nOpCyclesPrefix
    nOpCyclesMovSrn:            17-2,   // reduced by nOpCyclesPrefix
    nOpCyclesScaS:              15,
    nOpCyclesScaSr0:            9-2,    // reduced by nOpCyclesPrefix
    nOpCyclesScaSrn:            15-2,   // reduced by nOpCyclesPrefix
    nOpCyclesStoS:              11,
    nOpCyclesStoSr0:            9-2,    // reduced by nOpCyclesPrefix
    nOpCyclesStoSrn:            10-2,   // reduced by nOpCyclesPrefix
    nOpCyclesRet:               8,
    nOpCyclesRetn:              12,
    nOpCyclesRetF:              18,
    nOpCyclesRetFn:             17,
    nOpCyclesShift1M:           15,     // ROL/ROR/RCL/RCR/SHL/SHR/SAR reg,1
    nOpCyclesShiftCR:           8,      // ROL/ROR/RCL/RCR/SHL/SHR/SAR reg,CL
    nOpCyclesShiftCM:           20,     // ROL/ROR/RCL/RCR/SHL/SHR/SAR mem,CL
    nOpCyclesShiftCS:           2,      // this is the left-shift value used to convert the count to the cycle cost
    nOpCyclesTestRR:            3,
    nOpCyclesTestRM:            9,
    nOpCyclesTestRI:            5,
    nOpCyclesTestMI:            11,
    nOpCyclesXchgRR:            4,
    nOpCyclesXchgRM:            17,
    nOpCyclesXLAT:              11
};

X86CPU.CYCLES_80286 = {
    nWordCyclePenalty:          0,
    nEACyclesBase:              0,
    nEACyclesDisp:              0,
    nEACyclesBaseIndex:         0,
    nEACyclesBaseIndexExtra:    0,
    nEACyclesBaseDisp:          0,
    nEACyclesBaseIndexDisp:     1,
    nEACyclesBaseIndexDispExtra:1,
    nOpCyclesAAA:               3,
    nOpCyclesAAD:               14,
    nOpCyclesAAM:               16,
    nOpCyclesArithRR:           2,
    nOpCyclesArithRM:           7,
    nOpCyclesArithMR:           7,
    nOpCyclesArithMID:          0,
    nOpCyclesCall:              7,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesCallF:             13,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesCallWR:            7,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesCallWM:            11,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesCallDM:            16,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesCLI:               3,
    nOpCyclesCompareRM:         6,
    nOpCyclesCWD:               2,
    nOpCyclesBound:             13,
    nOpCyclesInP:               5,
    nOpCyclesInDX:              5,
    nOpCyclesIncR:              2,
    nOpCyclesIncM:              7,
    nOpCyclesInt:               23,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesInt3D:             0,
    nOpCyclesIntOD:             1,
    nOpCyclesIntOFall:          3,
    nOpCyclesIRet:              17,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmp:               7,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmpF:              11,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmpC:              7,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmpCFall:          3,
    nOpCyclesJmpWR:             7,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmpWM:             11,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmpDM:             15,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesLAHF:              2,
    nOpCyclesLEA:               3,
    nOpCyclesLS:                7,
    nOpCyclesLoop:              8,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesLoopZ:             8,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesLoopNZ:            8,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesLoopFall:          4,
    nOpCyclesLoopZFall:         4,
    nOpCyclesMovRR:             2,      // this is actually the same as the 8086...
    nOpCyclesMovRM:             3,
    nOpCyclesMovMR:             5,
    nOpCyclesMovRI:             2,
    nOpCyclesMovMI:             3,
    nOpCyclesMovAM:             5,      // this is actually slower than the MOD/RM form of MOV AX,mem (see nOpCyclesMovRM)
    nOpCyclesMovMA:             3,
    nOpCyclesDivBR:             14,
    nOpCyclesDivWR:             22,
    nOpCyclesDivBM:             17,
    nOpCyclesDivWM:             25,
    nOpCyclesIDivBR:            17,
    nOpCyclesIDivWR:            25,
    nOpCyclesIDivBM:            20,
    nOpCyclesIDivWM:            28,
    nOpCyclesMulBR:             13,
    nOpCyclesMulWR:             21,
    nOpCyclesMulBM:             16,
    nOpCyclesMulWM:             24,
    nOpCyclesIMulBR:            13,
    nOpCyclesIMulWR:            21,
    nOpCyclesIMulBM:            16,
    nOpCyclesIMulWM:            24,
    nOpCyclesNegR:              2,
    nOpCyclesNegM:              7,
    nOpCyclesOutP:              5,
    nOpCyclesOutDX:             5,
    nOpCyclesPopAll:            19,
    nOpCyclesPopReg:            5,
    nOpCyclesPopMem:            5,
    nOpCyclesPushAll:           17,
    nOpCyclesPushReg:           3,
    nOpCyclesPushMem:           5,
    nOpCyclesPushSeg:           3,
    nOpCyclesPrefix:            0,
    nOpCyclesCmpS:              8,
    nOpCyclesCmpSr0:            5,
    nOpCyclesCmpSrn:            9,
    nOpCyclesLodS:              5,
    nOpCyclesLodSr0:            5,
    nOpCyclesLodSrn:            4,
    nOpCyclesMovS:              5,
    nOpCyclesMovSr0:            5,
    nOpCyclesMovSrn:            4,
    nOpCyclesScaS:              7,
    nOpCyclesScaSr0:            5,
    nOpCyclesScaSrn:            8,
    nOpCyclesStoS:              3,
    nOpCyclesStoSr0:            4,
    nOpCyclesStoSrn:            3,
    nOpCyclesRet:               11,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesRetn:              11,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesRetF:              15,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesRetFn:             15,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesShift1M:           7,
    nOpCyclesShiftCR:           5,
    nOpCyclesShiftCM:           8,
    nOpCyclesShiftCS:           0,
    nOpCyclesTestRR:            2,
    nOpCyclesTestRM:            6,
    nOpCyclesTestRI:            3,
    nOpCyclesTestMI:            6,
    nOpCyclesXchgRR:            3,
    nOpCyclesXchgRM:            5,
    nOpCyclesXLAT:              5
};

/*
 * TODO: All these values were simply copied from the 80286 table and still need to be modified and verified.
 * Cycle counts for 80386-only instructions are hard-coded in their respective handlers, since those counts don't vary.
 */
X86CPU.CYCLES_80386 = {
    nWordCyclePenalty:          0,
    nEACyclesBase:              0,
    nEACyclesDisp:              0,
    nEACyclesBaseIndex:         0,
    nEACyclesBaseIndexExtra:    0,
    nEACyclesBaseDisp:          0,
    nEACyclesBaseIndexDisp:     1,
    nEACyclesBaseIndexDispExtra:1,
    nOpCyclesAAA:               3,
    nOpCyclesAAD:               14,
    nOpCyclesAAM:               16,
    nOpCyclesArithRR:           2,
    nOpCyclesArithRM:           7,
    nOpCyclesArithMR:           7,
    nOpCyclesArithMID:          0,
    nOpCyclesCall:              7,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesCallF:             13,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesCallWR:            7,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesCallWM:            11,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesCallDM:            16,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesCLI:               3,
    nOpCyclesCompareRM:         6,
    nOpCyclesCWD:               2,
    nOpCyclesBound:             13,
    nOpCyclesInP:               5,
    nOpCyclesInDX:              5,
    nOpCyclesIncR:              2,
    nOpCyclesIncM:              7,
    nOpCyclesInt:               23,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesInt3D:             0,
    nOpCyclesIntOD:             1,
    nOpCyclesIntOFall:          3,
    nOpCyclesIRet:              17,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmp:               7,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmpF:              11,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmpC:              7,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmpCFall:          3,
    nOpCyclesJmpWR:             7,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmpWM:             11,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesJmpDM:             15,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesLAHF:              2,
    nOpCyclesLEA:               3,
    nOpCyclesLS:                7,
    nOpCyclesLoop:              8,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesLoopZ:             8,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesLoopNZ:            8,      // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesLoopFall:          4,
    nOpCyclesLoopZFall:         4,
    nOpCyclesMovRR:             2,      // this is actually the same as the 8086...
    nOpCyclesMovRM:             3,
    nOpCyclesMovMR:             5,
    nOpCyclesMovRI:             2,
    nOpCyclesMovMI:             3,
    nOpCyclesMovAM:             5,      // this is actually slower than the MOD/RM form of MOV AX,mem (see nOpCyclesMovRM)
    nOpCyclesMovMA:             3,
    nOpCyclesDivBR:             14,
    nOpCyclesDivWR:             22,
    nOpCyclesDivBM:             17,
    nOpCyclesDivWM:             25,
    nOpCyclesIDivBR:            17,
    nOpCyclesIDivWR:            25,
    nOpCyclesIDivBM:            20,
    nOpCyclesIDivWM:            28,
    nOpCyclesMulBR:             13,
    nOpCyclesMulWR:             21,
    nOpCyclesMulBM:             16,
    nOpCyclesMulWM:             24,
    nOpCyclesIMulBR:            13,
    nOpCyclesIMulWR:            21,
    nOpCyclesIMulBM:            16,
    nOpCyclesIMulWM:            24,
    nOpCyclesNegR:              2,
    nOpCyclesNegM:              7,
    nOpCyclesOutP:              5,
    nOpCyclesOutDX:             5,
    nOpCyclesPopAll:            19,
    nOpCyclesPopReg:            5,
    nOpCyclesPopMem:            5,
    nOpCyclesPushAll:           17,
    nOpCyclesPushReg:           3,
    nOpCyclesPushMem:           5,
    nOpCyclesPushSeg:           3,
    nOpCyclesPrefix:            0,
    nOpCyclesCmpS:              8,
    nOpCyclesCmpSr0:            5,
    nOpCyclesCmpSrn:            9,
    nOpCyclesLodS:              5,
    nOpCyclesLodSr0:            5,
    nOpCyclesLodSrn:            4,
    nOpCyclesMovS:              5,
    nOpCyclesMovSr0:            5,
    nOpCyclesMovSrn:            4,
    nOpCyclesScaS:              7,
    nOpCyclesScaSr0:            5,
    nOpCyclesScaSrn:            8,
    nOpCyclesStoS:              3,
    nOpCyclesStoSr0:            4,
    nOpCyclesStoSrn:            3,
    nOpCyclesRet:               11,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesRetn:              11,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesRetF:              15,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesRetFn:             15,     // on the 80286, this ALSO includes the number of bytes in the target instruction
    nOpCyclesShift1M:           7,
    nOpCyclesShiftCR:           5,
    nOpCyclesShiftCM:           8,
    nOpCyclesShiftCS:           0,
    nOpCyclesTestRR:            2,
    nOpCyclesTestRM:            6,
    nOpCyclesTestRI:            3,
    nOpCyclesTestMI:            6,
    nOpCyclesXchgRR:            3,
    nOpCyclesXchgRM:            5,
    nOpCyclesXLAT:              5
};

/**
 * Memory Simulation Notes
 *
 * Memory accesses are currently hard-coded to simulate 8088 characteristics.
 * For example, every 16-bit memory access is assumed to require an additional 4 cycles
 * for the upper byte; on an 8086, that would be true only when the memory address was odd.
 *
 * Similarly, the effective prefetch queue size is 4 bytes (same as an 8088), although
 * that can easily be changed to 6 bytes if/when we decide to fully implement 8086 support
 * (see X86CPU.PREFETCH.QUEUE).  It's just not clear whether that support will be a goal.
 */
X86CPU.PREFETCH = {
    QUEUE:      4,
    ARRAY:      8,              // smallest power-of-two > PREFETCH.QUEUE
    MASK:       0x7             // (X86CPU.PREFETCH.ARRAY - 1)
};

/**
 * initMemory(aMemBlocks, nBlockShift)
 *
 * Notification from Bus.initMemory(), giving us direct access to the entire memory space
 * (aMemBlocks).
 *
 * We also initialize an instruction byte prefetch queue, aPrefetch, which is an N-element
 * array with slots that look like:
 *
 *      0:  [tag, b]    <-- iPrefetchTail
 *      1:  [tag, b]
 *      2:  [ -1, 0]    <-- iPrefetchHead  (eg, when cbPrefetchQueued == 2)
 *      ...
 *      7:  [ -1, 0]
 *
 * where tag is the linear address of the byte that's been prefetched, and b is the
 * value of the byte.  N is currently 8 (PREFETCH.ARRAY), but it can be any power-of-two
 * that is equal to or greater than (PREFETCH.QUEUE), the effective size of the prefetch
 * queue (6 on an 8086, 4 on an 8088; currently hard-coded to the latter).  All slots
 * are initialized to [-1, 0] when preallocating the prefetch queue, but those initial
 * values are quickly overwritten and never seen again.
 *
 * iPrefetchTail is the index (0-7) of the next prefetched byte to be returned to the CPU,
 * and iPrefetchHead is the index (0-7) of the next slot to be filled.  The prefetch queue
 * is empty IFF the two indexes are equal and IFF cbPrefetchQueued is zero. cbPrefetchQueued
 * is simply the number of bytes between the tail and the head (from 0 to PREFETCH.QUEUE).
 *
 * cbPrefetchValid indicates how many bytes behind iPrefetchHead are still valid, allowing us
 * to "rewind" the tail up to that many bytes.  For example, let's imagine that we prefetched
 * 2 bytes, and then we immediately consumed both bytes, leaving iPrefetchTail == iPrefetchHead
 * again; however, those previous 2 bytes are still valid, and if, for example, we wanted to
 * rewind the IP by 2 (which we might want to do in the case of a repeated string instruction),
 * we could rewind the prefetch queue tail as well.
 *
 * Corresponding to iPrefetchHead is addrPrefetchHead; both are incremented in lock-step.
 * Whenever the prefetch queue is flushed, it's typically because a new, non-incremental
 * regLIP has been set, so flushPrefetch() expects to receive that address.
 *
 * If the prefetch queue does not contain any (or enough) bytes to satisfy a getBytePrefetch()
 * or getShortPrefetch() request, we force the queue to be filled with the necessary number
 * of bytes first.
 *
 * @this {X86CPU}
 * @param {Array} aMemBlocks
 * @param {number} nBlockShift
 */
X86CPU.prototype.initMemory = function(aMemBlocks, nBlockShift)
{
    /*
     * aBusBlocks preserves the Bus block array for the life of the machine, whereas aMemBlocks
     * will be altered if/when the CPU enables paging.  PAGEBLOCKS must be true when using Memory
     * blocks to simulate paging, ensuring that physical blocks and pages have the same size (4Kb).
     */
    this.aBusBlocks = aMemBlocks;
    this.aMemBlocks = aMemBlocks;
    this.nBlockShift = nBlockShift;
    this.nBlockSize = 1 << this.nBlockShift;
    this.nBlockLimit = this.nBlockSize - 1;
    this.nBlockTotal = aMemBlocks.length;
    this.nBlockMask = this.nBlockTotal - 1;
    if (PREFETCH) {
        this.nBusCycles = 0;
        this.aPrefetch = new Array(X86CPU.PREFETCH.ARRAY);
        for (var i = 0; i < X86CPU.PREFETCH.ARRAY; i++) {
            this.aPrefetch[i] = 0;
        }
        this.flushPrefetch(0);
    }
};

/**
 * setAddressMask(nBusMask)
 *
 * Notification from Bus.initMemory() and Bus.setA20(); the latter calls us whenever the physical
 * A20 line changes (note that on a 20-bit bus machine, address lines A20 and higher are always zero).
 *
 * For 32-bit bus machines (eg, 80386), nBusMask is never changed after the initial call, because A20
 * wrap-around is simulated by changing the physical memory map rather than altering the A20 bit in nBusMask.
 *
 * We maintain nMemMask separate from nBusMask, because when paging is enabled on the 80386, the CPU memory
 * functions are now dealing with linear addresses rather than physical addresses, so it would be incorrect
 * to apply nBusMask to those addresses; nMemMask must remain 0xffffffff (-1) for the duration.  If we change
 * how A20 is simulated on the 80386, then enablePageBlocks() and disablePageBlocks() will need to override
 * nMemMask appropriately.
 *
 * TODO: Ideally, we would eliminate masking altogether of 32-bit addresses, but that would require different
 * sets of memory access functions for different machines (ie, those with 20-bit or 24-bit buses).
 *
 * @this {X86CPU}
 * @param {number} nBusMask
 */
X86CPU.prototype.setAddressMask = function(nBusMask)
{
    this.nBusMask = this.nMemMask = nBusMask;
};

/**
 * enablePageBlocks()
 *
 * Whenever the CPU turns on paging and/or updates CR3, this function is called to update our copy
 * of the Bus block array, to simulate paging.  Whenever the CPU turns paging off, disablePageBlocks()
 * must be called to restore our copy of the Bus block array to its original (physical) mapping.
 *
 * This also requires PAGEBLOCKS be enabled, to ensure the Bus is configured with a 4Kb block size.
 *
 * The first time this function is called, aMemBlocks and aBusBlocks are identical, so aMemBlocks is
 * reinitialized with special UNPAGED Memory blocks that know how to perform page directory/page table
 * lookup and replace themselves with special PAGED Memory blocks that reference memory from the
 * appropriate block in aBusBlocks.  A parallel array, aBlocksPaged, keeps track (by block number) of
 * which blocks have been PAGED, so that whenever CR3 is updated, those blocks can be quickly UNPAGED.
 *
 * @this {X86CPU}
 */
X86CPU.prototype.enablePageBlocks = function()
{
    if (!PAGEBLOCKS) {
        this.setError("PAGEBLOCKS support required");
        return;
    }
    if (this.aMemBlocks === this.aBusBlocks) {
        this.aMemBlocks = new Array(this.nBlockTotal);
        this.blockUnpaged = new Memory(null, 0, 0, Memory.TYPE.UNPAGED, null, this);
        for (var iBlock = 0; iBlock < this.nBlockTotal; iBlock++) {
            this.aMemBlocks[iBlock] = this.blockUnpaged;
        }
        /*
         * We also need a special "empty" Memory block that mapPageBlock() can pass back to callers
         * whenever a valid block cannot be found for an UNPAGED block.
         */
        this.memEmpty = new Memory();
    } else {
        for (var i = 0; i < this.aBlocksPaged.length; i++) {
            this.aMemBlocks[this.aBlocksPaged[i]] = this.blockUnpaged;
        }
    }
    this.aBlocksPaged = [];
};

/**
 * mapPageBlock(addr, fWrite, fSuppress)
 *
 * Locate the corresponding physical PDE, PTE and memory blocks for the given linear address, and then
 * upgrade the block from an UNPAGED Memory block to a new PAGED Memory block; all future accesses to
 * the current page will go directly to that block, instead of coming here through the UNPAGED block
 * handlers.
 *
 * Note that since the incoming address (addr) is a linear address, we never need to mask it with nBusMask,
 * but all the intermediate (PDE, PTE) and final physical addresses we calculate should still be masked.
 *
 * Granted, nBusMask on a 32-bit bus is generally going to be 0xffffffff (-1), so making might seem like
 * a waste of time; however, if we decide to once again rely on nBusMask for emulating A20 wrap-around
 * (instead of changing the physical memory map to alias the 2nd Mb to the 1st Mb), then performing
 * consistent masking will be important.
 *
 * Also, addrPDE, addrPTE and addrPhys do not need any offsets added to them, because we immediately shift
 * the offset portion of those addresses out.  But for now, at least for debugging and documentation purposes,
 * my preference is to perform full address calculations.
 *
 * Besides, this should not be a performance-critical function; it's normally called only once per UNPAGED
 * page.  Obviously, if CR3 is constantly being updated, that will trigger repeated calls to enablePageBlocks(),
 * which will perform our equivalent of a TLB flush (ie, resetting all PAGED blocks back to UNPAGED blocks).
 * That would hurt our performance, but it would hurt performance on a real machine as well, so let's see
 * what real-world scenarios we run into.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @param {boolean} fWrite (true if called for a write, false if for a read)
 * @param {boolean} [fSuppress] (true if any faults, remapping, etc should be suppressed)
 * @return {Memory}
 */
X86CPU.prototype.mapPageBlock = function(addr, fWrite, fSuppress)
{
    var offPDE = (addr & X86.LADDR.PDE.MASK) >>> X86.LADDR.PDE.SHIFT;
    var addrPDE = this.regCR3 + offPDE;

    /*
     * bus.getLong(addrPDE) would be simpler, but setPhysBlock() needs to know blockPDE and offPDE, too.
     * TODO: Since we're immediately shifting addrPDE by nBlockShift, then we could also skip adding offPDE.
     */
    var blockPDE = this.aBusBlocks[(addrPDE & this.nBusMask) >>> this.nBlockShift];
    var pde = blockPDE.readLong(offPDE);

    if (!(pde & X86.PTE.PRESENT)) {
        if (!fSuppress) X86.fnPageFault.call(this, addr, false, fWrite);
        return this.memEmpty;
    }

    if (!(pde & X86.PTE.USER) && this.nCPL == 3) {
        if (!fSuppress) X86.fnPageFault.call(this, addr, true, fWrite);
        return this.memEmpty;
    }

    var offPTE = (addr & X86.LADDR.PTE.MASK) >>> X86.LADDR.PTE.SHIFT;
    var addrPTE = (pde & X86.PTE.FRAME) + offPTE;

    /*
     * bus.getLong(addrPTE) would be simpler, but setPhysBlock() needs to know blockPTE and offPTE, too.
     * TODO: Since we're immediately shifting addrPDE by nBlockShift, then we could also skip adding offPTE.
     */
    var blockPTE = this.aBusBlocks[(addrPTE & this.nBusMask) >>> this.nBlockShift];
    var pte = blockPTE.readLong(offPTE);

    if (!(pte & X86.PTE.PRESENT) && !fSuppress) {
        if (!fSuppress) X86.fnPageFault.call(this, addr, false, fWrite);
        return this.memEmpty;
    }

    if (!(pte & X86.PTE.USER) && this.nCPL == 3) {
        if (!fSuppress) X86.fnPageFault.call(this, addr, true, fWrite);
        return this.memEmpty;
    }

    var addrPhys = (pte & X86.PTE.FRAME) + (addr & X86.LADDR.OFFSET);
    /*
     * TODO: Since we're immediately shifting addrPhys by nBlockShift, we could also skip adding the addr's offset.
     */
    var blockPhys = this.aBusBlocks[(addrPhys & this.nBusMask) >>> this.nBlockShift];
    if (fSuppress) return blockPhys;

    /*
     * So we have the block containing the physical memory corresponding to the given linear address.
     *
     * Now we can create a new PAGED Memory block and record the physical block info using setPhysBlock().
     */
    var addrPage = addr & ~X86.LADDR.OFFSET;
    var blockPage = new Memory(addrPage, 0, 0, Memory.TYPE.PAGED);
    blockPage.setPhysBlock(blockPhys, blockPDE, offPDE, blockPTE, offPTE);

    var iBlock = addr >>> this.nBlockShift;
    this.aMemBlocks[iBlock] = blockPage;
    this.aBlocksPaged.push(iBlock);
    return blockPage;
};

/**
 * disablePageBlocks()
 *
 * Whenever the CPU turns off paging, this function restores the CPU's original aMemBlocks.
 *
 * @this {X86CPU}
 */
X86CPU.prototype.disablePageBlocks = function()
{
    if (this.aMemBlocks != this.aBusBlocks) {
        this.aMemBlocks = this.aBusBlocks;
        this.blockUnpaged = null;
        this.aBlocksPaged = null;
        this.memEmpty = null;
    }
};

/**
 * initProcessor()
 *
 * This isolates 80186/80188/80286/80386 support, so that it can be selectively enabled/tested.
 *
 * Here's a summary of 80186/80188 differences according to "AP-186: Introduction to the 80186
 * Microprocessor, March 1983" (pp.55-56).  "The iAPX 86,88 and iAPX 186,188 User's Manual Programmer's
 * Reference", p.3-38, apparently contains the same information, but I've not seen that document.
 *
 * Undefined [Invalid] Opcodes:
 *
 *      When the opcodes 63H, 64H, 65H, 66H, 67H, F1H, FEH/xx111xxxB and FFH/xx111xxxB are executed,
 *      the 80186 will execute an illegal [invalid] instruction exception, interrupt 0x06.
 *      The 8086 will ignore the opcode.
 *
 * 0FH opcode:
 *
 *      When the opcode 0FH is encountered, the 8086 will execute a POP CS, while the 80186 will
 *      execute an illegal [invalid] instruction exception, interrupt 0x06.
 *
 * Word Write at Offset FFFFH:
 *
 *      When a word write is performed at offset FFFFH in a segment, the 8086 will write one byte
 *      at offset FFFFH, and the other at offset 0, while the 80186 will write one byte at offset
 *      FFFFH, and the other at offset 10000H (one byte beyond the end of the segment). One byte segment
 *      underflow will also occur (on the 80186) if a stack PUSH is executed and the Stack Pointer
 *      contains the value 1.
 *
 * Shift/Rotate by Value Greater Then [sic] 31:
 *
 *      Before the 80186 performs a shift or rotate by a value (either in the CL register, or by an
 *      immediate value) it ANDs the value with 1FH, limiting the number of bits rotated to less than 32.
 *      The 8086 does not do this.
 *
 * LOCK prefix:
 *
 *      The 8086 activates its LOCK signal immediately after executing the LOCK prefix. The 80186 does
 *      not activate the LOCK signal until the processor is ready to begin the data cycles associated
 *      with the LOCKed instruction.
 *
 * Interrupted String Move Instructions:
 *
 *      If an 8086 is interrupted during the execution of a repeated string move instruction, the return
 *      value it will push on the stack will point to the last prefix instruction before the string move
 *      instruction. If the instruction had more than one prefix (e.g., a segment override prefix in
 *      addition to the repeat prefix), it will not be re-executed upon returning from the interrupt.
 *      The 80186 will push the value of the first prefix to the repeated instruction, so long as prefixes
 *      are not repeated, allowing the string instruction to properly resume.
 *
 * Conditions causing divide error with an integer divide:
 *
 *      The 8086 will cause a divide error whenever the absolute value of the quotient is greater then
 *      [sic] 7FFFH (for word operations) or if the absolute value of the quotient is greater than 7FH
 *      (for byte operations). The 80186 has expanded the range of negative numbers allowed as a quotient
 *      by 1 to include 8000H and 80H. These numbers represent the most negative numbers representable
 *      using 2's complement arithmetic (equaling -32768 and -128 in decimal, respectively).
 *
 * ESC Opcode:
 *
 *      The 80186 may be programmed to cause an interrupt type 7 whenever an ESCape instruction (used for
 *      co-processors like the 8087) is executed. The 8086 has no such provision. Before the 80186 performs
 *      this trap, it must be programmed to do so. [The details of this "programming" are not included.]
 *
 * Here's a summary of 80286 differences according to "80286 and 80287 Programmer's Reference Manual",
 * Appendix C, p.C-1 (p.329):
 *
 *   1. Add Six Interrupt Vectors
 *
 *      The 80286 adds six interrupts which arise only if the 8086 program has a hidden bug. These interrupts
 *      occur only for instructions which were undefined on the 8086/8088 or if a segment wraparound is attempted.
 *      It is recommended that you add an interrupt handler to the 8086 software that is to be run on the 80286,
 *      which will treat these interrupts as invalid operations.
 *
 *      This additional software does not significantly effect the existing 8086 software because the interrupts
 *      do not normally occur and should not already have been used since they are in the interrupt group reserved
 *      by Intel. [Note to Intel: IBM caaaaaaan't hear you].
 *
 *   2. Do not Rely on 8086/8088 Instruction Clock Counts
 *
 *      The 80286 takes fewer clocks for most instructions than the 8086/8088. The areas to look into are delays
 *      between I/0 operations, and assumed delays in 8086/8088 operating in parallel with an 8087.
 *
 *   3. Divide Exceptions Point at the DIV Instruction
 *
 *      Any interrupt on the 80286 will always leave the saved CS:IP value pointing at the beginning of the
 *      instruction that failed (including prefixes). On the 8086, the CS:IP value saved for a divide exception
 *      points at the next instruction.
 *
 *   4. Use Interrupt 16 (0x10) for Numeric Exceptions
 *
 *      Any 80287 system must use interrupt vector 16 for the numeric error interrupt. If an 8086/8087 or 8088/8087
 *      system uses another vector for the 8087 interrupt, both vectors should point at the numeric error interrupt
 *      handler.
 *
 *   5. Numeric Exception Handlers Should allow Prefixes
 *
 *      The saved CS:IP value in the NPX environment save area will point at any leading prefixes before an ESC
 *      instruction. On 8086/8088 systems, this value points only at the ESC instruction.
 *
 *   6. Do Not Attempt Undefined 8086/8088 Operations
 *
 *      Instructions like POP CS or MOV CS,op will either cause exception 6 (undefined [invalid] opcode) or perform
 *      a protection setup operation like LIDT on the 80286. Undefined bit encodings for bits 5-3 of the second byte
 *      of POP MEM or PUSH MEM will cause exception 13 on the 80286.
 *
 *   7. Place a Far JMP Instruction at FFFF0H
 *
 *      After reset, CS:IP = F000:FFF0 on the 80286 (versus FFFF:0000 on the 8086/8088). This change was made to allow
 *      sufficient code space to enter protected mode without reloading CS. Placing a far JMP instruction at FFFF0H
 *      will avoid this difference. Note that the BOOTSTRAP option of LOC86 will automatically generate this jump
 *      instruction.
 *
 *   8. Do not Rely on the Value Written by PUSH SP
 *
 *      The 80286 will push a different value on the stack for PUSH SP than the 8086/8088. If the value pushed is
 *      important [and when would it NOT be???], replace PUSH SP instructions with the following three instructions:
 *
 *          PUSH    BP
 *          MOV     BP,SP
 *          XCHG    BP,[BP]
 *
 *      This code functions as the 8086/8088 PUSH SP instruction on the 80286.
 *
 *   9. Do not Shift or Rotate by More than 31 Bits
 *
 *      The 80286 masks all shift/rotate counts to the low 5 bits. This MOD 32 operation limits the count to a maximum
 *      of 31 bits. With this change, the longest shift/rotate instruction is 39 clocks. Without this change, the longest
 *      shift/rotate instruction would be 264 clocks, which delays interrupt response until the instruction completes
 *      execution.
 *
 *  10. Do not Duplicate Prefixes
 *
 *      The 80286 sets an instruction length limit of 10 bytes. The only way to violate this limit is by duplicating
 *      a prefix two or more times before an instruction. Exception 6 occurs if the instruction length limit is violated.
 *      The 8086/8088 has no instruction length limit.
 *
 *  11. Do not Rely on Odd 8086/8088 LOCK Characteristics
 *
 *      The LOCK prefix and its corresponding output signal should only be used to prevent other bus masters from
 *      interrupting a data movement operation. The 80286 will always assert LOCK during an XCHG instruction with memory
 *      (even if the LOCK prefix was not used). LOCK should only be used with the XCHG, MOV, MOVS, INS, and OUTS instructions.
 *
 *      The 80286 LOCK signal will not go active during an instruction prefetch.
 *
 *  12. Do not Single Step External Interrupt Handlers
 *
 *      The priority of the 80286 single step interrupt is different from that of the 8086/8088. This change was made
 *      to prevent an external interrupt from being single-stepped if it occurs while single stepping through a program.
 *      The 80286 single step interrupt has higher priority than any external interrupt.
 *
 *      The 80286 will still single step through an interrupt handler invoked by INT instructions or an instruction
 *      exception.
 *
 *  13. Do not Rely on IDIV Exceptions for Quotients of 80H or 8000H
 *
 *      The 80286 can generate the largest negative number as a quotient for IDIV instructions. The 8086 will instead
 *      cause exception O.
 *
 *  14. Do not Rely on NMI Interrupting NMI Handlers
 *
 *      After an NMI is recognized, the NMI input and processor extension limit error interrupt is masked until the
 *      first IRET instruction is executed.
 *
 *  15. The NPX error signal does not pass through an interrupt controller (an 8087 INT signal does). Any interrupt
 *      controller-oriented instructions for the 8087 may have to be deleted.
 *
 *  16. If any real-mode program relies on address space wrap-around (e.g., FFF0:0400=0000:0300), then external hardware
 *      should be used to force the upper 4 addresses to zero during real mode.
 *
 *  17. Do not use I/O ports 00F8-00FFH. These are reserved for controlling 80287 and future processor extensions.
 *
 * @this {X86CPU}
 */
X86CPU.prototype.initProcessor = function()
{
    this.PS_SET = X86.PS_SET_8086;
    this.PS_DIRECT = X86.PS_DIRECT_8086;
    this.PS_CLEAR_RM = X86.PS.IOPL.MASK | X86.PS.NT;

    this.OPFLAG_NOINTR_8086 = X86.OPFLAG.NOINTR;
    this.nShiftCountMask = 0xff;            // on an 8086/8088, all shift counts are used as-is

    this.cycleCounts = (this.model == X86.MODEL_80386? X86CPU.CYCLES_80386 : (this.model == X86.MODEL_80286? X86CPU.CYCLES_80286 : X86CPU.CYCLES_8088));

    this.aOps     = X86.aOps;
    this.aOpGrp4b = X86.aOpGrp4b;
    this.aOpGrp4w = X86.aOpGrp4w;
    this.aOpGrp6  = X86.aOpGrp6Real;        // setProtMode() will ensure that aOpGrp6 is switched

    if (this.model >= X86.MODEL_80186) {
        /*
         * I don't go out of my way to make 80186/80188 cycle times accurate, since I'm not aware of any
         * IBM PC models that used those processors; beyond the 8086, my next priorities are the 80286 and
         * 80386, but I might revisit the 80186 someday.
         *
         * Instruction handlers that contain "hard-coded" 80286 cycle times include: opINSb, opINSw, opOUTSb,
         * opOUTSw, opENTER, and opLEAVE.
         */
        this.aOps = X86.aOps.slice();       // make copies of aOps and others before modifying them
        this.aOpGrp4b = X86.aOpGrp4b.slice();
        this.aOpGrp4w = X86.aOpGrp4w.slice();
        this.nShiftCountMask = 0x1f;        // on newer processors, all shift counts are MOD 32
        this.aOps[0x0F]                 = X86.opInvalid;
        this.aOps[X86.OPCODE.PUSHA]     = X86.opPUSHA;      // 0x60
        this.aOps[X86.OPCODE.POPA]      = X86.opPOPA;       // 0x61
        this.aOps[X86.OPCODE.BOUND]     = X86.opBOUND;      // 0x62
        this.aOps[X86.OPCODE.ARPL]      = X86.opInvalid;    // 0x63
        this.aOps[X86.OPCODE.FS]        = X86.opInvalid;    // 0x64
        this.aOps[X86.OPCODE.GS]        = X86.opInvalid;    // 0x65
        this.aOps[X86.OPCODE.OS]        = X86.opInvalid;    // 0x66
        this.aOps[X86.OPCODE.AS]        = X86.opInvalid;    // 0x67
        this.aOps[X86.OPCODE.PUSHN]     = X86.opPUSHn;      // 0x68
        this.aOps[X86.OPCODE.IMULN]     = X86.opIMULn;      // 0x69
        this.aOps[X86.OPCODE.PUSH8]     = X86.opPUSH8;      // 0x6A
        this.aOps[X86.OPCODE.IMUL8]     = X86.opIMUL8;      // 0x6B
        this.aOps[X86.OPCODE.INSB]      = X86.opINSb;       // 0x6C
        this.aOps[X86.OPCODE.INSW]      = X86.opINSw;       // 0x6D
        this.aOps[X86.OPCODE.OUTSB]     = X86.opOUTSb;      // 0x6E
        this.aOps[X86.OPCODE.OUTSW]     = X86.opOUTSw;      // 0x6F
        this.aOps[0xC0]                 = X86.opGRP2bn;     // 0xC0
        this.aOps[0xC1]                 = X86.opGRP2wn;     // 0xC1
        this.aOps[X86.OPCODE.ENTER]     = X86.opENTER;      // 0xC8
        this.aOps[X86.OPCODE.LEAVE]     = X86.opLEAVE;      // 0xC9
        this.aOps[0xF1]                 = X86.opINT1;       // 0xF1
        this.aOpGrp4b[0x07]             = X86.fnGRPInvalid;
        this.aOpGrp4w[0x07]             = X86.fnGRPInvalid;

        if (this.model >= X86.MODEL_80286) {

            this.PS_SET = X86.PS.BIT1;      // on the 80286, only BIT1 of Processor Status (flags) is always set
            this.PS_DIRECT |= X86.PS.IOPL.MASK | X86.PS.NT;

            this.OPFLAG_NOINTR_8086 = 0;    // used with instructions that should *not* set NOINTR on an 80286 (eg, non-SS segment loads)

            this.aOps[0x0F] = X86.op0F;
            this.aOps0F = X86.aOps0F.slice();
            for (var i = 0; i < this.aOps0F.length; i++) {
                if (!this.aOps0F[i]) this.aOps0F[i] = X86.opUndefined;
            }
            this.aOps[X86.OPCODE.PUSHSP] = X86.opPUSHSP;    // 0x54
            this.aOps[X86.OPCODE.ARPL]   = X86.opARPL;      // 0x63

            if (I386 && this.model >= X86.MODEL_80386) {
                var bOpcode;
                /*
                 * TODO: Determine if the Nested Task (PS.NT) flag should really be cleared in real-mode on an 80386
                 * (we already know based on the OS/2 CPU test discussed in setPS() that it can't be set in real-mode
                 * on an 80286); for now, we assume that it should remain clear on all CPUs, to avoid any unexpected
                 * nested-task weirdness in real-mode.
                 */
                this.PS_CLEAR_RM = X86.PS.NT;
                this.PS_DIRECT |= X86.PS.RF | X86.PS.VM;
                this.aOps[X86.OPCODE.FS] = X86.opFS;        // 0x64
                this.aOps[X86.OPCODE.GS] = X86.opGS;        // 0x65
                this.aOps[X86.OPCODE.OS] = X86.opOS;        // 0x66
                this.aOps[X86.OPCODE.AS] = X86.opAS;        // 0x67
                for (bOpcode in X86.aOps0F386) {
                    this.aOps0F[+bOpcode] = X86.aOps0F386[bOpcode];
                }
            }
        }
    }
};

/**
 * reset()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.reset = function()
{
    if (this.aFlags.fRunning) this.stopCPU();
    this.resetRegs();
    this.resetCycles();
    this.clearError();      // clear any fatal error/exception that setError() may have flagged
    if (SAMPLER) this.iSampleNext = this.iSampleFreq = this.iSampleSkip = 0;
};

/**
 * resetRegs()
 *
 * According to "The 8086 Book", p.7-5, a RESET signal initializes the following registers:
 *
 *      PS          =   0x0000 (which has the important side-effect of disabling interrupts and traps)
 *      IP          =   0x0000
 *      CS          =   0xFFFF
 *      DS/ES/SS    =   0x0000
 *
 * It is silent as to whether the remaining registers are initialized to any particular values.
 *
 * According to the "80286 and 80287 Programmer's Reference Manual", these 80286 registers are reset:
 *
 *      PS          =   0x0002
 *      MSW         =   0xFFF0
 *      IP          =   0xFFF0
 *      CS Selector =   0xF000      DS/ES/SS Selector =   0x0000
 *      CS Base     = 0xFF0000      DS/ES/SS Base     = 0x000000        IDT Base  = 0x000000
 *      CS Limit    =   0xFFFF      DS/ES/SS Limit    =   0xFFFF        IDT Limit =   0x03FF
 *
 * And from the "INTEL 80386 PROGRAMMER'S REFERENCE MANUAL 1986", section 10.1:
 *
 *      The contents of EAX depend upon the results of the power-up self test. The self-test may be requested
 *      externally by assertion of BUSY# at the end of RESET. The EAX register holds zero if the 80386 passed
 *      the test. A nonzero value in EAX after self-test indicates that the particular 80386 unit is faulty.
 *      If the self-test is not requested, the contents of EAX after RESET is undefined.
 *
 *      DX holds a component identifier and revision number after RESET as Figure 10-1 illustrates. DH contains
 *      3, which indicates an 80386 component. DL contains a unique identifier of the revision level.
 *
 *      EFLAGS      =   0x00000002
 *      IP          =   0x0000FFF0
 *      CS selector =   0xF000 (base of 0xFFFF0000 and limit of 0xFFFF)
 *      DS selector =   0x0000
 *      ES selector =   0x0000
 *      SS selector =   0x0000
 *      FS selector =   0x0000
 *      GS selector =   0x0000
 *      IDTR        =   base of 0 and limit of 0x3FF
 *
 * All other 80386 registers are undefined after a reset (ie, Intel did not document how or if they are set).
 *
 * We've elected to set DX to 0x0304 on a reset, which is consistent with a 80386-C0, since we have no desire to
 * try to emulate all the bugs in older (eg, B1) steppings -- at least not initially.  We leave stepping-accurate
 * emulation for another day.  It's also known that the B1 (and possibly B0) reported 0x0303 in DX, and that
 * the D0 stepping reported 0x0305; beyond that, it's not known exactly what revision numbers Intel used for all
 * 80386 revisions.
 *
 * We define some additional "registers", such as regLIP, which mirrors the linear address corresponding to
 * CS:IP (the address of the next opcode byte).  In fact, regLIP functions as our internal IP register, so any
 * code that needs the real IP must call getIP().  This, in turn, means that whenever CS or IP must be modified,
 * regLIP must be recalculated, so you must use either setCSIP(), which takes both an offset and a segment,
 * or setIP(), whichever is appropriate; in unusual cases where only segCS is changing (eg, undocumented 8086
 * opcodes), use setCS().
 *
 * Similarly, regLSP mirrors the linear address corresponding to SS:SP, and therefore you must rely on getSP()
 * to read the current SP, and setSP() and setSS() to update SP and SS.
 *
 * The other segment registers, such as segDS and segES, have similar getters and setters, but they do not mirror
 * any segment:offset values in the same way that regLIP mirrors CS:IP, or that regLSP mirrors SS:SP.
 *
 * @this {X86CPU}
 */
X86CPU.prototype.resetRegs = function()
{
    this.regEAX = 0;
    this.regEBX = 0;
    this.regECX = 0;
    this.regEDX = 0;
    this.regESP = 0;            // this isn't needed in a 16-bit environment, but is required for I386
    this.regEBP = 0;
    this.regESI = 0;
    this.regEDI = 0;

    /*
     * The following are internal "registers" used to capture intermediate values inside selected helper
     * functions and use them if they've been modified (or are known to change); for example, the MUL and DIV
     * instructions perform calculations that must be propagated to specific registers (eg, AX and/or DX), which
     * the ModRM decoder functions don't know about.  We initialize them here mainly for documentation purposes.
     */
    this.fMDSet = false;        // regMDHi and/or regMDLo are invalid unless fMDSet is true
    this.regMDLo = this.regMDHi = 0;
    this.regXX = 0;             // internal register for segment register and control register moves

    /*
     * Another internal "register" we occasionally need is an interim copy of bModRM, set inside selected opcode
     * handlers so that the helper function can have access to the instruction's bModRM without resorting to a
     * closure (which, in the Chrome V8 engine, for example, may cause constant recompilation).
     */
    this.bModRM = 0;

    /*
     * NOTE: Even though the 8086 doesn't have CR0 (aka MSW) and IDTR, we initialize them for ALL CPUs, so
     * that functions like X86.fnINT() can use the same code for both.  The 8086/8088 have no direct way
     * of accessing or changing them, so this is an implementation detail those processors are unaware of.
     */
    this.regCR0 = X86.CR0.MSW.ON;
    this.addrIDT = 0; this.addrIDTLimit = 0x03FF;
    this.regPS = this.nIOPL = 0;        // these should be set before the first setPS() call

    /*
     * Define all the result registers that can be used to "cache" arithmetic and logical flags.
     *
     * In addition, setPS() will initialize resultType, which keeps track of which flags are cached,
     * and resultSize, which maintains the size of the last result; initially, no flags are cached.
     */
    this.resultDst = this.resultSrc = this.resultArith = this.resultLogic = 0;

    /*
     * This is set by fnFault() and reset (to -1) by resetRegs() and opIRET(); its initial purpose is to
     * "help" fnFault() determine when a nested fault should be converted into either a double-fault (DF_FAULT)
     * or a triple-fault (ie, a processor reset).
     */
    this.nFault = -1;

    /*
     * Segment registers used to be defined as separate variables (eg, regCS and regCS0 stored the segment
     * number and base linear address, respectively), but segment registers are now defined as X86Seg objects.
     */
    this.segCS     = new X86Seg(this, X86Seg.ID.CODE,  "CS");
    this.segDS     = new X86Seg(this, X86Seg.ID.DATA,  "DS");
    this.segES     = new X86Seg(this, X86Seg.ID.DATA,  "ES");
    this.segSS     = new X86Seg(this, X86Seg.ID.STACK, "SS");
    this.setSP(0);
    this.setSS(0);

    if (I386 && this.model >= X86.MODEL_80386) {
        this.regEDX = 0x0304;           // Intel errata sheets indicate this is what an 80386-C0 reported
        this.regCR0 = X86.CR0.ET;       // formerly MSW
        this.regCR1 = 0;                // reserved
        this.regCR2 = 0;                // page fault linear address (PFLA)
        this.regCR3 = 0;                // page directory base register (PDBR)
        this.aRegDR = new Array(8);     // Debug Registers DR0-DR7
        this.aRegTR = new Array(8);     // Test Registers TR0-TR7
        this.segFS = new X86Seg(this, X86Seg.ID.DATA,  "FS");
        this.segGS = new X86Seg(this, X86Seg.ID.DATA,  "GS");
        this.disablePageBlocks();
    }

    this.segNULL = new X86Seg(this, X86Seg.ID.NULL,  "NULL");

    /*
     * The next few initializations mirror what we must do prior to each instruction (ie, inside the stepCPU() function);
     * note that opPrefixes, along with segData and segStack, are reset only after we've executed a non-prefix instruction.
     */
    this.segData = this.segDS;
    this.segStack = this.segSS;
    this.opFlags = this.opPrefixes = 0;
    this.regEA = this.regEAWrite = X86.ADDR_INVALID;

    /*
     * intFlags contains some internal states we use to indicate whether a hardware interrupt (INTFLAG.INTR) or
     * Trap software interrupt (INTR.TRAP) has been requested, as well as when we're in a "HLT" state (INTFLAG.HALT)
     * that requires us to wait for a hardware interrupt (INTFLAG.INTR) before continuing execution.
     *
     * intFlags must be cleared only by checkINTR(), whereas opFlags must be cleared prior to every CPU operation.
     */
    this.intFlags = X86.INTFLAG.NONE;

    this.setCSIP(0, 0xffff);    // this should be called before the first setPS() call, in part so that CPL will be set

    if (!I386) this.resetSizes();

    if (BACKTRACK) {
        /*
         * Initialize the backtrack indexes for all registers to zero.  And while, yes, it IS possible
         * for raw data to flow through segment registers as well, it's not common enough in real-mode
         * (and too difficult in protected-mode) to merit the overhead.  Ditto for SP, which can't really
         * be considered a general-purpose register.
         *
         * Every time getByte() is called, btMemLo is filled with the matching backtrack info; similarly,
         * every time getWord() is called, btMemLo and btMemHi are filled with the matching backtrack info
         * for the low and high bytes, respectively.
         */
        this.backTrack = {
            btiAL:      0,
            btiAH:      0,
            btiBL:      0,
            btiBH:      0,
            btiCL:      0,
            btiCH:      0,
            btiDL:      0,
            btiDH:      0,
            btiBPLo:    0,
            btiBPHi:    0,
            btiSILo:    0,
            btiSIHi:    0,
            btiDILo:    0,
            btiDIHi:    0,
            btiMemLo:   0,
            btiMemHi:   0,
            btiEALo:    0,
            btiEAHi:    0,
            btiIO:      0
        };
    }

    /*
     * Assorted 80286-specific registers.  The GDTR and IDTR registers are stored as the following pieces:
     *
     *      GDTR:   addrGDT (24 bits) and addrGDTLimit (24 bits)
     *      IDTR:   addrIDT (24 bits) and addrIDTLimit (24 bits)
     *
     * while the LDTR and TR are stored as special segment registers: segLDT and segTSS.
     *
     * So, yes, our GDTR and IDTR "registers" differ from other segment registers in that we do NOT record
     * the 16-bit limit specified by the LGDT or LIDT instructions; instead, we immediately calculate the limiting
     * address, and record that instead.
     *
     * In addition to different CS:IP reset values, the CS base address must be set to the top of the 16Mb
     * address space rather than the top of the first 1Mb (which is why the MODEL_5170 ROM must be addressable
     * at both 0x0F0000 and 0xFF0000; see the ROM component's "alias" parameter).
     */
    if (this.model >= X86.MODEL_80286) {
        /*
         * TODO: Verify what the 80286 actually sets addrGDT and addrGDTLimit to on reset (or if it leaves them alone).
         */
        this.addrGDT = 0; this.addrGDTLimit = 0xffff;                   // GDTR
        this.segLDT = new X86Seg(this, X86Seg.ID.LDT,   "LDT", true);   // LDTR
        this.segTSS = new X86Seg(this, X86Seg.ID.TSS,   "TSS", true);   // TR
        this.segVER = new X86Seg(this, X86Seg.ID.OTHER, "VER", true);   // a scratch segment register for VERR and VERW instructions
        this.setCSIP(0xfff0, 0xf000);                   // on an 80286 or 80386, the default CS:IP is 0xF000:0xFFF0 instead of 0xFFFF:0x0000
        this.setCSBase(0xffff0000|0);                   // on an 80286 or 80386, all CS base address bits above bit 15 must be set
    }

    /*
     * This resets the Processor Status flags (regPS), along with all the internal "result registers";
     * we've taken care to ensure that both CPL and IOPL are initialized before this first setPS() call.
     */
    this.setPS(0);

    /*
     * Now that all the segment registers have been created, it's safe to set the current addressing mode.
     */
    this.setProtMode();
};

/**
 * setAddrSize(size)
 *
 * This is used by opcodes that require a particular ADDRESS size, which we enforce by
 * internally simulating an ADDRESS size override, if needed.
 *
 * @this {X86CPU}
 * @param {number} size (2 for 2-byte/16-bit operands, or 4 for 4-byte/32-bit operands)
 */
X86CPU.prototype.setAddrSize = function(size)
{
    if (this.addrSize != size) {
        this.opPrefixes |= X86.OPFLAG.ADDRSIZE;
        this.addrSize = size;
        this.addrMask = (size == 2? 0xffff : (0xffffffff|0));
        this.updateAddrSize();
    }
};

/**
 * updateAddrSize()
 *
 * Select the appropriate ModRM dispatch tables, based on the current ADDRESS size (addrSize), which
 * is based foremost on segCS.addrSize, but can also be overridden by an ADDRESS size instruction prefix.
 *
 * @this {X86CPU}
 */
X86CPU.prototype.updateAddrSize = function()
{
    if (!I386) {
        this.getAddr = this.getShort;
        this.aOpModRegByte = X86ModB.aOpModReg;
        this.aOpModMemByte = X86ModB.aOpModMem;
        this.aOpModGrpByte = X86ModB.aOpModGrp;
        this.aOpModRegWord = X86ModW.aOpModReg;
        this.aOpModMemWord = X86ModW.aOpModMem;
        this.aOpModGrpWord = X86ModW.aOpModGrp;
    } else {
        if (this.addrSize == 2) {
            this.getAddr = this.getShort;
            this.aOpModRegByte = X86ModB16.aOpModReg;
            this.aOpModMemByte = X86ModB16.aOpModMem;
            this.aOpModGrpByte = X86ModB16.aOpModGrp;
            this.aOpModRegWord = X86ModW16.aOpModReg;
            this.aOpModMemWord = X86ModW16.aOpModMem;
            this.aOpModGrpWord = X86ModW16.aOpModGrp;
        } else {
            this.getAddr = this.getLong;
            this.aOpModRegByte = X86ModB32.aOpModReg;
            this.aOpModMemByte = X86ModB32.aOpModMem;
            this.aOpModGrpByte = X86ModB32.aOpModGrp;
            this.aOpModRegWord = X86ModW32.aOpModReg;
            this.aOpModMemWord = X86ModW32.aOpModMem;
            this.aOpModGrpWord = X86ModW32.aOpModGrp;
        }
    }
};

/**
 * setDataSize(size)
 *
 * This is used by opcodes that require a particular OPERAND size, which we enforce by internally
 * simulating an OPERAND size override, if needed.
 *
 * @this {X86CPU}
 * @param {number} size (2 for 2-byte/16-bit operands, or 4 for 4-byte/32-bit operands)
 */
X86CPU.prototype.setDataSize = function(size)
{
    if (this.dataSize != size) {
        this.opPrefixes |= X86.OPFLAG.DATASIZE;
        this.dataSize = size;
        this.dataMask = (size == 2? 0xffff : (0xffffffff|0));
        this.updateDataSize();
    }
};

/**
 * updateDataSize()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.updateDataSize = function()
{
    if (this.dataSize == 2) {
        this.dataType = X86.RESULT.WORD;
        this.getWord = this.getShort;
        this.setWord = this.setShort;
    } else {
        this.dataType = X86.RESULT.DWORD;
        this.getWord = this.getLong;
        this.setWord = this.setLong;
    }
};

/**
 * resetSizes()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.resetSizes = function()
{
    /*
     * The following contain the (default) ADDRESS size (2 for 16 bits, 4 for 32 bits), and the corresponding
     * masks for isolating the (src) bits of an address and clearing the (dst) bits of an address.  Like the
     * OPERAND size properties, these are reset to their segCS counterparts at the start of every new instruction.
     */
    this.addrSize = this.segCS.addrSize;
    this.addrMask = this.segCS.addrMask;

    /*
     * It's also worth noting that instructions that implicitly use the stack also rely on STACK size,
     * which is based on the BIG bit of the last descriptor loaded into SS; use the following segSS properties:
     *
     *      segSS.addrSize      (2 or 4)
     *      segSS.addrMask      (0xffff or 0xffffffff)
     *
     * As there is no STACK size instruction prefix override, there's no need to propagate these segSS properties
     * to separate X86CPU properties, as we do for the OPERAND size and ADDRESS size properties.
     */

    this.updateAddrSize();

    /*
     * The following contain the (default) OPERAND size (2 for 16 bits, 4 for 32 bits), and the corresponding masks
     * for isolating the (src) bits of an OPERAND and clearing the (dst) bits of an OPERAND.  These are reset to
     * their segCS counterparts at the start of every new instruction, but are also set here for documentation purposes.
     */
    this.dataSize = this.segCS.dataSize;
    this.dataMask = this.segCS.dataMask;

    this.updateDataSize();

    this.opPrefixes &= ~(X86.OPFLAG.ADDRSIZE | X86.OPFLAG.DATASIZE);
};

/**
 * getChecksum()
 *
 * @this {X86CPU}
 * @return {number} a 32-bit summation of key elements of the current CPU state (used by the CPU checksum code)
 */
X86CPU.prototype.getChecksum = function()
{
    var sum = (this.regEAX + this.regEBX + this.regECX + this.regEDX + this.getSP() + this.regEBP + this.regESI + this.regEDI)|0;
    sum = (sum + this.getIP() + this.getCS() + this.getDS() + this.getSS() + this.getES() + this.getPS())|0;
    return sum;
};

/**
 * addIntNotify(nInt, component, fn)
 *
 * Add an software interrupt notification handler to the CPU's list of such handlers.
 *
 * @this {X86CPU}
 * @param {number} nInt
 * @param {Component} component
 * @param {function(number)} fn is called with the LIP value following the software interrupt
 */
X86CPU.prototype.addIntNotify = function(nInt, component, fn)
{
    if (fn !== undefined) {
        if (this.aIntNotify[nInt] === undefined) {
            this.aIntNotify[nInt] = [];
        }
        this.aIntNotify[nInt].push([component, fn]);
        if (MAXDEBUG) this.log("addIntNotify(" + str.toHexWord(nInt) + "," + component.id + ")");
    }
};

/**
 * checkIntNotify(nInt)
 *
 * NOTE: This is called ONLY for "INT N" instructions -- not "INTO" or breakpoint or single-step interrupts
 * or divide exception interrupts, or hardware interrupts, or any simulation of an interrupt (eg, "PUSHF/CALLF").
 *
 * @this {X86CPU}
 * @param {number} nInt
 * @return {boolean} true if software interrupt may proceed, false if software interrupt should be skipped
 */
X86CPU.prototype.checkIntNotify = function(nInt)
{
    var aNotify = this.aIntNotify[nInt];
    if (aNotify !== undefined) {
        for (var i = 0; i < aNotify.length; i++) {
            if (!aNotify[i][1].call(aNotify[i][0], this.regLIP)) {
                return false;
            }
        }
    }
    /*
     * The enabling of INT messages is one of the criteria that's also included in the Debugger's checksEnabled()
     * function, and therefore included in fDebugCheck, so for maximum speed, we check fDebugCheck first.
     *
     * NOTE: By wrapping this in MAXDEBUG, we're effectively eliminating the need for any checkIntReturn() calls;
     * onIntReturn() generates a lot of noise, via dbg.messageIntReturn(), and because there's no way to be be sure
     * we'll catch the return (or for some interrupts, *whether* they will return), it's safer to disable this
     * feature unless you really want it.
     */
    if (DEBUGGER && this.aFlags.fDebugCheck) {
        if (this.messageEnabled(Messages.INT) && this.dbg.messageInt(nInt, this.regLIP) && MAXDEBUG) {
            this.addIntReturn(this.regLIP, function(cpu, nCycles) {
                return function onIntReturn(nLevel) {
                    cpu.dbg.messageIntReturn(nInt, nLevel, cpu.getCycles() - nCycles);
                };
            }(this, this.getCycles()));
        }
    }
    return true;
};

/**
 * addIntReturn(addr, fn)
 *
 * Add a return notification handler to the CPU's list of such handlers.
 *
 * When fn(n) is called, it's passed a "software interrupt level", which will normally be 0,
 * unless it's a return from a nested software interrupt (eg, return from INT 0x10 Video BIOS
 * call issued inside another INT 0x10 Video BIOS call).
 *
 * Note that the nesting could be due to a completely different software interrupt that
 * another interrupt notification function is intercepting, so use it as an advisory value only.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @param {function(number)} fn is an interrupt-return notification function
 */
X86CPU.prototype.addIntReturn = function(addr, fn)
{
    if (fn !== undefined) {
        if (this.aIntReturn[addr] == null) {
            this.cIntReturn++;
        }
        this.aIntReturn[addr] = fn;
    }
};

/**
 * checkIntReturn(addr)
 *
 * We check for possible "INT n" software interrupt returns in the cases of "IRET" (fnIRET), "RETF 2"
 * (fnRETF) and "JMPF [DWORD]" (fnJMPFdw).
 *
 * "JMPF [DWORD]" is an unfortunate choice that newer versions of DOS (as of at least 3.20, and probably
 * earlier) employed in their INT 0x13 hooks; I would have preferred not making this call for that opcode.
 *
 * It is expected (though not required) that callers will check cIntReturn and avoid calling this function
 * if the count is zero, for maximum performance.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 */
X86CPU.prototype.checkIntReturn = function(addr)
{
    var fn = this.aIntReturn[addr];
    if (fn != null) {
        fn(--this.cIntReturn);
        delete this.aIntReturn[addr];
    }
};

/**
 * setProtMode(fProt, fV86)
 *
 * Update any opcode handlers that operate significantly differently in real-mode vs. protected-mode, and
 * notify all the segment registers about the mode change as well -- but only those that are "bi-modal"; internal
 * segment registers like segLDT and segTSS do not need to be notified, because they cannot be accessed in real-mode
 * (ie, LLDT, LTR, SLDT, STR are invalid instructions in real-mode, and are among the opcode handlers that we
 * update here).
 *
 * NOTE: Ideally, this function would do its work ONLY on mode *transitions*, but we assume calls to setProtMode()
 * are sufficiently infrequent that it doesn't really matter.
 *
 * @this {X86CPU}
 * @param {boolean} [fProt] (use the current MSW PE bit if not specified)
 * @param {boolean} [fV86] true if the X86.PS.VM (V86-mode) flag is set (or is about to be)
 */
X86CPU.prototype.setProtMode = function(fProt, fV86)
{
    if (fProt === undefined) {
        fProt = !!(this.regCR0 & X86.CR0.MSW.PE);
    }
    if (fV86 === undefined) {
        fV86 = !!(this.regPS & X86.PS.VM);
    }
    if (!fProt != !(this.regCR0 & X86.CR0.MSW.PE) && this.messageEnabled()) {
        this.printMessage("CPU switching to " + (fProt? (fV86? "v86" : "protected") : "real") + "-mode", this.bitsMessage, true);
    }
    this.aOpGrp6 = (fProt && !fV86? X86.aOpGrp6Prot : X86.aOpGrp6Real);
    this.segCS.updateMode(false, fProt, fV86);
    this.segDS.updateMode(false, fProt, fV86);
    this.segSS.updateMode(false, fProt, fV86);
    this.segES.updateMode(false, fProt, fV86);
    if (I386 && this.model >= X86.MODEL_80386) {
        this.segFS.updateMode(false, fProt, fV86);
        this.segGS.updateMode(false, fProt, fV86);
        this.resetSizes();
    }
};

/**
 * saveProtMode()
 *
 * Save CPU state related to protected-mode, for save()
 *
 * @this {X86CPU}
 * @return {Array}
 */
X86CPU.prototype.saveProtMode = function()
{
    if (this.addrGDT != null) {
        var a = [
            this.regCR0,
            this.addrGDT,
            this.addrGDTLimit,
            this.addrIDT,
            this.addrIDTLimit,
            this.segLDT.save(),
            this.segTSS.save(),
            this.nIOPL
        ];
        if (I386) {
            a.push(this.regCR1);
            a.push(this.regCR2);
            a.push(this.regCR3);
            a.push(this.aRegDR);
            a.push(this.aRegTR);
        }
        return a;
    }
    return null;
};

/**
 * restoreProtMode()
 *
 * Restore CPU state related to protected-mode, for restore()
 *
 * @this {X86CPU}
 * @param {Array} a
 */
X86CPU.prototype.restoreProtMode = function(a)
{
    if (a && a.length) {
        this.regCR0 = a[0];
        this.addrGDT = a[1];
        this.addrGDTLimit = a[2];
        this.addrIDT = a[3];
        this.addrIDTLimit = a[4];
        this.segLDT.restore(a[5]);
        this.segTSS.restore(a[6]);
        this.nIOPL = a[7];
        if (I386 && this.model >= X86.MODEL_80386) {
            this.regCR1 = a[8];
            this.regCR2 = a[9];
            this.regCR3 = a[10];
            this.aRegDR = a[11];
            this.aRegTR = a[12];
        }
        this.setProtMode();
    }
};

/**
 * save()
 *
 * This implements save support for the X86 component.
 *
 * UPDATES: The current speed multiplier from getSpeed() is now saved in group #3, so that your speed is preserved.
 *
 * @this {X86CPU}
 * @return {Object|null}
 */
X86CPU.prototype.save = function()
{
    var state = new State(this);
    state.set(0, [this.regEAX, this.regEBX, this.regECX, this.regEDX, this.getSP(), this.regEBP, this.regESI, this.regEDI]);
    var a = [this.getIP(), this.segCS.save(), this.segDS.save(), this.segSS.save(), this.segES.save(), this.saveProtMode(), this.getPS()];
    if (I386 && this.model >= X86.MODEL_80386) {
        a.push(this.segFS.save());
        a.push(this.segGS.save());
    }
    state.set(1, a);
    state.set(2, [this.segData.sName, this.segStack.sName, this.opFlags, this.opPrefixes, this.intFlags, this.regEA, this.regEAWrite]);
    state.set(3, [0, this.nTotalCycles, this.getSpeed()]);
    state.set(4, this.bus.saveMemory());
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the X86 component.
 *
 * @this {X86CPU}
 * @param {Object} data
 * @return {boolean} true if restore successful, false if not
 */
X86CPU.prototype.restore = function(data)
{
    var a = data[0];
    this.regEAX = a[0];
    this.regEBX = a[1];
    this.regECX = a[2];
    this.regEDX = a[3];
    var regESP = a[4];
    this.regEBP = a[5];
    this.regESI = a[6];
    this.regEDI = a[7];

    a = data[1];
    this.segCS.restore(a[1]);
    this.segDS.restore(a[2]);
    this.segSS.restore(a[3]);
    this.segES.restore(a[4]);
    this.restoreProtMode(a[5]);
    this.setPS(a[6]);

    /*
     * It's important to call setCSIP(), both to ensure that the CPU's linear IP register (regLIP) is updated
     * properly AND to ensure the CPU's default ADDRESS and OPERAND sizes are set properly.
     */
    this.setCSIP(a[0], this.segCS.sel);

    /*
     * It's also important to call setSP(), so that the linear SP register (regLSP) will be updated properly;
     * we also need to call setSS(), to ensure that the lower and upper stack limits are properly initialized.
     */
    this.setSP(regESP);
    this.setSS(this.segSS.sel);

    if (I386 && this.model >= X86.MODEL_80386) {
        this.segFS.restore(a[7]);
        this.segGS.restore(a[8]);
    }

    a = data[2];
    this.segData  = a[0] != null && this.getSeg(a[0]) || this.segDS;
    this.segStack = a[1] != null && this.getSeg(a[1]) || this.segSS;
    this.opFlags = a[2];
    this.opPrefixes = a[3];
    this.intFlags = a[4];
    this.regEA = a[5];
    this.regEAWrite = a[6];     // save/restore of last EA calculation(s) isn't strictly necessary, but they may be of some interest to, say, the Debugger

    a = data[3];                // a[0] was previously nBurstDivisor (no longer used)
    this.nTotalCycles = a[1];
    this.setSpeed(a[2]);        // if we're restoring an old state that doesn't contain a value from getSpeed(), that's OK; setSpeed() checks for an undefined value
    return this.bus.restoreMemory(data[4]);
};

/**
 * getSeg(sName)
 *
 * @param {string} sName
 * @return {Array}
 */
X86CPU.prototype.getSeg = function(sName)
{
    switch(sName) {
    case "CS":
        return this.segCS;
    case "DS":
        return this.segDS;
    case "SS":
        return this.segSS;
    case "ES":
        return this.segES;
    case "NULL":
        return this.segNULL;
    default:
        /*
         * HACK: We return a fake segment register object in which only the base linear address is valid,
         * because that's all the caller provided (ie, we must be restoring from an older state).
         */
        this.assert(typeof sName == "number");
        return [0, sName, 0, 0, ""];
    }
};

/**
 * getCS()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getCS = function()
{
    return this.segCS.sel;
};

/**
 * setCS(sel)
 *
 * NOTE: This is used ONLY by those few undocumented 8086/8088/80186/80188 instructions that "MOV" or "POP" a value
 * into CS, which we assume have the same behavior as any other instruction that moves or pops a segment register
 * (ie, suppresses h/w interrupts for one instruction).  Instructions that "JMP" or "CALL" or "INT" or "IRET" a new
 * value into CS are always accompanied by a new IP value, so they use setCSIP() instead, which does NOT suppress
 * h/w interrupts.
 *
 * @this {X86CPU}
 * @param {number} sel
 */
X86CPU.prototype.setCS = function(sel)
{
    this.setCSIP(this.getIP(), sel);
    if (!BUGS_8086) this.opFlags |= this.OPFLAG_NOINTR_8086;
};

/**
 * getDS()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getDS = function()
{
    return this.segDS.sel;
};

/**
 * setDS(sel)
 *
 * @this {X86CPU}
 * @param {number} sel
 */
X86CPU.prototype.setDS = function(sel)
{
    this.segDS.load(sel);
    if (!BUGS_8086) this.opFlags |= this.OPFLAG_NOINTR_8086;
};

/**
 * getSS()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getSS = function()
{
    return this.segSS.sel;
};

/**
 * setSS(sel)
 *
 * @this {X86CPU}
 * @param {number} sel
 * @param {boolean} [fInterruptable]
 */
X86CPU.prototype.setSS = function(sel, fInterruptable)
{
    var regESP = this.getSP();
    this.regLSP = (this.segSS.load(sel) + regESP)|0;
    if (this.segSS.fExpDown) {
        this.regLSPLimit = (this.segSS.base + this.segSS.addrMask)|0;
        this.regLSPLimitLow = (this.segSS.base + this.segSS.limit)|0;
    } else {
        this.regLSPLimit = (this.segSS.base + this.segSS.limit)|0;
        this.regLSPLimitLow = this.segSS.base;
    }
    if (!BUGS_8086 && !fInterruptable) this.opFlags |= X86.OPFLAG.NOINTR;
};

/**
 * getES()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getES = function()
{
    return this.segES.sel;
};

/**
 * setES(sel)
 *
 * @this {X86CPU}
 * @param {number} sel
 */
X86CPU.prototype.setES = function(sel)
{
    this.segES.load(sel);
    if (!BUGS_8086) this.opFlags |= this.OPFLAG_NOINTR_8086;
};

/**
 * getFS()
 *
 * NOTE: segFS is defined for I386 only.
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getFS = function()
{
    return this.segFS.sel;
};

/**
 * setFS(sel)
 *
 * NOTE: segFS is defined for I386 only.
 *
 * @this {X86CPU}
 * @param {number} sel
 */
X86CPU.prototype.setFS = function(sel)
{
    this.segFS.load(sel);
};

/**
 * getGS()
 *
 * NOTE: segGS is defined for I386 only.
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getGS = function()
{
    return this.segGS.sel;
};

/**
 * setGS(sel)
 *
 * NOTE: segGS is defined for I386 only.
 *
 * @this {X86CPU}
 * @param {number} sel
 */
X86CPU.prototype.setGS = function(sel)
{
    this.segGS.load(sel);
};

/**
 * getIP()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getIP = function()
{
    return (this.regLIP - this.segCS.base)|0;
};

/**
 * setIP(off)
 *
 * With the addition of flushPrefetch(), this function should only be called
 * for non-incremental IP updates; setIP(this.getIP()+1) is no longer appropriate.
 *
 * In fact, for performance reasons, it's preferable to increment regLIP yourself,
 * but you can also call advanceIP() if speed is not important.
 *
 * @this {X86CPU}
 * @param {number} off
 */
X86CPU.prototype.setIP = function(off)
{
    this.regLIP = (this.segCS.base + (off & (I386? this.dataMask : 0xffff)))|0;
    if (PREFETCH) this.flushPrefetch(this.regLIP);
};

/**
 * setCSIP(off, sel, fCall)
 *
 * This function is a little different from the other segment setters, only because it turns out that CS is
 * never set without an accompanying IP (well, except for a few undocumented instructions, like POP CS, which
 * were available ONLY on the 8086/8088/80186/80188; see setCS() for details).
 *
 * And even though this function is called setCSIP(), please note the order of the parameters is IP,CS,
 * which matches the order that CS:IP values are normally stored in memory, allowing us to make calls like this:
 *
 *      this.setCSIP(this.popWord(), this.popWord());
 *
 * @this {X86CPU}
 * @param {number} off
 * @param {number} sel
 * @param {boolean} [fCall] is true if CALLF in progress, false if RETF/IRET in progress, null/undefined otherwise
 * @return {boolean|null} true if a stack switch occurred; the only opcode that really needs to pay attention is opRETFn()
 */
X86CPU.prototype.setCSIP = function(off, sel, fCall)
{
    this.segCS.fCall = fCall;
    /*
     * We break this operation into the following discrete steps (eg, set IP, load CS, and then update IP) so
     * that segCS.load(sel) has the ability to modify IP when sel refers to a gate (call, interrupt, trap, etc).
     *
     * NOTE: regEIP acts merely as a conduit for the IP, if any, that segCS.load() may load; regLIP is still our
     * internal instruction pointer.  Callers that need the real IP must call getIP().
     */
    this.regEIP = off;
    var base = this.segCS.load(sel);
    if (base !== X86.ADDR_INVALID) {

        /*
         * TODO: Should this code be factored into a setLIP() function? The other primary client would be fnINT().
         */
        if (I386) this.resetSizes();
        this.regLIP = (base + (this.regEIP & (I386? this.dataMask : 0xffff)))|0;
        this.regLIPLimit = (base + this.segCS.limit)|0;
        this.nCPL = this.segCS.cpl;             // cache the current CPL where it's more convenient
        if (PREFETCH) this.flushPrefetch(this.regLIP);

        return this.segCS.fStackSwitch;
    }
    return null;
};

/**
 * setCSBase(addr)
 *
 * Since the CPU must maintain regLIP as the sum of the CS base and the current IP, all calls to setBase()
 * for segCS need to go through here.
 *
 * @param {number} addr
 */
X86CPU.prototype.setCSBase = function(addr)
{
    var regIP = this.getIP();
    addr = this.segCS.setBase(addr);
    this.regLIP = (addr + regIP)|0;
    this.regLIPLimit = (addr + this.segCS.limit)|0;
};

/**
 * advanceIP(inc)
 *
 * @this {X86CPU}
 * @param {number} inc (positive)
 */
X86CPU.prototype.advanceIP = function(inc)
{
    // DEBUG: this.assert(inc > 0);

    this.regLIP = (this.regLIP + inc)|0;
    /*
     * Properly comparing regLIP to regLIPLimit would normally require coercing both to unsigned
     * (ie, floating-point) values.  But instead, we do a subtraction, (regLIPLimit - regLIP), and
     * if the result is negative, we need only be concerned if the signs of both numbers are the same
     * (ie, the sign of their XOR'ed union is positive).
     *
     * TODO: I'm combining the old 8088 address-wrap check with the new segment-limit check,
     * even though the correct time to do the latter is immediately BEFORE a fetch, not AFTER; eg,
     * consider the following code:
     *
     *      AX=0100 BX=0015 CX=0080 DX=F859 SP=0A62 BP=0A98 SI=0000 DI=0000
     *      SS=0038[1759E0,0B5F] DS=02E8[0107A0,017F] ES=0970[009700,6949] A20=ON
     *      CS=02E0[010080,06FB] LD=0028[000000,0000] GD=[11AEE0,4977] ID=[120082,03FF]
     *      TR=0010 MS=FFF3 PS=3202 V0 D0 I1 T0 S0 Z0 A0 P0 C0
     *      02E0:06F9 C20400          RET      0004
     *
     * After fetching the 3rd byte of the "RET 0004" instruction at CS:06FB, the CPU wants to automatically
     * advance IP to 06FC, which of course, exceeds the limit, but that doesn't matter unless we actually
     * fetch a byte from 06FC, which won't happen.  I'm working around this for now by applying a -1
     * fudge factor to the fault check below.
     */
    var off = (this.regLIPLimit - this.regLIP)|0;
    if (off < 0 && (this.regLIPLimit ^ this.regLIP) >= 0) {
        /*
         * There's no such thing as a GP fault on the 8086/8088, and I'm assuming that, on newer
         * processors, when the segment limit is set to the maximum, it's OK for IP to wrap.
         */
        if (this.model <= X86.MODEL_8088 || this.segCS.limit == this.segCS.addrMask) {
            this.setIP(this.regLIP - this.segCS.base);
        } else if (off < -1) {          // fudge factor
            X86.fnFault.call(this, X86.EXCEPTION.GP_FAULT, 0);
        }
    }
};

/**
 * rewindIP(dec)
 *
 * @this {X86CPU}
 * @param {number} dec (negative)
 */
X86CPU.prototype.rewindIP = function(dec)
{
    // DEBUG: this.assert(dec < 0);

    this.regLIP = (this.regLIP + dec)|0;
    /*
     * Since rewindIP() is used only for discrete "intra-instruction" IP adjustments, there should be no need
     * to perform all the same limit checks as advanceIP().
     */
    if (PREFETCH) this.advancePrefetch(dec);
};

/**
 * getSP()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getSP = function()
{
    if (I386) {
        // assert(!((this.regLSP - this.segSS.base) & ~this.segSS.addrMask));
        return (this.regESP & ~this.segSS.addrMask) | (this.regLSP - this.segSS.base);
    }
    return (this.regLSP - this.segSS.base)|0;
};

/**
 * setSP(off)
 *
 * @this {X86CPU}
 * @param {number} off
 */
X86CPU.prototype.setSP = function(off)
{
    if (I386) {
        this.regESP = off;
        this.regLSP = (this.segSS.base + (off & this.segSS.addrMask))|0;
    } else {
        this.regLSP = (this.segSS.base + off)|0;
    }
};

/**
 * setArithResult(dst, src, value, type, fSubtract)
 *
 * Updates the flags for arithmetic instructions; use setLogicResult() for logical instructions.
 *
 * The type parameter indicates both the size of the result (BYTE, WORD or DWORD) and which of the
 * flags should now be considered "cached" by the new result variables.  If the previous resultType
 * specifies any flags not contained in the new type parameter, then those flags must be immediately
 * calculated and written to the appropriate bit(s) in regPS.
 *
 * The fSubtract parameter is used to indicate a "subtracted" result (eg, CMP, DEC, SUB, SBB); the
 * default assumes an "added" result (eg, ADD, ADC, INC).
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @param {number} value
 * @param {number} type
 * @param {boolean} [fSubtract]
 */
X86CPU.prototype.setArithResult = function(dst, src, value, type, fSubtract)
{
    if ((type & X86.RESULT.ALL) != X86.RESULT.ALL && type != this.resultType) {
        var diff = ((type ^ this.resultType) & this.resultType);
        if (diff) {
            if (diff & X86.RESULT.CF) this.getCF();
            if (diff & X86.RESULT.PF) this.getPF();
            if (diff & X86.RESULT.AF) this.getAF();
            if (diff & X86.RESULT.ZF) this.getZF();
            if (diff & X86.RESULT.SF) this.getSF();
            if (diff & X86.RESULT.OF) this.getOF();
        }
    }
    if (!fSubtract) {
        this.resultDst = dst;
        this.resultArith = value;
    } else {
        this.resultDst = value;
        this.resultArith = dst;
    }
    this.resultSrc = src;
    this.resultLogic = value;
    this.resultType = type;
};

/**
 * setLogicResult(value, type, carry, overflow)
 *
 * Updates the flags for logical instructions (eg, AND, OR, TEST, XOR); ie, instructions
 * that update PF, ZF, and SF, while clearing CF and OF (although CF and OF can be explicitly
 * set via the carry and overflow parameters as needed).  AF is always considered undefined.
 *
 * TODO: We should observe the behavior of AF on real CPUs, and determine if there is a
 * well-defined behavior, even though none is documented.  Ditto for OF on shift instructions
 * when the shift count > 1.
 *
 * @this {X86CPU}
 * @param {number} value
 * @param {number} type
 * @param {number} [carry]
 * @param {number} [overflow]
 * @return {number} value
 */
X86CPU.prototype.setLogicResult = function(value, type, carry, overflow)
{
    this.resultType = type | X86.RESULT.LOGIC;
    this.resultLogic = value;
    if (carry) this.setCF(); else this.clearCF();
    if (overflow) this.setOF(); else this.clearOF();
    return value;
};

/**
 * setRotateResult(result, carry, size)
 *
 * Used by all rotate instructions (ie, RCL, RCR, ROL, ROR) to update CF and OF.
 *
 * TODO: We should observe the behavior of OF on real CPUs whenever the rotate count > 1,
 * and determine if there is a well-defined behavior, even though none is documented.
 *
 * @this {X86CPU}
 * @param {number} result
 * @param {number} carry
 * @param {number} size
 */
X86CPU.prototype.setRotateResult = function(result, carry, size)
{
    if (carry & size) this.setCF(); else this.clearCF();
    if ((result ^ carry) & size) this.setOF(); else this.clearOF();
};

/**
 * getCarry()
 *
 * @this {X86CPU}
 * @return {number} 0 or 1, depending on whether CF is clear or set
 */
X86CPU.prototype.getCarry = function()
{
    return this.getCF()? 1 : 0;
};

/**
 * getCF()
 *
 * Notes regarding carry following an I386 addition:
 *
 * The following table summarizes bit 31 of dst, src, and result, along with the expected carry:
 *
 *      dst src res carry
 *      --- --- --- -----
 *      0   0   0   0       no
 *      0   0   1   0       no (there must have been a carry out of bit 30, but it was "absorbed")
 *      0   1   0   1       yes (there must have been a carry out of bit 30, but it was NOT "absorbed")
 *      0   1   1   0       no
 *      1   0   0   1       yes (same as the preceding "yes" case)
 *      1   0   1   0       no
 *      1   1   0   1       yes (since the addition of two ones must always produce a carry)
 *      1   1   1   1       yes (since the addition of two ones must always produce a carry)
 *
 * So, we use the following calculation:
 *
 *      (resultDst ^ ((resultDst ^ resultSrc) & (resultSrc ^ resultArith))) & resultType
 *
 * @this {X86CPU}
 * @return {number} 0 or X86.PS.CF
 */
X86CPU.prototype.getCF = function()
{
    if (this.resultType & X86.RESULT.CF) {
        this.regPS &= ~X86.PS.CF;
        if ((this.resultDst ^ ((this.resultDst ^ this.resultSrc) & (this.resultSrc ^ this.resultArith))) & (this.resultType & X86.RESULT.TYPE)) {
            this.regPS |= X86.PS.CF;
        }
        this.resultType &= ~X86.RESULT.CF;
    }
    return this.regPS & X86.PS.CF;
};

/**
 * getPF()
 *
 * From http://graphics.stanford.edu/~seander/bithacks.html#ParityParallel:
 *
 *      unsigned int v;  // word value to compute the parity of
 *      v ^= v >> 16;
 *      v ^= v >> 8;
 *      v ^= v >> 4;
 *      v &= 0xf;
 *      return (0x6996 >> v) & 1;
 *
 *      The method above takes around 9 operations, and works for 32-bit words.  It may be optimized to work just on
 *      bytes in 5 operations by removing the two lines immediately following "unsigned int v;".  The method first shifts
 *      and XORs the eight nibbles of the 32-bit value together, leaving the result in the lowest nibble of v.  Next,
 *      the binary number 0110 1001 1001 0110 (0x6996 in hex) is shifted to the right by the value represented in the
 *      lowest nibble of v.  This number is like a miniature 16-bit parity-table indexed by the low four bits in v.
 *      The result has the parity of v in bit 1, which is masked and returned.
 *
 * The x86 parity flag (PF) is based exclusively on the low 8 bits of resultParitySign, and PF must be SET if that byte
 * has EVEN parity; the above calculation yields ODD parity, so we use the conditional operator to invert the result.
 *
 * @this {X86CPU}
 * @return {number} 0 or X86.PS.PF
 */
X86CPU.prototype.getPF = function()
{
    if (this.resultType & X86.RESULT.PF) {
        this.regPS &= ~X86.PS.PF;
        if ((0x9669 >> ((this.resultLogic ^ (this.resultLogic >> 4)) & 0xf)) & 1) {
            this.regPS |= X86.PS.PF;
        }
        this.resultType &= ~X86.RESULT.PF;
    }
    return this.regPS & X86.PS.PF;
};

/**
 * getAF()
 *
 * To determine if there's been a carry out of the low 4 bits of an arithmetic operation,
 * we look at all the possible inputs for bit 4, and calculate AF = PS^(D^S):
 *
 *      D   S   A   D^S AF
 *      -   -   -   --- --
 *      0   0   0   0   0
 *      0   0   1   0   1
 *      0   1   0   1   1
 *      0   1   1   1   0
 *      1   0   0   1   1
 *      1   0   1   1   0
 *      1   1   0   0   0
 *      1   1   1   0   1
 *
 * The final calculation looks like:
 *
 *      (resultArith ^ (resultDst ^ resultSrc)) & 0x0010
 *
 * @this {X86CPU}
 * @return {number} 0 or X86.PS.AF
 */
X86CPU.prototype.getAF = function()
{
    if (this.resultType & X86.RESULT.AF) {
        this.regPS &= ~X86.PS.AF;
        if ((this.resultArith ^ (this.resultDst ^ this.resultSrc)) & 0x0010) {
            this.regPS |= X86.PS.AF;
        }
        this.resultType &= ~X86.RESULT.AF;
    }
    return this.regPS & X86.PS.AF;
};

/**
 * getZF()
 *
 * @this {X86CPU}
 * @return {number} 0 or X86.PS.ZF
 */
X86CPU.prototype.getZF = function()
{
    if (this.resultType & X86.RESULT.ZF) {
        this.regPS &= ~X86.PS.ZF;
        if (!(this.resultLogic & (((this.resultType & X86.RESULT.TYPE) - 1) | (this.resultType & X86.RESULT.TYPE)))) {
            this.regPS |= X86.PS.ZF;
        }
        this.resultType &= ~X86.RESULT.ZF;
    }
    return this.regPS & X86.PS.ZF;
};

/**
 * getSF()
 *
 * @this {X86CPU}
 * @return {number} 0 or X86.PS.SF
 */
X86CPU.prototype.getSF = function()
{
    if (this.resultType & X86.RESULT.SF) {
        this.regPS &= ~X86.PS.SF;
        if (this.resultLogic & (this.resultType & X86.RESULT.TYPE)) {
            this.regPS |= X86.PS.SF;
        }
        this.resultType &= ~X86.RESULT.SF;
    }
    return this.regPS & X86.PS.SF;
};

/**
 * getOF()
 *
 * Overflow was originally calculated as:
 *
 *      (resultParitySign ^ resultAuxOverflow ^ (resultParitySign >> 1)) & (resultSize >> 1)
 *
 * but as you can see, that calculation depends on the carry out of the 8/16/32-bit result in
 * resultParitySign, which we don't have access to for 32-bit results.  So we fall-back to the
 * following:
 *
 *      ((resultDst ^ resultArith) & (resultSrc ^ resultArith)) & resultType
 *
 * which you can verify from the following table of sign bits (where x1 is resultDst ^ resultArith,
 * and x2 is resultSrc ^ resultArith):
 *
 *      D   S   A   x1  x2  OF
 *      -   -   -   --  --  --
 *      0   0   0   0   0   0
 *      0   0   1   1   1   1 (adding two positive values yielded a negative value)
 *      0   1   0   0   1   0
 *      0   1   1   1   0   0
 *      1   0   0   1   0   0
 *      1   0   1   0   1   0
 *      1   1   0   1   1   1 (adding two negative values yielded a positive value)
 *      1   1   1   0   0   0
 *
 * @this {X86CPU}
 * @return {number} 0 or X86.PS.OF
 */
X86CPU.prototype.getOF = function()
{
    if (this.resultType & X86.RESULT.OF) {
        this.regPS &= ~X86.PS.OF;
        if (((this.resultDst ^ this.resultArith) & (this.resultSrc ^ this.resultArith)) & (this.resultType & X86.RESULT.TYPE)) {
            this.regPS |= X86.PS.OF;
        }
        this.resultType &= ~X86.RESULT.OF;
    }
    return this.regPS & X86.PS.OF;
};

/**
 * getTF()
 *
 * @this {X86CPU}
 * @return {number} 0 or X86.PS.TF
 */
X86CPU.prototype.getTF = function()
{
    return (this.regPS & X86.PS.TF);
};

/**
 * getIF()
 *
 * @this {X86CPU}
 * @return {number} 0 or X86.PS.IF
 */
X86CPU.prototype.getIF = function()
{
    return (this.regPS & X86.PS.IF);
};

/**
 * getDF()
 *
 * @this {X86CPU}
 * @return {number} 0 or X86.PS.DF
 */
X86CPU.prototype.getDF = function()
{
    return (this.regPS & X86.PS.DF);
};

/**
 * clearCF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearCF = function()
{
    this.resultType &= ~X86.RESULT.CF;
    this.regPS &= ~X86.PS.CF;
};

/**
 * clearPF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearPF = function()
{
    this.resultType &= ~X86.RESULT.PF;
    this.regPS &= ~X86.PS.PF;
};

/**
 * clearAF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearAF = function()
{
    this.resultType &= ~X86.RESULT.AF;
    this.regPS &= ~X86.PS.AF;
};

/**
 * clearZF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearZF = function()
{
    this.resultType &= ~X86.RESULT.ZF;
    this.regPS &= ~X86.PS.ZF;
};

/**
 * clearSF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearSF = function()
{
    this.resultType &= ~X86.RESULT.SF;
    this.regPS &= ~X86.PS.SF;
};

/**
 * clearIF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearIF = function()
{
    this.regPS &= ~X86.PS.IF;
};

/**
 * clearDF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearDF = function()
{
    this.regPS &= ~X86.PS.DF;
};

/**
 * clearOF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearOF = function()
{
    this.resultType &= ~X86.RESULT.OF;
    this.regPS &= ~X86.PS.OF;
};

/**
 * setCF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setCF = function()
{
    this.resultType &= ~X86.RESULT.CF;
    this.regPS |= X86.PS.CF;
};

/**
 * setPF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setPF = function()
{
    this.resultType &= ~X86.RESULT.PF;
    this.regPS |= X86.PS.PF;
};

/**
 * setAF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setAF = function()
{
    this.resultType &= ~X86.RESULT.AF;
    this.regPS |= X86.PS.AF;
};

/**
 * setZF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setZF = function()
{
    this.resultType &= ~X86.RESULT.ZF;
    this.regPS |= X86.PS.ZF;
};

/**
 * setSF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setSF = function()
{
    this.resultType &= ~X86.RESULT.SF;
    this.regPS |= X86.PS.SF;
};

/**
 * setIF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setIF = function()
{
    this.regPS |= X86.PS.IF;
};

/**
 * setDF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setDF = function()
{
    this.regPS |= X86.PS.DF;
};

/**
 * setOF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setOF = function()
{
    this.resultType &= ~X86.RESULT.OF;
    this.regPS |= X86.PS.OF;
};

/**
 * getPS()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getPS = function()
{
    return (this.regPS & ~X86.PS_CACHED) | (this.getCF() | this.getPF() | this.getAF() | this.getZF() | this.getSF() | this.getOF());
};

/**
 * setMSW(w)
 *
 * Factored out of x86op0f.js, since both opLMSW and opLOADALL are capable of setting a new MSW.
 * The caller is responsible for assessing the appropriate cycle cost.
 *
 * @this {X86CPU}
 * @param {number} w
 */
X86CPU.prototype.setMSW = function(w)
{
    /*
     * This instruction is always allowed to set MSW.PE, but it cannot clear MSW.PE once set;
     * therefore, we always OR the previous value of MSW.PE into the new value before loading.
     */
    w |= (this.regCR0 & X86.CR0.MSW.PE) | X86.CR0.MSW.ON;
    this.regCR0 = (this.regCR0 & ~X86.CR0.MSW.MASK) | (w & X86.CR0.MSW.MASK);
    /*
     * Since the 80286 cannot return to real-mode via this instruction, the only transition we
     * must worry about is to protected-mode.  And there's no harm calling setProtMode() if the
     * CPU is already in protected-mode; we could certainly optimize out the call in that case,
     * but the instruction isn't used frequently enough to warrant it.
     */
    if (this.regCR0 & X86.CR0.MSW.PE) this.setProtMode(true);
};

/**
 * setPS(regPS)
 *
 * @this {X86CPU}
 * @param {number} regPS
 * @param {number} [cpl]
 */
X86CPU.prototype.setPS = function(regPS, cpl)
{
    /*
     * OS/2 1.0 discriminates between an 80286 and an 80386 based on whether an IRET in real-mode that
     * pops 0xF000 into the flags is able to set *any* of flag bits 12-15: if it can, then OS/2 declares
     * the CPU an 80386.
     *
     * So, if the CPU is an 80286, we zero incoming bits 12-14 in real-mode (bit 15 is never allowed to
     * be modified, so there's no need to mask it).  And if the CPU is an 80386, we zero only bit 14 (PS.NT),
     * allowing the IOPL bits to change; however, that should not affect any real-mode operations, since
     * CPL will always be zero, making IOPL irrelevant.
     *
     * It's still an open question whether an 80386 should also clear the Nested Task (PS.NT) flag in
     * real-mode; if not, then initProcessor() should set PS_CLEAR_RM to zero.
     */
    if (!(this.regCR0 & X86.CR0.MSW.PE)) regPS &= ~this.PS_CLEAR_RM;

    /*
     * There are some cases (eg, an IRET returning to a less privileged code segment) where the CPL
     * we compare against should come from the outgoing code segment, so if the caller provided it, use it.
     */
    if (cpl === undefined) cpl = this.nCPL;

    /*
     * Since PS.IOPL and PS.IF are part of PS_DIRECT, we need to take care of any 80286-specific behaviors
     * before setting the PS_DIRECT bits from the incoming regPS bits.
     *
     * Specifically, PS.IOPL is unchanged if CPL > 0, and PS.IF is unchanged if CPL > IOPL.
     */
    if (!cpl) {
        this.nIOPL = (regPS & X86.PS.IOPL.MASK) >> X86.PS.IOPL.SHIFT;           // IOPL allowed to change
    } else {
        regPS = (regPS & ~X86.PS.IOPL.MASK) | (this.regPS & X86.PS.IOPL.MASK);  // IOPL not allowed to change
    }

    if (cpl > this.nIOPL) {
        regPS = (regPS & ~X86.PS.IF) | (this.regPS & X86.PS.IF);                // IF not allowed to change
    }

    this.resultType = X86.RESULT.BYTE;
    this.regPS = (this.regPS & ~(this.PS_DIRECT|X86.PS_CACHED)) | (regPS & (this.PS_DIRECT|X86.PS_CACHED)) | this.PS_SET;

    if (this.regPS & X86.PS.TF) {
        this.intFlags |= X86.INTFLAG.TRAP;
        this.opFlags |= X86.OPFLAG.NOINTR;
    }
};

/**
 * checkIOPM(port, nPorts)
 *
 * @this {X86CPU}
 * @param {number} port (0x0000 to 0xffff)
 * @param {number} nPorts (1 to 4)
 * @return {boolean} true if allowed, false if not
 */
X86CPU.prototype.checkIOPM = function(port, nPorts)
{
    var bitsPorts = 0;
    if (I386 && (this.regCR0 & X86.CR0.MSW.PE) && (this.nCPL > this.nIOPL || (this.regPS & X86.PS.VM)) && this.segTSS.addrIOPM) {
        var offIOPM = port >>> 3;
        var addrIOPM = this.segTSS.addrIOPM + offIOPM;
        bitsPorts = ((1 << nPorts) - 1) << (port & 0x7);
        while (bitsPorts && addrIOPM <= this.segTSS.addrIOPMLimit) {
            var bits = this.getByte(addrIOPM);
            if (bits & bitsPorts) break;
            bitsPorts >>>= 8;
            addrIOPM++;
        }
    }
    if (bitsPorts) {
        if (this.messageEnabled(Messages.PORT)) this.printMessage("checkIOPM(" + str.toHexWord(port) + "," + nPorts + "): trapped", true, true);
        X86.fnFault.call(this, X86.EXCEPTION.GP_FAULT, 0, false);
        return false;
    }
    return true;
};

/**
 * traceLog(prop, dst, src, flagsIn, flagsOut, resultLo, resultHi)
 *
 * @this {X86CPU}
 * @param {string} prop
 * @param {number} dst
 * @param {number} src
 * @param {number|null} flagsIn
 * @param {number|null} flagsOut
 * @param {number} resultLo
 * @param {number} [resultHi]
 */
X86CPU.prototype.traceLog = function(prop, dst, src, flagsIn, flagsOut, resultLo, resultHi)
{
    if (DEBUG && this.dbg) {
        this.dbg.traceLog(prop, dst, src, flagsIn, flagsOut, resultLo, resultHi);
    }
};

/**
 * setBinding(sHTMLType, sBinding, control)
 *
 * @this {X86CPU}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "AX")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
X86CPU.prototype.setBinding = function(sHTMLType, sBinding, control)
{
    var fBound = false;
    switch (sBinding) {
    case "EAX":
    case "EBX":
    case "ECX":
    case "EDX":
    case "ESP":
    case "EBP":
    case "ESI":
    case "EDI":
    case "EIP":
    case "AX":
    case "BX":
    case "CX":
    case "DX":
    case "SP":
    case "BP":
    case "SI":
    case "DI":
    case "IP":
    case "PC":      // deprecated as an alias for "IP" (still used by older XML files, like the one at http://tpoindex.github.io/crobots/)
    case "CS":
    case "DS":
    case "SS":
    case "ES":
    case "FS":
    case "GS":
    case "CR0":
    case "CR2":
    case "CR3":
    case "PS":      // this refers to "Processor Status", aka the 16-bit flags register (although DEBUG.COM refers to this as "PC", surprisingly)
    case "C":
    case "P":
    case "A":
    case "Z":
    case "S":
    case "T":
    case "I":
    case "D":
    case "V":
        this.bindings[sBinding] = control;
        this.cLiveRegs++;
        fBound = true;
        break;
    default:
        fBound = this.parent.setBinding.call(this, sHTMLType, sBinding, control);
        break;
    }
    return fBound;
};

/**
 * probeAddr(addr)
 *
 * Used by the Debugger to probe addresses without risk of triggering a page fault, and by internal
 * functions, like fnFaultMessage(), that also need to avoid triggering faults, since they're not part
 * of standard CPU operation.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @return {number|null} byte (8-bit) value at that address, or null if invalid
 */
X86CPU.prototype.probeAddr = function(addr)
{
    var block = this.aMemBlocks[(addr & this.nMemMask) >>> this.nBlockShift];
    if (block.type == Memory.TYPE.UNPAGED) {
        block = this.mapPageBlock(addr, false, true);
        if (!block) return null;
    }
    return block.readByteDirect(addr & this.nBlockLimit, addr);
};

/**
 * getByte(addr)
 *
 * Use bus.getByte() for physical addresses, and cpu.getByte() for linear addresses; the latter takes care
 * of paging, cycle counts, and BACKTRACK states, if any.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.getByte = function getByte(addr)
{
    if (BACKTRACK) this.backTrack.btiMemLo = this.bus.readBackTrack(addr);
    return this.aMemBlocks[(addr & this.nMemMask) >>> this.nBlockShift].readByte(addr & this.nBlockLimit, addr);
};

/**
 * getShort(addr)
 *
 * Use bus.getShort() for physical addresses, and cpu.getShort() for linear addresses; the latter takes care
 * of paging, cycle counts, and BACKTRACK states, if any.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.getShort = function getShort(addr)
{
    var off = addr & this.nBlockLimit;
    var iBlock = (addr & this.nMemMask) >>> this.nBlockShift;
    /*
     * On the 8088, it takes 4 cycles to read the additional byte REGARDLESS whether the address is odd or even.
     * TODO: For the 8086, the penalty is actually "(addr & 0x1) << 2" (4 additional cycles only when the address is odd).
     */
    this.nStepCycles -= this.cycleCounts.nWordCyclePenalty;

    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.bus.readBackTrack(addr);
        this.backTrack.btiMemHi = this.bus.readBackTrack(addr + 1);
    }
    if (off < this.nBlockLimit) {
        return this.aMemBlocks[iBlock].readShort(off, addr);
    }
    return this.aMemBlocks[iBlock].readByte(off, addr) | (this.aMemBlocks[(iBlock + 1) & this.nBlockMask].readByte(0, addr + 1) << 8);
};

/**
 * getLong(addr)
 *
 * Use bus.getLong() for physical addresses, and cpu.getLong() for linear addresses; the latter takes care
 * of paging, cycle counts, and BACKTRACK states, if any.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @return {number} long (32-bit) value at that address
 */
X86CPU.prototype.getLong = function getLong(addr)
{
    var off = addr & this.nBlockLimit;
    var iBlock = (addr & this.nMemMask) >>> this.nBlockShift;
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.bus.readBackTrack(addr);
        this.backTrack.btiMemHi = this.bus.readBackTrack(addr + 1);
    }
    if (off < this.nBlockLimit - 2) {
        return this.aMemBlocks[iBlock].readLong(off, addr);
    }
    var nShift = (off & 0x3) << 3;
    return (this.aMemBlocks[iBlock].readLong(off & ~0x3, addr) >>> nShift) | (this.aMemBlocks[(iBlock + 1) & this.nBlockMask].readLong(0, addr + 3) << (32 - nShift));
};

/**
 * setByte(addr, b)
 *
 * Use bus.setByte() for physical addresses, and cpu.setByte() for linear addresses; the latter takes care
 * of paging, cycle counts, and BACKTRACK states, if any.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @param {number} b is the byte (8-bit) value to write (which we truncate to 8 bits; required by opSTOSb)
 */
X86CPU.prototype.setByte = function setByte(addr, b)
{
    if (BACKTRACK) this.bus.writeBackTrack(addr, this.backTrack.btiMemLo);
    this.aMemBlocks[(addr & this.nMemMask) >>> this.nBlockShift].writeByte(addr & this.nBlockLimit, b & 0xff, addr);
};

/**
 * setShort(addr, w)
 *
 * Use bus.setShort() for physical addresses, and cpu.setShort() for linear addresses; the latter takes care
 * of paging, cycle counts, and BACKTRACK states, if any.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @param {number} w is the word (16-bit) value to write (which we truncate to 16 bits to be safe)
 */
X86CPU.prototype.setShort = function setShort(addr, w)
{
    var off = addr & this.nBlockLimit;
    var iBlock = (addr & this.nMemMask) >>> this.nBlockShift;
    /*
     * On the 8088, it takes 4 cycles to write the additional byte REGARDLESS whether the address is odd or even.
     * TODO: For the 8086, the penalty is actually "(addr & 0x1) << 2" (4 additional cycles only when the address is odd).
     */
    this.nStepCycles -= this.cycleCounts.nWordCyclePenalty;

    if (BACKTRACK) {
        this.bus.writeBackTrack(addr, this.backTrack.btiMemLo);
        this.bus.writeBackTrack(addr + 1, this.backTrack.btiMemHi);
    }
    if (off < this.nBlockLimit) {
        this.aMemBlocks[iBlock].writeShort(off, w & 0xffff, addr);
        return;
    }
    this.aMemBlocks[iBlock++].writeByte(off, w & 0xff, addr);
    this.aMemBlocks[iBlock & this.nBlockMask].writeByte(0, (w >> 8) & 0xff, addr + 1);
};

/**
 * setLong(addr, l)
 *
 * Use bus.setLong() for physical addresses, and cpu.setLong() for linear addresses; the latter takes care
 * of paging, cycle counts, and BACKTRACK states, if any.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @param {number} l is the long (32-bit) value to write
 */
X86CPU.prototype.setLong = function setLong(addr, l)
{
    var off = addr & this.nBlockLimit;
    var iBlock = (addr & this.nMemMask) >>> this.nBlockShift;
    this.nStepCycles -= this.cycleCounts.nWordCyclePenalty;

    if (BACKTRACK) {
        this.bus.writeBackTrack(addr, this.backTrack.btiMemLo);
        this.bus.writeBackTrack(addr + 1, this.backTrack.btiMemHi);
    }
    if (off < this.nBlockLimit - 2) {
        this.aMemBlocks[iBlock].writeLong(off, l, addr);
        return;
    }
    var lPrev, nShift = (off & 0x3) << 3;
    off &= ~0x3;
    lPrev = this.aMemBlocks[iBlock].readLong(off, addr);
    this.aMemBlocks[iBlock].writeLong(off, (lPrev & ~(-1 << nShift)) | (l << nShift), addr);
    iBlock = (iBlock + 1) & this.nBlockMask;
    addr += 3;
    lPrev = this.aMemBlocks[iBlock].readLong(0, addr);
    this.aMemBlocks[iBlock].writeLong(0, (lPrev & (-1 << nShift)) | (l >>> (32 - nShift)), addr);
};

/**
 * getEAByte(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.getEAByte = function(seg, off)
{
    this.segEA = seg;
    this.regEA = seg.checkRead(this.offEA = off, 1);
    if (this.opFlags & X86.OPFLAG.NOREAD) return 0;
    var b = this.getByte(this.regEA);
    if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiMemLo;
    return b;
};

/**
 * getEAByteData(off)
 *
 * @this {X86CPU}
 * @param {number} off is a segment-relative offset
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.getEAByteData = function(off)
{
    return this.getEAByte(this.segData, off & (I386? this.addrMask : 0xffff));
};

/**
 * getEAByteStack(off)
 *
 * @this {X86CPU}
 * @param {number} off is a segment-relative offset
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.getEAByteStack = function(off)
{
    return this.getEAByte(this.segStack, off & (I386? this.addrMask : 0xffff));
};

/**
 * getEAWord(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.getEAWord = function(seg, off)
{
    this.segEA = seg;
    this.regEA = seg.checkRead(this.offEA = off, (I386? this.dataSize : 2));
    if (this.opFlags & X86.OPFLAG.NOREAD) return 0;
    var w = this.getWord(this.regEA);
    if (BACKTRACK) {
        this.backTrack.btiEALo = this.backTrack.btiMemLo;
        this.backTrack.btiEAHi = this.backTrack.btiMemHi;
    }
    return w;
};

/**
 * getEAWordData(off)
 *
 * @this {X86CPU}
 * @param {number} off is a segment-relative offset
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.getEAWordData = function(off)
{
    return this.getEAWord(this.segData, off & (I386? this.addrMask : 0xffff));
};

/**
 * getEAWordStack(off)
 *
 * @this {X86CPU}
 * @param {number} off is a segment-relative offset
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.getEAWordStack = function(off)
{
    return this.getEAWord(this.segStack, off & (I386? this.addrMask : 0xffff));
};

/**
 * modEAByte(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.modEAByte = function(seg, off)
{
    this.segEA = seg;
    this.regEAWrite = this.regEA = seg.checkRead(this.offEA = off, 1);
    if (this.opFlags & X86.OPFLAG.NOREAD) return 0;
    var b = this.getByte(this.regEA);
    if (BACKTRACK) this.backTrack.btiEALo = this.backTrack.btiMemLo;
    return b;
};

/**
 * modEAByteData(off)
 *
 * @this {X86CPU}
 * @param {number} off is a segment-relative offset
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.modEAByteData = function(off)
{
    return this.modEAByte(this.segData, off & (I386? this.addrMask : 0xffff));
};

/**
 * modEAByteStack(off)
 *
 * @this {X86CPU}
 * @param {number} off is a segment-relative offset
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.modEAByteStack = function(off)
{
    return this.modEAByte(this.segStack, off & (I386? this.addrMask : 0xffff));
};

/**
 * modEAWord(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.modEAWord = function(seg, off)
{
    this.segEA = seg;
    this.regEAWrite = this.regEA = seg.checkRead(this.offEA = off, (I386? this.dataSize : 2));
    if (this.opFlags & X86.OPFLAG.NOREAD) return 0;
    var w = this.getWord(this.regEA);
    if (BACKTRACK) {
        this.backTrack.btiEALo = this.backTrack.btiMemLo;
        this.backTrack.btiEAHi = this.backTrack.btiMemHi;
    }
    return w;
};

/**
 * modEAWordData(off)
 *
 * @this {X86CPU}
 * @param {number} off is a segment-relative offset
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.modEAWordData = function(off)
{
    return this.modEAWord(this.segData, off & (I386? this.addrMask : 0xffff));
};

/**
 * modEAWordStack(off)
 *
 * @this {X86CPU}
 * @param {number} off is a segment-relative offset
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.modEAWordStack = function(off)
{
    return this.modEAWord(this.segStack, off & (I386? this.addrMask : 0xffff));
};

/**
 * setEAByte(b)
 *
 * @this {X86CPU}
 * @param {number} b is the byte (8-bit) value to write
 */
X86CPU.prototype.setEAByte = function(b)
{
    if (this.opFlags & X86.OPFLAG.NOWRITE) return;
    if (BACKTRACK) this.backTrack.btiMemLo = this.backTrack.btiEALo;
    this.setByte(this.segEA.checkWrite(this.offEA, 1), b);
};

/**
 * setEAWord(w)
 *
 * @this {X86CPU}
 * @param {number} w is the word (16-bit) value to write
 */
X86CPU.prototype.setEAWord = function(w)
{
    if (this.opFlags & X86.OPFLAG.NOWRITE) return;
    if (BACKTRACK) {
        this.backTrack.btiMemLo = this.backTrack.btiEALo;
        this.backTrack.btiMemHi = this.backTrack.btiEAHi;
    }
    if (!I386) {
        this.setShort(this.segEA.checkWrite(this.offEA, 2), w);
    } else {
        this.setWord(this.segEA.checkWrite(this.offEA, this.dataSize), w);
    }
};

/**
 * getSOByte(seg, off)
 *
 * This is like getEAByte(), but it does NOT update regEA.
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.getSOByte = function(seg, off)
 {
    return this.getByte(seg.checkRead(off, 1));
};

/**
 * getSOWord(seg, off)
 *
 * This is like getEAWord(), but it does NOT update regEA.
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.getSOWord = function(seg, off)
{
    if (!I386) {
        return this.getShort(seg.checkRead(off, 2));
    } else {
        return this.getWord(seg.checkRead(off, this.dataSize));
    }
};

/**
 * setSOByte(seg, off, b)
 *
 * This is like setEAByte(), but it does NOT update regEAWrite.
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @param {number} b is the byte (8-bit) value to write
 */
X86CPU.prototype.setSOByte = function(seg, off, b)
{
    this.setByte(seg.checkWrite(off, 1), b);
};

/**
 * setSOWord(seg, off, w)
 *
 * This is like setEAWord(), but it does NOT update regEAWrite.
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @param {number} w is the word (16-bit) value to write
 */
X86CPU.prototype.setSOWord = function(seg, off, w)
{
    if (!I386) {
        this.setShort(seg.checkWrite(off, 2), w);
    } else {
        this.setWord(seg.checkWrite(off, this.dataSize), w);
    }
};

/**
 * getBytePrefetch(addr)
 *
 * Return the next byte from the prefetch queue, prefetching it now if necessary.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.getBytePrefetch = function(addr)
{
    if (this.opFlags & X86.OPFLAG.NOREAD) return 0;
    var b;
    if (!this.cbPrefetchQueued) {
        if (MAXDEBUG) {
            this.printMessage("  getBytePrefetch[" + this.iPrefetchTail + "]: filling");
            this.assert(addr == this.addrPrefetchHead, "X86CPU.getBytePrefetch(" + str.toHex(addr) + "): invalid head address (" + str.toHex(this.addrPrefetchHead) + ")");
            this.assert(this.iPrefetchTail == this.iPrefetchHead, "X86CPU.getBytePrefetch(" + str.toHex(addr) + "): head (" + this.iPrefetchHead + ") does not match tail (" + this.iPrefetchTail + ")");
        }
        this.fillPrefetch(1);
        this.nBusCycles += 4;
        /*
         * This code effectively inlines this.fillPrefetch(1), but without queueing the byte, so it's an optimization
         * with side-effects we may not want, and in any case, while it seemed to improve Safari's performance slightly,
         * it did nothing for the oddball Chrome performance I'm seeing with PREFETCH enabled.
         *
         *      b = this.aMemBlocks[(addr & this.nMemMask) >>> this.nBlockShift].readByte(addr & this.nBlockLimit, addr);
         *      this.nBusCycles += 4;
         *      this.cbPrefetchValid = 0;
         *      this.addrPrefetchHead = (addr + 1) & this.nMemMask;
         *      return b;
         */
    }
    b = this.aPrefetch[this.iPrefetchTail] & 0xff;
    if (MAXDEBUG) {
        this.printMessage("  getBytePrefetch[" + this.iPrefetchTail + "]: " + str.toHex(addr) + ":" + str.toHexByte(b));
        this.assert(addr == (this.aPrefetch[this.iPrefetchTail] >> 8), "X86CPU.getBytePrefetch(" + str.toHex(addr) + "): invalid tail address (" + str.toHex(this.aPrefetch[this.iPrefetchTail] >> 8) + ")");
    }
    this.iPrefetchTail = (this.iPrefetchTail + 1) & X86CPU.PREFETCH.MASK;
    this.cbPrefetchQueued--;
    return b;
};

/**
 * getShortPrefetch(addr)
 *
 * Return the next short from the prefetch queue.  There are 3 cases to consider:
 *
 *  1) Both bytes have been prefetched; no bytes need be fetched from memory
 *  2) Only the low byte has been prefetched; the high byte must be fetched from memory
 *  3) Neither byte has been prefetched; both bytes must be fetched from memory
 *
 * However, since we want to mirror getBytePrefetch's behavior of fetching all bytes through
 * the prefetch queue, we're taking the easy way out and simply calling getBytePrefetch() twice.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @return {number} short (16-bit) value at that address
 */
X86CPU.prototype.getShortPrefetch = function(addr)
{
    return this.getBytePrefetch(addr) | (this.getBytePrefetch(addr + 1) << 8);
};

/**
 * getLongPrefetch(addr)
 *
 * Return the next long from the prefetch queue.  Similar to getShortPrefetch(), we take the
 * easy way out and call getShortPrefetch() twice.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @return {number} long (32-bit) value at that address
 */
X86CPU.prototype.getLongPrefetch = function(addr)
{
    return this.getShortPrefetch(addr) | (this.getShortPrefetch(addr + 2) << 16);
};

/**
 * getWordPrefetch(addr)
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address
 * @return {number} short (16-bit) or long (32-bit value as appropriate
 */
X86CPU.prototype.getWordPrefetch = function(addr)
{
    return (I386 && this.dataSize == 4? this.getLongPrefetch(addr) : this.getShortPrefetch(addr));
};

/**
 * fillPrefetch(n)
 *
 * Fill the prefetch queue with n instruction bytes.
 *
 * @this {X86CPU}
 * @param {number} n is the number of instruction bytes to fetch
 */
X86CPU.prototype.fillPrefetch = function(n)
{
    while (n-- > 0 && this.cbPrefetchQueued < X86CPU.PREFETCH.QUEUE) {
        var addr = this.addrPrefetchHead;
        var b = this.aMemBlocks[(addr & this.nMemMask) >>> this.nBlockShift].readByte(addr & this.nBlockLimit, addr);
        this.aPrefetch[this.iPrefetchHead] = b | (addr << 8);
        if (MAXDEBUG) this.printMessage("     fillPrefetch[" + this.iPrefetchHead + "]: " + str.toHex(addr) + ":" + str.toHexByte(b));
        this.addrPrefetchHead = (addr + 1) & this.nMemMask;
        this.iPrefetchHead = (this.iPrefetchHead + 1) & X86CPU.PREFETCH.MASK;
        this.cbPrefetchQueued++;
        /*
         * We could probably allow cbPrefetchValid to grow as large as X86CPU.PREFETCH.ARRAY-1, but I'm not
         * sure there's any advantage to that; certainly the tiny values we expect to see from advancePrefetch()
         * wouldn't justify that.
         */
        if (this.cbPrefetchValid < X86CPU.PREFETCH.QUEUE) this.cbPrefetchValid++;
    }
};

/**
 * flushPrefetch(addr)
 *
 * Empty the prefetch queue.
 *
 * @this {X86CPU}
 * @param {number} addr is a linear address of the current program counter (regLIP)
 */
X86CPU.prototype.flushPrefetch = function(addr)
{
    this.addrPrefetchHead = addr;
    this.iPrefetchTail = this.iPrefetchHead = this.cbPrefetchQueued = this.cbPrefetchValid = 0;
    if (MAXDEBUG && addr !== undefined) this.printMessage("    flushPrefetch[-]: " + str.toHex(addr));
};

/**
 * advancePrefetch(inc)
 *
 * Advance the prefetch queue tail.  This is used, for example, in cases where the IP is rewound
 * to the start of a repeated string instruction (ie, a string instruction with a REP and possibly
 * other prefixes).
 *
 * If a negative increment takes us beyond what's still valid in the prefetch queue, or if a positive
 * increment takes us beyond what's been queued so far, then we simply flush the queue.
 *
 * @this {X86CPU}
 * @param {number} inc (may be +/-)
 */
X86CPU.prototype.advancePrefetch = function(inc)
{
    if (inc < 0 && this.cbPrefetchQueued - inc <= this.cbPrefetchValid || inc > 0 && inc < this.cbPrefetchQueued) {
        this.iPrefetchTail = (this.iPrefetchTail + inc) & X86CPU.PREFETCH.MASK;
        this.cbPrefetchQueued -= inc;
    } else {
        this.flushPrefetch(this.regLIP);
        if (MAXDEBUG) this.printMessage("advancePrefetch(" + inc + "): flushed");
    }
};

/**
 * getIPByte()
 *
 * @this {X86CPU}
 * @return {number} byte at the current IP; IP advanced by 1
 */
X86CPU.prototype.getIPByte = function()
{
    var b = (PREFETCH? this.getBytePrefetch(this.regLIP) : this.getByte(this.regLIP));
    if (BACKTRACK) this.bus.updateBackTrackCode(this.regLIP, this.backTrack.btiMemLo);
    this.advanceIP(1);
    return b;
};

/**
 * getIPShort()
 *
 * @this {X86CPU}
 * @return {number} short at the current IP; IP advanced by 2
 */
X86CPU.prototype.getIPShort = function()
{
    var w = (PREFETCH? this.getShortPrefetch(this.regLIP) : this.getShort(this.regLIP));
    if (BACKTRACK) {
        this.bus.updateBackTrackCode(this.regLIP, this.backTrack.btiMemLo);
        this.bus.updateBackTrackCode(this.regLIP + 1, this.backTrack.btiMemHi);
    }
    this.advanceIP(2);
    return w;
};

/**
 * getIPLong()
 *
 * @this {X86CPU}
 * @return {number} long at the current IP; IP advanced by 4
 */
X86CPU.prototype.getIPLong = function()
{
    var l = (PREFETCH? this.getLongPrefetch(this.regLIP) : this.getLong(this.regLIP));
    if (BACKTRACK) {
        this.bus.updateBackTrackCode(this.regLIP, this.backTrack.btiMemLo);
        this.bus.updateBackTrackCode(this.regLIP + 1, this.backTrack.btiMemHi);
    }
    this.advanceIP(4);
    return l;
};

/**
 * getIPAddr()
 *
 * @this {X86CPU}
 * @return {number} word at the current IP; IP advanced by 2 or 4, depending on address size
 */
X86CPU.prototype.getIPAddr = function()
{
    /*
     * TODO: Add PREFETCH support to this function
     */
    var w = this.getAddr(this.regLIP);
    if (BACKTRACK) {
        this.bus.updateBackTrackCode(this.regLIP, this.backTrack.btiMemLo);
        this.bus.updateBackTrackCode(this.regLIP + 1, this.backTrack.btiMemHi);
    }
    this.advanceIP(this.addrSize);
    return w;
};

/**
 * getIPWord()
 *
 * @this {X86CPU}
 * @return {number} word at the current IP; IP advanced by 2 or 4, depending on operand size
 */
X86CPU.prototype.getIPWord = function()
{
    var w = (PREFETCH? this.getWordPrefetch(this.regLIP) : this.getWord(this.regLIP));
    if (BACKTRACK) {
        this.bus.updateBackTrackCode(this.regLIP, this.backTrack.btiMemLo);
        this.bus.updateBackTrackCode(this.regLIP + 1, this.backTrack.btiMemHi);
    }
    this.advanceIP(this.dataSize);
    return w;
};

/**
 * getIPDisp()
 *
 * @this {X86CPU}
 * @return {number} sign-extended value from the byte at the current IP; IP advanced by 1
 */
X86CPU.prototype.getIPDisp = function()
{
    var w = ((PREFETCH? this.getBytePrefetch(this.regLIP) : this.getByte(this.regLIP)) << 24) >> 24;
    if (BACKTRACK) this.bus.updateBackTrackCode(this.regLIP, this.backTrack.btiMemLo);
    this.advanceIP(1);
    return w;
};

/**
 * getSIBAddr(mod)
 *
 * @this {X86CPU}
 * @param {number} mod
 * @return {number}
 */
X86CPU.prototype.getSIBAddr = function(mod)
{
    var b = PREFETCH? this.getBytePrefetch(this.regLIP) : this.getByte(this.regLIP);
    if (BACKTRACK) this.bus.updateBackTrackCode(this.regLIP, this.backTrack.btiMemLo);
    this.advanceIP(1);
    return X86ModSIB.aOpModSIB[b].call(this, mod);
};

/**
 * popWord()
 *
 * @this {X86CPU}
 * @return {number} word popped from the current SP; SP increased by 2 or 4
 */
X86CPU.prototype.popWord = function()
{
    var w = this.getWord(this.regLSP);
    this.regLSP = (this.regLSP + (I386? this.dataSize : 2))|0;
    /*
     * Properly comparing regLSP to regLSPLimit would normally require coercing both to unsigned
     * (ie, floating-point) values.  But instead, we do a subtraction, (regLSPLimit - regLSP), and
     * if the result is negative, we need only be concerned if the signs of both numbers are the same
     * (ie, the sign of their XOR'ed union is positive).
     *
     * TODO: I'm combining the old 8088 address-wrap check with the new segment-limit check,
     * even though the correct time to do the latter is immediately BEFORE the fetch, not AFTER;
     * I'm working around this for now by applying a -1 fudge factor to the fault check below.
     */
    var off = ((this.regLSPLimit - this.regLSP)|0);
    if (off < 0 && (this.regLSPLimit ^ this.regLSP) >= 0) {
        /*
         * There's no such thing as an SS fault on the 8086/8088, and I'm assuming that, on newer
         * processors, when the stack segment limit is set to the maximum, it's OK for the stack to wrap.
         */
        if (this.model <= X86.MODEL_8088 || !this.segSS.fExpDown && this.segSS.limit == this.segSS.addrMask || this.segSS.fExpDown && !this.segSS.limit) {
            this.setSP((this.regLSP - this.segSS.base) & this.segSS.addrMask);
        } else if (off < -1) {          // fudge factor
            X86.fnFault.call(this, X86.EXCEPTION.SS_FAULT, 0);
        }
    }
    return w;
};

/**
 * pushWord(w)
 *
 * @this {X86CPU}
 * @param {number} w is the word (16-bit) value to push at current SP; SP decreased by 2 or 4
 */
X86CPU.prototype.pushWord = function(w)
{
    /*
     * This assertion is no longer valid, now that we've fixed opPUSH8() to use getIPDisp() instead of getIPByte(),
     * thus sign-extending the byte as appropriate.  And since sign-extension necessarily affects the entire 32-bit
     * value, this assertion could fail when dataMask is 16 bits.
     *
     *      this.assert((w & this.dataMask) == w);
     *
     * setWord() calls setShort() or setLong() as appropriate, and setShort() truncates incoming values, so the fact
     * that any incoming signed values will not be truncated to 16 bits should not be a concern.
     */
    this.regLSP = (this.regLSP - (I386? this.dataSize : 2))|0;
    /*
     * Properly comparing regLSP to regLSPLimitLow would normally require coercing both to unsigned
     * (ie, floating-point) values.  But instead, we do a subtraction, (regLSP - regLSPLimitLow), and
     * if the result is negative, we need only be concerned if the signs of both numbers are the same
     * (ie, the sign of their XOR'ed union is positive).
     */
    if (((this.regLSP - this.regLSPLimitLow)|0) < 0 && (this.regLSPLimitLow ^ this.regLSP) >= 0) {
        /*
         * There's no such thing as an SS fault on the 8086/8088, and I'm assuming that, on newer
         * processors, when the stack segment limit is set to the maximum, it's OK for the stack to wrap.
         */
        if (this.model <= X86.MODEL_8088 || !this.segSS.fExpDown && this.segSS.limit == this.segSS.addrMask || this.segSS.fExpDown && !this.segSS.limit) {
            this.setSP((this.regLSP - this.segSS.base) & this.segSS.addrMask);
        } else {
            X86.fnFault.call(this, X86.EXCEPTION.SS_FAULT, 0);
        }
    }
    this.setWord(this.regLSP, w);
};

/**
 * setDMA(fActive)
 *
 * This is called by the ChipSet component to update DMA status.
 *
 * @this {X86CPU}
 * @param {boolean} fActive is true to set INTFLAG.DMA, false to clear
 *
 X86CPU.prototype.setDMA = function(fActive)
 {
    if (this.chipset) {
        if (fActive) {
            this.intFlags |= X86.INTFLAG.DMA;
        } else {
            this.intFlags &= ~X86.INTFLAG.DMA;
        }
    }
};
 */

/**
 * checkINTR()
 *
 * This must only be called when intFlags (containing the simulated INTFLAG.INTR signal) is known to be set.
 * Note that it's perfectly possible that between the time updateINTR(true) was called and we request the
 * interrupt vector number below, the interrupt could have been cleared or masked, in which case getIRRVector()
 * will return -1 and we'll simply clear INTFLAG.INTR.
 *
 * intFlags has been overloaded with the INTFLAG.TRAP bit as well, since the acknowledgment of h/w interrupts
 * and the Trap flag are similar; they must both honor the NOINTR suppression flag, and stepCPU() shouldn't
 * have to check multiple variables when deciding whether to simulate an interrupt.
 *
 * This function also includes a check for the new async INTFLAG.DMA flag, which is triggered by a ChipSet call
 * to setDMA().  This DMA flag actually has nothing to do with interrupts; it's simply an expedient way to
 * piggy-back on the CPU's execution logic, to help drive async DMA requests.
 *
 * Originally, DMA requests (eg, FDC or HDC I/O operations) were all handled synchronously, since no actual
 * I/O was required to satisfy the request; from the CPU's perspective, this meant DMA operations were virtually
 * instantaneous.  However, with the introduction of remote disk connections, some actual I/O may now be required;
 * in practice, this means that the FIRST byte requested as part of a DMA operation may require a callback to
 * finish, while all remaining bytes will be retrieved during subsequent checkINTR() calls -- unless of course
 * additional remote I/O operations are required to complete the DMA operation.
 *
 * As a result, the CPU will run slightly slower while an async DMA request is in progress, but the slowdown
 * should be negligible.  One downside is that this slowdown will be in effect for the entire duration of the
 * I/O (ie, even while we're waiting for the remote I/O to finish), so the ChipSet component should avoid
 * calling setDMA() whenever possible.
 *
 * TODO: While comparing SYMDEB tracing in both PCjs and VMware, I noticed that after single-stepping ANY
 * segment-load instruction, SYMDEB would get control immediately after that instruction in VMware, whereas
 * I delay acknowledgment of the Trap flag until the *following* instruction, so in PCjs, SYMDEB doesn't get
 * control until the following instruction.  I think PCjs behavior is correct, at least for SS.
 *
 * ERRATA: Early revisions of the 8086/8088 failed to suppress hardware interrupts (and possibly also Trap
 * acknowledgements) after an SS load, but Intel corrected the problem at some point; however, I don't know when
 * that change was made or which IBM PC models may have been affected, if any.  TODO: More research required.
 *
 * WARNING: There is also a priority consideration here.  On the 8086/8088, hardware interrupts have higher
 * priority than Trap interrupts (which is why the code below is written the way it is).  A potentially
 * undesirable side-effect is that a hardware interrupt handler could end up being single-stepped if an
 * external interrupt occurs immediately after the Trap flag is set.  This is why some 8086 debuggers temporarily
 * mask all hardware interrupts during a single-step operation (although that doesn't help with NMIs generated
 * by a coprocessor).  As of the 80286, those priorities were inverted, giving the Trap interrupt higher priority
 * than external interrupts.
 *
 * TODO: Determine the priorities for the 80186.
 *
 * @this {X86CPU}
 * @return {boolean} true if h/w interrupt (or trap) has just been acknowledged, false if not
 */
X86CPU.prototype.checkINTR = function()
{
    // DEBUG: this.assert(this.intFlags);

    if (!(this.opFlags & X86.OPFLAG.NOINTR)) {
        /*
         * As discussed above, the 8086/8088 give hardware interrupts higher priority than the TRAP interrupt,
         * whereas the 80286 and up give TRAPs higher priority.
         */
        var iPriority = (this.model < X86.MODEL_80286? 0 : 1);
        for (var cPriorities = 0; cPriorities < 2; cPriorities++) {
            switch(iPriority) {
            case 0:
                if ((this.intFlags & X86.INTFLAG.INTR) && (this.regPS & X86.PS.IF)) {
                    var nIDT = this.chipset.getIRRVector();
                    if (nIDT >= -1) {
                        this.intFlags &= ~X86.INTFLAG.INTR;
                        if (nIDT >= 0) {
                            this.intFlags &= ~X86.INTFLAG.HALT;
                            X86.fnINT.call(this, nIDT, null, 11);
                            return true;
                        }
                    }
                }
                break;
            case 1:
                if ((this.intFlags & X86.INTFLAG.TRAP)) {
                    this.intFlags &= ~X86.INTFLAG.TRAP;
                    X86.fnINT.call(this, X86.EXCEPTION.TRAP, null, 11);
                    return true;
                }
                break;
            }
            iPriority = 1 - iPriority;
        }
    }
    if (this.intFlags & X86.INTFLAG.DMA) {
        if (!this.chipset.checkDMA()) {
            this.intFlags &= ~X86.INTFLAG.DMA;
        }
    }
    return false;
};

/**
 * updateINTR(fRaise)
 *
 * This is called by the ChipSet component whenever a h/w interrupt needs to be simulated.
 * This is how the PIC component simulates raising the INTFLAG.INTR signal.  We will honor the request
 * only if we have a reference back to the ChipSet component.  The CPU will then "respond" by calling
 * checkINTR() and request the corresponding interrupt vector from the ChipSet.
 *
 * @this {X86CPU}
 * @param {boolean} fRaise is true to raise INTFLAG.INTR, false to lower
 */
X86CPU.prototype.updateINTR = function(fRaise)
{
    if (this.chipset) {
        if (fRaise) {
            this.intFlags |= X86.INTFLAG.INTR;
        } else {
            this.intFlags &= ~X86.INTFLAG.INTR;
        }
    }
};

/**
 * delayINTR()
 *
 * This is called by the ChipSet component whenever the IMR register is being unmasked, to avoid
 * interrupts being simulated too quickly. This works around a problem in the ROM BIOS "KBD_RESET"
 * (F000:E688) function, which is called with interrupts enabled by the "TST8" (F000:E30D) code.
 *
 * "KBD_RESET" appears to be written with the assumption that CLI is in effect, because it issues an
 * STI immediately after unmasking the keyboard IRQ.  And normally, the STI would delay INTFLAG.INTR
 * long enough to allow AH to be set to 0. But if interrupts are already enabled, an interrupt could
 * theoretically occur before the STI.  And since AH isn't initialized until after the STI, such an
 * interrupt would be missed.
 *
 * I'm assuming this never happens in practice because the PIC isn't that fast.  But for us to
 * guarantee that, we need to provide this function to the ChipSet component.
 *
 * @this {X86CPU}
 */
X86CPU.prototype.delayINTR = function()
{
    this.opFlags |= X86.OPFLAG.NOINTR;
};

/**
 * updateReg(sReg, nValue)
 *
 * This function helps updateStatus() by massaging the register names and values according to
 * CPU type before passing the call to displayValue(); in the "old days", updateStatus() called
 * displayValue() directly (although then it was called displayReg()).
 *
 * @this {X86CPU}
 * @param {string} sReg
 * @param {number} nValue
 */
X86CPU.prototype.updateReg = function(sReg, nValue)
{
    var cch = 4;
    if (sReg.length == 1) {
        cch = 1;
        nValue = nValue? 1 : 0;
    }
    if (this.model < 80386) {
        if (sReg.length > 2) {
            sReg = sReg.substr(1, 2);
        }
    } else {
        if (sReg == "PS" || sReg.length > 2) {
            cch = 8;
        }
    }
    this.displayValue(sReg, nValue, cch);
};

/**
 * updateStatus()
 *
 * This provides periodic Control Panel updates (eg, a few times per second; see STATUS_UPDATES_PER_SECOND).
 * this is where we take care of any DOM updates (eg, register values) while the CPU is running.
 *
 * Any high-frequency updates should be performed in updateVideo(), which should avoid DOM updates, since updateVideo()
 * can be called up to 60 times per second (see VIDEO_UPDATES_PER_SECOND).
 *
 * @this {X86CPU}
 * @param {boolean} [fForce] (true will display registers even if the CPU is running and "live" registers are not enabled)
 */
X86CPU.prototype.updateStatus = function(fForce)
{
    if (this.cLiveRegs) {
        if (fForce || !this.aFlags.fRunning || this.aFlags.fDisplayLiveRegs) {
            this.updateReg("EAX", this.regEAX);
            this.updateReg("EBX", this.regEBX);
            this.updateReg("ECX", this.regECX);
            this.updateReg("EDX", this.regEDX);
            this.updateReg("ESP", this.getSP());
            this.updateReg("EBP", this.regEBP);
            this.updateReg("ESI", this.regESI);
            this.updateReg("EDI", this.regEDI);
            this.updateReg("CS", this.getCS());
            this.updateReg("DS", this.getDS());
            this.updateReg("SS", this.getSS());
            this.updateReg("ES", this.getES());
            this.updateReg("EIP", this.getIP());
            var regPS = this.getPS();
            this.updateReg("PS", regPS);
            this.updateReg("V", (regPS & X86.PS.OF));
            this.updateReg("D", (regPS & X86.PS.DF));
            this.updateReg("I", (regPS & X86.PS.IF));
            this.updateReg("T", (regPS & X86.PS.TF));
            this.updateReg("S", (regPS & X86.PS.SF));
            this.updateReg("Z", (regPS & X86.PS.ZF));
            this.updateReg("A", (regPS & X86.PS.AF));
            this.updateReg("P", (regPS & X86.PS.PF));
            this.updateReg("C", (regPS & X86.PS.CF));
            if (this.model == X86.MODEL_80386) {
                this.updateReg("FS", this.getFS());
                this.updateReg("GS", this.getGS());
                this.updateReg("CR0", this.regCR0);
                this.updateReg("CR2", this.regCR2);
                this.updateReg("CR3", this.regCR3);
            }
        }
    }

    var controlSpeed = this.bindings["speed"];
    if (controlSpeed) controlSpeed.textContent = this.getSpeedCurrent();

    this.parent.updateStatus.call(this, fForce);
};

/**
 * stepCPU(nMinCycles)
 *
 * NOTE: Single-stepping should not be confused with the Trap flag; single-stepping is a Debugger
 * operation that's completely independent of Trap status.  The CPU can go in and out of Trap mode,
 * in and out of h/w interrupt service routines (ISRs), etc, but from the Debugger's perspective,
 * they're all one continuous stream of instructions that can be stepped or run at will.  Moreover,
 * stepping vs. running should never change the behavior of the simulation.
 *
 * Similarly, the Debugger's execution breakpoints have no involvement with the x86 breakpoint instruction
 * (0xCC); the Debugger monitors changes to the regLIP register to implement its own execution breakpoints.
 *
 * As a result, the Debugger's complete independence means you can run other 8086/8088 debuggers
 * (eg, DEBUG) inside the simulation without interference; you can even "debug" them with the Debugger.
 *
 * @this {X86CPU}
 * @param {number} nMinCycles (0 implies a single-step, and therefore breakpoints should be ignored)
 * @return {number} of cycles executed; 0 indicates a pre-execution condition (ie, an execution breakpoint
 * was hit), -1 indicates a post-execution condition (eg, a read or write breakpoint was hit), and a positive
 * number indicates successful completion of that many cycles (which should always be >= nMinCycles).
 */
X86CPU.prototype.stepCPU = function(nMinCycles)
{
    /*
     * The Debugger uses fComplete to determine if the instruction completed (true) or was interrupted
     * by a breakpoint or some other exceptional condition (false).  NOTE: this does NOT include JavaScript
     * exceptions, which stepCPU() expects the caller to catch using its own exception handler.
     *
     * The CPU relies on the use of stopCPU() rather than fComplete, because the CPU never single-steps
     * (ie, nMinCycles is always some large number), whereas the Debugger does.  And conversely, when the
     * Debugger is single-stepping (even when performing multiple single-steps), fRunning is never set,
     * so stopCPU() would have no effect as far as the Debugger is concerned.
     */
    this.aFlags.fComplete = true;

    /*
     * fDebugCheck is true if we need to "check" every instruction with the Debugger.
     */
    var fDebugCheck = this.aFlags.fDebugCheck = (DEBUGGER && this.dbg && this.dbg.checksEnabled());

    /*
     * nDebugState is checked only when fDebugCheck is true, and its sole purpose is to tell the first call
     * to checkInstruction() that it can skip breakpoint checks, and that will be true ONLY when fStarting is
     * true OR nMinCycles is zero (the latter means the Debugger is single-stepping).
     *
     * Once we snap fStarting, we clear it, because technically, we've moved beyond "starting" and have
     * officially "started" now.
     */
    var nDebugState = (!nMinCycles)? -1 : (this.aFlags.fStarting? 0 : 1);
    this.aFlags.fStarting = false;

    /*
     * We move the minimum cycle count to nStepCycles (the number of cycles left to step), so that other
     * functions have the ability to force that number to zero (eg, stopCPU()), and thus we don't have to check
     * any other criteria to determine whether we should continue stepping or not.
     */
    this.nBurstCycles = this.nStepCycles = nMinCycles;

    /*
     * NOTE: Even though runCPU() calls updateAllTimers(), we need an additional call here if we're being
     * called from the Debugger, so that any single-stepping will update the timers as well.
     */
    if (this.chipset && !nMinCycles) this.chipset.updateAllTimers();

    /*
     * Let's also suppress h/w interrupts whenever the Debugger is single-stepping an instruction; I'm loathe
     * to allow Debugger interactions to affect the behavior of the virtual machine in ANY way, but I'm making
     * this small concession to avoid the occasional and sometimes unexpected Debugger command that ends up
     * stepping into a hardware interrupt service routine (ISR).
     *
     * Note that this is similar to the problem discussed in checkINTR() regarding the priority of external h/w
     * interrupts vs. Trap interrupts, but they require different solutions, because our Debugger operates
     * independently of the CPU.
     *
     * One exception I make here is when you've asked the Debugger to display PIC messages, the idea being that
     * if you're watching the PIC that closely, then you want to hardware interrupts to occur regardless.
     */
    if (!nMinCycles && !this.messageEnabled(Messages.PIC)) this.opFlags |= X86.OPFLAG.NOINTR;

    do {
        var opPrefixes = this.opFlags & X86.OPFLAG_PREFIXES;
        if (opPrefixes) {
            this.opPrefixes |= opPrefixes;
        } else {
            /*
             * opLIP is used, among other things, to help string instructions rewind to the first prefix
             * byte whenever the instruction needs to be repeated.  Repeating string instructions in this
             * manner (essentially restarting them) is a bit heavy-handed, but ultimately it's more compatible,
             * because it allows hardware interrupts (as well as Trap processing and Debugger single-stepping)
             * to occur at any point during the string operation, without any additional effort.
             *
             * NOTE: The way we restart string instructions actually fixes an 8086/8088 flaw, because string
             * instructions with multiple prefixes (eg, a REP and a segment override) would not be restarted
             * properly following a hardware interrupt.  The recommended workarounds were to either turn off
             * interrupts or to follow the string instruction with a LOOPNZ back to the first prefix byte.
             * To emulate the flawed behavior, turn on BUGS_8086.
             */
            this.opLIP = this.regLIP;
            this.segData = this.segDS;
            this.segStack = this.segSS;
            this.regEA = this.regEAWrite = X86.ADDR_INVALID;

            if (I386 && (this.opPrefixes & (X86.OPFLAG.ADDRSIZE | X86.OPFLAG.DATASIZE))) {
                this.resetSizes();
            }

            this.opPrefixes = this.opFlags & X86.OPFLAG.REPEAT;

            if (this.intFlags) {
                if (this.checkINTR()) {
                    if (!nMinCycles) {
                        this.assert(DEBUGGER);  // nMinCycles of zero should be generated ONLY by the Debugger
                        if (DEBUGGER) {
                            this.println("interrupt dispatched");
                            this.opFlags = 0;
                            break;
                        }
                    }
                }
                if (this.intFlags & X86.INTFLAG.HALT) {
                    /*
                     * As discussed in opHLT(), the CPU is never REALLY halted by a HLT instruction; instead,
                     * opHLT() sets X86.INTFLAG.HALT, signalling to us that we're free to end the current burst
                     * AND that we should not execute any more instructions until checkINTR() indicates a hardware
                     * interrupt has been requested.
                     *
                     * One downside to this approach is that it *might* appear to the careful observer that we
                     * executed a full complement of instructions during bursts where X86.INTFLAG.HALT was set,
                     * when in fact we did not.  However, the steady advance of the overall cycle count, and thus
                     * the steady series calls to stepCPU(), is needed to ensure that timer updates, video updates,
                     * etc, all continue to occur at the expected rates.
                     *
                     * If necessary, we can add another bookkeeping cycle counter (eg, one that keeps tracks of the
                     * number of cycles during which we did not actually execute any instructions).
                     */
                    this.nStepCycles = 0;
                    this.opFlags = 0;
                    break;
                }
            }
        }

        if (DEBUGGER && fDebugCheck) {
            if (this.dbg.checkInstruction(this.regLIP, nDebugState)) {
                this.stopCPU();
                break;
            }
            nDebugState = 1;
        }

        /*
         * SAMPLER:
         *
        if (SAMPLER) {
            if (++this.iSampleFreq >= this.nSampleFreq) {
                this.iSampleFreq = 0;
                if (this.iSampleSkip < this.nSampleSkip) {
                    this.iSampleSkip++;
                } else {
                    if (this.iSampleNext == this.nSamples) {
                        this.println("sample buffer full");
                        this.stopCPU();
                        break;
                    }
                    var t = this.regLIP + this.getCycles();
                    var n = this.aSamples[this.iSampleNext];
                    if (n !== -1) {
                        if (n !== t) {
                            this.println("sample deviation at index " + this.iSampleNext + ": current LIP=" + str.toHex(this.regLIP));
                            this.stopCPU();
                            break;
                        }
                    } else {
                        this.aSamples[this.iSampleNext] = t;
                    }
                    this.iSampleNext++;
                }
            }
        }
         */

        this.opFlags = 0;

        /*
         * DEBUG || PREFETCH:
         *
        if (DEBUG || PREFETCH) {
            this.nBusCycles = 0;
            this.nSnapCycles = this.nStepCycles;
        }
         */

        this.aOps[this.getIPByte()].call(this);

        /*
         * DEBUG || PREFETCH:
         *
        if (PREFETCH) {
            var nSpareCycles = (this.nSnapCycles - this.nStepCycles) - this.nBusCycles;
            if (nSpareCycles >= 4) {
                this.fillPrefetch(nSpareCycles >> 2);   // for every 4 spare cycles, fetch 1 instruction byte
            }
        }

        if (DEBUG) {
            //
            // Make sure that every instruction is assessing a cycle cost, and that the cost is a net positive.
            //
            if (this.aFlags.fComplete && this.nStepCycles >= this.nSnapCycles && !(this.opFlags & X86.OPFLAG_PREFIXES)) {
                this.println("cycle miscount: " + (this.nSnapCycles - this.nStepCycles));
                this.setIP(this.opLIP - this.segCS.base);
                this.stopCPU();
                break;
            }
        }
         */

    } while (this.nStepCycles > 0);

    return (this.aFlags.fComplete? this.nBurstCycles - this.nStepCycles : (this.aFlags.fComplete === undefined? 0 : -1));
};

/**
 * X86CPU.init()
 *
 * This function operates on every HTML element of class "cpu", extracting the
 * JSON-encoded parameters for the X86CPU constructor from the element's "data-value"
 * attribute, invoking the constructor (which in turn invokes the CPU constructor)
 * to create a X86CPU component, and then binding any associated HTML controls to the
 * new component.
 */
X86CPU.init = function()
{
    var aeCPUs = Component.getElementsByClass(window.document, PCJSCLASS, "cpu");
    for (var iCPU = 0; iCPU < aeCPUs.length; iCPU++) {
        var eCPU = aeCPUs[iCPU];
        var parmsCPU = Component.getComponentParms(eCPU);
        var cpu = new X86CPU(parmsCPU);
        Component.bindComponentControls(cpu, eCPU, PCJSCLASS);
    }
};

/*
 * Initialize every CPU module on the page
 */
web.onInit(X86CPU.init);

if (typeof module !== 'undefined') module.exports = X86CPU;
