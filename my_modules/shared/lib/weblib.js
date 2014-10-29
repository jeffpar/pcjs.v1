/**
 * @fileoverview Browser-related helper functions
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 * @version 1.0
 * Created 2014-05-08
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of the JavaScript Machines Project (aka JSMachines) at <http://jsmachines.net/>
 * and <http://pcjs.org/>.
 *
 * JSMachines is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * JSMachines is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with JSMachines.
 * If not, see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some JSMachines files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * JSMachines Project for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

/*
 * According to http://www.w3schools.com/jsref/jsref_obj_global.asp, these are the *global* properties
 * and functions of JavaScript-in-the-Browser:
 *
 * Property             Description
 * ---
 * Infinity             A numeric value that represents positive/negative infinity
 * NaN                  "Not-a-Number" value
 * undefined            Indicates that a variable has not been assigned a value
 *
 * Function             Description
 * ---
 * decodeURI()          Decodes a URI
 * decodeURIComponent() Decodes a URI component
 * encodeURI()          Encodes a URI
 * encodeURIComponent() Encodes a URI component
 * escape()             Deprecated in version 1.5. Use encodeURI() or encodeURIComponent() instead
 * eval()               Evaluates a string and executes it as if it was script code
 * isFinite()           Determines whether a value is a finite, legal number
 * isNaN()              Determines whether a value is an illegal number
 * Number()             Converts an object's value to a number
 * parseFloat()         Parses a string and returns a floating point number
 * parseInt()           Parses a string and returns an integer
 * String()             Converts an object's value to a string
 * unescape()           Deprecated in version 1.5. Use decodeURI() or decodeURIComponent() instead
 *
 * And according to http://www.w3schools.com/jsref/obj_window.asp, these are the properties and functions
 * of the *window* object.
 *
 * Property             Description
 * ---
 * closed               Returns a Boolean value indicating whether a window has been closed or not
 * defaultStatus        Sets or returns the default text in the statusbar of a window
 * document             Returns the Document object for the window (See Document object)
 * frames               Returns an array of all the frames (including iframes) in the current window
 * history              Returns the History object for the window (See History object)
 * innerHeight          Returns the inner height of a window's content area
 * innerWidth           Returns the inner width of a window's content area
 * length               Returns the number of frames (including iframes) in a window
 * location             Returns the Location object for the window (See Location object)
 * name                 Sets or returns the name of a window
 * navigator            Returns the Navigator object for the window (See Navigator object)
 * opener               Returns a reference to the window that created the window
 * outerHeight          Returns the outer height of a window, including toolbars/scrollbars
 * outerWidth           Returns the outer width of a window, including toolbars/scrollbars
 * pageXOffset          Returns the pixels the current document has been scrolled (horizontally) from the upper left corner of the window
 * pageYOffset          Returns the pixels the current document has been scrolled (vertically) from the upper left corner of the window
 * parent               Returns the parent window of the current window
 * screen               Returns the Screen object for the window (See Screen object)
 * screenLeft           Returns the x coordinate of the window relative to the screen
 * screenTop            Returns the y coordinate of the window relative to the screen
 * screenX              Returns the x coordinate of the window relative to the screen
 * screenY              Returns the y coordinate of the window relative to the screen
 * self                 Returns the current window
 * status               Sets or returns the text in the statusbar of a window
 * top                  Returns the topmost browser window
 *
 * Method               Description
 * ---
 * alert()              Displays an alert box with a message and an OK button
 * atob()               Decodes a base-64 encoded string
 * blur()               Removes focus from the current window
 * btoa()               Encodes a string in base-64
 * clearInterval()      Clears a timer set with setInterval()
 * clearTimeout()       Clears a timer set with setTimeout()
 * close()              Closes the current window
 * confirm()            Displays a dialog box with a message and an OK and a Cancel button
 * createPopup()        Creates a pop-up window
 * focus()              Sets focus to the current window
 * moveBy()             Moves a window relative to its current position
 * moveTo()             Moves a window to the specified position
 * open()               Opens a new browser window
 * print()              Prints the content of the current window
 * prompt()             Displays a dialog box that prompts the visitor for input
 * resizeBy()           Resizes the window by the specified pixels
 * resizeTo()           Resizes the window to the specified width and height
 * scroll()             This method has been replaced by the scrollTo() method.
 * scrollBy()           Scrolls the content by the specified number of pixels
 * scrollTo()           Scrolls the content to the specified coordinates
 * setInterval()        Calls a function or evaluates an expression at specified intervals (in milliseconds)
 * setTimeout()         Calls a function or evaluates an expression after a specified number of milliseconds
 * stop()               Stops the window from loading
 */

