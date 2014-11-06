/**
 * @fileoverview This file implements the C1Pjs Panel component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jun-19
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

"use strict";

/**
 * C1PPanel(parmsPanel)
 *
 * The Panel component has no required (parmsPanel) properties.
 *
 * @constructor
 * @extends Component
 */
function C1PPanel(parmsPanel)
{
    Component.call(this, "C1PPanel", parmsPanel);

    this.aFlags.fPowered = false;
}

Component.subclass(Component, C1PPanel);

/**
 * The Panel doesn't have any bindings of its own; it passes along all binding requests to
 * the Computer, CPU, Keyboard and Debugger components. The order shouldn't matter, since any
 * component that doesn't recognize the specified binding should simply ignore it.
 *
 * @this {C1PPanel}
 * @param {string|null} sHTMLClass is the class of the HTML control (eg, "input", "output")
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
C1PPanel.prototype.setBinding = function(sHTMLClass, sHTMLType, sBinding, control)
{
    if (this.cmp && this.cmp.setBinding(sHTMLClass, sHTMLType, sBinding, control)) return true;
    if (this.cpu && this.cpu.setBinding(sHTMLClass, sHTMLType, sBinding, control)) return true;
    if (this.kbd && this.kbd.setBinding(sHTMLClass, sHTMLType, sBinding, control)) return true;
    if (DEBUGGER && this.dbg && this.dbg.setBinding(sHTMLClass, sHTMLType, sBinding, control)) return true;
    return Component.prototype.setBinding.call(this, sHTMLClass, sHTMLType, sBinding, control);
};

/**
 * @this {C1PPanel}
 * @param {boolean} fOn
 * @param {C1PComputer} cmp
 */
C1PPanel.prototype.setPower = function(fOn, cmp)
{
    if (fOn && !this.aFlags.fPowered) {
        this.aFlags.fPowered = true;
        this.cmp = cmp;
        this.cpu = cmp.getComponentByType("cpu");
        this.kbd = cmp.getComponentByType("keyboard");
        if (DEBUGGER) this.dbg = cmp.getComponentByType("debugger");
        C1PPanel.init();
    }
};

/**
 * C1PPanel.init()
 *
 * This function operates on every element (e) of class "panel", and initializes
 * all the necessary HTML to construct the Panel module(s) as spec'ed.
 *
 * Note that each element (e) of class "panel" is expected to have a "data-value"
 * attribute containing the same JSON-encoded parameters that the Panel constructor
 * expects.
 *
 * NOTE: Unlike most other component init() functions, this one is designed to be
 * called multiple times: once at load time, so that we can binding our print()
 * function to the panel's output control ASAP, and again when the Computer component
 * is verifying that all components are ready and invoking their setPower() functions.
 *
 * Our setPower() method gives us a second opportunity to notify any components that
 * that might care (eg, CPU, Keyboard, and Debugger) that we have some controls they
 * might want to use.
 */
C1PPanel.init = function()
{
    var fReady = false;
    var aePanels = Component.getElementsByClass(window.document, C1PJSCLASS, "panel");
    for (var iPanel=0; iPanel < aePanels.length; iPanel++) {
        var ePanel = aePanels[iPanel];
        var parmsPanel = Component.getComponentParms(ePanel);
        var panel = Component.getComponentByID(parmsPanel['id']);
        if (!panel) {
            fReady = true;
            panel = new C1PPanel(parmsPanel);
        }
        Component.bindComponentControls(panel, ePanel, C1PJSCLASS);
        if (fReady) panel.setReady();
    }
};

/*
 * Initialize every Panel module on the page.
 */
web.onInit(C1PPanel.init);
