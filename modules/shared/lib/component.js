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
 * All PCjs components now use JSDoc types, primarily so that Google's Closure Compiler will compile
 * everything with zero warnings when ADVANCED_OPTIMIZATIONS are enabled.  For more information about
 * the JSDoc types supported by the Closure Compiler:
 *
 *      https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 *
 * I also attempted to validate this code with JSLint, but it complained too much; eg, it didn't like
 * "while (true)", a tried and "true" programming convention for decades, and it wanted me to replace
 * all "++" and "--" operators with "+= 1" and "-= 1", use "(s || '')" instead of "(s? s : '')", etc.
 *
 * I prefer sticking with traditional C-style idioms, in part because they are more portable.  That
 * does NOT mean I'm trying to write "portable JavaScript," but some of this code was ported from C code
 * I'd written long ago, so portability is good, and I'm not going to throw that away if there's no need.
 *
 * UPDATE: I've since switched from JSLint to JSHint, which seems to have more reasonable defaults.
 * And for new code, I have adopted some popular JavaScript idioms, like "(s || '')", although the need
 * for those kinds of expressions will be reduced as I also start adopting some ES6 features, like
 * default parameters.
 */

"use strict";

/**
 * Since the Closure Compiler treats ES6 classes as @struct rather than @dict by default,
 * it deters us from defining named properties on our components; eg:
 *
 *      this['exports'] = {...}
 *
 * results in an error:
 *
 *      Cannot do '[]' access on a struct
 *
 * So, in order to define 'exports', we must override the @struct assumption by annotating
 * the class as @unrestricted (or @dict).  Note that this must be done both here and in the
 * subclass (eg, SerialPort), because otherwise the Compiler won't allow us to *reference*
 * the named property either.
 *
 * TODO: Consider marking ALL our classes unrestricted, because otherwise it forces us to
 * define every single property the class uses in its constructor, which results in a fair
 * bit of redundant initialization, since many properties aren't (and don't need to be) fully
 * initialized until the appropriate init(), reset(), restore(), etc. function is called.
 *
 * The upside, however, may be that since the structure of the class is completely defined by
 * the constructor, JavaScript engines may be able to optimize and run more efficiently.
 *
 * @unrestricted
 */
class Component {
    /**
     * Component(type, parms, bitsMessage)
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
     * Component subclasses will usually have additional (parms) properties.
     *
     * @param {string} type
     * @param {Object} [parms]
     * @param {number} [bitsMessage] selects message(s) that the component wants to enable (default is 0)
     */
    constructor(type, parms, bitsMessage)
    {
        this.type = type;

        if (!parms) parms = {'id': "", 'name': ""};

        this.id = parms['id'] || "";
        this.name = parms['name'];
        this.comment = parms['comment'];
        this.parms = parms;

        /*
         * The following Component properties need to be accessible by other machines and/or command scripts;
         * well, OK, or we could have exported some new functions to walk the contents of these properties, as we
         * did with findMachineComponent(), but this works just as well.
         *
         * Also, while the double-assignment looks silly (ie, using both dot and bracket property notation), it
         * resolves a complaint from the Closure Compiler, because if we use ONLY bracket notation here, then the
         * Compiler wants us to change all the other references to bracket notation as well.
         */
        this.exports = this['exports'] = {};
        this.bindings = this['bindings'] = {};

        var i = this.id.indexOf('.');
        if (i < 0) {
            this.idComponent = this.id;
        } else {
            this.idMachine = this.id.substr(0, i);
            this.idComponent = this.id.substr(i + 1);
        }

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
        this.bitsMessage = bitsMessage || 0;

        /** @type {Object|null} controlPrint is the HTML control, if any, that we can print to */
        this.controlPrint = null;

        this.cmp = null;
        this.bus = null;
        this.cpu = null;
        this.dbg = null;

        /*
         * TODO: Consider adding another parameter to the Component() constructor that allows components to tell
         * us if they support single or multiple instances per machine.  For example, there can be multiple SerialPort
         * components per machine, but only one CPU component (some machines also support an FPU, but that component
         * is considered separate from the CPU).
         *
         * It's not critical, but it would help catch machine configuration errors; for example, a machine that mistakenly
         * includes two CPU components may, aside from wasting memory, end up with odd side-effects, like unresponsive
         * CPU controls.
         */
        Component.add(this);
    }

