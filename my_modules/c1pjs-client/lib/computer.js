/**
 * @fileoverview This file implements the C1Pjs Computer component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2012-Jun-15
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of C1Pjs, which is part of the JavaScript Machines Project (aka JSMachines)
 * at <http://jsmachines.net/> and <http://pcjs.org/>.
 *
 * C1Pjs is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * C1Pjs is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with C1Pjs.  If not,
 * see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some C1Pjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * C1Pjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

/*
 * BUILD INSTRUCTIONS
 *
 * To build C1Pjs (c1p.js), run Google's Closure Compiler, replacing "*.js" with
 * the input file sequence defined by the "c1pJSFiles" property in package.json:
 *
 *      java -jar compiler.jar
 *          --compilation_level ADVANCED_OPTIMIZATIONS
 *          --define='DEBUG=false'
 *          --warning_level=VERBOSE
 *          --js *.js
 *          --js_output_file c1p.js
 *
 * Google's Closure Compiler (compiler.jar) is documented at
 * https://developers.google.com/closure/compiler/ and is available
 * for download here:
 *
 *      http://closure-compiler.googlecode.com/files/compiler-latest.zip
 *
 * The C1Pjs JavaScript files do have some initialization-order dependencies.
 * If you load the files individually, it's recommended that you load them in
 * the same order that they're compiled (see above).
 * 
 * Generally speaking, component.js should be first, computer.js should be
 * last (of the files based on component.js), and panel.js should be listed
 * early so that the Control Panel is ready as soon as possible.
 */

"use strict";

/**
 * C1PComputer(parmsComputer, modules)
 *
 * The C1PComputer component expects the following (parmsComputer) properties:
 *
 *      modules[{}] (from the <module> definition(s) for the computer)
 *
 * This component processes all the <module> "start" and "end" specifications
 * and "wires" everything to a common "address buffer"; namely, the abMemory array.
 * abMemory encompasses the computer's entire address space, but every component must
 * play nice and use only its assigned section of abMemory -- and pretend it's an array
 * of bytes, when in fact it's an array of floating-point values (the only primitive
 * numeric data type that JavaScript provides).
 *  
 * This component also insures that all the other components are ready; in particular,
 * this means that the ROM and Video components have finished loading their resources
 * and are ready for operation.  Other components become ready as soon as we call their
 * setBuffer() method (eg, CPU, RAM, Keyboard, Debugger, SerialPort, DiskController), and
 * others, like Panel, become ready even earlier, at the end of their initialization.
 *  
 * Once every component has indicated it's ready, we call its setPower() notification
 * function (if it has one; it's optional).  We call the CPU's setPower() function last,
 * so that the CPU is assured that all other components are ready and "powered".
 *
 * @constructor
 * @extends Component
 */
function C1PComputer(parmsComputer, modules)
{
    Component.call(this, "C1PComputer", parmsComputer);
    
    this.modules = modules;
}

C1PComputer.sAppName = APPNAME || "C1Pjs";
C1PComputer.sAppVer = APPVERSION;
C1PComputer.sCopyright = "Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>";

Component.subclass(Component, C1PComputer);

/**
 * @this {C1PComputer}
 * @param {boolean} [fPowerOn] is true to indicate that we should start the CPU running
 */
C1PComputer.prototype.reset = function(fPowerOn)
{
    var cpu = null;
    for (var sType in this.modules) {
        for (var i=0; i < this.modules[sType].length; i++) {
            var component = this.modules[sType][i];
            if (component && component.reset) {
                if (DEBUG) this.println("resetting " + sType);
                component.reset();
                if (sType == "cpu") cpu = component;
            }
        }
    }
    if (cpu) {
        cpu.update();
        if (fPowerOn) cpu.run();
    }
};

/**
 * @this {C1PComputer}
 * 
 * Called by the CPU to notify all component start() handlers
 */
C1PComputer.prototype.start = function()
{
    for (var sType in this.modules) {
        if (sType == "cpu") continue;
        for (var i=0; i < this.modules[sType].length; i++) {
            var component = this.modules[sType][i];
            if (component && component.start) {
                component.start();
            }
        }
    }
};

/**
 * @this {C1PComputer}
 * @param {number} msStart
 * @param {number} nCycles
 * 
 * Called by the CPU to notify all component stop() handlers
 */
C1PComputer.prototype.stop = function(msStart, nCycles)
{
    for (var sType in this.modules) {
        if (sType == "cpu") continue;
        for (var i=0; i < this.modules[sType].length; i++) {
            var component = this.modules[sType][i];
            if (component && component.stop) {
                component.stop(msStart, nCycles);
            }
        }
    }
};

/**
 * @this {C1PComputer}
 * @param {string|null} c is the class of the HTML control (eg, "input", "output")
 * @param {string|null} t is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea")
 * @param {string} s is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
 * @param {Object} e is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
C1PComputer.prototype.setBinding = function(c, t, s, e)
{
    switch(s) {
    case "reset":
        this.bindings[s] = e;
        e.onclick = function(computer) {
            return function() {
                computer.reset();
            };
        }(this);
        return true;
    default:
        break;
    }
    return false;
};

/**
 * @this {C1PComputer}
 * @param {string} sType
 * @return {Component}
 * 
 * NOTE: If there are multiple components for a given type, we may need to provide a means of discriminating.
 */
C1PComputer.prototype.getComponentByType = function(sType)
{
    if (this.modules[sType]) {
        return this.modules[sType][0];
    }
    return null;
};

