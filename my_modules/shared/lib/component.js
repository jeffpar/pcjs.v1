/**
 * @fileoverview The Component class used by C1Pjs and PCjs.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-May-14
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
 * All the C1Pjs and PCjs components now use JSDoc types, primarily so that Google's Closure Compiler
 * will compile everything with ZERO warnings.  For more information about the JSDoc types supported by
 * the Closure Compiler:
 *
 *      https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 *
 * I also attempted to use JSLint, but it's excessively strict for my taste, so this is the only file
 * I tried massaging for JSLint's sake.  I gave up when it complained about my use of "while (true)";
 * replacing "true" with an assignment expression didn't make it any happier.
 *
 * I wasn't thrilled about replacing all "++" and "--" operators with "+= 1" and "-= 1", nor about using
 * "(s || '')" instead of "(s? s : '')", because while the former may seem simpler, it is NOT more portable.
 * It's not that I'm trying to write "portable JavaScript", but some of this code was ported from C code
 * I'd written about 14 years earlier, and portability is good, so I see no reason to rewrite code to make
 * it less portable.
 *
 * UPDATE: I've since switched to JSHint, which seems to have more reasonable defaults.
 */

"use strict";

/* global window: true, DEBUG: true */

if (typeof module !== 'undefined') {
    require("./defines");
    var usr = require("./usrlib");
    var web = require("./weblib");
}

/**
 * Component(type, parms, constructor)
 *
 * @constructor
 * @param {string} type
 * @param {Object} [parms]
 * @param {Object} [constructor]
 *
 * A Component object requires:
 *
 *      type: a user-defined type name (eg, "CPU")
 *
 * and accepts any or all of the following (parms) properties:
 *
 *      id: component ID (default is "")
 *      name: component name (default is ""; if blank, toString() will use the type name only)
 *      comment: component comment string (default is undefined)
 *
 * Subclasses that use Component.subclass() to extend Component will likely have additional (parms) properties.
 */
function Component(type, parms, constructor)
{
    this.type = type;

    if (!parms) {
        parms = {'id': "", 'name': ""};
    }

    this.id = parms['id'];
    this.name = parms['name'];
    this.comment = parms['comment'];
    this.parms = parms;
    if (this.id === undefined) this.id = "";

    var i = this.id.indexOf('.');
    if (i > 0) {
        this.idMachine = this.id.substr(0, i);
        this.idComponent = this.id.substr(i + 1);
    } else {
        this.idComponent = this.id;
    }

    /*
     * Recording the constructor is really just a debugging aid, because many of our constructors
     * have class constants, but they're hard to find when the constructors are buried among all the
     * other globals.
     */
    this[type] = constructor;

    /*
     * TODO: Decide how to reintegrate this code into the components that still want it....
     *
    if (this.initStep) this.initStep(parms);
     */
    this.aFlags = {
        fReady: false,
        fBusy: false,
        fBusyCancel: false,
        fPowered: false,
        fError: false
    };

    this.fnReady = null;
    this.clearError();
    this.bindings = {};
    this.dbg = null;                    // by default, no connection to a Debugger

    Component.add(this);
}

/**
 * Component.parmsURL
 *
 * Initialized to the set of URL parameters, if any, for the current web page.
 *
 * @type {Object|null}
 */
Component.parmsURL = web.getURLParameters();

/**
 * Component.inherit(p)
 *
 * Returns a newly created object that inherits properties from the prototype object p.
 * It uses the ECMAScript 5 function Object.create() if it is defined, and otherwise falls back to an older technique.
 *
 * See: Flanagan, David (2011-04-18). JavaScript: The Definitive Guide: The Definitive Guide (Kindle Locations 9854-9903). OReilly Media - A. Kindle Edition (Example 6-1)
 *
 * @param {Object} p
 */
Component.inherit = function(p)
{
    if (window) {                       // an alternative to "if (typeof window === 'undefined')" if require("defines") has been invoked
        if (!p) throw new TypeError();  // TODO: Why does this barf under Node?
        if (Object.create) {
            return Object.create(p);
        }
        var t = typeof p;
        if (t !== "object" && t !== "function") throw new TypeError();
    }
    /**
     * @constructor
     */
    function F() {}
    F.prototype = p;
    return new F();
};

