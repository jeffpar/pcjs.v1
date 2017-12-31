/**
 * @fileoverview Handles API requests and redirects
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

var fs          = require("fs");
var path        = require("path");

/**
 * @class exports
 * @property {function(string)} sync
 */
var mkdirp      = require("mkdirp");

var DiskAPI     = require("../../shared/lib/diskapi");
var DumpAPI     = require("../../shared/lib/dumpapi");
var UserAPI     = require("../../shared/lib/userapi");
var ReportAPI   = require("../../shared/lib/reportapi");
var net         = require("../../shared/lib/netlib");
var str         = require("../../shared/lib/strlib");
var usr         = require("../../shared/lib/usrlib");
var DiskDump    = require("../../diskdump");
var FileDump    = require("../../filedump");

/**
 * @type {HTMLOut}
 */
var HTMLOut;

/**
 * sServerRoot is the root directory of the web server; it can (and should) be overridden using by the Express
 * web server using setRoot().
 *
 * @type {string}
 */
var sServerRoot = "";

/*
 * logFile is set by HTMLOut, allowing us to "mingle" our output with the server's log (typically "./logs/node.log").
 */
var logFile = null;

/*
 * Entries in this table are matched first, as-is, to req.path (no string or RegExp compare involved);
 * we do, however, strip any trailing slash from the incoming path before doing the lookup, so none of
 * the entries on the left-hand side should contain trailing slashes.
 *
 * FYI, here's what the jsmachines.net .htaccess contained before we retired its Apache webserver:
 *
 *     Redirect permanent /c1p /docs/c1pjs/
 *     Redirect permanent /c1pjs /docs/c1pjs/
 *     Redirect permanent /pc /docs/pcjs/
 *     Redirect permanent /pcjs /docs/pcjs/
 *     Redirect permanent /configs/c1p/embed/ /docs/c1pjs/embed/
 *     # Redirect permanent /configs/c1p/machines/ /docs/c1pjs/
 *     Redirect permanent /configs/pc/machines/5160/cga/win101/xt-cga-win101.xml /configs/pc/machines/5160/cga/256kb/win101/
 *     Redirect permanent /devices/c1p/array.xml /configs/c1p/machines/array/
 *     Redirect permanent /devices/pc/5160/cga/machine-dos400m.xml /configs/pc/machines/5160/cga/640kb/dos400m/
 *     Redirect permanent /demos/c1p/embed.html /docs/c1pjs/embed/
 *     Redirect permanent /demos/pc/cga-win101/xt-cga-win101.xml /configs/pc/machines/5160/cga/256kb/win101/
 *     Redirect permanent /videos/pcjs/ /disks/pc/dos/microsoft/4.0M/
 *     RedirectMatch permanent /demos/pc/.* /configs/pc/machines/
 */
var aExternalRedirects = {
    "/c1p":                                                     "/docs/c1pjs/",
    "/c1pjs":                                                   "/docs/c1pjs/",
    "/pc":                                                      "/docs/about/pcx86/",
    "/pcjs":                                                    "/docs/about/pcx86/",
    "/configs/c1p/embed":                                       "/docs/c1pjs/embed/",
    "/configs/c1p/machines/array":                              "/devices/c1p/machine/8kb/array/",
    "/configs/c1p/machines/array.xml":                          "/devices/c1p/machine/8kb/array/",
    "/configs/c1p/machines/machine.xml":                        "/devices/c1p/machine/8kb/large/",
    "/configs/pc/disks":                                        "/disks/pcx86/",
    "/configs/pc/machines/5150/mda/demo/pc-mda-64k.xml":        "/devices/pcx86/machine/5150/mda/64kb/",
    "/configs/pc/machines/5150/cga/donkey/pc-cga-64k.xml":      "/devices/pcx86/machine/5150/cga/64kb/donkey/",
    "/configs/pc/machines/5150/cga/donkey/pc-dbg-64k.xml":      "/devices/pcx86/machine/5150/cga/64kb/donkey/debugger/",
    "/configs/pc/machines/5160/cga/demo":                       "/devices/pcx86/machine/5160/cga/256kb/demo/",
    "/configs/pc/machines/5160/cga/demo/xt-cga-256k.xml":       "/devices/pcx86/machine/5160/cga/256kb/demo/",
    "/configs/pc/machines/5160/cga/demo/xt-dbg-256k.xml":       "/devices/pcx86/machine/5160/cga/256kb/demo/debugger/",
    "/configs/pc/machines/5160/cga/win101/xt-cga-win101.xml":   "/devices/pcx86/machine/5160/cga/256kb/win101/",
    "/configs/pc/machines/5160/cga/machine-512k-win101.xml":    "/devices/pcx86/machine/5160/cga/512kb/win101/softkbd/",
    "/demos/c1p/embed.html":                                    "/docs/c1pjs/embed/",
    "/demos/c1p/embed.xml":                                     "/devices/c1p/machine/8kb/embed/machine.xml",
    "/demos/pc/cga":                                            "/devices/pcx86/machine/5150/cga/",
    "/demos/pc/donkey/pc-cga-64k.xml":                          "/devices/pcx86/machine/5150/cga/64kb/donkey/",
    "/demos/pc/cga-win101":                                     "/devices/pcx86/machine/5160/cga/256kb/win101/",
    "/demos/pc/cga-win101/xt-cga-win101.xml":                   "/devices/pcx86/machine/5160/cga/256kb/win101/",
    "/devices/c1p/array.xml":                                   "/devices/c1p/machine/8kb/array/",
    "/devices/pc/5160/cga/machine-dos400m.xml":                 "/devices/pcx86/machine/5160/cga/640kb/dos400m/",
    "/videos/pcjs":                                             "/devices/pcx86/machine/5160/cga/640kb/dos400m/"
};

