/**
 * @fileoverview Implements the PCjs Video component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jun-15
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
    var DumpAPI     = require("../../shared/lib/dumpapi");
    var Component   = require("../../shared/lib/component");
    var Memory      = require("./memory");
    var Messages    = require("./messages");
    var ChipSet     = require("./chipset");
    var Keyboard    = require("./keyboard");
    var State       = require("./state");
}

/**
 * Video(parmsVideo, canvas, context, textarea, container)
 *
 * The Video component can be configured with the following (parmsVideo) properties:
 *
 *      model: model (eg, "mda" for Monochrome Display Adapter)
 *      mode: mode number (hardware-specific, 7 is the default)
 *      memory: amount of installed memory (ignored for MDA/CGA)
 *      screenWidth: width of the screen window, in pixels
 *      screenHeight: height of the screen window, in pixels
 *      scale: true for font scaling, false (default) to center the display on the screen
 *      charCols: number of character columns
 *      charRows: number of character rows
 *      fontROM: path to .rom file (or a JSON representation) that defines the character set
 *      screenColor: background color of the screen window (default is black)
 *      autoLock: true to (attempt to) automatically lock the mouse to the canvas (default is false)
 *
 * An EGA may specify the following additional properties:
 *
 *      switches: string representing EGA switches (see "SW1-SW4" documentation below)
 *      memory: the size of the EGA's on-board memory (overrides EGA's Video.cardSpecs)
 *
 * This calls the CPU to allocate a video buffer at the appropriate memory location whenever
 * a reset() or setMode() occurs; setMode() is called whenever a mode change is detected at
 * the port level, and whenever reset() is called.  setMode() also invokes updateScreen(true),
 * which forces reallocation of our internal buffer (aCellCache) that mirrors the video buffer.
 *
 * The CPU periodically calls updateScreen(), at an assumed rate of 60 times/second,
 * to update any blinking elements (the cursor and any characters with the blink attribute),
 * to compare/update the contents of our internal buffer with the video buffer, and to render
 * any differences between the two buffers in the associated window, via either updateChar()
 * or setPixel().
 *
 * Thanks to the CPU's new block-based memory manager that allows us to sparse-allocate memory
 * (in 4Kb increments on 20-bit buses, 16Kb increments on 24-bit buses), updateScreen()
 * can also ask the CPU for the "dirty" state of all the blocks underlying the video buffer,
 * bypassing the update completely if the buffer is still clean.
 *
 * Unfortunately, that optimization is defeated if our count of active blink elements is non-zero,
 * because we must rescan the entire buffer to locate and redraw them all; I'm assuming for now
 * that, more often than not, blink attributes will not be present, and therefore they're not worth
 * a separate caching mechanism.  If the only blinking element is the cursor, that's no problem,
 * as we redraw only the one cell containing the cursor (assuming the buffer is otherwise clean).
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsVideo
 * @param {Object} [canvas]
 * @param {Object} [context]
 * @param {Object} [textarea]
 * @param {Object} [container]
 */
function Video(parmsVideo, canvas, context, textarea, container)
{
    Component.call(this, "Video", parmsVideo, Video, Messages.VIDEO);

    /*
     * This records the model specified (eg, "mda", "cga", "ega" or "" if none specified);
     * when a model is specified, it overrides whatever model we infer from the ChipSet's switches
     * (since those motherboard switches tell us only the type of monitor, not the type of card).
     */
    this.model = parmsVideo['model'];
    this.cbMemory = 0;

    if (this.model == "ega") {
        this.sEGASW = parmsVideo['switches'];
        this.cbMemory = parmsVideo['memory'] || 0;      // zero means fallback to the cardSpec's default size
    }

    /*
     * powerUp() uses the default mode ONLY if ChipSet doesn't give us a default.
     */
    this.nModeDefault = parmsVideo['mode'];
    if (this.nModeDefault === undefined || Video.aModeParms[this.nModeDefault] === undefined) {
        this.nModeDefault = Video.MODES.MDA_80X25;
    }

    /*
     * setDimensions() uses these values ONLY if it doesn't recognize the video mode.
     */
    this.nDefaultCols = parmsVideo['charCols'];
    this.nDefaultRows = parmsVideo['charRows'];
    if (this.nDefaultCols === undefined || this.nDefaultRows === undefined) {
        this.nDefaultCols = Video.aModeParms[this.nModeDefault][0];
        this.nDefaultRows = Video.aModeParms[this.nModeDefault][1];
    }

    /*
     * setDimensions() uses these values unconditionally, as the machine has no idea what the
     * physical screen size should be.
     */
    this.cxScreen = parmsVideo['screenWidth'];
    this.cyScreen = parmsVideo['screenHeight'];

    /*
     * We might consider another component parameter to specify the font-doubling setting.
     * For now, it's based on whether the default SCREEN cell size is sufficiently larger than
     * the default FONT cell size.
     */
    this.fScaleFont = parmsVideo['scale'];
    this.fDoubleFont = Math.round(this.cxScreen / this.nDefaultCols) >= 12;

    this.fTouchScreen = parmsVideo['touchScreen'];

    this.canvasScreen = canvas;
    this.contextScreen = context;
    this.textareaScreen = textarea;
    this.inputScreen = textarea || canvas || null;

    /*
     * If a Mouse exists, we'll be notified when it requests our canvas, and we make a note of it
     * so that if lockPointer() is ever invoked, we can notify the Mouse.
     */
    this.mouse = null;
    this.fAutoLock = parmsVideo['autoLock'];

    /*
     * Originally, setMode() would map/unmap the video buffer ONLY when the active card changed,
     * because as long as an MDA or CGA remained active, its video buffer never changed.  However,
     * since the EGA can change its video buffer on the fly, setMode() must also compare the card's
     * hard-coded and/or programmed buffer address/size to the "active" address/size; the latter
     * is recorded here.
     */
    this.addrBuffer = this.sizeBuffer = 0;

    /*
     * aFonts is an array of font objects indexed by FONT ID.  Font characters are arranged
     * in 16x16 grids, with one grid per canvas object in the aCanvas array of each font object.
     *
     * Each element is a Font object that describes the font size and provides bitmaps for all the font
     * color permutations.  aFonts.length will be non-zero if ANY fonts are loaded, but do NOT assume
     * that EVERY font has been loaded; check for the existence of a font by checking for its unique ID
     * within this sparse array.
     */
    this.aFonts = [];

    /*
     * Instead of (re)allocating a new color array every time getCardColors() is called, we preallocate
     * an array now and simply update the entries as needed.
     */
    this.aRGB = new Array(16);

    /*
     * Since I've not found clear documentation on a reliable way to check whether a particular DOM element
     * (other than the BODY element) has focus at any given time, I've added onfocus() and onblur() handlers
     * to the screen to maintain my own focus state.
     */
    this.fHasFocus = false;

    var video = this;

    /*
     * All the gross code to handle full-screen support across all supported browsers (standards? hello?)
     */
    this.container = container;
    if (this.container) {
        this.container.doFullScreen = container['requestFullscreen'] || container['msRequestFullscreen'] || container['mozRequestFullScreen'] || container['webkitRequestFullscreen'];
        if (this.container.doFullScreen) {
            var onFullScreenChange = function() {
                var fFullScreen = (document['fullscreenElement'] || document['mozFullScreenElement'] || document['webkitFullscreenElement'] || document['msFullscreenElement']);
                video.notifyFullScreen(fFullScreen? true : false);
            };
            if ('onfullscreenchange' in document) {
                document.addEventListener('fullscreenchange', onFullScreenChange, false);
            } else if ('onmozfullscreenchange' in document) {
                document.addEventListener('mozfullscreenchange', onFullScreenChange, false);
            } else if ('onwebkitfullscreenchange' in document) {
                document.addEventListener('webkitfullscreenchange', onFullScreenChange, false);
            } else if ('onmsfullscreenchange' in document) {
                document.addEventListener('msfullscreenchange', onFullScreenChange, false);
            }
        }
    }

    /*
     * All the gross code to handle pointer-locking support across all supported browsers (standards? hello?)
     */
    if (this.inputScreen) {
        this.inputScreen.onfocus = function onFocusScreen() {
            return video.onFocusChange(true);
        };
        this.inputScreen.onblur = function onBlurScreen() {
            return video.onFocusChange(false);
        };
        this.inputScreen.lockPointer = this.inputScreen['requestPointerLock'] || this.inputScreen['mozRequestPointerLock'] || this.inputScreen['webkitRequestPointerLock'];
        this.inputScreen.unlockPointer = this.inputScreen['exitPointerLock'] || this.inputScreen['mozExitPointerLock'] || this.inputScreen['webkitExitPointerLock'];
        if (this.inputScreen.lockPointer) {
            var onPointerLockChange = function() {
                var fLocked = (
                    document['pointerLockElement'] === video.inputScreen ||
                    document['mozPointerLockElement'] === video.inputScreen ||
                    document['webkitPointerLockElement'] === video.inputScreen);
                video.notifyPointerLocked(fLocked);
            };
            if ('onpointerlockchange' in document) {
                document.addEventListener('pointerlockchange', onPointerLockChange, false);
            } else if ('onmozpointerlockchange' in document) {
                document.addEventListener('mozpointerlockchange', onPointerLockChange, false);
            } else if ('onwebkitpointerlockchange' in document) {
                document.addEventListener('webkitpointerlockchange', onPointerLockChange, false);
            }
        }
    }

    /*
     * As far as overall image quality of scaled fonts, these options don't seem necessary for Safari (and
     * don't have any discernible effect anyway). Turning 'webkitImageSmoothingEnabled' off DOES have an effect
     * on Chrome, but it's not really a positive effect overall, so I'm leaving these off for now.
     *
     *  if (this.contextScreen) {
     *      this.contextScreen['mozImageSmoothingEnabled'] = false;
     *      this.contextScreen['webkitImageSmoothingEnabled'] = false;
     *  }
     */

    var sFileURL = parmsVideo['fontROM'];
    if (sFileURL) {
        var sFileExt = str.getExtension(sFileURL);
        if (sFileExt != "json") {
            sFileURL = web.getHost() + DumpAPI.ENDPOINT + '?' + DumpAPI.QUERY.FILE + '=' + sFileURL + '&' + DumpAPI.QUERY.FORMAT + '=' + DumpAPI.FORMAT.BYTES;
        }
        web.loadResource(sFileURL, true, null, this, this.onLoadSetFonts);
    }
}

Component.subclass(Component, Video);

Video.TRAPALL = true;           // monitor all I/O by default (not just deltas)

/*
 * MDA/CGA Support
 *
 * This component implements a combination of the MDA and CGA cards, with the ability to
 * dynamically switch between the two, by simply toggling the SW1 motherboard switch settings
 * and resetting the virtual machine. As a result, this component always installs I/O port
 * handlers for both MDA and CGA, regardless which card is initially active.
 *
 * Since there's a lot of similarity between the two cards (eg, their text-mode video buffer
 * format, and their use of the 6845 CRT controller), since the MDA ROM contains the fonts
 * used by both devices, and since the same ROM BIOS supports both (in fact, the BIOS rather
 * indiscriminately initializes both, regardless which is actually installed), I decided to
 * use the same component to emulate both devices.  Note that it was possible for an IBM PC
 * to have both an MDA and CGA running in the same machine, so if that's something we want to
 * support later, it can be done by instantiating this component twice, with some additional
 * properties to force each instance to register only those I/O ports belonging to its specific
 * configuration.
 *
 * While supporting both devices is mostly a convenience, it also creates a few inconveniences.
 * For one, the MDA prefers a native window size of 720x350, as it supports only one video mode,
 * 80x25, with a 9x14 cell size.  The CGA, on the other hand, has an 8x8 cell size, so when using
 * an MDA-size window, an 80x25 CGA screen will end up with 40-pixel borders on the left and right,
 * and 75-pixel borders on the top and bottom.  The result is a rather tiny CGA font surrounded
 * by lots of wasted space, so it's best to turn on font scaling (see the "scale" property) and
 * go with a larger window size of, say, 960x400 (50% larger in width, 100% larger in height).
 *
 * I've also added support for font-doubling in createFont().  We use the 8x8 font for 80-column
 * modes and the "doubled" 16x16 font for 40-column modes OR whenever the screen is large enough
 * to use the 16x16 font, since font rendering without scaling provides the sharpest results.
 * In fact, there's special logic in setDimensions() to ignore fScaleFont in certain cases (eg,
 * 40-column modes, to improve sharpness and avoid stretching the font beyond readability).
 *
 * Graphics modes, on the other hand, are always scaled to the window size.  Pixels are captured
 * in an off-screen buffer, which is then drawn to match the size of the virtual display window.
 *
 * TODO: Whenever there are borders, they should be filled with the CGA's overscan colors.  However,
 * in the case of graphics modes (and text modes whenever font scaling is enabled), we don't reserve
 * any space for borders, so if borders are important, explicit border support will be required.
 *
 * EGA Support
 *
 * EGA support piggy-backs on the existing MDA/CGA support.  All the existing MDA/CGA port handlers
 * now refer to either cardMono or cardColor (instead of directly to cardMDA or cardCGA), enabling
 * the handlers to be redirected to cardMDA, cardCGA or cardEGA as appropriate.
 *
 * Note that an MDA card supported only a Monochrome Display and a CGA card supported only a Color
 * Display (well, OK, *or* a TV monitor, which we don't currently support), but the EGA is much
 * more flexible: the Enhanced Color Display was the preferred display, but the EGA also supported
 * older displays; a Color Display on EGA wasn't ideal (same low resolutions but with more colors),
 * but the EGA also brought high-resolution graphics to Monochrome displays, which was nice.  Anyway,
 * while all those EGA/monitor combinations will be nice to support, our virtual display support
 * will focus initially on the Enhanced Color Display.
 *
 * TODO: Add support for jumpers P1 and P3 (see EGA TechRef p.85).  P1 selects either 5-color-output
 * for a CGA monitor or 6-color-output for an EGA monitor; we would presumably use this only to
 * control certain assumptions about the virtual display's capabilities (ie, Color Display vs. Enhanced
 * Color Display).  P3 can switch all the I/O ports from 0x3nn to 0x2nn; the default is 0x3nn, and
 * that's the only port range the EGA ROM supports as well.
 */

/*
 * Supported Cards
 *
 * Note that we choose IDs that match the default font ID for each card as well, just for consistency.
 */
Video.CARDS = {};
Video.CARDS.MDA = 1;
Video.CARDS.CGA = 3;
Video.CARDS.EGA = 5;

/*
 * Supported Monitors
 *
 * The MDA monitor displays 350 lines of vertical resolution, 720 lines of horizontal resolution, and refreshes
 * at ~50Hz.  The CGA monitor displays 200 lines vertically, 640 horizontally, and refreshes at ~60Hz.
 *
 * Based on actual MDA timings (see http://diylab.atwebpages.com/pressureDev.htm), the total horizontal
 * period (drawing a line and retracing) is ~54.25uSec (1000000uSec / 18432) and the horizontal retrace interval
 * is about 15% of that, or ~8.14uSec.  Vertical sync occurs once every 370 horizontal periods.  Of those 370,
 * only 354 represent actively drawn lines (and of those, only 350 are visible); the remaining 16 horizontal
 * periods, or 4% of the 370 total, represent the vertical retrace interval.
 *
 * I don't have similar numbers for the CGA or EGA, so for now, I assume similar percentages; ie, 15% of
 * the horizontal period will represent horizontal retrace, and 4% of the vertical pixel maximum (262) will
 * represent vertical retrace.  However, 24% of the CGA's 262 vertical maximum represents non-visible lines,
 * whereas only 5% of the MDA's 370 maximum represents non-visible lines; is there really that much "overscan"
 * on the CGA?
 *
 * For each monitor type, there's a Video.monitorSpecs object that describes the horizontal and vertical
 * timings, along with my assumptions about the percentage of time that drawing is "active" within those periods,
 * and then based on the selected monitor type, I compute the number of CPU cycles that each period lasts,
 * as well as the number of CPU cycles that drawing lasts within each period, so that the horizontal and vertical
 * retrace status flags can be quickly calculated.
 *
 * For reference, here are some important numbers to know (from https://github.com/reenigne/reenigne/blob/master/8088/cga/register_values.txt):
 *
 *              CGA          MDA
 *  Pixel clock 14.318 MHz   16.257 MHz (aka "maximum video bandwidth", as IBM Tech Refs sometimes call it)
 *  Horizontal  15.700 KHz   18.432 KHz (aka "horizontal drive", as IBM Tech Refs sometimes call it)
 *  Vertical    59.923 Hz    49.816 Hz
 *  Usage       53.69%       77.22%
 *  H pix       912 = 114*8  882 = 98*9
 *  V pix       262          370
 *  Dots        238944       326340
 */

/**
 * @class MonitorSpecs
 * @property {number} nHorzPeriodsPerSec
 * @property {number} nHorzPeriodsPerFrame
 * @property {number} percentHorzActive
 * @property {number} percentVertActive
 *
 * From these monitor specs, we calculate the following values for a given Card:
 *
 *      nCyclesPerSecond = cpu.getCyclesPerSecond();      // eg, 4772727
 *      nCyclesHorzPeriod = (nCyclesPerSecond / monitorSpecs.nHorzPeriodsPerSec) | 0;
 *      nCyclesHorzActive = (nCyclesHorzPeriod * monitorSpecs.percentHorzActive / 100) | 0;
 *      nCyclesVertPeriod = nCyclesHorzPeriod * monitorSpecs.nHorzPeriodsPerFrame;
 *      nCyclesVertActive = (nCyclesVertPeriod * monitorSpecs.percentVertActive / 100) | 0;
 */

/**
 * @type {Object}
 */
Video.monitorSpecs = {};

/**
 * NOTE: Based on trial-and-error, 208 is the magic number of horizontal syncs per vertical sync that
 * yielded the necessary number of "horizontal enables" (200 or 0xC8) in the EGA ROM BIOS at C000:03D0.
 *
 * @type {{MonitorSpecs}}
 */
Video.monitorSpecs[ChipSet.MONITOR.COLOR] = {
    nHorzPeriodsPerSec: 15700,
    nHorzPeriodsPerFrame: 208,
    percentHorzActive: 85,
    percentVertActive: 96
};

/**
 * NOTE: Based on trial-and-error, 364 is the magic number of horizontal syncs per vertical sync that
 * yielded the necessary number of "horizontal enables" (350 or 0x15E) in the EGA ROM BIOS at C000:03D0.
 *
 * @type {{MonitorSpecs}}
 */
Video.monitorSpecs[ChipSet.MONITOR.MONO] = {
    nHorzPeriodsPerSec: 18432,
    nHorzPeriodsPerFrame: 364,
    percentHorzActive: 85,
    percentVertActive: 96
};

/**
 * @type {{MonitorSpecs}}
 */
Video.monitorSpecs[ChipSet.MONITOR.EGACOLOR] = {
    nHorzPeriodsPerSec: 21850,
    nHorzPeriodsPerFrame: 364,
    percentHorzActive: 85,
    percentVertActive: 96
};

/*
 * EGA Miscellaneous ports and SW1-Sw4
 *
 * The Card.MISC.CLK_SELECT bits determine which of the EGA board's 4 configuration switches are
 * returned via Card.STATUS0.SWSENSE (when SWSENSE is zero, the switch is closed):
 *
 *      0xC: return SW1
 *      0x8: return SW2
 *      0x4: return SW3
 *      0x0: return SW4
 *
 * These 4 bits are also copied to the byte at 40:88h by the EGA BIOS, where bit 0 is SW1, bit 1 is SW2,
 * bit 2 is SW3 and bit 3 is SW4.  Our switch settings come from bEGASW, which in turn comes from sEGASW,
 * which in turn comes from the "switches" property passed to the Video component, if any.
 *
 * As usual, the switch settings are reversed in both direction and sense from the switch settings; the
 * good news, however, is that we can use the parseSwitches() method in the ChipSet component to parse them.
 *
 * The set of valid EGA switch values, after conversion, is stored in the table below.  For each value,
 * there is an array that defines the corresponding monitor type(s) for the EGA adapter and any secondary
 * adapter.  The third value is a boolean indicating whether the EGA is the primary adapter.
 */
Video.aEGAMonitorSwitches = {
    0x06: [ChipSet.MONITOR.TV,           ChipSet.MONITOR.MONO,  true],  // "1001"
    0x07: [ChipSet.MONITOR.COLOR,        ChipSet.MONITOR.MONO,  true],  // "0001"
    0x08: [ChipSet.MONITOR.EGAEMULATION, ChipSet.MONITOR.MONO,  true],  // "1110"
    0x09: [ChipSet.MONITOR.EGACOLOR,     ChipSet.MONITOR.MONO,  true],  // "0110" [our default; see bEGASW below]
    0x0a: [ChipSet.MONITOR.MONO,         ChipSet.MONITOR.TV,    true],  // "1010"
    0x0b: [ChipSet.MONITOR.MONO,         ChipSet.MONITOR.COLOR, true],  // "0010"
    0x00: [ChipSet.MONITOR.TV,           ChipSet.MONITOR.MONO,  false], // "1111"
    0x01: [ChipSet.MONITOR.COLOR,        ChipSet.MONITOR.MONO,  false], // "0111"
    0x02: [ChipSet.MONITOR.EGAEMULATION, ChipSet.MONITOR.MONO,  false], // "1011"
    0x03: [ChipSet.MONITOR.EGACOLOR,     ChipSet.MONITOR.MONO,  false], // "0011"
    0x04: [ChipSet.MONITOR.MONO,         ChipSet.MONITOR.TV,    false], // "1101"
    0x05: [ChipSet.MONITOR.MONO,         ChipSet.MONITOR.COLOR, false]  // "0101"
};

/*
 * Supported Modes
 *
 * Although this component is designed to be a video hardware emulation, not a "BIOS simulation", we DO
 * look for changes to the hardware state that correspond to standard BIOS mode settings, so our internal
 * mode setting will normally match the current BIOS mode.  Since 99.9% of applications use only standard
 * BIOS modes, knowing that mode is often helpful.  However, this doesn't mean we're dependent on the BIOS;
 * we simply use common, familiar values wherever it makes sense to do so.  We do have some "BIOS awareness",
 * (eg, when we look for a ROM-based font, or when we're trying to ensure all the BIOS diagnostics pass),
 * but for the most part, we are treating the BIOS as just another (ROM-based) application.
 *
 * As we expand support to include more programmable cards like the EGA, it becomes quite easy for the card
 * to enter a "mode" that has no BIOS counterpart (eg, non-standard combinations of frame buffer address,
 * memory access modes, fonts, display regions, etc).  Our hardware emulation routines will cope with those
 * situations as best they can (and when they don't, it should be considered a bug if some application is
 * broken as a result), but realistically, this is never going to be a 100% accurate hardware emulation.
 */
Video.MODES = {};
Video.MODES.CGA_40X25_BW     = 0;
Video.MODES.CGA_40X25        = 1;
Video.MODES.CGA_80X25_BW     = 2;
Video.MODES.CGA_80X25        = 3;
Video.MODES.CGA_320X200      = 4;
Video.MODES.CGA_320X200_BW   = 5;
Video.MODES.CGA_640X200      = 6;
Video.MODES.MDA_80X25        = 7;
Video.MODES.EGA_320X200      = 0x0D;    // mapped at A000:0000
Video.MODES.EGA_640X200      = 0x0E;    // mapped at A000:0000
Video.MODES.EGA_640X350_MONO = 0x0F;    // mapped at A000:0000, monochrome
Video.MODES.EGA_640X350      = 0x10;    // mapped at A000:0000, color
Video.MODES.UNKNOWN          = 0xFF;

/**
 * @class Font
 * @property {number} cxCell
 * @property {number} cyCell
 * @property {Array} aCSSColors
 * @property {Array} aRGBColors
 * @property {Array} aColorMap
 * @property {Array} aCanvas
 */

/*
 * Supported Fonts
 *
 * Once we've finished loading the standard 8K font file, aFonts[] should contain one or more of the
 * fonts listed below.  For the standard MDA/CGA font ROM, the first (MDA) font resides in the first 4Kb,
 * and the second and third (CGA) fonts reside in the two 2K halves of the second 4Kb.
 *
 * It may seem odd that the cell size for FONT_CGAD is *larger* than the cell size for FONT_CGA,
 * since 40-column mode is actually lower resolution, but since we don't shrink the window when we shrink
 * the mode, the characters must be drawn larger, and they look better if we don't have to scale them.
 *
 * From the IBM EGA Manual (p.5):
 *
 *     "In alphanumeric modes, characters are formed from one of two ROM (Read Only Memory) character
 *      generators on the adapter. One character generator defines 7x9 characters in a 9x14 character box.
 *      For Enhanced Color Display support, the 9x14 character set is modified to provide an 8x14 character set.
 *      The second character generator defines 7x7 characters in an 8x8 character box. These generators contain
 *      dot patterns for 256 different characters. The character sets are identical to those provided by the
 *      IBM Monochrome Display Adapter and the IBM Color/Graphics Monitor Adapter."
 */
Video.FONTS = {};
Video.FONTS.MDA     = 1;        // 9x14 monochrome font
Video.FONTS.MDAD    = 2;        // 18x28 monochrome font (this is the 9x14 font doubled)
Video.FONTS.CGA     = 3;        // 8x8 color font
Video.FONTS.CGAD    = 6;        // 16x16 color font (this is the 8x8 CGA font doubled)
Video.FONTS.EGA     = 5;        // 9x14 color font
Video.FONTS.EGAD    = 10;       // 18x28 color font (this is the 9x14 EGA font doubled)

/*
 * For each video mode, we need to know the following pieces of information:
 *
 *      0: # of columns (nCols)
 *      1: # of rows (nRows)
 *      2: # cells per word (nCellsPerWord: # of characters or pixels per word)
 *      3: # bytes of visible screen padding, if any (used for CGA graphics modes only)
 *      4: font ID (nFont: undefined if graphics mode)
 *
 * By calculating ([0] * [1]) / [2], we obtain the number of 16-bit words that mode actively displays;
 * for example, the amount of visible memory used by mode 0x04 is (320 * 200) / 4, or 16000.
 *
 * The MODES.CGA_40X25 modes specify FONT_CGA instead of FONT_CGAD because we don't automatically
 * load the FONT_CGAD unless the screen is large enough to accommodate it (see the fDoubleFont calculation).
 *
 * To compensate, we have code in setDimensions() that automatically switches to FONT_CGAD if it's loaded AND
 * the cell size warrants the larger font.  We could hard-code FONT_CGAD here, but then we'd always load it,
 * and it might not always be the best fit.
 */
Video.aModeParms = [];                                                                              // Mode
Video.aModeParms[Video.MODES.CGA_40X25]         = [ 40,  25,  1,   0, Video.FONTS.CGA];             // 0x00
Video.aModeParms[Video.MODES.CGA_80X25]         = [ 80,  25,  1,   0, Video.FONTS.CGA];             // 0x02
Video.aModeParms[Video.MODES.CGA_320X200]       = [320, 200,  8, 192];                              // 0x04
Video.aModeParms[Video.MODES.CGA_640X200]       = [640, 200, 16, 192];                              // 0x06
Video.aModeParms[Video.MODES.MDA_80X25]         = [ 80,  25,  1,   0, Video.FONTS.MDA];             // 0x07
Video.aModeParms[Video.MODES.EGA_320X200]       = [320, 200, 16];                                   // 0x0D
Video.aModeParms[Video.MODES.EGA_640X200]       = [640, 200, 16];                                   // 0x0E
Video.aModeParms[Video.MODES.EGA_640X350_MONO]  = [640, 350, 16];                                   // 0x0F
Video.aModeParms[Video.MODES.EGA_640X350]       = [640, 350, 16];                                   // 0x10

Video.aModeParms[Video.MODES.CGA_40X25_BW]      = Video.aModeParms[Video.MODES.CGA_40X25];          // 0x01
Video.aModeParms[Video.MODES.CGA_80X25_BW]      = Video.aModeParms[Video.MODES.CGA_80X25];          // 0x03
Video.aModeParms[Video.MODES.CGA_320X200_BW]    = Video.aModeParms[Video.MODES.CGA_320X200];        // 0x05

/*
 * MDA attribute byte definitions
 *
 * For MDA, only the following group of ATTR definitions are supported; any FGND/BGND value combinations
 * outside this group will be treated as "normal" (ATTR_FGND_WHITE | ATTR_BGND_BLACK).
 *
 * NOTE: Assuming MDA.MODE.BLINK_ENABLE is set (which the ROM BIOS sets by default), ATTR_BGND_BLINK will
 * cause the *foreground* element of the cell to blink, even though it is part of the *background* attribute bits.
 *
 * Regarding blink rate, characters are supposed to blink every 16 vertical frames, which amounts to .26667 blinks
 * per second, assuming a 60Hz vertical refresh rate.  So roughly every 267ms, we need to take care of any blinking
 * characters.  updateScreen() maintains a global count (cBlinkVisible) of blinking characters, to simplify the
 * decision of when to redraw the screen.
 */
