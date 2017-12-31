/**
 * @fileoverview This file implements the C1Pjs RAM component.
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
    var Web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
}

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class C1PRAM extends Component {
    /**
     * C1PRAM(parmsRAM)
     *
     * The RAM component expects the following (parmsRAM) properties:
     *
     *      size: amount of RAM, in bytes
     *
     * NOTE: We may make a note of the specified size, but we will not actually allocate
     * any memory for the RAM; we wait for the Computer object to tell us where our RAM is,
     * using the setBuffer() method.
     *
     * @this {C1PRAM}
     * @param {Object} parmsRAM
     */
    constructor(parmsRAM)
    {
        super("C1PRAM", parmsRAM);
    }

    /**
     * @this {C1PRAM}
     * @param {Array} abMemory
     * @param {number} start
     * @param {number} end
     * @param {C1PCPU} cpu
     */
    setBuffer(abMemory, start, end, cpu)
    {
        this.abMem = abMemory;
     // this.offRAM = start;
     // this.cbRAM = end - start + 1;
        this.setReady();
    }

    /**
     * C1PRAM.init()
     *
     * This function operates on every HTML element of class "ram", extracting the
     * JSON-encoded parameters for the C1PRAM constructor from the element's "data-value"
     * attribute, invoking the constructor to create a C1PRAM component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeRAM = Component.getElementsByClass(document, C1PJS.APPCLASS, "ram");
        for (var iRAM=0; iRAM < aeRAM.length; iRAM++) {
            var eRAM = aeRAM[iRAM];
            var parmsRAM = Component.getComponentParms(eRAM);
            var ram = new C1PRAM(parmsRAM);
            Component.bindComponentControls(ram, eRAM, C1PJS.APPCLASS);
        }
    }
}

/*
 * Initialize all the RAM modules on the page.
 */
Web.onInit(C1PRAM.init);
