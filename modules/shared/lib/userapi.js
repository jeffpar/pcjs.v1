/**
 * @fileoverview User API, as defined by httpapi.js
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

/*
 * Examples of User API requests:
 *
 *      web.getHost() + UserAPI.ENDPOINT + '?' + UserAPI.QUERY.REQ + '=' + UserAPI.REQ.VERIFY + '&' + UserAPI.QUERY.USER + '=' + sUser;
 */
var UserAPI = {
    ENDPOINT:       "/api/v1/user",
    QUERY: {
        REQ:        "req",      // specifies a request
        USER:       "user",     // specifies a user ID
        STATE:      "state",    // specifies a state ID
        DATA:       "data"      // specifies state data
    },
    REQ: {
        CREATE:     "create",   // creates a user ID
        VERIFY:     "verify",   // requests verification of a user ID
        STORE:      "store",    // stores a machine state on the server
        LOAD:       "load"      // loads a machine state from the server
    },
    RES: {
        CODE:       "code",
        DATA:       "data"
    },
    CODE: {
        OK:         "ok",
        FAIL:       "error"
    },
    FAIL: {
        DUPLICATE:  "user already exists",
        VERIFY:     "unable to verify user",
        BADSTATE:   "invalid state parameter",
        NOSTATE:    "no machine state",
        BADLOAD:    "unable to load machine state",
        BADSTORE:   "unable to save machine state"
    }
};

if (NODE) module.exports = UserAPI;
