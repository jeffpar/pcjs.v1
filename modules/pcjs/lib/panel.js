/**
 * @fileoverview Implements the PCjs Panel component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jun-19
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
    var Bus         = require("./bus");
    var Memory      = require("./memory");
}

/**
 * Panel(parmsPanel)
 *
 * The Panel component has no required (parmsPanel) properties.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsPanel
 */
function Panel(parmsPanel) {
    Component.call(this, "Panel", parmsPanel, Panel);
    this.canvas = null;
    this.lockMouse = -1;
    this.fMouseDown = false;
    this.xMouse = this.yMouse = -1;
    if (BACKTRACK) {
        this.stats = null;
        this.fBackTrack = false;
    }
}

Component.subclass(Component, Panel);

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

/**
 * Color(r, g, b, a)
 *
 * @constructor
 * @param {number} [r]
 * @param {number} [g]
 * @param {number} [b]
 * @param {number} [a]
 */
function Color(r, g, b, a)
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
Color.prototype.getRandom = function(nLimit)
{
    return (Math.random() * (nLimit || 0x100)) | 0;
};

/**
 * randomize()
 *
 * @this {Color}
 */
Color.prototype.randomize = function()
{
    this.rgb[0] = this.getRandom(); this.rgb[1] = this.getRandom(); this.rgb[2] = this.getRandom(); this.rgb[3] = 0xff;
    this.sValue = null;
};

/**
 * toString()
 *
 * @this {Color}
 * @return {string}
 */
Color.prototype.toString = function()
{
    if (!this.sValue) this.sValue = '#' + str.toHexByte(this.rgb[0]) + str.toHexByte(this.rgb[1]) + str.toHexByte(this.rgb[2]);
    return this.sValue;
};

/**
 * Rectangle(x, y, cx, cy)
 *
 * @constructor
 * @param {number} x
 * @param {number} y
 * @param {number} cx
 * @param {number} cy
 */
function Rectangle(x, y, cx, cy)
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
Rectangle.prototype.contains = function(x, y)
{
    return (x >= this.x && x < this.x + this.cx && y >= this.y && y < this.y + this.cy);
};

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
Rectangle.prototype.subDivide = function(units, unitsTotal, fHorizontal)
{
    var rect;
    if (fHorizontal || units >= (unitsTotal >> 2)) {
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
};

/**
 * drawWith(context, color)
 *
 * @param {Object} context
 * @param {Color|string} [color]
 */
Rectangle.prototype.drawWith = function(context, color)
{
    if (!color) color = new Color();
    context.fillStyle = (typeof color == "string"? color : color.toString());
    context.fillRect(this.x, this.y, this.cx, this.cy);
};

/**
 * setBinding(sHTMLType, sBinding, control)
 *
 * Most panel layouts don't have bindings of their own, so we pass along all binding requests to the
 * Computer, CPU, Keyboard and Debugger components first.  The order shouldn't matter, since any component
 * that doesn't recognize the specified binding should simply ignore it.
 *
 * @this {Panel}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Panel.prototype.setBinding = function(sHTMLType, sBinding, control)
{
    if (this.cmp && this.cmp.setBinding(sHTMLType, sBinding, control)) return true;
    if (this.cpu && this.cpu.setBinding(sHTMLType, sBinding, control)) return true;
    if (this.kbd && this.kbd.setBinding(sHTMLType, sBinding, control)) return true;
    if (DEBUGGER && this.dbg && this.dbg.setBinding(sHTMLType, sBinding, control)) return true;

    if (!this.canvas && sHTMLType == "canvas") {

        var panel = this;
        var fPanel = false;

        if (BACKTRACK && sBinding == "btpanel") {
            this.fBackTrack = fPanel = true;
        }

        if (fPanel) {
            this.canvas = control;
            this.context = this.canvas.getContext("2d");

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

            this.canvasLiveMem = window.document.createElement("canvas");
            this.canvasLiveMem.width = Panel.LIVEMEM.CX;
            this.canvasLiveMem.height = Panel.LIVEMEM.CY;
            this.contextLiveMem = this.canvasLiveMem.getContext("2d");
            this.imageLiveMem = this.contextLiveMem.createImageData(this.canvasLiveMem.width, this.canvasLiveMem.height);

            this.canvasLiveRegs = window.document.createElement("canvas");
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
            return true;
        }
    }
    return this.parent.setBinding.call(this, sHTMLType, sBinding, control);
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {Panel}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {X86CPU} cpu
 * @param {Debugger} dbg
 */
Panel.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.kbd = cmp.getComponentByType("Keyboard");
};

