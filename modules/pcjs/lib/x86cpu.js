/**
 * @fileoverview Implements PCjs 8086/8088 CPU logic.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Sep-05
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

if (typeof module !== 'undefined') {
    var str         = require("../../shared/lib/strlib");
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var Messages    = require("./messages");
    var Bus         = require("./bus");
    var State       = require("./state");
    var CPU         = require("./cpu");
    var X86         = require("./x86");
    var X86Seg      = require("./x86seg");
    var X86Grps     = require("./x86grps");
    var X86Help     = require("./x86help");
    var X86Mods     = require("./x86mods");
    var X86OpXX     = require("./x86opxx");
    var X86Op0F     = require("./x86op0f");
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
 * into a single "Chipset" component, to keep the number of components we juggle to a minimum.
 *
 * All that being said, this does not change the overall goal: to produce as accurate a simulation as
 * possible, within the limits of what JavaScript allows and how precisely/predictably it behaves.
 *
 * @constructor
 * @extends CPU
 * @param {Object} parmsCPU
 */
function X86CPU(parmsCPU) {

    this.model = parmsCPU['model'] || X86.MODEL_8088;

    var nCyclesDefault = 0;
    switch(this.model) {
    default:
    case X86.MODEL_8088:
        nCyclesDefault = 4772727;
        break;
    case X86.MODEL_80286:
        nCyclesDefault = 6000000;
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
     * The registered function is called with the physical address (EIP) following the software interrupt;
     * if any function returns false, the software interrupt will be skipped (presumed to be emulated),
     * and no further notification functions will be called.
     *
     * NOTE: Registered functions are called only for "INT N" instructions -- NOT "INT 3" or "INTO" or the
     * "INT 0x00" generated by a divide-by-zero or any other kind of interrupt (nor any interrupt simulated
     * with "PUSHF/CALLF").
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
    this.nBurstCycles = 0;
    this.aFlags.fComplete = this.aFlags.fDebugCheck = false;

    /*
     * We're just declaring aMemBlocks and associated Bus parameters here; they'll be initialized by initMemory()
     * when the Bus is initialized.
     */
    this.aMemBlocks = [];
    this.addrMemMask = this.blockShift = this.blockLimit = this.blockMask = 0;

    /*
     * Establish all the default get/set functions for accessing memory; see this function for details.
     */
    this.setMemoryEnabled();

    if (SAMPLER) {
        /*
         * For now, we're just going to sample EIP values (well, EIP + cycle count)
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

Component.subclass(CPU, X86CPU);

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

X86CPU.PREFETCH = {};
X86CPU.PREFETCH.QUEUE  = 4;
X86CPU.PREFETCH.ARRAY  = 8;        // smallest power-of-two > PREFETCH.QUEUE
X86CPU.PREFETCH.MASK   = 0x7;      // (X86CPU.PREFETCH.ARRAY - 1)

/**
 * initMemory(aMemBlocks, addrLimit, blockShift, blockLimit, blockMask)
 *
 * Notification from Bus.initMemory(), giving us direct access to the entire memory
 * space (aMemBlocks).
 *
 * We also initialize an instruction byte prefetch queue, aPrefetch, which is an
 * N-element array whose slots look like:
 *
 *      0:  [tag, b]    <-- iPrefetchTail
 *      1:  [tag, b]
 *      2:  [ -1, 0]    <-- iPrefetchHead  (eg, when cbPrefetchQueued == 2)
 *      ...
 *      7:  [ -1, 0]
 *
 * where tag is the physical address of the byte that's been prefetched, and b is the
 * value of the byte.  N is currently 8 (PREFETCH.ARRAY), but it can be any power-of-two
 * that is equal to or greater than (PREFETCH.QUEUE), the effective size of the prefetch
 * queue (6 on an 8086, 4 on an 8088; currently hard-coded to the latter). All slots
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
 * regEIP has been set, so flushPrefetch() expects to receive that address.
 *
 * If the prefetch queue does not contain any (or enough) bytes to satisfy a getBytePrefetch()
 * or getWordPrefetch() request, we force the queue to be filled with the necessary number
 * of bytes first.
 *
 * @this {X86CPU}
 * @param {Array} aMemBlocks
 * @param {number} addrLimit
 * @param {number} blockShift
 * @param {number} blockLimit
 * @param {number} blockMask
 */
X86CPU.prototype.initMemory = function(aMemBlocks, addrLimit, blockShift, blockLimit, blockMask)
{
    this.aMemBlocks = aMemBlocks;
    this.addrMemMask = addrLimit;
    this.blockShift = blockShift;
    this.blockLimit = blockLimit;
    this.blockMask = blockMask;
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
 * setAddressMask(addrMask)
 *
 * Notification from Bus.setA20(), called whenever the A20 line changes.
 *
 * @this {X86CPU}
 * @param {number} addrMask
 */
X86CPU.prototype.setAddressMask = function(addrMask)
{
    this.addrMemMask = addrMask;
};

/**
 * initProcessor()
 *
 * This isolates 80186/80188/80286 support, so that it can be selectively enabled/tested.
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
    this.PS_SET = X86.PS.SET;
    this.PS_DIRECT = X86.PS.DIRECT;

    this.OPFLAG_NOINTR8086 = X86.OPFLAG.NOINTR;
    this.nShiftCountMask = 0xff;            // on an 8086/8088, all shift counts are used as-is

    this.CYCLES = (this.model >= X86.MODEL_80286? X86CPU.CYCLES_80286 : X86CPU.CYCLES_8088);

    this.aOps     = X86OpXX.aOps.slice();   // make a copy of aOps and others before modifying them
    this.aOpGrp4b = X86Grps.aOpGrp4b.slice();
    this.aOpGrp4w = X86Grps.aOpGrp4w.slice();
    this.aOpGrp6  = X86Op0F.aOpGrp6Real;    // setProtMode() will ensure that aOpGrp6 is switched

    if (this.model >= X86.MODEL_80186) {
        /*
         * TODO: I don't go out of my way to make 80186/80188 cycle times accurate, since no IBM PC models used
         * those processors; beyond this point, my real priority is the 80286.  But we may revisit the 80186 someday;
         * instruction handlers that contain "hard-coded" 80286 cycle times include: opINSb, opINSw, opOUTSb,
         * opOUTSw, opENTER, and opLEAVE.
         */
        this.nShiftCountMask = 0x1f;        // on newer processors, all shift counts are MOD 32
        this.aOps[0x0F]                 = X86Help.opHelpInvalid;
        this.aOps[X86.OPCODE.PUSHA]     = X86OpXX.opPUSHA;
        this.aOps[X86.OPCODE.POPA]      = X86OpXX.opPOPA;
        this.aOps[X86.OPCODE.BOUND]     = X86OpXX.opBOUND;
        this.aOps[0x63]                 = X86Help.opHelpInvalid;
        this.aOps[0x64]                 = X86Help.opHelpInvalid;
        this.aOps[0x65]                 = X86Help.opHelpInvalid;
        this.aOps[0x66]                 = X86Help.opHelpInvalid;
        this.aOps[0x67]                 = X86Help.opHelpInvalid;
        this.aOps[X86.OPCODE.PUSH16]    = X86OpXX.opPUSH16;
        this.aOps[X86.OPCODE.IMUL16]    = X86OpXX.opIMUL16;
        this.aOps[X86.OPCODE.PUSH8]     = X86OpXX.opPUSH8;
        this.aOps[X86.OPCODE.IMUL8]     = X86OpXX.opIMUL8;
        this.aOps[X86.OPCODE.INSB]      = X86OpXX.opINSb;
        this.aOps[X86.OPCODE.INSW]      = X86OpXX.opINSw;
        this.aOps[X86.OPCODE.OUTSB]     = X86OpXX.opOUTSb;
        this.aOps[X86.OPCODE.OUTSW]     = X86OpXX.opOUTSw;
        this.aOps[0xC0]                 = X86OpXX.opGrp2ab;
        this.aOps[0xC1]                 = X86OpXX.opGrp2aw;
        this.aOps[X86.OPCODE.ENTER]     = X86OpXX.opENTER;
        this.aOps[X86.OPCODE.LEAVE]     = X86OpXX.opLEAVE;
        this.aOps[0xF1]                 = X86OpXX.opINT1;
        this.aOpGrp4b[0x07]             = X86Grps.opGrpInvalid;
        this.aOpGrp4w[0x07]             = X86Grps.opGrpInvalid;

        if (this.model >= X86.MODEL_80286) {

            this.PS_SET = X86.PS.BIT1;      // on the 80286, only BIT1 of Processor Status (flags) is always set
            this.PS_DIRECT |= X86.PS.IOPL.MASK | X86.PS.NT;

            this.OPFLAG_NOINTR8086 = 0;     // used with instructions that should *not* set NOINTR on an 80286 (eg, non-SS segment loads)

            this.aOps[0x0F]             = X86OpXX.op0F;
            this.aOps[X86.OPCODE.ARPL]  = X86OpXX.opARPL;
            this.aOps[X86.OPCODE.PUSHSP]= X86OpXX.opPUSHSP;
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

    if (SAMPLER) {
        this.iSampleNext = 0;
        this.iSampleFreq = 0;
        this.iSampleSkip = 0;
    }
};

/**
 * resetRegs()
 *
 * According to "The 8086 Book", p.7-5, a RESET signal initializes the following registers:
 *
 *      PS = 0x0000 (which has the important side-effect of disabling interrupts and traps)
 *      IP = 0x0000
 *      CS = 0xFFFF
 *      DS/ES/SS = 0x0000
 *
 * It is silent as to whether the remaining registers are initialized to any particular values.
 *
 * According to the "80286 and 80287 Programmer's Reference Manual", these 80286 registers are reset:
 *
 *      PS  = 0x0002
 *      MSW = 0xFFF0
 *      IP  = 0xFFF0
 *      CS Selector =   0xF000  DS/ES/SS Selector =   0x0000
 *      CS Base     = 0xFF0000  DS/ES/SS Base     = 0x000000    IDT Base  = 0x000000
 *      CS Limit    =   0xFFFF  DS/ES/SS Limit    =   0xFFFF    IDT Limit =   0x03FF
 *
 * We define some additional "registers", such as regEIP. which mirrors the physical address corresponding
 * to CS:IP (ie, the address of the next opcode).  This means that whenever segCS or regIP are explicitly
 * modified, regEIP must be updated as well.  So, when setting segCS or regIP, you should always use setCSIP(),
 * which takes both an offset and a segment, or setIP(), whichever is appropriate; in unusual cases where only
 * segCS is changing (eg, undocumented 8086 opcodes), use setCS().
 *
 * The other segment registers (DS, SS and ES) have similar setters (for segDS, segSS and segES), but those
 * functions do not mirror any special segment:offset values in the same way that regEIP mirrors CS:IP.
 *
 * @this {X86CPU}
 */
X86CPU.prototype.resetRegs = function()
{
    this.regAX = 0;
    this.regBX = 0;
    this.regCX = 0;
    this.regDX = 0;
    this.regSP = 0;
    this.regBP = 0;
    this.regSI = 0;
    this.regDI = 0;

    /*
     * NOTE: Even though the MSW and IDTR are 80286-specific, we initialize them for ALL CPUs, so that
     * functions like X86Help.opHelpINT() can use the same code for both.  The 8086/8088 have no direct way
     * of accessing or changing them, so this internal change should be perfectly safe for those processors.
     */
    this.regMSW = X86.MSW.SET;
    this.addrIDT = 0; this.addrIDTLimit = 0x03FF;
    this.nIOPL = 0;                                     // this should be set before the first setPS() call

    /*
     * This is set by opHelpFault() and reset (to -1) by resetRegs() and opIRET(); its initial purpose is to
     * "help" opHelpFault() determine when a nested fault should be converted into either a double-fault
     * (DF_FAULT) or a triple-fault (ie, a processor reset).
     */
    this.nFault = -1;

    /*
     * Segment registers used to be defined as separate variables (eg, regCS and regCS0 stored the
     * segment number and base physical address, respectively), but all segment registers are now defined
     * as X86Seg objects.
     */
    this.segCS   = new X86Seg(this, X86Seg.ID.CODE,  "CS");
    this.segDS   = new X86Seg(this, X86Seg.ID.DATA,  "DS");
    this.segES   = new X86Seg(this, X86Seg.ID.DATA,  "ES");
    this.segSS   = new X86Seg(this, X86Seg.ID.STACK, "SS");
    this.segNULL = new X86Seg(this, X86Seg.ID.NULL,  "NULL");
    this.setCSIP(0, 0xFFFF);                            // this should be called before the first setPS() call

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
     * address and record that instead.
     *
     * In addition to different CS:IP reset values, the CS base address must be set to the top of the 16Mb
     * address space rather than the top of the first 1Mb (which is why the MODEL_5170 ROM must be addressable
     * at both 0x0F0000 and 0xFF0000; see the ROM component's "alias" parameter).
     */
    if (this.model >= X86.MODEL_80286) {
        /*
         * TODO: Verify what the 80286 actually sets addrGDT and addrGDTLimit to on reset (or if it leaves them alone).
         */
        this.addrGDT = 0; this.addrGDTLimit = 0xFFFF;                   // GDTR
        this.segLDT = new X86Seg(this, X86Seg.ID.LDT,   "LDT", true);   // LDTR
        this.segTSS = new X86Seg(this, X86Seg.ID.TSS,   "TSS", true);   // TR
        this.segVER = new X86Seg(this, X86Seg.ID.OTHER, "VER", true);   // a scratch segment register for VERR and VERW instructions
        this.setCSIP(0xFFF0, 0xF000);                   // in real-mode, 0xF000 defaults the CS base address to 0x0F0000
        this.segCS.setBase(0xFF0000);                   // which is why we must manually adjust the CS base address to 0xFF0000
    }

    /*
     * This resets the Processor Status flags (regPS), along with all the internal "result registers";
     * we've taken care to ensure that both segCS.cpl and nIOPL are initialized before this first setPS() call.
     */
    this.setPS(0);

    /*
     * Now that all the segment registers have been created, it's safe to set the current addressing mode.
     */
    this.setProtMode();

    /*
     * intFlags contains some internal "flags" that we use to indicate whether a hardware interrupt (INTFLAG.INTR) or
     * Trap software interrupt (INTR.TRAP) has been requested, as well as when we're in a "HLT" state (INTFLAG.HALT)
     * that requires us to wait for a hardware interrupt (INTFLAG.INTR) before continuing execution.
     *
     * intFlags must be cleared only by checkINTR(), whereas opFlags must be cleared prior to every CPU operation.
     */
    this.intFlags = X86.INTFLAG.NONE;

    /*
     * The following are internal "registers" that are used to capture intermediate values inside selected helper
     * functions and use them if they've been modified (or are known to always change); for example, the MUL and DIV
     * instructions perform calculations that must be propagated to specific registers (eg, AX and/or DX), which
     * the ModRM decoder functions don't know about.  We initialize them here mainly for documentation purposes.
     */
    this.regMD16 = this.regMD32 = -1;

    /*
     * Another internal "register" we occasionally need is an interim copy of bModRM, set inside selected opcode
     * handlers so that the helper function can have access to the instruction's bModRM without resorting to a closure
     * (which, in Chrome's V8, for example, seems to cause constant recompilation).
     */
    this.bModRM = 0;

    /*
     * The next few initializations mirror what we must do prior to each instruction (ie, inside the stepCPU() function);
     * note that opPrefixes, along with segData and segStack, are reset only after we've executed a non-prefix instruction.
     */
    this.regEA = this.regEAWrite = X86.ADDR_INVALID;
    this.segData = this.segDS;
    this.segStack = this.segSS;
    this.opFlags = this.opPrefixes = 0;
};

/**
 * getChecksum()
 *
 * @this {X86CPU}
 * @return {number} a 32-bit summation of key elements of the current CPU state (used by the CPU checksum code)
 */
X86CPU.prototype.getChecksum = function()
{
    var sum = (this.regAX + this.regBX + this.regCX + this.regDX + this.regSP + this.regBP + this.regSI + this.regDI) | 0;
    sum = (sum + this.regIP + this.segCS.sel + this.segDS.sel + this.segSS.sel + this.segES.sel + this.getPS()) | 0;
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
 * @param {function(number)} fn is called with the EIP value following the software interrupt
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
            if (!aNotify[i][1].call(aNotify[i][0], this.regEIP)) {
                return false;
            }
        }
    }
    /*
     * The enabling of MESSAGE_INT messages is one of the criteria that's also included in the Debugger's
     * checksEnabled() function, and therefore in fDebugCheck, so for maximum speed, we check fDebugCheck first.
     */
    if (DEBUGGER && this.aFlags.fDebugCheck) {
        if (this.messageEnabled(Messages.INT) && this.dbg.messageInt(nInt, this.regEIP)) {
            this.addIntReturn(this.regEIP, function(cpu, nCycles) {
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
 * @param {number} addr is a physical (non-segmented) address
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
 * We check for possible "INT n" software interrupt returns in the cases of "IRET" (opHelpIRET), "RETF 2"
 * (opHelpRETF) and "JMPF [DWORD]" (opGrpJMPFdw).
 *
 * "JMPF [DWORD]" is an unfortunate choice that newer versions of DOS (as of at least 3.20, and probably
 * earlier) employed in their INT 0x13 hooks; I would have preferred not making this call for that opcode.
 *
 * It is expected (though not required) that callers will check cIntReturn and avoid calling this function
 * if the count is zero, for maximum performance.
 *
 * @this {X86CPU}
 * @param {number} addr is a physical (non-segmented) address
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
 * setProtMode(fProt)
 *
 * Update any opcode handlers that operate significantly differently in real-mode vs. protected-mode, and
 * notify all the segment registers about the mode change as well -- but only those that are "bi-modal"; internal
 * segment registers like segLDT and segTSS do not need to be notified, because they cannot be accessed in real-mode
 * (ie, LLDT, LTR, SLDT, STR are invalid instructions in real-mode, and are among the opcode handlers that we
 * update here).
 *
 * @this {X86CPU}
 * @param {boolean} [fProt] (use the current MSW PE bit if not specified)
 */
X86CPU.prototype.setProtMode = function(fProt)
{
    if (fProt === undefined) {
        fProt = !!(this.regMSW & X86.MSW.PE);
    }
    if (!fProt) {
        this.messagePrint("returning to real-mode");
    }
    this.aOpGrp6 = (fProt? X86Op0F.aOpGrp6Prot : X86Op0F.aOpGrp6Real);
    this.segCS.updateMode(fProt);
    this.segDS.updateMode(fProt);
    this.segSS.updateMode(fProt);
    this.segES.updateMode(fProt);
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
        return [this.regMSW, this.addrGDT, this.addrGDTLimit, this.addrIDT, this.addrIDTLimit, this.segLDT.save(), this.segTSS.save(), this.nIOPL];
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
        this.regMSW = a[0];
        this.addrGDT = a[1];
        this.addrGDTLimit = a[2];
        this.addrIDT = a[3];
        this.addrIDTLimit = a[4];
        this.segLDT.restore(a[5]);
        this.segTSS.restore(a[6]);
        this.nIOPL = a[7];
        this.setProtMode();
    }
};

/**
 * save()
 *
 * This implements save support for the X86 component.
 *
 * UPDATES: The current speed multiplier from getSpeed() is now saved in data group #3, so that your speed is preserved.
 *
 * @this {X86CPU}
 * @return {Object}
 */
X86CPU.prototype.save = function()
{
    var state = new State(this);
    state.set(0, [this.regAX, this.regBX, this.regCX, this.regDX, this.regSP, this.regBP, this.regSI, this.regDI, this.nIOPL]);
    state.set(1, [this.regIP, this.segCS.save(), this.segDS.save(), this.segSS.save(), this.segES.save(), this.saveProtMode(), this.getPS()]);
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
    var a;
    a = data[0];
    this.regAX = a[0];
    this.regBX = a[1];
    this.regCX = a[2];
    this.regDX = a[3];
    this.regSP = a[4];
    this.regBP = a[5];
    this.regSI = a[6];
    this.regDI = a[7];
    this.nIOPL = a[8] || 0;
    a = data[1];
    this.segCS.restore(a[1]);
    this.segDS.restore(a[2]);
    this.segSS.restore(a[3]);
    this.segES.restore(a[4]);
    this.restoreProtMode(a[5]);
    this.setPS(a[6]);
    this.setIP(a[0]);
    a = data[2];
    this.segData = this.getSeg(a[0]);
    this.segStack = this.getSeg(a[1]);
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
 * setMemoryEnabled()
 *
 * Set the default EA memory access functions (enabled vs. disabled).  When EAFUNCS is true, assorted
 * CPU opcode functions override the default functions whenever a CPU operation needs to temporarily disable the
 * "get" of a source operand (or the "set" of a destination operand, as in the case of a CMP instruction).
 *
 * However, it is ALSO every CPU opcode function's responsibility to restore those default access functions
 * back to their normal (eg, enabled) values below, so that stepCPU() doesn't have to do this after every
 * instruction (although in DEBUG builds, stepCPU() will call verifyMemoryEnabled() to assert that's been done).
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setMemoryEnabled = function()
{
    this.getEAByte = this.getEAByteEnabled;
    this.getEAWord = this.getEAWordEnabled;
    this.modEAByte = this.modEAByteEnabled;
    this.modEAWord = this.modEAWordEnabled;
    this.setEAByte = this.setEAByteEnabled;
    this.setEAWord = this.setEAWordEnabled;
};

/**
 * verifyMemoryEnabled()
 *
 * Used by stepCPU() in DEBUG builds to confirm that all CPU opcode functions have re-enabled memory access.
 *
 * @this {X86CPU}
 */
X86CPU.prototype.verifyMemoryEnabled = function()
{
    this.assert(!(this.regAX & 0xffff0000) && !(this.regBX & 0xffff0000) && !(this.regCX & 0xffff0000) && !(this.regDX & 0xffff0000));
    this.assert(!(this.regSI & 0xffff0000) && !(this.regDI & 0xffff0000) && !(this.regBP & 0xffff0000) && !(this.regSP & 0xffff0000));
    this.assert((this.getEAByte == this.getEAByteEnabled && this.getEAWord == this.getEAWordEnabled && this.modEAByte == this.modEAByteEnabled && this.modEAWord == this.modEAWordEnabled && this.setEAByte == this.setEAByteEnabled && this.setEAWord == this.setEAWordEnabled), "verifyMemoryEnabled() failed");
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
         * HACK: We return a fake segment register object in which only the base physical address is valid,
         * because that's all the caller provided (ie, we must be restoring from an older state).
         */
        this.assert(typeof sName == "number");
        return [0, sName, 0, 0, ""];
    }
};

/**
 * setCS(sel)
 *
 * NOTE: This is used ONLY by those few undocumented 8086/8088/80186/80188 instructions that MOV or POP a value
 * into CS, and which we assume have the same behavior as any other instruction that MOVs or POPs a segment register
 * (ie, suppresses h/w interrupts for one instruction).  Instructions that "JMP" or "CALL" or "INT" or "IRET" a new
 * value into CS are always accompanied by a new IP value, so they use setCSIP() instead, which does NOT suppress
 * h/w interrupts.
 *
 * @this {X86CPU}
 * @param {number} sel
 */
X86CPU.prototype.setCS = function(sel)
{
    this.regEIP = this.segCS.load(sel) + this.regIP;
    this.opFlags |= this.OPFLAG_NOINTR8086;
    if (PREFETCH) this.flushPrefetch(this.regEIP);
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
    this.opFlags |= this.OPFLAG_NOINTR8086;
};

/**
 * setSS(sel)
 *
 * @this {X86CPU}
 * @param {number} sel
 */
X86CPU.prototype.setSS = function(sel)
{
    this.segSS.load(sel);
    this.opFlags |= X86.OPFLAG.NOINTR;
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
    this.opFlags |= this.OPFLAG_NOINTR8086;
};

/**
 * setIP(off)
 *
 * With the addition of flushPrefetch(), this function should only be called
 * for non-incremental IP updates; setIP(this.regIP+1) is no longer appropriate.
 *
 * In fact, for performance reasons, it's preferable to increment regIP yourself,
 * but you can also call advanceIP() if speed is not important.
 *
 * @this {X86CPU}
 * @param {number} off
 */
X86CPU.prototype.setIP = function(off)
{
    this.regEIP = this.segCS.base + (this.regIP = off & 0xffff);
    if (PREFETCH) this.flushPrefetch(this.regEIP);
};

/**
 * setCSIP(off, sel, fCall)
 *
 * This function is a little different from the other segment setters, only because it turns out that CS is
 * never set without an accompanying IP (well, except for a few undocumented instructions, like POP CS, which
 * were available ONLY on the 8086/8088/80186/80188; see setCS() for details).
 *
 * NOTE: Unlike setIP(), which is often passed a computation, the offsets passed to setCSIP() are assumed to
 * be 16-bit values, so there's no need to mask them with 0xffff (although it doesn't hurt to assert that).
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
    this.assert((off & 0xffff) == off);
    this.segCS.fCall = fCall;
    /*
     * We break this operation into the following discrete steps (eg, set IP, load CS, and then update EIP)
     * so that segCS.load(sel) has the option of modifying IP when sel refers to a gate (call, interrupt, trap, etc).
     */
    this.regIP = off;
    var base = this.segCS.load(sel);
    if (base != X86.ADDR_INVALID) {
        this.regEIP = base + this.regIP;
        if (PREFETCH) this.flushPrefetch(this.regEIP);
        return this.segCS.fStackSwitch;
    }
    return null;
};

/**
 * advanceIP(inc)
 *
 * @this {X86CPU}
 * @param {number} inc (may be +/-)
 */
X86CPU.prototype.advanceIP = function(inc)
{
    this.regEIP = this.segCS.base + (this.regIP = (this.regIP + inc) & 0xffff);
    if (PREFETCH) this.advancePrefetch(inc);
};

/**
 * getCF()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getCF = function()
{
    return (this.resultValue & this.resultSize)? X86.PS.CF : 0;
};

/**
 * getPF()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getPF = function()
{
    return (X86.PARITY[this.resultParitySign & 0xff])? X86.PS.PF : 0;
};

/**
 * getAF()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getAF = function()
{
    return ((this.resultParitySign ^ this.resultAuxOverflow) & X86.RESULT.AUXOVF_AF)? X86.PS.AF : 0;
};

/**
 * getZF()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getZF = function()
{
    return (this.resultValue & (this.resultSize - 1))? 0 : X86.PS.ZF;
};

/**
 * getSF()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getSF = function()
{
    return (this.resultParitySign & (this.resultSize >> 1))? X86.PS.SF : 0;
};

/**
 * getOF()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getOF = function()
{
    return ((this.resultParitySign ^ this.resultAuxOverflow ^ (this.resultParitySign >> 1)) & (this.resultSize >> 1))? X86.PS.OF : 0;
};

/**
 * getTF()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getTF = function()
{
    return (this.regPS & X86.PS.TF);
};

/**
 * getIF()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getIF = function()
{
    return (this.regPS & X86.PS.IF);
};

/**
 * getDF()
 *
 * @this {X86CPU}
 * @return {number}
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
    this.resultValue &= ~this.resultSize;
};

/**
 * clearPF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearPF = function()
{
    if (this.getPF()) this.resultParitySign ^= 0x1;
};

/**
 * clearAF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearAF = function()
{
    this.resultAuxOverflow = (this.resultParitySign & X86.RESULT.AUXOVF_AF) | (this.resultAuxOverflow & ~X86.RESULT.AUXOVF_AF);
};

/**
 * clearZF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearZF = function()
{
    this.resultValue |= (this.resultSize - 1);
};

/**
 * clearSF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.clearSF = function()
{
    if (this.getSF()) {
        this.resultParitySign ^= (this.resultSize >> 1) | (this.resultSize >> 2);
        this.resultAuxOverflow ^= X86.RESULT.AUXOVF_OF;
    }
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
    this.resultParitySign &= ~this.resultSize;
    this.resultAuxOverflow = (this.resultParitySign & X86.RESULT.AUXOVF_OF) | (this.resultAuxOverflow & ~X86.RESULT.AUXOVF_OF);
};

/**
 * setCF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setCF = function()
{
    this.resultValue |= this.resultSize;
};

/**
 * setPF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setPF = function()
{
    if (!this.getPF()) this.resultParitySign ^= 0x1;
};

/**
 * setAF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setAF = function()
{
    this.resultAuxOverflow = ~(this.resultParitySign & X86.RESULT.AUXOVF_AF) & X86.RESULT.AUXOVF_AF | (this.resultAuxOverflow & ~X86.RESULT.AUXOVF_AF);
};

/**
 * setZF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setZF = function()
{
    this.resultValue &= ~(this.resultSize - 1);
};

/**
 * setSF()
 *
 * @this {X86CPU}
 */
X86CPU.prototype.setSF = function()
{
    if (!this.getSF()) {
        this.resultParitySign ^= (this.resultSize >> 1) | (this.resultSize >> 2);
        this.resultAuxOverflow ^= X86.RESULT.AUXOVF_OF;
    }
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
    this.resultParitySign |= this.resultSize;
    this.resultAuxOverflow = (this.resultParitySign & X86.RESULT.AUXOVF_OF) | (this.resultAuxOverflow & ~X86.RESULT.AUXOVF_OF);
};

/**
 * getPS()
 *
 * @this {X86CPU}
 * @return {number}
 */
X86CPU.prototype.getPS = function()
{
    return (this.regPS & ~X86.PS.INDIRECT) | (this.getCF() | this.getPF() | this.getAF() | this.getZF() | this.getSF() | this.getOF());
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
    this.resultSize = X86.RESULT.SIZE_BYTE;         // NOTE: We could have chosen SIZE_WORD, too; it's irrelevant
    this.resultValue = this.resultParitySign = this.resultAuxOverflow = 0;

    if (regPS & X86.PS.CF) this.setCF();
    if (!(regPS & X86.PS.PF)) this.resultParitySign |= 0x1;
    if (regPS & X86.PS.AF) this.resultAuxOverflow |= X86.RESULT.AUXOVF_AF;
    if (!(regPS & X86.PS.ZF)) this.clearZF();
    if (regPS & X86.PS.SF) this.setSF();
    if (regPS & X86.PS.OF) this.setOF();

    /*
     * OS/2 1.0 discriminates between an 80286 and an 80386 based on whether an IRET in real-mode that
     * pops 0xF000 into the flags is able to set *any* of flag bits 12-15: if it can, then OS/2 declares
     * the CPU an 80386.  Therefore, in real-mode, we must zero all incoming bits 12-15.
     *
     * This has the added benefit of relieving us from having to zero the effective IOPL (this.nIOPL)
     * whenever we're in real-mode, since we're zeroing the IOPL bits up front now.
     */
    if (!(this.regMSW & X86.MSW.PE)) {
        regPS &= ~(X86.PS.IOPL.MASK | X86.PS.NT | X86.PS.BIT15);
    }

    /*
     * There are some cases (eg, an IRET returning to a less privileged code segment) where the CPL
     * we compare against should come from the outgoing code segment, so if the caller provided it, use it.
     */
    if (cpl === undefined) cpl = this.segCS.cpl;

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

    this.regPS = (this.regPS & ~this.PS_DIRECT) | (regPS & this.PS_DIRECT) | this.PS_SET;

    /*
     * Assert that all requested flag bits now agree with our simulated (PS_INDIRECT) bits
     */
    this.assert((regPS & X86.PS.INDIRECT) == (this.getPS() & X86.PS.INDIRECT));

    if (this.regPS & X86.PS.TF) {
        this.intFlags |= X86.INTFLAG.TRAP;
        this.opFlags |= X86.OPFLAG.NOINTR;
    }
};

/**
 * traceLog(prop, dst, src, flagsIn, flagsOut, result)
 *
 * @this {X86CPU}
 * @param {string} prop
 * @param {number} dst
 * @param {number} src
 * @param {number|null} flagsIn
 * @param {number|null} flagsOut
 * @param {number} result
 */
X86CPU.prototype.traceLog = function(prop, dst, src, flagsIn, flagsOut, result)
{
    if (DEBUG && this.dbg) {
        this.dbg.traceLog(prop, dst, src, flagsIn, flagsOut, result);
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
        case "AX":
        case "BX":
        case "CX":
        case "DX":
        case "SP":
        case "BP":
        case "SI":
        case "DI":
        case "CS":
        case "DS":
        case "SS":
        case "ES":
        case "IP":
        case "PC":      // deprecated as an alias for "IP" (still used by older XML files like /disks/pc/unlisted/crobots/machine.xml)
        case "PS":      // this refers to "Processor Status", aka the 16-bit flags register (old versions of DEBUG actually refer to this as "PC", surprisingly)
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
            fBound = true;
            break;
        default:
            fBound = CPU.prototype.setBinding.call(this, sHTMLType, sBinding, control);
            break;
    }
    return fBound;
};

/**
 * getByte(addr)
 *
 * @this {X86CPU}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.getByte = function(addr)
{
    return this.aMemBlocks[(addr & this.addrMemMask) >> this.blockShift].readByte(addr & this.blockLimit);
};

/**
 * getWord(addr)
 *
 * @this {X86CPU}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.getWord = function(addr)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.addrMemMask) >> this.blockShift;
    /*
     * On the 8088, it takes 4 cycles to read the additional byte REGARDLESS whether the address is odd or even.
     *
     * TODO: For the 8086, the penalty is actually "(addr & 0x1) << 2" (4 additional cycles only when the address is odd).
     */
    this.nStepCycles -= this.CYCLES.nWordCyclePenalty;
    if (off != this.blockLimit) {
        return this.aMemBlocks[iBlock].readWord(off);
    }
    return this.aMemBlocks[iBlock++].readByte(off) | (this.aMemBlocks[iBlock & this.blockMask].readByte(0) << 8);
};

/**
 * setByte(addr, b)
 *
 * @this {X86CPU}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} b is the byte (8-bit) value to write (which we truncate to 8 bits; required by opSTOSb)
 */
X86CPU.prototype.setByte = function(addr, b)
{
    this.aMemBlocks[(addr & this.addrMemMask) >> this.blockShift].writeByte(addr & this.blockLimit, b & 0xff);
};

/**
 * setWord(addr, w)
 *
 * @this {X86CPU}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} w is the word (16-bit) value to write (which we truncate to 16 bits to be safe)
 */
X86CPU.prototype.setWord = function(addr, w)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.addrMemMask) >> this.blockShift;
    /*
     * On the 8088, it takes 4 cycles to write the additional byte REGARDLESS whether the address is odd or even.
     *
     * TODO: For the 8086, the penalty is actually "(addr & 0x1) << 2" (4 additional cycles only when the address is odd).
     */
    this.nStepCycles -= this.CYCLES.nWordCyclePenalty;
    if (off != this.blockLimit) {
        this.aMemBlocks[iBlock].writeWord(off, w & 0xffff);
        return;
    }
    this.aMemBlocks[iBlock++].writeByte(off, w & 0xff);
    this.aMemBlocks[iBlock & this.blockMask].writeByte(0, (w >> 8) & 0xff);
};

/**
 * getEAByteDisabled(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number}
 *
X86CPU.prototype.getEAByteDisabled = function getEAByteDisabled(seg, off)
{
    this.segEA = seg;
    this.offEA = off;
    //
    // The LEA opcode is at least one unavoidable reason we must still calculate regEA in
    // getEAWordDisabled(), but as for getEAByteDisabled(), I can't think of any reason for this.
    //
    this.regEA = seg.base + off;
    return 0;
};
 */

/**
 * getEAWordDisabled(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number}
 */
X86CPU.prototype.getEAWordDisabled = function getEAWordDisabled(seg, off)
{
    this.segEA = seg;
    this.offEA = off;
    /*
     * The LEA opcode is at least one unavoidable reason we must still calculate regEA here....
     */
    this.regEA = seg.base + off;
    return 0;
};

/**
 * modEAByteDisabled(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number}
 */
X86CPU.prototype.modEAByteDisabled = function modEADisabled(seg, off)
{
    this.segEA = seg;
    this.offEA = off;
    /*
     * TODO: Should this not also set regEA? Optimization or oversight?
     */
    this.regEAWrite = seg.base + off;
    return 0;
};

X86CPU.prototype.modEAWordDisabled = X86CPU.prototype.modEAByteDisabled;

/**
 * setEAByteDisabled(w)
 *
 * @this {X86CPU}
 * @param {number} w is the word (16-bit) value to write (ignored)
 */
X86CPU.prototype.setEAByteDisabled = function setEAByteDisabled(w)
{
};

/**
 * setEAWordDisabled(w)
 *
 * @this {X86CPU}
 * @param {number} w is the word (16-bit) value to write (ignored)
 */
X86CPU.prototype.setEAWordDisabled = function setEAWordDisabled(w)
{
};

/**
 * getEAByteEnabled(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.getEAByteEnabled = function getEAByteEnabled(seg, off)
{
    this.segEA = seg;
    this.regEA = seg.checkRead(this.offEA = off, 0);
    if (!EAFUNCS && (this.opFlags & X86.OPFLAG.NOREAD)) return 0;
    return this.getByte(this.regEA);
};

/**
 * getEAWordEnabled(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.getEAWordEnabled = function getEAWordEnabled(seg, off)
{
    this.segEA = seg;
    this.regEA = seg.checkRead(this.offEA = off, 1);
    if (!EAFUNCS && (this.opFlags & X86.OPFLAG.NOREAD)) return 0;
    return this.getWord(this.regEA);
};

/**
 * modEAByteEnabled(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.modEAByteEnabled = function modEAByteEnabled(seg, off)
{
    this.segEA = seg;
    this.regEAWrite = this.regEA = seg.checkRead(this.offEA = off, 0);
    if (!EAFUNCS && (this.opFlags & X86.OPFLAG.NOREAD)) return 0;
    return this.getByte(this.regEA);
};

/**
 * modEAWordEnabled(seg, off)
 *
 * @this {X86CPU}
 * @param {X86Seg} seg register (eg, segDS)
 * @param {number} off is a segment-relative offset
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.modEAWordEnabled = function modEAWordEnabled(seg, off)
{
    this.segEA = seg;
    this.regEAWrite = this.regEA = seg.checkRead(this.offEA = off, 1);
    if (!EAFUNCS && (this.opFlags & X86.OPFLAG.NOREAD)) return 0;
    return this.getWord(this.regEA);
};

/**
 * setEAByteEnabled(b)
 *
 * @this {X86CPU}
 * @param {number} b is the byte (8-bit) value to write
 */
X86CPU.prototype.setEAByteEnabled = function setEAByteEnabled(b)
{
    if (!EAFUNCS && (this.opFlags & X86.OPFLAG.NOWRITE)) return;
    this.setByte(this.segEA.checkWrite(this.offEA, 0), b);
};

/**
 * setEAWordEnabled(w)
 *
 * @this {X86CPU}
 * @param {number} w is the word (16-bit) value to write
 */
X86CPU.prototype.setEAWordEnabled = function setEAWordEnabled(w)
{
    if (!EAFUNCS && (this.opFlags & X86.OPFLAG.NOWRITE)) return;
    this.setWord(this.segEA.checkWrite(this.offEA, 1), w);
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
    return this.getByte(seg.checkRead(off, 0));
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
    return this.getWord(seg.checkRead(off, 1));
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
    this.setByte(seg.checkWrite(off, 0), b);
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
    this.setWord(seg.checkWrite(off, 1), w);
};

/**
 * getBytePrefetch(addr)
 *
 * Return the next byte from the prefetch queue, prefetching it now if necessary.
 *
 * @this {X86CPU}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} byte (8-bit) value at that address
 */
X86CPU.prototype.getBytePrefetch = function(addr)
{
    if (!EAFUNCS && (this.opFlags & X86.OPFLAG.NOREAD)) return 0;
    var b;
    if (!this.cbPrefetchQueued) {
        if (MAXDEBUG) this.assert(addr == this.addrPrefetchHead, "X86CPU.getBytePrefetch(" + str.toHex(addr) + "): invalid head address (" + str.toHex(this.addrPrefetchHead) + ")");
        if (MAXDEBUG) this.assert(this.iPrefetchTail == this.iPrefetchHead, "X86CPU.getBytePrefetch(" + str.toHex(addr) + "): head (" + this.iPrefetchHead + ") does not match tail (" + this.iPrefetchTail + ")");
        this.fillPrefetch(1);
        this.nBusCycles += 4;
        /*
         * This code effectively inlines this.fillPrefetch(1), but without queueing the byte, so it's an optimization
         * with side-effects we may not want, and in any case, while it seemed to improve Safari's performance slightly,
         * it did nothing for the oddball Chrome performance I'm seeing with PREFETCH enabled.
         *
         *      b = this.aMemBlocks[(addr & this.addrMemMask) >> this.blockShift].readByte(addr & this.blockLimit);
         *      this.nBusCycles += 4;
         *      this.cbPrefetchValid = 0;
         *      this.addrPrefetchHead = (addr + 1) & this.addrMemMask;
         *      return b;
         */
    }
    b = this.aPrefetch[this.iPrefetchTail] & 0xff;
    if (MAXDEBUG) this.messagePrint("  getBytePrefetch[" + this.iPrefetchTail + "]: " + str.toHex(addr) + ":" + str.toHexByte(b));
    if (MAXDEBUG) this.assert(addr == (this.aPrefetch[this.iPrefetchTail] >> 8), "X86CPU.getBytePrefetch(" + str.toHex(addr) + "): invalid tail address (" + str.toHex(this.aPrefetch[this.iPrefetchTail] >> 8) + ")");
    this.iPrefetchTail = (this.iPrefetchTail + 1) & X86CPU.PREFETCH.MASK;
    this.cbPrefetchQueued--;
    return b;
};

/**
 * getWordPrefetch(addr)
 *
 * Return the next word from the prefetch queue.  There are 3 cases to consider:
 *
 *  1) Both bytes have been prefetched; no bytes need be fetched from memory
 *  2) Only the low byte has been prefetched; the high byte must be fetched from memory
 *  3) Neither byte has been prefetched; both bytes must be fetched from memory
 *
 * However, since we want to mirror getBytePrefetch's behavior of fetching all bytes through
 * the prefetch queue, we're taking the easy way out and simply calling getBytePrefetch() twice.
 *
 * @this {X86CPU}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} word (16-bit) value at that address
 */
X86CPU.prototype.getWordPrefetch = function(addr)
{
    return this.getBytePrefetch(addr) | (this.getBytePrefetch(addr + 1) << 8);
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
        var b = this.aMemBlocks[(addr & this.addrMemMask) >> this.blockShift].readByte(addr & this.blockLimit);
        this.aPrefetch[this.iPrefetchHead] = b | (addr << 8);
        if (MAXDEBUG) this.messagePrint("     fillPrefetch[" + this.iPrefetchHead + "]: " + str.toHex(addr) + ":" + str.toHexByte(b));
        this.addrPrefetchHead = (addr + 1) & this.addrMemMask;
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
 * @param {number} addr is a physical (non-segmented) address of the current program counter (regEIP)
 */
X86CPU.prototype.flushPrefetch = function(addr)
{
    this.addrPrefetchHead = addr;
    this.iPrefetchTail = this.iPrefetchHead = this.cbPrefetchQueued = this.cbPrefetchValid = 0;
    if (MAXDEBUG && addr !== undefined) this.messagePrint("    flushPrefetch[-]: " + str.toHex(addr));
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
        this.flushPrefetch(this.regEIP);
        if (MAXDEBUG) this.messagePrint("advancePrefetch(" + inc + "): flushed");
    }
};

/**
 * getIPByte()
 *
 * NOTE: We don't need to mask the incoming regEIP, because regEIP is always masked after update.
 *
 * @this {X86CPU}
 * @return {number} byte at the current IP; IP advanced by 1
 */
X86CPU.prototype.getIPByte = function()
{
    var b = (PREFETCH? this.getBytePrefetch(this.regEIP) : this.getByte(this.regEIP));
    this.regEIP = this.segCS.base + (this.regIP = (this.regIP + 1) & 0xffff);     // this.advanceIP(1)
    return b;
};

/**
 * getIPDisp()
 *
 * NOTE: We don't need to mask the incoming regEIP, because regEIP is always masked after update.
 *
 * @this {X86CPU}
 * @return {number} sign-extended value from the byte at the current IP; IP advanced by 1
 */
X86CPU.prototype.getIPDisp = function()
{
    var b = ((PREFETCH? this.getBytePrefetch(this.regEIP) : this.getByte(this.regEIP)) << 24) >> 24;
    this.regEIP = this.segCS.base + (this.regIP = (this.regIP + 1) & 0xffff);     // this.advanceIP(1)
    return b & 0xffff;
};

/**
 * getIPWord()
 *
 * NOTE: We don't need to mask the incoming regEIP, because regEIP is always masked after update.
 *
 * @this {X86CPU}
 * @return {number} word at the current IP; IP advanced by 2
 */
X86CPU.prototype.getIPWord = function()
{
    var w = (PREFETCH? this.getWordPrefetch(this.regEIP) : this.getWord(this.regEIP));
    this.regEIP = this.segCS.base + (this.regIP = (this.regIP + 2) & 0xffff);     // this.advanceIP(2)
    return w;
};

/**
 * popWord()
 *
 * @this {X86CPU}
 * @return {number} word popped from the current SP; SP increased by 2
 */
X86CPU.prototype.popWord = function()
{
    var regSP = this.regSP;
    this.regSP = (this.regSP + 2) & 0xffff;
    return this.getSOWord(this.segSS, regSP);
};

/**
 * pushWord(w)
 *
 * @this {X86CPU}
 * @param {number} w is the word (16-bit) value to push at current SP; SP decreased by 2
 */
X86CPU.prototype.pushWord = function(w)
{
    this.assert((w & 0xffff) == w);
    this.setSOWord(this.segSS, (this.regSP = (this.regSP - 2) & 0xffff), w);
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
 * I/O was required to satisfy the request; from the CPU's perspective, this meant our DMA hardware was
 * incredibly fast.  However, with the introduction of remote disk connections, some actual I/O may be required;
 * in practice, this means that the FIRST byte requested as part of a DMA operation may require a callback to
 * finish, while all remaining bytes will be retrieved during subsequent checkINTR() calls -- unless additional
 * remote I/O operations are required to complete the DMA operation.
 *
 * As a result, the CPU will run slightly slower while an async DMA request is in progress, but the slowdown
 * should be negligible.  The downside is that this slowdown will be in effect for the entire duration of the
 * I/O (ie, even while we're waiting for the remote I/O to finish), so the ChipSet component should avoid
 * calling setDMA() whenever possible.
 *
 * TODO: While comparing SYMDEB tracing in both PCjs and VMware, I noticed that after single-stepping
 * ANY segment-load instruction, SYMDEB would get control immediately after that instruction in VMware,
 * whereas I delay acknowledgment of the Trap flag until the *following* instruction, so in PCjs, SYMDEB
 * doesn't get control until the following instruction.  I think PCjs behavior is correct, at least for SS.
 *
 * ERRATA: I do recall that early revisions of the 8086/8088 failed to suppress hardware interrupts (and
 * possibly also Trap acknowledgements) after an SS load, but that Intel corrected the problem at some point;
 * however, I don't know when that change was made or which IBM PC models may have been affected, if any.
 * TODO: More research required.
 *
 * WARNING: There is also a priority consideration here.  On the 8086/8088, hardware interrupts have higher
 * priority than Trap interrupts (which is why the code below is written the way it is).  A potentially
 * undesirable side-effect is that a hardware interrupt handler could end up being single-stepped if an
 * external interrupt occurs immediately after the Trap flag is set.  This is why some 8086 debuggers temporarily
 * mask all hardware interrupts during a single-step operation (although that doesn't help with NMIs generated
 * by a coprocessor).  As of the 80286, those priorities were inverted, giving the Trap interrupt higher priority
 * than external interrupts.
 *
 * @this {X86CPU}
 * @return {boolean} true if h/w interrupt (or trap) has just been acknowledged, false if not
 */
X86CPU.prototype.checkINTR = function()
{
    this.assert(this.intFlags);
    if (!(this.opFlags & X86.OPFLAG.NOINTR)) {
        if ((this.intFlags & X86.INTFLAG.INTR) && (this.regPS & X86.PS.IF)) {
            var nIDT = this.chipset.getIRRVector();
            if (nIDT >= -1) {
                this.intFlags &= ~X86.INTFLAG.INTR;
                if (nIDT >= 0) {
                    this.intFlags &= ~X86.INTFLAG.HALT;
                    X86Help.opHelpINT.call(this, nIDT, null, 11);
                    return true;
                }
            }
        }
        else if ((this.intFlags & X86.INTFLAG.TRAP)) {
            this.intFlags &= ~X86.INTFLAG.TRAP;
            X86Help.opHelpINT.call(this, X86.EXCEPTION.TRAP, null, 11);
            return true;
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
 * displayStatus()
 *
 * @this {X86CPU}
 * @param {boolean} [fForce]
 */
X86CPU.prototype.displayStatus = function(fForce)
{
    if (fForce || !this.aFlags.fRunning || this.aFlags.fDisplayLiveRegs) {
        this.displayReg("AX", this.regAX);
        this.displayReg("BX", this.regBX);
        this.displayReg("CX", this.regCX);
        this.displayReg("DX", this.regDX);
        this.displayReg("SP", this.regSP);
        this.displayReg("BP", this.regBP);
        this.displayReg("SI", this.regSI);
        this.displayReg("DI", this.regDI);
        this.displayReg("CS", this.segCS.sel);
        this.displayReg("DS", this.segDS.sel);
        this.displayReg("SS", this.segSS.sel);
        this.displayReg("ES", this.segES.sel);
        this.displayReg("IP", this.regIP);
        var regPS = this.getPS();
        this.displayReg("PS", regPS);
        this.displayReg("C", (regPS & X86.PS.CF)? 1 : 0, 1);
        this.displayReg("P", (regPS & X86.PS.PF)? 1 : 0, 1);
        this.displayReg("A", (regPS & X86.PS.AF)? 1 : 0, 1);
        this.displayReg("Z", (regPS & X86.PS.ZF)? 1 : 0, 1);
        this.displayReg("S", (regPS & X86.PS.SF)? 1 : 0, 1);
        this.displayReg("T", (regPS & X86.PS.TF)? 1 : 0, 1);
        this.displayReg("I", (regPS & X86.PS.IF)? 1 : 0, 1);
        this.displayReg("D", (regPS & X86.PS.DF)? 1 : 0, 1);
        this.displayReg("V", (regPS & X86.PS.OF)? 1 : 0, 1);
    }
    var controlSpeed = this.bindings["speed"];
    if (controlSpeed) controlSpeed.textContent = this.getSpeedCurrent();
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
 * (0xCC); the Debugger monitors changes to the regEIP register to implement its own execution breakpoints.
 *
 * As a result, the Debugger's complete independence means you can run other 8086/8088 debuggers
 * (eg, DEBUG) inside the simulation without interference; you can even "debug" them with the Debugger.
 *
 * @this {X86CPU}
 * @param {number} nMinCycles (0 implies a single-step, and therefore breakpoints should be ignored)
 * @return {number} of cycles executed; 0 indicates that the last instruction was not executed (eg,
 * we hit an execution breakpoint), -1 implies a post-execution condition was triggered (eg, a write
 * breakpoint), and a positive number indicates successful completion of the indicated number of cycles.
 */
X86CPU.prototype.stepCPU = function(nMinCycles)
{
    /*
     * The Debugger uses fComplete to determine if the instruction completed (true) or was interrupted
     * by a breakpoint or some other exceptional condition (false). NOTE: this does NOT include thrown
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
     * fDebugSkip is checked only when fDebugCheck is true, and its sole purpose is to tell the first call
     * to checkInstruction() that it can skip breakpoint checks, and that will be true ONLY when fStarting is
     * true OR nMinCycles is zero (the latter means the Debugger is single-stepping).
     *
     * Once we snap fStarting, we clear it, because technically, we've moved beyond "starting" and have officially
     * "started" now.
     */
    var fDebugSkip = this.aFlags.fStarting || !nMinCycles;
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
        var opPrefixes = this.opFlags & X86.OPFLAG.PREFIXES;
        if (opPrefixes) {
            this.opPrefixes |= opPrefixes;
        } else {
            this.opEA = this.regEIP;
            this.regEA = this.regEAWrite = X86.ADDR_INVALID;
            this.segData = this.segDS;
            this.segStack = this.segSS;
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
            if (this.dbg.checkInstruction(this.regEIP, fDebugSkip)) {
                this.stopCPU();
                break;
            }
            fDebugSkip = false;
        }

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
                    var t = this.regEIP + this.getCycles();
                    var n = this.aSamples[this.iSampleNext];
                    if (n !== -1) {
                        if (n !== t) {
                            this.println("sample deviation at index " + this.iSampleNext + ": current EIP=" + str.toHex(this.regEIP));
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

        this.opFlags = 0;

        if (DEBUG || PREFETCH) {
            this.nBusCycles = 0;
            this.nSnapCycles = this.nStepCycles;
        }

        this.aOps[this.getIPByte()].call(this);

        if (PREFETCH) {
            var nSpareCycles = (this.nSnapCycles - this.nStepCycles) - this.nBusCycles;
            if (nSpareCycles >= 4) {
                this.fillPrefetch(nSpareCycles >> 2);   // for every 4 spare cycles, fetch 1 instruction byte
            }
        }

        if (DEBUG) {
            /*
             * Some opcode helpers are required to temporarily redirect getEAByte/getEAWord or setEAByte/setEAWord
             * to null functions, effectively disabling a memory read that's unnecessary (or a memory write that could
             * be destructive).  However, they weren't originally required to restore those memory functions when they
             * were done; we would simply reset all the memory functions here, after every single instruction.
             *
             * That's no longer the case.  Those opcode helpers (or their callers) are now required to restore the
             * memory access functions to their defaults, so that we don't have to waste time resetting them here, on
             * every instruction.  The DEBUG-only verifyMemoryEnabled() simply confirms that everyone's doing their job.
             */
            this.verifyMemoryEnabled();

            /*
             * Make sure that every instruction is assessing a cycle cost, and that the cost is a net positive.
             */
            if (this.aFlags.fComplete && this.nStepCycles >= this.nSnapCycles && !(this.opFlags & X86.OPFLAG.PREFIXES)) {
                this.println("cycle miscount: " + (this.nSnapCycles - this.nStepCycles));
                this.setIP(this.opEA - this.segCS.base);
                this.stopCPU();
                break;
            }
        }

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

if (typeof APP_PCJS !== 'undefined') {
    APP_PCJS.X86 = X86;
    APP_PCJS.X86.X86CPU = X86CPU;
    APP_PCJS.X86.X86Seg = X86Seg;
    APP_PCJS.X86.X86Grps = X86Grps;
    APP_PCJS.X86.X86Help = X86Help;
    APP_PCJS.X86.X86Mods = X86Mods;
    APP_PCJS.X86.X86Op0F = X86Op0F;
    APP_PCJS.X86.X86OpXX = X86OpXX;
}

if (typeof module !== 'undefined') module.exports = X86CPU;