var aExternalRedirectPatterns = {
    "^/configs/c1p/machines/?(.*)":                             "/devices/c1p/machine/$1",
    "^/configs/pc/machines/?(.*)":                              "/devices/pcx86/machine/$1"
};

/*
 * Entries in this table are matched next, using a RegExp comparison; comparisons start with the first entry
 * and continue until a match is found, at which point the replacement is performed and comparisons stop;
 * we could make the replacement process "additive", by continuing comparisons/replacements until the
 * end is reached, but let's not, unless there's an actual need.
 *
 * Feel free to use subgroups on the left-hand side, and references to them (eg, $1, $2, etc) on the right.
 */
var aInternalRedirectPatterns = {
//  "^/apps/pc/visicalc/":      "/apps/pcx86/1981/visicalc/",
//  "^/demos/pc/.*":            "/devices/pcx86/machine/"
};

/**
 * HTTPAPI()
 *
 * @param {HTMLOut} out
 * @param {string} sRoot
 */
function HTTPAPI(out, sRoot) {
    HTMLOut = out;
    sServerRoot = sRoot;
}

/**
 * setLogFile(file)
 *
 * @param {Object} file
 */
HTTPAPI.setLogFile = function(file)  {
    logFile = file;
    DiskDump.setLogFile(file);
};

/**
 * @class Volume
 * @property {number|null} fd   file descriptor
 * @property {string} mode      access mode (one of DiskAPI.MODE.*)
 * @property {string} path      path of the volume file
 * @property {string} machine   machine ID associated with the volume file
 */

/**
 * User IDs are added to userVolumes as users open volumes;  for now, only one open
 * volume per user is supported.  Every entry in userVolumes is another object (Volume).
 *
 * @type {Object.<Volume>}
 */
var userVolumes = {};

/**
 * redirect(req, res, next) is called by filter() to give us a crack at the URL
 *
 * @param {Object} req is an Express request object (http://expressjs.com/api.html#req.params)
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @param {function()} next is the function to call to finish processing this request (unless WE finish it)
 * @return {boolean} true if the request was permanently redirected, false if not
 */
HTTPAPI.redirect = function(req, res, next)
{
    var re;
    var sPath = req.path;
    if (sPath.slice(-1) == '/') sPath = sPath.slice(0, -1);

    if (sPath.indexOf("%2520") >= 0) {
        sPath = sPath.replace(/%2520/g, "%20");
        res.redirect(301, sPath);
        return true;
    }

    if (aExternalRedirects[sPath] !== undefined) {
        res.redirect(301, aExternalRedirects[sPath]);
        return true;
    }

    for (sPath in aExternalRedirectPatterns) {
        re = new RegExp(sPath);
        if (re.exec(req.url)) {
            res.redirect(301, req.url.replace(re, aExternalRedirectPatterns[sPath]));
            return true;
        }
    }

    for (sPath in aInternalRedirectPatterns) {
        re = new RegExp(sPath);
        if (re.exec(req.url)) {
            req.url = req.url.replace(re, aInternalRedirectPatterns[sPath]);
            break;
        }
    }
    return false;
};

/**
 * filterAPI(req, res, next) is called by filter() to give us a crack at any API URLs
 *
 * @param {Object} req is an Express request object (http://expressjs.com/api.html#req.params)
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @param {function()} next is the function to call to finish processing this request (unless WE finish it)
 * @return {boolean} true if the request was handled as an API request, false if not
 */
HTTPAPI.filterAPI = function(req, res, next)
{
    var asURL = req.path.match(/(^\/api\/v1\/[a-z]+)/);
    if (asURL) {
        if (asURL[0] == DiskAPI.ENDPOINT) {
            if (HTTPAPI.processDiskAPI(req, res)) {
                return true;
            }
        }
        else if (asURL[0] == DumpAPI.ENDPOINT) {
            if (HTTPAPI.processDumpAPI(req, res)) {
                return true;
            }
        }
        else if (asURL[0] == ReportAPI.ENDPOINT) {
            if (HTTPAPI.processReportAPI(req, res)) {
                return true;
            }
        }
        else if (asURL[0] == UserAPI.ENDPOINT) {
            if (HTTPAPI.processUserAPI(req, res)) {
                return true;
            }
        }
        /*
         * If we're still here, the API request didn't pass muster.
         *
         * TODO: Consider providing some simple usage info, and changing the nResponse to 200,
         * since the API endpoints will eventually be documented in /docs/pcx86/.
         */
        var nResponse = 400;                // default to "Bad Request"
        var sResponse = "unrecognized API request: " + asURL[0] + "\n";
        res.status(nResponse).send(sResponse);
        return true;
    }
    return false;
};

/**
 * hasAPICommand(req, asCommands)
 *
 * @param {Object} req
 * @param {Array.<string>} asCommands (eg, DumpAPI.asDiskCommands or DumpAPI.asFileCommands)
 * @returns {Array|null}
 */
HTTPAPI.hasAPICommand = function(req, asCommands)
{
    if (req.query) {
        for (var i = 0; i < asCommands.length; i++) {
            var sValue = req.query[asCommands[i]];
            if (sValue) return [asCommands[i], sValue];
        }
    }
    return null;
};

/**
 * initUserVolume(vol, fd, cbInit)
 *
 * @param {Object} vol
 * @param {number} fd
 * @param {number} cbInit
 * @param {function(nResponse:number,sResponse:string,fd:number)} done
 */