C1PComputer.power = function(computer)
{
    /*
     * Insure that the ROMs, Video and CPU are all ready before "powering" everything; always "power"
     * the CPU last, to make sure it doesn't start asking other components to do things before they're ready.
     */
    var cpu = null;
    for (var sType in computer.modules) {
        for (var i=0; i < computer.modules[sType].length; i++) {
            var component = computer.modules[sType][i];
            if (!component) continue;
            if (!component.isReady()) {
                component.isReady(function(computer) {
                    return function() {
                        C1PComputer.power(computer);
                    };
                }(computer));   // jshint ignore:line
                return;
            }
            /*
             * The CPU component's setPower() notification handler is a special case: we don't want
             * to call it until the end (below), after all others have been called.
             */
            if (sType == "cpu")
                cpu = component;
            else if (component.setPower) {
                component.setPower(true, computer);
            }
        }
    }
    
    /*
     * The entire computer is finally ready; we call our own setReady() for completeness, not because any
     * other component actually cares when we're ready.
     */ 
    computer.setReady();

    computer.println(C1PComputer.sAppName + " v" + C1PComputer.sAppVer + "\n" + C1PComputer.sCopyright);

    /*
     * Once we get to this point, we're guaranteed that all components are ready, so it's safe to "power" the CPU;
     * setPower() includes an automatic reset(fPowerOn), so the CPU should begin executing immediately, unless a debugger
     * is attached.
     */
    if (cpu) cpu.setPower(true, computer);
};

/*
 *  C1PComputer.init()
 *
 *  This function operates on every element (e) of class "computer", and initializes
 *  all the necessary HTML to construct the C1PComputer(s) as spec'ed.
 *
 *  Note that each element (e) of class "computer" is expected to have a "data-value"
 *  attribute containing the same JSON-encoded parameters that the C1PComputer constructor
 *  expects.
 */
C1PComputer.init = function()
{
    var aeComputers = Component.getElementsByClass(window.document, C1PJSCLASS, "computer");

    for (var iComputer=0; iComputer < aeComputers.length; iComputer++) {

        var eComputer = aeComputers[iComputer];
        var parmsComputer = Component.getComponentParms(eComputer);

        var component;
        var modules = {};

        /*
         * Let's see if the Control Panel is installed (NOTE: its ID must be "panel", and only one per machine is supported); 
         * the Panel needs our setPower() notifications, and this relieves us from having an explicit <module> entry for type="panel". 
         */
        var panel = Component.getComponentByID('panel', parmsComputer['id']);
        if (panel) {
            modules['panel'] = [panel];
            /*
             * Iterate through all the other components and update their print methods if the Control Panel has provided overrides.
             */
            if (panel.controlPrint) {
                var aComponents = Component.getComponents(parmsComputer['id']);
                for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
                    component = aComponents[iComponent];
                    if (component == panel) continue;
                    component.notice = panel.notice;
                    component.println = panel.println;
                    component.controlPrint = panel.controlPrint;
                }
            }
        }

        var abMemory;
        var addrStart = 0, addrEnd = 0;
        
        for (var iAddr=0; iAddr < parmsComputer['modules'].length; iAddr++) {
            var addrInfo = parmsComputer['modules'][iAddr];
            /*
             * The first address range (ie, the CPU range) must specify the range for the entire
             * address space (abMemory), which we allocate and zero-initialize.
             * 
             * NOTE: We might consider doing what the Video component does on first reset: initializing
             * the entire memory buffer to random values.  However, a constant (eg, 0xA5) might be
             * more useful, acting as a crude indicator of memory the client code hasn't written yet.
             */
            if (!iAddr) {
                if (addrInfo['type'] != "cpu") break;
                addrStart = addrInfo['start'];
                addrEnd = addrInfo['end'];
                abMemory = new Array(addrEnd+1 - addrStart);
                for (var addr=addrStart; addr < abMemory.length; addr++) {
                    abMemory[addr] = 0;
                }
            }
            component = Component.getComponentByID(addrInfo['refID'], parmsComputer['id']);
            if (component) {
                var sType = addrInfo['type'];
                if (modules[sType] === undefined)
                    modules[sType] = [];
                modules[sType].push(component);
                if (component.setBuffer && addrInfo['start'] !== undefined) {
                    component.setBuffer(abMemory, addrInfo['start'], addrInfo['end'], modules['cpu'][0]);
                }
            }
            else {
                Component.error("no component for <module refid=\"" + addrInfo['refID'] + "\">");
                return;
            }
        }
        
        if (abMemory === undefined) {
            Component.error("<module type=\"cpu\"> definition must appear first in the <computer> specification");
            return;
        }

        /*
         * Let's see if the Debugger is installed (NOTE: its ID must be "debugger", and only one per machine is supported);
         * the Debugger needs our setBuffer(), setPower() and reset() notifications, and this relieves us from having an explicit
         * <module> entry for type="debugger". 
         */
        component = Component.getComponentByID('debugger', parmsComputer['id']);
        if (component) {
            modules['debugger'] = [component];
            if (component.setBuffer) {
                component.setBuffer(abMemory, addrStart, addrEnd, modules['cpu'][0]);
            }
        }
        
        var computer = new C1PComputer(parmsComputer, modules);
        /*
         *  We may eventually add a "Power" button, but for now, all we have is a "Reset" button
         */
        Component.bindComponentControls(computer, eComputer, C1PJSCLASS);
        /*
         * "Power" the computer automatically
         */
        C1PComputer.power(computer);
    }
};

/*
 * Initialize every Computer on the page.
 */
web.onInit(C1PComputer.init);