/**
 * powerUp(data, fRepower)
 *
 * @this {Panel}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
Panel.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) Panel.init();
    return true;
};

/**
 * powerDown(fSave)
 *
 * @this {Panel}
 * @param {boolean} fSave
 * @return {Object|boolean}
 */
Panel.prototype.powerDown = function(fSave)
{
    return true;
};

/**
 * clickMouse(event, fDown)
 *
 * @this {Panel}
 * @param {Object} event object from a 'mousedown' or 'mouseup' event
 * @param {boolean} fDown
 */
Panel.prototype.clickMouse = function(event, fDown)
{
    /*
     * event.button is 0 for the LEFT button and 2 for the RIGHT button
     */
    if (!event.button) {
        this.lockMouse = fDown? 0 : -1;
        this.fMouseDown = fDown;
        this.updateMouse(event, fDown);
    }
};

/**
 * moveMouse(event)
 *
 * @this {Panel}
 * @param {Object} event object from a 'mousemove' event
 */
Panel.prototype.moveMouse = function(event)
{
    this.updateMouse(event);
};

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
 * @param {boolean} [fDown]
 */
Panel.prototype.updateMouse = function(event, fDown)
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
    this.assert(x >= 0 && x < Panel.LIVECANVAS.CX && y >= 0 && y < Panel.LIVECANVAS.CY);
    /*
     * Convert the mouse position into the corresponding memory address, assuming it's over the live memory area
     */
    var addr = this.findAddress(x, y);
    if (addr != X86.ADDR_INVALID) {
        addr &= ~0xf;
        if (addr != this.addrDumpLast) {
            this.dumpMemory(addr, true);
            this.addrDumpLast = addr;
        }
    }
};

/**
 * findAddress(x, y)
 *
 * @this {Panel}
 * @param {number} x
 * @param {number} y
 * @return {number} address corresponding to (x,y) canvas coordinates, or ADDR_INVALID if none
 */
Panel.prototype.findAddress = function(x, y)
{
    if (x < Panel.LIVEMEM.CX && this.stats && this.stats.aRects) {
        var i, rect;
        for (i = 0; i < this.stats.aRects.length; i++) {
            rect = this.stats.aRects[i];
            if (rect.contains(x, y)) {
                x -= rect.x;
                y -= rect.y;
                var nRegion = this.stats.aRegions[i];
                var iBlock = this.stats.aBlocks[nRegion & Bus.BLOCK.NUM_MASK] & Bus.BLOCK.NUM_MASK;
                var cBlocks = (nRegion >> Bus.BLOCK.COUNT_SHIFT) & Bus.BLOCK.COUNT_MASK;
                var type = (nRegion >> Bus.BLOCK.TYPE_SHIFT) & Bus.BLOCK.TYPE_MASK;
                var addr = iBlock * this.bus.blockSize;
                var addrLimit = (iBlock + cBlocks) * this.bus.blockSize - 1;

                /*
                 * If you want memory to be displayed "vertically" instead of "horizontally", do this instead:
                 *
                 *      if (x > 0) addr += rect.cy * (x - 1) * this.ratioMemoryToPixels;
                 *      addr += (y * this.ratioMemoryToPixels);
                 */
                if (y > 0) addr += rect.cx * (y - 1) * this.ratioMemoryToPixels;
                addr += (x * this.ratioMemoryToPixels);

                addr |= 0;
                if (addr > addrLimit) addr = addrLimit;
                if (MAXDEBUG) this.log("Panel.findAddress(" + x + "," + y + ") found type " + Memory.TYPE.NAMES[type] + ", address %" + str.toHex(addr));
                return addr;
            }
        }
    }
    return X86.ADDR_INVALID;
};

/**
 * updateAnimation()
 *
 * If the given Control Panel contains a canvas requiring animation (eg, "btpanel"), then this is where that happens.
 *
 * @this {Panel}
 */
