/**
 * @fileoverview PCjs save functionality.
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
    var Str = require("../../shared/lib/strlib");
    var Web = require("../../shared/lib/weblib");
    var Component = require("../../shared/lib/component");
}

/**
 * savePC(idMachine, sPCJSFile, callback)
 *
 * @param {string} idMachine
 * @param {string} sPCJSFile
 * @param {function(Object)} [callback]
 * @return {boolean} true if successful, false if error
 */
function savePC(idMachine, sPCJSFile, callback)
{
    var cmp = /** @type {Computer} */ (Component.getComponentByType("Computer", idMachine));
    var dbg = /** @type {Debugger} */ (Component.getComponentByType("Debugger", idMachine));
    if (cmp) {
        var sState = cmp.powerOff(true);
        var sParms = cmp.saveMachineParms();
        if (!sPCJSFile) {
            if (DEBUG) {
                sPCJSFile = "/versions/pcx86/" + (XMLVERSION || APPVERSION) + "/pcx86-uncompiled.js"
            } else {
                sPCJSFile = "/versions/pcx86/" + (XMLVERSION || APPVERSION) + "/pcx86" + (dbg? "-dbg" : "") + ".js";
            }
        }
        if (callback && callback({ state: sState, parms: sParms })) return true;
        Web.getResource(sPCJSFile, null, true, function(sURL, sResponse, nErrorCode) {
            downloadCSS(sURL, sResponse, nErrorCode, [idMachine, Str.getBaseName(sPCJSFile, true), sParms, sState]);
        });
        return true;
    }
    Component.alertUser("Unable to identify machine '" + idMachine + "'");
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
            if (Str.endsWith(sName, "components.xsl")) {
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
            Web.getResource(sCSSFile, null, true, function(sURL, sResponse, nErrorCode) {
                downloadPC(sURL, sResponse, nErrorCode, aMachineInfo);
            });
        }
        return;
    }
    Component.alertUser("Error (" + nErrorCode + ") requesting " + sURL);
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
     * NOTE: There may also be a source map comment appended to the script, which we now ignore; eg:
     *
     *      //# sourceMappingURL=/versions/pcx86/1.36.1/pcx86.map
     *
     * Immediately inside that wrapping, we want to embed all the specified machine's resources, using:
     *
     *      var resources = {"xml": "...", "xsl": "...", ...};
     *
     * Note that the "resources" variable has been added to our externs.js, to prevent it from being renamed
     * by the Closure Compiler.
     */
    matchScript = sPCJS.match(/^(\s*\(function\(\)\{)([\s\S]*)(}\)\(\);)/);
    if (!matchScript) {
        /*
         * If the match failed, we assume that a DEBUG (uncompiled) script is being used,
         * so we'll provide a fake match that should work with whatever script was provided.
         */
        if (DEBUG) {
            matchScript = [sPCJS, "", sPCJS, ""];
        } else {
            Component.alertUser("Unsupported script");
            return;
        }
    }

    var resOld = Component.getMachineResources(idMachine), resNew = {};
    for (var sName in resOld) {
        var data = resOld[sName];
        var sExt = Str.getExtension(sName);
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
            sXMLFile = sName = Str.getBaseName(sName);
        }
        else if (sExt == "xsl") {
            sXSLFile = sName = Str.getBaseName(sName);
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

        sScript += ".js";
        sPCJS = matchScript[1] + "var resources=" + sResources + ";" + matchScript[2] + matchScript[3];
        Component.log("saving machine: '" + idMachine + "' (" + sPCJS.length + " bytes)");

        sPCJS = sPCJS.replace(/\u00A9/g, "&#xA9;");

        var sAlert = Web.downloadFile(sPCJS, "javascript", false, sScript);

        sAlert += ', copy it to your web server as "' + sScript + '", and then add the following to your web page:\n\n';
        sAlert += '<div id="' + idMachine + '"></div>\n';
        sAlert += '...\n';
        sAlert += '<script type="text/javascript" src="' + sScript + '"></script>\n';
        sAlert += '<script type="text/javascript">embedPC("' + idMachine + '","' + sXMLFile + '","' + sXSLFile + '");</script>\n\n';
        sAlert += 'The machine should appear where the <div> is located.';
        Component.alertUser(sAlert);
        return;
    }
    Component.alertUser("Missing XML/XSL resources");
}

/**
 * Prevent the Closure Compiler from renaming functions we want to export, by adding them
 * as (named) properties of a global object.
 */
window['savePC'] = savePC;