Video.ATTRS = {};
Video.ATTRS.FGND_BLACK  = 0x00;
Video.ATTRS.FGND_ULINE  = 0x01;
Video.ATTRS.FGND_WHITE  = 0x07;
Video.ATTRS.FGND_BRIGHT = 0x08;
Video.ATTRS.BGND_BLACK  = 0x00;
Video.ATTRS.BGND_WHITE  = 0x70;
Video.ATTRS.BGND_BLINK  = 0x80;
Video.ATTRS.BGND_BRIGHT = 0x80;
Video.ATTRS.DRAW_FGND   = 0x100;        // this is an internal attribute bit, indicating the foreground should be drawn
Video.ATTRS.DRAW_CURSOR = 0x200;        // this is an internal attribute bit, indicating when the cursor should be drawn

/*
 * Here's a "cheat sheet" for attribute byte combinations that the IBM MDA could have supported.  The original (Aug 1981)
 * IBM Tech Ref is very terse and implies that only those marked with * are actually supported.
 *
 *     *0x00: non-display                       ATTR_FGND_BLACK |                    ATTR_BGND_BLACK
 *     *0x01: underline                         ATTR_FGND_ULINE |                    ATTR_BGND_BLACK
 *     *0x07: normal (white on black)           ATTR_FGND_WHITE |                    ATTR_BGND_BLACK
 *    **0x09: bright underline                  ATTR_FGND_ULINE | ATTR_FGND_BRIGHT | ATTR_BGND_BLACK
 *    **0x0F: bold (bright white on black)      ATTR_FGND_WHITE | ATTR_FGND_BRIGHT | ATTR_BGND_BLACK
 *     *0x70: reverse (black on white)          ATTR_FGND_BLACK |                  | ATTR_BGND_WHITE
 *      0x81: blinking underline                ATTR_FGND_ULINE |                  | ATTR_BGND_BLINK (or dim background if blink disabled)
 *    **0x87: blinking normal                   ATTR_FGND_WHITE |                  | ATTR_BGND_BLINK (or dim background if blink disabled)
 *      0x89: blinking bright underline         ATTR_FGND_ULINE | ATTR_FGND_BRIGHT | ATTR_BGND_BLINK (or dim background if blink disabled)
 *    **0x8F: blinking bold                     ATTR_FGND_WHITE | ATTR_FGND_BRIGHT | ATTR_BGND_BLINK (or dim background if blink disabled)
 *    **0xF0: blinking reverse                  ATTR_FGND_WHITE | ATTR_FGND_BRIGHT | ATTR_BGND_BLINK (or bright background if blink disabled)
 *
 * Unsupported attributes reportedly display as "normal" (ATTR_FGND_WHITE | ATTR_BGND_BLACK).  However, precisely which
 * attributes are unsupported on the MDA varies depending on the source. Some sources (eg, the IBM Tech Ref) imply that
 * only those marked by * are supported, while others (eg, some--but not all--Peter Norton guides) include those marked
 * by **, and still others include ALL the combinations listed above.
 *
 * Furthermore, according to http://www.seasip.info/VintagePC/mda.html:
 *
 *      Attributes 0x00, 0x08, 0x80 and 0x88 display as black space;
 *      Attribute 0x78 displays as dark green on green; depending on the monitor, there may be a green "halo" where the dark and bright bits meet;
 *      Attribute 0xF0 displays as a blinking version of 0x70 if blink enabled, and black on bright green otherwise;
 *      Attribute 0xF8 displays as a blinking version of 0x78 if blink enabled, and as dark green on bright green otherwise.
 *
 * However, I'm rather skeptical about supporting 0x78 and 0xF8, until I see some evidence that "bright black" actually
 * produced dark green on IBM equipment; it also doesn't sound like a combination many people would have used.  I'll probably
 * treat all of 0x08, 0x80 and 0x88 the same as 0x00, only because it seems logical (they're all "black on black" combinations
 * with only BRIGHT and/or BLINK bits set). Beyond that, I'll likely treat any other combination not listed in the above cheat
 * sheet as "normal".
 *
 * All the discrepancies/disagreements I've found are probably due in part to the proliferation of IBM and non-IBM MDA
 * cards, combined with IBM and non-IBM monochrome monitors, and people assuming that their non-IBM card and/or monitor
 * behaved exactly like the original IBM equipment, which probably wasn't true in all cases.
 *
 * I would like to limit my MDA display support to EXACTLY everything that the IBM MDA supported and nothing more, but
 * since there will be combinations that will logically "fall out" unless I specifically exclude them, it's very likely
 * this implementation will end up being a superset.
 */

/*
 * CGA attribute byte definitions;  these simply extend the set of MDA attributes, with the exception of ATTR_FNGD_ULINE,
 * which the CGA can treat only as ATTR_FGND_BLUE.
 */
Video.ATTRS.FGND_BLUE       = 0x01;
Video.ATTRS.FGND_GREEN      = 0x02;
Video.ATTRS.FGND_CYAN       = 0x03;
Video.ATTRS.FGND_RED        = 0x04;
Video.ATTRS.FGND_MAGENTA    = 0x05;
Video.ATTRS.FGND_BROWN      = 0x06;

Video.ATTRS.BGND_BLUE       = 0x10;
Video.ATTRS.BGND_GREEN      = 0x20;
Video.ATTRS.BGND_CYAN       = 0x30;
Video.ATTRS.BGND_RED        = 0x40;
Video.ATTRS.BGND_MAGENTA    = 0x50;
Video.ATTRS.BGND_BROWN      = 0x60;

/* For the MDA, the length of aMDAColors is 5, based on the following supported FGND attribute values:
 *
 *      0x0: black font (attribute value 0x8 is mapped to 0x0)
 *      0x1: green font with underline
 *      0x7: green font without underline (attribute values 0x2-0x6 are mapped to 0x7)
 *      0x9: bright green font with underline
 *      0xf: bright green font without underline (attribute values 0xa-0xe are mapped to 0xf)
 *
 * I'm still not sure about 0x8 (dark green?); for now, I'm mapping it to 0x0, but it may become a 6th supported color.
 */
Video.aMDAColors = new Array(5);
Video.aMDAColors[0] = [0x00, 0x00, 0x00, 0xff];
Video.aMDAColors[1] = [0x7f, 0xc0, 0x7f, 0xff];
Video.aMDAColors[2] = [0x7f, 0xc0, 0x7f, 0xff];
Video.aMDAColors[3] = [0x7f, 0xff, 0x7f, 0xff];
Video.aMDAColors[4] = [0x7f, 0xff, 0x7f, 0xff];
Video.aMDAColorMap  = [0x0, 0x1, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x0, 0x3, 0x4, 0x4, 0x4, 0x4, 0x4, 0x4];

Video.aCGAColors = new Array(16);
Video.aCGAColors[0]  = [0x00, 0x00, 0x00, 0xff];    // ATTR_FGND_BLACK
Video.aCGAColors[1]  = [0x00, 0x00, 0xaa, 0xff];    // ATTR_FGND_BLUE
Video.aCGAColors[2]  = [0x00, 0xaa, 0x00, 0xff];    // ATTR_FGND_GREEN
Video.aCGAColors[3]  = [0x00, 0xaa, 0xaa, 0xff];    // ATTR_FGND_CYAN
Video.aCGAColors[4]  = [0xaa, 0x00, 0x00, 0xff];    // ATTR_FGND_RED
Video.aCGAColors[5]  = [0xaa, 0x00, 0xaa, 0xff];    // ATTR_FGND_MAGENTA
Video.aCGAColors[6]  = [0xaa, 0x55, 0x00, 0xff];    // ATTR_FGND_BROWN
Video.aCGAColors[7]  = [0xaa, 0xaa, 0xaa, 0xff];    // ATTR_FGND_WHITE                      (aka light gray)
Video.aCGAColors[8]  = [0x55, 0x55, 0x55, 0xff];    // ATTR_FGND_BLACK   | ATTR_FGND_BRIGHT (aka gray)
Video.aCGAColors[9]  = [0x55, 0x55, 0xff, 0xff];    // ATTR_FGND_BLUE    | ATTR_FGND_BRIGHT
Video.aCGAColors[10] = [0x55, 0xff, 0x55, 0xff];    // ATTR_FGND_GREEN   | ATTR_FGND_BRIGHT
Video.aCGAColors[11] = [0x55, 0xff, 0xff, 0xff];    // ATTR_FGND_CYAN    | ATTR_FGND_BRIGHT
Video.aCGAColors[12] = [0xff, 0x55, 0x55, 0xff];    // ATTR_FGND_RED     | ATTR_FGND_BRIGHT
Video.aCGAColors[13] = [0xff, 0x55, 0xff, 0xff];    // ATTR_FGND_MAGENTA | ATTR_FGND_BRIGHT
Video.aCGAColors[14] = [0xff, 0xff, 0x55, 0xff];    // ATTR_FGND_BROWN   | ATTR_FGND_BRIGHT (aka yellow)
Video.aCGAColors[15] = [0xff, 0xff, 0xff, 0xff];    // ATTR_FGND_WHITE   | ATTR_FGND_BRIGHT (aka white)

Video.aCGAColorSet1 = [Video.ATTRS.FGND_GREEN, Video.ATTRS.FGND_RED,     Video.ATTRS.FGND_BROWN];
Video.aCGAColorSet2 = [Video.ATTRS.FGND_CYAN,  Video.ATTRS.FGND_MAGENTA, Video.ATTRS.FGND_WHITE];

/*
 * Here is the EGA BIOS default ATC palette register set for color text modes, from which getCardColors()
 * builds a default RGB array, similar to aCGAColors above.
 */
Video.aEGAPalDef = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x14, 0x07, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F];

Video.aEGAByteToDW = [
      0x00000000,   0x000000ff,   0x0000ff00,   0x0000ffff,
      0x00ff0000,   0x00ff00ff,   0x00ffff00,   0x00ffffff,
      0xff000000|0, 0xff0000ff|0, 0xff00ff00|0, 0xff00ffff|0,
      0xffff0000|0, 0xffff00ff|0, 0xffffff00|0, 0xffffffff|0
];

Video.aEGADWToByte = [];
Video.aEGADWToByte[0x00000000] = 0x0;
Video.aEGADWToByte[0x00000080] = 0x1;
Video.aEGADWToByte[0x00008000] = 0x2;
Video.aEGADWToByte[0x00008080] = 0x3;
Video.aEGADWToByte[0x00800000] = 0x4;
Video.aEGADWToByte[0x00800080] = 0x5;
Video.aEGADWToByte[0x00808000] = 0x6;
Video.aEGADWToByte[0x00808080] = 0x7;
Video.aEGADWToByte[0x80000000|0] = 0x8;
Video.aEGADWToByte[0x80000080|0] = 0x9;
Video.aEGADWToByte[0x80008000|0] = 0xa;
Video.aEGADWToByte[0x80008080|0] = 0xb;
Video.aEGADWToByte[0x80800000|0] = 0xc;
Video.aEGADWToByte[0x80800080|0] = 0xd;
Video.aEGADWToByte[0x80808000|0] = 0xe;
Video.aEGADWToByte[0x80808080|0] = 0xf;

/**
 * Card(video, iCard, data, cbMemory)
 *
 * Creates an object representing an initial video card state;
 * can also restore a video card from state data created by saveCard().
 *
 * WARNING: Since Card objects are low-level objects that have no UI requirements,
 * they do not inherit from the Component class, so you should only use class methods
 * of Component, such as Component.assert(), or Debugger methods if the Debugger is available.
 *
 * @constructor
 * @param {Video} [video]
 * @param {number} [iCard] (see Video.CARDS.*)
 * @param {Array|null} [data]
 * @param {number} [cbMemory] is specified if the card must allocate its own memory buffer
 */
function Card(video, iCard, data, cbMemory)
{
    /*
     * If a card was originally not present (eg, EGA), then the state will be empty,
     * so we need to detect that case and continue indicating that the card is not present.
     */
    if (iCard !== undefined && (!data || data.length)) {

        var specs = Video.cardSpecs[iCard];
        var nMonitorType = video.nMonitorType || specs[5];

        if (!data || data.length < 6) {
            data = [false, 0, null, null, 0, new Array(Card.CRTC.TOTAL_REGS)];
        }

        /*
         * If a Debugger is present, we want to stash a bit more info in each Card.
         */
        if (DEBUGGER) {
            this.dbg = video.dbg;
            this.type = specs[0];
            this.port = specs[1];
        }

        this.iCard = iCard;
        this.addrBuffer = specs[2];     // default (physical) frame buffer address
        this.sizeBuffer = specs[3];     // default frame buffer length (this is the total size, not the current visible size; this.cbScreen is calculated on the fly to reflect the latter)

        /*
         * If no memory size is specified, then setMode() will use addMemory() to automatically add enough
         * memory blocks to cover the frame buffer specified above; otherwise, it instructs addMemory() to call
         * getMemoryBuffer(), which will return a portion of the buffer (adwMemory) allocated below.  This allows
         * a card like the EGA to move/resize its frame buffer as needed, as well as giving it total control over
         * the underlying memory.
         */
        this.cbMemory = cbMemory || specs[4];

        /*
         * All of our cardSpec frame buffer sizes are based on the default text mode (eg, 4Kb for an MDA, 16Kb for
         * a CGA), but for a card with 64Kb or more of memory (ie, any EGA card), the default text mode frame buffer
         * size should be dynamically recalculated as the smaller of: cbMemory divided by 4, or 32Kb.
         */
        if (this.cbMemory >= 0x10000 && this.addrBuffer >= 0xB0000) {
            this.sizeBuffer = Math.min(this.cbMemory >> 2, 0x8000);
        }

        this.fActive   = data[0];
        this.modeReg   = data[1];       // see MDA.MODE* or CGA.MODE_* (use (MDA.MODE.HIRES | MDA.MODE.VIDEO_ENABLE | MDA.MODE.BLINK_ENABLE) if you want to test blinking immediately after the initial power-on reset)
        this.colorReg  = data[2];       // see CGA.COLOR.* (undefined on MDA)
        this.statusReg = data[3];       // see MDA.STATUS.* or CGA.STATUS.*
        this.iCRTCReg  = data[4] & 0xff;
        this.iCRTCPrev = (data[4] >> 8) & 0xff;
        this.aCRTCRegs = data[5];
        this.nCRTCRegs = Card.CRTC.TOTAL_REGS;
        this.asCRTCRegs = DEBUGGER? Card.CRTC.REGS : [];

        if (iCard == Video.CARDS.EGA) {
            this.nCRTCRegs = Card.CRTC.EGA.TOTAL_REGS;
            this.asCRTCRegs = DEBUGGER? Card.CRTC.EGA_REGS : [];
            this.initEGA(data[6], nMonitorType);
        }

        var monitorSpecs = Video.monitorSpecs[nMonitorType] || Video.monitorSpecs[ChipSet.MONITOR.MONO];

        var nCyclesPerSecond = video.cpu.getCyclesPerSecond();      // eg, 4772727
        this.nCyclesHorzPeriod = (nCyclesPerSecond / monitorSpecs.nHorzPeriodsPerSec) | 0;
        this.nCyclesHorzActive = (this.nCyclesHorzPeriod * monitorSpecs.percentHorzActive / 100) | 0;
        this.nCyclesVertPeriod = this.nCyclesHorzPeriod * monitorSpecs.nHorzPeriodsPerFrame;
        this.nCyclesVertActive = (this.nCyclesVertPeriod * monitorSpecs.percentVertActive / 100) | 0;
        this.nInitCycles = (data[7] == null? 0 : data[7]);
    }
}

/*
 * MDA I/O ports
 */
Card.MDA = {};
Card.MDA.CRTC = {};
Card.MDA.CRTC.INDX = {};
Card.MDA.CRTC.INDX.PORT     = 0x3B4;    // NOTE: the low byte of this port address (0xB4) is mirrored at 40:0063 (0x0463)
Card.MDA.CRTC.INDX.MASK     = 0x1F;
Card.MDA.CRTC.DATA = {};
Card.MDA.CRTC.DATA.PORT     = 0x3B5;

Card.MDA.MODE = {};
Card.MDA.MODE.PORT          = 0x3B8;    // Mode Select Register, aka CRT Control Port 1 (write-only); the BIOS mirrors this register at 40:0065 (0x0465)
Card.MDA.MODE.HIRES         = 0x01;
Card.MDA.MODE.VIDEO_ENABLE  = 0x08;
Card.MDA.MODE.BLINK_ENABLE  = 0x20;

Card.MDA.STATUS = {};
Card.MDA.STATUS.PORT        = 0x3BA;
Card.MDA.STATUS.HDRIVE      = 0x01;
Card.MDA.STATUS.BWVIDEO     = 0x08;

Card.MDA.PRT_DATA = {};
Card.MDA.PRT_DATA.PORT      = 0x3BC;
Card.MDA.PRT_STATUS = {};
Card.MDA.PRT_STATUS.PORT    = 0x3BD;
Card.MDA.PRT_CTRL = {};
Card.MDA.PRT_CTRL.PORT      = 0x3BE;

/*
 * CGA I/O ports
 */
Card.CGA = {};
Card.CGA.CRTC = {};
Card.CGA.CRTC.INDX = {};
Card.CGA.CRTC.INDX.PORT     = 0x3D4;    // NOTE: the low byte of this port address (0xB4) is mirrored at 40:0063 (0x0463)
Card.CGA.CRTC.INDX.MASK     = 0x1F;
Card.CGA.CRTC.DATA = {};
Card.CGA.CRTC.DATA.PORT     = 0x3D5;

Card.CGA.MODE = {};
Card.CGA.MODE.PORT          = 0x3D8;    // Mode Select Register (write-only); the BIOS mirrors this register at 40:0065 (0x0465)
Card.CGA.MODE._80X25        = 0x01;
Card.CGA.MODE.GRAPHIC_SEL   = 0x02;
Card.CGA.MODE.BW_SEL        = 0x04;
Card.CGA.MODE.VIDEO_ENABLE  = 0x08;     // same as MDA.MODE.VIDEO_ENABLE
Card.CGA.MODE.HIRES_BW      = 0x10;
Card.CGA.MODE.BLINK_ENABLE  = 0x20;     // same as MDA.MODE.BLINK_ENABLE

Card.CGA.COLOR = {};
Card.CGA.COLOR.PORT         = 0x3D9;    // write-only
Card.CGA.COLOR.BORDER       = 0x07;
Card.CGA.COLOR.BRIGHT       = 0x08;
Card.CGA.COLOR.BGND_ALT     = 0x10;     // alternate, intensified background colors in text mode
Card.CGA.COLOR.COLORSET2    = 0x20;     // selects aCGAColorSet2 colors for 320x200 graphics mode; aCGAColorSet1 otherwise

Card.CGA.STATUS = {};
Card.CGA.STATUS.PORT        = 0x3DA;    // read-only; same for EGA (although the EGA calls this STATUS1, to distinguish it from STATUS0)
Card.CGA.STATUS.DISP_ENABLE = 0x01;
Card.CGA.STATUS.PEN_TRIGGER = 0x02;
Card.CGA.STATUS.PEN_ON      = 0x04;
Card.CGA.STATUS.VERT_RETRACE= 0x08;     // when set, this indicates the CGA is performing a vertical retrace

Card.CGA.CLEAR_PEN = {};
Card.CGA.CLEAR_PEN.PORT     = 0x3DB;

Card.CGA.PRESET_PEN = {};
Card.CGA.PRESET_PEN.PORT    = 0x3DC;

/*
 * Common CRT hardware registers, accessed via Card.XXA.CRTC.INDX.PORT and Card.XXA.CRTC.DATA.PORT
 *
 * NOTE: In this implementation, because we have to make at least two of the registers readable (CURSOR_ADDR_HI and CURSOR_ADDR_LO),
 * we end up making ALL the registers readable, otherwise we would have to explicitly block any register marked write-only.  I don't
 * think making the CRT registers fully readable presents any serious compatibility issues, and it actually offers some benefits
 * (eg, improved debugging).
 *
 * However, some things are broken: the (readable) light pen registers on the EGA are overloaded as (writable) vertical retrace
 * registers, so the vertical retrace registers cannot actually be read that way.  I'm sure the VGA solved that problem, but I haven't
 * looked into it yet.
 */
Card.CRTC = {};
Card.CRTC.EGA = {};
Card.CRTC.HORZ_TOTAL            = 0x00;
Card.CRTC.HORZ_DISP             = 0x01;     Card.CRTC.EGA.HORZ_DISP_END      = 0x01;
Card.CRTC.HORZ_SYNC_POS         = 0x02;     Card.CRTC.EGA.HORZ_BLANK_START   = 0x02;
Card.CRTC.HORZ_SYNC_WIDTH       = 0x03;     Card.CRTC.EGA.HORZ_BLANK_END     = 0x03;
Card.CRTC.VERT_TOTAL            = 0x04;     Card.CRTC.EGA.HORZ_RETRACE_START = 0x04;
Card.CRTC.VERT_TOTAL_ADJ        = 0x05;     Card.CRTC.EGA.HORZ_RETRACE_END   = 0x05;
Card.CRTC.VERT_DISP_TOTAL       = 0x06;     Card.CRTC.EGA.VERT_TOTAL         = 0x06;
Card.CRTC.VERT_SYNC_POS         = 0x07;     Card.CRTC.EGA.OVERFLOW           = {INDX: 0x07, VERT_TOTAL: 0x01};
Card.CRTC.INTERLACE_POS         = 0x08;     Card.CRTC.EGA.PRESET_ROW_SCAN    = 0x08;
Card.CRTC.MAX_SCAN_LINE         = 0x09;
Card.CRTC.CURSOR_START = {};
Card.CRTC.CURSOR_START.INDX     = 0x0A;
Card.CRTC.CURSOR_START.MASK     = 0x1F;
/*
 * I don't entirely understand these cursor blink control bits.  Here's what the MC6845 datasheet says:
 *
 *      Bit 5 is the blink timing control.  When bit 5 is low, the blink frequency is 1/16 of the vertical field rate,
 *      and when bit 5 is high, the blink frequency is 1/32 of the vertical field rate.  Bit 6 is used to enable a blink.
 */
Card.CRTC.CURSOR_START.BLINKON  = 0x00;     // (supposedly, 0x04 has the same effect as 0x00)
Card.CRTC.CURSOR_START.BLINKOFF = 0x20;     // if blinking is disabled, the cursor is effectively hidden
Card.CRTC.CURSOR_START.BLINKFAST= 0x60;     // default is 1/16 of the frame rate; this switches to 1/32 of the frame rate

Card.CRTC.CURSOR_END = {};
Card.CRTC.CURSOR_END.INDX       = 0x0B;
Card.CRTC.CURSOR_END.MASK       = 0x1F;
Card.CRTC.START_ADDR_HI         = 0x0C;
Card.CRTC.START_ADDR_LO         = 0x0D;
Card.CRTC.CURSOR_ADDR_HI        = 0x0E;
Card.CRTC.CURSOR_ADDR_LO        = 0x0F;
Card.CRTC.LIGHT_PEN_HI          = 0x10;     Card.CRTC.EGA.VERT_RETRACE_START = 0x10;
Card.CRTC.LIGHT_PEN_LO          = 0x11;     Card.CRTC.EGA.VERT_RETRACE_END   = 0x11;
Card.CRTC.TOTAL_REGS            = 0x12;     // total CRT registers on MDA/CGA
Card.CRTC.EGA.VERT_DISP_END     = 0x12;
Card.CRTC.EGA.OFFSET            = 0x13;
Card.CRTC.EGA.UNDERLINE         = 0x14;
Card.CRTC.EGA.VERT_BLANK_START  = 0x15;
Card.CRTC.EGA.VERT_BLANK_END    = 0x16;
Card.CRTC.EGA.MODE_CTRL = {};
Card.CRTC.EGA.MODE_CTRL.INDX    = 0x17;
Card.CRTC.EGA.MODE_CTRL.CMS     = 0x01;     // Compatibility Mode Support (CGA A13 control)
Card.CRTC.EGA.MODE_CTRL.SRSC    = 0x02;     // Select Row Scan Counter
Card.CRTC.EGA.MODE_CTRL.HRS     = 0x04;     // Horizontal Retrace Select
Card.CRTC.EGA.MODE_CTRL.CBT     = 0x08;     // Count By Two
Card.CRTC.EGA.MODE_CTRL.OC      = 0x10;     // Output Control
Card.CRTC.EGA.MODE_CTRL.AW      = 0x20;     // Address Wrap (in Word mode, 1 maps A15 to A0 and 0 maps A13; use the latter when only 64Kb is installed)
Card.CRTC.EGA.MODE_CTRL.BM      = 0x40;     // Byte Mode (1 selects Byte Mode; 0 selects Word Mode)
Card.CRTC.EGA.MODE_CTRL.HR      = 0x80;     // Hardware Reset
Card.CRTC.EGA.LINE_COMPARE      = 0x18;
Card.CRTC.EGA.TOTAL_REGS        = 0x19;     // total CRT registers on EGA

Card.CRTC.ADDR_HI_MASK          = 0x3F;

if (DEBUGGER) {
    Card.CRTC.REGS      = ["HORZ_TOTAL","HORZ_DISP","HORZ_SYNC_POS","HORZ_SYNC_WIDTH","VERT_TOTAL","VERT_TOTAL_ADJ",
                           "VERT_DISP","VERT_SYNC_POS","INTERLACE_POS","MAX_SCAN_LINE","CURSOR_START","CURSOR_END",
                           "START_ADDR_HI","START_ADDR_LO","CURSOR_ADDR_HI","CURSOR_ADDR_LO","LIGHT_PEN_HI","LIGHT_PEN_LO"];

    Card.CRTC.EGA_REGS  = ["HORZ_TOTAL","HORZ_DISP_END","HORZ_BLANK_START","HORZ_BLANK_END","HORZ_RETRACE_START","HORZ_RETRACE_END",
                           "VERT_TOTAL","CRTC_OVERFLOW","PRESET_ROW_SCAN","MAX_SCAN_LINE","CURSOR_START","CURSOR_END",
                           "START_ADDR_HI","START_ADDR_LO","CURSOR_ADDR_HI","CURSOR_ADDR_LO","LIGHT_PEN_HI","LIGHT_PEN_LO",
                           "VERT_DISP_END","OFFSET","UNDERLINE","VERT_BLANK_START","VERT_BLANK_END","MODE_CTRL","LONE_COMPARE"];
}

/*
 * EGA Status port
 */
Card.STATUS1 = {};
Card.STATUS1.PORT           = 0x3DA;
/*
 * STATUS1 diagnostic bits 5 and 4 are set according to the Card.ATC.PLANES.MUX bits:
 *
 *      MUX     Bit 5   Bit 4
 *      ---     ----    ----
 *      00:     Red     Blue
 *      01:     SecBlue Green
 *      10:     SecRed  SecGreen
 *      11:     unused  unused
 */
Card.STATUS1.DIAGNOSTIC     = 0x30;     // these bits are controlled by the Card.ATC.PLANES.MUX bits

/*
 * EGA Attribute Controller (ATC) ports
 *
 * The current ATC INDX value is stored in cardEGA.iATCReg (including the Card.ATC.INDX_ENABLE bit), and the
 * ATC DATA values are stored in cardEGA.aATCRegs.  Also, the state of the ATC INDX/DATA flip-flop is stored in fATCData.
 *
 * Note that the ATC palette registers (0x0-0xf) all use the following 6 bit assignments, with bits 6 and 7 unused:
 *
 *      0: Blue
 *      1: Green
 *      2: Red
 *      3: SecBlue (or mono video)
 *      4: SecGreen (or intensity)
 *      5: SecRed
 */
Card.ATC = {};
Card.ATC.PORT               = 0x3C0;    // write-only
Card.ATC.INDX_MASK          = 0x1F;
Card.ATC.INDX_PAL_ENABLE    = 0x20;     // must be clear when loading palette registers
Card.ATC.PALETTE = {};
Card.ATC.PALETTE.INDX       = 0x00;     // 16 registers: 0x00 - 0x0F
Card.ATC.PALETTE.BLUE       = 0x01;
Card.ATC.PALETTE.GREEN      = 0x02;
Card.ATC.PALETTE.RED        = 0x04;
Card.ATC.PALETTE.SECBLUE    = 0x08;
Card.ATC.PALETTE.BRIGHT     = 0x10;     // NOTE: The IBM EGA manual (p.56) also calls this the "intensity" bit
Card.ATC.PALETTE.SECGREEN   = 0x10;
Card.ATC.PALETTE.SECRED     = 0x20;
Card.ATC.PALETTE_REGS       = 0x10;     // 16 total palette registers
Card.ATC.MODE = {};
Card.ATC.MODE.INDX          = 0x10;     // MODE CONTROL
Card.ATC.OVRSCAN = {};
Card.ATC.OVRSCAN.INDX       = 0x11;     // OVERSCAN COLOR
Card.ATC.PLANES = {};
Card.ATC.PLANES.INDX        = 0x12;     // COLOR PLANES
Card.ATC.PLANES.MASK        = 0x0F;
Card.ATC.PLANES.MUX         = 0x30;
Card.ATC.HORZPAN = {};
Card.ATC.HORZPAN.INDX       = 0x13;     // HORZ PANNING
Card.ATC.TOTAL_REGS         = 0x14;