Panel.prototype.updateAnimation = function()
{
    if (this.fRedraw) {

        this.initPen(10, Panel.LIVECANVAS.FONT.CY, this.canvasLiveMem, this.contextLiveMem, this.canvas.style.color);

        if (this.fBackTrack) {
            if (DEBUG) this.log("begin scanMemory()");
            this.stats = this.bus.scanMemory(this.stats);
            /*
             * Calculate the pixel-to-memory-address ratio
             */
            this.ratioMemoryToPixels = (this.stats.cBlocks * this.bus.blockSize) / (Panel.LIVEMEM.CX * Panel.LIVEMEM.CY);
            /*
             * Update the Stats object with region information (cRegions and aRegions); return true if region
             * information has changed since the last call.
             */
            if (this.findRegions()) {
                /*
                 * For each region, I choose a slice of the LiveMem canvas and record the corresponding rectangle
                 * within an aRects array (parallel to the aRegions array) in the Stats object.
                 *
                 * I don't need a sophisticated Treemap algorithm, because at this level, the data is not hierarchical.
                 * subDivide() makes a simple horizontal or vertical slicing decision based on the ratio of region blocks
                 * to remaining blocks.
                 */
                var i, rect;
                var rectAvail = new Rectangle(0, 0, this.canvasLiveMem.width, this.canvasLiveMem.height);
                this.stats.aRects = [];
                var cBlocksRemaining = this.stats.cBlocks;
                for (i = 0; i < this.stats.cRegions; i++) {
                    var cBlocksRegion = (this.stats.aRegions[i] >> Bus.BLOCK.COUNT_SHIFT) & Bus.BLOCK.COUNT_MASK;
                    this.stats.aRects.push(rect = rectAvail.subDivide(cBlocksRegion, cBlocksRemaining, true));
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
                for (i = 0; i < this.stats.aRects.length; i++) {
                    var nRegion = this.stats.aRegions[i];
                    var type = (nRegion >> Bus.BLOCK.TYPE_SHIFT) & Bus.BLOCK.TYPE_MASK;
                    var cBlocks = (nRegion >> Bus.BLOCK.COUNT_SHIFT) & Bus.BLOCK.COUNT_MASK;
                    rect = this.stats.aRects[i];
                    rect.drawWith(this.contextLiveMem, Memory.TYPE.COLORS[type]);
                    this.centerPen(rect);
                    this.centerText(Memory.TYPE.NAMES[type] + " (" + (((cBlocks * this.bus.blockSize) / 1024) | 0) + "Kb)");
                }
            }
            if (DEBUG) this.log("end scanMemory(): total bytes: " + this.stats.cbTotal + ", total blocks: " + this.stats.cBlocks + ", total regions: " + this.stats.cRegions);
        } else {
            this.drawText("This space intentionally left blank");
        }
        this.context.drawImage(this.canvasLiveMem, 0, 0, this.canvasLiveMem.width, this.canvasLiveMem.height, this.xMem, this.yMem, this.cxMem, this.cyMem);
        this.fRedraw = false;
    }
};

/**
 * updateStatus()
 *
 * Update function for Control Panels containing DOM elements with low-frequencyxt display requirements.
 *
 * For the time being, the X86CPU component has its own updateStatus() handler, and displays all CPU registers itself.
 *
 * @this {Panel}
 */
Panel.prototype.updateStatus = function()
{
    if (this.canvas) {
        this.dumpRegisters();
    }
};

/**
 * findRegions()
 *
 * This takes the Stats object produced by scanMemory() and adds the following:
 *
 *      cRegions:   number of contiguous memory regions
 *      aRegions:   array of aBlocks indexes (bits 0-14) combined with block counts (bits 16-27) and block types (bits 28-31)
 *
 * It calls addRegion() for each discrete region (set of contiguous blocks with the same type) that it finds.
 *
 * @this {Panel}
 * @return {boolean} true if current region checksum differed from previous checksum (ie, one or more regions changed)
 */
Panel.prototype.findRegions = function()
{
    var checksum = 0;
    this.stats.cRegions = 0;
    if (!this.stats.aRegions) this.stats.aRegions = [];
    var typeRegion = -1, iBlockRegion = 0, addrRegion = 0, nBlockPrev = -1;
    for (var iBlock = 0; iBlock < this.stats.cBlocks; iBlock++) {
        var nBlock = this.stats.aBlocks[iBlock];
        var type = nBlock >>> Bus.BLOCK.TYPE_SHIFT;
        var nBlockCurr = (nBlock & Bus.BLOCK.NUM_MASK);
        if (type != typeRegion || nBlockCurr != nBlockPrev + 1) {
            var cBlocks = iBlock - iBlockRegion;
            if (cBlocks) {
                checksum += this.addRegion(addrRegion, iBlockRegion, cBlocks, typeRegion);
            }
            typeRegion = type;
            iBlockRegion = iBlock;
            addrRegion = (nBlock & Bus.BLOCK.NUM_MASK) << this.bus.blockShift;
        }
        nBlockPrev = nBlockCurr;
    }
    checksum += this.addRegion(addrRegion, iBlockRegion, iBlock - iBlockRegion, typeRegion);
    var fChanged = (this.stats.checksumRegions != checksum);
    this.stats.checksumRegions = checksum;
    return fChanged;
};

/**
 * addRegion(addr, iBlock, cBlocks, type)
 *
 * @this {Panel}
 * @param {number} addr
 * @param {number} iBlock
 * @param {number} cBlocks
 * @param {number} type
 * @return {number} region data added
 */
Panel.prototype.addRegion = function(addr, iBlock, cBlocks, type)
{
    if (DEBUG) this.log("region " + this.stats.cRegions + " (addr " + str.toHex(addr) + ", type " + Memory.TYPE.NAMES[type] + ") contains " + cBlocks + " blocks");
    this.assert(iBlock <= Bus.BLOCK.NUM_MASK && cBlocks <= Bus.BLOCK.COUNT_MASK && type <= Bus.BLOCK.TYPE_MASK);
    return this.stats.aRegions[this.stats.cRegions++] = (iBlock | (cBlocks << Bus.BLOCK.COUNT_SHIFT) | (type << Bus.BLOCK.TYPE_SHIFT));
};

/**
 * dumpRegisters()
 *
 * Updates the live register portion of the panel.
 *
 * @this {Panel}
 */
Panel.prototype.dumpRegisters = function()
{
    if (this.context && this.canvasLiveRegs && this.contextLiveRegs) {

        var x = 0, y = 0, cx = this.canvasLiveRegs.width, cy = this.canvasLiveRegs.height;

        this.contextLiveRegs.fillStyle = Panel.LIVEREGS.COLOR;
        this.contextLiveRegs.fillRect(x, y, cx, cy);

        this.initPen(x + 10, y + Panel.LIVECANVAS.FONT.CY, this.canvasLiveRegs, this.contextLiveRegs, this.canvas.style.color);
        this.initCols(3);
        this.drawText("CPU");
        this.drawText("Target");
        this.drawText("Current");
        this.skipLines();
        this.drawText(this.cpu.model);
        this.drawText(this.cpu.getSpeedTarget());
        this.drawText(this.cpu.getSpeedCurrent());
        this.skipLines(2);
        this.initCols(8);
        this.initNumberFormat(16, 4);
        this.drawText("AX", this.cpu.regEAX, 2);
        this.drawText("DS", this.cpu.getDS(), 0, 1);
        this.drawText("DX", this.cpu.regEDX, 2);
        this.drawText("SI", this.cpu.regESI, 0, 1.5);
        this.drawText("BX", this.cpu.regEBX, 2);
        this.drawText("ES", this.cpu.getES(), 0, 1);
        this.drawText("CX", this.cpu.regECX, 2);
        this.drawText("DI", this.cpu.regEDI, 0, 1.5);
        this.drawText("CS", this.cpu.getCS(), 2);
        this.drawText("SS", this.cpu.getSS(), 0, 1);
        this.drawText("IP", this.cpu.getIP(), 2);
        this.drawText("SP", this.cpu.getSP(), 0, 1.5);
        var regPS;
        this.drawText("PS", regPS = this.cpu.getPS(), 2);
        this.drawText("BP", this.cpu.regEBP, 0, 1.5);
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
};

/**
 * dumpMemory(addr, fDraw)
 *
 * @this {Panel}
 * @param {number} addr
 * @param {boolean} [fDraw]
 */
Panel.prototype.dumpMemory = function(addr, fDraw)
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
            this.drawText("0x" + str.toHex(addr), null, 0, 1);
            for (var iLine = 1; iLine <= 16; iLine++) {
                var sChars = "";
                for (var iCol = 1; iCol <= 8; iCol++) {
                    var b = this.bus.getByteDirect(addr++);
                    this.drawText(str.toHexByte(b), null, 1);
                    sChars += (b >= 32 && b < 128? String.fromCharCode(b) : ".");
                }
                this.drawText(sChars, null, 0, 1);
            }
        }

        if (fDraw) this.context.drawImage(this.canvasLiveRegs, x, y, cx, cy, this.xDump, this.yDump, this.cxDump, this.cyDump);
    }
};

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
Panel.prototype.initPen = function(xLeft, yTop, canvas, context, sColor, cyFont, sFontFace)
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
};

