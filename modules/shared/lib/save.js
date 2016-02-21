/**
 * @fileoverview PCjs save functionality.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Feb-17
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of the JavaScript Machines Project (aka JSMachines) at <http://jsmachines.net/>
 * and <http://pcjs.org/>.
 *
 * JSMachines is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * JSMachines is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with JSMachines.
 * If not, see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see Computer.COPYRIGHT).
 *
 * Some JSMachines files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * JSMachines Project for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

/* global window: true, APPVERSION: false, XMLVERSION: true, DEBUG: true */

if (NODE) {
    var Component = require("./component");
    var str = require("./strlib");
    var web = require("./weblib");
}

/**
 * savePC(idMachine, sPCJSFile)
 *
 * @param {string} idMachine
 * @param {string} sPCJSFile
 * @return {boolean} true if successful, false if error
 */
function savePC(idMachine, sPCJSFile)
{
    var cmp = /** @type {Computer} */ (Component.getComponentByType("Computer", idMachine));
    var dbg = /** @type {Debugger} */ (Component.getComponentByType("Debugger", idMachine));
    if (cmp) {
        var sState = cmp.powerOff(true);
        var sParms = cmp.saveMachineParms();
        if (!sPCJSFile) {
            if (DEBUG) {
                sPCJSFile = "/tmp/pcjs/" + (XMLVERSION || APPVERSION) + "/pc.js"
            } else {
                sPCJSFile = "/versions/pcjs/" + (XMLVERSION || APPVERSION) + "/pc" + (dbg? "-dbg" : "") + ".js";
            }
        }
        web.getResource(sPCJSFile, null, true, function(sURL, sResponse, nErrorCode) {
            downloadCSS(sURL, sResponse, nErrorCode, [idMachine, str.getBaseName(sPCJSFile, true), sParms, sState]);
        });
        return true;
    }
    web.alertUser("Unable to identify machine '" + idMachine + "'");
    return false;
}

/**
 * downloadCSS(sURL, sPCJS, nErrorCode, aMachineInfo)
 *
 * @param {string} sURL
 * @param {string} sPCJS
 * @param {number} nErrorCode
 * @param {Array} aMachineInfo ([0] = idMachine, [1] = sScript, [2] = sParms, [3] = sState)
 */
function downloadCSS(sURL, sPCJS, nErrorCode, aMachineInfo)
{
    if (!nErrorCode && sPCJS) {
        aMachineInfo.push(sPCJS);
        var res = Component.getMachineResources(aMachineInfo[0]);
        var sCSSFile = null;
        for (var sName in res) {
            if (str.endsWith(sName, "components.xsl")) {
                sCSSFile = sName.replace(".xsl", ".css");
                break;
            }
        }
        if (!sCSSFile) {
            /*
             * This is probably a bad idea (ie, allowing downloadPC() to proceed with our stylesheet)...
             */
            downloadPC(sURL, null, 0, aMachineInfo);
        } else {
            web.getResource(sCSSFile, null, true, function(sURL, sResponse, nErrorCode) {
                downloadPC(sURL, sResponse, nErrorCode, aMachineInfo);
            });
        }
        return;
    }
    web.alertUser("Error (" + nErrorCode + ") requesting " + sURL);
}

/**
 * downloadPC(sURL, sCSS, nErrorCode, aMachineInfo)
 *
 * @param {string} sURL
 * @param {string|null} sCSS
 * @param {number} nErrorCode
 * @param {Array} aMachineInfo ([0] = idMachine, [1] = sScript, [2] = sParms, [3] = sState, [4] = sPCJS)
 */