    /**
     * Component.add(component)
     *
     * @param {Component} component
     */
    static add(component)
    {
        /*
         * This just generates a lot of useless noise, handy in the early days, not so much these days....
         *
         *      if (DEBUG) Component.log("Component.add(" + component.type + "," + component.id + ")");
         */
        Component.components.push(component);
    }

    /**
     * Component.addMachine(idMachine)
     *
     * @param {string} idMachine
     */
    static addMachine(idMachine)
    {
        Component.machines[idMachine] = {};
    }

    /**
     * Component.addMachineResource(idMachine, sName, data)
     *
     * @param {string} idMachine
     * @param {string|null} sName (name of the resource)
     * @param {*} data
     */
    static addMachineResource(idMachine, sName, data)
    {
        /*
         * I used to assert(Component.machines[idMachine]), but when we're running as a Node app, embed.js is not used,
         * so addMachine() is never called, so resources do not need to be recorded.
         */
        if (Component.machines[idMachine] && sName) {
            Component.machines[idMachine][sName] = data;
        }
    }

    /**
     * Component.getMachineResources(idMachine)
     *
     * @param {string} idMachine
     * @return {Object|undefined}
     */
    static getMachineResources(idMachine)
    {
        return Component.machines[idMachine];
    }

    /**
     * Component.getTime()
     *
     * @return {number} the current time, in milliseconds
     */
    static getTime()
    {
        return Date.now() || +new Date();
    }

    /**
     * Component.log(s, type)
     *
     * For diagnostic output only.
     *
     * @param {string} [s] is the message text
     * @param {string} [type] is the message type
     */
    static log(s, type)
    {
        if (!COMPILED) {
            if (s) {
                var sElapsed = "", sMsg = (type? (type + ": ") : "") + s;
                if (typeof Usr != "undefined") {
                    if (Component.msStart === undefined) {
                        Component.msStart = Component.getTime();
                    }
                    sElapsed = (Component.getTime() - Component.msStart) + "ms: ";
                }
                if (window && window.console) console.log(sElapsed + sMsg.replace(/\n/g, " "));
            }
        }
    }

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
    static assert(f, s)
    {
        if (DEBUG) {
            if (!f) {
                if (!s) s = "assertion failure";
                Component.log(s);
                throw new Error(s);
            }
        }
    }

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
    static println(s, type, id)
    {
        if (!COMPILED) {
            Component.log((id? (id + ": ") : "") + (s? ("\"" + s + "\"") : ""), type);
        }
    }

    /**
     * Component.notice(s, fPrintOnly, id)
     *
     * notice() is like println() but implies a need for user notification, so we alert() as well.
     *
     * @param {string} s is the message text
     * @param {boolean} [fPrintOnly]
     * @param {string} [id] is the caller's ID, if any
     */
    static notice(s, fPrintOnly, id)
    {
        if (!COMPILED) {
            Component.println(s, "notice", id);
        }
        if (!fPrintOnly) Component.alertUser((id? (id + ": ") : "") + s);
    }

    /**
     * Component.warning(s)
     *
     * @param {string} s describes the warning
     */
    static warning(s)
    {
        if (!COMPILED) {
            Component.println(s, "warning");
        }
        Component.alertUser(s);
    }

    /**
     * Component.error(s)
     *
     * @param {string} s describes the error; an alert() is displayed as well
     */
    static error(s)
    {
        if (!COMPILED) {
            Component.println(s, "error");
        }
        Component.alertUser(s);
    }

