/**
 * @fileoverview Sample CPU
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2019 Jeff Parsons
 *
 * This file is part of PCjs, a computer emulation software project at <https://www.pcjs.org>.
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
 * <https://www.pcjs.org/modules/devices/machine.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * Sample CPU
 *
 * @class {CPU}
 * @unrestricted
 * @property {number} regPC
 * @property {number} nCyclesClocked
 * @property {Input} input
 * @property {RAM} ram
 * @property {ROM} rom
 * @property {Time} time
 * @property {number} addrPrev
 * @property {number} addrStop
 * @property {Object} breakConditions
 */
class CPU extends Device {
    /**
     * CPU(idMachine, idDevice, config)
     *
     * Defines the basic elements of a sample CPU.
     *
     * @this {CPU}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config, CPU.VERSION);

        /*
         * The "Program Counter" (regPC)
         */
        this.regPC = 0;

        /*
         * This internal cycle count is initialized on every clocker() invocation, enabling opcode functions that
         * need to consume a few extra cycles to bump this count upward as needed.
         */
        this.nCyclesClocked = 0;

        /*
         * Get access to the Input device, so we can add our click functions.
         */
        this.input = /** @type {Input} */ (this.findDevice(this.config['input']));
        this.input.addClick(this.onPower.bind(this), this.onReset.bind(this));

        /*
         * Get access to the ROM device, so we can give it access to functions like disassemble().
         */
        this.rom = /** @type {ROM} */ (this.findDeviceByClass(Machine.CLASS.ROM));
        if (this.rom) this.rom.setCPU(this);

        /*
         * Get access to the Time device, so we can give it our clocker() function.
         */
        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
        if (this.time && this.rom) {
            this.time.addClocker(this.clocker.bind(this));
            this.time.addUpdater(this.updateStatus.bind(this));
        }

