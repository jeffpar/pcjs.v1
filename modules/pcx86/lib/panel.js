/**
 * @fileoverview Implements the PCx86 Panel component.
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

if (NODE) {
    var Str         = require("../../shared/lib/strlib");
    var Usr         = require("../../shared/lib/usrlib");
    var Web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var PCX86       = require("./defines");
    var Bus         = require("./bus");
    var Memory      = require("./memory");
    var X86         = require("./x86");
}

/**
 * Region object definition
 *
 *  iBlock:     starting block number
 *  cBlocks:    number of blocks spanned by region
 *  type:       type of all blocks in the region (see Memory.TYPE.*)
 *
 * @typedef {{
 *  iBlock:     number,
 *  cBlocks:    number,
 *  type:       number
 * }} Region
 */
var Region;

class Color {
    /**
     * Color(r, g, b, a)
     *
     * @this {Color}
     * @param {number} [r]
     * @param {number} [g]
     * @param {number} [b]
     * @param {number} [a]
     */
    constructor(r, g, b, a)
    {
        this.rgb = [r, g, b, a];
        this.sValue = null;
        if (r === undefined) this.randomize();
    }

    /**
     * getRandom(nLimit)
     *
     * @this {Color}
     * @param {number} [nLimit]
     */
    getRandom(nLimit)
    {
        return (Math.random() * (nLimit || 0x100)) | 0;
    }

    /**
     * randomize()
     *
     * @this {Color}
     */
    randomize()
    {
        this.rgb[0] = this.getRandom(); this.rgb[1] = this.getRandom(); this.rgb[2] = this.getRandom(); this.rgb[3] = 0xff;
        this.sValue = null;
    }

    /**
     * toString()
     *
     * @this {Color}
     * @return {string}
     */
    toString()
    {
        if (!this.sValue) this.sValue = '#' + Str.toHex(this.rgb[0], 2) + Str.toHex(this.rgb[1], 2) + Str.toHex(this.rgb[2], 2);
        return this.sValue;
    }
}

class Rectangle {
    /**
     * Rectangle(x, y, cx, cy)
     *
     * @this {Rectangle}
     * @param {number} x
     * @param {number} y
     * @param {number} cx
     * @param {number} cy
     */
    constructor(x, y, cx, cy)
    {
        this.x = x;
        this.y = y;
        this.cx = cx;
        this.cy = cy;
    }

    /**
     * contains(x, y)
     *
     * @param {number} x
     * @param {number} y
     * @return {boolean} true if (x,y) lies within the rectangle, false if not
     */
    contains(x, y)
    {
        return (x >= this.x && x < this.x + this.cx && y >= this.y && y < this.y + this.cy);
    }

    /**
     * subDivide(units, unitsTotal, fHorizontal)
     *
     * Return a new rectangle that is a subset of the current rectangle, based on the ratio of
     * units to unitsTotal, and then update the dimensions of the current rectangle.  Whether the
     * original rectangle is divided horizontally or vertically is entirely arbitrary; currently,
     * the criteria is horizontal if the ratio is 1/4 or more, vertical otherwise.
     *
     * @this {Rectangle}
     * @param {number} units
     * @param {number} unitsTotal
     * @param {boolean} [fHorizontal]
     * @return {Rectangle}
     */
    subDivide(units, unitsTotal, fHorizontal)
    {
        var rect;
        if (fHorizontal === undefined) {
            fHorizontal = units >= (unitsTotal >> 2);
        }
        if (fHorizontal) {
            rect = new Rectangle(this.x, this.y, this.cx, ((this.cy * units) / unitsTotal) | 0);
            this.y += rect.cy;
            this.cy -= rect.cy;
            Component.assert(this.cy >= 0);
        } else {
            rect = new Rectangle(this.x, this.y, ((this.cx * units) / unitsTotal) | 0, this.cy);
            this.x += rect.cx;
            this.cx -= rect.cx;
            Component.assert(this.cx >= 0);
        }
        return rect;
    }