HTTPAPI.initUserVolume = function(vol, fd, cbInit, done)
{
    vol.fd = fd;
    var nResponse = 200;
    var sResponse = null;
    /*
     * We need to know if the file was just created, and if so, "truncate" it to the proper size
     */
    if (cbInit) {
        fs.fstat(fd, function(err, stats) {
            if (!stats.size) {
                fs.ftruncate(fd, cbInit, function(err) {
                    if (err) {
                        HTMLOut.logError(err);
                        fs.close(fd, function(err) {
                            vol.fd = null;
                            nResponse = 400;
                            sResponse = DiskAPI.FAIL.WRITEVOL;
                            done(nResponse, sResponse, null);
                        });
                        return;
                    }
                    done(nResponse, sResponse, fd);
                });
                return;
            }
            if (stats.size != cbInit) {
                HTMLOut.logError(new Error(sResponse = "file size (" + stats.size + ") does not match requested size (" + cbInit + ")"));
                fs.close(fd, function(err) {
                    vol.fd = null;
                    nResponse = 400;
                    sResponse = DiskAPI.FAIL.BADVOL;
                    done(nResponse, sResponse, null);
                });
                return;
            }
            done(nResponse, sResponse, fd);
        });
    }
};

/**
 * openUserVolume(sPath, sMachine, sUser, sMode, cbInit, done)
 *
 * User IDs are added to userVolumes as users open volumes;  for now, only one open
 * volume per user is supported.  Every entry in userVolumes is another Volume object.
 *
 * @param {string} sPath
 * @param {string} sMachine
 * @param {string} sUser
 * @param {string} sMode
 * @param {number} cbInit
 * @param {function(nResponse:number,sResponse:string,fd:number)} done
 */
HTTPAPI.openUserVolume = function(sPath, sMachine, sUser, sMode, cbInit, done)
{
    var vol = userVolumes[sUser];
    if (vol) {
        /*
         * TODO: If the path is the same and the machine ID differs, then we need to add the
         * current machine ID to a "revocation" list, consider that machine's access "revoked",
         * and return DiskAPI.FAIL.REVOKED; otherwise, there's no real protection of volume
         * integrity here.  One of the challenges will be ensuring the list of revoked machine
         * IDs doesn't grow without bound.
         *
         * When revoking, we should also be able to reuse the current vol by simply updating its
         * machine ID; there's no need to close and re-open the file (although assuming revocation
         * is a rare occurrence, it shouldn't much matter).
         */
        if (vol.path != sPath || vol.machine != sMachine) {
            HTTPAPI.closeUserVolume(vol.path, vol.machine, sUser, function() {
                HTTPAPI.openUserVolume(sPath, sMachine, sUser, sMode, cbInit, done);
            });
            return;
        }
    }

    if (!vol) {
        vol = {fd: null, mode: sMode, path: sPath, machine: sMachine};
        userVolumes[sUser] = vol;
    }

    var nResponse = 200;
    var sResponse = null;

    if (!vol.fd) {

        HTMLOut.logDebug('HTMLOut.openUserVolume("' + sPath + '")');

        fs.open(sPath, "r+", function(err, fd) {
            if (err) {
                if (sMode == DiskAPI.MODE.DEMANDRW) {
                    fs.open(sPath, "w+", function(err, fd) {
                        if (err) {
                            HTMLOut.logError(err);
                            nResponse = 400;
                            sResponse = DiskAPI.FAIL.CREATEVOL;
                            done(nResponse, sResponse, null);
                        } else {
                            HTTPAPI.initUserVolume(vol, fd, cbInit, done);
                        }
                    });
                } else {
                    HTMLOut.logError(err);
                    nResponse = 400;
                    sResponse = DiskAPI.FAIL.OPENVOL;
                    done(nResponse, sResponse, null);
                }
            } else {
                HTTPAPI.initUserVolume(vol, fd, cbInit, done);
            }
        });
        return;
    }
    done(nResponse, sResponse, vol.fd);
};

/**
 * readUserVolume(sPath, fd, aCHS, aRequest, done)
 *
 * aCHS is filled in as follows:
 *
 *      [0]: total cylinders
 *      [1]: total heads
 *      [2]: total sectors per track
 *      [3]: total bytes per sector (generally 512)
 *
 * aRequest is filled in as follows:
 *
 *      [0]: 0-based cylinder number
 *      [1]: 0-based head number
 *      [2]: 1-based sector number
 *      [3]: sector count
 *
 * @param {string} sPath
 * @param {number} fd
 * @param {Array.<number>} aCHS
 * @param {Array.<number>} aRequest
 * @param {function(nResponse:number,sResponse:string)} done
 */
HTTPAPI.readUserVolume = function(sPath, fd, aCHS, aRequest, done)
{
    var pos = (aRequest[0] * (aCHS[1] * aCHS[2] * aCHS[3])) + (aRequest[1] * (aCHS[2] * aCHS[3])) + ((aRequest[2] - 1) * aCHS[3]);
    var len = (aRequest[3] * aCHS[3]);

    HTMLOut.logDebug('HTMLOut.readUserVolume("' + sPath + '"): pos: ' + pos + ', len: ' + len);

    var buf = new Buffer(len);
    fs.read(fd, buf, 0, len, pos, function(err, cbRead, buffer) {
        var nResponse = 200;
        var sResponse = null;
        //
        // TODO: The callback should be asserting/verifying that cbRead equals the requested length.
        //
        if (err) {
            nResponse = 400;
            sResponse = err.message;
        } else {
            sResponse = JSON.stringify(buffer);
        }
        done(nResponse, sResponse);
        /*
         * Replace the preceding line with this if you want to test how well the client deals with long I/O delays (eg, 10 seconds)
         *
        setTimeout(function() {
            HTMLOut.logDebug("HTTPAPI.readUserVolume(): responding after 10000ms delay");
            done(nResponse, sResponse);
        }, 10000);
        */
    });
};

