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
    WIDTH:      1280,
    HEIGHT:     720,
    FONT:       {
        NAME:   "Monaco",
        HEIGHT: 18
    }
};

Panel.LIVEMEMORY = {
    WIDTH:  (Panel.LIVECANVAS.WIDTH * 3) >> 2,
    HEIGHT: Panel.LIVECANVAS.HEIGHT
};

Panel.LIVEREGISTERS = {
    WIDTH:  (Panel.LIVECANVAS.WIDTH - Panel.LIVEMEMORY.WIDTH),
    HEIGHT: Panel.LIVECANVAS.HEIGHT
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
        var fPanel = false;
        if (BACKTRACK && sBinding == "btpanel") {
            this.fBackTrack = fPanel = true;
        }
        if (fPanel) {
            this.canvas = control;
            this.context = this.canvas.getContext("2d");

            this.xMemory = this.yMemory = 0;
            this.cxMemory = ((this.canvas.width * Panel.LIVEMEMORY.WIDTH) / Panel.LIVECANVAS.WIDTH) | 0;
            this.cyMemory = this.canvas.height;
            this.xRegisters = this.cxMemory;
            this.yRegisters = 0;
            this.cxRegisters = this.canvas.width - this.cxMemory;
            this.cyRegisters = this.canvas.height;

            this.canvasLiveMemory = window.document.createElement("canvas");
            this.canvasLiveMemory.width = Panel.LIVEMEMORY.WIDTH;
            this.canvasLiveMemory.height = Panel.LIVEMEMORY.HEIGHT;
            this.contextLiveMemory = this.canvasLiveMemory.getContext("2d");
            this.contextLiveMemory.font = Panel.LIVECANVAS.FONT.HEIGHT + "px " + Panel.LIVECANVAS.FONT.NAME;
            this.imageLiveMemory = this.contextLiveMemory.createImageData(this.canvasLiveMemory.width, this.canvasLiveMemory.height);

            this.canvasLiveRegisters = window.document.createElement("canvas");
            this.canvasLiveRegisters.width = Panel.LIVEREGISTERS.WIDTH;
            this.canvasLiveRegisters.height = Panel.LIVEREGISTERS.HEIGHT;
            this.contextLiveRegisters = this.canvasLiveRegisters.getContext("2d");
            this.contextLiveRegisters.font = Panel.LIVECANVAS.FONT.HEIGHT + "px " + Panel.LIVECANVAS.FONT.NAME;

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
    if (!fRepower) {
        Panel.init();
    }
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
 * updateAnimation()
 *
 * If the given Control Panel contains a canvas requiring animation (eg, "btpanel"), then this is where that happens.
 *
 * @this {Panel}
 */
Panel.prototype.updateAnimation = function()
{
    if (this.fRedraw) {
        if (this.fBackTrack) {
            if (MAXDEBUG) this.log("begin scanMemory()");
            this.stats = this.bus.scanMemory(this.stats);
            this.findRegions();
            if (MAXDEBUG) this.log("end scanMemory(): total bytes: " + this.stats.cbTotal + ", total blocks: " + this.stats.cBlocks + ", total regions: " + this.stats.cRegions);
        }
        this.initPen(10, Panel.LIVECANVAS.FONT.HEIGHT, this.canvasLiveMemory, this.contextLiveMemory);
        this.drawText("This space intentionally left blank");
        this.context.drawImage(this.canvasLiveMemory, 0, 0, this.canvasLiveMemory.width, this.canvasLiveMemory.height, this.xMemory, this.yMemory, this.cxMemory, this.cyMemory);
        this.fRedraw = false;
    }
};

/**
 * updateStatus()
 *
 * Update function for Control Panels containing DOM elements with low-frequency display requirements.
 *
 * For the time being, the X86CPU component has its own updateStatus() handler, and displays all CPU registers itself.
 *
 * @this {Panel}
 */
Panel.prototype.updateStatus = function()
{
    if (this.canvas) {
        this.updateRegisters();
    }
};

/**
 * findRegions()
 *
 * This takes the stats object produced by scanMemory() and adds the following:
 *
 *      cRegions:   number of contiguous memory regions
 *      aRegions:   array of aBlocks indexes (bits 0-15) combined with block counts (bits 16-31)
 *
 * It calls addRegion() for each discrete region (set of contiguous blocks with the same type) that it finds.
 *
 * @this {Panel}
 */
Panel.prototype.findRegions = function()
{
    this.stats.cRegions = 0;
    if (!this.stats.aRegions) this.stats.aRegions = [];
    var typeRegion = -1, iBlockRegion = 0, addrRegion = 0, nBlockPrev = -1;
    for (var iBlock = 0; iBlock < this.stats.cBlocks; iBlock++) {
        var nBlock = this.stats.aBlocks[iBlock];
        var type = nBlock >>> Bus.BLOCK.TYPE_SHIFT;
        var nBlockCurr = (nBlock & Bus.BLOCK.MASK);
        if (type != typeRegion || nBlockCurr != nBlockPrev + 1) {
            var cBlocks = iBlock - iBlockRegion;
            if (cBlocks) this.addRegion(addrRegion, iBlockRegion, cBlocks, typeRegion);
            typeRegion = type;
            iBlockRegion = iBlock;
            addrRegion = (nBlock & Bus.BLOCK.MASK) << this.bus.blockShift;
        }
        nBlockPrev = nBlockCurr;
    }
    this.addRegion(addrRegion, iBlockRegion, iBlock - iBlockRegion, typeRegion);
};

/**
 * addRegion(addr, iBlock, cBlocks, type)
 *
 * @this {Panel}
 * @param {number} addr
 * @param {number} iBlock
 * @param {number} cBlocks
 * @param {number} type
 */
Panel.prototype.addRegion = function(addr, iBlock, cBlocks, type)
{
    this.stats.aRegions[this.stats.cRegions++] = (iBlock | cBlocks << 16);
    if (MAXDEBUG) this.log("region " + this.stats.cRegions + " (addr " + str.toHex(addr) + ", type " + Memory.TYPE.NAMES[type] + ") contains " + cBlocks + " blocks");
};

/**
 * updateRegisters()
 *
 * Updates the live register portion of the panel.
 *
 * @this {Panel}
 */
Panel.prototype.updateRegisters = function()
{
    if (this.context && this.canvasLiveRegisters && this.contextLiveRegisters) {

        this.contextLiveRegisters.fillStyle = "black";
        this.contextLiveRegisters.fillRect(0, 0, this.canvasLiveRegisters.width, this.canvasLiveRegisters.height);

        this.initPen(10, Panel.LIVECANVAS.FONT.HEIGHT, this.canvasLiveRegisters, this.contextLiveRegisters);
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
        this.drawText("SI", this.cpu.regESI, 0, 1);
        this.drawText("BX", this.cpu.regEBX, 2);
        this.drawText("DI", this.cpu.regEDI, 0, 1);
        this.drawText("CX", this.cpu.regECX, 2);
        this.drawText("SP", this.cpu.regESP, 0, 1);
        this.drawText("DX", this.cpu.regEDX, 2);
        this.drawText("BP", this.cpu.regEBP, 0, 2);
        this.drawText("CS", this.cpu.segCS.sel, 2);
        this.drawText("DS", this.cpu.segDS.sel, 0, 1);
        this.drawText("SS", this.cpu.segSS.sel, 2);
        this.drawText("ES", this.cpu.segES.sel, 0, 2);
        this.drawText("IP", this.cpu.regEIP, 2);
        var regPS;
        this.drawText("PS", regPS = this.cpu.getPS(), 0, 2);
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
        this.context.drawImage(this.canvasLiveRegisters, 0, 0, this.canvasLiveRegisters.width, this.canvasLiveRegisters.height, this.xRegisters, this.yRegisters, this.cxRegisters, this.cyRegisters);
    }
};

/**
 * initPen(xLeft, yTop, canvasText, contextText)
 *
 * @this {Panel}
 * @param {number} xLeft
 * @param {number} yTop
 * @param {Object} [canvasText]
 * @param {Object} [contextText]
 */
Panel.prototype.initPen = function(xLeft, yTop, canvasText, contextText)
{
    this.xLeftMargin = this.xLeft = xLeft;
    this.yTop = yTop;
    if (canvasText) {
        this.canvasText = canvasText;
    }
    if (contextText) {
        this.contextText = contextText;
        this.contextText.fillStyle = this.canvas.style.color
    }
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
    this.xLeft += this.cxColumn * nCols;
};

/**
 * skipLines(nLines)
 *
 * @this {Panel}
 * @param {number} [nLines]
 */
Panel.prototype.skipLines = function(nLines)
{
    this.xLeft = this.xLeftMargin;
    this.yTop += (Panel.LIVECANVAS.FONT.HEIGHT + 2) * (nLines || 1);
};

/**
 * initNumberFormat(nBase, nDigits)
 *
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
 * @param {number} [nValue]
 * @param {number} [nColsSkip]
 * @param {number} [nLinesSkip]
 */
Panel.prototype.drawText = function(sText, nValue, nColsSkip, nLinesSkip)
{
    this.contextText.fillText(sText, this.xLeft, this.yTop);
    this.xLeft += this.cxColumn;
    if (nValue !== undefined) {
        var sValue = nValue.toString();
        if (this.nDefaultBase == 16) {
            sValue = "0x" + str.toHex(nValue, this.nDefaultDigits);
        }
        this.contextText.fillText(sValue, this.xLeft, this.yTop);
        this.xLeft += this.cxColumn;
    }
    if (nColsSkip) this.skipCols(nColsSkip);
    if (nLinesSkip) this.skipLines(nLinesSkip);
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