    /**
     * drawWith(context, color)
     *
     * @param {Object} context
     * @param {Color|string} [color]
     */
    drawWith(context, color)
    {
        if (!color) color = new Color();
        context.strokeStyle = "black";
        context.strokeRect(this.x, this.y, this.cx, this.cy);
        context.fillStyle = (typeof color == "string"? color : color.toString());
        context.fillRect(this.x, this.y, this.cx, this.cy);
    }
}

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class Panel extends Component {
    /**
     * Panel(parmsPanel)
     *
     * The Panel component has no required (parmsPanel) properties.
     *
     * @this {Panel}
     * @param {Object} parmsPanel
     */
    constructor(parmsPanel)
    {
        super("Panel", parmsPanel);

        this.canvas = null;
        this.lockMouse = -1;
        this.fMouseDown = false;
        this.xMouse = this.yMouse = -1;
        this.timer = -1;
        if (BACKTRACK) {
            this.busInfo = null;
            this.fBackTrack = false;
        }
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {Panel}
     * @param {Computer} cmp
     * @param {Bus} bus
     * @param {X86CPU} cpu
     * @param {DebuggerX86} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        var panel = this;

        this.cmp = cmp;
        this.bus = bus;
        this.cpu = cpu;
        this.dbg = dbg;
        this.kbd = cmp.getMachineComponent("Keyboard");
        this.startTimer();
    }

    /**
     * setBinding(sHTMLType, sBinding, control, sValue)
     *
     * Most panel layouts don't have bindings of their own, so we pass along all binding requests to the
     * Computer, CPU, Keyboard and Debugger components first.  The order shouldn't matter, since any component
     * that doesn't recognize the specified binding should simply ignore it.
     *
     * @this {Panel}
     * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
     * @param {HTMLElement} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sHTMLType, sBinding, control, sValue)
    {
        if (this.cmp && this.cmp.setBinding(sHTMLType, sBinding, control, sValue)) return true;
        if (this.cpu && this.cpu.setBinding(sHTMLType, sBinding, control, sValue)) return true;
        if (this.kbd && this.kbd.setBinding(sHTMLType, sBinding, control, sValue)) return true;
        if (DEBUGGER && this.dbg && this.dbg.setBinding(sHTMLType, sBinding, control, sValue)) return true;

        if (!this.canvas && sHTMLType == "canvas") {

            var panel = this;
            var fPanel = false;

            if (BACKTRACK && sBinding == "btpanel") {
                this.fBackTrack = fPanel = true;
            }

            if (fPanel) {
                this.canvas = /** @type {HTMLCanvasElement} */ (control);
                this.context = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext("2d"));

                /*
                 * Employ the same gross onresize() hack for IE9/IE10 that we had to use for the Video canvas
                 */
                if (Web.getUserAgent().indexOf("MSIE") >= 0) {
                    this.canvas.onresize = function(canvas, cx, cy) {
                        return function onResizeVideo() {
                            canvas.style.height = (((canvas.clientWidth * cy) / cx) | 0) + "px";
                        };
                    }(this.canvas, this.canvas.width, this.canvas.height);
                    this.canvas.onresize(null);
                }

                this.xMem = this.yMem = 0;
                this.cxMem = ((this.canvas.width * Panel.LIVEMEM.CX) / Panel.LIVECANVAS.CX) | 0;
                this.cyMem = this.canvas.height;

                this.xReg = this.cxMem;
                this.yReg = 0;
                this.cxReg = this.canvas.width - this.cxMem;
                this.cyReg = this.canvas.height;

                this.xDump = this.xReg;
                this.yDump = ((this.canvas.height * (Panel.LIVEREGS.CY - Panel.LIVEDUMP.CY)) / Panel.LIVECANVAS.CY) | 0;
                this.cxDump = this.cxReg;
                this.cyDump = ((this.canvas.height * Panel.LIVEDUMP.CY) / Panel.LIVECANVAS.CY) | 0;

                this.canvasLiveMem = document.createElement("canvas");
                this.canvasLiveMem.width = Panel.LIVEMEM.CX;
                this.canvasLiveMem.height = Panel.LIVEMEM.CY;
                this.contextLiveMem = this.canvasLiveMem.getContext("2d");
                this.imageLiveMem = this.contextLiveMem.createImageData(this.canvasLiveMem.width, this.canvasLiveMem.height);

                this.canvasLiveRegs = document.createElement("canvas");
                this.canvasLiveRegs.width = Panel.LIVEREGS.CX;
                this.canvasLiveRegs.height = Panel.LIVEREGS.CY;
                this.contextLiveRegs = this.canvasLiveRegs.getContext("2d");

                this.canvas.addEventListener(
                    'mousemove',
                    function onMouseMove(event) {
                        panel.moveMouse(event);
                    },
                    false               // we'll specify false for the 'useCapture' parameter for now...
                );
                this.canvas.addEventListener(
                    'mousedown',
                    function onMouseDown(event) {
                        panel.clickMouse(event, true);
                    },
                    false               // we'll specify false for the 'useCapture' parameter for now...
                );
                this.canvas.addEventListener(
                    'mouseup',
                    function onMouseUp(event) {
                        panel.clickMouse(event, false);
                    },
                    false               // we'll specify false for the 'useCapture' parameter for now...
                );

                this.fRedraw = true;
                this.startTimer();
                return true;
            }
        }
        return super.setBinding(sHTMLType, sBinding, control, sValue);
    }

    /**
     * startTimer()
     *
     * This timer replaces the CPU's old dedicated VIDEO_UPDATES_PER_SECOND logic, which periodically called
     * the Computer's updateVideo() function, which in turn called our updateAnimation() function; periodic
     * animation updates are now our own responsibility.
     *
     * @this {Panel}
     */
    startTimer()
    {
        if (this.timer < 0 && this.canvas && this.cpu) {
            var panel = this;
            this.timer = this.cpu.addTimer(this.id, function() {
                panel.updateAnimation();
            }, 1000 / Panel.UPDATES_PER_SECOND);
        }
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {Panel}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        if (!fRepower) Panel.init();
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {Panel}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown(fSave, fShutdown)
    {
        return true;
    }

    /**
     * clickMouse(event, fDown)
     *
     * @this {Panel}
     * @param {Object} event object from a 'mousedown' or 'mouseup' event
     * @param {boolean} fDown
     */
    clickMouse(event, fDown)
    {
        /*
         * event.button is 0 for the LEFT button and 2 for the RIGHT button
         */
        if (!event.button) {
            this.lockMouse = fDown? 0 : -1;
            this.fMouseDown = fDown;
            this.updateMouse(event, fDown);
        }
    }

    /**
     * moveMouse(event)
     *
     * @this {Panel}
     * @param {Object} event object from a 'mousemove' event
     */
    moveMouse(event)
    {
        this.updateMouse(event);
    }

    /**
     * updateMouse(event, fDown)
     *
     * MouseEvent objects contain, among other things, the following properties:
     *
     *      clientX
     *      clientY
     *
     * I've selected the above properties because they're widely supported, not because I need
     * client-area coordinates.  In fact, layerX and layerY are probably closer to what I really want,
     * but I don't think they're available in all browsers.  screenX and screenY would work as well.
     *
     * @this {Panel}
     * @param {Object} event object from a mouse event (specifically, a MouseEvent object)
     * @param {boolean} [fDown] is true or false if this was a click event, otherwise it's just a move event
     */
    updateMouse(event, fDown)
    {
        /*
         * Due to the responsive nature of our pages, the displayed size of the canvas may be smaller than the
         * allocated size, and the coordinates we receive from mouse events are based on the currently displayed size.
         */
        var xScale = Panel.LIVECANVAS.CX / this.canvas.offsetWidth;
        var yScale = Panel.LIVECANVAS.CY / this.canvas.offsetHeight;

        var rect = this.canvas.getBoundingClientRect();
        var x = ((event.clientX - rect.left) * xScale) | 0;
        var y = ((event.clientY - rect.top) * yScale) | 0;

        if (fDown == null) {
            if (!this.lockMouse) {
                this.lockMouse = Math.abs(this.xMouse - x) > Math.abs(this.yMouse - y)? 1 : 2;
            }
            if (this.lockMouse == 1) {
                y = this.yMouse;
            } else if (this.lockMouse == 2) {
                x = this.xMouse;
            }
        }

        this.xMouse = x;
        this.yMouse = y;

        if (MAXDEBUG) this.log("Panel.moveMouse(" + x + "," + y + ")");

        if (x >= 0 && x < Panel.LIVECANVAS.CX && y >= 0 && y < Panel.LIVECANVAS.CY) {
            /*
             * Convert the mouse position into the corresponding memory address, assuming it's over the live memory area
             */
            var addr = this.findAddress(x, y);
            if (addr !== X86.ADDR_INVALID) {
                addr &= ~0xf;
                if (addr != this.addrDumpLast) {
                    this.dumpMemory(addr, true);
                    this.addrDumpLast = addr;
                }
            }
        }
    }

    /**
     * findAddress(x, y)
     *
     * @this {Panel}
     * @param {number} x
     * @param {number} y
     * @return {number} address corresponding to (x,y) canvas coordinates, or ADDR_INVALID if none
     */
    findAddress(x, y)
    {
        if (x < Panel.LIVEMEM.CX && this.busInfo && this.busInfo.aRects) {
            var i, rect;
            for (i = 0; i < this.busInfo.aRects.length; i++) {
                rect = this.busInfo.aRects[i];
                if (rect.contains(x, y)) {
                    x -= rect.x;
                    y -= rect.y;
                    var region = this.busInfo.aRegions[i];
                    var iBlock = Usr.getBitField(/** @type {BitField} */ (Bus.BlockInfo.num), this.busInfo.aBlocks[region.iBlock]);
                    var addr = iBlock * this.bus.nBlockSize;
                    var addrLimit = (iBlock + region.cBlocks) * this.bus.nBlockSize - 1;

                    /*
                     * If you want memory to be arranged "vertically" instead of "horizontally", do this:
                     *
                     *      if (x > 0) addr += rect.cy * (x - 1) * this.ratioMemoryToPixels;
                     *      addr += (y * this.ratioMemoryToPixels);
                     */
                    if (y > 0) addr += rect.cx * (y - 1) * this.ratioMemoryToPixels;
                    addr += (x * this.ratioMemoryToPixels);

                    addr |= 0;
                    if (addr > addrLimit) addr = addrLimit;
                    if (MAXDEBUG) this.log("Panel.findAddress(" + x + "," + y + ") found type " + Memory.TYPE.NAMES[region.type] + ", address %" + Str.toHex(addr));
                    return addr;
                }
            }
        }
        return X86.ADDR_INVALID;
    }

    /**
     * updateAnimation()
     *
     * If the given Control Panel contains a canvas requiring animation (eg, "btpanel"), then this is where that happens.
     *
     * @this {Panel}
     */
    updateAnimation()
    {
        if (this.fRedraw) {

            this.initPen(10, Panel.LIVECANVAS.FONT.CY, this.canvasLiveMem, this.contextLiveMem, this.canvas.style.color);

            if (this.fBackTrack) {
                if (DEBUG) this.log("begin scanMemory()");
                this.busInfo = this.bus.scanMemory(this.busInfo);
                /*
                 * Calculate the pixel-to-memory-address ratio
                 */
                this.ratioMemoryToPixels = (this.busInfo.cBlocks * this.bus.nBlockSize) / (Panel.LIVEMEM.CX * Panel.LIVEMEM.CY);
                /*
                 * Update the BusInfo object with region information (cRegions and aRegions); return true if region
                 * information has changed since the last call.
                 */
                if (this.findRegions()) {
                    /*
                     * For each region, I choose a slice of the LiveMem canvas and record the corresponding rectangle
                     * within an aRects array (parallel to the aRegions array) in the BusInfo object.
                     *
                     * I don't need a sophisticated Treemap algorithm, because at this level, the data is not hierarchical.
                     * subDivide() makes a simple horizontal or vertical slicing decision based on the ratio of region blocks
                     * to remaining blocks.
                     */
                    var i, rect;
                    var rectAvail = new Rectangle(0, 0, this.canvasLiveMem.width, this.canvasLiveMem.height);
                    this.busInfo.aRects = [];
                    var cBlocksRemaining = this.busInfo.cBlocks;

                    for (i = 0; i < this.busInfo.cRegions; i++) {
                        var cBlocksRegion = this.busInfo.aRegions[i].cBlocks;
                        this.busInfo.aRects.push(rect = rectAvail.subDivide(cBlocksRegion, cBlocksRemaining, !i));
                        if (MAXDEBUG) this.log("region " + i + " rectangle: (" + rect.x + "," + rect.y + " " + rect.cx + "," + rect.cy + ")");
                        cBlocksRemaining -= cBlocksRegion;
                    }

                    /*
                     * Assert that not only did all the specified regions account for all the specified blocks, but also that
                     * the series of subDivide() calls exhausted the original rectangle to one of either zero width or zero height.
                     */
                    this.assert(!cBlocksRemaining && (!rectAvail.cx || !rectAvail.cy));

                    /*
                     * Now draw all the rectangles produced by the series of subDivide() calls.
                     */
                    for (i = 0; i < this.busInfo.aRects.length; i++) {
                        var region = this.busInfo.aRegions[i];
                        rect = this.busInfo.aRects[i];
                        rect.drawWith(this.contextLiveMem, Memory.TYPE.COLORS[region.type]);
                        this.centerPen(rect);
                        this.centerText(Memory.TYPE.NAMES[region.type] + " (" + (((region.cBlocks * this.bus.nBlockSize) / 1024) | 0) + "Kb)");
                    }
                }
                if (DEBUG) this.log("end scanMemory(): total bytes: " + this.busInfo.cbTotal + ", total blocks: " + this.busInfo.cBlocks + ", total regions: " + this.busInfo.cRegions);
            } else {
                this.drawText("This space intentionally left blank");
            }
            this.context.drawImage(this.canvasLiveMem, 0, 0, this.canvasLiveMem.width, this.canvasLiveMem.height, this.xMem, this.yMem, this.cxMem, this.cyMem);
            this.fRedraw = false;
        }
    }

    /**
     * updateStatus(fForce)
     *
     * Update function for Panels containing elements with high-frequency display requirements.
     *
     * For older (and slower) DOM-based display elements, those are sill being managed by the X86CPU component,
     * so it has its own updateStatus() handler.
     *
     * The Computer's updateStatus() handler is currently responsible for calling both our handler and the CPU's handler.
     *
     * @this {Panel}
     * @param {boolean} [fForce] (true will display registers even if the CPU is running and "live" registers are not enabled)
     */
    updateStatus(fForce)
    {
        if (this.canvas) this.dumpRegisters();
    }

    /**
     * findRegions()
     *
     * This takes the BusInfo object produced by scanMemory() and adds the following:
     *
     *      cRegions:   number of contiguous memory regions
     *      aRegions:   array of aBlocks [index, count, type] objects
     *
     * It calls addRegion() for each discrete region (set of contiguous blocks with the same type) that it finds.
     *
     * @this {Panel}
     * @return {boolean} true if current region checksum differed from previous checksum (ie, one or more regions changed)
     */
    findRegions()
    {
        var checksum = 0;
        this.busInfo.cRegions = 0;
        if (!this.busInfo.aRegions) this.busInfo.aRegions = [];

        var typeRegion = -1, iBlockRegion = 0, addrRegion = 0, nBlockPrev = -1;

        for (var iBlock = 0; iBlock < this.busInfo.cBlocks; iBlock++) {
            var blockInfo = this.busInfo.aBlocks[iBlock];
            var typeBlock = Usr.getBitField(/** @type {BitField} */ (Bus.BlockInfo.type), blockInfo);
            var nBlockCurr = Usr.getBitField(/** @type {BitField} */ (Bus.BlockInfo.num), blockInfo);
            if (typeBlock != typeRegion || nBlockCurr != nBlockPrev + 1) {
                var cBlocks = iBlock - iBlockRegion;
                if (cBlocks) {
                    checksum += this.addRegion(addrRegion, iBlockRegion, cBlocks, typeRegion);
                }
                typeRegion = typeBlock;
                iBlockRegion = iBlock;
                addrRegion = nBlockCurr << this.bus.nBlockShift;
            }
            nBlockPrev = nBlockCurr;
        }

        checksum += this.addRegion(addrRegion, iBlockRegion, iBlock - iBlockRegion, typeRegion);

        var fChanged = (this.busInfo.checksumRegions != checksum);
        this.busInfo.checksumRegions = checksum;
        return fChanged;
    }

    /**
     * addRegion(addr, iBlock, cBlocks, type)
     *
     * @this {Panel}
     * @param {number} addr
     * @param {number} iBlock
     * @param {number} cBlocks
     * @param {number} type
     * @return {number} bitfield containing the above values (used for checksum)
     */
    addRegion(addr, iBlock, cBlocks, type)
    {
        if (DEBUG) this.log("region " + this.busInfo.cRegions + " (addr " + Str.toHexLong(addr) + ", type " + Memory.TYPE.NAMES[type] + ") contains " + cBlocks + " blocks");
        this.busInfo.aRegions[this.busInfo.cRegions++] = {iBlock: iBlock, cBlocks: cBlocks, type: type};
        return Usr.initBitFields(Bus.BlockInfo, iBlock, cBlocks, 0, type);
    }

    /**
     * dumpRegisters()
     *
     * Updates the live register portion of the panel.
     *
     * @this {Panel}
     */
    dumpRegisters()
    {
        if (this.context && this.canvasLiveRegs && this.contextLiveRegs) {

            var cpu = this.cpu;
            var x = 0, y = 0, cx = this.canvasLiveRegs.width, cy = this.canvasLiveRegs.height;

            this.contextLiveRegs.fillStyle = Panel.LIVEREGS.COLOR;
            this.contextLiveRegs.fillRect(x, y, cx, cy);

            this.initPen(x + 10, y + Panel.LIVECANVAS.FONT.CY, this.canvasLiveRegs, this.contextLiveRegs, this.canvas.style.color);
            this.initCols(3);
            this.drawText("CPU");
            this.drawText("Target");
            this.drawText("Current");
            this.skipLines();
            this.drawText(cpu.model);
            this.drawText(cpu.getSpeedTarget());
            this.drawText(cpu.getSpeedCurrent());
            this.skipLines(2);
            this.initCols(8);
            this.initNumberFormat(16, cpu.model < X86.MODEL_80386? 4 : 8);
            this.drawText("AX", cpu.regEAX, 2);
            this.drawText("DS", cpu.getDS(), 0, 1);
            this.drawText("DX", cpu.regEDX, 2);
            this.drawText("SI", cpu.regESI, 0, 1.5);
            this.drawText("BX", cpu.regEBX, 2);
            this.drawText("ES", cpu.getES(), 0, 1);
            this.drawText("CX", cpu.regECX, 2);
            this.drawText("DI", cpu.regEDI, 0, 1.5);
            this.drawText("CS", cpu.getCS(), 2);
            this.drawText("SS", cpu.getSS(), 0, 1);
            this.drawText("IP", cpu.getIP(), 2);
            this.drawText("SP", cpu.getSP(), 0, 1.5);
            var regPS;
            this.drawText("PS", regPS = cpu.getPS(), 2);
            this.drawText("BP", cpu.regEBP, 0, 1.5);
            if (cpu.model >= X86.MODEL_80386) {
                this.drawText("FS", cpu.getFS(), 2);
                this.drawText("CR0", cpu.regCR0, 0, 1);
                this.drawText("GS", cpu.getGS(), 2);
                this.drawText("CR3", cpu.regCR3, 0, 1.5);
            }
            this.initCols(9);
            this.drawText("V" + ((regPS & X86.PS.OF)? 1 : 0));
            this.drawText("D" + ((regPS & X86.PS.DF)? 1 : 0));
            this.drawText("I" + ((regPS & X86.PS.IF)? 1 : 0));
            this.drawText("T" + ((regPS & X86.PS.TF)? 1 : 0));
            this.drawText("S" + ((regPS & X86.PS.SF)? 1 : 0));
            this.drawText("Z" + ((regPS & X86.PS.ZF)? 1 : 0));
            this.drawText("A" + ((regPS & X86.PS.AF)? 1 : 0));
            this.drawText("P" + ((regPS & X86.PS.PF)? 1 : 0));
            this.drawText("C" + ((regPS & X86.PS.CF)? 1 : 0), 0, 2);

            this.dumpMemory(this.addrDumpLast);

            this.context.drawImage(this.canvasLiveRegs, x, y, cx, cy, this.xReg, this.yReg, this.cxReg, this.cyReg);
        }
    }

    /**
     * dumpMemory(addr, fDraw)
     *
     * @this {Panel}
     * @param {number} addr
     * @param {boolean} [fDraw]
     */
    dumpMemory(addr, fDraw)
    {
        if (this.context && this.canvasLiveRegs && this.contextLiveRegs) {

            var x = 0, y = Panel.LIVEREGS.CY - Panel.LIVEDUMP.CY, cx = this.canvasLiveRegs.width, cy = Panel.LIVEDUMP.CY;

            this.contextLiveRegs.fillStyle = Panel.LIVEREGS.COLOR;
            this.contextLiveRegs.fillRect(x, y, cx, cy);

            this.initPen(x + 10, y + Panel.LIVECANVAS.FONT.CY, this.canvasLiveRegs, this.contextLiveRegs, this.canvas.style.color);
            this.initCols(24);
            if (addr == null) {
                this.drawText("Mouse over memory to dump");
            } else {
                this.drawText(Str.toHexLong(addr), null, 0, 1);
                for (var iLine = 1; iLine <= 16; iLine++) {
                    var sChars = "";
                    for (var iCol = 1; iCol <= 8; iCol++) {
                        var b = this.bus.getByteDirect(addr++);
                        this.drawText(Str.toHex(b, 2), null, 1);
                        sChars += (b >= 32 && b < 128? String.fromCharCode(b) : ".");
                    }
                    this.drawText(sChars, null, 0, 1);
                }
            }

            if (fDraw) this.context.drawImage(this.canvasLiveRegs, x, y, cx, cy, this.xDump, this.yDump, this.cxDump, this.cyDump);
        }
    }

    /**
     * initPen(xLeft, yTop, canvas, context, sColor, cyFont, sFontFace)
     *
     * @this {Panel}
     * @param {number} xLeft
     * @param {number} yTop
     * @param {HTMLCanvasElement} [canvas]
     * @param {Object} [context]
     * @param {string} [sColor]
     * @param {number} [cyFont]
     * @param {string} [sFontFace]
     */
    initPen(xLeft, yTop, canvas, context, sColor, cyFont, sFontFace)
    {
        this.setPen(this.xLeftMargin = xLeft, yTop);
        this.heightText = this.heightDefault = cyFont || Panel.LIVECANVAS.FONT.CY;
        if (!sFontFace) sFontFace = this.fontDefault || (this.heightDefault + "px " + Panel.LIVECANVAS.FONT.FACE);
        this.fontText = this.fontDefault = sFontFace;
        if (canvas) {
            this.canvasText = canvas;
        }
        if (context) {
            this.contextText = context;
            this.colorText = sColor || "white";
        }
    }

    /**
     * setPen(x, y)
     *
     * @this {Panel}
     * @param {number} x
     * @param {number} y
     */
    setPen(x, y)
    {
        this.xText = x;
        this.yText = y;
    }

    /**
     * centerPen(rect)
     *
     * @this {Panel}
     * @param {Rectangle} rect
     */
    centerPen(rect)
    {
        this.fontText = this.fontDefault;
        this.heightText = this.heightDefault;
        var x = rect.x + (rect.cx >> 1);
        var y = rect.y + (rect.cy >> 1);
        var maxText = rect.cy;
        if (rect.cx < rect.cy) {
            maxText = rect.cx;
            this.fVerticalText = true;
            this.contextText.save();
            this.contextText.translate(x, y);
            this.contextText.rotate(-Math.PI/2);
            x = y = 0;
        }
        if (maxText < this.heightText) {
            this.heightText = maxText;
            this.fontText = this.heightText + "px " + Panel.LIVECANVAS.FONT.FACE;
        }
        this.setPen(x, y);
    }

    /**
     * initCols(nCols)
     *
     * @this {Panel}
     * @param {number} nCols
     */
    initCols(nCols)
    {
        this.cxColumn = (this.canvasText.width / nCols) | 0;
    }

    /**
     * skipCols(nCols)
     *
     * @this {Panel}
     * @param {number} nCols
     */
    skipCols(nCols)
    {
        this.xText += this.cxColumn * nCols;
    }

    /**
     * skipLines(nLines)
     *
     * @this {Panel}
     * @param {number} [nLines]
     */
    skipLines(nLines)
    {
        this.xText = this.xLeftMargin;
        this.yText += (this.heightText + 2) * (nLines || 1);
    }

    /**
     * initNumberFormat(nBase, nDigits)
     *
     * @this {Panel}
     * @param {number} nBase
     * @param {number} nDigits
     */
    initNumberFormat(nBase, nDigits)
    {
        this.nDefaultBase = nBase;
        this.nDefaultDigits = nDigits;
    }

    /**
     * drawText(sText)
     *
     * @this {Panel}
     * @param {string} sText
     * @param {number|null} [nValue]
     * @param {number} [nColsSkip]
     * @param {number} [nLinesSkip]
     */
    drawText(sText, nValue, nColsSkip, nLinesSkip)
    {
        this.contextText.font = this.fontText;
        this.contextText.fillStyle = this.colorText;
        this.contextText.fillText(sText, this.xText, this.yText);
        this.xText += this.cxColumn;
        if (nValue != null) {
            var sValue;
            if (this.nDefaultBase != 16) {
                sValue = nValue.toString();
            } else {
                sValue = this.nDefaultDigits < 8? "0x" : "";
                sValue += Str.toHex(nValue, this.nDefaultDigits);
            }
            this.contextText.fillText(sValue, this.xText, this.yText);
            this.xText += this.cxColumn;
        }
        if (nColsSkip) this.skipCols(nColsSkip);
        if (nLinesSkip) this.skipLines(nLinesSkip);
    }

    /**
     * centerText(sText)
     *
     * To center text within a given Rectangle:
     *
     *      centerPen(rect)
     *      centerText(sText)
     *
     * centerPen() sets xLeft and yTop to the center of the specified rectangle, and centerText() calculates
     * the width of the text, adjusting the horizontal centering by its width and the vertical centering by the
     * default font height.  Then it calls drawText().
     *
     * @this {Panel}
     * @param {string} sText
     */
    centerText(sText)
    {
        this.contextText.font = this.fontText;
        var tm = this.contextText.measureText(sText);
        this.xText -= tm.width >> 1;
        this.yText += (this.heightText >> 1) - 2;
        this.drawText(sText);
        if (this.fVerticalText) {
            this.contextText.restore();
            this.fVerticalText = false;
        }
    }

    /**
     * Panel.init()
     *
     * This function operates on every HTML element of class "panel", extracting the
     * JSON-encoded parameters for the Panel constructor from the element's "data-value"
     * attribute, invoking the constructor to create a Panel component, and then binding
     * any associated HTML controls to the new component.
     *
     * NOTE: Unlike most other component init() functions, this one is designed to be
     * called multiple times: once at load time, so that we can bind our print()
     * function to the panel's output control ASAP, and again when the Computer component
     * is verifying that all components are ready and invoking their powerUp() functions.
     *
     * Our powerUp() method gives us a second opportunity to notify any components that
     * that might care (eg, CPU, Keyboard, and Debugger) that we have some controls they
     * might want to use.
     */
    static init()
    {
        var fReady = false;
        var aePanels = Component.getElementsByClass(document, PCX86.APPCLASS, "panel");
        for (var iPanel=0; iPanel < aePanels.length; iPanel++) {
            var ePanel = aePanels[iPanel];
            var parmsPanel = Component.getComponentParms(ePanel);
            var panel = Component.getComponentByID(parmsPanel['id']);
            if (!panel) {
                fReady = true;
                panel = new Panel(parmsPanel);
            }
            Component.bindComponentControls(panel, ePanel, PCX86.APPCLASS);
            if (fReady) panel.setReady();
        }
    }
}