/**
 * writeUserVolume(sPath, fd, aCHS, aRequest, sData, done)
 *
 * aCHS is filled in as follows:
 *
 *      [0]: total cylinders
 *      [1]: total heads
 *      [2]: total sectors per track
 *      [3]: total bytes per sector (generally 512)
 *
 * aRequest is filled in as follows:
 *
 *      [0]: 0-based cylinder number
 *      [1]: 0-based head number
 *      [2]: 1-based sector number
 *      [3]: sector count
 *
 * @param {string} sPath
 * @param {number} fd
 * @param {Array.<number>} aCHS
 * @param {Array.<number>} aRequest
 * @param {string} sData
 * @param {function(nResponse:number,sResponse:string)} done
 */
HTTPAPI.writeUserVolume = function(sPath, fd, aCHS, aRequest, sData, done)
{
    var pos = (aRequest[0] * (aCHS[1] * aCHS[2] * aCHS[3])) + (aRequest[1] * (aCHS[2] * aCHS[3])) + ((aRequest[2] - 1) * aCHS[3]);
    var len = (aRequest[3] * aCHS[3]);

    HTMLOut.logDebug('HTMLOut.writeUserVolume("' + sPath + '"): pos: ' + pos + ', len: ' + len);

    var abData;
    try {
        abData = JSON.parse(sData);
    } catch(err) {
        done(-1, err.message);
        return;
    }

    if (abData.length == len) {
        var buf = new Buffer(abData);
        /*
         * I have some concerns about asynchronous writes being performed out of order; however,
         * even after changing fs.write() to fs.writeSync(), I'm still getting a corrupted 20mb disk
         * image after running PKXARC B:DOCS.ARC into C:\TMP.  TODO: Investigate.
         */
        var nResponse = 200;
        var sResponse = null;
        var cbWrite = fs.writeSync(fd, buf, 0, len, pos);
        if (cbWrite != len) {
            nResponse = 400;
            sResponse = "write length (" + cbWrite + ") does not equal buffer length (" + len + ")"
        }
        done(nResponse, sResponse);
        /*
        fs.write(fd, buf, 0, len, pos, function(err, cbWrite, buffer) {
            //
            // TODO: The callback should be asserting/verifying that cbWrite equals the requested length.
            //
            var nResponse = 200;
            var sResponse = null;
            if (err) {
                nResponse = 400;
                sResponse = err.message;
            }
            done(nResponse, sResponse);
        });
        */
    } else {
        done(-1, "buffer length (" + abData.length + ") does not equal requested length (" + len + ")");
    }
};

/**
 * closeUserVolume(sPath, sMachine, sUser, done)
 *
 * @param {string} sPath
 * @param {string} sMachine
 * @param {string} sUser
 * @param {function(Error)} done
 */
HTTPAPI.closeUserVolume = function(sPath, sMachine, sUser, done)
{
    /**
     * @type {Volume}
     */
    var vol = userVolumes[sUser];
    if (vol) {
        if (vol.path == sPath && vol.machine == sMachine) {
            userVolumes[sUser] = null;
            if (vol.fd) {
                HTMLOut.logDebug('HTTPAPI.closeUserVolume("' + sPath + '")');
                fs.close(vol.fd, done);
                return;
            }
            done(new Error(HTMLOut.logDebug('HTTPAPI.closeUserVolume("' + sPath + '"): volume not open')));
            return;
        }
        done(new Error(HTMLOut.logDebug('HTTPAPI.closeUserVolume("' + sPath + '"): different volume open (' + vol.path + ')')));
        return;
    }
    done(new Error(HTMLOut.logDebug('HTTPAPI.closeUserVolume("' + sPath + '"): no open volumes')));
};

/**
 * parseDiskValues(s, aDefaults)
 *
 * @param {string} s
 * @param {Array.<number>} a
 * @returns {Array.<number>}
 */
HTTPAPI.parseDiskValues = function(s, a)
{
    if (s) {
        var as = s.split(':');
        for (var i = 0; i < as.length && i < a.length; i++) {
            if (!str.isValidInt(as[i])) break;
            a[i] = parseInt(as[i]);
        }
    }
    return a;
};

/**
 * processDiskAPI(req, res)
 *
 * @param {Object} req is an Express request object (http://expressjs.com/api.html#req.params)
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @return {boolean} true if the request was handled as an API request, false if not
 */
