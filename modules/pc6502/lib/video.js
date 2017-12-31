/**
 * @fileoverview Implements the PC6502 Video component.
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
    var str         = require("../../shared/lib/strlib");
    var web         = require("../../shared/lib/weblib");
    var DumpAPI     = require("../../shared/lib/dumpapi");
    var Component   = require("../../shared/lib/component");
    var Memory      = require("./memory");
    var Messages    = require("./messages");
    var State       = require("./state");
}

/**
 * Video(parmsVideo, canvas, context, textarea, container)
 *
 * The Video component can be configured with the following (parmsVideo) properties:
 *
 *      screenWidth: width of the screen canvas, in pixels
 *      screenHeight: height of the screen canvas, in pixels
 *      screenColor: background color of the screen canvas (default is black)
 *      screenRotate: the amount of counter-clockwise screen rotation required (eg, -90 or 270)
 *      aspectRatio (eg, 1.33)
 *      bufferAddr: the starting address of the frame buffer (eg, 0x2400)
 *      bufferCols: the width of a single frame buffer row, in pixels (eg, 256)
 *      bufferRows: the number of frame buffer rows (eg, 224)
 *      bufferBits: the number of bits per column (default is 1)
 *      bufferLeft: the bit position of the left-most pixel in a byte (default is 0; CGA uses 7)
 *      bufferRotate: the amount of counter-clockwise buffer rotation required (eg, -90 or 270)
 *      interruptRate: normally the same as (or some multiple of) refreshRate (eg, 120)
 *      refreshRate: how many times updateScreen() should be performed per second (eg, 60)
 *
 * We record all the above values now, but we defer creation of the frame buffer until our initBus()
 * handler is called.  At that point, we will also compute the extent of the frame buffer, determine the
 * appropriate "cell" size (ie, the number of pixels that updateScreen() will fetch and process at once),
 * and then allocate our cell cache.
 *
 * Why interruptRate in addition to refreshRate?  A higher interrupt rate is required for Space Invaders,
 * because even though the CRT refreshes at 60Hz, the CRT controller interrupts the CPU *twice* per
 * refresh (once after the top half of the screen has been redrawn, and again after the bottom half has
 * been redrawn), so we need an interrupt rate of 120Hz.  We pass the higher rate on to the CPU, so that
 * it will call updateScreen() more frequently, but we still limit our screen updates to every *other* call.
 *
 * bufferRotate is an alternative to screenRotate; you may set one or the other (but not both) to -90 to
 * enable different approaches to counter-clockwise 90-degree image rotation.  screenRotate uses canvas
 * transformation methods (translate(), rotate(), and scale()), while bufferRotate inverts the dimensions
 * of the off-screen buffer and then relies on setPixel() to "rotate" the data into it.
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
    var video = this;
    this.fGecko = web.isUserAgent("Gecko/");
    var i, sEvent, asWebPrefixes = ['', 'moz', 'ms', 'webkit'];

    Component.call(this, "Video", parmsVideo, Video, Messages.VIDEO);

    this.cxScreen = parmsVideo['screenWidth'];
    this.cyScreen = parmsVideo['screenHeight'];

    this.addrBuffer = parmsVideo['bufferAddr'];
    this.cxBuffer = parmsVideo['bufferCols'];
    this.cyBuffer = parmsVideo['bufferRows'];
    this.nBitsPerPixel = parmsVideo['bufferBits'] || 1;
    this.iBitFirstPixel = parmsVideo['bufferLeft'] || 0;
    this.rotateBuffer = parmsVideo['bufferRotate'];
    if (this.rotateBuffer) {
        this.rotateBuffer = this.rotateBuffer % 360;
        if (this.rotateBuffer > 0) this.rotateBuffer -= 360;
        if (this.rotateBuffer != -90) {
            this.notice("unsupported buffer rotation: " + this.rotateBuffer);
            this.rotateBuffer = 0;
        }
    }

    this.interruptRate = parmsVideo['interruptRate'];
    this.refreshRate = parmsVideo['refreshRate'] || 60;

    this.canvasScreen = canvas;
    this.contextScreen = context;
    this.textareaScreen = textarea;
    this.inputScreen = textarea || canvas || null;

    /*
     * Support for disabling (or, less commonly, enabling) image smoothing, which all browsers
     * seem to support now (well, OK, I still have to test the latest MS Edge browser), despite
     * it still being labelled "experimental technology".  Let's hope the browsers standardize
     * on this.  I see other options emerging, like the CSS property "image-rendering: pixelated"
     * that's apparently been added to Chrome.  Sigh.
     */
    var fSmoothing = parmsVideo['smoothing'];
    var sSmoothing = web.getURLParm('smoothing');
    if (sSmoothing) fSmoothing = (sSmoothing == "true");
    if (fSmoothing != null) {
        for (i = 0; i < asWebPrefixes.length; i++) {
            sEvent = asWebPrefixes[i];
            if (!sEvent) {
                sEvent = 'imageSmoothingEnabled';
            } else {
                sEvent += 'ImageSmoothingEnabled';
            }
            if (this.contextScreen[sEvent] !== undefined) {
                this.contextScreen[sEvent] = fSmoothing;
                break;
            }
        }
    }

    this.rotateScreen = parmsVideo['screenRotate'];
    if (this.rotateScreen) {
        this.rotateScreen = this.rotateScreen % 360;
        if (this.rotateScreen > 0) this.rotateScreen -= 360;
        if (this.rotateScreen != -90) {
            this.notice("unsupported screen rotation: " + this.rotateScreen);
            this.rotateScreen = 0;
        } else {
            this.contextScreen.translate(0, this.cyScreen);
            this.contextScreen.rotate((this.rotateScreen * Math.PI)/180);
            this.contextScreen.scale(this.cyScreen/this.cxScreen, this.cxScreen/this.cyScreen);
        }
    }

    this.initColors();

    /*
     * Allocate off-screen buffers.
     */
    var cxBuffer = this.cxBuffer;
    var cyBuffer = this.cyBuffer;
    if (this.rotateBuffer) {
        cxBuffer = this.cyBuffer;
        cyBuffer = this.cxBuffer;
    }
    this.imageBuffer = this.contextScreen.createImageData(cxBuffer, cyBuffer);
    this.canvasBuffer = document.createElement("canvas");
    this.canvasBuffer.width = cxBuffer;
    this.canvasBuffer.height = cyBuffer;
    this.contextBuffer = this.canvasBuffer.getContext("2d");

    /*
     * Here's the gross code to handle full-screen support across all supported browsers.  The lack of standards
     * is exasperating; browsers can't agree on 'full' or 'Full, 'request' or 'Request', 'screen' or 'Screen', and
     * while some browsers honor other browser prefixes, most browsers don't.
     */
    this.container = container;
    if (this.container) {
        this.container.doFullScreen = container['requestFullscreen'] || container['msRequestFullscreen'] || container['mozRequestFullScreen'] || container['webkitRequestFullscreen'];
        if (this.container.doFullScreen) {
            for (i = 0; i < asWebPrefixes.length; i++) {
                sEvent = asWebPrefixes[i] + 'fullscreenchange';
                if ('on' + sEvent in document) {
                    var onFullScreenChange = function() {
                        var fFullScreen = (document['fullscreenElement'] || document['msFullscreenElement'] || document['mozFullScreenElement'] || document['webkitFullscreenElement']);
                        video.notifyFullScreen(fFullScreen? true : false);
                    };
                    document.addEventListener(sEvent, onFullScreenChange, false);
                    break;
                }
            }
            for (i = 0; i < asWebPrefixes.length; i++) {
                sEvent = asWebPrefixes[i] + 'fullscreenerror';
                if ('on' + sEvent in document) {
                    var onFullScreenError = function() {
                        video.notifyFullScreen(null);
                    };
                    document.addEventListener(sEvent, onFullScreenError, false);
                    break;
                }
            }
        }
    }
}