        /*
         * The following set of properties are all debugger-related; see onCommand().
         */
        this.addrPrev = -1;
        this.addrStop = -1;
        this.addHandler(Device.HANDLER.COMMAND, this.onCommand.bind(this));
    }

    /**
     * clearDisplays()
     *
     * There are certain events (eg, power off, reset) where it is wise to clear all associated displays,
     * such as the LED display, the ROM activity array (if any), and assorted indicators.
     *
     * @this {CPU}
     */
    clearDisplays()
    {
        if (this.rom) this.rom.clearArray();
    }

    /**
     * clocker(nCyclesTarget)
     *
     * @this {CPU}
     * @param {number} nCyclesTarget (0 to single-step)
     * @returns {number} (number of cycles actually "clocked")
     */
    clocker(nCyclesTarget = 0)
    {
        /*
         * NOTE: We can assume that the rom exists here, because we don't call addClocker() it if doesn't.
         */
        this.nCyclesClocked = 0;
        while (this.nCyclesClocked <= nCyclesTarget) {
            if (this.addrStop == this.regPC) {
                this.addrStop = -1;
                this.println("break");
                this.time.stop();
                break;
            }
            let opCode = this.rom.getData(this.regPC);
            let addr = this.regPC;
            this.regPC = (addr + 1) & this.rom.addrMask;
            if (opCode == undefined || !this.decode(opCode, addr)) {
                this.regPC = addr;
                this.println("unimplemented opcode");
                this.time.stop();
                break;
            }
            this.nCyclesClocked += CPU.OP_CYCLES;
        }
        if (nCyclesTarget <= 0) {
            let cpu = this;
            this.time.doOutside(function clockerOutside() {
                cpu.rom.drawArray();
                cpu.println(cpu.toString());
            });
        }
        return this.nCyclesClocked;
    }

    /**
     * decode(opCode, addr)
     *
     * @this {CPU}
     * @param {number} opCode (opcode)
     * @param {number} addr (of the opcode)
     * @returns {boolean} (true if opcode successfully decoded, false if unrecognized or unsupported)
     */
    decode(opCode, addr)
    {
        return false;
    }

    /**
     * disassemble(opCode, addr)
     *
     * Returns a string representation of the selected instruction.
     *
     * @this {CPU}
     * @param {number|undefined} opCode
     * @param {number} addr
     * @returns {string}
     */
    disassemble(opCode, addr)
    {
        let sOp = "???", sOperands = "";

        return this.sprintf("%#06x: %#06x  %-8s%s\n", addr, opCode, sOp, sOperands);
    }

    /**
     * loadState(state)
     *
     * If any saved values don't match (possibly overridden), abandon the given state and return false.
     *
     * @this {CPU}
     * @param {Object|Array|null} state
     * @returns {boolean}
     */
    loadState(state)
    {
        if (state) {
            let stateCPU = state['stateCPU'] || state[0];
            if (!stateCPU || !stateCPU.length) {
                this.println("invalid saved state");
                return false;
            }
            let version = stateCPU.shift();
            if ((version|0) !== (CPU.VERSION|0)) {
                this.printf("saved state version mismatch: %3.2f\n", version);
                return false;
            }
            try {
                this.regPC = stateCPU.shift();
            } catch(err) {
                this.println("CPU state error: " + err.message);
                return false;
            }
            let stateROM = state['stateROM'] || state[1];
            if (stateROM && this.rom) {
                if (!this.rom.loadState(stateROM)) {
                    return false;
                }
            }
            let stateRAM = state['stateRAM'] || state[1];
            if (stateRAM && this.ram) {
                if (!this.ram.loadState(stateRAM)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * onCommand(aTokens, machine)
     *
     * Processes commands for our "mini-debugger".
     *
     * @this {CPU}
     * @param {Array.<string>} aTokens
     * @param {Device} [machine]
     * @returns {boolean} (true if processed, false if not)
     */
    onCommand(aTokens, machine)
    {
        let sResult = "";
        let c, condition, count = 0, values = [];
        let s = aTokens[1];
        let addr = Number.parseInt(aTokens[2], 16);
        if (isNaN(addr)) addr = -1;
        let nWords = Number.parseInt(aTokens[3], 10) || 8;

        for (let i = 3; i < aTokens.length; i++) {
            values.push(Number.parseInt(aTokens[i], 16));
        }

        switch(s[0]) {
        case 'e':
            for (let i = 0; i < values.length; i++) {
                let prev = this.rom.setData(addr, values[i]);
                if (prev == undefined) break;
                sResult += this.sprintf("%#06x: %#06x changed to %#06x\n", addr, prev, values[i]);
                count++;
                addr++;
            }
            sResult += this.sprintf("%d locations updated\n", count);
            break;

        case 'g':
            if (this.time.start()) {
                this.addrStop = addr;
            } else {
                sResult = "already started";
            }
            break;

        case 'h':
            if (!this.time.stop()) sResult = "already stopped";
            break;

        case 't':
            nWords = Number.parseInt(aTokens[2], 10) || 1;
            this.time.onStep(nWords);
            if (machine) machine.sCommandPrev = aTokens[0];
            break;

        case 'r':
            this.setRegister(s.substr(1), addr);
            sResult += this.toString(s[1]);
            if (machine) machine.sCommandPrev = aTokens[0];
            break;

        case 'u':
            addr = (addr >= 0? addr : (this.addrPrev >= 0? this.addrPrev : this.regPC));
            while (nWords--) {
                let opCode = this.rom && this.rom.getData(addr, true);
                if (opCode == undefined) break;
                sResult += this.disassemble(opCode, addr++);
            }
            this.addrPrev = addr;
            if (machine) machine.sCommandPrev = aTokens[0];
            break;

        case '?':
            sResult = "additional commands:";
            CPU.COMMANDS.forEach((cmd) => {sResult += '\n' + cmd;});
            break;

        default:
            if (aTokens[0]) {
                sResult = "unrecognized command '" + aTokens[0] + "' (try '?')";
            }
            break;
        }
        if (sResult) this.println(sResult.trim());
        return true;
    }

    /**
     * onLoad()
     *
     * Automatically called by the Machine device after all other devices have been powered up (eg, during
     * a page load event) AND the machine's 'autoRestore' property is true.  It is called BEFORE onPower().
     *
     * @this {CPU}
     */
    onLoad()
    {
        this.loadState(this.loadLocalStorage());
    }

    /**
     * onPower(fOn)
     *
     * Automatically called by the Machine device after all other devices have been powered up (eg, during
     * a page load event) AND the machine's 'autoStart' property is true, with fOn set to true.  It is also
     * called before all devices are powered down (eg, during a page unload event), with fOn set to false.
     *
     * May subsequently be called by the Input device to provide notification of a user-initiated power event
     * (eg, toggling a power button); in this case, fOn should NOT be set, so that no state is loaded or saved.
     *
     * @this {CPU}
     * @param {boolean} [fOn] (true to power on, false to power off; otherwise, toggle it)
     */
    onPower(fOn)
    {
        if (fOn == undefined) {
            fOn = !this.time.isRunning();
            if (fOn) this.regPC = 0;
        }
        if (fOn) {
            this.time.start();
        } else {
            this.time.stop();
            this.clearDisplays();
        }
    }

    /**
     * onReset()
     *
     * Called by the Input device to provide notification of a reset event.
     *
     * @this {CPU}
     */
    onReset()
    {
        this.println("reset");
        this.regPC = 0;
        this.rom.reset();
        this.clearDisplays();
        if (!this.time.isRunning()) {
            this.println(this.toString());
        }
    }

    /**
     * onSave()
     *
     * Automatically called by the Machine device before all other devices have been powered down (eg, during
     * a page unload event).
     *
     * @this {CPU}
     */
    onSave()
    {
        this.saveLocalStorage(this.saveState());
    }

    /**
     * saveState()
     *
     * @this {CPU}
     * @returns {Array}
     */
    saveState()
    {
        let state = [[],[], []];
        let stateCPU = state[0];
        let stateROM = state[1];
        let stateRAM = state[2];
        stateCPU.push(CPU.VERSION);
        stateCPU.push(this.regPC);
        if (this.rom) this.rom.saveState(stateROM);
        if (this.ram) this.ram.saveState(stateRAM);
        return state;
    }

    /**
     * setRegister(name, value)
     *
     * @this {CPU}
     * @param {string} name
     * @param {number} value
     */
    setRegister(name, value)
    {
        if (!name || value < 0) return;

        switch(name) {
        case "pc":
            this.regPC = value;
            break;
        default:
            this.println("unrecognized register: " + name);
            break;
        }
    }

    /**
     * toString()
     *
     * @this {CPU}
     * @returns {string}
     */
    toString()
    {
        let s = this.sprintf("PC=%#0X\n", this.regPC);
        return s;
    }

    /**
     * updateStatus(fTransition)
     *
     * Enumerate all bindings and update their values.
     *
     * Called by Time's updateStatus() function whenever 1) its YIELDS_PER_UPDATE threshold is reached
     * (default is twice per second), 2) a step() operation has just finished (ie, the device is being
     * single-stepped), and 3) a start() or stop() transition has occurred.
     *
     * @this {CPU}
     * @param {boolean} [fTransition]
     */
    updateStatus(fTransition)
    {
    }
}

CPU.OP_CYCLES = 1;                      // default number of cycles per instruction

CPU.COMMANDS = [
    "e [addr] ...\tedit memory",
    "g [addr]\trun (to addr)",
    "h\t\thalt",
    "r[a]\t\tdump (all) registers",
    "t [n]\t\tstep (n instructions)",
    "u [addr] [n]\tdisassemble (at addr)"
];

CPU.VERSION = +VERSION || 2.00;
