/**
 * @fileoverview C1Pjs and PCjs embedding functionality.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2012-Aug-28
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
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
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some JSMachines files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * JSMachines Project for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

/* global window: true, XSLTProcessor: false, web: true, Component: true, APPNAME: false, APPVERSION: false, DEBUG: true */

if (typeof module !== 'undefined') {
    var Component;
    var str = require("./strlib");
    var web = require("./weblib");
}

/**
 * loadXML(sFile, idMachine, sStateFile, fResolve)
 * 
 * This is the preferred way to load all XML and XSL files. It uses loadResource()
 * to load them as strings, which parseXML() can massage before parsing/transforming them.
 *
 * For example, since I've been unable to get the XSLT document() function to work inside any
 * XSL document loaded by JavaScript's XSLT processor, that has prevented me from dynamically
 * loading any XML machine file that uses the "ref" attribute to refer to and incorporate
 * another XML document.
 * 
 * To solve that, I've added an fResolve parameter that tells parseXML() to fetch any
 * referenced documents ITSELF and insert them into the XML string prior to parsing, instead
 * of relying on the XSLT template to pull them in.  That fetching is handled by resolveRefs(),
 * which iterates over the XML until all "refs" have been resolved (including any nested
 * references).
 *
 * Also, XSL files with a <!DOCTYPE [...]> cause MSIE's Microsoft.XMLDOM.loadXML() function
 * to choke, so I strip that out prior to parsing as well.
 *
 * TODO: Figure out why the XSLT document() function works great when the web browser loads an
 * XML file (and the associated XSL file) itself, but does not work when loading documents via
 * JavaScript XSLT support. Is it broken, is it a security issue, or am I just calling it wrong?
 *
 * @param {string} sXMLFile
 * @param {string} [idMachine]
 * @param {string} [sStateFile]
 * @param {boolean} [fResolve] is true to resolve any "ref" attributes
 * @return {Array} where [0] contains the unparsed XML string data, and [1] contains a parsed XML object
 */
function loadXML(sXMLFile, idMachine, sStateFile, fResolve)
{
    var response = web.loadResource(sXMLFile);
    if (response[0]) {
        throw new Error(response[1]);
    }
    return parseXML(response[1], sXMLFile, idMachine, sStateFile, fResolve);
}

/**
 * parseXML(sXML, idMachine, sStateFile, fResolve)
 * 
 * Generates an XML document from an XML string. This function also provides a work-around for XSLT's
 * lack of support for the document() function (at least on some browsers), by replacing every reference
 * tag (ie, a tag with a "ref" attribute) with the contents of the referenced file.
 *
 * @param {string|null} sXML
 * @param {string|null} sXMLFile
 * @param {string} [idMachine]
 * @param {string} [sStateFile]
 * @param {boolean} [fResolve] is true to resolve any "ref" attributes; default is false
 * @return {Array} where [0] contains the unparsed XML string data, and [1] contains a parsed XML object
 */