"use strict";

/* global window: true, setTimeout: false, clearTimeout: false, SITEHOST: false */

/*
 * We must defer loading the Component module until the function(s) requiring it are
 * called; otherwise, we create an initialization cycle in which Component requires weblib
 * and weblib requires Component.
 *
 * In an ideal world, weblib would not be dependent on Component, but we really want to use
 * its logging functions.
 */
if (typeof module !== 'undefined') {
    var Component;
    require("./defines");
    var str = require("./strlib");
    var ReportAPI = require("./reportapi");
}

var web = {};

/**
 * loadResource(sURL, fAsync, data, componentNotify, fnNotify, pNotify)
 *
 * Request the specified resource (sURL), and once the request is complete,
 * optionally call the specified method (fnNotify) of the specified component (componentNotify).
 *
 * TODO: Figure out how we can strongly type the fnNotify parameter, because the Closure Compiler has issues with:
 *
 *      {function(this:Component, string, (string|null), number, (number|string|null|Object|Array|undefined))} [fnNotify]
 *
 * @param {string} sURL
 * @param {boolean} [fAsync] is true for an asynchronous request
 * @param {Object} [data] for a POST request (default is a GET request)
 * @param {Component} [componentNotify]
 * @param {function(...)} [fnNotify]
 * @param {number|string|null|Object|Array} [pNotify] optional fnNotify info parameter
 * @return {Array} containing errorCode and responseText (empty array if fAsync is true)
 */