/**
 * Component.extend(o, p)
 *
 * Copies the enumerable properties of p to o and returns o.
 * If o and p have a property by the same name, o's property is overwritten.
 *
 * See: Flanagan, David (2011-04-18). JavaScript: The Definitive Guide: The Definitive Guide (Kindle Locations 9854-9903). OReilly Media - A. Kindle Edition (Example 6-2)
 *
 * @param {Object} o
 * @param {Object} p
 */
Component.extend = function(o, p)
{
    for (var prop in p) {
        o[prop] = p[prop];
    }
    return o;
};

/**
 * Component.subclass(superclass, subclass, methods, statics)
 *
 * TODO: Determine why every subclass created by this function ends up with a name prefix of "Component.subclass"
 * in Chrome's call stack, rather than the (more logical) name of the subclass constructor.  Is there a different
 * design pattern I should be using that creates subclasses more to Chrome's liking?
 *
 * See: Flanagan, David (2011-04-18). JavaScript: The Definitive Guide: The Definitive Guide (Kindle Locations 9854-9903). OReilly Media - A. Kindle Edition (Example 9-11)
 *
 * @param {Object} superclass is the constructor of the superclass
 * @param {Object} subclass is the constructor for the new subclass
 * @param {Object} [methods] contains all instance methods
 * @param {Object} [statics] contains all class properties and methods
 */
Component.subclass = function(superclass, subclass, methods, statics)
{
    subclass.prototype = Component.inherit(superclass.prototype);
    subclass.prototype.constructor = subclass;
    if (methods) {
        Component.extend(subclass.prototype, methods);
    }
    if (statics) {
        Component.extend(subclass, statics);
    }
    return subclass;
};

/*
 * Every component created on the current page is recorded in this array (see Component.add()).
 *
 * This enables any component to locate another component by ID (see Component.getComponentByID())
 * or by type (see Component.getComponentByType()).
 */
Component.all = [];

/**
 * Component.add(component)
 *
 * @param {Component} component
 */
Component.add = function(component)
{
    /*
     * This just generates a lot of useless noise, handy in the early days, not so much these days...
     *
     *      Component.log("Component.add(" + component.type + "," + component.id + ")");
     */
    Component.all[Component.all.length] = component;
};

/**
 * Component.log(s, type)
 *
 * For diagnostic output only.
 *
 * @param {string} [s] is the message text
 * @param {string} [type] is the message type
 */
Component.log = function(s, type)
{
    if (DEBUG) {
        if (s) {
            var msElapsed, sMsg = (type? (type + ": ") : "") + s;
            if (Component.msStart === undefined) {
                Component.msStart = usr.getTime();
            }
            msElapsed = usr.getTime() - Component.msStart;
            console.log(msElapsed + "ms: " + sMsg.replace(/\n/g, " "));
        }
    }
};

/**
 * Component.assert(f, s)
 *
 * Used to verify conditions that must be true (for DEBUG builds only; compiled builds should automatically have all
 * references to Component.assert() removed).
 *
 * @param {boolean} f is the expression we are asserting to be true
 * @param {string} [s] is description of the assertion on failure
 */
Component.assert = function(f, s)
{
    if (DEBUG) {
        if (!f) {
            /*
             * TODO: An accompanying source file/line number/function call would be nice, if there was a browser-independent way....
             */
            if (!s) s = "assertion failure";
            Component.log(s);
            throw new Error(s);
        }
    }
};

/**
 * Component.println(s, type, id)
 *
 * For non-diagnostic messages, which components may override to control the destination/appearance of their output.
 *
 * Components that inherit from this class should use the instance method, this.println(), rather than Component.println(),
 * because if a Control Panel is loaded, it will override only the instance method, not the class method (overriding the class
 * method would improperly affect any other machines loaded on the same page).
 *
 * @param {string} [s] is the message text
 * @param {string} [type] is the message type
 * @param {string} [id] is the caller's ID, if any
 */
Component.println = function(s, type, id)
{
    if (DEBUG) {
        Component.log((id? (id + ": ") : "") + (s? ("\"" + s + "\"") : ""), type);
    }
};