function parseXML(sXML, sXMLFile, idMachine, sStateFile, fResolve)
{
    var xmlDoc = null;
    if (sXML) {
        if (fResolve) {
            sXML = resolveRefs(sXML);
        }
        if (idMachine) {
            var sURL = sXMLFile;
            if (sURL && sURL.indexOf('/') < 0) sURL = window.location.pathname + sURL;
            sXML = sXML.replace(/(<machine[^>]*\sid=)(['"]).*?\2/, "$1$2" + idMachine + "$2" + (sStateFile? " state=$2" + sStateFile + "$2" : "") + (sURL? " url=$2" + sURL + "$2" : ""));
        }
        /*
         * If the resource we requested is not really an XML file (or the file didn't exist and the server simply returned
         * a message like "Cannot GET /configs/pc/machines/5150/cga/64kb/donkey/index.xml"), we'd like to display a more
         * meaningful message, because the XML DOM parsers will blithely return a document that contains nothing useful; eg:
         * 
         *      This page contains the following errors:error on line 1 at column 1:
         *      Document is empty Below is a rendering of the page up to the first error.
         *      
         * Supposedly, the IE XML DOM parser will throw an exception, but I haven't tested that, and unless all other
         * browsers do that, that's not helpful.
         * 
         * The best I can do at this stage (assuming web.loadResource() didn't drop any error information on the floor)
         * is verify that the requested resource "looks like" valid XML (in other words, it begins with a "<").
         */
        if (sXML.indexOf("<") === 0) {
            if (window.ActiveXObject || "ActiveXObject" in window) {        // second test is required for IE11 on Windows 8.1
                /*
                 * Another hack for MSIE, which fails to properly load XSL documents containing a <!DOCTYPE [...]> tag.
                 */
                if (!fResolve) {
                    sXML = sXML.replace(/<!DOCTYPE(.|[\r\n])*\]>\s*/g, "");
                }
                xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(sXML);
            } else {
                xmlDoc = (new window.DOMParser()).parseFromString(sXML, "text/xml");
            }
        } else {
            throw new Error("unrecognized XML: " + (sXML.length > 255? sXML.substr(0, 255) + "..." : sXML));
        }
    }
    return [sXML, xmlDoc];
}

/**
 * resolvesRefs(sXML)
 * 
 * Replaces every tag with a "ref" attribute with the contents of the corresponding file.
 * 
 * TODO: Fix some of the limitations of this code, such as: 1) requiring the "ref" attribute
 * to appear as the tag's first attribute, 2) requiring the "ref" attribute to be double-quoted,
 * and 3) requiring the "ref" tag to be self-closing. 
 *
 * @param {string} sXML
 * @returns {string} with all tags with "ref" attributes replaced with the referenced file instead
 */
function resolveRefs(sXML)
{
    var matchRef, sError;
    var reRef = /<([a-z]+)\s+ref="(.*?)"(.*?)\/>/g;
    while ((matchRef = reRef.exec(sXML))) {
        var sRefFile = matchRef[2];
        var response = web.loadResource(sRefFile);
        var sXMLRef = response[1];
        if (response[0] || !sXMLRef) {
            sError = "unable to resolve XML reference: " + matchRef[0] + " (" + response[0] + ")";
            Component.log(sError);
            throw new Error(sError);
        }
        /*
         * If there are additional attributes in the "referring" XML tag, we want to insert them
         * into the "referred" XML tag; attributes that don't exist in the referred tag should be
         * appended, and attributes that DO exist should be overwritten.
         */
        var sRefAttrs = matchRef[3];
        if (sRefAttrs) {
            var aXMLRefTag = sXMLRef.match(new RegExp("<" + matchRef[1] + "[^>]*>"));
            if (aXMLRefTag) {
                var sXMLNewTag = aXMLRefTag[0];
                /*
                 * Iterate over all the attributes in the "referring" XML tag (sRefAttrs)
                 */
                var matchAttr;
                var reAttr = /( [a-z]+=)(['"])(.*?)\2/g;
                while ((matchAttr = reAttr.exec(sRefAttrs))) {
                    if (sXMLNewTag.indexOf(matchAttr[1]) < 0) {
                        /*
                         * This is the append case
                         */
                        sXMLNewTag = sXMLNewTag.replace(">", matchAttr[0] + ">");
                    } else {
                        /*
                         * This is the overwrite case
                         */
                        sXMLNewTag = sXMLNewTag.replace(new RegExp(matchAttr[1] + "(['\"])(.*?)\\1"), matchAttr[0]);
                    }
                }
                if (aXMLRefTag[0] != sXMLNewTag) {
                    sXMLRef = sXMLRef.replace(aXMLRefTag[0], sXMLNewTag);
                }
            } else {
                sError = "missing <" + matchRef[1] + "> in " + sRefFile;
                Component.log(sError);
                throw new Error(sError);
            }
        }

        /*
         * Apparently when a Windows Azure server delivers one of my XML files, it may modify the first line:
         * 
         *      <?xml version="1.0" encoding="UTF-8"?>\n
         *      
         * I didn't determine exactly what it was doing at this point (probably just changing the \n to \r\n),
         * but in any case, relaxing the following replace() solved it.
         */
        sXMLRef = sXMLRef.replace(/<\?xml[^>]*>[\r\n]*/, "");

        sXML = sXML.replace(matchRef[0], sXMLRef);
        
        reRef.lastIndex = 0;    // reset lastIndex, since we just modified the string that reRef is iterating over
    }
    return sXML;
}

/**
 * embedMachine(sName, sVersion, idElement, sXMLFile, sXSLFile, sStateFile)
 * 
 * This allows to you embed a machine on a web page, by transforming the machine XML into HTML.
 *
 * @param {string} sName is the app name (eg, "PCjs" or "C1Pjs")
 * @param {string} sVersion is the app version (eg, "1.12.1")
 * @param {string} idElement
 * @param {string} sXMLFile
 * @param {string} [sXSLFile]
 * @param {string} [sStateFile]
 * @return {string} containing the complete XML string data, or an error if the XML could not be parsed
 */
function embedMachine(sName, sVersion, idElement, sXMLFile, sXSLFile, sStateFile)
{
    var sXML = "", sError = "", eMachine = null;
    
    try {
        eMachine = window.document.getElementById(idElement);
        if (eMachine) {
            var sAppClass = sName.toLowerCase();        // eg, "pcjs" or "c1pjs"
            if (!sXSLFile) {
                if (DEBUG && sVersion == "1.0.0") {
                    sXSLFile = "/my_modules/" + sAppClass + "-client/templates/components.xsl";
                } else {
                    sXSLFile = "/versions/" + sAppClass + "/" + sVersion + "/components.xsl";
                }
            }
            var aXML = (sXMLFile.substr(0, 1) == "<" ? parseXML(sXMLFile, null, idElement, sStateFile, false) : loadXML(sXMLFile, idElement, sStateFile, true));
            sXML = aXML[0];
            var xml = aXML[1];
            if (xml) {
                aXML = loadXML(sXSLFile);
                var xsl = aXML[1];
                if (xsl) {
                    /*
                     * The <machine> template in components.xsl now generates a "machine div" that makes
                     * the div we required the caller of embedMachine() to provide redundant, so instead
                     * of appending this fragment to the caller's node, we REPLACE the caller's node.
                     * This works only because because we ALSO inject the caller's "machine div" ID into
                     * the fragment's ID during parseXML().
                     * 
                     *      eMachine.innerHTML = sFragment;
                     *
                     * Also, if the transform function fails, make sure you're using the appropriate
                     * "components.xsl" and not a "machine.xsl", because the latter will not produce valid
                     * embeddable HTML (and is the most common cause of failure at this final stage).
                     */
                    if (window.ActiveXObject || "ActiveXObject" in window) {        // second test is required for IE11 on Windows 8.1
                        var sFragment = xml['transformNode'](xsl);
                        if (sFragment) {
                            eMachine.outerHTML = sFragment;
                        } else {
                            Component.log(sError = "transformNodeToObject failed");
                        }
                    }
                    else if (window.document.implementation && window.document.implementation.createDocument) {
                        var xsltProcessor = new XSLTProcessor();
                        xsltProcessor['importStylesheet'](xsl);
                        var eFragment = xsltProcessor['transformToFragment'](xml, window.document);
                        if (eFragment) {
                            eMachine.parentNode.replaceChild(eFragment, eMachine);
                        } else {
                            Component.log(sError = "transformToFragment failed");
                        }
                    } else {
                        /*
                         * Perhaps I should have performed this test at the outset; on the other hand, I'm
                         * not aware of any browsers don't support one or both of the above XSLT transformation
                         * methods, so treat this as a bug.
                         */
                        Component.log(sError = "unable to transform XML: unsupported browser");
                    }
                } else {
                    Component.log(sError = "failed to load XSL file: " + sXSLFile);
                }
            } else {
                Component.log(sError = "failed to load XML file: " + sXMLFile);
            }
        } else {
            Component.log(sError = "failed to find machine element: " + idElement);
        }
    } catch(e) {
        sError = e.message;
    }
    
    if (sError && eMachine) {
        /*
         * Our MarkOut module (in convertMDMachineLinks()) creates machine containers that look like this:
         * 
         *      <div id="' + sMachineID + '" class="machine-placeholder"><p>Embedded PC</p><p class="machine-warning"></p></div>
         *      
         * with the "machine-warning" paragraph pre-populated with a warning message that the user will
         * see if nothing at all happens.  But hopefully, in the normal case (and especially the error case),
         * *something* will have happened.
         * 
         * Note that it is the HTMLOut module (in processMachines()) that ultimately decides which scripts to
         * include and then generates the embedPC() and/or embedC1P() calls.
         */
        var aeError = Component.getElementsByClass(eMachine, "machine-warning");
        if (aeError[0]) {
            aeError[0].innerHTML = "Error: " + str.escapeHTML(sError);
        }
    }
    
    return sError || sXML;
}

/**
 * embedC1P(idElement, sXMLFile, sXSLFile)
 *
 * @param {string} idElement
 * @param {string} sXMLFile
 * @param {string} [sXSLFile]
 * @return {string} XML string data or error message
 */
function embedC1P(idElement, sXMLFile, sXSLFile)
{
    return embedMachine("C1Pjs", APPVERSION, idElement, sXMLFile, sXSLFile);
}

/**
 * embedPC(idElement, sXMLFile, sXSLFile, sStateFile)
 *
 * @param {string} idElement
 * @param {string} sXMLFile
 * @param {string} [sXSLFile]
 * @param {string} [sStateFile]
 * @return {string} XML string data or error message
 */
function embedPC(idElement, sXMLFile, sXSLFile, sStateFile)
{
    return embedMachine("PCjs", APPVERSION, idElement, sXMLFile, sXSLFile, sStateFile);
}

/**
 * Prevent the Closure Compiler from renaming functions we want to export, by adding them
 * as (named) properties of a global object.
 */
if (APPNAME == "PCjs") {
    window['embedPC'] = embedPC;
}

if (APPNAME == "C1Pjs") {
    window['embedC1P'] = embedC1P;
}

window['enableEvents'] = web.enablePageEvents;
window['sendEvent'] = web.sendPageEvent;
