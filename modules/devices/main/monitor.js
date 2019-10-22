/**
 * @fileoverview Implements the Monitor device
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
 * <https://www.pcjs.org/modules/shared/lib/defines.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * @typedef {Config} MonitorConfig
 * @property {number} monitorWidth
 * @property {number} monitorHeight
 */

/**
 * @class {Monitor}
 * @unrestricted
 * @property {MonitorConfig} config
 */
class Monitor extends Device {
    /**
     * Monitor(idMachine, idDevice, config)
     *
     * The Monitor component manages the container representing the machine's display device.  The most
     * important config properties include:
     *
     *      monitorWidth: width of the monitor canvas, in pixels
     *      monitorHeight: height of the monitor canvas, in pixels
     *      monitorColor: background color of the monitor canvas (default is black)
     *      monitorRotate: the amount of counter-clockwise monitor rotation required (eg, -90 or 270)
     *      aspectRatio (eg, 1.33)
     *
     * NOTE: I originally wanted to call this the Screen device, but alas, the browser world has co-opted that
     * name, so I had to settle for Monitor instead (I had also considered Display, but that seemed too generic).
     *
     * Monitor is probably a better choice anyway, because that allows us to clearly differentiate between the
     * "host display" (which involves the browser's page, document, window, or screen, depending on the context)
     * and the "guest display", which I now try to consistently refer to as the Monitor.
     *
     * There are still terms of art that can muddy the waters; for example, many video devices support the concept
     * of "off-screen memory", and sure, I could call that "off-monitor memory", but let's not get carried away.
     *
     * @this {Monitor}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ROMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        let monitor = this, sProp, sEvent;
        this.fStyleCanvasFullScreen = document.fullscreenEnabled || this.isUserAgent("Edge/");

        this.cxMonitor = config['monitorWidth'] || 640;
        this.cyMonitor = config['monitorHeight'] || 480;

        let container = this.bindings[Monitor.BINDING.CONTAINER];
        if (container) {
            /*
             * Making sure the container had a "tabindex" attribute seemed like a nice way of ensuring we
             * had a single focusable surface that we could pass to our Input device, but that would be too
             * simple.  Safari once again bites us in the butt, just like it did when we tried to add the
             * "contenteditable" attribute to the canvas: painting slows to a crawl.
             *
             *      container.setAttribute("tabindex", "0");
             */
            this.container = container;
        } else {
            throw new Error("unable to find binding: " + Monitor.BINDING.CONTAINER);
        }

        /*
         * Create the Monitor canvas if we weren't given a predefined canvas; we'll assume that an existing
         * canvas is already contained within the container.
         */
        let canvas = this.bindings[Monitor.BINDING.SURFACE];
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("class", "pcjsSurface");
            canvas.setAttribute("width", config['monitorWidth']);
            canvas.setAttribute("height", config['monitorHeight']);
            canvas.style.backgroundColor = config['monitorColor'] || "black";
            container.appendChild(canvas);
        }
        this.canvasMonitor = canvas;

        /*
         * The "contenteditable" attribute on a canvas is a simple way of creating a display surface that can
         * also receive focus and generate input events.  Unfortunately, in Safari, that attribute NOTICEABLY
         * slows down canvas operations whenever it has focus.  All you have to do is click away from the canvas,
         * and drawing speeds up, then click back on the canvas, and drawing slows down.  So we now rely on a
         * "transparent textarea" solution (see below).
         *
         *      canvas.setAttribute("contenteditable", "true");
         */

        let context = canvas.getContext("2d");
        this.contextMonitor = context;

        /*
         * HACK: A canvas style of "auto" provides for excellent responsive canvas scaling in EVERY browser
         * except IE9/IE10, so I recalculate the appropriate CSS height every time the parent div is resized;
         * IE11 works without this hack, so we take advantage of the fact that IE11 doesn't identify as "MSIE".
         *
         * The other reason it's good to keep this particular hack limited to IE9/IE10 is that most other
         * browsers don't actually support an 'onresize' handler on anything but the window object.
         */
        if (this.isUserAgent("MSIE")) {
            container.onresize = function(parentElement, childElement, cx, cy) {
                return function onResizeScreen() {
                    childElement.style.height = (((parentElement.clientWidth * cy) / cx) | 0) + "px";
                };
            }(container, canvas, config['monitorWidth'], config['monitorHeight']);
            container.onresize();
        }

        /*
         * The following is a related hack that allows the user to force the monitor to use a particular aspect
         * ratio if an 'aspect' attribute or URL parameter is set.  Initially, it's just for testing purposes
         * until we figure out a better UI.  And note that we use our onPageEvent() helper function to make sure
         * we don't trample any other 'onresize' handler(s) attached to the window object.
         */
        let aspect = +(config['aspect'] || this.getURLParms()['aspect']);

        /*
         * No 'aspect' parameter yields NaN, which is falsey, and anything else must satisfy my arbitrary
         * constraints of 0.3 <= aspect <= 3.33, to prevent any useless (or worse, browser-blowing) results.
         */
        if (aspect && aspect >= 0.3 && aspect <= 3.33) {
            this.onPageEvent('onresize', function(parentElement, childElement, aspectRatio) {
                return function onResizeWindow() {
                    /*
                     * Since aspectRatio is the target width/height, we have:
                     *
                     *      parentElement.clientWidth / childElement.style.height = aspectRatio
                     *
                     * which means that:
                     *
                     *      childElement.style.height = parentElement.clientWidth / aspectRatio
                     *
                     * so for example, if aspectRatio is 16:9, or 1.78, and clientWidth = 640,
                     * then the calculated height should approximately 360.
                     */
                    childElement.style.height = ((parentElement.clientWidth / aspectRatio)|0) + "px";
                };
            }(container, canvas, aspect));
            window['onresize']();
        }

        /*
         * The 'touchType' config property can be set to true for machines that require a full keyboard.  If
         * set, we create a transparent textarea on top of the canvas and provide it to the Input device via
         * addSurface(), making it easy for the user to activate the on-screen keyboard for touch-type devices.
         *
         * The parent div must have a style of "position:relative", so that we can position the textarea using
         * "position:absolute" with "top" and "left" coordinates of zero.  And we don't want the textarea to be
         * visible, but we must use "opacity:0" instead of "visibility:hidden", because the latter seems to
         * prevent the element from receiving events.
         *
         * All these styling requirements are resolved by using CSS class "pcjsSurface" for the parent div and
         * CSS class "pcjsOverlay" for the textarea.
         *
         * Having the textarea can serve other useful purposes as well, such as providing a place for us to echo
         * diagnostic messages, and it solves the Safari performance problem I observed (see above).  Unfortunately,
         * it creates new challenges, too.  For example, textareas can cause certain key combinations, like "Alt-E",
         * to be withheld as part of the browser's support for multi-key character composition.  So I may have to
         * alter which element on the page gets focus depending on the platform or other factors.
         */
        let textarea;
        if (this.config['touchType']) {
            textarea = document.createElement("textarea");
            textarea.setAttribute("class", "pcjsOverlay");
            /*
            * The soft keyboard on an iOS device tends to pop up with the SHIFT key depressed, which is not the
            * initial keyboard state we prefer, so hopefully turning off these "auto" attributes will help.
            */
            if (this.isUserAgent("iOS")) {
                textarea.setAttribute("autocorrect", "off");
                textarea.setAttribute("autocapitalize", "off");
                /*
                * One of the problems on iOS devices is that after a soft-key control is clicked, we need to give
                * focus back to the above textarea, usually by calling cmp.updateFocus(), but in doing so, iOS may
                * also "zoom" the page rather jarringly.  While it's a simple matter to completely disable zooming,
                * by fiddling with the page's viewport, that prevents the user from intentionally zooming.  A bit of
                * Googling reveals that another way to prevent those jarring unintentional zooms is to simply set the
                * font-size of the text control to 16px.  So that's what we do.
                */
                textarea.style.fontSize = "16px";
            }
            container.appendChild(textarea);
        }

        /*
         * If we have an associated input device, make sure it is associated with our default input surface.
         */
        this.input = /** @type {Input} */ (this.findDeviceByClass("Input", false));
        if (this.input) {
            this.inputMonitor = textarea || container;
            this.input.addSurface(this.inputMonitor, textarea? null : this.findBinding(Machine.BINDING.POWER, true));
        }

        /*
         * These variables are here in case we want/need to add support for borders later...
         */
        this.xMonitorOffset = this.yMonitorOffset = 0;
        this.cxMonitorOffset = this.cxMonitor;
        this.cyMonitorOffset = this.cyMonitor;

        /*
         * Support for disabling (or, less commonly, enabling) image smoothing, which all browsers
         * seem to support now (well, OK, I still have to test the latest MS Edge browser), despite
         * it still being labelled "experimental technology".  Let's hope the browsers standardize
         * on this.  I see other options emerging, like the CSS property "image-rendering: pixelated"
         * that's apparently been added to Chrome.  Sigh.
         */
        let fSmoothing = config['smoothing'];
        let sSmoothing = this.getURLParms()['smoothing'];
        if (sSmoothing) fSmoothing = (sSmoothing == "true");
        this.fSmoothing = fSmoothing;
        this.sSmoothing = this.findProperty(context, 'imageSmoothingEnabled');

        this.rotateMonitor = config['monitorRotate'];
        if (this.rotateMonitor) {
            this.rotateMonitor = this.rotateMonitor % 360;
            if (this.rotateMonitor > 0) this.rotateMonitor -= 360;
            /*
             * TODO: Consider also disallowing any rotateMonitor value if bufferRotate was already set; setting
             * both is most likely a mistake, but who knows, maybe someone wants to use both for 180-degree rotation?
             */
            if (this.rotateMonitor != -90) {
                this.printf("unsupported monitor rotation: %d\n", this.rotateMonitor);
                this.rotateMonitor = 0;
            } else {
                context.translate(0, this.cyMonitor);
                context.rotate((this.rotateMonitor * Math.PI)/180);
                context.scale(this.cyMonitor/this.cxMonitor, this.cxMonitor/this.cyMonitor);
            }
        }

        /*
         * Here's the gross code to handle full-screen support across all supported browsers.  Most of the crud is
         * now buried inside findProperty(), which checks for all the browser prefix variations (eg, "moz", "webkit")
         * and deals with certain property name variations, like 'Fullscreen' (new) vs 'FullScreen' (old).
         */
        let button = this.bindings[Monitor.BINDING.FULLSCREEN];
        if (button) {
            sProp = this.findProperty(container, 'requestFullscreen');
            if (sProp) {
                container.doFullScreen = container[sProp];
                sEvent = this.findProperty(document, 'on', 'fullscreenchange');
                if (sEvent) {
                    let sFullScreen = this.findProperty(document, 'fullscreenElement');
                    document.addEventListener(sEvent, function onFullScreenChange() {
                        monitor.onFullScreen(document[sFullScreen] != null);
                    }, false);
                }
                sEvent = this.findProperty(document, 'on', 'fullscreenerror');
                if (sEvent) {
                    document.addEventListener(sEvent, function onFullScreenError() {
                        monitor.onFullScreen();
                    }, false);
                }
            } else {
                this.printf("Full-screen API not available\n");
                button.parentNode.removeChild(/** @type {Node} */ (button));
            }
        }
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Monitor}
     * @param {string} binding
     * @param {Element} element
     */
    addBinding(binding, element)
    {
        let monitor = this;

        switch(binding) {
        case Monitor.BINDING.FULLSCREEN:
            element.onclick = function onClickFullScreen() {
                if (DEBUG) monitor.printf(MESSAGE.SCREEN, "onClickFullScreen()\n");
                monitor.doFullScreen();
            };
            break;
        }
        super.addBinding(binding, element);
    }

    /**
     * blankMonitor()
     *
     * @this {Monitor}
     */
    blankMonitor()
    {
        if (this.contextMonitor) {
            this.contextMonitor.fillStyle = "black";
            this.contextMonitor.fillRect(0, 0, this.canvasMonitor.width, this.canvasMonitor.height);
        }
    }

    /**
     * doFullScreen()
     *
     * @this {Monitor}
     * @return {boolean} true if request successful, false if not (eg, failed OR not supported)
     */
    doFullScreen()
    {
        let fSuccess = false;
        if (this.container) {
            if (this.container.doFullScreen) {
                /*
                 * Styling the container with a width of "100%" and a height of "auto" works great when the aspect ratio
                 * of our virtual monitor is at least roughly equivalent to the physical screen's aspect ratio, but now that
                 * we support virtual VGA monitors with an aspect ratio of 1.33, that's very much out of step with modern
                 * wide-screen monitors, which usually have an aspect ratio of 1.6 or greater.
                 *
                 * And unfortunately, none of the browsers I've tested appear to make any attempt to scale our container to
                 * the physical screen's dimensions, so the bottom of our monitor gets clipped.  To prevent that, I reduce
                 * the width from 100% to whatever percentage will accommodate the entire height of the virtual monitor.
                 *
                 * NOTE: Mozilla recommends both a width and a height of "100%", but all my tests suggest that using "auto"
                 * for height works equally well, so I'm sticking with it, because "auto" is also consistent with how I've
                 * implemented a responsive canvas when the browser window is being resized.
                 */
                let sWidth = "100%";
                let sHeight = "auto";
                if (screen && screen.width && screen.height) {
                    let aspectPhys = screen.width / screen.height;
                    let aspectVirt = this.cxMonitor / this.cyMonitor;
                    if (aspectPhys > aspectVirt) {
                        sWidth = Math.round(aspectVirt / aspectPhys * 100) + '%';
                    }
                    // TODO: We may need to someday consider the case of a physical screen with an aspect ratio < 1.0....
                }
                if (!this.fStyleCanvasFullScreen) {
                    this.container.style.width = sWidth;
                    this.container.style.height = sHeight;
                } else {
                    /*
                     * Sadly, the above code doesn't work for Firefox (nor for Chrome, as of Chrome 75 or so), because as
                     * http://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode explains:
                     *
                     *      'It's worth noting a key difference here between the Gecko and WebKit implementations at this time:
                     *      Gecko automatically adds CSS rules to the element to stretch it to fill the screen: "width: 100%; height: 100%".
                     *
                     * Which would be OK if Gecko did that BEFORE we're called, but apparently it does that AFTER, effectively
                     * overwriting our careful calculations.  So we style the inner element (canvasMonitor) instead, which
                     * requires even more work to ensure that the canvas is properly centered.  FYI, this solution is consistent
                     * with Mozilla's recommendation for working around their automatic CSS rules:
                     *
                     *      '[I]f you're trying to emulate WebKit's behavior on Gecko, you need to place the element you want
                     *      to present inside another element, which you'll make fullscreen instead, and use CSS rules to adjust
                     *      the inner element to match the appearance you want.'
                     */
                    this.canvasMonitor.style.width = sWidth;
                    this.canvasMonitor.style.height = sHeight;
                    this.canvasMonitor.style.display = "block";
                    this.canvasMonitor.style.margin = "auto";
                }
                this.container.style.backgroundColor = "black";
                this.container.doFullScreen();
                fSuccess = true;
            }
            if (this.input) this.input.setFocus();
        }
        return fSuccess;
    }

    /**
     * onFullScreen(fFullScreen)
     *
     * @this {Monitor}
     * @param {boolean} [fFullScreen] (undefined if there was a full-screen error)
     */
    onFullScreen(fFullScreen)
    {
        if (!fFullScreen) {
            if (this.container) {
                if (!this.fStyleCanvasFullScreen) {
                    this.container.style.width = this.container.style.height = "";
                } else {
                    this.canvasMonitor.style.width = this.canvasMonitor.style.height = "";
                }
            }
        }
        if (DEBUG) this.printf(MESSAGE.SCREEN, "onFullScreen(%b)\n", fFullScreen);
    }

    /**
     * onPower(on)
     *
     * Called by the Machine device to provide notification of a power event.
     *
     * @this {Monitor}
     * @param {boolean} on (true to power on, false to power off)
     */
    onPower(on)
    {
        if (on) {
            this.initCache();
            this.updateScreen();
        } else {
            this.blankMonitor();
        }
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {Monitor}
     */
    onReset()
    {
        this.blankMonitor();
    }
}

Monitor.BINDING = {
    SURFACE:    "surface",
    CONTAINER:  "monitor",
    FULLSCREEN: "fullScreen"
};

Defs.CLASSES["Monitor"] = Monitor;