/**
 * setPen(x, y)
 *
 * @this {Panel}
 * @param {number} x
 * @param {number} y
 */
Panel.prototype.setPen = function(x, y)
{
    this.xText = x;
    this.yText = y;
};

/**
 * centerPen(rect)
 *
 * @this {Panel}
 * @param {Rectangle} rect
 */
Panel.prototype.centerPen = function(rect)
{
    this.fontText = this.fontDefault;
    this.heightText = this.heightDefault;
    if (rect.cy < this.heightText) {
        this.heightText = rect.cy;
        this.fontText = this.heightText + "px " + Panel.LIVECANVAS.FONT.FACE;
    }
    this.setPen(rect.x + (rect.cx >> 1), rect.y + (rect.cy >> 1));
};

/**
 * initCols(nCols)
 *
 * @this {Panel}
 * @param {number} nCols
 */
Panel.prototype.initCols = function(nCols)
{
    this.cxColumn = (this.canvasText.width / nCols) | 0;
};

/**
 * skipCols(nCols)
 *
 * @this {Panel}
 * @param {number} nCols
 */
Panel.prototype.skipCols = function(nCols)
{
    this.xText += this.cxColumn * nCols;
};

/**
 * skipLines(nLines)
 *
 * @this {Panel}
 * @param {number} [nLines]
 */