if (DEBUGGER) {
    Card.ATC.REGS = ["PAL00","PAL01","PAL02","PAL03","PAL04","PAL05","PAL06","PAL07",
                     "PAL08","PAL09","PAL0A","PAL0B","PAL0C","PAL0D","PAL0E","PAL0F",
                     "MODE","OVRSCAN","PLANES","HORZPAN"];
}

Card.MISC = {};
Card.MISC.PORT              = 0x3C2;    // write-only (apparently on a VGA, you can read the MISC register at port 0x3CC)
Card.MISC.IO_SELECT         = 0x01;     // 0 sets CRT ports to 0x3Bn, 1 sets CRT ports to 0x3Dn
Card.MISC.ENABLE_RAM        = 0x02;     // 0 disables video RAM, 1 enables
Card.MISC.CLK_SELECT        = 0x0C;     // 0x0: 14Mhz I/O clock, 0x4: 16Mhz on-board clock, 0x8: external clock, 0xC: unused
Card.MISC.DISABLE_DRV       = 0x10;     // 0 activates internal video drivers, 1 activates feature connector direct drive outputs
Card.MISC.PAGE_ODD_EVEN     = 0x20;     // 0 selects the low 64Kb page of video RAM for text modes, 1 selects the high page
Card.MISC.HORZ_POLARITY     = 0x40;     // 0 selects positive horizontal retrace
Card.MISC.VERT_POLARITY     = 0x80;     // 0 selects positive vertical retrace

/*
 * The EGA BIOS writes 0x1 to Card.FEAT_CTRL.BITS and reads Card.STATUS0.FEAT, then writes 0x2 to
 * Card.FEAT_CTRL.BITS and reads Card.STATUS0.FEAT.  The bits from the first and second reads are shifted
 * into the high nibble of the byte at 40:88h.
 */
Card.FEAT_CTRL = {};
Card.FEAT_CTRL.PORT         = 0x3DA;    // or 0x3BA; write-only (other than the two bits below, the rest are reserved and/or unused)
Card.FEAT_CTRL.BITS         = 0x03;     // feature control bits

Card.STATUS0 = {};
Card.STATUS0.PORT           = 0x3C2;    // read-only (aka STATUS0, to distinguish it from PORT_CGA_STATUS)
Card.STATUS0.SWSENSE        = 0x10;
Card.STATUS0.SWSENSE_SHIFT = 4;
Card.STATUS0.FEAT           = 0x60;
Card.STATUS0.INTERRUPT      = 0x80;     // 1: video is being displayed; 0: vertical retrace is occurring

/*
 * EGA Sequencer (SEQ) ports
 */
Card.SEQ = {};
Card.SEQ.INDX = {};
Card.SEQ.INDX.PORT          = 0x3C4;
Card.SEQ.INDX.MASK          = 0x1F;
Card.SEQ.DATA = {};
Card.SEQ.DATA.PORT          = 0x3C5;
Card.SEQ.RESET = {};
Card.SEQ.RESET.INDX         = 0x00;     // RESET
Card.SEQ.RESET.ASYNC        = 0x01;
Card.SEQ.RESET.SYNC         = 0x02;
Card.SEQ.CLK = {};
Card.SEQ.CLK.INDX           = 0x01;     // CLOCKING MODE
Card.SEQ.CLK.DOTS8          = 0x01;     // 1: 8 dots; 0: 9 dots
Card.SEQ.CLK.BANDWIDTH      = 0x02;     // 0: CRTC has access 4 out of every 5 cycles (for high-res modes); 1: CRTC has access 2 out of 5
Card.SEQ.CLK.SHIFTLOAD      = 0x04;
Card.SEQ.CLK.DOTCLOCK       = 0x08;     // 0: normal dot clock; 1: master clock divided by two (used for 320x200 modes: 0, 1, 4, 5, and D)
Card.SEQ.MAPMASK = {};
Card.SEQ.MAPMASK.INDX       = 0x02;     // MAP MASK
Card.SEQ.MAPMASK.PL0        = 0x01;
Card.SEQ.MAPMASK.PL1        = 0x02;
Card.SEQ.MAPMASK.PL2        = 0x04;
Card.SEQ.MAPMASK.PL3        = 0x08;
Card.SEQ.MAPMASK.MAPS       = 0x0f;
Card.SEQ.CHARMAP = {};
Card.SEQ.CHARMAP.INDX       = 0x03;     // CHAR MAP SELECT
Card.SEQ.CHARMAP.SELB       = 0x03;     // 0x0: 1st 8Kb of plane 2; 0x1: 2nd 8Kb; 0x2: 3rd 8Kb; 0x3: 4th 8Kb
Card.SEQ.CHARMAP.SELA       = 0x0C;     // 0x0: 1st 8Kb of plane 2; 0x4: 2nd 8Kb; 0x8: 3rd 8Kb; 0xC: 4th 8Kb
Card.SEQ.MODE = {};
Card.SEQ.MODE.INDX          = 0x04;     // MEMORY MODE
Card.SEQ.MODE.ALPHA         = 0x01;     // 1: alphanumeric (A/N) mode active; 0: graphics (APA or "All Points Addressable") mode active
Card.SEQ.MODE.EXT           = 0x02;     // 1: memory expansion installed; 0: not installed
Card.SEQ.MODE.SEQUENTIAL    = 0x04;     // 1: memory is sequential; 0: even addresses mapped to planes 0/2, odd addresses to planes 1/3
Card.SEQ.TOTAL_REGS         = 0x05;

if (DEBUGGER) Card.SEQ.REGS = ["RESET","CLK","MAPMASK","CHARMAP","MODE"];

/*
 * EGA Graphics Controller (GRC) ports
 */
Card.GRC = {};
Card.GRC.POS1_PORT          = 0x3CC;
Card.GRC.POS2_PORT          = 0x3CA;
Card.GRC.INDX = {};
Card.GRC.INDX.PORT          = 0x3CE;
Card.GRC.INDX.MASK          = 0x0F;
Card.GRC.DATA = {};
Card.GRC.DATA.PORT          = 0x3CF;

Card.GRC.SRESET = {};
Card.GRC.SRESET.INDX        = 0x00;     // SET/RESET (write-only; each bit used only if WRITE_MODE is 0 and corresponding ESR bit set)
Card.GRC.ESRESET = {};
Card.GRC.ESRESET.INDX       = 0x01;     // ENABLE SET/RESET
Card.GRC.COLRCMP = {};
Card.GRC.COLRCMP.INDX       = 0x02;     // COLOR COMPARE
Card.GRC.DATAROT = {};
Card.GRC.DATAROT.INDX       = 0x03;     // DATA ROTATE
Card.GRC.DATAROT.COUNT      = 0x07;
Card.GRC.DATAROT.AND        = 0x08;
Card.GRC.DATAROT.OR         = 0x10;
Card.GRC.DATAROT.XOR        = 0x18;
Card.GRC.DATAROT.FUNC       = 0x18;
Card.GRC.DATAROT.MASK       = 0x1F;
Card.GRC.READMAP = {};
Card.GRC.READMAP.INDX       = 0x04;     // READ MAP SELECT
Card.GRC.READMAP.NUM        = 0x03;
Card.GRC.MODE = {};
Card.GRC.MODE.INDX          = 0x05;     // MODE REGISTER
Card.GRC.MODE.WRITE_MODE0   = 0x00;     // write mode 0x0: each plane written with CPU data, rotated as needed, unless SR enabled
Card.GRC.MODE.WRITE_MODE1   = 0x01;     // write mode 0x1: each plane written with contents of the processor latches (loaded by a read)
Card.GRC.MODE.WRITE_MODE2   = 0x02;     // write mode 0x2: memory plane N is written with 8 bits matching data bit N
Card.GRC.MODE.WRITE_MODE3   = 0x03;     // write mode 0x3: VGA only
Card.GRC.MODE.WRITE         = 0x03;
Card.GRC.MODE.TEST          = 0x04;
Card.GRC.MODE.READ_MODE0    = 0x00;     // read mode 0x0: read map mode
Card.GRC.MODE.READ_MODE1    = 0x08;     // read mode 0x1: color compare mode
Card.GRC.MODE.EVENODD       = 0x10;
Card.GRC.MODE.SHIFT         = 0x20;
Card.GRC.MISC = {};
Card.GRC.MISC.INDX          = 0x06;     // MISCELLANEOUS
Card.GRC.MISC.GRAPHICS      = 0x01;     // set for graphics mode addressing, clear for text mode addressing
Card.GRC.MISC.CHAIN         = 0x02;     // set for odd/even planes selected with odd/even values of the processor AO bit
Card.GRC.MISC.MAPMEM        = 0x0C;     //
Card.GRC.MISC.MAPA0128      = 0x00;     //
Card.GRC.MISC.MAPA064       = 0x04;     //
Card.GRC.MISC.MAPB032       = 0x08;     //
Card.GRC.MISC.MAPB832       = 0x0C;     //
Card.GRC.COLRDC = {};
Card.GRC.COLRDC.INDX        = 0x07;     // COLOR DON'T CARE
Card.GRC.BITMASK = {};
Card.GRC.BITMASK.INDX       = 0x08;     // BIT MASK
Card.GRC.TOTAL_REGS         = 0x09;

if (DEBUGGER) Card.GRC.REGS = ["SRESET","ESRESET","COLRCMP","DATAROT","READMAP","MODE","MISC","COLRDC","BITMASK"];

/*
 * EGA Memory Access Functions
 *
 * Here's where we define all the getMemoryAccess() functions that know how to deal with "planar" EGA memory,
 * which consists of 32-bit values for every byte of address space, allowing us to internally store plane 0
 * bytes in bits 0-7, plane 1 bytes in bits 8-15, plane 2 bytes in bits 16-23, and plane 3 bytes in bits 24-31.
 *
 * All our functions have slightly more overhead than the standard Bus memory access functions, because the
 * offset (off) parameter is block-relative, which we must transform into a buffer-relative offset.  Fortunately,
 * all our Memory objects know this and have already recorded their buffer-relative offset in "this.offset".
 *
 * Also, the EGA includes a set of latches, one for each plane, which must be updated on most reads/writes;
 * we rely on the Memory object's "this.controller" property to give us access to the Card's state.
 *
 * And we take a little extra time to conditionally set fDirty on writes, meaning if a write did not actually
 * change the value of the memory, we will not set fDirty.  The default write functions in memory.js don't take
 * that performance hit, but here, it may be worthwhile, because if it results in fewer dirty blocks, display
 * updates may be faster.
 *
 * Note that we don't have to worry about dealing with word accesses that straddle block boundaries, because
 * the Bus component automatically breaks those accesses into separate byte requests.  Similarly, byte and word
 * values for the write functions have already been pre-masked by the Bus component to 8 and 16 bits, respectively.
 *
 * My motto: Be paranoid, but also be careful not to do any more work than you absolutely have to.
 *
 *
 * CGA Emulation on the EGA
 *
 * Modes 4/5 (320x200 low-res graphics) emulate the same buffer format that the CGA uses.  To recap: 1 byte contains
 * 4 pixels (pixel 0 in bits 7-6, pixel 1 in bits 5-4, etc), and thus one row of pixels is 80 (0x50) bytes long.
 * Moreover, all even rows are stored in the first 8K of the frame buffer (at 0xB8000), and all odd rows are stored
 * in the second 8K (at 0xBA000).  Of each 8K, only 8000 (0x1F40) bytes are used (80 bytes X 100 rows); the remaining
 * 192 bytes of each 8K are unused.
 *
 * For these modes, the EGA's GRC.MODE is programmed with 0x30: Card.GRC.MODE.EVENODD and Card.GRC.MODE.SHIFT.
 * The latter claims to work by forming each 2-bit pixel with even bits from plane 0 and odd bits from plane 1;
 * however, I'm unclear how that works if even bytes are only written to plane 0 and odd bytes are only written to
 * plane 1, as Card.GRC.MODE.EVENODD implies, because plane 0 would never have any bits for the odd bytes, and
 * plane 1 would never have any bits for the even bytes.  Clearly, I'm missing something.
 *
 *
 * Even/Odd Memory Access Functions
 *
 * The "EVENODD" functions deal with the EGA's default text-mode addressing, where every EVEN address is mapped to
 * plane 0 (and plane 2) and every ODD address is mapped to plane 1 (and plane 3).  This occurs when SEQ.MODE.SEQUENTIAL
 * is clear (and GRC.MODE.EVENODD is set), turning address bit 0 (A0) into a "plane select" bit.  Whether A0 is
 * also used as a memory address bit depends on CRTC.MODE_CTRL.BM: if it's set, then we're in "Byte Mode" and A0 is
 * used as-is; if it's clear, then we're in "Word Mode", and either A15 (when CRTC.MODE_CTRL.AW is set) or A13
 * (when CRTC.MODE_CTRL.AW is clear, typically when only 64Kb of EGA memory is installed) is substituted for A0.
 *
 * Note that A13 remains clear until addresses reach 8K, at which point we've spanned 32Kb of EGA memory, so it makes
 * sense to propagate A13 to A0 at that point, so that the next 8K of addresses start using ODD instead of EVEN bytes,
 * and no memory is wasted on a 64Kb EGA card.
 *
 * These functions, however, don't yet deal with all those subtleties: A0 is currently used only as a "plane select"
 * bit and set to zero for addressing purposes, meaning that only the EVEN bytes in EGA memory will ever be used.
 */

Card.ACCESS = {};

/*
 * Values returned by getAccess(); the low byte describes the current "read mode", while the high byte describes the
 * current "write mode".
 */
Card.ACCESS.READ = {};
Card.ACCESS.READ.EVENODD    = 0x0001;           // this can also be OR'ed with the other read modes
Card.ACCESS.READ.MODE0      = 0x0002;
Card.ACCESS.READ.MODE1      = 0x0010;
Card.ACCESS.READ.MASK       = 0x00ff;
Card.ACCESS.WRITE = {};
Card.ACCESS.WRITE.EVENODD   = 0x0100;           // this can also be OR'ed with the other write modes
Card.ACCESS.WRITE.MODE0     = 0x0200;
Card.ACCESS.WRITE.MODE0ROT  = 0x0400;
Card.ACCESS.WRITE.MODE0AND  = 0x0600;
Card.ACCESS.WRITE.MODE0OR   = 0x0A00;
Card.ACCESS.WRITE.MODE0XOR  = 0x0E00;
Card.ACCESS.WRITE.MODE1     = 0x1000;
Card.ACCESS.WRITE.MODE2     = 0x2000;
Card.ACCESS.WRITE.MODE2AND  = 0x6000;
Card.ACCESS.WRITE.MODE2OR   = 0xA000;
Card.ACCESS.WRITE.MODE2XOR  = 0xE000;
Card.ACCESS.WRITE.MASK      = 0xff00;

/**
 * readShort(off)
 *
 * @this {Memory}
 * @param {number} off
 * @return {number}
 */
Card.ACCESS.readShort = function readShort(off)
{
    return this.readByte(off) | (this.readByte(off + 1) << 8);
};

/**
 * readLong(off)
 *
 * @this {Memory}
 * @param {number} off
 * @return {number}
 */
Card.ACCESS.readLong = function readLong(off)
{
    return this.readByte(off) | (this.readByte(off + 1) << 8) | (this.readByte(off + 2) << 16) | (this.readByte(off + 3) << 24);
};

/**
 * writeShort(off, w)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} w
 */
Card.ACCESS.writeShort = function writeShort(off, w)
{
    Component.assert(!(w & ~0xffff));
    this.writeByte(off, w & 0xff);
    this.writeByte(off + 1, w >> 8);
};

/**
 * writeLong(off, w)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} w
 */
Card.ACCESS.writeLong = function writeLong(off, w)
{
    this.writeByte(off, w & 0xff);
    this.writeByte(off + 1, (w >> 8) & 0xff);
    this.writeByte(off + 2, (w >> 16) & 0xff);
    this.writeByte(off + 3, (w >>> 24));
};

/**
 * readByteMode0(off)
 *
 * @this {Memory}
 * @param {number} off
 * @return {number}
 */
Card.ACCESS.readByteMode0 = function readByteMode0(off)
{
    off += this.offset;
    var dw = this.controller.latches = this.adw[off];
    return (dw >> this.controller.nReadMapShift) & 0xff;
};

/**
 * readByteMode0EvenOdd(off)
 *
 * @this {Memory}
 * @param {number} off
 * @return {number}
 */
Card.ACCESS.readByteMode0EvenOdd = function readByteMode0EvenOdd(off)
{
    off += this.offset;
    var idw = off & ~0x1;
    return (!(off & 1)? this.adw[idw] : (this.adw[idw] >> 8)) & 0xff;
};

/**
 * readByteMode1(off)
 *
 * @this {Memory}
 * @param {number} off
 * @return {number}
 */
Card.ACCESS.readByteMode1 = function readByteMode1(off)
{
    off += this.offset;
    var dw = this.adw[off];
    var nColorCompare = this.controller.nColorCompare & this.controller.nColorDontCare;
    var b = 0, bit = 0x80;
    while (bit) {
        if ((dw & nColorCompare) == nColorCompare) b |= bit;
        nColorCompare >>>= 1;
        bit >>= 1;
    }
    return b;
};

/**
 * writeByteMode0(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
Card.ACCESS.writeByteMode0 = function writeByteMode0(off, b)
{
    var idw = off + this.offset;
    var dw = b | (b << 8) | (b << 16) | (b << 24);
    dw = (this.adw[idw] & ~this.controller.nWriteMapMask) | (dw & this.controller.nWriteMapMask);
    dw = (dw & this.controller.nBitMapMask) | (this.controller.latches & ~this.controller.nBitMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/**
 * writeByteMode0EvenOdd(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
Card.ACCESS.writeByteMode0EvenOdd = function writeByteMode0EvenOdd(off, b)
{
    off += this.offset;
    var dw = b | (b << 8) | (b << 16) | (b << 24);
    //
    // When even/odd addressing is enabled, nWriteMapMask must be cleared for planes 1 and 3 if
    // the address is even, and cleared for planes 0 and 2 if the address is odd.
    //
    var idw = off & ~0x1;
    var maskMaps = this.controller.nWriteMapMask & (idw == off? 0x00ff00ff : 0xff00ff00);
    dw = (dw & maskMaps) | (this.adw[idw] & ~maskMaps);
    dw = (dw & this.controller.nBitMapMask) | (this.controller.latches & ~this.controller.nBitMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/**
 * writeByteMode0Rot(off, b)
 *
 * Supporting Set/Reset means that for every plane for which Set/Reset is enabled, we must
 * replace the corresponding byte in "dw" with a byte of zeros or ones.  This is accomplished with
 * nSetMapMask, nSetMapData, and nSetMapBits.  nSetMapMask is the inverse of the ESRESET bits,
 * because we use it to mask the processor data; nSetMapData records the desired SRESET bits; and
 * nSetMapBits contains the bits to replace those that we masked in the processor data.
 *
 * We could have done this:
 *
 *      dw = (dw & this.controller.nSetMapMask) | (this.controller.nSetMapData & ~this.controller.nSetMapMask)
 *
 * but by maintaining nSetMapBits equal to (nSetMapData & ~nSetMapMask), we are able to make the writes
 * slightly more efficient.
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
Card.ACCESS.writeByteMode0Rot = function writeByteMode0Rot(off, b)
{
    var idw = off + this.offset;
    b = ((b >> this.controller.nDataRotate) | (b << (8 - this.controller.nDataRotate)) & 0xff);
    var dw = b | (b << 8) | (b << 16) | (b << 24);
    dw = (dw & this.controller.nSetMapMask) | this.controller.nSetMapBits;
    dw = (dw & this.controller.nWriteMapMask) | (this.adw[idw] & ~this.controller.nWriteMapMask);
    dw = (dw & this.controller.nBitMapMask) | (this.controller.latches & ~this.controller.nBitMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/**
 * writeByteMode0And(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
Card.ACCESS.writeByteMode0And = function writeByteMode0And(off, b)
{
    var idw = off + this.offset;
    b = ((b >> this.controller.nDataRotate) | (b << (8 - this.controller.nDataRotate)) & 0xff);
    var dw = b | (b << 8) | (b << 16) | (b << 24);
    dw = (dw & this.controller.nSetMapMask) | this.controller.nSetMapBits;
    dw &= this.controller.latches;
    dw = (dw & this.controller.nWriteMapMask) | (this.adw[idw] & ~this.controller.nWriteMapMask);
    dw = (dw & this.controller.nBitMapMask) | (this.controller.latches & ~this.controller.nBitMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/**
 * writeByteMode0Or(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
Card.ACCESS.writeByteMode0Or = function writeByteMode0Or(off, b)
{
    var idw = off + this.offset;
    b = ((b >> this.controller.nDataRotate) | (b << (8 - this.controller.nDataRotate)) & 0xff);
    var dw = b | (b << 8) | (b << 16) | (b << 24);
    dw = (dw & this.controller.nSetMapMask) | this.controller.nSetMapBits;
    dw |= this.controller.latches;
    dw = (dw & this.controller.nWriteMapMask) | (this.adw[idw] & ~this.controller.nWriteMapMask);
    dw = (dw & this.controller.nBitMapMask) | (this.controller.latches & ~this.controller.nBitMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/**
 * writeByteMode0Xor(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
Card.ACCESS.writeByteMode0Xor = function writeByteMode0Xor(off, b)
{
    var idw = off + this.offset;
    b = ((b >> this.controller.nDataRotate) | (b << (8 - this.controller.nDataRotate)) & 0xff);
    var dw = b | (b << 8) | (b << 16) | (b << 24);
    dw = (dw & this.controller.nSetMapMask) | this.controller.nSetMapBits;
    dw ^= this.controller.latches;
    dw = (dw & this.controller.nWriteMapMask) | (this.adw[idw] & ~this.controller.nWriteMapMask);
    dw = (dw & this.controller.nBitMapMask) | (this.controller.latches & ~this.controller.nBitMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/**
 * writeByteMode1(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (ignored; the EGA latches provide the source data)
 */
Card.ACCESS.writeByteMode1 = function writeByteMode1(off, b)
{
    var idw = off + this.offset;
    var dw = (this.adw[idw] & ~this.controller.nWriteMapMask) | (this.controller.latches & this.controller.nWriteMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/**
 * writeByteMode2(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
Card.ACCESS.writeByteMode2 = function writeByteMode2(off, b)
{
    var idw = off + this.offset;
    var dw = Video.aEGAByteToDW[b & 0xf];
    dw = (dw & this.controller.nWriteMapMask) | (this.adw[idw] & ~this.controller.nWriteMapMask);
    dw = (dw & this.controller.nBitMapMask) | (this.controller.latches & ~this.controller.nBitMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/**
 * writeByteMode2And(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
Card.ACCESS.writeByteMode2And = function writeByteMode2And(off, b)
{
    var idw = off + this.offset;
    var dw = Video.aEGAByteToDW[b & 0xf];
    dw &= this.controller.latches;
    dw = (dw & this.controller.nWriteMapMask) | (this.adw[idw] & ~this.controller.nWriteMapMask);
    dw = (dw & this.controller.nBitMapMask) | (this.controller.latches & ~this.controller.nBitMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/**
 * writeByteMode2Or(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
Card.ACCESS.writeByteMode2Or = function writeByteMode2Or(off, b)
{
    var idw = off + this.offset;
    var dw = Video.aEGAByteToDW[b & 0xf];
    dw |= this.controller.latches;
    dw = (dw & this.controller.nWriteMapMask) | (this.adw[idw] & ~this.controller.nWriteMapMask);
    dw = (dw & this.controller.nBitMapMask) | (this.controller.latches & ~this.controller.nBitMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/**
 * writeByteMode2Xor(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
Card.ACCESS.writeByteMode2Xor = function writeByteMode2Xor(off, b)
{
    var idw = off + this.offset;
    var dw = Video.aEGAByteToDW[b & 0xf];
    dw ^= this.controller.latches;
    dw = (dw & this.controller.nWriteMapMask) | (this.adw[idw] & ~this.controller.nWriteMapMask);
    dw = (dw & this.controller.nBitMapMask) | (this.controller.latches & ~this.controller.nBitMapMask);
    if (this.adw[idw] != dw) {
        this.adw[idw] = dw;
        this.fDirty = true;
    }
};

/*
 * Mappings from getAccess() values to access functions above
 */
Card.ACCESS.afn = [];
Card.ACCESS.afn[Card.ACCESS.READ.MODE0]     = Card.ACCESS.readByteMode0;
Card.ACCESS.afn[Card.ACCESS.READ.MODE0 | Card.ACCESS.READ.EVENODD]  = Card.ACCESS.readByteMode0EvenOdd;
Card.ACCESS.afn[Card.ACCESS.READ.MODE1]     = Card.ACCESS.readByteMode1;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE0]    = Card.ACCESS.writeByteMode0;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE0ROT] = Card.ACCESS.writeByteMode0Rot;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE0AND] = Card.ACCESS.writeByteMode0And;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE0OR]  = Card.ACCESS.writeByteMode0Or;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE0XOR] = Card.ACCESS.writeByteMode0Xor;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE0 | Card.ACCESS.WRITE.EVENODD] = Card.ACCESS.writeByteMode0EvenOdd;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE1]    = Card.ACCESS.writeByteMode1;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE2]    = Card.ACCESS.writeByteMode2;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE2AND] = Card.ACCESS.writeByteMode2And;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE2OR]  = Card.ACCESS.writeByteMode2Or;
Card.ACCESS.afn[Card.ACCESS.WRITE.MODE2XOR] = Card.ACCESS.writeByteMode2Xor;

/**
 * initEGA(data)
 *
 * Another one of my frustrations with JSON is that it encodes empty arrays with non-zero lengths as
 * arrays of nulls, which means that any uninitialized register arrays whose elements were all originally
 * undefined come back via the JSON round-trip as *initialized* arrays whose elements are now all null.
 *
 * I'm a bit surprised, because JavaScript purists want us to use the '===' operator to determine
 * whether an element is initialized (eg, 'aReg[i] === undefined'), but because of this JSON stupidity,
 * that would require all such tests to become 'aReg[i] === undefined || aReg[i] === null'.  Great.
 *
 * The simple solution is to change such comparisons to 'aReg[i] == null', because undefined is coerced
 * to null, whereas numeric values are not.
 *
 * Someday, perhaps a purist can explain to me why the coercion of '==' is evil, but JSON's coercion of
 * 'undefined' values to 'null' values is not.
 *
 * [What do I mean by "another" frustration?  Let me talk to you some day about disallowing hex constants,
 * or insisting that property names be quoted, or refusing to allow comments.  I think it's fine for
 * JSON.stringify() to produce output that adheres to rules like that -- although some parameters to control
 * the output would be nice -- but refusing to let JSON.parse() parse objects that are, in fact, perfectly
 * parseable, is just JSON being a dick.]
 *
 * @this {Card}
 * @param {Array|undefined} data
 * @param {number} nMonitorType
 */
