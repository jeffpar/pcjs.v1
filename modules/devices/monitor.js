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
     * The Monitor component can be configured with the following config properties:
     *
     *      monitorWidth: width of the monitor canvas, in pixels
     *      monitorHeight: height of the monitor canvas, in pixels
     *      monitorColor: background color of the monitor canvas (default is black)
     *      monitorRotate: the amount of counter-clockwise monitor rotation required (eg, -90 or 270)
     *      aspectRatio (eg, 1.33)
     *
     * NOTE: I originally wanted to call this the Screen class, but alas, the browser world has co-opted that
     * name, so I had to settle for Monitor instead (I had also considered Display, but that seemed too generic).
     *
     * Monitor is probably a better choice anyway, because that allows us to clearly differentiate between the
     * "host display" (which the browser may refer to as page, document, window, or screen, depending on context)
     * and the "guest display", which we now try to consistently refer to as the Monitor.
     *
     * There are still terms of art that can muddy the waters; for example, many video devices support the concept
     * of "off-screen memory", and sure, we could call that "off-monitor memory", but let's not get carried away.
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
        this.fGecko = this.isUserAgent("Gecko/");

        this.cxMonitor = config['monitorWidth'];
        this.cyMonitor = config['monitorHeight'];
        if (!this.cxMonitor || !this.cyMonitor) {
            this.printf("check monitor dimensions (%dx%d)\n", this.cxMonitor, this.cyMonitor);
        }

        let canvas = document.createElement("canvas");
        canvas.setAttribute("class", "pcjs-monitor");
        canvas.setAttribute("width", config['monitorWidth']);
        canvas.setAttribute("height", config['monitorHeight']);
        canvas.style.backgroundColor = config['monitorColor'];

        let context = canvas.getContext("2d");

        let container = this.bindings[Monitor.BINDING.CONTAINER];
        if (container) {
            container.appendChild(canvas);
        } else {
            this.printf("unable to find monitor element: %s\n", Monitor.BINDING.CONTAINER);
        }

        /*
         * The "contenteditable" attribute on a canvas element NOTICEABLY slows down canvas drawing on
         * Safari as soon as you give the canvas focus (ie, click away from the canvas, and drawing speeds
         * up; click on the canvas, and drawing slows down).  So we now rely on a "transparent textarea"
         * solution (see the textarea code below).
         *
         *      canvas.setAttribute("contenteditable", "true");
         *
         * HACK: A canvas style of "auto" provides for excellent responsive canvas scaling in EVERY browser
         * except IE9/IE10, so I recalculate the appropriate CSS height every time the parent div is resized;
         * IE11 works without this hack, so we take advantage of the fact that IE11 doesn't identify as "MSIE".
         *
         * The other reason it's good to keep this particular hack limited to IE9/IE10 is that most other
         * browsers don't actually support an 'onresize' handler on anything but the window object.
         */
        if (container && this.isUserAgent("MSIE")) {
            container.onresize = function(eParent, eChild, cx, cy) {
                return function onResizeScreen() {
                    eChild.style.height = (((eParent.clientWidth * cy) / cx) | 0) + "px";
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
        if (container && aspect && aspect >= 0.3 && aspect <= 3.33) {
            this.onPageEvent('onresize', function(eParent, eChild, aspectRatio) {
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
            }(container, canvas, aspect));
            window['onresize']();
        }

        /*
         * In order to activate the on-screen keyboard for touchscreen devices, we create a transparent textarea
         * on top of the canvas.  The parent div must have a style of "position:relative", so that we can position
         * the textarea using "position:absolute" with "top" and "left" coordinates of zero.  And we don't want the
         * textarea to be visible, but we must use "opacity:0" instead of "visibility:hidden", because the latter
         * seems to prevent the element from receiving events.
         *
         * All these styling requirements are resolved by using CSS class "pcjs-monitor" for the parent div and
         * CSS class "pcjs-overlay" for the textarea.
         *
         * Having the textarea serves other useful purposes as well: it provides a place for us to echo diagnostic
         * messages, and it solves the Safari performance problem I observed (see above).  Unfortunately, it creates
         * new challenges, too.  For example, textareas can cause certain key combinations, like "Alt-E", to be
         * withheld as part of the browser's support for multi-key character composition.  So I may have to alter
         * which element on the page gets focus depending on the platform or other factors.  TODO: Resolve this.
         */
        let textarea;
        if (container) {
            textarea = document.createElement("textarea");
            textarea.setAttribute("class", "pcjs-overlay");
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

        this.canvasMonitor = canvas;
        this.contextMonitor = context;
        this.textareaMonitor = textarea;
        this.inputMonitor = textarea || canvas || null;

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
        this.sSmoothing = this.findProperty(this.contextMonitor, 'imageSmoothingEnabled');

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
                this.contextMonitor.translate(0, this.cyMonitor);
                this.contextMonitor.rotate((this.rotateMonitor * Math.PI)/180);
                this.contextMonitor.scale(this.cyMonitor/this.cxMonitor, this.cxMonitor/this.cyMonitor);
            }
        }

        /*
         * Here's the gross code to handle full-screen support across all supported browsers.  The lack of standards
         * is exasperating; browsers can't agree on 'Fullscreen' (most common) or 'FullScreen' (least common), and while
         * some browsers honor other browser prefixes, most don't.  Event handlers tend to be more consistent (ie, all
         * lower-case).
         */
        this.container = container;
        if (this.container) {
            sProp = this.findProperty(container, 'requestFullscreen') || this.findProperty(container, 'requestFullScreen');
            if (sProp) {
                this.container.doFullScreen = container[sProp];
                sEvent = this.findProperty(document, 'on', 'fullscreenchange');
                if (sEvent) {
                    let sFullScreen = this.findProperty(document, 'fullscreenElement') || this.findProperty(document, 'fullScreenElement');
                    document.addEventListener(sEvent, function onFullScreenChange() {
                        monitor.notifyFullScreen(document[sFullScreen] != null);
                    }, false);
                }
                sEvent = this.findProperty(document, 'on', 'fullscreenerror');
                if (sEvent) {
                    document.addEventListener(sEvent, function onFullScreenError() {
                        monitor.notifyFullScreen();
                    }, false);
                }
            }
        }

        /*
         * If we have an associated keyboard, then ensure that the keyboard will be notified
         * whenever the canvas gets focus and receives input.
         */

        // this.kbd = /** @type {Keyboard8080} */ (cmp.getMachineComponent("Keyboard"));
        // if (this.kbd) {
        //     for (let s in this.ledBindings) {
        //         this.kbd.setBinding("led", s, this.ledBindings[s]);
        //     }
        //     if (this.canvasMonitor) {
        //         this.kbd.setBinding(this.textareaMonitor? "textarea" : "canvas", "monitor", /** @type {HTMLElement} */ (this.inputMonitor));
        //     }
        // }

        this.ledBindings = {};  // TODO
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
        let monitor = this, elementInput;

        switch(binding) {
        case Monitor.BINDING.FULLSCREEN:
            if (this.container && this.container.doFullScreen) {
                element.onclick = function onClickFullScreen() {
                    if (DEBUG) monitor.printf(MESSAGE.SCREEN, "fullScreen()\n");
                    monitor.doFullScreen();
                };
            } else {
                if (DEBUG) this.printf("FullScreen API not available\n");
                element.parentNode.removeChild(/** @type {Node} */ (element));
            }
            break;
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
                     * overwriting our careful calculations.  So we style the inner element (canvasMonitor) instead, which
                     * requires even more work to ensure that the canvas is properly centered.  FYI, this solution is consistent
                     * with Mozilla's recommendation for working around their automatic CSS rules:
                     *
                     *      '[I]f you're trying to emulate WebKit's behavior on Gecko, you need to place the element you want
                     *      to present inside another element, which you'll make fullscreen instead, and use CSS rules to adjust
                     *      the inner element to match the appearance you want.'
                     */
                    this.canvasMonitor.style.width = sWidth;
                    this.canvasMonitor.style.width = sWidth;
                    this.canvasMonitor.style.display = "block";
                    this.canvasMonitor.style.margin = "auto";
                }
                this.container.style.backgroundColor = "black";
                this.container.doFullScreen();
                fSuccess = true;
            }
            this.setFocus();
        }
        return fSuccess;
    }

    /**
     * notifyFullScreen(fFullScreen)
     *
     * @this {Monitor}
     * @param {boolean} [fFullScreen] (undefined if there was a full-screen error)
     */
    notifyFullScreen(fFullScreen)
    {
        if (!fFullScreen && this.container) {
            if (!this.fGecko) {
                this.container.style.width = this.container.style.height = "";
            } else {
                this.canvasMonitor.style.width = this.canvasMonitor.style.height = "";
            }
        }
        this.printf("notifyFullScreen(%b)\n", fFullScreen);
    }

    /**
     * setFocus()
     *
     * @this {Monitor}
     */
    setFocus()
    {
        if (this.inputMonitor) this.inputMonitor.focus();
    }
}

Monitor.BINDING = {
    CONTAINER:  "container",
    FULLSCREEN: "fullScreen"
};