Panel.prototype.skipLines = function(nLines)
{
    this.xText = this.xLeftMargin;
    this.yText += (this.heightText + 2) * (nLines || 1);
};

/**
 * initNumberFormat(nBase, nDigits)
 *
 * @this {Panel}
 * @param {number} nBase
 * @param {number} nDigits
 */
Panel.prototype.initNumberFormat = function(nBase, nDigits)
{
    this.nDefaultBase = nBase;
    this.nDefaultDigits = nDigits;
};

/**
 * drawText(sText)
 *
 * @this {Panel}
 * @param {string} sText
 * @param {number|null} [nValue]
 * @param {number} [nColsSkip]
 * @param {number} [nLinesSkip]
 */
Panel.prototype.drawText = function(sText, nValue, nColsSkip, nLinesSkip)
{
    this.contextText.font = this.fontText;
    this.contextText.fillStyle = this.colorText;
    this.contextText.fillText(sText, this.xText, this.yText);
    this.xText += this.cxColumn;
    if (nValue != null) {
        var sValue = nValue.toString();
        if (this.nDefaultBase == 16) {
            sValue = "0x" + str.toHex(nValue, this.nDefaultDigits);
        }
        this.contextText.fillText(sValue, this.xText, this.yText);
        this.xText += this.cxColumn;
    }
    if (nColsSkip) this.skipCols(nColsSkip);
    if (nLinesSkip) this.skipLines(nLinesSkip);
};

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
 * default font height.  Then it call drawText().
 *
 * @this {Panel}
 * @param {string} sText
 */
Panel.prototype.centerText = function(sText)
{
    this.contextText.font = this.fontText;
    var tm = this.contextText.measureText(sText);
    this.xText -= tm.width >> 1;
    this.yText += (this.heightText >> 1) - 1;
    this.drawText(sText);
};

/**
 * Panel.init()
 *
 * This function operates on every HTML element of class "panel", extracting the
 * JSON-encoded parameters for the Panel constructor from the element's "data-value"
 * attribute, invoking the constructor to create a Panel component, and then binding
 * any associated HTML controls to the new component.
 *
 * NOTE: Unlike most other component init() functions, this one is designed to be
 * called multiple times: once at load time, so that we can binding our print()
 * function to the panel's output control ASAP, and again when the Computer component
 * is verifying that all components are ready and invoking their powerUp() functions.
 *
 * Our powerUp() method gives us a second opportunity to notify any components that
 * that might care (eg, CPU, Keyboard, and Debugger) that we have some controls they
 * might want to use.
 */
Panel.init = function()
{
    var fReady = false;
    var aePanels = Component.getElementsByClass(window.document, PCJSCLASS, "panel");
    for (var iPanel=0; iPanel < aePanels.length; iPanel++) {
        var ePanel = aePanels[iPanel];
        var parmsPanel = Component.getComponentParms(ePanel);
        var panel = Component.getComponentByID(parmsPanel['id']);
        if (!panel) {
            fReady = true;
            panel = new Panel(parmsPanel);
        }
        Component.bindComponentControls(panel, ePanel, PCJSCLASS);
        if (fReady) panel.setReady();
    }
};

/*
 * Initialize every Panel module on the page.
 */
web.onInit(Panel.init);

if (typeof APP_PCJS !== 'undefined') APP_PCJS.Panel = Panel;

if (typeof module !== 'undefined') module.exports = Panel;