Card.prototype.initEGA = function(data, nMonitorType)
{
    if (data === undefined) {
        data = [
            /* 0*/  false,
            /* 1*/  0,
            /* 2*/  new Array(Card.ATC.TOTAL_REGS),
            /* 3*/  0,
            /* 4*/  (nMonitorType == ChipSet.MONITOR.MONO? 0: Card.MISC.IO_SELECT),
            /* 5*/  0,
            /* 6*/  0,
            /* 7*/  new Array(Card.SEQ.TOTAL_REGS),
            /* 8*/  0,
            /* 9*/  0,
            /*10*/  0,
            /*11*/  new Array(Card.GRC.TOTAL_REGS),
            /*12*/  0,
            /*13*/  [this.addrBuffer, this.sizeBuffer, this.cbMemory],
            /*14*/  new Array(this.cbMemory >> 2),      // divide cbMemory by 4 since this is an array of DWORDs (8 bits for each of 4 planes)
            /*
             * Card.ACCESS.WRITE.MODE0 by itself is a pretty good default, but if we choose to "randomize" the screen with
             * text characters prior to starting the machine, defaulting to Card.ACCESS.WRITE.EVENODD is more faithful to how
             * characters and attributes are typically stored (ie, in planes 0 and 1, respectively).  As soon as the machine
             * starts up and initializes the hardware itself, these defaults won't matter.
             */
            /*15*/  Card.ACCESS.READ.MODE0 | Card.ACCESS.READ.EVENODD | Card.ACCESS.WRITE.MODE0 | Card.ACCESS.WRITE.EVENODD,
            /*16*/  0,
            /*17*/  0xffffffff|0,
            /*18*/  0,
            /*19*/  0xffffffff|0,
            /*20*/  0,
            /*21*/  0xffffffff|0,
            /*22*/  0,
            /*23*/  0,
            /*24*/  0
        ];
    }

    this.fATCData   = data[0];
    this.iATCReg    = data[1];
    this.aATCRegs   = data[2];
    this.asATCRegs  = DEBUGGER? Card.ATC.REGS : [];
    this.status0    = data[3];      // aka STATUS0 (not to be confused with this.statusReg, which the EGA refers to as STATUS1)
    this.miscReg    = data[4];
    this.featReg    = data[5];      // for feature control bits, see Card.FEAT_CTRL.BITS; for feature status bits, see Card.STATUS0.FEAT
    this.iSEQReg    = data[6];
    this.aSEQRegs   = data[7];
    this.asSEQRegs  = DEBUGGER? Card.SEQ.REGS : [];
    this.iGRCPos1   = data[8];
    this.iGRCPos2   = data[9];
    this.iGRCReg    = data[10];
    this.aGRCRegs   = data[11];
    this.asGRCRegs  = DEBUGGER? Card.GRC.REGS : [];
    this.latches    = data[12];

    /*
     * Since we originally neglected to save/restore the card's active frame buffer address and length,
     * we're now stashing all that information in data[13].  So if we're presented with an old data entry
     * that contains only the card's memory size, fix it up.
     *
     * TODO: This code just creates the required array; the correct frame buffer address and length would
     * still need to be calculated from the current GRC registers; checkMode() knows how to do that, but I'm
     * not prepared to shoehorn in a call to checkMode() here, and potentially create more issues, for an
     * old problem that will eventually disappear anyway.
     */
    var a = data[13];
    if (typeof a == "number") {
        a = [this.addrBuffer, this.sizeBuffer, a];
    }
    this.addrBuffer = a[0];
    this.sizeBuffer = a[1];
    Component.assert(this.cbMemory === a[2]);

    var cdw = this.cbMemory >> 2;
    this.adwMemory  = data[14];
    if (this.adwMemory && this.adwMemory.length < cdw) {
        this.adwMemory = State.decompressEvenOdd(this.adwMemory, cdw);
    }
    this.setMemoryAccess(data[15]);

    /*
     * nReadMapShift must perfectly track how the GRC.READMAP register is programmed, so that Card.ACCESS.READ.MODE0
     * memory read functions read the appropriate plane.  This default is not terribly critical, unless Card.ACCESS.WRITE.MODE0
     * is chosen as our default AND you want the screen randomizer to work.
     */
    this.nReadMapShift  = data[16];

    /*
     * Similarly, nWriteMapMask must perfectly track how the SEQ.MAPMASK register is programmed, so that memory write
     * functions write the appropriate plane(s).  Again, this default is not terribly critical, unless Card.ACCESS.WRITE.MODE0
     * is chosen as our default AND you want the screen randomizer to work.
     */
    this.nWriteMapMask  = data[17];
    this.nDataRotate    = data[18];
    this.nBitMapMask    = data[19];
    this.nSetMapData    = data[20];
    this.nSetMapMask    = data[21];
    this.nSetMapBits    = data[22];
    this.nColorCompare  = data[23];
    this.nColorDontCare = data[24];
};

/**
 * saveCard()
 *
 * @this {Card}
 * @return {Array}
 */
Card.prototype.saveCard = function()
{
    var data = [];
    if (this.iCard !== undefined) {
        data[0] = this.fActive;
        data[1] = this.modeReg;
        data[2] = this.colorReg;
        data[3] = this.statusReg;
        data[4] = this.iCRTCReg | (this.iCRTCPrev << 8);
        data[5] = this.aCRTCRegs;
        if (this.iCard == Video.CARDS.EGA) {
            data[6] = this.saveEGA();
        }
        data[7] = this.nInitCycles;
    }
    return data;
};

/**
 * saveEGA()
 *
 * @this {Card}
 * @return {Array}
 */
Card.prototype.saveEGA = function()
{
    var data = [];
    data[0]  = this.fATCData;
    data[1]  = this.iATCReg;
    data[2]  = this.aATCRegs;
    data[3]  = this.status0;
    data[4]  = this.miscReg;
    data[5]  = this.featReg;
    data[6]  = this.iSEQReg;
    data[7]  = this.aSEQRegs;
    data[8]  = this.iGRCPos1;
    data[9]  = this.iGRCPos2;
    data[10] = this.iGRCReg;
    data[11] = this.aGRCRegs;
    data[12] = this.latches;
    data[13] = [this.addrBuffer, this.sizeBuffer, this.cbMemory];
    data[14] = State.compressEvenOdd(this.adwMemory);
    data[15] = this.nAccess;
    data[16] = this.nReadMapShift;
    data[17] = this.nWriteMapMask;
    data[18] = this.nDataRotate;
    data[19] = this.nBitMapMask;
    data[20] = this.nSetMapData;
    data[21] = this.nSetMapMask;
    data[22] = this.nSetMapBits;
    data[23] = this.nColorCompare;
    data[24] = this.nColorDontCare;
    return data;
};

/**
 * dumpCard()
 *
 * @this {Card}
 */
Card.prototype.dumpCard = function()
{
    if (DEBUGGER) {
        /*
         * Start with registers that are common to all cards....
         */
        this.dumpRegs("CRTC", this.iCRTCReg, this.aCRTCRegs, this.asCRTCRegs);

        if (this.iCard == Video.CARDS.MDA || this.iCard == Video.CARDS.CGA) {
            this.dumpRegs(" MODEREG", this.modeReg);
            this.dumpRegs(" STATUS1", this.statusReg);
        }

        if (this.iCard == Video.CARDS.CGA) {
            this.dumpRegs("   COLOR", this.colorReg);
        }

        if (this.iCard == Video.CARDS.EGA) {
            this.dbg.println(" ATCDATA: " + this.fATCData);
            this.dumpRegs(" ATC", this.iATCReg, this.aATCRegs, this.asATCRegs);
            this.dumpRegs(" GRC", this.iGRCReg, this.aGRCRegs, this.asGRCRegs);
            this.dumpRegs(" SEQ", this.iSEQReg, this.aSEQRegs, this.asSEQRegs);
            this.dumpRegs("    FEAT", this.featReg);
            this.dumpRegs("    MISC", this.miscReg);
            this.dumpRegs(" STATUS0", this.status0);
            this.dumpRegs(" LATCHES", this.latches);
            this.dbg.println("  ACCESS: " + str.toHexWord(this.nAccess));
            this.dbg.println("Use 'dump video buffer' to dump video memory");
            /*
             * There are few more EGA regs we could dump, like GRCPos1, GRCPos2, but does anyone care?
             */
        }
    }
};

/**
 * dumpBuffer()
 *
 * @this {Card}
 * @param {string} sParm
 */
Card.prototype.dumpBuffer = function(sParm)
{
    if (DEBUGGER) {
        if (!this.adwMemory) {
            this.dbg.println("no buffer");
            return;
        }
        var idw = str.parseInt(sParm);
        idw = (idw !== undefined? idw - this.addrBuffer : (this.prevDump || 0));
        if (idw < 0) idw = 0;
        var cLines = 8, sDump = "";
        for (var iLine = 0; iLine < cLines; iLine++) {
            var sData = str.toHex(this.addrBuffer + idw) + ":";
            for (var i = 0; i < 8 && idw < this.adwMemory.length; i++) {
                var dw = this.adwMemory[idw++];
                sData += " " + str.toHex(dw);
            }
            if (sDump) sDump += "\n";
            sDump += sData;
        }
        if (sDump) this.dbg.println(sDump);
        this.prevDump = idw;
    }
};

/**
 * dumpRegs()
 *
 * Since we don't pre-allocate the register arrays (eg, ATC, CRTC, GRC, etc) on a Card, we can't
 * rely on their array length, so we instead rely on the number of register names supplied in asRegs.
 *
 * @this {Card}
 * @param {string} sName
 * @param {number} iReg
 * @param {Array} [aRegs]
 * @param {Array} [asRegs]
 */
Card.prototype.dumpRegs = function(sName, iReg, aRegs, asRegs)
{
    if (DEBUGGER) {
        if (!aRegs) {
            this.dbg.println(sName + ": " + str.toHexByte(iReg));
            return;
        }
        var s = "", i, cchMax = 0;
        for (i = 0; i < asRegs.length; i++) {
            if (cchMax < asRegs[i].length) cchMax = asRegs[i].length;
        }
        cchMax++;
        for (i = 0; i < asRegs.length; i++) {
            if (s) s += '\n';
            s += sName + "[" + str.toHexByte(i) + "]: " + str.pad(asRegs[i], cchMax) + str.toHexByte(aRegs[i]) + (i === iReg? "*" : "");
        }
        this.dbg.println(s);
    }
};

/**
 * getMemoryBuffer(addr)
 *
 * If we passed a controller object (ie, this card) to addMemory(), then each allocated Memory block
 * will call this function to obtain a buffer.
 *
 * @this {Card}
 * @param {number} addr
 * @return {Array} containing the buffer (and the offset within that buffer that corresponds to the requested block)
 */
Card.prototype.getMemoryBuffer = function(addr)
{
    return [this.adwMemory, addr - this.addrBuffer];
};

/**
 * getMemoryAccess()
 *
 * Return the last set of memory access functions recorded by setMemoryAccess().
 *
 * @this {Card}
 * @return {Array.<function()>}
 */
Card.prototype.getMemoryAccess = function()
{
    return this.afnAccess;
};

/**
 * setMemoryAccess(nAccess)
 *
 * This transforms the memory access value that getAccess() returns into the best available set of
 * memory access functions, which are then returned via getMemoryAccess() to any memory blocks we allocate
 * or modify.
 *
 * @this {Card}
 * @param {number|undefined} nAccess
 */
Card.prototype.setMemoryAccess = function(nAccess)
{
    if (nAccess != null && nAccess != this.nAccess) {

        var nReadAccess = nAccess & Card.ACCESS.READ.MASK;
        var fnReadByte = Card.ACCESS.afn[nReadAccess];
        if (!fnReadByte) {
            if (DEBUG && this.dbg) this.dbg.message("Card.setMemoryAccess(" + str.toHexWord(nAccess) + "): missing readByte handler");
            if (nReadAccess & Card.ACCESS.READ.EVENODD) {
                fnReadByte = Card.ACCESS.afn[Card.ACCESS.READ.EVENODD];
            }
        }
        var nWriteAccess = nAccess & Card.ACCESS.WRITE.MASK;
        var fnWriteByte = Card.ACCESS.afn[nWriteAccess];
        if (!fnWriteByte) {
            if (DEBUG && this.dbg) this.dbg.message("Card.setMemoryAccess(" + str.toHexWord(nAccess) + "): missing writeByte handler");
            if (nWriteAccess & Card.ACCESS.WRITE.EVENODD) {
                fnWriteByte = Card.ACCESS.afn[Card.ACCESS.WRITE.EVENODD];
            }
        }
        if (!this.afnAccess) {
            this.afnAccess  = [null, Card.ACCESS.readShort, Card.ACCESS.readLong, null, Card.ACCESS.writeShort, Card.ACCESS.writeLong];
        }
        this.afnAccess[0] = fnReadByte;
        this.afnAccess[3] = fnWriteByte;
        this.nAccess = nAccess;
    }
};

/*
 * Card Specifications
 *
 * We support dynamically switching between MDA and CGA cards by simply flipping switches on
 * the virtual SW1 switch block and resetting the machine.  However, I'm not sure I'll support
 * dynamically switching the EGA card the same way; there's certainly no UI for it at this point.
 *
 * For each supported card, there is a cardSpec array that the Card class uses to initialize the
 * card's defaults:
 *
 *      [0]: card descriptor
 *      [1]: default CRTC port address
 *      [2]: default frame buffer address
 *      [3]: default frame buffer size
 *      [4]: total on-board memory (if no "memory" parm was specified)
 *      [5]: default monitor type
 *
 * If total on-board memory is zero, then addMemory() will simply add the specified frame buffer
 * to the address space; otherwise, we will allocate an internal buffer (adwMemory) and tell addMemory()
 * to map it to the frame buffer address.  The latter approach gives us total control over the buffer;
 * refer to getMemoryAccess().
 *
 * TODO: Consider allocating our own buffer for all video cards, not just EGA.  For MDA/CGA, I'm not sure
 * it would offer any benefits, other than allowing our internal update functions, like updateScreen(),
 * to access the buffer directly, instead of going through the Bus memory interface.
 */
Video.cardSpecs = [];
Video.cardSpecs[Video.CARDS.MDA] = ["MDA", Card.MDA.CRTC.INDX.PORT, 0xB0000, 0x01000, 0, ChipSet.MONITOR.MONO];
Video.cardSpecs[Video.CARDS.CGA] = ["CGA", Card.CGA.CRTC.INDX.PORT, 0xB8000, 0x04000, 0, ChipSet.MONITOR.COLOR];
Video.cardSpecs[Video.CARDS.EGA] = ["EGA", Card.CGA.CRTC.INDX.PORT, 0xB8000, 0x04000, 0x10000, ChipSet.MONITOR.EGACOLOR];

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * This is a notification issued by the Computer component, after all the other components (notably the CPU)
 * have had a chance to initialize.
 *
 * @this {Video}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {X86CPU} cpu
 * @param {Debugger} dbg
 */
Video.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;

    bus.addPortInputTable(this, Video.aPortInput);
    bus.addPortOutputTable(this, Video.aPortOutput);

    if (this.model == "ega") {
        bus.addPortInputTable(this, Video.aEGAPortInput);
        bus.addPortOutputTable(this, Video.aEGAPortOutput);
    }

    if (DEBUGGER && dbg) {
        var video = this;
        dbg.messageDump(Messages.VIDEO, function onDumpVideo(sParm) {
            video.dumpVideo(sParm);
        });
    }

    /*
     * If we have an associated keyboard, then ensure that the keyboard will be notified whenever
     * the canvas gets focus and receives input.
     */
    this.kbd = cmp.getComponentByType("Keyboard");
    if (this.kbd && this.canvasScreen) {
        for (var s in this.bindings) {
            if (s.indexOf("lock") > 0) this.kbd.setBinding("led", s, this.bindings[s]);
        }
        this.kbd.setBinding(this.textareaScreen? "textarea" : "canvas", "kbd", this.inputScreen);
    }

    this.bEGASW = 0x09;         // our default "switches" setting (see aEGAMonitorSwitches)
    this.chipset = cmp.getComponentByType("ChipSet");
    if (this.chipset && this.sEGASW) {
        this.bEGASW = this.chipset.parseSwitches(this.sEGASW, this.bEGASW);
    }

    if (this.kbd && this.fTouchScreen) this.captureTouch();
};

/**
 * setBinding(sHTMLType, sBinding, control)
 *
 * @this {Video}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "refresh")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Video.prototype.setBinding = function(sHTMLType, sBinding, control)
{
    var video = this;

    if (!this.bindings[sBinding]) {

        /*
         * We now save every binding that comes in, so that if there are bindings for "caps-lock' and the like,
         * we can forward them to the Keyboard.
         */
        this.bindings[sBinding] = control;

        switch (sBinding) {

        case "fullScreen":
            if (this.container && this.container.doFullScreen) {
                control.onclick = function onClickFullScreen() {
                    if (DEBUG) video.printMessage("fullScreen()");
                    video.doFullScreen();
                };
            } else {
                if (DEBUG) this.log("FullScreen API not available");
                control.parentNode.removeChild(control);
            }
            return true;

        case "lockPointer":
            this.sLockMessage = control.textContent;
            if (this.inputScreen && this.inputScreen.lockPointer) {
                control.onclick = function onClickLockPointer() {
                    if (DEBUG) video.printMessage("lockPointer()");
                    video.lockPointer(true);
                };
            } else {
                if (DEBUG) this.log("Pointer Lock API not available");
                control.parentNode.removeChild(control);
            }
            return true;

        case "refresh":
            control.onclick = function onClickRefresh() {
                if (DEBUG) video.printMessage("refreshScreen()");
                video.updateScreen(true);
            };
            return true;

        default:
            break;
        }
    }
    return false;
};

/**
 * setFocus()
 *
 * @this {Video}
 */
Video.prototype.setFocus = function()
{
    if (this.inputScreen) this.inputScreen.focus();
};

/**
 * getInput()
 *
 * This is an interface used by the Mouse component, so that it can invoke capture/release mouse events from the screen element.
 *
 * @this {Video}
 * @param {Mouse} [mouse]
 * @return {Object|undefined}
 */
Video.prototype.getInput = function(mouse)
{
    this.mouse = mouse;
    return this.inputScreen;
};

/**
 * doFullScreen()
 *
 * @this {Video}
 * @return {boolean} true if request successful, false if not (eg, failed OR not supported)
 */
Video.prototype.doFullScreen = function()
{
    var fSuccess = false;
    if (this.container) {
        if (this.container.doFullScreen) {
            this.container.style.width = this.container.style.height = "100%";
            this.container.style.backgroundColor = "black";
            this.container.doFullScreen();
            fSuccess = true;
        }
        this.setFocus();
    }
    return fSuccess;
};

/**
 * notifyFullScreen(fFullScreen)
 *
 * @this {Video}
 * @param {boolean} fFullScreen
 */
Video.prototype.notifyFullScreen = function(fFullScreen)
{
    this.printMessage("notifyFullScreen(" + fFullScreen + ")", true);
    if (this.kbd) this.kbd.notifyEscape(fFullScreen);
};

/**
 * lockPointer()
 *
 * @this {Video}
 * @param {boolean} fLock
 * @return {boolean} true if request successful, false if not (eg, failed OR not supported)
 */
Video.prototype.lockPointer = function(fLock)
{
    var fSuccess = false;
    if (this.inputScreen) {
        if (fLock) {
            if (this.inputScreen.lockPointer) {
                this.inputScreen.lockPointer();
                this.mouse.notifyPointerLocked(true);
                fSuccess = true;
            }
        } else {
            if (this.inputScreen.unlockPointer) {
                this.inputScreen.unlockPointer();
                this.mouse.notifyPointerLocked(false);
                fSuccess = true;
            }
        }
        this.setFocus();
    }
    return fSuccess;
};

/**
 * notifyPointerActive(fActive)
 *
 * @this {Video}
 * @param {boolean} fActive
 * @return {boolean} true if autolock enabled AND pointer lock supported, false if not
 */
Video.prototype.notifyPointerActive = function(fActive)
{
    if (this.fAutoLock) {
        return this.lockPointer(fActive);
    }
    return false;
};

/**
 * notifyPointerLocked(fLocked)
 *
 * @this {Video}
 * @param {boolean} fLocked
 */
Video.prototype.notifyPointerLocked = function(fLocked)
{
    if (this.mouse) {
        this.mouse.notifyPointerLocked(fLocked);
        if (this.kbd) this.kbd.notifyEscape(fLocked);
    }
    var control = this.bindings["lockPointer"];
    if (control) control.textContent = (fLocked? "Press Esc to Unlock Pointer" : this.sLockMessage);
};

/**
 * captureTouch()
 *
 * @this {Video}
 */
Video.prototype.captureTouch = function()
{
    var control = this.inputScreen;
    if (control) {
        var video = this;
        if (!this.fCaptured) {
            control.addEventListener(
                'touchstart',
                function onTouchStart(event) { video.onTouchStart(event); },
                false                   // we'll specify false for the 'useCapture' parameter for now...
            );
            control.addEventListener(
                'touchmove',
                function onTouchMove(event) { video.onTouchMove(event); },
                true
            );
            control.addEventListener(
                'touchend',
                function onTouchEnd(event) { video.onTouchEnd(event); },
                false                   // we'll specify false for the 'useCapture' parameter for now...
            );
            if (DEBUG) {
                /*
                 */
                control.addEventListener(
                    'mousedown',
                    function onMouseDown(event) { video.onTouchStart(event); },
                    false               // we'll specify false for the 'useCapture' parameter for now...
                );
                /*
                control.addEventListener(
                    'mousemove',
                    function onMouseMove(event) { video.onTouchMove(event); },
                    true
                );
                control.addEventListener(
                    'mouseup',
                    function onMouseUp(event) { video.onTouchEnd(event); },
                    false               // we'll specify false for the 'useCapture' parameter for now...
                );
                 */
            }
            // this.log("touch events captured");
            this.fCaptured = true;
        }
    }
};

/**
 * onFocusChange(fFocus)
 *
 * @this {Video}
 * @param {boolean} fFocus is true if gaining focus, false if losing it
 */
Video.prototype.onFocusChange = function(fFocus)
{
    if (this.fHasFocus != fFocus && DEBUG && this.messageEnabled()) {
        this.printMessage("onFocusChange(" + (fFocus? "true" : "false") + ")", true);
    }
    /*
     * As per http://stackoverflow.com/questions/6740253/disable-scrolling-when-changing-focus-form-elements-ipad-web-app,
     * I decided to try this work-around to prevent the webpage from scrolling around whenever the canvas is given
     * focus.  That sort of scrolling-into-view sounds great in principle, but in practice, if you were reading some other
     * portion of the page, it can be irritating to be scrolled away from that portion when refreshing/returning to the page.
     *
     * However, this work-around doesn't seem to work with the latest version of Safari (or else I misunderstood something).
     *
     *  if (fFocus) {
     *      window.scrollTo(0, 0);
     *      window.document.body.scrollTop = 0;
     *  }
     */
    this.fHasFocus = fFocus;
    if (this.kbd) this.kbd.onFocusChange(fFocus);
};

/*
Video.prototype.releaseTouch = function()
{
};
*/

/**
 * onTouchStart(event)
 *
 * @this {Video}
 * @param {Event} event object from a 'touch' event
 */
Video.prototype.onTouchStart = function(event)
{
    if (DEBUG) this.printMessage("onTouchStart()");
    this.processTouchEvent(event, true);
};

/**
 * onTouchMove(event)
 *
 * @this {Video}
 * @param {Event} event object from a 'touch' event
 */
Video.prototype.onTouchMove = function(event)
{
    if (DEBUG) this.printMessage("onTouchMove()");
    this.processTouchEvent(event, false);
};

/**
 * onTouchEnd(event)
 *
 * @this {Video}
 * @param {Event} event object from a 'touch' event
 */
Video.prototype.onTouchEnd = function(event)
{
    if (DEBUG) this.printMessage("onTouchEnd()");
};

/**
 * processTouchEvent(event, fStart)
 *
 * @this {Video}
 * @param {Event} event object from a 'touch' event
 * @param {boolean} fStart if this is a 'touchstart' event
 */
Video.prototype.processTouchEvent = function(event, fStart)
{
    // if (!event) event = window.event;
    /*
     * My thinking here is that if the canvas does NOT yet have focus, then we should actually SKIP
     * the usual preventDefault() call, so that everything the user has come to expect (eg, activation of
     * the soft keyboard) will work as before.
     *
     * The process of touching the canvas means it should ultimately receive focus, and as long as it
     * retains focus, preventDefault() will always be called.
     */
    if (this.fHasFocus) event.preventDefault();

    /*
     * Touch coordinates (that is, the pageX and pageY properties) are relative to the page, so to make
     * them relative to the canvas, we must subtract the canvas's left and top positions.  This Apple web page:
     *
     *      https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/AddingMouseandTouchControlstoCanvas/AddingMouseandTouchControlstoCanvas.html
     *
     * makes it sound simple, but it turns out we have to walk the canvas' entire "parentage" of DOM elements
     * to get the exact offsets.
     *
     * TODO: Determine whether the getBoundingClientRect() code used in panel.js for mouse events can also
     * be used here to simplify this annoyingly complicated code for touch events.
     */
    var xTouchOffset = 0;
    var yTouchOffset = 0;
    var eCurrent = this.canvasScreen;
    do {
        if (!isNaN(eCurrent.offsetLeft)) {
            xTouchOffset += eCurrent.offsetLeft;
            yTouchOffset += eCurrent.offsetTop;
        }
    } while ((eCurrent = eCurrent.offsetParent));

    /*
     * Due to the responsive nature of our pages, the displayed size of the canvas may be smaller than the
     * allocated size, and the coordinates we receive from touch events are based on the currently displayed size.
     */
    var xScale =  this.cxScreen / this.canvasScreen.offsetWidth;
    var yScale = this.cyScreen / this.canvasScreen.offsetHeight;

    /**
     * @name Event
     * @property {Array} targetTouches
     */
    var xTouch, yTouch;
    if (!event.targetTouches) {
        xTouch = event.pageX;
        yTouch = event.pageY;
    } else {
        xTouch = event.targetTouches[0].pageX;
        yTouch = event.targetTouches[0].pageY;
    }
    xTouch = ((xTouch - xTouchOffset) * xScale);
    yTouch = ((yTouch - yTouchOffset) * yScale);
    var xThird = (xTouch / (this.cxScreen / 3)) | 0;
    var yThird = (yTouch / (this.cyScreen / 3)) | 0;

    /*
     * At this point, xThird and yThird should both be one of 0, 1 or 2, indicating which horizontal and vertical
     * third of the virtual screen the touch event occurred.
     */
    if (/* xThird == 1 && */ yThird != 1) {
        if (!yThird) {
            this.kbd.addActiveKey(Keyboard.CLICKCODES.UP, true);
        } else {
            this.kbd.addActiveKey(Keyboard.CLICKCODES.DOWN, true);
        }
    } else if (/* yThird == 1 && */ xThird != 1) {
        if (!xThird) {
            this.kbd.addActiveKey(Keyboard.CLICKCODES.LEFT, true);
        } else {
            this.kbd.addActiveKey(Keyboard.CLICKCODES.RIGHT, true);
        }
    }
};

/**
 * powerUp(data, fRepower)
 *
 * @this {Video}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
Video.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data || !this.restore) {
            this.reset();
        } else {
            if (!this.restore(data)) return false;
        }
    }
    return true;
};

/**
 * powerDown(fSave)
 *
 * This is where we might add some method of blanking the display, without the disturbing the video
 * buffer contents, and blocking all further updates to the display.
 *
 * @this {Video}
 * @param {boolean} fSave
 * @return {Object|boolean}
 */
Video.prototype.powerDown = function(fSave)
{
    return fSave && this.save? this.save() : true;
};

/**
 * reset()
 *
 * @this {Video}
 */