HTTPAPI.processDiskAPI = function(req, res)
{
    /*
     * For every volume, we must maintain the active machine+user that currently has access.
     */
    var nResponse = 400;                                // default to "Bad Request"
    var reqParms = req.method == "GET"? req.query : req.body;
    var sAction = reqParms[DiskAPI.QUERY.ACTION];
    var sPath = reqParms[DiskAPI.QUERY.VOLUME];
    var sMode = reqParms[DiskAPI.QUERY.MODE];           // one of DiskAPI.MODE.* (eg, DiskAPI.MODE.DEMANDRW)
    var sCHS = reqParms[DiskAPI.QUERY.CHS];
    var sAddr = reqParms[DiskAPI.QUERY.ADDR];
    var sData = reqParms[DiskAPI.QUERY.DATA];
    var sMachine = reqParms[DiskAPI.QUERY.MACHINE];
    var sUser = reqParms[DiskAPI.QUERY.USER];

    /*
     * aCHS is filled in as follows:
     *
     *      [0]: total cylinders
     *      [1]: total heads
     *      [2]: total sectors per track
     *      [3]: total bytes per sector (generally 512)
     *
     * aRequest is filled in as follows:
     *
     *      [0]: 0-based cylinder number
     *      [1]: 0-based head number
     *      [2]: 1-based sector number
     *      [3]: sector count
     */
    var aCHS = HTTPAPI.parseDiskValues(sCHS, [0, 0, 0, 512]);
    var aRequest = HTTPAPI.parseDiskValues(sAddr, [0, 0, 0, 0]);

    HTMLOut.logDebug('HTTPAPI.processDiskAPI("' + sPath + '"): action=' + sAction + ', chs=' + sCHS + ', addr=' + sAddr);

    if (sPath && sPath.indexOf('*/') === 0 && sPath.indexOf("..") < 0) {
        HTTPAPI.verifyUserDir(sUser, function(sDir) {
            if (sDir) {
                var cbInit = aCHS[0] * aCHS[1] * aCHS[2] * aCHS[3];
                sPath = path.join(sDir, sPath.replace('*', ''));
                switch(sAction) {
                    case DiskAPI.ACTION.OPEN:
                        HTTPAPI.openUserVolume(sPath, sMachine, sUser, sMode, cbInit, function(nResponse, sResponse, fd) {
                            res.status(nResponse).send(sResponse);
                        });
                        break;
                    case DiskAPI.ACTION.READ:
                        HTTPAPI.openUserVolume(sPath, sMachine, sUser, sMode, cbInit, function(nResponse, sResponse, fd) {
                            if (fd) {
                                HTTPAPI.readUserVolume(sPath, fd, aCHS, aRequest, function(nResponse, sResponse) {
                                    /*
                                     * Without the addition of "no-store", Chrome will assume that a previous response to
                                     * a previously seen URL can be re-used without hitting the server again, which would be
                                     * bad if the requested sector(s) had been written in the meantime.
                                     *
                                     * Perhaps I should be using different HTTP verbs, or perhaps I should switch to sockets,
                                     * but in the meantime, this is absolutely necessary.
                                     */
                                    res.set("Cache-Control", "no-cache, no-store");
                                    res.status(nResponse).send(sResponse);
                                });
                            } else {
                                res.status(nResponse).send(sResponse);
                            }
                        });
                        break;
                    case DiskAPI.ACTION.WRITE:
                        HTTPAPI.openUserVolume(sPath, sMachine, sUser, sMode, cbInit, function(nResponse, sResponse, fd) {
                            if (fd) {
                                HTTPAPI.writeUserVolume(sPath, fd, aCHS, aRequest, sData, function(nResponse, sResponse) {
                                    res.status(nResponse).send(sResponse);
                                });
                            } else {
                                res.status(nResponse).send(sResponse);
                            }
                        });
                        break;
                    case DiskAPI.ACTION.CLOSE:
                        HTTPAPI.closeUserVolume(sPath, sMachine, sUser, function(err) {
                            var sResponse = null;
                            if (err) {
                                sResponse = err.message;
                            } else {
                                nResponse = 200;
                            }
                            res.status(nResponse).send(sResponse);
                        });
                        break;
                    default:
                        res.status(nResponse).send(DiskAPI.FAIL.BADACTION);
                        break;
                }
                return;
            }
            res.status(nResponse).send(DiskAPI.FAIL.BADUSER);
        });
        return true;
    }

    res.status(nResponse).send(DiskAPI.FAIL.BADVOL);
    return true;
};

/**
 * processDumpAPI(req, res)
 *
 * @param {Object} req is an Express request object (http://expressjs.com/api.html#req.params)
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @return {boolean} true if the request was handled as an API request, false if not
 */
HTTPAPI.processDumpAPI = function(req, res)
{
    var aCommand;
    var nResponse = 400;                // default to "Bad Request"
    var sDisk, sFile, sFormat, fComments;

    if ((aCommand = HTTPAPI.hasAPICommand(req, DumpAPI.asDiskCommands))) {

        sDisk = aCommand[1];
        HTMLOut.logDebug('HTTPAPI.processDumpAPI("' + sDisk + '"): type=' + aCommand[0]);

        /*
         * Allowing ".." in a path component is risky, unless we're running locally...
         */
        if (sDisk.indexOf("..") < 0 || req.app.settings.port == 8088) {

            sFormat = req.query[DumpAPI.QUERY.FORMAT] || DumpAPI.FORMAT.JSON;
            fComments = !!req.query[DumpAPI.QUERY.COMMENTS];
            var sSize = req.query[DumpAPI.QUERY.MBHD];
            if (sSize) {
                sSize = (sSize * 1000).toString();
            } else {
                sSize = req.query[DumpAPI.QUERY.SIZE];
            }

            /*
             * TODO: Consider adding support for DiskDump's "exclusion" option to the API interface
             * (the command-line interface supports it).
             */
            var disk = new DiskDump(sDisk, null, sFormat, fComments, sSize, sServerRoot);
            if (aCommand[0] == DumpAPI.QUERY.DISK || aCommand[0] == DumpAPI.QUERY.IMG) {
                disk.loadFile(function(err) {
                    HTTPAPI.dumpDisk(err, disk, res);
                });
            } else {
                disk.buildImage(aCommand[0] == DumpAPI.QUERY.DIR, function(err) {
                    HTTPAPI.dumpDisk(err, disk, res);
                });
            }
            return true;
        }
    }
    else if ((aCommand = HTTPAPI.hasAPICommand(req, DumpAPI.asFileCommands))) {

        sFile = aCommand[1];
        HTMLOut.logDebug('HTTPAPI.processDumpAPI("' + sFile + '"): type=' + aCommand[0]);

        /*
         * Allowing ".." in a path component is too risky, unless we're running locally.
         */
        if (sFile.indexOf("..") < 0 || req.app.settings.port == 8088) {

            sFormat = req.query[DumpAPI.QUERY.FORMAT] || DumpAPI.FORMAT.JSON;
            fComments = !!req.query[DumpAPI.QUERY.COMMENTS];
            var fDecimal;
            if (req.query[DumpAPI.QUERY.DECIMAL]) {
                fDecimal = (req.query[DumpAPI.QUERY.DECIMAL] == "true");
            }
            var file = new FileDump(sFormat, fComments, fDecimal, 0, 0, sServerRoot);
            file.loadFile(sFile, 0, 0, function(err) {
                HTTPAPI.dumpFile(err, file, res);
            });
            return true;
        }
    }
    return false;
};