Component.subclass(Video);

Video.COLORS = {
    OVERLAY_TOP:    0,
    OVERLAY_BOTTOM: 1,
    OVERLAY_TOTAL:  2
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {Video}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger6502} dbg
 */
Video.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;

    /*
     * Compute the size of the frame buffer and allocate.
     */
    this.sizeBuffer = ((this.cxBuffer * this.nBitsPerPixel) >> 3) * this.cyBuffer;
    if (this.bus.addMemory(this.addrBuffer, this.sizeBuffer, Memory.TYPE.VIDEO)) {
        /*
         * Compute the number of cells and initialize the cell cache.
         */
        this.nCellCache = this.sizeBuffer >> 1;
        this.nPixelsPerCell = (16 / this.nBitsPerPixel)|0;
        this.initCache();
    }
    this.setReady();
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {Video}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "refresh")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Video.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    var video = this;

    switch (sBinding) {
    case "fullScreen":
        this.bindings[sBinding] = control;
        if (this.container && this.container.doFullScreen) {
            control.onclick = function onClickFullScreen() {
                if (DEBUG) video.printMessage("fullScreen()");
                video.doFullScreen();
            };
        } else {
            if (DEBUG) this.log("FullScreen API not available");
            control.parentNode.removeChild(/** @type {Node} */ (control));
        }
        return true;

    default:
        break;
    }
    return false;
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
            /*
             * Styling the container with a width of "100%" and a height of "auto" works great when the aspect ratio
             * of our virtual screen is at least roughly equivalent to the physical screen's aspect ratio, but now that
             * we support virtual VGA screens with an aspect ratio of 1.33, that's very much out of step with modern
             * wide-screen monitors, which usually have an aspect ratio of 1.6 or greater.
             *
             * And unfortunately, none of the browsers I've tested appear to make any attempt to scale our container to
             * the physical screen's dimensions, so the bottom of our screen gets clipped.  To prevent that, I reduce
             * the width from 100% to whatever percentage will accommodate the entire height of the virtual screen.
             *
             * NOTE: Mozilla recommends both a width and a height of "100%", but all my tests suggest that using "auto"
             * for height works equally well, so I'm sticking with it, because "auto" is also consistent with how I've
             * implemented a responsive canvas when the browser window is being resized.
             */
            var sWidth = "100%";
            var sHeight = "auto";
            if (screen && screen.width && screen.height) {
                var aspectPhys = screen.width / screen.height;
                var aspectVirt = this.cxScreen / this.cyScreen;
                if (aspectPhys > aspectVirt) {
                    sWidth = Math.round(aspectVirt / aspectPhys * 100) + '%';
                }
                // TODO: We may need to someday consider the case of a physical screen with an aspect ratio < 1.0....
            }
            if (!this.fGecko) {
                this.container.style.width = sWidth;
                this.container.style.height = sHeight;
            } else {
                /*
                 * Sadly, the above code doesn't work for Firefox, because as http://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
                 * explains:
                 *
                 *      'It's worth noting a key difference here between the Gecko and WebKit implementations at this time:
                 *      Gecko automatically adds CSS rules to the element to stretch it to fill the screen: "width: 100%; height: 100%".
                 *
                 * Which would be OK if Gecko did that BEFORE we're called, but apparently it does that AFTER, effectively
                 * overwriting our careful calculations.  So we style the inner element (canvasScreen) instead, which
                 * requires even more work to ensure that the canvas is properly centered.  FYI, this solution is consistent
                 * with Mozilla's recommendation for working around their automatic CSS rules:
                 *
                 *      '[I]f you're trying to emulate WebKit's behavior on Gecko, you need to place the element you want
                 *      to present inside another element, which you'll make fullscreen instead, and use CSS rules to adjust
                 *      the inner element to match the appearance you want.'
                 */
                this.canvasScreen.style.width = sWidth;
                this.canvasScreen.style.width = sWidth;
                this.canvasScreen.style.display = "block";
                this.canvasScreen.style.margin = "auto";
            }
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
 * @param {boolean|null} fFullScreen (null if there was a full-screen error)
 */