Video.prototype.reset = function()
{
    var fRandomize = true;
    var nMonitorType = ChipSet.MONITOR.NONE;

    /*
     * We'll ask the ChipSet what SW1 indicates for monitor type, but we may override it if a specific
     * video card model is set.  For EGA, SW1 is supposed to be set to indicate NO monitor, and we rely
     * on the EGA's own switch settings instead.
     */
    if (this.chipset) {
        nMonitorType = this.chipset.getSWVideoMonitor();
    }

    var fEGA = false;
    if (this.model) {
        switch (this.model) {
        case "ega":
            fEGA = true;
            var aMonitors = Video.aEGAMonitorSwitches[this.bEGASW];
            /*
             * TODO: Figure out how to deal with aMonitors[2], the boolean which indicates
             * whether the EGA is driving the primary monitor (true) or the secondary monitor (false).
             */
            if (aMonitors) nMonitorType = aMonitors[0];
            if (!nMonitorType) nMonitorType = ChipSet.MONITOR.EGACOLOR;
            break;
        case "mda":
            nMonitorType = ChipSet.MONITOR.MONO;
            break;
        case "cga":
            /* falls through */
        default:
            nMonitorType = ChipSet.MONITOR.COLOR;
            break;
        }
    }

    if (this.nMonitorType !== nMonitorType) {
        this.nMonitorType = nMonitorType;
        fRandomize = true;
    }

    this.cardActive = null;
    this.cardMono = this.cardMDA = new Card(this, Video.CARDS.MDA);
    this.cardColor = this.cardCGA = new Card(this, Video.CARDS.CGA);

    if (!fEGA) {
        /*
         * Define a dummy (uninitialized) EGA card for now
         */
        this.cardEGA = new Card();
    } else {
        this.cardEGA = new Card(this, Video.CARDS.EGA, null, this.cbMemory);
        this.enableEGA();
    }

    /*
     * We need to call buildFonts() *after* the card(s) are initialized but *before* setMode() is called.
     */
    this.buildFonts();

    this.nMode = null;
    this.nModeDefault = (nMonitorType == ChipSet.MONITOR.MONO? Video.MODES.MDA_80X25 : Video.MODES.CGA_80X25);

    this.iCellCursor = -1;  // initially, there is no visible cursor cell
    this.cBlinks = -1;      // initially, blinking is not active
    this.cBlinkVisible = 0; // no visible blinking characters (yet)

    this.setMode(this.nModeDefault);

    if (this.cardActive.addrBuffer && fRandomize) {
        /*
         * On the initial power-on, we initialize the video buffer to random characters,
         * as a way of testing whether our font(s) were successfully loaded.  It's assumed
         * that our default display mode is a text mode, and that since this is a reset,
         * the CRTC.START_ADDR registers are zero as well.
         *
         * If this is an MDA device, then the buffer should reside at 0xB0000 through 0xB0FFF,
         * for a total length of 4Kb (0x1000), where every even byte contains a character code,
         * and every odd byte contains an attribute code.  See the ATTR bit definitions above for
         * applicable color, intensity, and blink values.  On a CGA device, the buffer resides
         * at 0xB8000 through 0xBBFFF, for a total length of 16Kb.
         *
         * Note that the only valid MDA display mode (7) is the 80x25 text mode, which uses 4000
         * bytes (2000 character bytes + 2000 attribute bytes), not all 4096 bytes; addrScreenLimit
         * reflects the visible limit, not the physical limit.  Also, as noted in updateScreen(),
         * this simplistic calculation of the extent of visible screen memory is valid only for
         * text modes; in general, it's safer to use cardActive.sizeBuffer as the extent.
         */
        var addrScreenLimit = this.cardActive.addrBuffer + this.cbScreen;
        for (var addrScreen = this.cardActive.addrBuffer; addrScreen < addrScreenLimit; addrScreen += 2) {
            var dataRandom = Math.floor(Math.random() * 0x10000);
            var bChar, bAttr;
            if (this.nMonitorType == ChipSet.MONITOR.EGACOLOR) {
                /*
                 * For the EGA, we choose sequential characters; for random characters, copy the MDA/CGA code below.
                 */
                bChar = (addrScreen >> 1) & 0xff;
                bAttr = (dataRandom >> 8) & ~Video.ATTRS.BGND_BLINK;    // TODO: turn blink attributes off unless we can ensure blinking is initially disabled
                if ((bAttr >> 4) == (bAttr & 0xf)) {
                    bAttr ^= 0x0f;      // if background matches foreground, invert foreground to ensure character visibility
                }
            } else {
                bChar = dataRandom & 0xff;
                bAttr = ((dataRandom & 0x100)? (Video.ATTRS.FGND_WHITE | Video.ATTRS.BGND_BLACK) : (Video.ATTRS.FGND_BLACK | Video.ATTRS.BGND_WHITE)) | ((Video.ATTRS.FGND_BRIGHT /* | Video.ATTRS.BGND_BLINK */) & (dataRandom >> 8));
            }
            this.bus.setShortDirect(addrScreen, bChar | (bAttr << 8));
        }
        this.updateScreen(true);
    }
};

/**
 * enableEGA()
 *
 * Redirect cardMono or cardColor to cardEGA as appropriate.
 *
 * @this {Video}
 */
Video.prototype.enableEGA = function()
{
    if (!(this.cardEGA.miscReg & Card.MISC.IO_SELECT)) {
        this.cardMono = this.cardEGA;
        this.cardColor = this.cardCGA;  // this is done mainly to siphon away any CGA I/O
    } else {
        this.cardMono = this.cardMDA;   // similarly, this is done to siphon away any MDA I/O
        this.cardColor = this.cardEGA;
    }
};

/**
 * save()
 *
 * This implements save support for the Video component.
 *
 * @this {Video}
 * @return {Object}
 */
Video.prototype.save = function()
{
    var state = new State(this);
    state.set(0, this.cardMDA.saveCard());
    state.set(1, this.cardCGA.saveCard());
    state.set(2, [this.nMonitorType, this.nModeDefault, this.nMode]);
    state.set(3, this.cardEGA.saveCard());
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the Video component.
 *
 * @this {Video}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
Video.prototype.restore = function(data)
{
    var a = data[2];
    this.nMonitorType = a[0];
    this.nModeDefault = a[1];
    this.nMode = a[2];

    this.cardActive = null;
    this.cardMono = this.cardMDA = new Card(this, Video.CARDS.MDA, data[0]);
    this.cardColor = this.cardCGA = new Card(this, Video.CARDS.CGA, data[1]);

    /*
     * If no EGA was originally initialized, then cardEGA will remain uninitialized.
     */
    this.cardEGA = new Card(this, Video.CARDS.EGA, data[3], this.cbMemory);
    if (this.cardEGA.fActive) this.enableEGA();

    /*
     * We need to call buildFonts() *after* the card(s) are initialized but *before* setMode() is called.
     */
    this.buildFonts();

    /*
     * While I could restore the active card here, it's better for setMode() to do it, because
     * setMode() will also take care of mapping the appropriate video buffer.  So, after restore() has
     * finished, we call checkMode(), because the current video mode (nMode) is determined by the
     * active card state.
     *
     * Unfortunately, that creates a chicken-and-egg problem, since I just said I didn't want to select
     * the active card here.
     *
     * So, we'll add some "cop-out" code to checkMode(): if there's no active card, then fall-back
     * to the last known video mode (nMode) and force a call to setMode().
     *
     *      this.cardActive = (this.cardMDA.fActive? this.cardMDA : (this.cardCGA.fActive? this.cardCGA : undefined));
     */
    if (!this.checkMode()) return false;

    this.checkCursor();
    return true;
};

/**
 * onLoadSetFonts(sFontFile, sFontData, nErrorCode)
 *
 * @this {Video}
 * @param {string} sFontFile
 * @param {string} sFontData
 * @param {number} nErrorCode (response from server if anything other than 200)
 */
Video.prototype.onLoadSetFonts = function(sFontFile, sFontData, nErrorCode)
{
    if (nErrorCode) {
        this.notice("Unable to load font ROM image (error " + nErrorCode + ")");
        return;
    }
    try {
        /*
         * The most likely source of any exception will be right here, where we're parsing the JSON-encoded data.
         */
        var abFontData = eval("(" + sFontData + ")");

        if (!abFontData.length) {
            Component.error("Empty font ROM image: " + sFontFile);
            return;
        }
        else if (abFontData.length == 1) {
            Component.error(abFontData[0]);
            return;
        }
        /*
         * Translate the character data into separate "fonts", each of which will be a separate canvas object, with all
         * 256 characters arranged in a 16x16 grid.
         */
        if (abFontData.length == 8192) {
            /*
             * Here are the first few rows of MDA font data, at the 0K and 2K boundaries:
             *
             *      00000000  00 00 00 00 00 00 00 00  00 00 7e 81 a5 81 81 bd  |..........~.....|
             *      00000010  00 00 7e ff db ff ff c3  00 00 00 36 7f 7f 7f 7f  |..~........6....|
             *      ...
             *      00000800  00 00 00 00 00 00 00 00  99 81 7e 00 00 00 00 00  |..........~.....|
             *      00000810  e7 ff 7e 00 00 00 00 00  3e 1c 08 00 00 00 00 00  |..~.....>.......|
             *
             * 8 bytes of data from a row in each of the 2K chunks are combined to form a 8-bit wide character with
             * a maximum height of 16 bits.  Assembling the bits for character 0x01 (a happy face), we observe the following:
             *
             *      0 0 0 0 0 0 0 0  <== 00 from offset 0x0008
             *      0 0 0 0 0 0 0 0  <== 00 from offset 0x0009
             *      0 1 1 1 1 1 1 0  <== 7e from offset 0x000A
             *      1 0 0 0 0 0 0 1  <== 81 from offset 0x000B
             *      1 0 1 0 0 1 0 1  <== a5 from offset 0x000C
             *      1 0 0 0 0 0 0 1  <== 81 from offset 0x000D
             *      1 0 0 0 0 0 0 1  <== 81 from offset 0x000E
             *      1 0 1 1 1 1 0 1  <== bd from offset 0x000F
             *      1 0 0 1 1 0 0 1  <== 99 from offset 0x0808
             *      1 0 0 0 0 0 0 1  <== 81 from offset 0x0809
             *      0 1 1 1 1 1 1 0  <== 7e from offset 0x080A
             *      0 0 0 0 0 0 0 0  <== 00 from offset 0x080B
             *      0 0 0 0 0 0 0 0  <== 00 from offset 0x080C
             *      0 0 0 0 0 0 0 0  <== 00 from offset 0x080D
             *      0 0 0 0 0 0 0 0  <== 00 from offset 0x080E
             *      0 0 0 0 0 0 0 0  <== 00 from offset 0x080F
             *
             * In the second 2K chunk, we observe that the last two bytes of every font cell definition are zero;
             * this confirms our understanding that MDA font cell size is 8x14.
             *
             * Finally, there's the issue of screen cell size, which is actually 9x14 on the MDA.  We compensate for that
             * by building a 9x14 font, even though there's only 8x14 bits of data. As http://www.seasip.info/VintagePC/mda.html
             * explains:
             *
             *      "For characters C0h-DFh, the ninth pixel column is a duplicate of the eighth; for others, it's blank."
             *
             * This last point is confirmed by "The IBM Personal Computer From The Inside Out", p.295:
             *
             *      "Another unique feature of the monochrome adapter is a set of line-drawing and area-fill characters
             *      that give continuous lines and filled areas. This is unusual for a display with a 9x14 character box
             *      because the character generator provides a row only eight dots wide. On most displays, a blank 9th
             *      dot is then inserted between characters. On the monochrome display, there is circuitry that duplicates
             *      the 8th dot into the 9th dot position for characters whose ASCII codes are 0xB0 through 0xDF."
             *
             * The only question is: is the range actually 0xC0-0xDF, or 0xB0-0xDF???  I'll assume the latter, since
             * 0xB0 is where the line-drawing/area-fill characters appear to begin.
             *
             * The CGA font is part of the same ROM.  In fact, there are TWO CGA fonts in the ROM: a thin 5x7 "single dot"
             * font located at offset 0x1000, and a thick 7x7 "double dot" font at offset 0x1800.  The latter is the default
             * font, unless overridden by a jumper setting on the CGA card, so it is our default CGA font as well (although
             * someday we may provide a virtual jumper setting that allows you to select the thinner font).
             *
             * The first offset we pass to setFontData() is the offset of the MDA font.  For the second (CGA) font offset,
             * we choose the thicker "double dot" CGA font at 0x1800 (which was the PC's default font as well), instead
             * of the thinner "single dot" font at 0x1000.
             */
            this.setFontData(abFontData, [0x0000, 0x1800]);
        }
        else {
            this.notice("Unrecognized font data length (" + abFontData.length + ")");
            return;
        }

    } catch (e) {
        this.notice("Font ROM data error: " + e.message);
        return;
    }
    /*
     * If we're still here, then we're ready!
     */
    this.setReady();
};

/**
 * onROMLoad(abRom)
 *
 * Called by copyROM() whenever a ROM with a 'notify' attribute set to our component ID has been loaded.
 *
 * If model is "ega", then we assume the associated ROM is the original IBM EGA ROM, which stores
 * its 8x14 font data at 0x2230 (and unlike the MDA/CGA character generator ROM, which splits the first
 * 8 rows and remaining 6 rows of each character across separate 2K chunks, the bytes for all the EGA
 * character rows are contiguous); the total size of the 8x14 font is 0xE00 bytes.
 *
 * At 0x3030, there is an "ALPHA SUPPLEMENT" table, which contains 15 bytes per row instead of 14,
 * because each row is preceded by one byte containing the corresponding ASCII code; there are 20 entries
 * in the "ALPHA SUPPLEMENT" table, for a total size of 0x12C bytes.
 *
 * Finally, at 0x3160, we have the 8x8 font data (also known as the thicker "double dot" CGA font);
 * the total size of the 8x8 font is 0x800 bytes.  No other font data is present in the EGA ROM;
 * the thin 5x7 "single dot" CGA font is notably absent, which is fine, because we never loaded it for
 * the MDA/CGA either.
 *
 * TODO: Determine how the "ALPHA SUPPLEMENT" table is used and whether we need to add some "run-time"
 * font generation to support it (as opposed to "init-time" generation, which is all we do now).  There's
 * probably a similar need for user-defined fonts; for now, they're just not supported.
 *
 * @this {Video}
 * @param {Array.<number>} abROM
 */
Video.prototype.onROMLoad = function(abROM)
{
    if (this.model == "ega") {
        /*
         * TODO: Unlike the MDA/CGA font data, we may want to hang onto this data, so that we can
         * regenerate the color font(s) whenever the foreground and/or background colors have changed.
         */
        if (DEBUG) this.printMessage("onROMLoad(): EGA fonts loaded");
        this.setFontData(abROM, [0x2230, 0x3160], 8);
    }
    this.setReady();
};

/**
 * getCardColors(nBitsPerPixel)
 *
 * @this {Video}
 * @param {number} [nBitsPerPixel]
 * @returns {Array}
 */
Video.prototype.getCardColors = function(nBitsPerPixel)
{
    if (nBitsPerPixel == 1) {
        /*
         * Only 2 total colors.
         */
        this.aRGB[0] = Video.aCGAColors[Video.ATTRS.FGND_BLACK];
        this.aRGB[1] = Video.aCGAColors[Video.ATTRS.FGND_WHITE];
        return this.aRGB;
    }

    if (nBitsPerPixel == 2) {
        /*
         * Of the 4 colors returned, the first color comes from colorReg and the other 3 come from one of
         * the two hard-coded CGA color sets:
         *
         *      Color Set 1             Color Set 2
         *      -----------             -----------
         *      Background (0x00)       Background (0x00)
         *      Green      (0x12)       Cyan       (0x13)
         *      Red        (0x14)       Magenta    (0x15)
         *      Brown      (0x16)       White      (0x17)
         *
         * The numbers in parentheses are the EGA ATC palette register values that the EGA BIOS uses for each
         * color set; on an EGA, I synthesize a fake CGA colorReg value, until I figure out exactly how the EGA
         * simulates the CGA color palette.  TODO: Figure it out.
         */
        var colorReg = this.cardActive.colorReg;
        if (this.cardActive === this.cardEGA) {
            var bBackground = this.cardEGA.aATCRegs[0];
            colorReg = bBackground & Card.CGA.COLOR.BORDER;
            if (bBackground & Card.ATC.PALETTE.BRIGHT) colorReg |= Card.CGA.COLOR.BRIGHT;
            if (this.cardEGA.aATCRegs[1] != 0x12) colorReg |= Card.CGA.COLOR.COLORSET2;
        }
        this.aRGB[0] = Video.aCGAColors[colorReg & (Card.CGA.COLOR.BORDER | Card.CGA.COLOR.BRIGHT)];
        var aColorSet = (colorReg & Card.CGA.COLOR.COLORSET2)? Video.aCGAColorSet2 : Video.aCGAColorSet1;
        for (var iColor = 0; iColor < aColorSet.length; iColor++) {
            this.aRGB[iColor+1] = Video.aCGAColors[aColorSet[iColor]];
        }
        return this.aRGB;
    }

    if (this.cardColor === this.cardCGA) {
        /*
         * There's no need to update this.aRGB if we simply want to return a hard-coded set of 16 colors.
         */
        return Video.aCGAColors;
    }

    this.assert(this.cardColor === this.cardEGA);

    var aRegs = (this.cardEGA.aATCRegs[15] != null? this.cardEGA.aATCRegs : Video.aEGAPalDef);
    for (var i = 0; i < this.aRGB.length; i++) {
        var b = aRegs[i] || 0;
        var bRed =   (((b & 0x04)? 0xaa : 0) | ((b & 0x20)? 0x55 : 0));
        var bGreen = (((b & 0x02)? 0xaa : 0) | ((b & 0x10)? 0x55 : 0));
        var bBlue =  (((b & 0x01)? 0xaa : 0) | ((b & 0x08)? 0x55 : 0));
        this.aRGB[i] = [bRed, bGreen, bBlue, 0xff];
    }
    return this.aRGB;
};

/**
 * setFontData(abFontData, aFontOffsets, cxFontChar)
 *
 * To support partial font rebuilds (required for the EGA), we now preserve the original font data (abFontData),
 * font offsets (aFontOffsets), and font character width (8 for the EGA, undefined for the MDA/CGA).
 *
 * TODO: Ultimately, we want to have exactly one dedicated font for the EGA, the data for which we'll read directly
 * from plane 2 of video memory, instead of relying on the original font data in ROM.  Relying on the ROM data was
 * originally just a crutch to help get EGA support bootstrapped.
 *
 * Also, for the MDA/CGA, we should be discarding the font data after the first buildFonts() call, because we
 * should not need to ever rebuild the fonts for those cards (both their font patterns and colors were hard-coded).
 *
 * @this {Video}
 * @param {*} abFontData is the raw font data, from the ROM font file
 * @param {Array.<number>} aFontOffsets contains offsets into abFontData: [0] for MDA, [1] for CGA
 * @param {number} [cxFontChar] is a fixed character width to use for all fonts; undefined to use MDA/CGA defaults
 */
Video.prototype.setFontData = function(abFontData, aFontOffsets, cxFontChar)
{
    this.abFontData = abFontData;
    this.aFontOffsets = aFontOffsets;
    this.cxFontChar = cxFontChar;
};

/**
 * buildFonts()
 *
 * buildFonts() is called whenever the Video component is reset or restored; we used to build the fonts as soon
 * as the ROM containing them was loaded, and then throw away the underlying font data, but with the EGA's ability
 * to change the color of any font, font building must now be deferred until the reset or restore notifications,
 * ensuring we have access to all the colors the card is currently programmed to use.
 *
 * We're also called whenever EGA palette registers are modified, since one or more fonts will likely need
 * to be rebuilt (this is because our fonts contain pre-rendered images of all glyphs for all 16 active colors).
 * Calls to buildFonts() should not be expensive though: the underlying createFont() function rebuilds a font only
 * if its color has actually changed.
 *
 * TODO: We should avoid rebuilding fonts when palette registers change in graphics modes.  More importantly, our
 * font code is still written with the assumption that, like the MDA/CGA, the underlying font data never changes.
 * The EGA, however, stores its fonts in plane 2, which means fonts are dynamic; this needs to be fixed.
 *
 * Supporting dynamic EGA fonts should not be hard though.  We can get rid of abFontData and simply build a
 * temporary snapshot of all the font bytes in plane 2 of the EGA's video buffer (adwMemory), and pass that on to
 * buildFont() instead.  We'll also need to either invalidate the existing font's color (to trigger a rebuild) or
 * pass a new "force rebuild" flag.
 *
 * Once that's done, an added benefit will be that we can build just the font(s) that have been loaded into plane 2,
 * instead of the multitude of fonts that we now build on a just-in-case basis (eg, the MDA font, the 8x8 CGA font
 * for 43-line mode, and so on).
 *
 * @this {Video}
 * @return {boolean} true if any or all fonts were (re)built, false if nothing changed
 */
Video.prototype.buildFonts = function()
{
    var fChanges = false;

    /*
     * There's no point building any fonts if (a) we're in a non-windowed (eg, command-line) environment or
     * (b) no font data was loaded.
     */
    if (window && this.abFontData) {

        var offSplit = this.cxFontChar? 0 : 0x0800;
        var cxChar = this.cxFontChar? this.cxFontChar : 9;

        if (this.buildFont(Video.FONTS.MDA, this.aFontOffsets[0], offSplit, cxChar, 14, this.abFontData, Video.aMDAColors, Video.aMDAColorMap)) {
            fChanges = true;
        }

        var aRGBColors = this.getCardColors();
        offSplit = 0x0000;
        cxChar = this.cxFontChar? this.cxFontChar : 8;
        if (this.buildFont(Video.FONTS.CGA, this.aFontOffsets[1], offSplit, cxChar, 8, this.abFontData, aRGBColors)) {
            fChanges = true;
        }

        if (this.cxFontChar) {
            if (this.buildFont(Video.FONTS.EGA, this.aFontOffsets[0], 0, this.cxFontChar, 14, this.abFontData, aRGBColors)) {
                fChanges = true;
            }
        }
    }
    return fChanges;
};

/**
 * buildFont(nFont, offData, offSplit, cxChar, cyChar, abFontData, aRGBColors, aColorMap)
 *
 * This is a wrapper for createFont() which also takes care loading double-size fonts when fDoubleFont is set.
 *
 * @this {Video}
 * @param {number} nFont
 * @param {number} offData is the offset of the font data
 * @param {number} offSplit is the offset of any split font data, or zero if not split
 * @param {number} cxChar is the width of the font characters
 * @param {number} cyChar is the height of the font characters
 * @param {*} abFontData is the raw font data, from the ROM font file
 * @param {Array} aRGBColors is an array of color RGB variations, corresponding to supported FGND attribute values
 * @param {Array} [aColorMap] contains color indexes corresponding to attribute values (if not supplied, the mapping is assumed to be 1-1)
 * @return {boolean} true if any or all fonts were (re)built, false if nothing changed
 */
Video.prototype.buildFont = function(nFont, offData, offSplit, cxChar, cyChar, abFontData, aRGBColors, aColorMap)
{
    var fChanges = false;

    if (DEBUG && this.messageEnabled()) {
        this.printMessage("buildFont(" + nFont + "): building " + Video.cardSpecs[nFont][0] + " font");
    }
    if (this.createFont(nFont, offData, offSplit, cxChar, cyChar, abFontData, aRGBColors, aColorMap)) fChanges = true;

    /*
     * If font-doubling is enabled, then load a double-size version of the font as well, as it provides
     * sharper rendering, especially when the screen cell size is a multiple of the above font cell size;
     * in the case of the CGA, this may also be useful for 40-column modes.
     */
    if (this.fDoubleFont) {
        nFont <<= 1;
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("buildFont(" + nFont + "): building " + Video.cardSpecs[nFont >> 1][0] + " double-size font");
        }
        if (this.createFont(nFont, offData, offSplit, cxChar, cyChar, abFontData, aRGBColors, aColorMap)) fChanges = true;
    }
    return fChanges;
};

/**
 * createFont(nFont, offData, offSplit, cxChar, cyChar, abFontData, aRGBColors, aColorMap)
 *
 * All color variations are stored on the same font canvas, arranged vertically as a series of grids, where each
 * grid is a 16x16 character glyph array.
 *
 * Since every character must be drawn first with its background color and then with the foreground shape on top,
 * I used to include a series of empty cells at the top every font canvas containing all supported background colors
 * (ie, before the character grids).  But now createFont() also creates an aCSSColors array that is saved alongside
 * the font canvas, and updateChar() uses that array in conjunction with fillRect() to draw character backgrounds.
 *
 * @this {Video}
 * @param {number} nFont
 * @param {number} offData is the offset of the font data
 * @param {number} offSplit is the offset of any split font data, or zero if not split
 * @param {number} cxChar is the width of the font characters
 * @param {number} cyChar is the height of the font characters
 * @param {*} abFontData is the raw font data, from the ROM font file
 * @param {Array} aRGBColors is an array of color RGB variations, corresponding to supported FGND attribute values
 * @param {Array|undefined} aColorMap contains color indexes corresponding to attribute values (if not supplied, the mapping is assumed to be 1-1)
 * @return {boolean} true if any or all fonts were (re)created, false if nothing changed
 */
Video.prototype.createFont = function(nFont, offData, offSplit, cxChar, cyChar, abFontData, aRGBColors, aColorMap)
{
    var fChanges = false;
    var nDouble = (nFont & 0x1)? 0 : 1;
    var font = this.aFonts[nFont];
    if (!font) {
        font = {
            cxCell:     cxChar << nDouble,
            cyCell:     cyChar << nDouble,
            aCSSColors: new Array(aRGBColors.length),
            aRGBColors: aRGBColors.slice(),     // using the Array slice() method to simply make a copy
            aColorMap:  aColorMap,
            aCanvas:    new Array(aRGBColors.length)
        };
    }
    for (var iColor = 0; iColor < aRGBColors.length; iColor++) {
        var rgbColor = aRGBColors[iColor];
        var rgbColorOrig = font.aCSSColors[iColor]? font.aRGBColors[iColor] : [];
        if (rgbColor[0] !== rgbColorOrig[0] || rgbColor[1] !== rgbColorOrig[1] || rgbColor[2] !== rgbColorOrig[2]) {
            if (DEBUG && this.messageEnabled()) {
                this.printMessage("creating font color " + iColor + " for font " + nFont);
            }
            this.createFontColor(font, iColor, rgbColor, nDouble, offData, offSplit, cxChar, cyChar, abFontData);
            fChanges = true;
        }
    }
    this.aFonts[nFont] = font;
    return fChanges;
};

/**
 * createFontColor(font, iColor, rgbColor, nDouble, offData, offSplit, cxChar, cyChar, abFontData)
 *
 * @this {Video}
 * @param {Object} font
 * @param {number} iColor
 * @param {Array} rgbColor contains the RGB values for iColor
 * @param {number} nDouble is 1 to double output font dimensions, 0 to match input dimensions
 * @param {number} offData is the offset of the font data
 * @param {number} offSplit is the offset of any split font data, or zero if not split
 * @param {number} cxChar is the width of the font characters
 * @param {number} cyChar is the height of the font characters
 * @param {*} abFontData is the raw font data, from the ROM font file
 */
Video.prototype.createFontColor = function(font, iColor, rgbColor, nDouble, offData, offSplit, cxChar, cyChar, abFontData)
{
    /*
     * Now we're ready to create a 16x16 character grid for the specified color.  Note that all
     * the character bits are opaque (alpha=0xff) while all the surrounding bits are transparent
     * (alpha=0x00, as specified in the 4th byte of rgbOff).
     *
     * Originally, I created 256 ImageData objects, using context.createImageData(cxChar,cyChar),
     * then setting its pixels to match those of an individual character, and then drawing characters
     * with contextFont.putImageData().  But putImageData() is relatively slow....
     *
     * Now I create a new canvas, with dimensions that allow me to arrange all 256 characters in an
     * 16x16 grid -- much like the "chargen.png" bitmap used in the C1Pjs version of the Video component.
     * Then drawing becomes much the same as before, because it turns out that drawImage() accepts either
     * an image object OR a canvas object.
     *
     * This also yields better performance, since drawImage() is much faster than putImageData().
     * We still have to use putImageData() to build the font canvas, but that's a one-time operation.
     */
    var rgbOff = [0x00, 0x00, 0x00, 0x00];
    var canvasFont = window.document.createElement("canvas");
    canvasFont.width = font.cxCell << 4;
    canvasFont.height = (font.cyCell << 4);
    var contextFont = canvasFont.getContext("2d");

    /*
     * See notes above regarding ImageSmoothingEnabled....
     *
     contextFont['mozImageSmoothingEnabled'] = false;
     contextFont['webkitImageSmoothingEnabled'] = false;
     */

    var iChar, x, y;
    var cyLimit = (cyChar < 8 || !offSplit)? cyChar : 8;
    var imageChar = contextFont.createImageData(font.cxCell, font.cyCell);

    for (iChar = 0; iChar < 256; iChar++) {
        for (y = 0; y < cyChar; y++) {
            /*
             * fUnderline should be true only in the FONT_MDA case, and only for the odd color variations
             * (1 and 3, out of variations 0 to 4), and only for the two bottom-most rows of the character cell
             * (which I still need to confirm)
             */
            var fUnderline = (font.aColorMap && (iColor & 0x1) && y >= cyChar - 2);
            var offChar = (y < cyLimit? offData + iChar * cyLimit + y : offSplit + iChar * cyLimit + y - cyLimit);
            var b = abFontData[offChar];
            for (var nRowDoubler = 0; nRowDoubler <= nDouble; nRowDoubler++) {
                for (x = 0; x < cxChar; x++) {
                    /*
                     * This "bit" of logic takes care of those characters (0xB0-0xDF) whose 9th bit must mirror the 8th bit;
                     * in all other cases, any bit past the 8th bit is automatically zero.  It also takes care of embedding a solid
                     * row of bits whenever fUnderline is true.
                     */
                    var bit = (fUnderline? 1 : (b & (0x80 >> (x >= 8 && iChar >= 0xB0 && iChar <= 0xDF? 7 : x))));
                    var xDst = (x << nDouble);
                    var yDst = (y << nDouble) + nRowDoubler;
                    var rgb = (bit? rgbColor : rgbOff);
                    this.setPixel(imageChar, xDst, yDst, rgb);
                    if (nDouble) this.setPixel(imageChar, xDst + 1, yDst, rgb);
                }
            }
        }
        /*
         * (iChar >> 4) performs the integer equivalent of Math.floor(iChar / 16), and (iChar & 0xf) is the equivalent of (iChar % 16).
         */
        contextFont.putImageData(imageChar, x = (iChar & 0xf) * font.cxCell, y = (iChar >> 4) * font.cyCell);
    }

    /*
     * The colors for cell backgrounds and cursor elements must be converted to CSS color strings.
     */
    font.aCSSColors[iColor] = "#" + str.toHexByte(rgbColor[0]) + str.toHexByte(rgbColor[1]) + str.toHexByte(rgbColor[2]);
    font.aRGBColors[iColor] = rgbColor;

    /*
     * Enable this code if you want to see what the generated font looks like....
     *
    if (MAXDEBUG) {
        var iSrcColor = (iColor == 15? 0 : iColor + 1);
        this.contextScreen.fillStyle = aCSSColors[iSrcColor];
        this.contextScreen.fillRect(iColor*(font.cxCell<<2), 0, canvasFont.width>>2, font.cyCell<<4);
        this.contextScreen.drawImage(canvasFont, 0, iColor*(font.cyCell<<4), canvasFont.width>>2, font.cyCell<<4, iColor*(font.cxCell<<2), 0, canvasFont.width>>2, font.cyCell<<4);
    }
     */

    font.aCanvas[iColor] = canvasFont;
};