/**
 * Component.notice(s, fPrintOnly, id)
 *
 * notice() is like println() but implies a need for user notification, so we alert() as well.
 *
 * @param {string} s is the message text
 * @param {boolean} [fPrintOnly]
 * @param {string} [id] is the caller's ID, if any
 */
Component.notice = function(s, fPrintOnly, id)
{
    if (DEBUG) {
        Component.println(s, "notice", id);
    }
    if (!fPrintOnly) web.alertUser(s);
};

/**
 * Component.warning(s)
 *
 * @param {string} s describes the warning
 */
Component.warning = function(s)
{
    if (DEBUG) {
        Component.println(s, "warning");
    }
    web.alertUser(s);
};

/**
 * Component.error(s)
 *
 * @param {string} s describes the error; an alert() is displayed as well
 */
Component.error = function(s)
{
    if (DEBUG) {
        Component.println(s, "error");
    }
    web.alertUser(s);
};

/**
 * Component.getComponents(idRelated)
 *
 * We could store components as properties of an 'all' object, using the component's ID,
 * and change this linear lookup into a property lookup, but some components may have no ID.
 *
 * @param {string} [idRelated] of related component
 * @return {Array} of components
 */
Component.getComponents = function(idRelated)
{
    var i;
    var aComponents = [];
    /*
     * getComponentByID(id, idRelated)
     *
     * If idRelated is provided, we check it for a machine prefix, and use any
     * existing prefix to constrain matches to IDs with the same prefix, in order to
     * avoid matching components belonging to other machines.
     */
    if (idRelated) {
        if ((i = idRelated.indexOf('.')) > 0)
            idRelated = idRelated.substr(0, i + 1);
        else
            idRelated = "";
    }
    for (i = 0; i < Component.all.length; i++) {
        var component = Component.all[i];
        if (!idRelated || !component.id.indexOf(idRelated)) {
            aComponents.push(component);
        }
    }
    return aComponents;
};

/**
 * Component.getComponentByID(id, idRelated)
 *
 * We could store components as properties of an 'all' object, using the component's ID,
 * and change this linear lookup into a property lookup, but some components may have no ID.
 *
 * @param {string} id of the desired component
 * @param {string} [idRelated] of related component
 * @return {Component|null}
 */
Component.getComponentByID = function(id, idRelated)
{
    if (id !== undefined) {
        var i;
        /*
         * If idRelated is provided, we check it for a machine prefix, and use any
         * existing prefix to constrain matches to IDs with the same prefix, in order to
         * avoid matching components belonging to other machines.
         */
        if (idRelated && (i = idRelated.indexOf('.')) > 0) {
            id = idRelated.substr(0, i + 1) + id;
        }
        for (i = 0; i < Component.all.length; i++) {
            if (Component.all[i].id === id) {
                return Component.all[i];
            }
        }
        Component.log('Component.getComponentByID("' + id + '"): no component found', "warning");
    }
    return null;
};

/**
 * Component.getComponentByType(sType, idRelated, componentPrev)
 *
 * @param {string} sType of the desired component
 * @param {string} [idRelated] of related component
 * @param {Component} [componentPrev] of previously returned component, if any
 * @return {Component|null}
 */
Component.getComponentByType = function(sType, idRelated, componentPrev)
{
    if (sType !== undefined) {
        var i;
        /*
         * If idRelated is provided, we check it for a machine prefix, and use any
         * existing prefix to constrain matches to IDs with the same prefix, in order to
         * avoid matching components belonging to other machines.
         */
        if (idRelated) {
            if ((i = idRelated.indexOf('.')) > 0) {
                idRelated = idRelated.substr(0, i + 1);
            } else {
                idRelated = "";
            }
        }
        for (i = 0; i < Component.all.length; i++) {
            if (componentPrev) {
                if (componentPrev == Component.all[i]) componentPrev = null;
                continue;
            }
            if (sType == Component.all[i].type && (!idRelated || !Component.all[i].id.indexOf(idRelated))) {
                return Component.all[i];
            }
        }
        Component.log('Component.getComponentByType("' + sType + '"): no component found', "warning");
    }
    return null;
};

/**
 * Component.getComponentParms(element)
 *
 * @param {Object} element from the DOM
 */
