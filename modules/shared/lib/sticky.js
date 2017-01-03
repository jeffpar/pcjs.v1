/**
 * @fileoverview Support for "sticky" machines
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
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

"use strict";

/**
 * addStickYMachine(idMachine)
 *
 * @param {string} idMachine
 */
function addStickyMachine(idMachine)
{
    var topMachine = -1;
    var prevOnScroll = window.onscroll;
    window.onscroll = function() {
        /*
         * TODO: Determine if/when we can cache the machine and machineSibling elements; we already
         * know we can't cache them when addStickyMachine() is first called, because that currently
         * happens *before* embed.js replaces the placeholder machine DIV with the *real* machine DIV.
         */
        var machine = document.getElementById(idMachine);
        if (machine) {
            var machineSibling = machine.nextElementSibling;
            if (machineSibling) {
                if (topMachine < 0) {
                    topMachine = findTop(machine);
                }
                if (window.pageYOffset <= topMachine) {
                    machine.style.position = 'relative';
                    machine.style.zIndex = 'auto';
                    machine.style.backgroundColor = '';
                    machine.style.paddingRight = 0;
                    if (machineSibling) machineSibling.style.paddingTop = 0;
                } else {
                    machine.style.position = 'fixed';
                    machine.style.zIndex = 1;
                    machine.style.backgroundColor = '#404040';
                    machine.style.paddingRight = '16px';
                    machine.style.top = 0;
                    if (machineSibling) machineSibling.style.paddingTop = machine.offsetHeight + 'px';
                }
                if (prevOnScroll) prevOnScroll();
            }
        }
    };
}

/**
 * findTop(obj)
 *
 * @param {Object} obj
 */
function findTop(obj)
{
    var curTop = 0;
    if (typeof obj.offsetParent != 'undefined' && obj.offsetParent) {
        while (obj.offsetParent) {
            curTop += obj.offsetTop;
            obj = obj.offsetParent;
        }
        curTop += obj.offsetTop;
    }
    else if (obj.y) {
        curTop += obj.y;
    }
    return curTop;
}