/**
 * checkBlink()
 *
 * Called at the end of every updateScreen(), which may have updated cBlinkVisible to a non-zero value.
 *
 * Also called at the end of every checkCursor(); ie, whenever the CRT register(s) affecting the position or shape
 * of the hardware cursor have been modified, and any of iCellCursor, yCursor or cyCursor have been modified as a result.
 *
 * Note that the cursor always blinks when it's ON; it can only be turned OFF, moved off-screen, or its rate set to half
 * the normal blink rate (by default, it blinks at the normal blink rate).  Bits 5-6 of the CRTC.CURSOR_START register can
 * be set as follows:
 *
 *    00: Cursor blinks at normal blink rate
 *    01: Cursor is off
 *    10: (Same as 00)
 *    11: Cursor blinks at half the normal blink rate
 *
 * According to documentation, the normal blink rate is 1/16 of the frame rate (8 frames on, 8 off).
 *
 * TODO: As an aside, I've observed in the "real world" that the MDA cursor cycles about 3 times per second, and by "cycle"
 * I mean one full off-and-on-again cycle.  I'm assuming that's the normal rate (00), not the slower "half rate" (11).
 * Since that's faster than our current cursor blink rate, we should look into an option to boost our rate, without adversely
 * affecting the attribute blink rate (which is currently hard-coded at half the cursor blink rate), and we should look into
 * supporting "half rate" blinking, too.
 *
 * @this {Video}
 * @return {boolean} true if there are things to blink, false if not
 */
Video.prototype.checkBlink = function()
{
    if (this.cBlinkVisible > 0 || this.iCellCursor >= 0) {
        if (this.cBlinks < 0) {
            this.cBlinks = 0;
            /*
             * At this point, we can either fire up our own timer (doBlink), or rely on updateScreen()
             * being called by the CPU at a regular rate (eg, CPU.VIDEO_UPDATES_PER_SECOND = 60) and advance
             * cBlinks at the start of updateScreen() accordingly.
             *
             * doBlink() wants to increment cBlinks every 266ms.  On the other hand, if updateScreen() is being
             * called 60 times per second, that's about once every 16ms, so if every 16th updateScreen() increments
             * cBlinks, cBlinks should advance at the same rate.
             *
             * The only downside to relying on the CPU driving our blink count is that whenever the CPU is halted
             * (eg, by the PCjs debugger) all blinking stops -- all characters with the blink attribute AND the cursor.
             *
             * But we can simply say that when we halt, we mean "halt everything" (ie, call it a feature).
             *
             *      this.doBlink(true);
             */
        }
        return true;
    }
    this.cBlinks = -1;
    return false;
};

/**
 * checkCursor()
 *
 * Called whenever a CRT data register is updated, since there are multiple registers that can affect the
 * visibility of the cursor (more than these, actually, but I'm going to limit my initial support to standard
 * ROM BIOS controller settings):
 *
 *      CRTC.MAX_SCAN_LINE
 *      CRTC.CURSOR_START
 *      CRTC.CURSOR_END
 *      CRTC.START_ADDR_HI
 *      CRTC.START_ADDR_LO
 *      CRTC.CURSOR_ADDR_HI
 *      CRTC.CURSOR_ADDR_LO
 *
 * @this {Video}
 * @return {boolean} true if the cursor is visible, false if not
 */
Video.prototype.checkCursor = function()
{
    /*
     * The "hardware cursor" is never visible in graphics modes.
     */
    if (!this.nFont) return false;

    for (var i = Card.CRTC.CURSOR_START.INDX; i <= Card.CRTC.CURSOR_ADDR_LO; i++) {
        if (this.cardActive.aCRTCRegs[i] == null)
            return false;
    }

    var bCursorFlags = this.cardActive.aCRTCRegs[Card.CRTC.CURSOR_START.INDX];
    var bCursorStart = bCursorFlags & Card.CRTC.CURSOR_START.MASK;
    var bCursorEnd = this.cardActive.aCRTCRegs[Card.CRTC.CURSOR_END.INDX] & Card.CRTC.CURSOR_END.MASK;
    var bCursorMax = this.cardActive.aCRTCRegs[Card.CRTC.MAX_SCAN_LINE] & Card.CRTC.CURSOR_END.MASK;

    /*
     * HACK: The original EGA BIOS has a cursor emulation bug when 43-line mode is enabled, so we attempt to detect
     * that particular combination of bad values and automatically fix them.
     */
    var fEGA = false;
    if (this.cardActive === this.cardEGA) {
        fEGA = true;
        if (bCursorMax == 7 && bCursorStart == 4 && !bCursorEnd) bCursorEnd = 7;
    }

    /*
     * One way of disabling the cursor is to set bit 5 (Card.CRTC.CURSOR_START.BLINKOFF) of the CRTC.CURSOR_START flags;
     * another way is setting bCursorStart > bCursorEnd (unless it's an EGA, in which case we must actually draw a
     * "split block" cursor instead).
     *
     * TODO: Verify whether the second test (bCursorStart > bCursorMax) should also result in a hidden cursor;
     * ThinkTank sets both start and end values to 0x0f, which doesn't make sense on a CGA, where the max is 0x07.
     */
    if ((bCursorFlags & Card.CRTC.CURSOR_START.BLINKOFF) || bCursorStart > bCursorEnd && !fEGA || bCursorStart > bCursorMax) {
        this.removeCursor();
        return false;
    }

    /*
     * The most compatible way of disabling the cursor is to simply move the cursor to an off-screen position.
     */
    var iCellCursor = (this.cardActive.aCRTCRegs[Card.CRTC.CURSOR_ADDR_LO] + ((this.cardActive.aCRTCRegs[Card.CRTC.CURSOR_ADDR_HI] & Card.CRTC.ADDR_HI_MASK) << 8));
    if (this.iCellCursor != iCellCursor) {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("checkCursor(): cursor moved from " + this.iCellCursor + " to " + iCellCursor);
        }
        this.removeCursor();
        this.iCellCursor = iCellCursor;
    }

    /*
     * yCursor and cyCursor are no longer scaled at this point, because the necessary scaling will depend on whether we're
     * drawing the cursor to the on-screen or off-screen buffer, and updateChar() is in the best position to determine that.
     *
     * We also record cyCursorCell, the hardware cell height, since we'll need to know what the yCursor and cyCursor values
     * are relative to when it's time to scale them.
     */
    var bCursorSize = bCursorEnd - bCursorStart + 1;
    if (this.yCursor != bCursorStart || this.cyCursor != bCursorSize) {
        this.yCursor = bCursorStart;
        this.cyCursor = bCursorSize;
    }
    this.cyCursorCell = bCursorMax + 1;

    this.checkBlink();
    return true;
};

/**
 * removeCursor()
 *
 * @this {Video}
 */
Video.prototype.removeCursor = function()
{
    if (this.iCellCursor >= 0) {
        if (this.aCellCache !== undefined) {
            var drawCursor = (Video.ATTRS.DRAW_CURSOR << 8);
            var data = this.aCellCache[this.iCellCursor];
            if (data & drawCursor) {
                data &= ~drawCursor;
                var col = this.iCellCursor % this.nCols;
                var row = Math.floor(this.iCellCursor / this.nCols);
                if (this.nFont && this.aFonts[this.nFont]) {
                    /*
                     * If we're using an off-screen buffer in text mode, then we need to keep it in sync with "reality".
                     */
                    if (this.contextScreenBuffer) {
                        this.updateChar(col, row, data, this.contextScreenBuffer);
                    }
                    /*
                     * While updating the on-screen canvas directly could open us up to potential subpixel artifacts again,
                     * I'm hopeful that won't be the case, since removeCursor() is called only during certain well-defined
                     * events.  The alternative to this simple updateChar() call is unappealing: redrawing the ENTIRE off-screen
                     * buffer to the on-screen canvas, just as updateScreen() does.
                     */
                    this.updateChar(col, row, data);
                }
                if (DEBUG && this.messageEnabled()) {
                    this.printMessage("removeCursor(): removed from " + row + "," + col);
                }
                this.aCellCache[this.iCellCursor] = data;
            }
        }
        this.iCellCursor = -1;
    }
};

/**
 * getAccess()
 *
 * @this {Video}
 * @return {number|undefined} current memory access setting, or undefined if unknown
 */
Video.prototype.getAccess = function()
{
    var nAccess;
    var card = this.cardActive;

    var regGRCMode = card.aGRCRegs[Card.GRC.MODE.INDX];
    if (regGRCMode != null) {
        var nReadAccess = Card.ACCESS.READ.MODE0;
        var nWriteAccess = Card.ACCESS.WRITE.MODE0;
        var nWriteMode = regGRCMode & Card.GRC.MODE.WRITE;
        var regDataRotate = card.aGRCRegs[Card.GRC.DATAROT.INDX] & Card.GRC.DATAROT.MASK;
        switch (nWriteMode) {
        case Card.GRC.MODE.WRITE_MODE0:
            if (regDataRotate) {
                nWriteAccess = Card.ACCESS.WRITE.MODE0ROT;
                switch (regDataRotate & Card.GRC.DATAROT.FUNC) {
                case Card.GRC.DATAROT.AND:
                    nWriteAccess = Card.ACCESS.WRITE.MODE0AND;
                    break;
                case Card.GRC.DATAROT.OR:
                    nWriteAccess = Card.ACCESS.WRITE.MODE0OR;
                    break;
                case Card.GRC.DATAROT.XOR:
                    nWriteAccess = Card.ACCESS.WRITE.MODE0XOR;
                    break;
                default:
                    break;
                }
                card.nDataRotate = regDataRotate & Card.GRC.DATAROT.COUNT;
            }
            break;
        case Card.GRC.MODE.WRITE_MODE1:
            nWriteAccess = Card.ACCESS.WRITE.MODE1;
            break;
        case Card.GRC.MODE.WRITE_MODE2:
            switch (regDataRotate & Card.GRC.DATAROT.FUNC) {
            default:
                nWriteAccess = Card.ACCESS.WRITE.MODE2;
                break;
            case Card.GRC.DATAROT.AND:
                nWriteAccess = Card.ACCESS.WRITE.MODE2AND;
                break;
            case Card.GRC.DATAROT.OR:
                nWriteAccess = Card.ACCESS.WRITE.MODE2OR;
                break;
            case Card.GRC.DATAROT.XOR:
                nWriteAccess = Card.ACCESS.WRITE.MODE2XOR;
                break;
            }
            break;
        default:
            if (DEBUG && this.messageEnabled()) {
                this.printMessage("getAccess(): invalid GRC mode (" + str.toHexByte(regGRCMode) + ")");
            }
            break;
        }
        if (regGRCMode & Card.GRC.MODE.READ_MODE1) {
            nReadAccess = Card.ACCESS.READ.MODE1;
        }
        if (regGRCMode & Card.GRC.MODE.EVENODD) {
            nReadAccess |= Card.ACCESS.READ.EVENODD;
            nWriteAccess |= Card.ACCESS.WRITE.EVENODD;
        }
        nAccess = nReadAccess | nWriteAccess;
    }
    return nAccess;
};

/**
 * setAccess(nAccess)
 *
 * @this {Video}
 * @param {number|undefined} nAccess (one of the Card.ACCESS.* constants)
 */
Video.prototype.setAccess = function(nAccess)
{
    var card = this.cardActive;
    if (nAccess != null && card && nAccess != card.nAccess) {

        if (DEBUG && this.messageEnabled()) {
            this.printMessage("setAccess(0x" + str.toHexWord(nAccess) + ")");
        }

        card.setMemoryAccess(nAccess);

        /*
         * Note that setMemoryAccess() can fail, in which case it will an report error, indicating either a
         * misconfiguration or some sort of internal inconsistency; in any case, there's not much we can do about
         * it at this point, other than possibly reverting the current access setting.  There's probably not much
         * point, however, because there's no guarantee that setMemoryAccess() didn't modify one or more blocks
         * before choking.
         */
        this.bus.setMemoryAccess(card.addrBuffer, card.sizeBuffer, card.getMemoryAccess());
    }
};

/**
 * setDimensions()
 *
 * @this {Video}
 */
Video.prototype.setDimensions = function()
{
    this.nFont = 0;
    this.nCols = this.nDefaultCols;
    this.nRows = this.nDefaultRows;
    this.nCellsPerWord = Video.aModeParms[Video.MODES.MDA_80X25][2];

    var cbPadding = 0;
    var modeParms = Video.aModeParms[this.nMode];
    if (modeParms) {
        this.nCols = modeParms[0];
        this.nRows = modeParms[1];
        this.nCellsPerWord = modeParms[2];
        cbPadding = modeParms[3] || 0;
        this.nFont = modeParms[4];      // this will be undefined for graphics modes
        if (this.nMonitorType == ChipSet.MONITOR.EGACOLOR) {
            /*
             * When an EGA is connected to a CGA monitor, the old aModeParms table is correct: we must
             * use the hard-coded 8x8 "CGA_80" font.  But when it's connected to an EGA monitor, we want
             * to use the 9x14 "EGA" color font instead.
             *
             * TODO: Can an EGA with a monochrome monitor be programmed for 43-line mode as well?  If so,
             * then we'll need to load another MDA font variation, because we only load an 9x14 font for MDA.
             */
            if (this.cardActive === this.cardEGA && this.nFont == Video.FONTS.CGA) {
                if (this.cardEGA.aCRTCRegs[Card.CRTC.MAX_SCAN_LINE] == 7) {
                    /*
                     * Vertical resolution of 350 divided by 8 (ie, scan lines 0-7) yields 43 whole rows.
                     */
                    this.nRows = 43;
                }
                /*
                 * Since we can also be called before any hardware registers have been initialized,
                 * it may be best to not perform the following test (which is why it's commented out).
                 */
                else /* if (this.cardEGA.aCRTCRegs[Card.CRTC.MAX_SCAN_LINE] == 13) */ {
                    /*
                     * Vertical resolution of 350 divided by 14 (ie, scan lines 0-13) yields exactly 25 rows.
                     */
                    this.nFont = Video.FONTS.EGA;
                }
            }
        }
    }

    this.nCells = this.nCols * this.nRows;
    this.nCellCache = (this.nCells / this.nCellsPerWord);
    this.cbScreen = (this.nCellCache << 1) + cbPadding;
    this.cbSplit = (cbPadding? ((this.cbScreen + cbPadding) >> 1) : 0);
    if (this.nMode >= Video.MODES.EGA_320X200) this.nCellCache <<= 1;

    /*
     * If no fonts were successfully loaded, there's no point in initializing the remaining drawing parameters.
     */
    if (!this.aFonts.length) return;

    this.cxScreenCell = Math.floor(this.cxScreen / this.nCols);
    this.cyScreenCell = Math.floor(this.cyScreen / this.nRows);

    /*
     * Now we make the all-important scaling determination: if the font cell dimensions (cxCell, cyCell)
     * don't match the physical screen cell dimensions (cxCell, cyCell), then we look at the caller's
     * fScaleFont setting: if it's false, we draw the characters as-is, with a border if the characters
     * are smaller than the cells; and if fScaleFont is true, we simply tell drawImage to draw the
     * characters to fit.
     *
     * WARNING: The only problem with fScaleFont is that any stretching or shrinking tends to be accompanied
     * by subpixel artifacts along the boundaries of the font images.  Definitely annoying, and apparently
     * there are no standard mechanisms for turning that behavior off. So, for now, I've "neutered" the
     * fScaleFont test slightly, by adding the "nCols == 80" test that prevents scaling from kicking in for
     * 40-column modes.
     *
     * Also, whether scaling or not, if it makes sense to use a "doubled" font, we'll switch the font as
     * well.  Note that the doubled font for any existing font also has an ID that is double the existing ID,
     * making it easy to check for the existence of a font's "double" (shift the ID left by 1).
     *
     * TODO: Since we now use an off-screen buffer for ALL modes, both text and graphics, we should
     * revisit changes that were made to work around subpixel artifacts; those should no longer be an issue.
     */
    if (this.nFont) {
        var font = this.aFonts[this.nFont];
        var fontDoubled = this.aFonts[this.nFont << 1];

        if (this.fScaleFont && this.nCols == 80) {
            if (fontDoubled) {
                if (this.cxScreenCell >= (fontDoubled.cxCell * 3) >> 2) { // && this.cyScreenCell > (fontDoubled.cyCell * 3) >> 2) {
                    this.nFont <<= 1;
                    font = fontDoubled;
                    if (DEBUG) this.log("setDimensions(): switching to double-size font, scaled");
                }
            }
        } else {
            if (fontDoubled) {
                if (this.cxScreenCell >= fontDoubled.cxCell) { // && this.cyScreenCell == fontDoubled.cyCell) {
                    this.nFont <<= 1;
                    font = fontDoubled;
                    if (DEBUG) this.log("setDimensions(): switching to double-size font, unscaled");
                }
            }
            if (font) {
                this.cxScreenCell = font.cxCell;
                this.cyScreenCell = font.cyCell;
            }
        }

        /*
         * In text modes, we have the option of setting all the *ScreenBuffer variables to null instead of
         * allocating them, because updateChar(), as currently written, is capable of writing characters to
         * either an off-screen or on-screen context.
         *
         *      this.imageScreenBuffer = this.canvasScreenBuffer = this.contextScreenBuffer = null;
         */
        this.cxBuffer = this.cyBuffer = 0;
        if (font) {
            this.cxBuffer = this.nCols * font.cxCell;
            this.cyBuffer = this.nRows * font.cyCell;
        }
    } else {
        /*
         * CGA graphics modes have their "cells" (pixels) split evenly across two halves of the video buffer, with
         * EVEN scan lines in the first half and ODD scan lines in the second half, so unlike text modes, we can't set a
         * limit of what's visible on-screen to "columns * rows", so the screen limit is set to match the buffer limit.
         *
         * In addition, updateScreen() requires an off-screen imageData buffer that matches the size of the entire screen,
         * so that updateScreen() can set all pixels that have changed and then update the screen with a single drawImage().
         *
         * An alternative approach, with a smaller footprint, would be to allocate an off-screen buffer large enough for a
         * single scan line, and redraw one scan line at a time, but given how EVEN and ODD scan lines are spread across the
         * entire buffer, it's not clear there would be enough unchanged scan lines on average to make that approach faster.
         */
        this.cxScreenCell = this.cyScreenCell = 1;  // in graphics mode, a cell is exactly one pixel
        this.cxBuffer = this.nCols;
        this.cyBuffer = this.nRows;
    }

    /*
     * Allocate the off-screen buffers
     */
    this.imageScreenBuffer = this.contextScreen.createImageData(this.cxBuffer, this.cyBuffer);
    this.canvasScreenBuffer = window.document.createElement("canvas");
    this.canvasScreenBuffer.width = this.cxBuffer;
    this.canvasScreenBuffer.height = this.cyBuffer;
    this.contextScreenBuffer = this.canvasScreenBuffer.getContext("2d");

    /*
     * Since cxCell and cyCell were originally defined in terms of cxScreen/nCols and cyScreen/nRows, you might think
     * these border calculations would always be zero, but that would mean you overlooked the code above which tries to
     * avoid stretching 40-column modes into an unpleasantly wide shape.
     */
    this.xScreenOffset = this.yScreenOffset = 0;
    this.cxScreenOffset = this.cxScreen;
    this.cyScreenOffset = this.cyScreen;

    var cxBorder = this.cxScreen - (this.nCols * this.cxScreenCell);
    var cyBorder = this.cyScreen - (this.nRows * this.cyScreenCell);
    if (cxBorder > 0) {
        this.xScreenOffset = (cxBorder >> 1);
        this.cxScreenOffset -= cxBorder;
    }
    if (cyBorder > 0) {
        this.yScreenOffset = (cyBorder >> 1);
        this.cyScreenOffset -= cyBorder;
    }
    if (cxBorder || cyBorder) {
        this.contextScreen.fillStyle = this.canvasScreen.style.backgroundColor;
        this.contextScreen.fillRect(0, 0, this.cxScreen, this.cyScreen);
    }
};

/**
 * checkMode(fForce)
 *
 * Called whenever the MDA/CGA's mode register (eg, Card.MDA.MODE.PORT, Card.CGA.MODE.PORT) is updated,
 * or whenever the EGA's GRC Misc register is updated, or when we've just finished a restore().
 *
 * @this {Video}
 * @param {boolean} [fForce] is used to force a mode update, if we recognize the current mode
 * @return {boolean} true if successful, false if not
 */
Video.prototype.checkMode = function(fForce)
{
    var nAccess;
    var nMode = this.nMode;
    var card = this.cardActive;

    if (!card) {
        /*
         * We are likely being called after a restore(), which needs us to call setMode() to insure the proper video
         * buffer is mapped in.  So we unset this.nMode to guarantee that setMode() will be called, and if it wasn't set
         * to anything before, then we fall-back to the default mode.
         */
        this.nMode = null;
        if (nMode == null) nMode = this.nModeDefault;
    }
    else {
        if (card.iCard == Video.CARDS.MDA) {
            nMode = Video.MODES.MDA_80X25;
        }
        else if (card.iCard == Video.CARDS.EGA) {
            /*
             * The sizeBuffer we choose reflects the amount of physical address space that all 4 planes
             * of EGA memory normally span, NOT the total amount of EGA memory.  So for a 64Kb EGA card,
             * we would set card.sizeBuffer to 16Kb (0x4000).
             *
             * TODO: Need to take into account modes that "chain" planes together (eg, mode 0x0F, and
             * presumably mode 0x10, on an EGA card with only 64Kb).
             */
            nMode = null;
            var cbBuffer = card.cbMemory >> 2;
            var cbBufferText = (cbBuffer > 0x8000? 0x8000 : cbBuffer);

            var regGRCMisc = card.aGRCRegs[Card.GRC.MISC.INDX];
            if (regGRCMisc != null) {

                switch(regGRCMisc & Card.GRC.MISC.MAPMEM) {
                case Card.GRC.MISC.MAPA0128:
                    card.addrBuffer = 0xA0000;
                    card.sizeBuffer = cbBuffer;     // 0x20000
                    nMode = Video.MODES.UNKNOWN;    // no BIOS mode uses this mapping, but we don't want to leave nMode null if we've come this far
                    break;
                case Card.GRC.MISC.MAPA064:
                    card.addrBuffer = 0xA0000;
                    card.sizeBuffer = cbBuffer;     // 0x10000
                    nMode = (this.nMonitorType == ChipSet.MONITOR.MONO? Video.MODES.EGA_640X350_MONO : Video.MODES.EGA_640X350);
                    break;
                case Card.GRC.MISC.MAPB032:
                    card.addrBuffer = 0xB0000;
                    card.sizeBuffer = cbBufferText;
                    nMode = Video.MODES.MDA_80X25;
                    break;
                case Card.GRC.MISC.MAPB832:
                    card.addrBuffer = 0xB8000;
                    card.sizeBuffer = cbBufferText;
                    nMode = (this.nMonitorType == ChipSet.MONITOR.MONO? Video.MODES.CGA_80X25_BW : Video.MODES.CGA_80X25);
                    break;
                default:
                    break;
                }

                var fSEQDotClock = (card.aSEQRegs[Card.SEQ.CLK.INDX] & Card.SEQ.CLK.DOTCLOCK);
                var nCRTCVertTotal = card.aCRTCRegs[Card.CRTC.EGA.VERT_TOTAL] | ((card.aCRTCRegs[Card.CRTC.EGA.OVERFLOW.INDX] & Card.CRTC.EGA.OVERFLOW.VERT_TOTAL) << 8);

                if (nMode != Video.MODES.UNKNOWN) {
                    if (!(regGRCMisc & Card.GRC.MISC.GRAPHICS)) {
                        if (fSEQDotClock) nMode -= 2;
                    } else {
                        if (card.addrBuffer == 0xB8000) {
                            //
                            // Since nMode will have been assigned a default of either 0x02 or 0x03, convert that to either
                            // 0x05 or 0x04 if we're in a low-res graphics mode, 0x06 otherwise.
                            //
                            nMode = fSEQDotClock? (7 - nMode) : Video.MODES.CGA_640X200;
                        } else {
                            //
                            // card.addrBuffer must be 0xA0000, so we need to discriminate between modes 0x0D through 0x10;
                            // we've already defaulted to 0x0F or 0x10, so determine if it's 0x0D or 0x0E (ie, a 200-row mode)
                            // and then which one (ie, 320 wide or 640 wide).
                            //
                            if (nCRTCVertTotal < 350) nMode = (fSEQDotClock? Video.MODES.EGA_320X200 : Video.MODES.EGA_640X200);
                        }
                    }
                }

                nAccess = this.getAccess();
            }
        }
        else if (card.modeReg & Card.CGA.MODE.VIDEO_ENABLE) {
            /*
             * NOTE: For the CGA, we precondition any mode change on CGA.MODE.VIDEO_ENABLE being set, otherwise
             * we'll get spoofed by the ROM BIOS scroll code, which waits for vertical retrace and then turns CGA.MODE.VIDEO_ENABLE
             * off, using a hard-coded mode value (0x25) that does NOT necessarily match the the CGA video mode currently in effect.
             */
            if (!(card.modeReg & Card.CGA.MODE.GRAPHIC_SEL)) {
                nMode = ((card.modeReg & Card.CGA.MODE._80X25)? Video.MODES.CGA_80X25 : Video.MODES.CGA_40X25);
                if (card.modeReg & Card.CGA.MODE.BW_SEL) nMode -= 1;
            } else {
                nMode = ((card.modeReg & Card.CGA.MODE.HIRES_BW)? Video.MODES.CGA_640X200 : Video.MODES.CGA_320X200_BW);
                if (!(card.modeReg & Card.CGA.MODE.BW_SEL)) nMode -= 1;
            }
        }
    }

    /*
     * NOTE: If setMode() remaps the video memory, that will trigger calls to getMemoryAccess() to also update the
     * memory's access functions.  However, if the memory access setting (nAccess) is about to change as well, those
     * changes will be moot until the setAccess() call that follows.  Basically, whenever both memory mapping AND access
     * functions are changing, the memory will be in an inconsistent state until both setMode() and setAccess() are
     * finished.
     *
     * The setMode() call takes precedence; if we called setAccess() first, it might attempt to modify memory access
     * functions based on the card's addrBuffer setting, and if that doesn't match what's currently mapped, assertions
     * will be triggered (probably not fatal, but it would defeat the point of the assertions).
     */
    if (!this.setMode(nMode, fForce)) return false;

    this.setAccess(nAccess);

    return true;
};

/**
 * setMode(nMode, fForce)
 *
 * Set fForce to true to update the mode regardless of previous mode, or false to perform a normal update
 * that bypasses updateScreen() but still calls initCellCache().
 *
 * @this {Video}
 * @param {number|null} nMode
 * @param {boolean|undefined} [fForce] is set when checkMode() wants to force a mode update
 * @return {boolean} true if successful, false if failure
 */