web.loadResource = function(sURL, fAsync, data, componentNotify, fnNotify, pNotify)
{
    fAsync = !!fAsync;          // ensure that fAsync is a valid boolean (Internet Explorer xmlHTTP functions insist on it)
    if (typeof module !== 'undefined') {
        /*
         * We don't even need to load Component, because we can't use any of the code below
         * within Node anyway.  Instead, we must hand this request off to our network library.
         *
         *      if (!Component) Component = require("./component");
         */
        var net = require("./netlib");
        return net.loadResource(sURL, fAsync, data, componentNotify, fnNotify, pNotify);
    }
    var nErrorCode = 0;
    var sURLData = null;
    var sURLName = str.getBaseName(sURL);
    var xmlHTTP = (window.XMLHttpRequest? new window.XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP"));
    if (fAsync) {
        xmlHTTP.onreadystatechange = function() {
            if (xmlHTTP.readyState === 4) {
                /*
                 * The following line was recommended for WebKit, as a work-around to prevent the handler firing multiple
                 * times when debugging.  Unfortunately, that's not the only XMLHttpRequest problem that occurs when
                 * debugging, so I think the WebKit problem is deeper than that.  When we have multiple XMLHttpRequests
                 * pending, any debugging activity means most of them simply get dropped on floor, so what may actually be
                 * happening are mis-notifications rather than redundant notifications.
                 *
                xmlHTTP.onreadystatechange = undefined;
                 */
                sURLData = xmlHTTP.responseText;
                if (xmlHTTP.status == 200) {
                    Component.log("xmlHTTP.onreadystatechange(" + sURL + "): returned " + sURLData.length + " bytes");
                }
                else {
                    nErrorCode = xmlHTTP.status || -1;
                    Component.log("xmlHTTP.onreadystatechange(" + sURL + "): error code " + nErrorCode);
                }
                if (fnNotify) {
                    if (!componentNotify) {
                        fnNotify(sURLName, sURLData, nErrorCode, pNotify);
                    } else {
                        fnNotify.call(componentNotify, sURLName, sURLData, nErrorCode, pNotify);
                    }
                }
            }
        };
    }
    if (data) {
        var sData = "";
        for (var p in data) {
            if (!data.hasOwnProperty(p)) continue;
            if (sData) sData += "&";
            sData += p + '=' + encodeURIComponent(data[p]);
        }
        sData = sData.replace(/%20/g, '+');
        Component.log("web.loadResource(POST " + sURL + "): " + sData.length + " bytes");
        xmlHTTP.open("POST", sURL, fAsync);
        xmlHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHTTP.send(sData);
    } else {
        Component.log("web.loadResource(GET " + sURL + ")");
        xmlHTTP.open("GET", sURL, fAsync);
        xmlHTTP.send();
    }
    var response = [];
    if (!fAsync) {
        sURLData = xmlHTTP.responseText;
        if (xmlHTTP.status == 200) {
            Component.log("web.loadResource(" + sURL + "): returned " + sURLData.length + " bytes");
        } else {
            nErrorCode = xmlHTTP.status || -1;
            Component.log("web.loadResource(" + sURL + "): error code " + nErrorCode);
        }
        if (fnNotify) {
            if (!componentNotify) {
                fnNotify(sURLName, sURLData, nErrorCode, pNotify);
            } else {
                fnNotify.call(componentNotify, sURLName, sURLData, nErrorCode, pNotify);
            }
        }
        response = [nErrorCode, sURLData];
    }
    return response;
};

/**
 * sendReport(sApp, sVer, sURL, sUser, sType, sReport, sHostName)
 *
 * Send a report (eg, bug report) to the server.
 *
 * @param {string} sApp (eg, "PCjs")
 * @param {string} sVer (eg, "1.02")
 * @param {string} sURL (eg, "/configs/pc/machines/5150/mda/64kb/index.xml")
 * @param {string} sUser (ie, the user key, if any)
 * @param {string} sType (eg, "bug"); one of ReportAPI.TYPE.*
 * @param {string} sReport (eg, unparsed state data)
 * @param {string} [sHostName] (default is http://SITEHOST)
 */
web.sendReport = function(sApp, sVer, sURL, sUser, sType, sReport, sHostName)
{
    var data = {};
    data[ReportAPI.QUERY.APP] = sApp;
    data[ReportAPI.QUERY.VER] = sVer;
    data[ReportAPI.QUERY.URL] = sURL;
    data[ReportAPI.QUERY.USER] = sUser;
    data[ReportAPI.QUERY.TYPE] = sType;
    data[ReportAPI.QUERY.DATA] = sReport;
    var sReportURL = (sHostName? sHostName : "http://" + SITEHOST) + ReportAPI.ENDPOINT;
    web.loadResource(sReportURL, true, data);
};

/**
 * getHost()
 *
 * @return {string}
 */
web.getHost = function()
{
    return ("http://" + (window? window.location.host : SITEHOST));
};

/**
 * getHostURL()
 *
 * @return {string|null}
 */
web.getHostURL = function()
{
    return (window? window.location.href : null);
};

/**
 * getUserAgent()
 *
 * @return {string}
 */
web.getUserAgent = function()
{
    return (window? window.navigator.userAgent : "");
};

/**
 * alertUser(sMessage)
 *
 * @param {string} sMessage
 */
web.alertUser = function(sMessage)
{
    if (window) {
        window.alert(sMessage);
    } else {
        console.log(sMessage);
    }
};

/**
 * confirmUser(sPrompt)
 *
 * @param {string} sPrompt
 * @returns {boolean} true if the user clicked OK, false if Cancel/Close
 */
web.confirmUser = function(sPrompt)
{
    var fResponse = false;
    if (window) {
        fResponse = window.confirm(sPrompt);
    }
    return fResponse;
};

/**
 * promptUser()
 *
 * @param {string} sPrompt
 * @param {string} [sDefault]
 * @returns {string|null}
 */
web.promptUser = function(sPrompt, sDefault)
{
    var sResponse = null;
    if (window) {
        sResponse = window.prompt(sPrompt, sDefault === undefined? "" : sDefault);
    }
    return sResponse;
};

/**
 * fLocalStorage
 *
 * true if localStorage support exists, is enabled, and works; "falsey" otherwise
 *
 * @type {boolean|undefined}
 */
web.fLocalStorage;

/**
 * hasLocalStorage
 *
 * true if localStorage support exists, is enabled, and works; false otherwise
 *
 * @return {boolean}
 */
web.hasLocalStorage = function() {
    if (web.fLocalStorage === undefined) {
        var f;
        var sTest = 'PCjs.localStorage';
        try {
            window.localStorage.setItem(sTest, sTest);
            f = (window.localStorage.getItem(sTest) === sTest);
            window.localStorage.removeItem(sTest);
        } catch(e) {
            web.logLocalStorageError(e);
            f = false;
        }
        web.fLocalStorage = f;
    }
    return web.fLocalStorage;
};

/**
 * logLocalStorageError(e)
 *
 * @param {Error} e is an exception
 */
web.logLocalStorageError = function(e)
{
    Component.log(e.message, "localStorage error");
};

/**
 * getLocalStorageItem(sKey)
 *
 * Returns the requested key value, or null if the key does not exist, or undefined if localStorage is not available
 *
 * @param {string} sKey
 * @return {string|null|undefined} sValue
 */
web.getLocalStorageItem = function(sKey)
{
    var sValue;
    try {
        sValue = window.localStorage.getItem(sKey);
    } catch(e) {
        web.logLocalStorageError(e);
    }
    return sValue;
};

/**
 * setLocalStorageItem(sKey, sValue)
 *
 * @param {string} sKey
 * @param {string} sValue
 * @return {boolean} true if localStorage is available, false if not
 */
web.setLocalStorageItem = function(sKey, sValue)
{
    try {
        window.localStorage.setItem(sKey, sValue);
        return true;
    } catch(e) {
        web.logLocalStorageError(e);
    }
    return false;
};

/**
 * removeLocalStorageItem(sKey)
 *
 * @param {string} sKey
 */
web.removeLocalStorageItem = function(sKey)
{
    try {
        window.localStorage.removeItem(sKey);
    } catch(e) {
        web.logLocalStorageError(e);
    }
};

/**
 * getLocalStorageKeys()
 *
 * @return {Array}
 */
web.getLocalStorageKeys = function()
{
    var a = [];
    try {
        for (var i = 0, c = window.localStorage.length; i < c; i++) {
            a.push(window.localStorage.key(i));
        }
    } catch(e) {
        web.logLocalStorageError(e);
    }
    return a;
};

/**
 * reloadPage()
 */
web.reloadPage = function()
{
    if (window) window.location.reload();
};

/**
 * isUserAgent(s)
 *
 * Check the browser's user-agent string for the given substring; "iOS" and "MSIE" are special values you can
 * use that will match any iOS or MSIE browser, respectively (even IE11, in the case of "MSIE").
 *
 * 2013-11-06: In a questionable move, MSFT changed the user-agent reported by IE11 on Windows 8.1, eliminating
 * the "MSIE" string (which MSDN calls a "version token"; see http://msdn.microsoft.com/library/ms537503.aspx);
 * they say "public websites should rely on feature detection, rather than browser detection, in order to design
 * their sites for browsers that don't support the features used by the website." So, in IE11, we get a user-agent
 * that tries to fool apps into thinking the browser is more like WebKit or Gecko:
 *
 *      Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko
 *
 * That's a nice idea, but in the meantime, they hosed the XSL transform code in embed.js, which contained
 * some very critical browser-specific code; turning on IE's "Compatibility Mode" didn't help either, because
 * that's a sledgehammer solution which restores the old user-agent string but also disables other features like
 * HTML5 canvas support. As an interim solution, I'm treating any "MSIE" check as a check for either "MSIE" or
 * "Trident".
 *
 * UPDATE: I've since found ways to make the code in embed.js more browser-agnostic, so for now, there's isn't
 * any code that cares about "MSIE", but I've left the change in place, because I wouldn't be surprised if I'll
 * need more IE-specific code in the future, perhaps for things like copy/paste functionality, or mouse capture.
 *
 * @param {string} s is a substring to search for in the user-agent; as noted above, "iOS" and "MSIE" are special values
 * @return {boolean} is true if the string was found, false if not
 */
web.isUserAgent = function(s)
{
    if (window) {
        var userAgent = web.getUserAgent();
        /*
         * Here's one case where we have to be careful with Component, because when isUserAgent() is called by
         * the init code below, component.js hasn't been loaded yet.  The simplest solution is to remove the call.
         *
         *      if (Component) Component.log("agent: " + userAgent);
         *
         * And yes, it would be pointless to use the conditional (?) operator below, if not for the Google Closure
         * Compiler (v20130823) failing to detect the entire expression as a boolean.
         */
        return (s == "iOS" && userAgent.match(/(iPod|iPhone|iPad)/) && userAgent.match(/AppleWebKit/) || s == "MSIE" && userAgent.match(/(MSIE|Trident)/) || (userAgent.indexOf(s) >= 0))? true : false;
    }
    return false;
};

/**
 * getURLParameters(sParms)
 *
 * @param {string} [sParms] containing the parameter portion of a URL (ie, after the '?')
 * @return {Object} containing properties for each parameter found
 */
web.getURLParameters = function(sParms)
{
    var aParms = {};
    if (window) {       // an alternative to "if (typeof module === 'undefined')" if require("defines") has been invoked
        if (!sParms) {
            /*
             * Note that window.location.href returns the entire URL, whereas window.location.search
             * returns only the parameters, if any (starting with the '?', which we skip over with a substr() call).
             */
            sParms = window.location.search.substr(1);
        }
        var match;
        var pl = /\+/g;     // RegExp for replacing addition symbol with a space
        var search = /([^&=]+)=?([^&]*)/g;
        var decode = function(s) { return decodeURIComponent(s.replace(pl, " ")); };

        while ((match = search.exec(sParms))) {
            aParms[decode(match[1])] = decode(match[2]);
        }
    }
    return aParms;
};

/**
 * onCountRepeat(n, fn, fnComplete, msDelay)
 *
 * Call fn() n times with an msDelay millisecond delay between calls, then
 * call fnComplete() when the count has been exhausted OR fn() returns false.
 *
 * @param {number} n
 * @param {function()} fn
 * @param {function()} fnComplete
 * @param {number} [msDelay]
 */
web.onCountRepeat = function(n, fn, fnComplete, msDelay)
{
    var fnRepeat = function doCountRepeat() {
        n -= 1;
        if (n >= 0) {
            if (!fn()) n = 0;
        }
        if (n > 0) {
            setTimeout(fnRepeat, msDelay || 0);
            return;
        }
        fnComplete();
    };
    fnRepeat();
};

/**
 * onClickRepeat(e, msDelay, msRepeat, fn)
 *
 * Repeatedly call fn() with an initial msDelay, and an msRepeat delay thereafter,
 * as long as HTML control Object e has an active "down" event and fn() returns true.
 *
 * @param {Object} e
 * @param {number} msDelay
 * @param {number} msRepeat
 * @param {function(boolean)} fn is passed false on the first call, true on all repeated calls
 */
web.onClickRepeat = function(e, msDelay, msRepeat, fn)
{
    var ms = 0, timer = null, fIgnoreMouseEvents = false;

    var fnRepeat = function doClickRepeat() {
        if (fn(ms === msRepeat)) {
            timer = setTimeout(fnRepeat, ms);
            ms = msRepeat;
        }
    };
    e.onmousedown = function() {
        // Component.println("onMouseDown()");
        if (!fIgnoreMouseEvents) {
            if (!timer) {
                ms = msDelay;
                fnRepeat();
            }
        }
    };
    e.ontouchstart = function() {
        // Component.println("onTouchStart()");
        if (!timer) {
            ms = msDelay;
            fnRepeat();
        }
    };
    e.onmouseup = e.onmouseout = function() {
        // Component.println("onMouseUp()/onMouseOut()");
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };
    e.ontouchend = e.ontouchcancel = function() {
        // Component.println("onTouchEnd()/onTouchCancel()");
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        /*
         * Devices that generate ontouch* events ALSO generate onmouse* events,
         * and generally do so immediately after all the touch events are complete,
         * so unless we want double the action, we need to ignore mouse events.
         */
        fIgnoreMouseEvents = true;
    };
};

web.aPageEventHandlers = {
    'init': [],         // list of window 'onload' handlers
    'show': [],         // list of window 'onpageshow' handlers
    'exit': []          // list of window 'onunload' handlers (although we prefer to use 'onbeforeunload' if possible)
};

web.fPageReady = false; // set once the browser's first page initialization has occurred
web.fPageEventsEnabled = true;

/**
 * onPageEvent(sName, fn)
 *
 * @param {string} sFunc
 * @param {function()} fn
 *
 * Use this instead of setting window['onunload'], window['onunload'], etc.
 * Allows multiple JavaScript modules to define a handler for the same event.
 *
 * Moreover, it's risky to refer to obscure event handlers with "dot" names, because
 * the Closure Compiler may erroneously replace them (eg, window.onpageshow is a good example).
 */
web.onPageEvent = function(sFunc, fn)
{
    if (window) {
        var fnPrev = window[sFunc];
        if (typeof fnPrev !== 'function') {
            window[sFunc] = fn;
        } else {
            /*
             * TODO: Determine whether there's any value in receiving/sending the Event object that the
             * browser provides when it generates the original event.
             */
            window[sFunc] = function onWindowEvent() {
                if (fnPrev) fnPrev();
                fn();
            };
        }
    }
};

/**
 * onInit(fn)
 *
 * @param {function()} fn
 *
 * Use this instead of setting window.onload.  Allows multiple JavaScript modules to define their own 'onload' event handler.
 */
web.onInit = function(fn)
{
    web.aPageEventHandlers['init'].push(fn);
};

/**
 * onShow(fn)
 *
 * @param {function()} fn
 *
 * Use this instead of setting window.onpageshow.  Allows multiple JavaScript modules to define their own 'onpageshow' event handler.
 */
web.onShow = function(fn)
{
    web.aPageEventHandlers['show'].push(fn);
};

/**
 * onExit(fn)
 *
 * @param {function()} fn
 *
 * Use this instead of setting window.onunload.  Allows multiple JavaScript modules to define their own 'onunload' event handler.
 */
web.onExit = function(fn)
{
    web.aPageEventHandlers['exit'].push(fn);
};

/**
 * doPageEvent(afn)
 *
 * @param {Array.<function()>} afn
 */
web.doPageEvent = function(afn)
{
    if (web.fPageEventsEnabled) {
        for (var i = 0; i < afn.length; i++) {
            afn[i]();
        }
    }
};

/**
 * enablePageEvents(fEnable)
 *
 * @param {boolean} fEnable is true to enable page events, false to disable (they're enabled by default)
 */
web.enablePageEvents = function(fEnable)
{
    if (!web.fPageEventsEnabled && fEnable) {
        web.fPageEventsEnabled = true;
        if (web.fPageReady) web.sendPageEvent('init');
        return;
    }
    web.fPageEventsEnabled = fEnable;
};

/**
 * sendPageEvent(sEvent)
 *
 * This allows us to manually trigger page events.
 *
 * @param {string} sEvent (one of 'init', 'show' or 'exit')
 */
web.sendPageEvent = function(sEvent)
{
    if (web.aPageEventHandlers[sEvent]) {
        web.doPageEvent(web.aPageEventHandlers[sEvent]);
    }
};

web.onPageEvent('onload', function onPageLoad() { web.fPageReady = true; web.doPageEvent(web.aPageEventHandlers['init']); });
web.onPageEvent('onpageshow', function onPageShow() { web.doPageEvent(web.aPageEventHandlers['show']); });
web.onPageEvent(web.isUserAgent("Opera") || web.isUserAgent("iOS")? 'onunload' : 'onbeforeunload', function onPageUnload() { web.doPageEvent(web.aPageEventHandlers['exit']); });

if (typeof module !== 'undefined') module.exports = web;