Component.getComponentParms = function(element)
{
    var parms = null,
        sParms = element.getAttribute("data-value");
    if (sParms) {
        try {
            parms = eval("({" + sParms + "})"); // jshint ignore:line
            /*
             * We can no longer invoke removeAttribute() because some components (eg, Panel) need
             * to run their initXXX() code more than once, to avoid initialization-order dependencies.
             *
             *      if (!DEBUG) {
             *          element.removeAttribute("data-value");
             *      }
             */
        } catch (e) {
            Component.error(e.message + " (" + sParms + ")");
        }
    }
    return parms;
};

/**
 * Component.bindExternalControl(component, sControl, sBinding, sType)
 *
 * @param {Component} component
 * @param {string} sControl
 * @param {string} sBinding
 * @param {string} [sType] is the external component type
 */
Component.bindExternalControl = function(component, sControl, sBinding, sType)
{
    if (sControl) {
        if (sType === undefined) sType = "Panel";
        var target = Component.getComponentByType(sType, component.id);
        if (target) {
            var eBinding = target.bindings[sControl];
            if (eBinding) {
                component.setBinding(null, null, sBinding, eBinding);
            }
        }
    }
};

/**
 * Component.bindComponentControls(component, element, sAppClass)
 *
 * @param {Component} component
 * @param {Object} element from the DOM
 * @param {string} sAppClass
 */
Component.bindComponentControls = function(component, element, sAppClass)
{
    var iControl, aeControls;
    aeControls = Component.getElementsByClass(element.parentNode, sAppClass + "-control");
    for (iControl = 0; iControl < aeControls.length; iControl++) {
        var iNode, aeChildNodes;
        aeChildNodes = aeControls[iControl].childNodes;
        for (iNode = 0; iNode < aeChildNodes.length; iNode++) {
            var control = aeChildNodes[iNode];
            if (control.nodeType !== window.document.ELEMENT_NODE) {
                continue;
            }
            var sClass = control.getAttribute("class");
            if (!sClass) continue;
            var iClass, aClasses;
            aClasses = sClass.split(" ");
            for (iClass = 0; iClass < aClasses.length; iClass++) {
                var parms;
                sClass = aClasses[iClass];
                switch (sClass) {
                    case sAppClass + "-input":
                    case sAppClass + "-output":
                        parms = Component.getComponentParms(control);
                        if (parms && parms['binding']) {
                            component.setBinding(sClass, parms['type'], parms['binding'], control);
                        } else {
                            Component.log('Component.bindComponentControls("' + component.toString() + '"): missing binding' + (parms? ' for ' + parms['type'] : ''), "warning");
                        }
                        aClasses = [];
                        break;
                    default:
                        // Component.log("Component.bindComponentControls(" + component.toString() + "): unrecognized control class \"" + sClass + "\"", "warning");
                        break;
                }
            }
        }
    }
};

/**
 * Component.getElementsByClass(element, sClass, sObjClass)
 *
 * This is a cross-browser helper function, since not all browser's support getElementsByClassName()
 *
 * TODO: This should probably be moved into weblib.js at some point, along with the control binding functions above,
 * to keep all the browser-related code together.
 *
 * @param {Object} element from the DOM
 * @param {string} sClass
 * @param {string} [sObjClass]
 * @return {Array|NodeList}
 */
Component.getElementsByClass = function(element, sClass, sObjClass)
{
    if (sObjClass) sClass += '-' + sObjClass + "-object";
    /*
     * Use the browser's built-in getElementsByClassName() if it appears to be available
     * (for example, it's not available in IE8, but it should be available in IE9 and up)
     */
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(sClass);
    }
    var i, j, ae = [];
    var aeAll = element.getElementsByTagName("*");
    var re = new RegExp('(^| )' + sClass + '( |$)');
    for (i = 0, j = aeAll.length; i < j; i++) {
        if (re.test(aeAll[i].className)) {
            ae.push(aeAll[i]);
        }
    }
    if (!ae.length) {
        Component.log('no elements of class "' + sClass + '" found');
    }
    return ae;
};