/**
 * dumpDisk(err, disk, res)
 *
 * @param {Error} err
 * @param {DiskDump} disk
 * @param {Object} res
 */
HTTPAPI.dumpDisk = function(err, disk, res)
{
    var sResponse = "";
    var nResponse = 400;                // default to "Bad Request"
    var sMIMEType = null;
    var sAttachment = null;

    if (err) {
        /*
         * TODO: Do a better job of mapping the underlying error (eg, err.errno) to an appropriate HTTP response error.
         */
        nResponse = 404;
        sResponse = err.message;
    } else {
        if (disk.sFormat == DumpAPI.FORMAT.IMG) {
            // sMIMEType = "application/octet-stream";
            sMIMEType = "application/x-download";
            sAttachment = path.basename(disk.sDiskPath);
            var i = sAttachment.lastIndexOf('.');
            if (i > 0) sAttachment = sAttachment.substring(0, i+1) + DumpAPI.FORMAT.IMG;
            sResponse = disk.convertToIMG(true);
        } else {
            // res.charset = "utf-8";
            sMIMEType = "application/json; charset=utf-8";
            sResponse = disk.convertToJSON();
        }
        /*
         * Return a successful response ONLY if the disk conversion call returned any data
         */
        if (sResponse) {
            nResponse = 200;
        } else {
            sResponse = "unable to convert disk image: " + disk.sDiskPath;
        }
    }
    if (sMIMEType) {
        res.set("Content-Type", sMIMEType);
    }
    if (sAttachment) {
        res.set("Content-Disposition", 'attachment; filename="' + sAttachment + '"');
    }
    res.status(nResponse).send(sResponse);
};

/**
 * dumpFile(err, file, res)
 *
 * @param {Error} err
 * @param {FileDump} file
 * @param {Object} res
 */
HTTPAPI.dumpFile = function(err, file, res)
{
    var sResponse = "";
    var nResponse = 400;                // default to "Bad Request"
    var sMIMEType = null;
    var sAttachment = null;

    if (err) {
        /*
         * TODO: Do a better job of mapping the underlying error (eg, err.errno) to an appropriate HTTP response error.
         */
        nResponse = 404;
        sResponse = err.message;
    } else {
        if (file.sFormat == DumpAPI.FORMAT.ROM) {
            // sMIMEType = "application/octet-stream";
            sMIMEType = "application/x-download";
            sAttachment = path.basename(file.sFilePath);
            var i = sAttachment.lastIndexOf('.');
            if (i > 0) sAttachment = sAttachment.substring(0, i+1) + DumpAPI.FORMAT.ROM;
            sResponse = file.getData();
        } else {
            file.convertToJSON(function(err, str) {
                if (!err) {
                    nResponse = 200;
                } else {
                    str = err.message;
                }
                res.status(nResponse).send(str);
            });
            return;
        }
        /*
         * Return a successful response ONLY if the file conversion call returned any data
         */
        if (sResponse) {
            nResponse = 200;
        } else {
            sResponse = "unable to convert file image: " + file.sFilePath;
        }
    }
    if (sMIMEType) {
        res.set("Content-Type", sMIMEType);
    }
    if (sAttachment) {
        res.set("Content-Disposition", 'attachment; filename="' + sAttachment + '"');
    }
    res.status(nResponse).send(sResponse);
};

/**
 * processReportAPI(req, res)
 *
 * @param {Object} req is an Express request object (http://expressjs.com/api.html#req.params)
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @return {boolean} true if the request was handled as an API request, false if not
 */
HTTPAPI.processReportAPI = function(req, res)
{
    var sApp = req.body[ReportAPI.QUERY.APP];
    var sVer = req.body[ReportAPI.QUERY.VER];
    var sURL = req.body[ReportAPI.QUERY.URL];
    var sUser = req.body[ReportAPI.QUERY.USER];
    var sType = req.body[ReportAPI.QUERY.TYPE];
    var sData = req.body[ReportAPI.QUERY.DATA];

    HTMLOut.logDebug('HTTPAPI.processReportAPI("' + sApp + '"): ver=' + sVer + ', url=' + sURL + ', type=' + sType);

    if (sApp && sVer && sType == ReportAPI.TYPE.BUG && sData) {
        /*
         * Generate a random number x (where 0 <= x < 1), add 0.1 so that it's guaranteed to be
         * non-zero, convert to base 36, and chop off the leading digit and "decimal" point.
         */
        var sRemoteIP = req? req.ip : "";
        var sDataFile = "/logs/" + sType + "s/" + usr.formatDate("Ymd") + '-' + (Math.random() + 0.1).toString(36).substr(2,8) + ".json";
        var sReport = "<p>" + sApp + ' v' + sVer + ' ' + usr.formatDate("Y-m-d H:i:s") + ' ' + sRemoteIP + ' <a href="' + sURL + '?state=' + sDataFile + (sUser? '&user=' + sUser : '') + '">' + sDataFile + "</a></p>\n";
        sDataFile = path.join(sServerRoot, sDataFile);
        fs.writeFile(sDataFile, sData);
        var sTypeFile = path.join(sServerRoot, "/logs/" + sType + "s.html");
        fs.appendFile(sTypeFile, sReport);
        res.status(200).send(ReportAPI.RES.OK);
        return true;
    }
    return false;
};

