/**
 * @fileoverview Defines PC6502 CPU constants.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
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

var CPUDef = {
    /*
     * CPU model numbers (supported)
     */
    MODEL_6502: 6502,

    /*
     * This constant is used to mark points in the code where the physical address being returned
     * is invalid and should not be used.
     *
     * In a 32-bit CPU, -1 (ie, 0xffffffff) could actually be a valid address, so consider changing
     * ADDR_INVALID to NaN or null (which is also why all ADDR_INVALID tests should use strict equality
     * operators).
     *
     * The main reason I'm NOT using NaN or null now is my concern that, by mixing non-numbers
     * (specifically, values outside the range of signed 32-bit integers), performance may suffer.
     *
     * WARNING: Like many of the properties defined here, ADDR_INVALID is a common constant, which the
     * Closure Compiler will happily inline (with or without @const annotations; in fact, I've yet to
     * see a @const annotation EVER improve automatic inlining).  However, if you don't make ABSOLUTELY
     * certain that this file is included BEFORE the first reference to any of these properties, that
     * automatic inlining will no longer occur.
     */
    ADDR_INVALID: -1,

    /*
     * Processor Status flag definitions (stored in regPS)
     */
    PS: {
        SF:     0x80,           // this.BIT_PN = 0x80;     // N = sign
        OF:     0x40,           // this.BIT_PV = 0x40;     // V = overflow
        BF:     0x10,           // this.BIT_PB = 0x10;     // B = break
        DF:     0x08,           // this.BIT_PD = 0x08;     // D = decimal
        IF:     0x04,           // this.BIT_PI = 0x04;     // I = interrupt
        ZF:     0x02,           // this.BIT_PZ = 0x02;     // Z = zero
        CF:     0x01            // this.BIT_PC = 0x01;     // C = carry
    },
    VECTOR: {
        NMI:    0xFFFA,         // this.VECTOR_NMI     = 0xfffa;
        RESET:  0xFFFC,         // this.VECTOR_RESET   = 0xfffc;
        IRQ:    0xFFFE          // this.VECTOR_IRQ     = 0xfffe;
    },
    /*
     * Opcode definitions
     */
    OPCODE: {
        JSR:    0x20,
        /*
         * opSim operation codes
         */
        SIM:    0x02,
        SIMOP_HLT:  0x00,
        SIMOP_MSG:  0x01
        // to be continued....
    }
};

if (NODE) module.exports = CPUDef;