/*
 * The "Live" canvases that we create internally have the following fixed dimensions, to make drawing
 * simpler.  We then render, via drawImage(), these canvases onto the supplied canvas, which will automatically
 * stretch the live images to fit.
 */
Panel.LIVECANVAS = {
    CX:         1280,
    CY:         720,
    FONT:       {
        CY:     18,
        FACE:   "Monaco, Lucida Console, Courier New"
    }
};

Panel.LIVEMEM = {
    CX: (Panel.LIVECANVAS.CX * 3) >> 2,
    CY: (Panel.LIVECANVAS.CY)
};

Panel.LIVEREGS = {
    CX:     (Panel.LIVECANVAS.CX - Panel.LIVEMEM.CX),
    CY:     (Panel.LIVECANVAS.CY),
    COLOR:  "black"
};

Panel.LIVEDUMP = {
    CX: (Panel.LIVECANVAS.CX - Panel.LIVEMEM.CX),
    CY: (Panel.LIVECANVAS.CY >> 1)
};

/*
 * findRegions() records block numbers in bits 0-14, a BackTrack "mod" bit in bit 15, and the block type at bit 16.
 */
Panel.REGION = {
    MASK:           0x7fff,
    BTMOD_SHIFT:    15,
    TYPE_SHIFT:     16
};

Panel.UPDATES_PER_SECOND = 10;

/*
 * Initialize every Panel module on the page.
 */
Web.onInit(Panel.init);

if (NODE) module.exports = Panel;