Video.prototype.setMode = function(nMode, fForce)
{
    if (nMode != null && (nMode != this.nMode || fForce)) {

        if (DEBUG && this.messageEnabled()) {
            this.printMessage("setMode(0x" + str.toHexWord(nMode) + (fForce? ",force" : "") + ")");
        }

        this.cUpdates = 0;      // count updateScreen() calls as a means of driving blink updates
        this.nMode = nMode;

        /*
         * On an EGA, it's CRITICAL that a reset() invalidate cardActive, to ensure that the code below
         * releases the previous frame buffer and installs a new one, even if there was no change in the
         * frame buffer address or size, because otherwise the Memory blocks installed at the frame buffer
         * address may still be using blocks of the EGA's previous memory buffer.
         *
         * When the EGA is reinitialized, a new memory buffer (adwMemory) is allocated (see initEGA()), and
         * this is where the mapping of that EGA memory buffer to the frame buffer occurs.  Other cards
         * (MDA or CGA) don't allocate/manage their own memory buffer, but even then, it's still a good idea
         * to always force this operation (eg, in case a switch setting changed the active video card).
         */
        var card = this.cardActive || (nMode == Video.MODES.MDA_80X25? this.cardMono : this.cardColor);

        if (card != this.cardActive || card.addrBuffer != this.addrBuffer || card.sizeBuffer != this.sizeBuffer) {

            this.removeCursor();

            if (this.addrBuffer) {

                if (DEBUG && this.messageEnabled()) {
                    this.printMessage("setMode(" + nMode + "): removing 0x" + str.toHex(this.sizeBuffer) + " bytes from 0x" + str.toHex(this.addrBuffer));
                }

                if (!this.bus.removeMemory(this.addrBuffer, this.sizeBuffer)) {
                    /*
                     * TODO: Force this failure case and see how well the Video component deals with it.
                     */
                    return false;
                }
                if (this.cardActive) this.cardActive.fActive = false;
            }

            this.cardActive = card;
            card.fActive = true;

            this.addrBuffer = card.addrBuffer;
            this.sizeBuffer = card.sizeBuffer;

            if (DEBUG && this.messageEnabled()) {
                this.printMessage("setMode(" + nMode + "): adding 0x" + str.toHex(this.sizeBuffer) + " bytes to 0x" + str.toHex(this.addrBuffer));
            }

            var controller = (card === this.cardEGA? card : null);

            if (!this.bus.addMemory(card.addrBuffer, card.sizeBuffer, Memory.TYPE.VIDEO, controller)) {
                /*
                 * TODO: Force this failure case and see how well the Video component deals with it.
                 */
                return false;
            }
        }

        this.setDimensions();

        if (fForce !== false) {
            this.updateScreen(true);
        } else {
            this.initCellCache(true);
        }
    }
    return true;
};

/**
 * setPixel(imageData, x, y, rgb)
 *
 * Worker function used by createFontColor() and updateScreen() (graphics modes only).
 *
 * @this {Video}
 * @param {Object} imageData
 * @param {number} x
 * @param {number} y
 * @param {Array.<number>} rgb is a 4-element array containing the red, green, blue and alpha values
 */
Video.prototype.setPixel = function(imageData, x, y, rgb)
{
    var index = (x + y * imageData.width) * rgb.length;
    imageData.data[index]   = rgb[0];
    imageData.data[index+1] = rgb[1];
    imageData.data[index+2] = rgb[2];
    imageData.data[index+3] = rgb[3];
};

/**
 * initCellCache(fNew)
 *
 * Invalidates the contents of our internal cell cache.
 *
 * @this {Video}
 * @param {boolean} fNew is true to reallocate/resize the cell cache; in any case, it's still reinitialized
 */
Video.prototype.initCellCache = function(fNew)
{
    var nCells;
    if (!fNew) {
        if (this.aCellCache === undefined)
            return;
        nCells = this.aCellCache.length;
    } else {
        nCells = this.nCellCache;
        if (this.aCellCache === undefined || this.aCellCache.length != nCells) {
            this.aCellCache = new Array(nCells);
        }
    }
    for (var iCell = 0; iCell < nCells; iCell++) {
        this.aCellCache[iCell] = -1;        // invalidate every cell of our internal cell cache (-1 is an invalid cell value)
    }
    this.cBlinkVisible = -1;                // also invalidate the visible blinking character count, to force updateScreen() to recount
};

/**
 * doBlink()
 *
 * This function is obsolete, now that the checkBlink() function is called on every updateScreen()
 * and checkCursor() call.  updateScreen() is driven by the CPU timer, so piggy-backing on that to
 * drive blink updates seems preferable to having another active timer in the system.
 *
 * @this {Video}
 * @param {boolean} [fStart]
 *
 Video.prototype.doBlink = function(fStart)
 {
    if (this.cBlinks >= 0) {
        this.cBlinks++;
        if (this.cBlinkVisible || this.iCellCursor >= 0) {
            if (!fStart && !this.cpu.isRunning()) {
                this.updateScreen();
            }
            setTimeout(function(video) { return function onBlinkTimeout() {video.doBlink();}; }(this), 266);
            return;
        }
        this.cBlinks = -1;
    }
},
 */

/**
 * updateChar(col, row, data, context)
 *
 * Updates a particular character cell (row,col) in the associated window.
 *
 * The data parameter is the attribute byte from the display buffer (fgnd attribute in the low nibble,
 * bgnd attribute in the high nibble), but updateScreen() supplements data with a couple internal attribute bits:
 *
 *      ATTRS.DRAW_FGND:    set for every cell whose fgnd element is currently on (ie, non-blinking, or whenever blink is on)
 *      ATTRS.DRAW_CURSOR:  set only for the cell containing the cursor, if any
 *
 * To make a character blink, we alternately draw its cell with ATTRS.DRAW_FGND set, and then again with
 * ATTRS.DRAW_FGND clear (meaning only the cell background is drawn).
 *
 * To make the cursor blink, we must alternately draw its entire cell with ATTRS.DRAW_CURSOR set, and then
 * draw it again with ATTRS.DRAW_CURSOR clear.
 *
 * @this {Video}
 * @param {number} col
 * @param {number} row
 * @param {number} data (if text mode, character code in low byte, attribute code in high byte)
 * @param {Object} [context]
 */
Video.prototype.updateChar = function(col, row, data, context)
{
    /*
     * The caller MUST promise this.nFont is defined, and that the font in this.aFonts[this.nFont] has been loaded.
     */
    var bChar = data & 0xff;
    var bAttr = data >> 8;
    var iFgnd = bAttr & 0xf;
    var font = this.aFonts[this.nFont];
    if (font.aColorMap) iFgnd = font.aColorMap[iFgnd];

    /*
     * Just as aColorMap maps the foreground attribute to the appropriate foreground character grid,
     * it also maps the background attribute to the appropriate background color.
     */
    var xDst, yDst;
    var iBgnd = (bAttr >> 4) & 0xf;
    if (font.aColorMap) iBgnd = font.aColorMap[iBgnd];

    if (context) {
        xDst = col * font.cxCell;
        yDst = row * font.cyCell;
        context.fillStyle = font.aCSSColors[iBgnd];
        context.fillRect(xDst, yDst, font.cxCell, font.cyCell);
    } else {
        xDst = col * this.cxScreenCell + this.xScreenOffset;
        yDst = row * this.cyScreenCell + this.yScreenOffset;
        this.contextScreen.fillStyle = font.aCSSColors[iBgnd];
        this.contextScreen.fillRect(xDst, yDst, this.cxScreenCell, this.cyScreenCell);
    }

    if (MAXDEBUG && this.messageEnabled(Messages.VIDEO | Messages.LOG)) {
        this.log("updateCharBgnd(" + col + "," + row + "," + bChar + "): filled " + xDst + "," + yDst);
    }

    if (bAttr & Video.ATTRS.DRAW_FGND) {
        /*
         * (bChar & 0xf) is the equivalent of (bChar % 16), and (bChar >> 4) is the equivalent of Math.floor(bChar / 16)
         */
        var xSrcFgnd = (bChar & 0xf) * font.cxCell;
        var ySrcFgnd = (bChar >> 4) * font.cyCell;

        if (MAXDEBUG && this.messageEnabled(Messages.VIDEO | Messages.LOG)) {
            this.log("updateCharFgnd(" + col + "," + row + "," + bChar + "): draw from " + xSrcFgnd + "," + ySrcFgnd + " (" + font.cxCell + "," + font.cyCell + ") to " + xDst + "," + yDst);
        }

        if (context) {
            context.drawImage(font.aCanvas[iFgnd], xSrcFgnd, ySrcFgnd, font.cxCell, font.cyCell, xDst, yDst, font.cxCell, font.cyCell);
        } else {
            this.contextScreen.drawImage(font.aCanvas[iFgnd], xSrcFgnd, ySrcFgnd, font.cxCell, font.cyCell, xDst, yDst, this.cxScreenCell, this.cyScreenCell);
        }
    }

    if (bAttr & Video.ATTRS.DRAW_CURSOR) {
        /*
         * Drawing the cursor with lineTo() seemed logical, but it was complicated by the fact that the
         * TOP of the line must appear at "yDst + this.yCursor", whereas lineTo() wants to know the CENTER
         * of the line. So it's simpler to draw the cursor with another fillRect().  Here's the old code:
         *
         *      this.contextScreen.strokeStyle = font.aCSSColors[iFgnd];
         *      this.contextScreen.lineWidth = this.cyCursor;
         *      this.contextScreen.beginPath();
         *      this.contextScreen.moveTo(xDst, yDst + this.yCursor);
         *      this.contextScreen.lineTo(xDst + this.cxScreenCell, yDst + this.yCursor);
         *      this.contextScreen.stroke();
         *
         * Also, note that we're scaling the yCursor and cyCursor values here, instead of in checkCursor(), because
         * this is where we have all the required information: in the first case (off-screen buffer), the scaling must
         * be based on the font cell size (cxCell, cyCell), whereas in the second case (on-screen buffer), the scaling
         * must be based on the screen cell size (cxScreenCell,cyScreenCell).
         *
         * yCursor and cyCursor are actual hardware values, both relative to another hardware value: cyCursorCell.
         */
        var yCursor = this.yCursor;
        var cyCursor = this.cyCursor;
        if (context) {
            if (this.cyCursorCell && this.cyCursorCell !== font.cyCell) {
                yCursor = Math.floor((yCursor * font.cyCell) / this.cyCursorCell);
                cyCursor = Math.floor((cyCursor * font.cyCell) / this.cyCursorCell);
            }
            context.fillStyle = font.aCSSColors[iFgnd];
            context.fillRect(xDst, yDst + yCursor, font.cxCell, cyCursor);
        } else {
            if (this.cyCursorCell && this.cyCursorCell !== this.cyScreenCell) {
                yCursor = Math.floor((yCursor * this.cyScreenCell) / this.cyCursorCell);
                cyCursor = Math.floor((cyCursor * this.cyScreenCell) / this.cyCursorCell);
            }
            this.contextScreen.fillStyle = font.aCSSColors[iFgnd];
            this.contextScreen.fillRect(xDst, yDst + yCursor, this.cxScreenCell, cyCursor);
        }
    }
};

/**
 * updateScreen(fForce)
 *
 * Propagates the video buffer to the cell cache and updates the window with any changes.  Forced updates
 * are generally internal updates triggered by an I/O operation or other state change, while non-forced updates
 * are the periodic updates coming from the CPU.
 *
 * For every cell in the video buffer, compare it to the cell stored in the cell cache, render if it differs,
 * and then update the cell cache to match.  Since initCellCache() sets every cell in the cell cache to an
 * invalid value, we're assured that the next call to updateScreen() will redraw the entire (visible) video buffer.
 *
 * @this {Video}
 * @param {boolean} [fForce] is used by setMode() to reset the cell cache and force a redraw
 */
Video.prototype.updateScreen = function(fForce)
{
    /*
     * The Computer component maintains the fPowered setting on our behalf, so we use it.
     */
    if (!this.aFlags.fPowered) return;

    /*
     * If the card's video signal is disabled (eg, during a mode change), then skip the update,
     * unless fForce is set.
     */
    var fEnabled = false;
    if (this.cardActive) {
        if (this.cardActive === this.cardEGA) {
            if (this.cardEGA.iATCReg & Card.ATC.INDX_PAL_ENABLE) fEnabled = true;
        }
        else {
            if (this.cardActive.modeReg & Card.CGA.MODE.VIDEO_ENABLE) fEnabled = true;
        }
    }

    if (!fEnabled && !fForce) return;

    if (fForce) {
        this.initCellCache(true);
    }
    else {
        /*
         * This should never happen, but since updateScreen() is also called by CPU.updateVideo(),
         * better safe than sorry.
         */
        if (this.aCellCache === undefined) return;
    }

    /*
     * If cBlinks is "enabled" (ie, >= 0), then advance it once every 16 updateScreen() calls
     * (assuming an updateScreen() frequency of 60 per second; see CPU.VIDEO_UPDATES_PER_SECOND).
     *
     * We assume that the CPU is calling us whenever fForce is undefined.
     */
    var fBlinkUpdate = false;
    if (!fForce && !(++this.cUpdates & 0xf) && this.cBlinks >= 0) {
        this.cBlinks++;
        fBlinkUpdate = true;
    }

    var iCell = 0;
    var nCells = this.nCells;

    /*
     * Calculate the VISIBLE start of screen memory (addrScreen), not merely the PHYSICAL start,
     * as well as the extent of it (cbScreen) and use those values for all addressing operations
     * to follow.  FYI, in these calculations, offScreen does not refer to "off-screen" memory,
     * but rather the "offset" of the start of visible screen memory.
     */
    var addrScreen = this.cardActive.addrBuffer;
    var addrScreenLimit = addrScreen + this.cardActive.sizeBuffer;
    var offScreen = (this.cardActive.aCRTCRegs[Card.CRTC.START_ADDR_HI] << 8) + this.cardActive.aCRTCRegs[Card.CRTC.START_ADDR_LO];

    /*
     * Any screen (aka "page") offset must be doubled for text modes, due to the attribute bytes.
     *
     * TODO: Come up with a more robust method of deciding when any screen offset should be doubled.
     */
    if (this.nFont) offScreen <<= 1;

    addrScreen += offScreen;
    var cbScreen = this.cbScreen;
    if (addrScreen + cbScreen > addrScreenLimit) {
        cbScreen = addrScreenLimit - addrScreen;
        if (cbScreen < 0) cbScreen = 0;
    }
    /*
     * addrScreenLimit was initially the limit of the entire frame buffer, but we now adjust it
     * to the limit of what's visible, since that's all we want to draw.
     */
    addrScreenLimit = addrScreen + cbScreen;

    /*
     * This next bit of code can be completely disabled if we discover problems with the dirty
     * memory block tracking feature, or if we need to remove or disable that feature in the future.
     *
     * We use cleanMemory() to check the video buffer's dirty state.  If the buffer is clean
     * AND there are no visible blinking characters (as of the last updateScreen) AND there is
     * no visible cursor, then we're done; simply return.  Otherwise, if there's only a blinking
     * cursor, then update JUST that one cell.
     *
     * When dealing with blinking characters, note that we need to run through the entire buffer
     * ONLY if the low bits of the blink count just transitioned to 2 or 0; hence, we could return if
     * the blink count was ODD.  But we'd still have to worry about the cursor, so it's simpler to blow
     * that small optimization off.  Further optimizations are certainly possible, such as a hash table
     * of all blinking character locations, but all those optimizations are saved for a rainy day.
     */
    if (!fForce && this.bus.cleanMemory(addrScreen, cbScreen)) {
        if (!fBlinkUpdate) return;
        if (!this.cBlinkVisible) {
            if (this.iCellCursor < 0)
                return;
            iCell = this.iCellCursor;
            nCells = iCell + 1;
        }
        // else if (this.cBlinks & 0x1) return;
    }

    if (this.nFont) {
        /*
         * This is the text-mode update case.  We're required to FIRST verify that the current font
         * has been successfully loaded, because we're not allowed to call updateChar() if there's no font.
         */
        if (this.aFonts[this.nFont]) {
            this.updateScreenText(addrScreen, addrScreenLimit, iCell, nCells);
            this.checkBlink();
        }
    }
    else if (this.cbSplit) {
        this.updateScreenGraphicsCGA(addrScreen, addrScreenLimit);
    }
    else {
        this.updateScreenGraphicsEGA(addrScreen, addrScreenLimit);
    }
};

/**
 * updateScreenText(addrScreen, addrScreenLimit, iCell, nCells)
 *
 * @param addrScreen
 * @param addrScreenLimit
 * @param iCell
 * @param nCells
 */
Video.prototype.updateScreenText = function(addrScreen, addrScreenLimit, iCell, nCells)
{
    var addr, data, dataCache, cUpdated = 0;

    /*
     * If MDA.MODE.BLINK_ENABLE is set and a cell's blink bit is set, then if (cBlinks & 0x2) != 0,
     * we want the foreground element of the cell to be drawn; otherwise we don't.  So every 16-bit
     * data word we pull from the video buffer will be supplemented with our own special attribute bit
     * (ATTRS.DRAW_FGND = 0x100) accordingly; and to simplify the drawing code, we will also mask the
     * blink bit from the cell's attribute bits.
     *
     * If MDA.MODE.BLINK_ENABLE is clear, then we always set ATTRS.DRAW_FGND and never mask the blink
     * bit in a cell's attributes bits, since it's actually an intensity bit in that case.
     */
    this.cBlinkVisible = 0;
    var dataBlink = 0;
    var dataDraw = (Video.ATTRS.DRAW_FGND << 8);
    var dataMask = 0xfffff;
    if (this.cardActive.modeReg & Card.MDA.MODE.BLINK_ENABLE) {
        dataBlink = (Video.ATTRS.BGND_BLINK << 8);
        dataMask &= ~dataBlink;
        if (!(this.cBlinks & 0x2)) dataMask &= ~dataDraw;
    }
    addr = addrScreen + (iCell << 1);
    while (addr < addrScreenLimit && iCell < nCells) {
        data = this.bus.getShortDirect(addr);
        data |= dataDraw;
        if (data & dataBlink) {
            this.cBlinkVisible++;
            data &= dataMask;
        }
        if (iCell == this.iCellCursor) {
            data |= ((this.cBlinks & 0x1)? (Video.ATTRS.DRAW_CURSOR << 8) : 0);
        }
        this.assert(iCell < this.aCellCache.length);
        dataCache = this.aCellCache[iCell];
        if (dataCache != data) {
            var col = iCell % this.nCols;
            var row = Math.floor(iCell / this.nCols);
            this.updateChar(col, row, data, this.contextScreenBuffer);
            this.aCellCache[iCell] = data;
            cUpdated++;
        }
        addr += 2;
        iCell++;
    }
    if (cUpdated && this.contextScreenBuffer) {
        this.contextScreen.drawImage(this.canvasScreenBuffer, 0, 0, this.cxBuffer, this.cyBuffer, this.xScreenOffset, this.yScreenOffset, this.cxScreenOffset, this.cyScreenOffset);
    }
};

/**
 * updateScreenGraphicsCGA(addrScreen, addrScreenLimit)
 *
 * @param addrScreen
 * @param addrScreenLimit
 */
Video.prototype.updateScreenGraphicsCGA = function(addrScreen, addrScreenLimit)
{
    var addr, data, dataCache;

    /*
     * This is the CGA graphics-mode update case, where cells are pixels spread across two halves of the buffer.
     */
    addr = addrScreen;
    this.cBlinkVisible = 0;
    var iCell = 0, nPixelsPerCell = this.nCellsPerWord;
    var wPixelMask = (nPixelsPerCell == 16? 0x10000 : 0x30000);
    var nPixelShift = (nPixelsPerCell == 16? 1 : 2);
    var aPixelColors = this.getCardColors(nPixelShift);

    var x = 0, y = 0;
    var xDirty = this.nCols, xMaxDirty = 0, yDirty = this.nRows, yMaxDirty = 0;
    while (addr < addrScreenLimit) {
        data = this.bus.getShortDirect(addr);
        this.assert(iCell < this.aCellCache.length);
        dataCache = this.aCellCache[iCell];
        if (dataCache === data) {
            x += nPixelsPerCell;
        } else {
            this.aCellCache[iCell] = data;
            var wPixels = (data >> 8) | ((data & 0xff) << 8);
            var wMask = wPixelMask, nShift = 16;
            if (x < xDirty) xDirty = x;
            for (var iPixel = 0; iPixel < nPixelsPerCell; iPixel++) {
                var bPixel = (wPixels & (wMask >>= nPixelShift)) >> (nShift -= nPixelShift);
                this.setPixel(this.imageScreenBuffer, x++, y, aPixelColors[bPixel]);
            }
            if (x > xMaxDirty) xMaxDirty = x;
            if (y < yDirty) yDirty = y;
            if (y >= yMaxDirty) yMaxDirty = y + 1;
        }
        addr += 2;
        iCell++;
        if (x >= this.nCols) {
            x = 0;
            y += 2;
            if (y > this.nRows)
                break;
            if (y == this.nRows) {
                y = 1;
                addr = addrScreen + this.cbSplit;
            }
        }
    }
    /*
     * Instead of blasting the ENTIRE imageScreenBuffer into contextScreenBuffer, and then blasting the ENTIRE
     * canvasScreenBuffer onto contextScreen, even for the smallest change, let's try to be a bit smarter about
     * the update (well, to the extent that the canvas APIs permit).
     */
    if (xDirty < this.nCols) {
        var cxDirty = xMaxDirty - xDirty;
        var cyDirty = yMaxDirty - yDirty;
        // this.contextScreenBuffer.putImageData(this.imageScreenBuffer, 0, 0);
        this.contextScreenBuffer.putImageData(this.imageScreenBuffer, 0, 0, xDirty, yDirty, cxDirty, cyDirty);
        /*
         * While ideally I would draw only the dirty portion of canvasScreenBuffer, there usually isn't a 1-1 pixel mapping
         * between canvasScreenBuffer and contextScreen.  In fact, the WHOLE POINT of the canvasScreenBuffer is to leverage
         * drawImage()'s scaling ability; for example, a CGA graphics mode might be 640x200, whereas the canvas representing
         * the screen might be 960x400.  In those situations, if we draw interior rectangles, we often end up with subpixel
         * artifacts along the edges of those rectangles.  So it appears I must continue to redraw the entire canvasScreenBuffer
         * on every change.
         *
        var xScreen = (((xDirty * this.cxScreen) / this.nCols) | 0);
        var yScreen = (((yDirty * this.cyScreen) / this.nRows) | 0);
        var cxScreen = (((cxDirty * this.cxScreen) / this.nCols) | 0);
        var cyScreen = (((cyDirty * this.cyScreen) / this.nRows) | 0);
        this.contextScreen.drawImage(this.canvasScreenBuffer, xDirty, yDirty, cxDirty, cyDirty, xScreen, yScreen, cxScreen, cyScreen);
         */
        this.contextScreen.drawImage(this.canvasScreenBuffer, 0, 0, this.nCols, this.nRows, 0, 0, this.cxScreen, this.cyScreen);
    }
};

/**
 * updateScreenGraphicsEGA(addrScreen, addrScreenLimit)
 *
 * @param addrScreen
 * @param addrScreenLimit
 */
Video.prototype.updateScreenGraphicsEGA = function(addrScreen, addrScreenLimit)
{
    var addr, data, dataCache;

    addr = addrScreen;
    this.cBlinkVisible = 0;
    var iCell = 0, nPixelsPerCell = 8;
    var aPixelColors = this.getCardColors();
    var adwMemory = this.cardActive.adwMemory;

    var x = 0, y = 0;
    var xDirty = this.nCols, xMaxDirty = 0, yDirty = this.nRows, yMaxDirty = 0;
    while (addr < addrScreenLimit) {
        var idw = addr++ - this.addrBuffer;
        this.assert(idw >= 0 && idw < adwMemory.length);
        data = adwMemory[idw];
        this.assert(iCell < this.aCellCache.length);
        dataCache = this.aCellCache[iCell];
        if (dataCache === data) {
            x += nPixelsPerCell;
        } else {
            this.aCellCache[iCell] = data;
            if (x < xDirty) xDirty = x;
            for (var iPixel = 0; iPixel < nPixelsPerCell; iPixel++) {
                /*
                 * JavaScript Alert: if adwMemory contains a 32-bit value such as -1526726656, and then we mask
                 * it with 0x80808080, we end up with -2147483648, which in a perfect 32-bit world, would be equal
                 * to 0x80000000, which means that when we look up "Video.aEGADWToByte[0x80000000]", we should get
                 * the entry containing 0x8.  But no, in JavaScript, since the original value was negative, the
                 * masked value is still negative, because there are 52 "significand" bits in JavaScript numbers,
                 * and bit-wise operations operate ONLY on the low 32 bits, leaving the higher sign bits intact.
                 *
                 * This can be confirmed by looking at dwPixel.toString(16), which returns "-80000000".  One solution
                 * is to add 4294967296 (0x100000000) to any negative 32-bit value for which we need the positive
                 * representation.  A better solution (ie, one that doesn't require 33-bit values, triggering floating
                 * point arithmetic) is storing negative indexes in the lookup array (aEGADWToByte).  However, you CANNOT
                 * do that by simply writing a value like 0x80000080 as "-0x80000080", because JavaScript will interpret
                 * that as the negation of 2147483776, yielding -2147483776, the low 32 bits of which are 0x7FFFFFF80,
                 * not 0x80000080 as intended.  So, the safest way to write a constant like that is "0x80000080|0".
                 *
                 * And, since assertions don't fix problems (only catch them, and only in DEBUG builds), I'm also
                 * ensuring that bPixel will always default to 0 if an undefined value ever slips through again.
                 */
                var dwPixel = data & 0x80808080;
                // if (dwPixel < 0) dwPixel += 0x100000000;
                this.assert(Video.aEGADWToByte[dwPixel] !== undefined);
                var bPixel = Video.aEGADWToByte[dwPixel] || 0;
                this.setPixel(this.imageScreenBuffer, x++, y, aPixelColors[bPixel]);
                data <<= 1;
            }
            if (x > xMaxDirty) xMaxDirty = x;
            if (y < yDirty) yDirty = y;
            if (y >= yMaxDirty) yMaxDirty = y + 1;
        }
        iCell++;
        if (x >= this.nCols) {
            x = 0;
            if (++y > this.nRows) break;
        }
    }
    /*
     * For a fascinating discussion of the best way to update the screen canvas at this point, see updateScreenGraphicsCGA().
     */
    if (xDirty < this.nCols) {
        var cxDirty = xMaxDirty - xDirty;
        var cyDirty = yMaxDirty - yDirty;
        this.contextScreenBuffer.putImageData(this.imageScreenBuffer, 0, 0, xDirty, yDirty, cxDirty, cyDirty);
        this.contextScreen.drawImage(this.canvasScreenBuffer, 0, 0, this.nCols, this.nRows, 0, 0, this.cxScreen, this.cyScreen);
    }
};

/**
 * inMDAIndx(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3B4)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inMDAIndx = function(port, addrFrom)
{
    return this.inCRTCIndx(this.cardMono, addrFrom);
};

/**
 * outMDAIndx(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3B4)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outMDAIndx = function(port, bOut, addrFrom)
{
    this.outCRTCIndx(this.cardMono, bOut, addrFrom);
};

/**
 * inMDAData(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3B5)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number|undefined}
 */
Video.prototype.inMDAData = function(port, addrFrom)
{
    return this.inCRTCData(this.cardMono, addrFrom);
};

/**
 * outMDAData(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3B5)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outMDAData = function(port, bOut, addrFrom)
{
    this.outCRTCData(this.cardMono, bOut, addrFrom);
};

/**
 * inMDAMode(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3B8)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inMDAMode = function(port, addrFrom)
{
    return this.inCardMode(this.cardMono, addrFrom);
};

/**
 * outMDAMode(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3B8)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outMDAMode = function(port, bOut, addrFrom)
{
    this.outCardMode(this.cardMono, bOut, addrFrom);
};

/**
 * inMDAStatus(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3BA)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inMDAStatus = function(port, addrFrom)
{
    return this.inCardStatus(this.cardMono, addrFrom);
};

/**
 * outFeat(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3BA or 0x3DA)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 *
 * NOTE: While this port also existed on the MDA and CGA, it existed only as an INPUT port, not an OUTPUT port.
 */
Video.prototype.outFeat = function(port, bOut, addrFrom)
{
    this.cardEGA.featReg = (this.cardEGA.featReg & ~Card.FEAT_CTRL.BITS) | (bOut & Card.FEAT_CTRL.BITS);
    this.printMessageIO(port, bOut, addrFrom, "FEAT");
};

