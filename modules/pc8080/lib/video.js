/**
 * @fileoverview Implements the PC8080 Video component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-20
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
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
 * that loads or runs any version of this software (see Computer.COPYRIGHT).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
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
 *      aspect
 *      rotate
 *      addr
 *      screenColor: background color of the screen canvas (default is black)
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
    this.setReady();
}

Component.subclass(Video);

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
    var aeVideo = Component.getElementsByClass(document, PCJSCLASS, "video");
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
        var aspect = +(parmsVideo['aspect'] || Component.parmsURL['aspect']);
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
        Component.bindComponentControls(video, eVideo, PCJSCLASS);
    }
};

/*
 * Initialize every Video module on the page.
 */
web.onInit(Video.init);

if (NODE) module.exports = Video;