/**
 * processUserAPI(req, res)
 *
 * @param {Object} req is an Express request object (http://expressjs.com/api.html#req.params)
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @return {boolean} true if the request was handled as an API request, false if not
 */
HTTPAPI.processUserAPI = function(req, res)
{
    var reqParms = req.method == "GET"? req.query : req.body;
    var sReq = reqParms[UserAPI.QUERY.REQ];
    var sUser = reqParms[UserAPI.QUERY.USER];
    var sState = reqParms[UserAPI.QUERY.STATE];
    var sData = reqParms[UserAPI.QUERY.DATA];

    HTMLOut.logDebug('HTTPAPI.processUserAPI("' + sUser + '"): req=' + sReq + (sState? (', state=' + sState) : ''));

    if (sUser) {
        switch(sReq) {
            case UserAPI.REQ.CREATE:
                if (HTTPAPI.createUserID(sUser, res)) return true;
                break;
            case UserAPI.REQ.VERIFY:
                if (HTTPAPI.verifyUserID(sUser, res)) return true;
                break;
            case UserAPI.REQ.STORE:
                if (HTTPAPI.storeUserData(sUser, sState, sData, res)) return true;
                break;
            case UserAPI.REQ.LOAD:
                if (HTTPAPI.loadUserData(sUser, sState, res)) return true;
                break;
            default:
                break;
        }
    }
    return false;
};

/**
 * createUserID(sUser, res)
 *
 * sUser must consist of the authorizing key, a colon, and the key to be authorized.
 *
 * @param {string} sUser
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @return {boolean} true if request was valid (does not imply success), false if invalid
 */
HTTPAPI.createUserID = function(sUser, res)
{
    HTMLOut.logDebug('HTTPAPI.createUserID("' + sUser + '")');

    var asUsers = sUser.split(':');
    if (asUsers[0] && asUsers[1]) {
        HTTPAPI.verifyUserID(asUsers[0], res, function doneVerifyAuthorizedID(iVerified, result, res) {

            HTMLOut.logDebug('HTTPAPI.doneVerifyAuthorizedID("' + asUsers[0] + '"): ' + iVerified);

            /*
             * The authorizing key has been verified, but it may authorize another key only
             * if it is the first key in the list (or there are no keys at all yet and the authorizing
             * key matches GORT_COMMAND).
             */
            if (iVerified == 1 || iVerified <= 0 && asUsers[0] == net.GORT_COMMAND) {
                HTTPAPI.verifyUserID(asUsers[1], res, function doneVerifyUserID(iVerified, resultSecond, res) {

                    HTMLOut.logDebug('HTTPAPI.doneVerifyUserID("' + asUsers[1] + '"): ' + iVerified);

                    if (iVerified <= 0) {
                        var sUserFile = path.join(sServerRoot, "/logs/users.log");
                        fs.appendFile(sUserFile, asUsers[1] + "\n");
                        result[UserAPI.RES.CODE] = UserAPI.CODE.OK;
                        result[UserAPI.RES.DATA] = asUsers[1];
                    } else {
                        result[UserAPI.RES.CODE] = UserAPI.CODE.FAIL;
                        result[UserAPI.RES.DATA] = UserAPI.FAIL.DUPLICATE;
                    }
                    if (res) res.status(200).send(JSON.stringify(result) + "\n");
                });
                return;
            }
            result[UserAPI.RES.CODE] = UserAPI.CODE.FAIL;
            result[UserAPI.RES.DATA] = UserAPI.FAIL.VERIFY;
            if (res) res.status(200).send(JSON.stringify(result) + "\n");
        });
        return true;
    }
    return false;
};

/**
 * verifyUserID(sUser, res, done)
 *
 * If a done() handler is specified, the first parameter it receives is iVerified, which
 * will be -1 if the "users.log" file hasn't been initialized yet, 0 if the key doesn't exist,
 * or a positive number representing the line number at which the key appears.
 *
 * Moreover, when a done() handler is provided, it simply passes the response object (res) to
 * done(), which must actually send the response, based on the provided result; this function sends
 * a response only if done() is NOT provided.
 *
 * @param {string} sUser
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @param {function(number, Object, Object)} [done]
 * @return {boolean} true if request was valid (does not imply success), false if invalid
 */
HTTPAPI.verifyUserID = function(sUser, res, done)
{
    HTMLOut.logDebug('HTTPAPI.verifyUserID("' + sUser + '")');

    /*
     * If a colon separator is present, this is an implicit REQ.CREATE call
     * (in fact, at present, PCjs does not issue any explicit REQ.CREATE calls).
     */
    if (sUser.indexOf(':') > 0 && HTTPAPI.createUserID(sUser, res)) {
        return true;
    }
    var iVerified = -1;
    var sUserFile = path.join(sServerRoot, "/logs/users.log");
    fs.readFile(sUserFile, {encoding: "utf8"}, function doneReadUserIDs(err, sData) {

        var sResCode = UserAPI.CODE.FAIL;
        var sResData = UserAPI.FAIL.VERIFY;
        if (err) {
            HTMLOut.logError(err);
        } else {
            var asUsers = sData.split("\n");
            iVerified = asUsers.indexOf(sUser);
            if (iVerified >= 0) {
                if (HTTPAPI.createUserDir(sUser)) {
                    sResCode = UserAPI.CODE.OK;
                    sResData = sUser;
                }
            }
            iVerified++;
        }
        var result = {};
        result[UserAPI.RES.CODE] = sResCode;
        result[UserAPI.RES.DATA] = sResData;
        if (done) {
            done(iVerified, result, res);
            return;
        }
        if (res) res.status(200).send(JSON.stringify(result) + "\n");
    });
    return true;
};

