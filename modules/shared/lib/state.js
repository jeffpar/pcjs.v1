/**
 * @fileoverview The State class used by PCjs machines.
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
}

class State {
    /**
     * State(component, sVersion, sSuffix)
     *
     * State objects are used by components to save/restore their state.
     *
     * During a save operation, components add data to a State object via set(), and then return
     * the resulting data using data().
     *
     * During a restore operation, the Computer component passes the results of each data() call
     * back to the originating component.
     *
     * WARNING: Since State objects are low-level objects that have no UI requirements, they do not
     * inherit from the Component class, so you should only use class methods of Component, such as
     * Component.assert() (or Debugger methods if the Debugger is available).
     *
     * NOTE: 1.01 is the first version to provide limited save/restore support using localStorage.
     * From that point on, care must be taken to insure that any new version that's incompatible with
     * previous localStorage data be released with a version number that is at least 1 greater,
     * since we're tagging the localStorage data with the integer portion of the version string.
     *
     * @param {Component} component
     * @param {string} [sVersion] is used to append a major version number to the key
     * @param {string} [sSuffix] is used to append any additional suffixes to the key
     */
    constructor(component, sVersion, sSuffix)
    {
        this.id = component.id;
        this.dbg = component.dbg;
        this.json = "";
        this.state = {};
        this.fLoaded = this.fParsed = false;
        this.key = State.key(component, sVersion, sSuffix);
        this.unload(component.parms);
    }

    /**
     * set(id, data)
     *
     * @this {State}
     * @param {number|string} id
     * @param {Object|string} data
     */
    set(id, data)
    {
        try {
            this.state[id] = data;
        } catch(e) {
            Component.log(e.message);
        }
    }

    /**
     * get(id)
     *
     * @this {State}
     * @param {number|string} id
     * @return {Object|string|null}
     */
    get(id)
    {
        return this.state[id] || null;
    }

    /**
     * data()
     *
     * @this {State}
     * @return {Object}
     */
    data()
    {
        return this.state;
    }

    /**
     * load(json)
     *
     * WARNING: Make sure you follow this call with either a call to parse() or unload(),
     * because any stringified data that we've loaded isn't usable until it's been parsed.
     *
     * @this {State}
     * @param {string|null} [json]
     * @return {boolean} true if state exists in localStorage, false if not
     */
    load(json)
    {
        if (json) {
            this.json = json;
            this.fLoaded = true;
            this.fParsed = false;
            return true;
        }
        if (this.fLoaded) {
            /*
             * This is assumed to be a redundant load().
             */
            return true;
        }
        if (Web.hasLocalStorage()) {
            var s = Web.getLocalStorageItem(this.key);
            if (s) {
                this.json = s;
                this.fLoaded = true;
                if (DEBUG) Component.log("localStorage(" + this.key + "): " + s.length + " bytes loaded");
                return true;
            }
        }
        return false;
    }

    /**
     * parse()
     *
     * This completes the load() operation, by parsing what was loaded, on the assumption there
     * might be some benefit to deferring parsing until we've given the user a chance to confirm.
     * Otherwise, load() could have just as easily done this, too.
     *
     * @this {State}
     * @return {boolean} true if successful, false if error
     */
    parse()
    {
        var fSuccess = true;
        if (!this.fParsed) {
            try {
                this.state = JSON.parse(this.json);
                this.fParsed = true;
            } catch (e) {
                Component.error(e.message || e);
                fSuccess = false;
            }
        }
        return fSuccess;
    }

    /**
     * store()
     *
     * @this {State}
     * @return {boolean} true if successful, false if error
     */
    store()
    {
        var fSuccess = true;
        if (Web.hasLocalStorage()) {
            var s = JSON.stringify(this.state);
            if (Web.setLocalStorageItem(this.key, s)) {
                if (DEBUG) Component.log("localStorage(" + this.key + "): " + s.length + " bytes stored");
            } else {
                /*
                 * WARNING: Because browsers tend to disable all alerts() during an "unload" operation,
                 * it's unlikely anyone will ever see the "quota" errors that occur at this point.  Need to
                 * think of some way to notify the user that there's a problem, and offer a way of cleaning
                 * up old states.
                 */
                Component.error("Unable to store " + s.length + " bytes in browser local storage");
                fSuccess = false;
            }
        }
        return fSuccess;
    }

    /**
     * toString()
     *
     * @this {State}
     * @return {string} JSON-encoded state
     */
    toString()
    {
        return this.state? JSON.stringify(this.state) : this.json;
    }

    /**
     * unload(parms)
     *
     * This discards any data saved via set() or loaded via load(), creating an empty State object.
     * Note that you have to follow this call with an explicit call to store() if you want to remove
     * the state from localStorage as well.
     *
     * @this {State}
     * @param {Object} [parms]
     */
    unload(parms)
    {
        this.json = "";
        this.state = {};
        this.fLoaded = this.fParsed = false;
        if (parms) this.set("parms", parms);
    }

    /**
     * clear(fAll)
     *
     * This unloads the current state, and then clears ALL localStorage for the current machine,
     * independent of version, to reduce the chance of orphaned states wasting part of our limited allocation.
     *
     * @this {State}
     * @param {boolean} [fAll] true to unconditionally clear ALL localStorage for the current domain
     */
    clear(fAll)
    {
        this.unload();
        var aKeys = Web.getLocalStorageKeys();
        for (var i = 0; i < aKeys.length; i++) {
            var sKey = aKeys[i];
            if (sKey && (fAll || sKey.substr(0, this.key.length) == this.key)) {
                Web.removeLocalStorageItem(sKey);
                if (DEBUG) Component.log("localStorage(" + sKey + ") removed");
                aKeys.splice(i, 1);
                i = 0;
            }
        }
    }

    /**
     * State.key(component, sVersion, sSuffix)
     *
     * This encapsulates the key generation code.
     *
     * @param {Component} component
     * @param {string} [sVersion] is used to append a major version number to the key
     * @param {string} [sSuffix] is used to append any additional suffixes to the key
     * @return {string} key
     */
    static key(component, sVersion, sSuffix)
    {
        var key = component.id;
        if (sVersion) {
            var i = sVersion.indexOf('.');
            if (i > 0) key += ".v" + sVersion.substr(0, i);
        }
        if (sSuffix) {
            key += "." + sSuffix;
        }
        return key;
    }

    /**
     * State.compress(aSrc)
     *
     * @param {Array.<number>|null} aSrc
     * @return {Array.<number>|null} is either the original array (aSrc), or a smaller array of "count, value" pairs (aComp)
     */
    static compress(aSrc)
    {
        if (aSrc) {
            var iSrc = 0;
            var iComp = 0;
            var aComp = [];
            while (iSrc < aSrc.length) {
                var n = aSrc[iSrc];
                Component.assert(n !== undefined);
                var iCompare = iSrc + 1;
                while (iCompare < aSrc.length && aSrc[iCompare] === n) iCompare++;
                aComp[iComp++] = iCompare - iSrc;
                aComp[iComp++] = n;
                iSrc = iCompare;
            }
            if (aComp.length < aSrc.length) return aComp;
        }
        return aSrc;
    }

    /**
     * State.decompress(aComp)
     *
     * @param {Array.<number>} aComp
     * @param {number} nLength is expected length of decompressed data
     * @return {Array.<number>}
     */
    static decompress(aComp, nLength)
    {
        var iDst = 0;
        var aDst = new Array(nLength);
        var iComp = 0;
        while (iComp < aComp.length - 1) {
            var c = aComp[iComp++];
            var n = aComp[iComp++];
            while (c--) {
                aDst[iDst++] = n;
            }
        }
        Component.assert(aDst.length == nLength);
        return aDst;
    }

    /**
     * State.compressEvenOdd(aSrc)
     *
     * This is a very simple variation on compress() that compresses all the EVEN elements of aSrc first,
     * followed by all the ODD elements.  This tends to work better on EGA video memory, because when odd/even
     * addressing is enabled (eg, for text modes), the DWORD values tend to alternate, which is the worst case
     * for compress(), but the best case for compressEvenOdd().
     *
     * One wrinkle we support: if the first element is uninitialized, then we assume the entire array is undefined,
     * and return an empty compressed array.  Conversely, decompressEvenOdd() will take an empty compressed array
     * and return an uninitialized array.
     *
     * @param {Array.<number>|null} aSrc
     * @return {Array.<number>|null} is either the original array (aSrc), or a smaller array of "count, value" pairs (aComp)
     */
    static compressEvenOdd(aSrc)
    {
        if (aSrc) {
            var iComp = 0, aComp = [];
            if (aSrc[0] !== undefined) {
                for (var off = 0; off < 2; off++) {
                    var iSrc = off;
                    while (iSrc < aSrc.length) {
                        var n = aSrc[iSrc];
                        var iCompare = iSrc + 2;
                        while (iCompare < aSrc.length && aSrc[iCompare] === n) iCompare += 2;
                        aComp[iComp++] = (iCompare - iSrc) >> 1;
                        aComp[iComp++] = n;
                        iSrc = iCompare;
                    }
                }
            }
            if (aComp.length < aSrc.length) return aComp;
        }
        return aSrc;
    }

    /**
     * State.decompressEvenOdd(aComp, nLength)
     *
     * This is the counterpart to compressEvenOdd().  Note that because there's nothing in the compressed sequence
     * that differentiates a compress() sequence from a compressEvenOdd() sequence, you simply have to be consistent:
     * if you used even/odd compression, then you must use even/odd decompression.
     *
     * @param {Array.<number>} aComp
     * @param {number} nLength is expected length of decompressed data
     * @return {Array.<number>}
     */
    static decompressEvenOdd(aComp, nLength)
    {
        var iDst = 0;
        var aDst = new Array(nLength);
        var iComp = 0;
        while (iComp < aComp.length - 1) {
            var c = aComp[iComp++];
            var n = aComp[iComp++];
            while (c--) {
                aDst[iDst] = n;
                iDst += 2;
            }
            /*
             * The output of a "count,value" pair will never exceed the end of the output array, so as soon as we reach it
             * the first time, we know it's time to switch to ODD elements, and as soon as we reach it again, we should be
             * done.
             */
            Component.assert(iDst <= nLength || iComp == aComp.length);
            if (iDst == nLength) iDst = 1;
        }
        Component.assert(aDst.length == nLength);
        return aDst;
    }
}

if (NODE) module.exports = State;