/**
 * inATC(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3C0)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inATC = function(port, addrFrom)
{
    var b = this.cardEGA.fATCData? this.cardEGA.aATCRegs[this.cardEGA.iATCReg & Card.ATC.INDX_MASK] : this.cardEGA.iATCReg;
    if (this.messageEnabled()) {
        this.printMessageIO(Card.ATC.PORT, null, addrFrom, "ATC." + (this.cardEGA.fATCData? this.cardEGA.asATCRegs[this.cardEGA.iATCReg & Card.ATC.INDX_MASK] : "INDX"), b);
    }
    this.cardEGA.fATCData = !this.cardEGA.fATCData;
    return b;
};

/**
 * outATC(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3C0)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outATC = function(port, bOut, addrFrom)
{
    var fPalEnabled = (this.cardEGA.iATCReg & Card.ATC.INDX_PAL_ENABLE);
    if (!this.cardEGA.fATCData) {
        this.cardEGA.iATCReg = bOut;
        this.printMessageIO(port, bOut, addrFrom, "ATC.INDX");
        this.cardEGA.fATCData = true;
        if ((bOut & Card.ATC.INDX_PAL_ENABLE) && !fPalEnabled) {
            if (!this.buildFonts()) {
                if (DEBUG && this.messageEnabled()) {
                    this.printMessage("outATC(" + str.toHexByte(bOut) + "): no font changes required");
                }
            } else {
                if (DEBUG && this.messageEnabled()) {
                    this.printMessage("outATC(" + str.toHexByte(bOut) + "): redraw screen for font changes");
                }
                this.updateScreen(true);
            }
        }
    } else {
        var iReg = this.cardEGA.iATCReg & Card.ATC.INDX_MASK;
        if (iReg >= Card.ATC.PALETTE_REGS || !fPalEnabled) {
            if (Video.TRAPALL || this.cardEGA.aATCRegs[iReg] !== bOut) {
                if (this.messageEnabled()) {
                    this.printMessageIO(port, bOut, addrFrom, "ATC." + this.cardEGA.asATCRegs[iReg]);
                }
                this.cardEGA.aATCRegs[iReg] = bOut;
            }
        }
        this.cardEGA.fATCData = false;
    }
};

/**
 * inStatus0(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3C2)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inStatus0 = function(port, addrFrom)
{
    var iBit = 3 - ((this.cardEGA.miscReg & Card.MISC.CLK_SELECT) >> 2);    // this is the desired SW # (0-3)
    var bSWBit = (this.bEGASW & (1 << iBit)) << (Card.STATUS0.SWSENSE_SHIFT - iBit);
    var b = ((this.cardEGA.status0 & ~Card.STATUS0.SWSENSE) | bSWBit);
    /*
     * TODO: Figure out where Card.STATUS0.FEAT bits should come from....
     */
    this.cardEGA.status0 = b;
    this.printMessageIO(Card.STATUS0.PORT, null, addrFrom, "STATUS0", b);
    return b;
};

/**
 * @this {Video}
 * @param {number} port (0x3C2)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outMisc = function(port, bOut, addrFrom)
{
    this.cardEGA.miscReg = bOut;
    this.enableEGA();
    this.printMessageIO(Card.MISC.PORT, bOut, addrFrom, "MISC");
};

/**
 * inSEQIndx(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3C4)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inSEQIndx = function(port, addrFrom)
{
    var b = this.cardEGA.iSEQReg;
    this.printMessageIO(Card.SEQ.INDX.PORT, null, addrFrom, "SEQ.INDX", b);
    return b;
};

/**
 * outSEQIndx(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3C4)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outSEQIndx = function(port, bOut, addrFrom)
{
    this.cardEGA.iSEQReg = bOut;
    this.printMessageIO(Card.SEQ.INDX.PORT, bOut, addrFrom, "SEQ.INDX");
};

/**
 * inSEQData(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3C5)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inSEQData = function(port, addrFrom)
{
    var b = this.cardEGA.aSEQRegs[this.cardEGA.iSEQReg];
    if (this.messageEnabled()) {
        this.printMessageIO(Card.SEQ.DATA.PORT, null, addrFrom, "SEQ" + this.cardEGA.asSEQRegs[this.cardEGA.iSEQReg], b);
    }
    return b;
};

/**
 * outSEQData(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3C5)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outSEQData = function(port, bOut, addrFrom)
{
    if (Video.TRAPALL || this.cardEGA.aSEQRegs[this.cardEGA.iSEQReg] !== bOut) {
        if (this.messageEnabled()) {
            this.printMessageIO(Card.SEQ.DATA.PORT, bOut, addrFrom, "SEQ." + this.cardEGA.asSEQRegs[this.cardEGA.iSEQReg]);
        }
        this.cardEGA.aSEQRegs[this.cardEGA.iSEQReg] = bOut;
    }
    if (this.cardEGA.iSEQReg == Card.SEQ.MAPMASK.INDX) {
        this.cardEGA.nWriteMapMask = Video.aEGAByteToDW[bOut & Card.SEQ.MAPMASK.MAPS];
    }
};

/**
 * inGRCPos1(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3CC)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inGRCPos1 = function(port, addrFrom)
{
    var b = this.cardEGA.iGRCPos1;
    this.printMessageIO(Card.GRC.POS1_PORT, null, addrFrom, "GRC1", b);
    return b;
};

/**
 * outGRCPos1(port, bOut, addrFrom)
 *
 * "The EGA was originally implemented by IBM using two Graphics Controller Chips. It was necessary to program
 * each to respond to a different set of two consecutive bits of the 8-bit host data bus. In the IBM EGA implementation,
 * a 0 must be loaded into this register. In the VGA, there is no analogous register."
 *
 * "A zero should be loaded into this location to map host data bus bits 0 and 1 to display planes 0 and 1 respectively."
 *
 * @this {Video}
 * @param {number} port (0x3CC)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outGRCPos1 = function(port, bOut, addrFrom)
{
    this.cardEGA.iGRCPos1 = bOut;
    this.printMessageIO(Card.GRC.POS1_PORT, bOut, addrFrom, "GRC1");
};

/**
 * inGRCPos2(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3CA)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inGRCPos2 = function(port, addrFrom)
{
    var b = this.cardEGA.iGRCPos2;
    this.printMessageIO(Card.GRC.POS2_PORT, null, addrFrom, "GRC2", b);
    return b;
};

/**
 * outGRCPos2(port, bOut, addrFrom)
 *
 * "The EGA was originally implemented by IBM using two Graphics Controller Chips. This register is used to program
 * the Graphics #2 chip. See the Graphics #1 Position Register for details."
 *
 * "A one should be loaded into this location to map host data bus bits 2 and 3 to display planes 2 and 3, respectively."
 *
 * @this {Video}
 * @param {number} port (0x3CA)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outGRCPos2 = function(port, bOut, addrFrom)
{
    this.cardEGA.iGRCPos2 = bOut;
    this.printMessageIO(Card.GRC.POS2_PORT, bOut, addrFrom, "GRC2");
};

/**
 * inGRCIndx(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3CE)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inGRCIndx = function(port, addrFrom)
{
    var b = this.cardEGA.iGRCReg;
    this.printMessageIO(Card.GRC.INDX.PORT, null, addrFrom, "GRC.INDX", b);
    return b;
};

/**
 * outGRCIndx(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3CE)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outGRCIndx = function(port, bOut, addrFrom)
{
    this.cardEGA.iGRCReg = bOut;
    this.printMessageIO(Card.GRC.INDX.PORT, bOut, addrFrom, "GRC.INDX");
};

/**
 * inGRCData(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3CF)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inGRCData = function(port, addrFrom)
{
    var b = this.cardEGA.aGRCRegs[this.cardEGA.iGRCReg];
    if (this.messageEnabled()) {
        this.printMessageIO(Card.GRC.DATA.PORT, null, addrFrom, "GRC." + this.cardEGA.asGRCRegs[this.cardEGA.iGRCReg], b);
    }
    return b;
};

/**
 * outGRCData(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3CF)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outGRCData = function(port, bOut, addrFrom)
{
    if (Video.TRAPALL || this.cardEGA.aGRCRegs[this.cardEGA.iGRCReg] !== bOut) {
        if (this.messageEnabled()) {
            this.printMessageIO(Card.GRC.DATA.PORT, bOut, addrFrom, "GRC." + this.cardEGA.asGRCRegs[this.cardEGA.iGRCReg]);
        }
        this.cardEGA.aGRCRegs[this.cardEGA.iGRCReg] = bOut;
    }
    switch(this.cardEGA.iGRCReg) {
    case Card.GRC.SRESET.INDX:
        this.cardEGA.nSetMapData = Video.aEGAByteToDW[bOut & 0xf];
        this.cardEGA.nSetMapBits = this.cardEGA.nSetMapData & ~this.cardEGA.nSetMapMask;
        break;
    case Card.GRC.ESRESET.INDX:
        this.cardEGA.nSetMapMask = ~Video.aEGAByteToDW[bOut & 0xf];
        this.cardEGA.nSetMapBits = this.cardEGA.nSetMapData & ~this.cardEGA.nSetMapMask;
        break;
    case Card.GRC.COLRCMP.INDX:
        this.cardEGA.nColorCompare = Video.aEGAByteToDW[bOut & 0xf] & 0x80808080;
        break;
    case Card.GRC.DATAROT.INDX:
    case Card.GRC.MODE.INDX:
        this.setAccess(this.getAccess());
        break;
    case Card.GRC.READMAP.INDX:
        this.cardEGA.nReadMapShift = (bOut & Card.GRC.READMAP.NUM) << 3;
        break;
    case Card.GRC.MISC.INDX:
        this.checkMode(false);
        break;
    case Card.GRC.COLRDC.INDX:
        this.cardEGA.nColorDontCare = Video.aEGAByteToDW[(bOut & 0xf) ^ 0xf] & 0x80808080;
        break;
    case Card.GRC.BITMASK.INDX:
        this.cardEGA.nBitMapMask = bOut | (bOut << 8) | (bOut << 16) | (bOut << 24);
        break;
    default:
        break;
    }
};

/**
 * inCGAIndx(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3D4)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inCGAIndx = function(port, addrFrom)
{
    return this.inCRTCIndx(this.cardColor, addrFrom);
};

/**
 * outCGAIndx(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3D4)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outCGAIndx = function(port, bOut, addrFrom)
{
    this.outCRTCIndx(this.cardColor, bOut, addrFrom);
};

/**
 * inCGAData(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3D5)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number|undefined}
 */
Video.prototype.inCGAData = function(port, addrFrom)
{
    return this.inCRTCData(this.cardColor, addrFrom);
};

/**
 * outCGAData(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3D5)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outCGAData = function(port, bOut, addrFrom)
{
    this.outCRTCData(this.cardColor, bOut, addrFrom);
};

/**
 * inCGAMode(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3D8)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inCGAMode = function(port, addrFrom)
{
    return this.inCardMode(this.cardColor, addrFrom);
};

/**
 * outCGAMode(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3D8)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outCGAMode = function(port, bOut, addrFrom)
{
    this.outCardMode(this.cardColor, bOut, addrFrom);
};

/**
 * inCGAColor(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3D9)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inCGAColor = function(port, addrFrom)
{
    var b = this.cardColor.colorReg;
    if (this.messageEnabled()) {
        this.printMessageIO(this.cardColor.port + 5, null, addrFrom, this.cardColor.type + ".COLOR", b);
    }
    return b;
};

/**
 * outCGAColor(port, bOut, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3D9)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outCGAColor = function(port, bOut, addrFrom)
{
    if (this.messageEnabled()) {
        this.printMessageIO(this.cardColor.port + 5, bOut, addrFrom, this.cardColor.type + ".COLOR");
    }
    if (this.cardColor.colorReg !== bOut) {
        this.cardColor.colorReg = bOut;
        /*
         * When this color register changes, it can automatically change the appearance of any number of cells, so we make
         * a special call to initCellCache() to invalidate every cell, forcing all cells to be redrawn on the next updateScreen().
         */
        this.initCellCache(false);
    }
};

/**
 * inCGAStatus(port, addrFrom)
 *
 * @this {Video}
 * @param {number} port (0x3DA)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inCGAStatus = function(port, addrFrom)
{
    return this.inCardStatus(this.cardColor, addrFrom);
};

/**
 * inCRTCIndx(card, addrFrom)
 *
 * @this {Video}
 * @param {Object} card
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inCRTCIndx = function(card, addrFrom)
{
    var b = card.iCRTCReg;
    this.printMessageIO(card.port, null, addrFrom, "CRTC.INDX", b);
    return b;
};

/**
 * outCRTCIndx(card, bOut, addrFrom)
 *
 * @this {Video}
 * @param {Object} card
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outCRTCIndx = function(card, bOut, addrFrom)
{
    card.iCRTCPrev = card.iCRTCReg;
    card.iCRTCReg = bOut & Card.CGA.CRTC.INDX.MASK;
    this.printMessageIO(card.port, bOut, addrFrom, "CRTC.INDX");
};

/**
 * inCRTCData(card, addrFrom)
 *
 * @this {Video}
 * @param {Object} card
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number|undefined}
 */
Video.prototype.inCRTCData = function(card, addrFrom)
{
    var b;
    if (card.iCRTCReg < card.nCRTCRegs) b = card.aCRTCRegs[card.iCRTCReg];
    if (this.messageEnabled()) {
        this.printMessageIO(card.port + 1, null, addrFrom, "CRTC." + card.asCRTCRegs[card.iCRTCReg], b);
    }
    return b;
};

/**
 * outCRTCData(card, bOut, addrFrom)
 *
 * @this {Video}
 * @param {Object} card
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outCRTCData = function(card, bOut, addrFrom)
{
    if (card.iCRTCReg < card.nCRTCRegs) {
        if (Video.TRAPALL || card.aCRTCRegs[card.iCRTCReg] !== bOut) {
            if (this.messageEnabled()) {
                this.printMessageIO(card.port + 1, bOut, addrFrom, "CRTC." + card.asCRTCRegs[card.iCRTCReg]);
            }
            card.aCRTCRegs[card.iCRTCReg] = bOut;
        }
        /*
         * During mode changes on the EGA, all the CRTC regs are typically programmed in sequence,
         * and if that's all that's happening with Card.CRTC.MAX_SCAN_LINE, then we don't want to treat
         * it special; let the mode change be detected normally (eg, when the GRC regs are written later).
         *
         * On the other hand, if this was an out-of-sequence write to Card.CRTC.MAX_SCAN_LINE, then
         * yes, we want to force setMode() to call setDimensions(), which is key to setting the proper
         * number of screen rows.
         */
        if (card.iCRTCReg == Card.CRTC.MAX_SCAN_LINE && card.iCRTCPrev != Card.CRTC.MAX_SCAN_LINE-1) {
            this.checkMode(true);
        }
        this.checkCursor();
    } else {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("outCRTCData(): ignoring unexpected write to CRTC[" + str.toHexByte(card.iCRTCReg) + "]: " + str.toHexByte(bOut));
        }
    }
};

/**
 * inCardMode(card, addrFrom)
 *
 * @this {Video}
 * @param {Object} card
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inCardMode = function(card, addrFrom)
{
    var b = card.modeReg;
    this.printMessageIO(card.port + 4, null, addrFrom, "MODE", b);
    return b;
};

/**
 * outCardMode(card, bOut, addrFrom)
 *
 * @this {Video}
 * @param {Object} card
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 */
Video.prototype.outCardMode = function(card, bOut, addrFrom)
{
    this.printMessageIO(card.port + 4, bOut, addrFrom, "MODE");
    card.modeReg = bOut;
    this.checkMode(false);
};

/**
 * inCardStatus(card, addrFrom)
 *
 * On an EGA, this register is called "Status Register One" (0x3BA/0x3DA aka STATUS1), to distinguish it from
 * "Status Register Zero" (0x3C2 aka STATUS0).  One of the side-effects of reading STATUS1 is that it resets the
 * ATC address/data flip-flop to "address" mode, which we emulate by setting cardEGA.fATCData to false, indicating
 * that the ATC is not in "data" mode.
 *
 * @this {Video}
 * @param {Object} card
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number}
 */
Video.prototype.inCardStatus = function(card, addrFrom)
{
    var b = 0;

    /*
     * NOTE: The CGA bits CGA.STATUS.DISP_ENABLE (0x01) and CGA.STATUS.VERT_RETRACE (0x08) match the EGA definitions,
     * and they also correspond to the MDA bits MDA.STATUS.HDRIVE (0x01) and MDA.STATUS.BWVIDEO (0x08); I'm not sure why
     * the MDA uses different designations, but the bits appear to serve the same purpose.
     *
     * TODO: Decide whether this more faithful emulation of the retrace bits should be extended to the MDA/CGA, too;
     * doing so might slow down the BIOS scroll code a bit, though.
     */
    var nCycles = this.cpu.getCycles();
    var nElapsedCycles = nCycles - card.nInitCycles;
    if (nElapsedCycles < 0) nElapsedCycles = 0;         // TODO: Determine if this ever happens
    var nCyclesHorzRemain = nElapsedCycles % card.nCyclesHorzPeriod;
    if (nCyclesHorzRemain > card.nCyclesHorzActive) b |= Card.CGA.STATUS.DISP_ENABLE;
    var nCyclesVertRemain = nElapsedCycles % card.nCyclesVertPeriod;
    if (nCyclesVertRemain > card.nCyclesVertActive) b |= Card.CGA.STATUS.VERT_RETRACE;
    /*
     * This is optional: the number of CPU cycles that remain in the current vertical period is all we need to keep
     * track of (the number of cycles since the card was initialized is fine, too, but that delta can become extremely
     * large after a while).
     */
    card.nInitCycles = nCycles - nCyclesVertRemain;

    if (card === this.cardEGA) {
        /*
         * STATUS1 diagnostic bits 5 and 4 are set according to the Card.ATC.PLANES.MUX bits:
         *
         *      MUX     Bit 5   Bit 4
         *      ---     ----    ----
         *      00:     Red     Blue
         *      01:     SecBlue Green
         *      10:     SecRed  SecGreen
         *      11:     unused  unused
         *
         * Depending on where we are in the horizontal and vertical periods (which can be inferred from the
         * same elapsed cycle count that we used to simulate the retrace bits above), we could extract 4 bits
         * from a corresponding region of the video buffer, "and" them with Card.ATC.PLANES.MASK, use
         * that to index into the palette registers (cardEGA.aATCRegs), and use the resulting palette register
         * bits to set these diagnostics bits.  However, that's all rather tedious, and the process of extracting
         * 4 appropriate bits from the video buffer varies depending on the video mode.
         *
         * Why are we even considering this?  Because the EGA BIOS diagnostic code draws a bright reverse-video
         * line of text blocks across the top of the screen, writes 0x3F to palette register 0x0f, and then
         * monitors the STATUS1 diagnostic bits, waiting for those palette bits to show up.  It turns out, however,
         * that we can easily fool the EGA BIOS by simply toggling the diagnostic bits.  So we take the easy way out.
         *
         * TODO: Faithful emulation of these bits is certainly doable, so consider doing that at some point.
         */
        b |= ((card.statusReg & Card.STATUS1.DIAGNOSTIC) ^ Card.STATUS1.DIAGNOSTIC);

        /*
         * Last but not least, we must reset the EGA's ATC flip-flop whenever this register is read.
         */
        card.fATCData = false;
    }
    else {
        /*
         * On the MDA/CGA, to satisfy ROM BIOS testing ("TEST.10"), it's sufficient to do a simple toggle of
         * bits 0 and 3 on every read.
         *
         * Also, according to http://www.seasip.info/VintagePC/mda.html, on an MDA, bits 7-4 are always ON and bits 2-1
         * are always OFF, hence the "OR" of 0xf0.
         */
        b = (card.statusReg ^= (Card.CGA.STATUS.DISP_ENABLE | Card.CGA.STATUS.VERT_RETRACE)) | 0xf0;
    }
    card.statusReg = b;
    this.printMessageIO(card.port + 6, null, addrFrom, (card === this.cardEGA? "STATUS1" : "STATUS"), b);
    return b;
};

/**
 * dumpVideo(sParm)
 *
 * @this {Video}
 * @param {string|undefined} sParm
 */
Video.prototype.dumpVideo = function(sParm)
{
    if (DEBUGGER) {
        if (!this.cardActive) {
            this.dbg.println("no active video card");
            return;
        }
        if (sParm) {
            this.cardActive.dumpBuffer(sParm);
            return;
        }
        this.dbg.println("BIOSMODE: " + str.toHexByte(this.nMode));
        this.cardActive.dumpCard();
    }
};

/*
 * Port input/output notification tables
 *
 * TODO: I added some "duplicate" entries for the MDA because, according to docs I'd read, MDA ports are
 * decoded at multiple addresses.  However, if this is important, then it should be verified and implemented
 * consistently (eg, for CGA as well).  For now, I'm decoding only the standard port addresses.
 */
Video.aPortInput = {
//  0x3B1: Video.prototype.inMDAData,           // duplicate
//  0x3B3: Video.prototype.inMDAData,           // duplicate
    0x3B4: Video.prototype.inMDAIndx,           // technically, not actually readable, but I want the Debugger to be able to read this
    0x3B5: Video.prototype.inMDAData,           // technically, the only Data registers that are readable are R14-R17
//  0x3B7: Video.prototype.inMDAData,           // duplicate
    0x3B8: Video.prototype.inMDAMode,           // technically, not actually readable, but I want the Debugger to be able to read this
    0x3BA: Video.prototype.inMDAStatus,
    0x3D4: Video.prototype.inCGAIndx,           // technically, not actually readable, but I want the Debugger to be able to read this
    0x3D5: Video.prototype.inCGAData,           // technically, the only Data registers that are readable are R14-R17
    0x3D8: Video.prototype.inCGAMode,           // technically, not actually readable, but I want the Debugger to be able to read this
    0x3D9: Video.prototype.inCGAColor,          // technically, not actually readable, but I want the Debugger to be able to read this
    0x3DA: Video.prototype.inCGAStatus
};

Video.aPortOutput = {
//  0x3B0: Video.prototype.outMDAIndx,          // duplicate
//  0x3B1: Video.prototype.outMDAData,          // duplicate
//  0x3B2: Video.prototype.outMDAIndx,          // duplicate
//  0x3B3: Video.prototype.outMDAData,          // duplicate
    0x3B4: Video.prototype.outMDAIndx,          // 0x3B4 is decoded at 0x3B0, 0x3B2 and 0x3B6 as well (at least on an MDA), hence the duplicate mappings
    0x3B5: Video.prototype.outMDAData,          // 0x3B5 is decoded at 0x3B1, 0x3B3 and 0x3B7 as well (at least on an MDA), hence the duplicate mappings
//  0x3B6: Video.prototype.outMDAIndx,          // duplicate
//  0x3B7: Video.prototype.outMDAData,          // duplicate
    0x3B8: Video.prototype.outMDAMode,
    0x3D4: Video.prototype.outCGAIndx,
    0x3D5: Video.prototype.outCGAData,
    0x3D8: Video.prototype.outCGAMode,
    0x3D9: Video.prototype.outCGAColor
};

Video.aEGAPortInput = {
    0x3C0: Video.prototype.inATC,               // technically, not actually readable, but I want the Debugger to be able to read this
    0x3C1: Video.prototype.inATC,               // technically, not actually readable, but I want the Debugger to be able to read this
    0x3C2: Video.prototype.inStatus0,
    0x3C4: Video.prototype.inSEQIndx,           // technically, not actually readable, but I want the Debugger to be able to read this
    0x3C5: Video.prototype.inSEQData,           // technically, not actually readable, but I want the Debugger to be able to read this
    0x3CA: Video.prototype.inGRCPos2,           // technically, not actually readable, but I want the Debugger to be able to read this
    0x3CC: Video.prototype.inGRCPos1,           // technically, not actually readable, but I want the Debugger to be able to read this
    0x3CE: Video.prototype.inGRCIndx,           // technically, not actually readable, but I want the Debugger to be able to read this
    0x3CF: Video.prototype.inGRCData            // technically, not actually readable, but I want the Debugger to be able to read this
};

Video.aEGAPortOutput = {
    0x3BA: Video.prototype.outFeat,
    0x3C0: Video.prototype.outATC,
    0x3C1: Video.prototype.outATC,              // the EGA BIOS writes to this port (see C000:0416), implying that 0x3C0 and 0x3C1 both decode the same register
    0x3C2: Video.prototype.outMisc,             // FYI, since this overlaps with STATUS0.PORT, there's currently no way for the Debugger to read the Misc register
    0x3C4: Video.prototype.outSEQIndx,
    0x3C5: Video.prototype.outSEQData,
    0x3CA: Video.prototype.outGRCPos2,
    0x3CC: Video.prototype.outGRCPos1,
    0x3CE: Video.prototype.outGRCIndx,
    0x3CF: Video.prototype.outGRCData,
    0x3DA: Video.prototype.outFeat
};

/**
 * Video.init()
 *
 * This function operates on every HTML element of class "video", extracting the
 * JSON-encoded parameters for the Video constructor from the element's "data-value"
 * attribute, invoking the constructor to create a Video component, and then binding
 * any associated HTML controls to the new component.
 */
Video.init = function()
{
    var aeVideo = Component.getElementsByClass(window.document, PCJSCLASS, "video");
    for (var iVideo = 0; iVideo < aeVideo.length; iVideo++) {
        var eVideo = aeVideo[iVideo];
        var parmsVideo = Component.getComponentParms(eVideo);

        var eCanvas = window.document.createElement("canvas");
        if (eCanvas === undefined) {
            eVideo.innerHTML = "<br/>Missing &lt;canvas&gt; support; try a new web browser.";
            return;
        }

        eCanvas.setAttribute("class", PCJSCLASS + "-canvas");
        eCanvas.setAttribute("width", parmsVideo['screenWidth']);
        eCanvas.setAttribute("height", parmsVideo['screenHeight']);
        eCanvas.style.backgroundColor = parmsVideo['screenColor'];

        /*
         * The "contenteditable" attribute on a canvas element NOTICEABLY slows down canvas drawing on
         * Safari as soon as you give the canvas focus (ie, click away from the canvas, and drawing speeds
         * up; click on the canvas, and drawing slows down).  So the "transparent textarea hack" that we
         * once employed as only a work-around for Android devices is now our default.
         *
         *      eCanvas.setAttribute("contenteditable", "true");
         */

        /*
         * HACK: A canvas style of "auto" provides for excellent responsive canvas scaling in EVERY browser
         * except IE9/IE10, so I recalculate the appropriate CSS height every time the parent DIV is resized;
         * IE11 works without this hack, so we take advantage of the fact that IE11 doesn't report itself as "MSIE".
         */
        eCanvas.style.height = "auto";
        if (web.getUserAgent().indexOf("MSIE") >= 0) {
            eCanvas.style.height = (((eVideo.clientWidth * parmsVideo['screenHeight']) / parmsVideo['screenWidth']) | 0) + "px";
            eVideo.onresize = function(eParent, eChild, cx, cy) {
                return function onResizeVideo() {
                    eChild.style.height = (((eParent.clientWidth * cy) / cx) | 0) + "px";
                };
            }(eVideo, eCanvas, parmsVideo['screenWidth'], parmsVideo['screenHeight']);      // jshint ignore:line
        }
        eVideo.appendChild(eCanvas);

        /*
         * HACK: Android-based browsers, like the Silk (Amazon) browser and Chrome for Android, don't honor the
         * "contenteditable" attribute; that is, when the canvas receives focus, they don't activate the on-screen
         * keyboard.  So my fallback is to create a transparent textarea on top of the canvas.
         *
         * The parent DIV must have a style of "position:relative" (alternatively, a class of "pcjs-container"),
         * so that we can position the textarea using absolute coordinates.  Also, we don't want the textarea to be
         * visible, but we must use "opacity:0" instead of "visibility:hidden", because the latter seems to prevent
         * the element from receiving events.  These styling requirements are taken care of in components.css
         * (see references to the "pcjs-video-object" class).
         *
         * UPDATE: Unfortunately, Android keyboards like to compose whole words before transmitting any of the
         * intervening characters; our textarea's keyDown/keyUp event handlers DO receive intervening key events,
         * but their keyCode property is ZERO.  Virtually the only usable key event we receive is the Enter key.
         * Android users will have to use machines that include their own on-screen "soft keyboard", or use an
         * external keyboard.
         *
         * The following attempt to use a password-enabled input field didn't work any better on Android.  You could
         * clearly see the overlaid semi-transparent input field, but none of the input characters were passed along,
         * with the exception of the "Go" (Enter) key.
         *
         *      var eInput = window.document.createElement("input");
         *      eInput.setAttribute("type", "password");
         *      eInput.setAttribute("style", "position:absolute; left:0; top:0; width:100%; height:100%; opacity:0.5");
         *      eVideo.appendChild(eInput);
         *
         * See this Chromium issue for more information: https://code.google.com/p/chromium/issues/detail?id=118639
         */
        var eTextArea = window.document.createElement("textarea");

        /*
         * As noted in keyboard.js, the keyboard on an iOS device pops up with the SHIFT key depressed,
         * which is not the initial keyboard state that the Keyboard component expects.
         */
        if (web.isUserAgent("iOS")) {
            eTextArea.setAttribute("autocapitalize", "off");
            eTextArea.setAttribute("autocorrect", "off");
        }
        eVideo.appendChild(eTextArea);

        /*
         * Now we can create the Video object, record it, and wire it up to the associated document elements.
         */
        var eContext = eCanvas.getContext("2d");
        var video = new Video(parmsVideo, eCanvas, eContext, eTextArea /* || eInput */, eVideo);

        /*
         * Bind any video-specific controls (eg, the Refresh button). There are no essential controls, however;
         * even the "Refresh" button is just a diagnostic tool, to ensure that the screen contents are up-to-date.
         */
        Component.bindComponentControls(video, eVideo, PCJSCLASS);
    }
};

/*
 * Initialize every Video module on the page.
 */
web.onInit(Video.init);

if (typeof APP_PCJS !== 'undefined') {APP_PCJS.Card = Card; APP_PCJS.Video = Video;}

if (typeof module !== 'undefined') module.exports = Video;