/**
 * getUserDir(sUser)
 *
 * @param {string} sUser
 * @return {string}
 */
HTTPAPI.getUserDir = function(sUser)
{
    return path.join(sServerRoot, "/logs/users/" + /* sUser.substr(0, 2) + "/" + */ sUser);
};

/**
 * createUserDir(sUser)
 *
 * TODO: Creation is relatively rare, so I'm lazy and use synchronous calls, but fix this someday.
 *
 * @param {string} sUser
 * @return {boolean} true if successful, false if not
 */
HTTPAPI.createUserDir = function(sUser)
{
    var sDir = HTTPAPI.getUserDir(sUser);
    return (fs.existsSync(sDir) || !!mkdirp.sync(sDir));
};

/**
 * verifyUserDir(sUser, done)
 *
 * @param {string} sUser
 * @param {function(string|null)} done
 */
HTTPAPI.verifyUserDir = function(sUser, done)
{
    HTMLOut.logDebug('HTTPAPI.verifyUserDir("' + sUser + '")');

    if (sUser) {
        var sDir = HTTPAPI.getUserDir(sUser);
        fs.exists(sDir, function(fExists) {
            if (!fExists) {
                HTTPAPI.verifyUserID(sUser, null, function(iVerified, result, res) {
                    done(iVerified > 0? sDir : null);
                });
                return;
            }
            done(sDir);
        });
        return;
    }
    done(null);
};

/**
 * loadUserData(sUser, sState, res)
 *
 * @param {string} sUser
 * @param {string} sState is a state ID
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @return {boolean} true if request was valid (does not imply success), false if invalid
 */
HTTPAPI.loadUserData = function(sUser, sState, res)
{
    HTMLOut.logDebug('HTTPAPI.loadUserData("' + sUser + '","' + sState + '")');

    if (sState) {
        HTTPAPI.verifyUserDir(sUser, function(sDir) {
            var result = {};
            result[UserAPI.RES.CODE] = UserAPI.CODE.FAIL;
            result[UserAPI.RES.DATA] = UserAPI.FAIL.VERIFY;
            if (sDir) {
                if (sState.indexOf("..") >= 0) {
                    result[UserAPI.RES.DATA] = UserAPI.FAIL.BADSTATE;
                }
                else {
                    var sFile = path.join(sDir, sState);
                    fs.readFile(sFile, {encoding: "utf8"}, function doneReadUserData(err, sData) {
                        if (err) {
                            HTMLOut.logError(err);
                            /*
                             * We'll assume that any error here means the file doesn't exist (ie, NOSTATE instead
                             * of BADLOAD).
                             */
                            result[UserAPI.RES.DATA] = UserAPI.FAIL.NOSTATE;
                        } else {
                            /*
                             * Suppress the normal RES_CODE+RES_DATA output format and simply return the "raw" state;
                             * this makes life simpler for the client app.
                             */
                            result = sData;
                            /*
                             * Without the addition of "no-store", Chrome (and perhaps other browsers) will assume that
                             * a previous response to a previously seen URL can be re-used without hitting the server
                             * again, which would be bad if the requested state has been modified in the meantime.
                             *
                             * Here's the scenario: the user loads a web page with a machine that uses server-side state,
                             * the user changes the state of that machine and switches away from the machine (eg, clicks
                             * a link to a different page), which causes the state to be updated on the server; then they
                             * click the Back button, and the browser, seeing the same server-side state request, simply
                             * uses the state data it originally retrieved, instead of requesting the updated state from the
                             * server.
                             */
                            res.set("Cache-Control", "no-cache, no-store");
                        }
                        res.status(200).send(typeof result == "string"? result : JSON.stringify(result) + "\n");
                    });
                    return;
                }
            }
            res.status(200).send(JSON.stringify(result) + "\n");
        });
        return true;
    }
    return false;
};

/**
 * storeUserData(sUser, sState, sData, res)
 *
 * @param {string} sUser
 * @param {string} sState is a state ID
 * @param {string} sData
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @return {boolean} true if request was valid (does not imply success), false if invalid
 */
HTTPAPI.storeUserData = function(sUser, sState, sData, res)
{
    HTMLOut.logDebug('HTTPAPI.storeUserData("' + sUser + '","' + sState + '")');

    if (sState && sData) {
        HTTPAPI.verifyUserDir(sUser, function(sDir) {
            var result = {};
            result[UserAPI.RES.CODE] = UserAPI.CODE.FAIL;
            result[UserAPI.RES.DATA] = UserAPI.FAIL.VERIFY;
            if (sDir) {
                if (sState.indexOf("..") >= 0) {
                    result[UserAPI.RES.DATA] = UserAPI.FAIL.BADSTATE;
                }
                else {
                    var sFile = path.join(sDir, sState);
                    fs.writeFile(sFile, sData);
                    result[UserAPI.RES.CODE] = UserAPI.CODE.OK;
                    result[UserAPI.RES.DATA] = sData.length + " bytes stored";
                }
            }
            res.status(200).send(JSON.stringify(result) + "\n");
        });
        return true;
    }
    return false;
};

module.exports = HTTPAPI;