    /**
     * Component.alertUser(sMessage)
     *
     * @param {string} sMessage
     */
    static alertUser(sMessage)
    {
        if (window) {
            window.alert(sMessage);
        } else {
            Component.log(sMessage);
        }
    };

    /**
     * Component.confirmUser(sPrompt)
     *
     * @param {string} sPrompt
     * @returns {boolean} true if the user clicked OK, false if Cancel/Close
     */
    static confirmUser(sPrompt)
    {
        var fResponse = false;
        if (window) {
            fResponse = window.confirm(sPrompt);
        }
        return fResponse;
    }

    /**
     * Component.promptUser()
     *
     * @param {string} sPrompt
     * @param {string} [sDefault]
     * @returns {string|null}
     */
    static promptUser(sPrompt, sDefault)
    {
        var sResponse = null;
        if (window) {
            sResponse = window.prompt(sPrompt, sDefault === undefined? "" : sDefault);
        }
        return sResponse;
    }

    /**
     * Component.getComponents(idRelated)
     *
     * We could store components as properties, using the component's ID, and change
     * this linear lookup into a property lookup, but some components may have no ID.
     *
     * @param {string} [idRelated] of related component
     * @return {Array} of components
     */
    static getComponents(idRelated)
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
    }

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
    static getComponentByID(id, idRelated)
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
    }

    /**
     * Component.getComponentByType(sType, idRelated, componentPrev)
     *
     * @param {string} sType of the desired component
     * @param {string} [idRelated] of related component
     * @param {Component|null} [componentPrev] of previously returned component, if any
     * @return {Component|null}
     */
    static getComponentByType(sType, idRelated, componentPrev)
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
    }

    /**
     * Component.getComponentParms(element)
     *
     * @param {Object} element from the DOM
     */
    static getComponentParms(element)
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
    }

    /**
     * Component.bindExternalControl(component, sControl, sBinding, sType)
     *
     * @param {Component} component
     * @param {string} sControl
     * @param {string} sBinding
     * @param {string} [sType] is the external component type
     */
    static bindExternalControl(component, sControl, sBinding, sType)
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
    }

    /**
     * Component.bindComponentControls(component, element, sAppClass)
     *
     * @param {Component} component
     * @param {Object} element from the DOM
     * @param {string} sAppClass
     */
    static bindComponentControls(component, element, sAppClass)
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
    }

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
    static getElementsByClass(element, sClass, sObjClass)
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
    }

    /**
     * Component.getScriptCommands(sScript)
     *
     * This is a simple parser that breaks sScript into an array of commands, where each command
     * is an array of tokens, where tokens are sequences of characters separated by any of: tab, space,
     * carriage-return (CR), line-feed (LF), semicolon, single-quote, or double-quote;  if a quote is
     * used, all characters up to the next matching quote become part of the token, allowing any of the
     * other separators to be part of the token.  CR, LF and semicolon also serve to terminate a command,
     * with semicolon being preferred, because it's 1) more visible, and 2) essential when the entire
     * script is a multi-line string where all CR/LF were replaced by spaces (which is what Jekyll does,
     * and since we can't change Jekyll, it's what our own MarkDown Front Matter parser does as well;
     * see convertMD() in markout.js, where the aCommandDefs array is built).
     *
     * Backslash sequences like \n, \r, and \\ have already been converted to LF, CR and backslash
     * characters, since the entire script string is injected into a JavaScript function call, so any
     * backslash sequence that JavaScript supports is automatically converted:
     *
     *      \0  \'  \"  \\  \n  \r  \v  \t  \b  \f  \uXXXX \xXX
     *                      ^J  ^M  ^K  ^I  ^H  ^L
     *
     * To support any other non-printable 8-bit character, such as ESC, you should use \xXX, where XX
     * is the ASCII code in hex.  For ESC, that would \x1B.
     *
     * @param {string} sScript
     * @return {Array}
     */
    static getScriptCommands(sScript)
    {
        var cch = sScript.length;
        var aCommands = [], aTokens = [], sToken = "", chQuote = null;
        for (var i = 0; i < cch; i++) {
            var ch = sScript[i];
            if (ch == '"' || ch == "'") {
                if (chQuote && ch != chQuote) {
                    sToken += ch;
                    continue;
                }
                if (!chQuote) {
                    chQuote = ch;
                } else {
                    chQuote = null;
                }
                if (sToken) {
                    aTokens.push(sToken);
                    sToken = "";
                }
                continue;
            }
            if (!chQuote) {
                if (ch == '\r' || ch == '\n') {
                    ch = ';';
                }
                if (ch == ' ' || ch == '\t' || ch == ';') {
                    if (sToken) {
                        aTokens.push(sToken);
                        sToken = "";
                    }
                    if (ch == ';' && aTokens.length) {
                        aCommands.push(aTokens);
                        aTokens = [];
                    }
                    continue;
                }
            }
            sToken += ch;
        }
        if (sToken) {
            aTokens.push(sToken);
        }
        if (aTokens.length) {
            aCommands.push(aTokens);
        }
        return aCommands;
    }

    /**
     * Component.processScript(idMachine, sScript)
     *
     * @param {string} idMachine
     * @param {string} sScript
     * @return {boolean}
     */
    static processScript(idMachine, sScript)
    {
        var fSuccess = false;
        idMachine += ".machine";
        if (typeof sScript == "string" && !Component.commands[idMachine]) {
            fSuccess = true;
            Component.commands[idMachine] = Component.getScriptCommands(sScript);
            if (!Component.processCommands(idMachine)) {
                fSuccess = false;
            }
        }
        return fSuccess;
    }

    /**
     * Component.processCommands(idMachine)
     *
     * @param {string} idMachine
     * @return {boolean}
     */
    static processCommands(idMachine)
    {
        var fSuccess = true;
        var aCommands = Component.commands[idMachine];

     // var dbg = Component.getComponentByType("Debugger", idMachine);

        while (aCommands && aCommands.length) {

            var aTokens = aCommands.splice(0, 1)[0];
            var sCommand = aTokens[0];

            /*
             * It's possible to route this output to the Debugger window with dbg.println()
             * instead, but it's a bit too confusing mingling script output in a window that
             * already mingles Debugger and machine output.
             */
            Component.println('script: ' + aTokens.join(' '));

            var fnCallReady = null;
            if (Component.asyncCommands.indexOf(sCommand) >= 0) {
                fnCallReady = function processNextCommand() {
                    return function() {
                        Component.processCommands(idMachine);
                    }
                }();
            }

            var fnCommand = Component.globalCommands[sCommand];
            if (fnCommand) {
                if (!fnCallReady) {
                    fSuccess = fnCommand(aTokens[1], aTokens[2], aTokens[3]);
                } else {
                    if (!fnCommand(fnCallReady, aTokens[1], aTokens[2], aTokens[3])) break;
                }
            }
            else {
                fSuccess = false;
                var component = Component.getComponentByType(aTokens[1], idMachine);
                if (component) {
                    fnCommand = Component.componentCommands[sCommand];
                    if (fnCommand) {
                        fSuccess = fnCommand(component, aTokens[2], aTokens[3]);
                    }
                    else {
                        var exports = component['exports'];
                        if (exports) {
                            fnCommand = exports[sCommand];
                            if (fnCommand) {
                                fSuccess = true;
                                if (!fnCallReady) {
                                    fSuccess = fnCommand.call(component, aTokens[2], aTokens[3]);
                                } else {
                                    if (!fnCommand.call(component, fnCallReady, aTokens[2], aTokens[3])) break;
                                }
                            }
                        }
                    }
                }
            }

            if (!fSuccess) {
                Component.alertUser("Script error: " + sCommand + (fnCommand? " failed" : " unrecognized"));
                break;
            }
        }

        if (aCommands && !aCommands.length) {
            delete Component.commands[idMachine];
        }

        return fSuccess;
    }

    /**
     * Component.scriptAlert(sMessage)
     *
     * @param {string} sMessage
     * @return {boolean}
     */
    static scriptAlert(sMessage)
    {
        Component.alertUser(sMessage);
        return true;
    }

    /**
     * Component.scriptSelect(component, sBinding, sValue)
     *
     * @param {Component} component
     * @param {string} sBinding
     * @param {string} sValue
     * @return {boolean}
     */
    static scriptSelect(component, sBinding, sValue)
    {
        var fSuccess = false;
        var aBindings = component['bindings'];
        var control = aBindings[sBinding];
        if (control) {
            for (var i = 0; i < control.options.length; i++) {
                if (control.options[i].textContent == sValue) {
                    if (control.selectedIndex != i) {
                        control.selectedIndex = i;
                    }
                    fSuccess = true;
                    break;
                }
            }
        }
        return fSuccess;
    }

    /**
     * Component.scriptSleep(fnCallback, sDelay)
     *
     * @param {function()} fnCallback
     * @param {string} sDelay (in milliseconds)
     * @return {boolean}
     */
    static scriptSleep(fnCallback, sDelay)
    {
        setTimeout(fnCallback, +sDelay);
        return false;
    }

    /**
     * toString()
     *
     * @this {Component}
     * @return {string}
     */
    toString() {
        return (this.name? this.name : (this.id || this.type));
    }

    /**
     * getMachineNum()
     *
     * @this {Component}
     * @return {number} unique machine number
     */
    getMachineNum() {
        var nMachine = 1;
        if (this.idMachine) {
            var aDigits = this.idMachine.match(/\d+/);
            if (aDigits !== null)
                nMachine = parseInt(aDigits[0], 10);
        }
        return nMachine;
    }

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
    setBinding(sHTMLType, sBinding, control, sValue) {
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
                 * Override this.notice() with a replacement function that eliminates the Component.alertUser() call
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
    }

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
    log(s, type) {
        if (!COMPILED) {
            Component.log(s, type || this.id || this.type);
        }
    }

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
    assert(f, s) {
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
    }

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
    println(s, type, id) {
        Component.println(s, type, id || this.id);
    }

    /**
     * status(s)
     *
     * status() is like println() but it also includes information about the component (ie, the component ID),
     * which is why there is no corresponding Component.status() function.
     *
     * @param {string} s is the message text
     */
    status(s) {
        this.println(this.idComponent + ": " + s);
    }

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
    notice(s, fPrintOnly, id) {
        Component.notice(s, fPrintOnly, id || this.type);
    }

    /**
     * setError(s)
     *
     * Set a fatal error condition
     *
     * @this {Component}
     * @param {string} s describes a fatal error condition
     */
    setError(s) {
        this.flags.error = true;
        this.notice(s);         // TODO: Any cases where we should still prefix this string with "Fatal error: "?
    }

    /**
     * clearError()
     *
     * Clear any fatal error condition
     *
     * @this {Component}
     */
    clearError() {
        this.flags.error = false;
    }

    /**
     * isError()
     *
     * Report any fatal error condition
     *
     * @this {Component}
     * @return {boolean} true if a fatal error condition exists, false if not
     */
    isError() {
        if (this.flags.error) {
            this.println(this.toString() + " error");
            return true;
        }
        return false;
    }

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
    isReady(fnReady) {
        if (fnReady) {
            if (this.flags.ready) {
                fnReady();
            } else {
                if (MAXDEBUG) this.log("NOT ready");
                this.fnReady = fnReady;
            }
        }
        return this.flags.ready;
    }

    /**
     * setReady(fReady)
     *
     * Set the "ready" state of the component to true, and call any queued notification functions.
     *
     * @this {Component}
     * @param {boolean} [fReady] is assumed to indicate "ready" unless EXPLICITLY set to false
     */
    setReady(fReady) {
        if (!this.flags.error) {
            this.flags.ready = (fReady !== false);
            if (this.flags.ready) {
                if (MAXDEBUG /* || this.name */) this.log("ready");
                var fnReady = this.fnReady;
                this.fnReady = null;
                if (fnReady) fnReady();
            }
        }
    }

    /**
     * isBusy(fCancel)
     *
     * Return the "busy" state of the component
     *
     * @this {Component}
     * @param {boolean} [fCancel] is set to true to cancel a "busy" state
     * @return {boolean} true if "busy", false if not
     */
    isBusy(fCancel) {
        if (this.flags.busy) {
            if (fCancel) {
                this.flags.busyCancel = true;
            } else if (fCancel === undefined) {
                this.println(this.toString() + " busy");
            }
        }
        return this.flags.busy;
    }

    /**
     * setBusy(fBusy)
     *
     * Update the current busy state; if a busyCancel request is pending, it will be honored now.
     *
     * @this {Component}
     * @param {boolean} fBusy
     * @return {boolean}
     */
    setBusy(fBusy) {
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
    }

    /**
     * powerUp(fSave)
     *
     * @this {Component}
     * @param {Object|null} data
     * @param {boolean} [fRepower] is true if this is "repower" notification
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower) {
        this.flags.powered = true;
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {Component}
     * @param {boolean} fSave
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown(fSave, fShutdown) {
        if (fShutdown) this.flags.powered = false;
        return true;
    }

    /**
     * messageEnabled(bitsMessage)
     *
     * If bitsMessage is not specified, the component's MESSAGE category is used.
     *
     * @this {Component}
     * @param {number} [bitsMessage] is zero or more MESSAGE_* category flag(s)
     * @return {boolean} true if all specified message enabled, false if not
     */
    messageEnabled(bitsMessage) {
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
    }

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
    printMessage(sMessage, bitsMessage, fAddress) {
        if (DEBUGGER && this.dbg) {
            if (bitsMessage === true || this.messageEnabled(bitsMessage | 0)) {
                this.dbg.message(sMessage, fAddress);
            }
        }
    }

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
    printMessageIO(port, bOut, addrFrom, name, bIn, bitsMessage) {
        if (DEBUGGER && this.dbg) {
            if (bitsMessage === true) {
                bitsMessage = 0;
            } else if (bitsMessage == null) {
                bitsMessage = this.bitsMessage;
            }
            this.dbg.messageIO(this, port, bOut, addrFrom, name, bIn, bitsMessage);
        }
    }
}

