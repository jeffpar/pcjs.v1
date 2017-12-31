/**
 * @fileoverview Support for "sticky" machines and commands that drive them.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
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

/**
 * addStickyMachine(idMachine, sPosition)
 *
 * If a machine is defined with a 'sticky' property, then the page containing that machine should
 * also contain a call this function.  Technically, the 'sticky' property's value should also be passed
 * via sPosition, but since the only page position we currently support is "top", callers are currently
 * omitting it, and "top" is simply assumed.
 *
 * TODO: Do something intelligent if sPosition is NOT omitted and is NOT "top".
 *
 * @param {string} idMachine
 * @param {string} [sPosition] (if omitted, "top" is assumed)
 */
function addStickyMachine(idMachine, sPosition)
{
    var topMachine = -1;
    var prevOnScroll = window.onscroll;
    window.onscroll = function() {
        /*
         * TODO: Determine if/when we can cache the machine and machineSibling elements; we already
         * know we can't cache them when addStickyMachine() is first called, because that currently
         * happens before embed.js replaces the placeholder machine <div> with the real machine <div>.
         *
         * Placement of the addStickyMachine() call is irrelevant, because embed.js asynchronously
         * reads all the XML files that define the machine *before* replacing the <div>.
         */
        var machine = document.getElementById(idMachine);
        if (machine) {
            var machineSibling = machine.nextElementSibling;
            if (machineSibling) {
                if (topMachine < 0) {
                    topMachine = findTop(machine);
                }
                /*
                 * There was a problem with this code on iOS devices using mobile Safari: when the page is
                 * scrolled and the class of the machine <div> is changed the FIRST time from 'machine-floating'
                 * to 'machine-sticky', the entire <div> -- with the exception of the canvas inside it -- disappears
                 * until you lift your finger or the scrolling stops.
                 *
                 * The fix, according to http://stackoverflow.com/questions/32875046/ios-9-safari-changing-an-element-to-fixed-position-while-scrolling-wont-paint,
                 * is to add a "transform: translateZ(0)", or alternatively "transform: translate3d(0px,0px,0px)",
                 * to the machine <div> first.  Note that before I added that, the problem also seemed to be exacerbated
                 * by my attempt to remove any pre-existing 'machine-floating' or 'machine-sticky' class separately, which
                 * is why I now have redundant replace() calls below, updating the style in one step instead of two.
                 */
                machine.style.transform = "translateZ(0)";
                if (window.pageYOffset <= topMachine) {
                    if (machineSibling) machineSibling.style.paddingTop = 0;
                    machine.className = 'machine-floating ' + machine.className.replace(/machine-(floating|sticky) /g, '');
                } else {
                    if (machineSibling) machineSibling.style.paddingTop = (machine.offsetHeight + 8) + 'px';
                    machine.className = 'machine-sticky ' + machine.className.replace(/machine-(floating|sticky) /g, '');
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