Component.prototype = {
    constructor: Component,
    /**
     * toString()
     *
     * @this {Component}
     * @return {string}
     */
    toString: function() {
        return (this.name? this.name : (this.id || this.type));
    },
    /**
     * getMachineNum()
     *
     * @this {Component}
     * @return {number} unique machine number
     */
    getMachineNum: function() {
        var nMachine = 1;
        if (this.idMachine) {
            var aDigits = this.idMachine.match(/\d+/);
            if (aDigits !== null)
                nMachine = parseInt(aDigits[0], 10);
        }
        return nMachine;
    },
    /**
     * setBinding(sHTMLClass, sHTMLType, sBinding, control)
     *
     * Component's setBinding() method is intended to be overridden by subclasses.
     *
     * @this {Component}
     * @param {string|null} sHTMLClass is the class of the HTML control (eg, "input", "output")
     * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding: function(sHTMLClass, sHTMLType, sBinding, control) {
        switch (sBinding) {
        case "clear":
            if (!this.bindings[sBinding]) {
                this.bindings[sBinding] = control;
                control.onclick = (function(component) {
                    return function clearPanel() {
                        if (component.bindings['print']) {
                            component.bindings['print'].value = "";
                        }
                    };
                }(this));
            }
            return true;
        case "print":
            if (!this.bindings[sBinding]) {
                this.bindings[sBinding] = control;
                /*
                 * HACK: Save this particular HTML element so that the Debugger can access it, too
                 */
                this.controlPrint = control;
                /*
                 * This was added for Firefox (Safari automatically clears the <textarea> on a page reload,
                 * but Firefox does not).
                 */
                control.value = "";
                this.println = (function(control) {
                    return function printPanel(s, type) {
                        s = (type !== undefined? (type + ": ") : "") + (s || "");
                        /*
                         * In COMPILED builds, prevent the <textarea> from getting too large;
                         * otherwise, printing becomes slower and slower.
                         */
                        if (COMPILED) {
                            if (control.value.length > 8192) {
                                control.value = control.value.substr(control.value.length - 4096);
                            }
                        }
                        control.value += s + "\n";
                        control.scrollTop = control.scrollHeight;
                        if (DEBUG) console.log(s);
                    };
                }(control));
                /**
                 * Override this.notice() with a replacement function that eliminates the web.alertUser() call
                 *
                 * @this {Component}
                 * @param {string} s
                 * @param {boolean} [fPrintOnly]
                 * @param {string} [id]
                 */
                this.notice = function noticePanel(s, fPrintOnly, id) {
                    this.println(s, "notice", id);
                };
            }
            return true;
        default:
            return false;
        }
    },
    /**
     * log(s, type)
     *
     * For diagnostic output only.
     *
     * WARNING: Even though this function's body is completely wrapped in DEBUG, that won't prevent the Closure Compiler
     * from including it, so all calls must still be prefixed with "if (DEBUG) ....".  For this reason, the class method,
     * Component.log(), is preferred, because the compiler IS smart enough to remove those calls.
     *
     * @this {Component}
     * @param {string} [s] is the message text
     * @param {string} [type] is the message type
     */
    log: function(s, type) {
        if (DEBUG) {
            Component.log(s, type || this.id || this.type);
        }
    },
    /**
     * println(s, type)
     *
     * For non-diagnostic messages, which components may override to control the destination/appearance of their output.
     *
     * Components using this.println() should wait until after their constructor has run to display any messages, because
     * if a Control Panel has been loaded, its override will not take effect until its own constructor has run.
     *
     * @this {Component}
     * @param {string} [s] is the message text
     * @param {string} [type] is the message type
     * @param {string} [id] is the caller's ID, if any
     */
    println: function(s, type, id) {
        Component.println(s, type, id || this.id);
    },
    /**
     * status(s)
     *
     * status() is like println() but it also includes information about the component (ie, the component ID),
     * which is why there is no corresponding Component.status() function.
     *
     * @param {string} s is the message text
     */
    status: function(s) {
        this.println(this.idComponent + ": " + s);
    },
    /**
     * notice(s, fPrintOnly)
     *
     * notice() is like println() but implies a need for user notification, so we alert() as well; however, if this.println()
     * is overridden, this.notice will be replaced with a similar override, on the assumption that the override is taking care
     * of alerting the user.
     *
     * @this {Component}
     * @param {string} s is the message text
     * @param {boolean} [fPrintOnly]
     * @param {string} [id] is the caller's ID, if any
     */
    notice: function(s, fPrintOnly, id) {
        Component.notice(s, fPrintOnly, id || this.id);
    },
    /**
     * setError(s)
     *
     * Set a fatal error condition
     *
     * @this {Component}
     * @param {string} s describes a fatal error condition
     */
    setError: function(s) {
        this.aFlags.fError = true;
        this.notice("Fatal error: " + s);
    },
    /**
     * clearError()
     *
     * Clear any fatal error condition
     *
     * @this {Component}
     */
    clearError: function() {
        this.aFlags.fError = false;
    },
    /**
     * isError()
     *
     * Report any fatal error condition
     *
     * @this {Component}
     * @return {boolean} true if a fatal error condition exists, false if not
     */
    isError: function() {
        if (this.aFlags.fError) {
            this.println(this.toString() + " error");
            return true;
        }
        return false;
    },
    /**
     * isReady(fnReady)
     *
     * Return the "ready" state of the component; if the component is not ready, it will queue the optional
     * notification function, otherwise it will immediately call the notification function, if any, without queuing it.
     *
     * NOTE: Since only the Computer component actually cares about the "readiness" of other components, the so-called
     * "queue" of notification functions supports exactly one function.  This keeps things nice and simple.
     *
     * @this {Component}
     * @param {function()} [fnReady]
     * @return {boolean} true if the component is in a "ready" state, false if not
     */
    isReady: function(fnReady) {
        if (fnReady) {
            if (this.aFlags.fReady) {
                fnReady();
            } else {
                if (DEBUG) this.log("NOT ready");
                this.fnReady = fnReady;
            }
        }
        return this.aFlags.fReady;
    },
    /**
     * setReady(fReady)
     *
     * Set the "ready" state of the component to true, and call any queued notification functions.
     *
     * @this {Component}
     * @param {boolean} [fReady] is assumed to indicate "ready" unless EXPLICITLY set to false
     */
    setReady: function(fReady) {
        if (!this.aFlags.fError) {
            this.aFlags.fReady = (fReady !== false);
            if (this.aFlags.fReady) {
                if (DEBUG || this.name) this.log("ready");
                var fnReady = this.fnReady;
                this.fnReady = null;
                if (fnReady) fnReady();
            }
        }
    },
    /**
     * isBusy(fCancel)
     *
     * Return the "busy" state of the component
     *
     * @this {Component}
     * @param {boolean} [fCancel] is set to true to cancel a "busy" state
     * @return {boolean} true if "busy", false if not
     */
    isBusy: function(fCancel) {
        if (this.aFlags.fBusy) {
            if (fCancel) {
                this.aFlags.fBusyCancel = true;
            } else if (fCancel === undefined) {
                this.println(this.toString() + " busy");
            }
        }
        return this.aFlags.fBusy;
    },
    /**
     * setBusy(fBusy)
     *
     * Update the current busy state; if an fCancel request is pending, it will be honored now.
     *
     * @this {Component}
     * @param {boolean} fBusy
     * @return {boolean}
     */
    setBusy: function(fBusy) {
        if (this.aFlags.fBusyCancel) {
            if (this.aFlags.fBusy) {
                this.aFlags.fBusy = false;
            }
            this.aFlags.fBusyCancel = false;
            return false;
        }
        if (this.aFlags.fError) {
            this.println(this.toString() + " error");
            return false;
        }
        this.aFlags.fBusy = fBusy;
        return this.aFlags.fBusy;
    },
    /**
     * powerUp(fSave)
     *
     * @this {Component}
     * @param {Object|null} data
     * @param {boolean} [fRepower] is true if this is "repower" notification
     * @return {boolean} true if successful, false if failure
     */
    powerUp: function(data, fRepower) {
        this.aFlags.fPowered = true;
        return true;
    },
    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {Component}
     * @param {boolean} fSave
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown: function(fSave, fShutdown) {
        if (fShutdown) this.aFlags.fPowered = false;
        return true;
    }
};

/*
 * TODO: What was this work-around for? I forget....
 */
if (window && !window.document.ELEMENT_NODE) window.document.ELEMENT_NODE = 1;

if (typeof module !== 'undefined') module.exports = Component;
