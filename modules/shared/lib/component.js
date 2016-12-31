/**
 * @fileoverview The Component class used by all PCjs components.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2017
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

/*
 * All the PCjs components now use JSDoc types, primarily so that Google's Closure Compiler will
 * compile everything with ZERO warnings.  For more information about the JSDoc types supported by
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
 * It's not that I'm trying to write "portable JavaScript", but some of this code was ported from C code I'd
 * written about 14 years earlier, and portability is good, so I'm not going to rewrite if there's no need.
 *
 * UPDATE: I've since switched to JSHint, which seems to have more reasonable defaults.
 */

"use strict";

/* global window: true, DEBUG: true */

if (NODE) {
    require("./defines");
    var usr = require("./usrlib");
    var web = require("./weblib");
}

/**
 * Component(type, parms, constructor, bitsMessage)
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
 *
 * @constructor
 * @param {string} type
 * @param {Object} [parms]
 * @param {Object} [constructor]
 * @param {number} [bitsMessage] selects message(s) that the component wants to enable (default is 0)
 */
function Component(type, parms, constructor, bitsMessage)
{
    this.type = type;

    if (!parms) parms = {'id': "", 'name': ""};

    this.id = parms['id'] || "";
    this.name = parms['name'];
    this.comment = parms['comment'];
    this.parms = parms;

    var i = this.id.indexOf('.');
    if (i < 0) {
        this.idComponent = this.id;
    } else {
        this.idMachine = this.id.substr(0, i);
        this.idComponent = this.id.substr(i + 1);
    }

    /*
     * Recording the constructor is really just a debugging aid, because many of our constructors
     * have class constants, but they're hard to find when the constructors are buried among all the
     * other globals.
     */
    this[type] = constructor;

    /*
     * Gather all the various component flags (booleans) into a single "flags" object, and encourage
     * subclasses to do the same, to reduce the property clutter we have to wade through while debugging.
     */
    this.flags = {
        ready:      false,
        busy:       false,
        busyCancel: false,
        powered:    false,
        error:      false
    };

    this.fnReady = null;
    this.clearError();
    this.bindings = {};
    this.dbg = null;                    // by default, no connection to a Debugger
    this.bitsMessage = bitsMessage || 0;

    /*
     * TODO: Consider adding another parameter to the Component() constructor that allows components to tell
     * us if they support single or multiple instances per machine.  For example, there can be multiple SerialPort
     * components per machine, but only one CPU component (well, OK, an FPU is also supported, but that's considered
     * a different component).
     *
     * It's not critical, but it would help catch machine configuration errors; for example, a machine that mistakenly
     * includes two CPU components may, aside from wasting memory, end up with odd side-effects, like unresponsive
     * CPU controls.
     */
    Component.add(this);
}

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
    if (window) {
        if (!p) throw new TypeError();
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
 * Component.subclass(subclass, superclass, methods, statics)
 *
 * See: Flanagan, David (2011-04-18). JavaScript: The Definitive Guide: The Definitive Guide (Kindle Locations 9854-9903). OReilly Media - A. Kindle Edition (Example 9-11)
 *
 * @param {Object} subclass is the constructor for the new subclass
 * @param {Object} [superclass] is the constructor of the superclass (default is Component)
 * @param {Object} [methods] contains all instance methods
 * @param {Object} [statics] contains all class properties and methods
 */
Component.subclass = function(subclass, superclass, methods, statics)
{
    if (!superclass) superclass = Component;
    subclass.prototype = Component.inherit(superclass.prototype);
    subclass.prototype.constructor = subclass;
    subclass.prototype.parent = superclass.prototype;
    if (methods) {
        Component.extend(subclass.prototype, methods);
    }
    if (statics) {
        Component.extend(subclass, statics);
    }
    return subclass;
};

/*
 * Every component created on the current page is recorded in this array (see Component.add()),
 * enabling any component to locate another component by ID (see Component.getComponentByID())
 * or by type (see Component.getComponentByType()).
 *
 * Every machine on the page are now recorded as well, by their machine ID.  We then record the
 * various resources used by that machine.
 */
if (window) {
    if (!window['PCjs']) window['PCjs'] = {};
    Component.machines = window['PCjs']['Machines'] || (window['PCjs']['Machines'] = {});
    Component.components = window['PCjs']['Components'] || (window['PCjs']['Components'] = []);
}
else {
    /*
     * Fallback for non-browser-based environments (ie, Node).  TODO: This will need to be
     * tailored to Node, probably using the global object instead of the window object, if we
     * ever want to support multi-machine configs in that environment.
     */
    Component.machines = {};
    Component.components = [];
}

/**
 * Component.add(component)
 *
 * @param {Component} component
 */
Component.add = function(component)
{
    /*
     * This just generates a lot of useless noise, handy in the early days, not so much these days....
     *
     *      if (DEBUG) Component.log("Component.add(" + component.type + "," + component.id + ")");
     */
    Component.components.push(component);
};

/**
 * Component.addMachine(idMachine)
 *
 * @param {string} idMachine
 */
Component.addMachine = function(idMachine)
{
    Component.machines[idMachine] = {};
};

/**
 * Component.addMachineResource(idMachine, sName, data)
 *
 * @param {string} idMachine
 * @param {string|null} sName (name of the resource)
 * @param {*} data
 */
Component.addMachineResource = function(idMachine, sName, data)
{
    /*
     * I used to assert(Component.machines[idMachine]), but when we're running as a Node app, embed.js is not used,
     * so addMachine() is never called, so resources do not need to be recorded.
     */
    if (Component.machines[idMachine] && sName) {
        Component.machines[idMachine][sName] = data;
    }
};

/**
 * Component.getMachineResources(idMachine)
 *
 * @param {string} idMachine
 * @return {Object|undefined}
 */
Component.getMachineResources = function(idMachine)
{
    return Component.machines[idMachine];
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
    if (!COMPILED) {
        if (s) {
            var sElapsed = "", sMsg = (type? (type + ": ") : "") + s;
            if (typeof usr != "undefined") {
                if (Component.msStart === undefined) {
                    Component.msStart = usr.getTime();
                }
                sElapsed = (usr.getTime() - Component.msStart) + "ms: ";
            }
            if (window && window.console) console.log(sElapsed + sMsg.replace(/\n/g, " "));
        }
    }
};

/**
 * Component.assert(f, s)
 *
 * Verifies conditions that must be true (for DEBUG builds only).
 *
 * The Closure Compiler should automatically remove all references to Component.assert() in non-DEBUG builds.
 * TODO: Add a task to the build process that "asserts" there are no instances of "assertion failure" in RELEASE builds.
 *
 * @param {boolean} f is the expression we are asserting to be true
 * @param {string} [s] is description of the assertion on failure
 */
Component.assert = function(f, s)
{
    if (DEBUG) {
        if (!f) {
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
    if (!COMPILED) {
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
    if (!COMPILED) {
        Component.println(s, "notice", id);
    }
    if (!fPrintOnly) web.alertUser((id? (id + ": ") : "") + s);
};

/**
 * Component.warning(s)
 *
 * @param {string} s describes the warning
 */
Component.warning = function(s)
{
    if (!COMPILED) {
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
    if (!COMPILED) {
        Component.println(s, "error");
    }
    web.alertUser(s);
};

/**
 * Component.getComponents(idRelated)
 *
 * We could store components as properties, using the component's ID, and change
 * this linear lookup into a property lookup, but some components may have no ID.
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
    for (i = 0; i < Component.components.length; i++) {
        var component = Component.components[i];
        if (!idRelated || !component.id.indexOf(idRelated)) {
            aComponents.push(component);
        }
    }
    return aComponents;
};

/**
 * Component.getComponentByID(id, idRelated)
 *
 * We could store components as properties, using the component's ID, and change
 * this linear lookup into a property lookup, but some components may have no ID.
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
        for (i = 0; i < Component.components.length; i++) {
            if (Component.components[i].id === id) {
                return Component.components[i];
            }
        }
        if (Component.components.length) {
            Component.log("Component ID '" + id + "' not found", "warning");
        }
    }
    return null;
};

/**
 * Component.getComponentByType(sType, idRelated, componentPrev)
 *
 * @param {string} sType of the desired component
 * @param {string} [idRelated] of related component
 * @param {Component|null} [componentPrev] of previously returned component, if any
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
        for (i = 0; i < Component.components.length; i++) {
            if (componentPrev) {
                if (componentPrev == Component.components[i]) componentPrev = null;
                continue;
            }
            if (sType == Component.components[i].type && (!idRelated || !Component.components[i].id.indexOf(idRelated))) {
                return Component.components[i];
            }
        }
        Component.log("Component type '" + sType + "' not found", "warning");
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
    var parms = null;
    var sParms = element.getAttribute("data-value");
    if (sParms) {
        try {
            parms = eval("(" + sParms + ")");   // jshint ignore:line
            /*
             * We can no longer invoke removeAttribute() because some components (eg, Panel) need
             * to run their initXXX() code more than once, to avoid initialization-order dependencies.
             *
             *      if (!DEBUG) {
             *          element.removeAttribute("data-value");
             *      }
             */
        } catch(e) {
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
                component.setBinding(null, sBinding, eBinding);
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
    var aeControls = Component.getElementsByClass(element.parentNode, sAppClass + "-control");

    for (var iControl = 0; iControl < aeControls.length; iControl++) {

        var aeChildNodes = aeControls[iControl].childNodes;

        for (var iNode = 0; iNode < aeChildNodes.length; iNode++) {
            var control = aeChildNodes[iNode];
            if (control.nodeType !== 1 /* document.ELEMENT_NODE */) {
                continue;
            }
            var sClass = control.getAttribute("class");
            if (!sClass) continue;
            var aClasses = sClass.split(" ");
            for (var iClass = 0; iClass < aClasses.length; iClass++) {
                var parms;
                sClass = aClasses[iClass];
                switch (sClass) {
                    case sAppClass + "-binding":
                        parms = Component.getComponentParms(control);
                        if (parms && parms['binding']) {
                            component.setBinding(parms['type'], parms['binding'], control, parms['value']);
                        } else if (!parms || parms['type'] != "description") {
                            Component.log("Component '" + component.toString() + "' missing binding" + (parms? " for " + parms['type'] : ""), "warning");
                        }
                        iClass = aClasses.length;
                        break;
                    default:
                        // if (DEBUG) Component.log("Component.bindComponentControls(" + component.toString() + "): unrecognized control class \"" + sClass + "\"", "warning");
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
        Component.log('No elements of class "' + sClass + '" found');
    }
    return ae;
};

Component.prototype = {
    constructor: Component,
    parent: null,
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
     * setBinding(sHTMLType, sBinding, control, sValue)
     *
     * Component's setBinding() method is intended to be overridden by subclasses.
     *
     * @this {Component}
     * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding: function(sHTMLType, sBinding, control, sValue) {
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
                         * Prevent the <textarea> from getting too large; otherwise, printing becomes slower and slower.
                         */
                        if (COMPILED) {
                            if (control.value.length > 8192) {
                                control.value = control.value.substr(control.value.length - 4096);
                            }
                        }
                        control.value += s + "\n";
                        control.scrollTop = control.scrollHeight;
                        if (!COMPILED && window && window.console) console.log(s);
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
                    this.println(s, this.idComponent);
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
        if (!COMPILED) {
            Component.log(s, type || this.id || this.type);
        }
    },
    /**
     * assert(f, s)
     *
     * Verifies conditions that must be true (for DEBUG builds only).
     *
     * WARNING: Make sure you preface all calls to this.assert() with "if (DEBUG)", because unlike Component.assert(),
     * the Closure Compiler can't be sure that this instance method hasn't been overridden, so it refuses to treat it as
     * dead code in non-DEBUG builds.
     *
     * TODO: Add a task to the build process that "asserts" there are no instances of "assertion failure" in RELEASE builds.
     *
     * @this {Component}
     * @param {boolean|number} f is the expression asserted to be true
     * @param {string} [s] is a description of the assertion to be displayed or logged on failure
     */
    assert: function(f, s) {
        if (DEBUG) {
            if (!f) {
                s = "assertion failure in " + (this.id || this.type) + (s? ": " + s : "");
                if (DEBUGGER && this.dbg) {
                    this.dbg.stopCPU();
                    /*
                     * Why do we throw an Error only to immediately catch and ignore it?  Simply to give
                     * any IDE the opportunity to inspect the application's state.  Even when the IDE has
                     * control, you should still be able to invoke Debugger commands from the IDE's REPL,
                     * using the '$' global function that the Debugger constructor defines; eg:
                     *
                     *      $('r')
                     *      $('dw 0:0')
                     *      $('h')
                     *      ...
                     *
                     * If you have no desire to stop on assertions, consider this a no-op.  However, another
                     * potential benefit of creating an Error object is that, for browsers like Chrome, we get
                     * a stack trace, too.
                     */
                    try {
                        throw new Error(s);
                    } catch(e) {
                        this.println(e.stack || e.message);
                    }
                    return;
                }
                this.log(s);
                throw new Error(s);
            }
        }
    },
    /**
     * println(s, type, id)
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
        Component.notice(s, fPrintOnly, id || this.type);
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
        this.flags.error = true;
        this.notice(s);         // TODO: Any cases where we should still prefix this string with "Fatal error: "?
    },
    /**
     * clearError()
     *
     * Clear any fatal error condition
     *
     * @this {Component}
     */
    clearError: function() {
        this.flags.error = false;
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
        if (this.flags.error) {
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
            if (this.flags.ready) {
                fnReady();
            } else {
                if (MAXDEBUG) this.log("NOT ready");
                this.fnReady = fnReady;
            }
        }
        return this.flags.ready;
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
        if (!this.flags.error) {
            this.flags.ready = (fReady !== false);
            if (this.flags.ready) {
                if (MAXDEBUG /* || this.name */) this.log("ready");
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
        if (this.flags.busy) {
            if (fCancel) {
                this.flags.busyCancel = true;
            } else if (fCancel === undefined) {
                this.println(this.toString() + " busy");
            }
        }
        return this.flags.busy;
    },
    /**
     * setBusy(fBusy)
     *
     * Update the current busy state; if a busyCancel request is pending, it will be honored now.
     *
     * @this {Component}
     * @param {boolean} fBusy
     * @return {boolean}
     */
    setBusy: function(fBusy) {
        if (this.flags.busyCancel) {
            this.flags.busy = false;
            this.flags.busyCancel = false;
            return false;
        }
        if (this.flags.error) {
            this.println(this.toString() + " error");
            return false;
        }
        this.flags.busy = fBusy;
        return this.flags.busy;
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
        this.flags.powered = true;
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
        if (fShutdown) this.flags.powered = false;
        return true;
    },
    /**
     * messageEnabled(bitsMessage)
     *
     * If bitsMessage is not specified, the component's MESSAGE category is used.
     *
     * @this {Component}
     * @param {number} [bitsMessage] is zero or more MESSAGE_* category flag(s)
     * @return {boolean} true if all specified message enabled, false if not
     */
    messageEnabled: function(bitsMessage) {
        if (DEBUGGER && this.dbg) {
            if (this === this.dbg) {
                bitsMessage |= 0;
            } else {
                bitsMessage = bitsMessage || this.bitsMessage;
            }
            var bitsEnabled = this.dbg.bitsMessage & bitsMessage;
            return (!!bitsMessage && bitsEnabled === bitsMessage || !!(bitsEnabled & this.dbg.bitsWarning));
        }
        return false;
    },
    /**
     * printMessage(sMessage, bitsMessage, fAddress)
     *
     * If bitsMessage is not specified, the component's MESSAGE category is used.
     * If bitsMessage is true, the message is displayed regardless.
     *
     * @this {Component}
     * @param {string} sMessage is any caller-defined message string
     * @param {number|boolean} [bitsMessage] is zero or more MESSAGE_* category flag(s)
     * @param {boolean} [fAddress] is true to display the current address
     */
    printMessage: function(sMessage, bitsMessage, fAddress) {
        if (DEBUGGER && this.dbg) {
            if (bitsMessage === true || this.messageEnabled(bitsMessage | 0)) {
                this.dbg.message(sMessage, fAddress);
            }
        }
    },
    /**
     * printMessageIO(port, bOut, addrFrom, name, bIn, bitsMessage)
     *
     * If bitsMessage is not specified, the component's MESSAGE category is used.
     * If bitsMessage is true, the message is displayed as long as MESSAGE.PORT is enabled.
     *
     * @this {Component}
     * @param {number} port
     * @param {number|null} bOut if an output operation
     * @param {number|null} [addrFrom]
     * @param {string|null} [name] of the port, if any
     * @param {number|null} [bIn] is the input value, if known, on an input operation
     * @param {number|boolean} [bitsMessage] is zero or more MESSAGE_* category flag(s)
     */
    printMessageIO: function(port, bOut, addrFrom, name, bIn, bitsMessage) {
        if (DEBUGGER && this.dbg) {
            if (bitsMessage === true) {
                bitsMessage = 0;
            } else if (bitsMessage == null) {
                bitsMessage = this.bitsMessage;
            }
            this.dbg.messageIO(this, port, bOut, addrFrom, name, bIn, bitsMessage);
        }
    }
};

/*
 * The following polyfills provide ES5 functionality that's missing in older browsers (eg, IE8),
 * allowing PCjs apps to run without slamming into exceptions; however, due to the lack of HTML5 canvas
 * support in those browsers, all you're likely to see are "soft" errors (eg, "Missing <canvas> support").
 *
 * Perhaps we can implement a text-only faux video display for a fun retro-browser experience someday.
 *
 * TODO: Come up with a better place to put these polyfills.  We will likely have more if we decide to
 * make the leap from ES5 to ES6 features.
 */

/*
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}

/*
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 */
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

/*
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function(obj) {
        if (typeof this != "function") {
            // Closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind: non-callable object");
        }
        var args = Array.prototype.slice.call(arguments, 1);
        var fToBind = this;
        var fnNOP = /** @constructor */ (function() {});
        var fnBound = function() {
            return fToBind.apply(this instanceof fnNOP && obj? this : obj, args.concat(Array.prototype.slice.call(arguments)));
        };
        fnNOP.prototype = this.prototype;
        fnBound.prototype = new fnNOP();
        return fnBound;
    };
}

if (NODE) module.exports = Component;