function downloadPC(sURL, sCSS, nErrorCode, aMachineInfo)
{
    var matchScript, sXMLFile, sXSLFile;
    var idMachine = aMachineInfo[0], sScript = aMachineInfo[1], sPCJS = aMachineInfo[4];

    /*
     * sPCJS is supposed to contain the entire PCjs script, which has been wrapped with:
     *
     *      (function(){...
     *
     * at the top and:
     *
     *      ...})();
     *
     * at the bottom, thanks to the following Closure Compiler option:
     *
     *      --output_wrapper "(function(){%output%})();"
     *
     * Immediately inside that wrapping, we want to embed all the specified machine's resources, using:
     *
     *      var resources = {"xml": "...", "xsl": "...", ...};
     *
     * Note that the "resources" variable has been added to our externs.js, to prevent it from being renamed
     * by the Closure Compiler.
     */
    matchScript = sPCJS.match(/^(\s*\(function\(\)\{)([\s\S]*)(}\)\(\);\s*)$/);
    if (!matchScript) {
        /*
         * If the match failed, we assume that a DEBUG (uncompiled) script is being used,
         * so we'll provide a fake match that should work with whatever script was provided.
         */
        if (DEBUG) {
            matchScript = [sPCJS, "", sPCJS, ""];
        } else {
            sPCJS = "";
        }
    }

    var resOld = Component.getMachineResources(idMachine), resNew = {};
    for (var sName in resOld) {
        var data = resOld[sName];
        var sExt = str.getExtension(sName);
        if (sExt == "xml") {
            /*
             * Look through this resource for <disk> entries whose paths do not appear as one of the
             * other machine resources, and remove those entries.
             */
            var matchDisk, reDisk = /[ \t]*<disk [^>]*path=(['"])(.*?)\1.*?<\/disk>\n?/g;
            while (matchDisk = reDisk.exec(resOld[sName])) {
                var path = matchDisk[2];
                if (path) {
                    if (resOld[path]) {
                        Component.log("recording disk: '" + path + "'");
                    } else {
                        data = data.replace(matchDisk[0], "");
                    }
                }
            }
            sXMLFile = sName = str.getBaseName(sName);
        }
        else if (sExt == "xsl") {
            sXSLFile = sName = str.getBaseName(sName);
        }
        Component.log("saving resource: '" + sName + "' (" + data.length + " bytes)");
        resNew[sName] = data;
    }

    if (sCSS) {
        resNew[sName = 'css'] = sCSS;
        Component.log("saving resource: '" + sName + "' (" + sCSS.length + " bytes)");
    }

    if (aMachineInfo[2]) {
        var sParms = resNew[sName = 'parms'] = aMachineInfo[2];
        Component.log("saving resource: '" + sName + "' (" + sParms.length + " bytes)");
    }

    if (aMachineInfo[3]) {
        var sState = resNew[sName = 'state'] = aMachineInfo[3];
        Component.log("saving resource: '" + sName + "' (" + sState.length + " bytes)");
    }

    if (sXMLFile && sXSLFile) {
        var sResources = JSON.stringify(resNew);

        sPCJS = matchScript[1] + "var resources=" + sResources + ";" + matchScript[2] + matchScript[3];
        Component.log("saving machine: '" + idMachine + "' (" + sPCJS.length + " bytes)");

        var sURI, sAlert;
        var link = document.createElement('a');
        var fDownload = (!DEBUG && typeof link.download == 'string');

        if (MAXDEBUG) {
            sPCJS = sPCJS.replace(/[\u00A0-\u2666]/g, function(c) {
                return '&#' + c.charCodeAt(0) + ';';
            });
            sURI = "data:application/javascript;base64," + btoa(encodeURI(sPCJS));
        } else {
            sPCJS = sPCJS.replace(/\u00A9/g, "&#xA9;");
            sURI = "data:application/javascript,";
            if (!web.isUserAgent("Firefox")) {
                fDownload = false;
                sURI += encodeURI(sPCJS);
            } else {
                sURI += encodeURIComponent(sPCJS);
            }
        }

        if (fDownload) {
            link.href = sURI;
            link.download = sScript + ".js";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            sAlert = 'Check your Downloads folder for "' + link.download + '", ';
        } else {
            window.open(sURI);
            sAlert = 'Check your browser for a new window/tab containing the PCjs script, ';
        }

        sAlert += 'copy it to your web server as "' + sScript + '.js", and then add the following to your web page:\n\n';
        sAlert += '<div id="' + idMachine + '"></div>\n';
        sAlert += '...\n';
        sAlert += '<script type="text/javascript" src="' + sScript + '.js"></script>\n';
        sAlert += '<script type="text/javascript">embedPC("' + idMachine + '","' + sXMLFile + '","' + sXSLFile + '");</script>\n\n';
        sAlert += 'The machine should appear where the <div> is located.';
        web.alertUser(sAlert);
        return;
    }
    web.alertUser("Missing XML/XSL resources");
}

/**
 * Prevent the Closure Compiler from renaming functions we want to export, by adding them
 * as (named) properties of a global object.
 */
window['savePC'] = savePC;
