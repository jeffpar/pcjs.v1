/**
 * @fileoverview Implements the PDP-11 Keyboard component.
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
    var Web = require("../../shared/lib/weblib");
    var Component = require("../../shared/lib/component");
    var PDP11 = require("./defines");
    var MessagesPDP11 = require("./messages");
}

class KeyboardPDP11 extends Component {
    /**
     * KeyboardPDP11(parmsKbd)
     *
     * @param {Object} parmsKbd
     */
    constructor(parmsKbd)
    {
        super("Keyboard", parmsKbd, MessagesPDP11.KEYBOARD);

        this.setReady();
    }

    /**
     * setBinding(sType, sBinding, control, sValue)
     *
     * @this {KeyboardPDP11}
     * @param {string|null} sType is the type of the HTML control (eg, "button", "textarea", "register", "flag", "rled", etc)
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "esc")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sType, sBinding, control, sValue)
    {
        return false;
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {KeyboardPDP11}
     * @param {ComputerPDP11} cmp
     * @param {BusPDP11} bus
     * @param {CPUStatePDP11} cpu
     * @param {DebuggerPDP11} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.cmp = cmp;
        this.cpu = cpu;
        this.dbg = dbg;         // NOTE: The "dbg" property must be set for the message functions to work
    }

    /**
     * KeyboardPDP11.init()
     *
     * This function operates on every HTML element of class "keyboard", extracting the
     * JSON-encoded parameters for the Keyboard constructor from the element's "data-value"
     * attribute, invoking the constructor to create a Keyboard component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeKbd = Component.getElementsByClass(document, PDP11.APPCLASS, "keyboard");
        for (var iKbd = 0; iKbd < aeKbd.length; iKbd++) {
            var eKbd = aeKbd[iKbd];
            var parmsKbd = Component.getComponentParms(eKbd);
            var kbd = new KeyboardPDP11(parmsKbd);
            Component.bindComponentControls(kbd, eKbd, PDP11.APPCLASS);
        }
    }
}

KeyboardPDP11.MINPRESSTIME = 100;            // 100ms

/*
 * Initialize every Keyboard module on the page.
 */
Web.onInit(KeyboardPDP11.init);

if (NODE) module.exports = KeyboardPDP11;