Video.prototype.notifyFullScreen = function(fFullScreen)
{
    if (!fFullScreen && this.container) {
        if (!this.fGecko) {
            this.container.style.width = this.container.style.height = "";
        } else {
            this.canvasScreen.style.width = this.canvasScreen.style.height = "";
        }
    }
    this.printMessage("notifyFullScreen(" + fFullScreen + ")", true);
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
 * getRefreshRate()
 *
 * @this {Video}
 * @return {number}
 */
Video.prototype.getRefreshRate = function()
{
    return Math.max(this.refreshRate, this.interruptRate);
};

/**
 * initCache()
 *
 * Initializes the contents of our internal cell cache.
 *
 * @this {Video}
 */
Video.prototype.initCache = function()
{
    this.fCellCacheValid = false;
    if (this.aCellCache === undefined || this.aCellCache.length != this.nCellCache) {
        this.aCellCache = new Array(this.nCellCache);
    }
};

/**
 * initColors()
 *
 * This creates an array of nColors, with additional OVERLAY_TOTAL colors tacked on to the end of the array.
 *
 * @this {Video}
 */
Video.prototype.initColors = function()
{
    var rgbBlack  = [0x00, 0x00, 0x00, 0xff];
    var rgbWhite  = [0xff, 0xff, 0xff, 0xff];
    var rgbGreen  = [0x00, 0xff, 0x00, 0xff];
    var rgbYellow = [0xff, 0xff, 0x00, 0xff];
    this.nColors = (1 << this.nBitsPerPixel);
    this.aRGB = new Array(this.nColors + Video.COLORS.OVERLAY_TOTAL);
    this.aRGB[0] = rgbBlack;
    this.aRGB[1] = rgbWhite;
    this.aRGB[this.nColors + Video.COLORS.OVERLAY_TOP] = rgbYellow;
    this.aRGB[this.nColors + Video.COLORS.OVERLAY_BOTTOM] = rgbGreen;
};

/**
 * setPixel(imageBuffer, x, y, bPixel)
 *
 * @this {Video}
 * @param {Object} imageBuffer
 * @param {number} x
 * @param {number} y
 * @param {number} bPixel (ie, an index into aRGB)
 */
Video.prototype.setPixel = function(imageBuffer, x, y, bPixel)
{
    var index;
    if (!this.rotateBuffer) {
        index = (x + y * imageBuffer.width);
    } else {
        index = (imageBuffer.height - x - 1) * imageBuffer.width + y;
    }
    if (bPixel) {
        if (x >= 208 && x < 236) {
            bPixel = this.nColors + Video.COLORS.OVERLAY_TOP;
        }
        else if (x >= 28 && x < 72) {
            bPixel = this.nColors + Video.COLORS.OVERLAY_BOTTOM;
        }
    }
    var rgb = this.aRGB[bPixel];
    index *= rgb.length;
    imageBuffer.data[index] = rgb[0];
    imageBuffer.data[index+1] = rgb[1];
    imageBuffer.data[index+2] = rgb[2];
    imageBuffer.data[index+3] = rgb[3];
};

/**
 * updateScreen(n)
 *
 * Propagates the video buffer to the cell cache and updates the screen with any changes.  Forced updates
 * are generally internal updates triggered by an I/O operation or other state change, while non-forced updates
 * are the periodic updates coming from the CPU.
 *
 * For every cell in the video buffer, compare it to the cell stored in the cell cache, render if it differs,
 * and then update the cell cache to match.  Since initCache() sets every cell in the cell cache to an
 * invalid value, we're assured that the next call to updateScreen() will redraw the entire (visible) video buffer.
 *
 * @this {Video}
 * @param {number} n (where 0 <= n < getRefreshRate() for a normal update, or -1 for a forced update)
 */
Video.prototype.updateScreen = function(n)
{
    if (n >= 0) {
        if (!(n & 1)) {
            /*
             * On even updates, call cpu.requestINTR(1), and also update our copy of the screen.
             */
            this.cpu.requestINTR(1);
        } else {
            /*
             * On odd updates, call cpu.requestINTR(2), but do NOT update our copy of the screen, because
             * the machine has presumably only updated the top half of the frame buffer at this point; it will
             * update the bottom half of the frame buffer after acknowledging this interrupt.
             */
            this.cpu.requestINTR(2);
            return;
        }

        /*
         * Since this is not a forced update, if our cell cache is valid AND the buffer is clean, then do nothing.
         */
        if (this.fCellCacheValid && this.bus.cleanMemory(this.addrBuffer, this.sizeBuffer)) {
            return;
        }
    }

    var addr = this.addrBuffer;
    var addrLimit = addr + this.sizeBuffer;

    var iCell = 0;
    var nPixelShift = 1;

    var xBuffer = 0, yBuffer = 0;
    var xDirty = this.cxBuffer, xMaxDirty = 0, yDirty = this.cyBuffer, yMaxDirty = 0;

    var nShiftInit = 0;
    var nShiftPixel = this.nBitsPerPixel;
    var nMask = (1 << nShiftPixel) - 1;
    if (this.iBitFirstPixel) {
        nShiftPixel = -nShiftPixel;
        nShiftInit = 16 + nShiftPixel;
    }

    while (addr < addrLimit) {
        var data = this.bus.getShortDirect(addr);
        this.assert(iCell < this.aCellCache.length);
        if (this.fCellCacheValid && data === this.aCellCache[iCell]) {
            xBuffer += this.nPixelsPerCell;
        } else {
            this.aCellCache[iCell] = data;
            var nShift = nShiftInit;
            if (nShift) data = ((data >> 8) | ((data & 0xff) << 8));
            if (xBuffer < xDirty) xDirty = xBuffer;
            var cPixels = this.nPixelsPerCell;
            while (cPixels--) {
                var bPixel = (data >> nShift) & nMask;
                this.setPixel(this.imageBuffer, xBuffer++, yBuffer, bPixel);
                nShift += nShiftPixel;
            }
            if (xBuffer > xMaxDirty) xMaxDirty = xBuffer;
            if (yBuffer < yDirty) yDirty = yBuffer;
            if (yBuffer >= yMaxDirty) yMaxDirty = yBuffer + 1;
        }
        addr += 2; iCell++;
        if (xBuffer >= this.cxBuffer) {
            xBuffer = 0; yBuffer++;
            if (yBuffer > this.cyBuffer) break;
        }
    }

    this.fCellCacheValid = true;

    /*
     * Instead of blasting the ENTIRE imageBuffer into contextBuffer, and then blasting the ENTIRE
     * canvasBuffer onto contextScreen, even for the smallest change, let's try to be a bit smarter about
     * the update (well, to the extent that the canvas APIs permit).
     */
    if (xDirty < this.cxBuffer) {
        var cxDirty = xMaxDirty - xDirty;
        var cyDirty = yMaxDirty - yDirty;
        if (this.rotateBuffer) {
            /*
             * If rotateBuffer is set, then it must be -90, so we must "rotate" the dirty coordinates as well,
             * because they are relative to the frame buffer, not the rotated image buffer.  Alternatively, you
             * can use the following call to blast the ENTIRE imageBuffer into contextBuffer instead:
             *
             *      this.contextBuffer.putImageData(this.imageBuffer, 0, 0);
             */
            var xDirtyOrig = xDirty, cxDirtyOrig = cxDirty;
            //noinspection JSSuspiciousNameCombination
            xDirty = yDirty;
            cxDirty = cyDirty;
            yDirty = this.cxBuffer - (xDirtyOrig + cxDirtyOrig);
            cyDirty = cxDirtyOrig;
        }
        this.contextBuffer.putImageData(this.imageBuffer, 0, 0, xDirty, yDirty, cxDirty, cyDirty);
        this.contextScreen.drawImage(this.canvasBuffer, 0, 0, this.canvasBuffer.width, this.canvasBuffer.height, 0, 0, this.cxScreen, this.cyScreen);
    }
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
    var aeVideo = Component.getElementsByClass(document, APPCLASS, "video");
    for (var iVideo = 0; iVideo < aeVideo.length; iVideo++) {
        var eVideo = aeVideo[iVideo];
        var parmsVideo = Component.getComponentParms(eVideo);

        var eCanvas = document.createElement("canvas");
        if (eCanvas === undefined || !eCanvas.getContext) {
            eVideo.innerHTML = "<br/>Missing &lt;canvas&gt; support. Please try a newer web browser.";
            return;
        }

        eCanvas.setAttribute("class", "pcjs-canvas");
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
         *
         * HACK: A canvas style of "auto" provides for excellent responsive canvas scaling in EVERY browser
         * except IE9/IE10, so I recalculate the appropriate CSS height every time the parent DIV is resized;
         * IE11 works without this hack, so we take advantage of the fact that IE11 doesn't identify as "MSIE".
         *
         * The other reason it's good to keep this particular hack limited to IE9/IE10 is that most other
         * browsers don't actually support an 'onresize' handler on anything but the window object.
         */
        eCanvas.style.height = "auto";
        if (web.getUserAgent().indexOf("MSIE") >= 0) {
            eVideo.onresize = function(eParent, eChild, cx, cy) {
                return function onResizeVideo() {
                    eChild.style.height = (((eParent.clientWidth * cy) / cx) | 0) + "px";
                };
            }(eVideo, eCanvas, parmsVideo['screenWidth'], parmsVideo['screenHeight']);
            eVideo.onresize();
        }
        /*
         * The following is a related hack that allows the user to force the screen to use a particular aspect
         * ratio if an 'aspect' attribute or URL parameter is set.  Initially, it's just for testing purposes
         * until we figure out a better UI.  And note that we use our web.onPageEvent() helper function to make
         * sure we don't trample any other 'onresize' handler(s) attached to the window object.
         */
        var aspect = +(parmsVideo['aspect'] || web.getURLParm('aspect'));
        /*
         * No 'aspect' parameter yields NaN, which is falsey, and anything else must satisfy my arbitrary
         * constraints of 0.3 <= aspect <= 3.33, to prevent any useless (or worse, browser-blowing) results.
         */
        if (aspect && aspect >= 0.3 && aspect <= 3.33) {
            web.onPageEvent('onresize', function(eParent, eChild, aspectRatio) {
                return function onResizeWindow() {
                    /*
                     * Since aspectRatio is the target width/height, we have:
                     *
                     *      eParent.clientWidth / eChild.style.height = aspectRatio
                     *
                     * which means that:
                     *
                     *      eChild.style.height = eParent.clientWidth / aspectRatio
                     *
                     * so for example, if aspectRatio is 16:9, or 1.78, and clientWidth = 640,
                     * then the calculated height should approximately 360.
                     */
                    eChild.style.height = ((eParent.clientWidth / aspectRatio)|0) + "px";
                };
            }(eVideo, eCanvas, aspect));
            window['onresize']();
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
         *      var eInput = document.createElement("input");
         *      eInput.setAttribute("type", "password");
         *      eInput.setAttribute("style", "position:absolute; left:0; top:0; width:100%; height:100%; opacity:0.5");
         *      eVideo.appendChild(eInput);
         *
         * See this Chromium issue for more information: https://code.google.com/p/chromium/issues/detail?id=118639
         */
        var eTextArea = document.createElement("textarea");

        /*
         * As noted in keyboard.js, the keyboard on an iOS device tends to pop up with the SHIFT key depressed,
         * which is not the initial keyboard state that the Keyboard component expects, so hopefully turning off
         * these "auto" attributes will help.
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
        Component.bindComponentControls(video, eVideo, APPCLASS);
    }
};

/*
 * Initialize every Video module on the page.
 */
web.onInit(Video.init);

if (NODE) module.exports = Video;