/*
 * Every component created on the current page is recorded in this array (see Component.add()),
 * enabling any component to locate another component by ID (see Component.getComponentByID())
 * or by type (see Component.getComponentByType()).
 *
 * Every machine on the page are now recorded as well, by their machine ID.  We then record the
 * various resources used by that machine.
 *
 * Includes a fallback for non-browser-based environments (ie, Node).  TODO: This will need to be
 * tailored to Node, probably using the global object instead of the window object, if we ever want
 * to support multi-machine configs in that environment.
 */
if (window) {
    if (!window['PCjs']) window['PCjs'] = {};
    if (!window['PCjs']['Machines']) window['PCjs']['Machines'] = {};
    if (!window['PCjs']['Components']) window['PCjs']['Components'] = [];
    if (!window['PCjs']['Commands']) window['PCjs']['Commands'] = {};
}
Component.machines = window? window['PCjs']['Machines'] : {};
Component.components = window? window['PCjs']['Components'] : [];
Component.commands = window? window['PCjs']['Commands'] : {};

Component.asyncCommands = [
    'hold', 'sleep', 'wait'
];
Component.globalCommands = {
    'alert': Component.scriptAlert,
    'sleep': Component.scriptSleep
};
Component.componentCommands = {
    'select':   Component.scriptSelect
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
