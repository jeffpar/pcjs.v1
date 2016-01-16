/**
 * @fileoverview This file implements the C1Pjs RAM component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jun-15
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
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
 * that loads or runs any version of this software (see C1PComputer.COPYRIGHT).
 *
 * Some C1Pjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * C1Pjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

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
 * @constructor
 * @extends Component
 */
function C1PRAM(parmsRAM)
{
    Component.call(this, "C1PRAM", parmsRAM);
}

Component.subclass(C1PRAM);

/**
 * @this {C1PRAM}
 * @param {Array} abMemory
 * @param {number} start
 * @param {number} end
 * @param {C1PCPU} cpu
 */
C1PRAM.prototype.setBuffer = function(abMemory, start, end, cpu)
{
    this.abMem = abMemory;
 // this.offRAM = start;
 // this.cbRAM = end - start + 1;
    this.setReady();
};

/**
 * C1PRAM.init()
 *
 * This function operates on every HTML element of class "ram", extracting the
 * JSON-encoded parameters for the C1PRAM constructor from the element's "data-value"
 * attribute, invoking the constructor to create a C1PRAM component, and then binding
 * any associated HTML controls to the new component.
 */
C1PRAM.init = function()
{
    var aeRAM = Component.getElementsByClass(window.document, C1PJSCLASS, "ram");
    for (var iRAM=0; iRAM < aeRAM.length; iRAM++) {
        var eRAM = aeRAM[iRAM];
        var parmsRAM = Component.getComponentParms(eRAM);
        var ram = new C1PRAM(parmsRAM);
        Component.bindComponentControls(ram, eRAM, C1PJSCLASS);
    }
};

/*
 * Initialize all the RAM modules on the page.
 */
web.onInit(C1PRAM.init);
