/**
 * @fileoverview Builds default ("index.html") documents from HTML templates
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

var fs = require("fs");
var path = require("path");
var glob = require("glob");

/**
 * @class exports
 * @property {function(string)} sync
 */
var HTTPAPI = require("./httpapi");
var defines = require("../../shared/lib/defines");
var DumpAPI = require("../../shared/lib/dumpapi");
var MarkOut = require("../../markout");
var net     = require("../../shared/lib/netlib");
var proc    = require("../../shared/lib/proclib");
var str     = require("../../shared/lib/strlib");
var usr     = require("../../shared/lib/usrlib");

/**
 * @class exports
 * @property {string} name
 * @property {string} version
 */
var pkg = require("../../../package.json");
var machines = require("../../../_data/machines.json");

/*
 * fCache controls "index.html" caching; it is true by default and can be overridden using the setOptions()
 * 'cache' property.
 */
var fCache = true;

/*
 * fConsole controls console messages; it is false by default and can be overridden using the setOptions()
 * 'console' property.
 */
var fConsole = false;

/*
 * fServerDebug controls server-related debug features; it is false by default and can be enabled using the
 * setOptions() 'debug' property (or from the server's command-line interface using "--debug").
 *
 * This used to be named fDebug, which was fine, but it has been renamed to make the distinction between the
 * server's debug state (fServerDebug) and the debug state of HTMLOut instances (this.fDebug) clearer.
 */
var fServerDebug = false;

/*
 * logFile is set by server.js using the setOptions() 'logfile' property, if the server has turned on
 * logging.  This allows us to "mingle" our logConsole() output with the server's log (typically "./logs/node.log").
 *
 * The same "mingled" messages will also appear on the console if fConsole has been turned on as well
 * (using "--console" from our own command-line interface, or via the setOptions() 'console' property).
 */
var logFile = null;

/*
 * fPrivate will be set to true to by setOptions() if the server was started with '--private', giving the Node
 * server an option comparable to Jekyll's site.pcjs.private setting, and triggering the load of "private.js" as
 * appropriate.  Currently, the only (checked-in) use of the private setting is to set the client's PRIVATE global
 * and trigger the loading of alternate (ie, private) XML files in embed.js.
 */
var fPrivate = false;

/*
 * fRebuild controls the rebuilding of cached "index.html" files, assuming fCache is true; fRebuild is false
 * by default, and it can be set for all requests using the setOptions() 'rebuild' property, or for individual
 * requests using the fRebuild parameter to HTMLOut().
 */
var fRebuild = false;

/*
 * fSendDefault determines what happens HTMLOut() determines that an up-to-date default document already exists;
 * if false (default), HTMLOut() will return null, allowing our Express filter() function pass the request on
 * as a normal static file request; otherwise, HTMLOut() will load the document and send the contents itself
 * (this is the mode that the CLI uses).
 *
 * TODO: Consider honoring fSendDefault even when generating a new default document, although there may be some
 * efficiency to sending new documents ourselves, because we don't have to wait for the writeFile() to complete.
 *
 * NOTE: I've since changed the fSendDefault from false to true, because I'm running into situations where, at
 * least for directory URLs with default documents, the Express static file handler is reporting that the static
 * content is "not modified" (304), which in turn causes Safari to occasionally display blank pages.
 *
 * The server (server.js) still has the option (via setOptions) to override this setting, but until the dreaded
 * "Safari blank page" problem is fully understood and addressed, the server should probably not do that.
 *
 * TODO: Understand and properly address the "Safari blank page" problem (which I'm still seeing as of
 * Safari v7.0.3); some folks claim it's a Safari bug, but I'm not convinced, because similar requests/responses
 * from Apache don't cause the problem.
 */
var fSendDefault = true;

/*
 * fSockets is set if the server tells us to enable client-side support.
 */
var fSockets = false;

/*
 * sServerRoot is the root directory of the web server; it can (and should) be overridden using by the Express
 * web server using setRoot().
 */
var sServerRoot = "/Users/Jeff/Sites/pcjs";

/*
 * sDefaultFile is the default filename to use for web server directories, and sTemplateFile is the default HTML
 * template to use.
 */
var sDefaultFile = "index.html";
var sTemplateFile = "./modules/shared/templates/common.html";

/*
 * sReadMeFile is the default markdown file to load and convert to HTML when a "readme" token is detected in an
 * HTML template file; sMachineXMLFile is a fallback file to look for when sReadMeFile doesn't exist.
 */
var sReadMeFile = "README.md";
var sMachineMDFile = "machine.md";
var sMachineXMLFile = "machine.xml";
var sManifestXMLFile = "manifest.xml";

var aMachineFileTypes = {
    'head': [".css"],           // put BOTH ".css" and ".js" here if convertMDMachineLinks() embeds its own scripts
    'body': [".js"]
};

/*
 * Since we have a small server-side optimization that assumes any directory entry without an extension is
 * a directory, this is a list of known exceptions (ie, entries that are NOT directories despite no extension).
 */
var asNonDirectories = [
    "COPYING",
    "LICENSE",
    "README",
    "MAKEFILE",
    "makefile"
];

/*
 * A list of plain-text file types that we want the server to serve up with mime-type "text/plain";
 * all extensions are lower-cased before being checked.
 */
var asExtsPlainText = [
    "65v",
    "asm",
    "bas",
    "hex",
    "inc",
    "lst",
    "mac",
    "map",
    "nasm",
    "txt"
];

/*
 * When we're generating file listings for a directory (ie, getDirList()), we exclude
 * all files/folders in BOTH of the following arrays.  However, if someone knows/guesses
 * the name of a non-listed file that does not appear in the non-served set, we're OK
 * with serving it to them.
 *
 * EXAMPLE: If you put "lib" in the non-listed set, then folders containing a "lib" won't
 * list it, but if you enter a URL to a "lib", its contents will be listed; whereas if you
 * put "lib" in the non-served set, then neither it NOR its contents will be listed.
 *
 * NOTE: There are some additional non-listed run-time checks we perform, such as files
 * containing a "-debug" suffix, as well as some non-served run-time checks, like anything
 * ending with ".sh" or ".php" (although I no longer bother with ".php", since all PHP files
 * should now be removed from the project).
 */
var asFilesNonListed = [
//  "LICENSE",
    "Gruntfile.js",
    "npm-shrinkwrap.json",
    "package.json",
    "server.js",
    "index.html",
    "notes.md",
    "README.md",
    "robots.txt",
    "machine.xml",
    "manifest.xml",
    "cache.manifest"
];

var asExtsNonListed = [
 // "json"              // let's allow these after all (so that people can download disk images)
];

var asExtsNonServed = [
    "sh"
];

var asFilesNonServed = [
    "bin",
    "debug",
    "grunts",
    "logs",
    "node.log",
    "node_modules",
 // "tests",            // not sure there's any reason to NOT display /tests, now that this is on GitHub
    "tmp",
    "users",
    "users.log",
    "iisnode",          // Azure/IISNode-specific
    "IISNode.yml",      // Azure/IISNode-specific
    "web.config"        // Azure/IISNode-specific
];

/*
 * Maximum blog entries increased from 20 to 100 for the new blog format.
 */
var nBlogExcerpts = 100;

/**
 * HTMLOut()
 *
 * Load (building or rebuilding as needed) a default HTML document (eg, "index.html")
 * for the specified directory (which corresponds to req.path).  sTemplateFile is the name
 * of a specific template file to start with, but in most cases, callers will pass null,
 * which means we'll fall back to sTemplateFile.
 *
 * @constructor
 * @param {string} sPath is a fully-qualified web server directory or file
 * @param {string|null} sFile is an optional template path (relative to sPath)
 * @param {boolean} fRebuild (this overrides the module's normal fRebuild setting)
 * @param {Object} req
 * @param {function(Error,string)} done
 */
function HTMLOut(sPath, sFile, fRebuild, req, done)
{
    var i;
    this.sPath = sPath;
    this.sDir = sPath.replace("/blog", "/_posts");
    this.sFile = sReadMeFile;
    this.sExt = ((i = this.sPath.lastIndexOf('.')) > 0? this.sPath.substr(i+1) : "").toLowerCase();
    if (this.sExt == "md") {
        this.sFile = path.basename(this.sDir);
        this.sDir = path.dirname(this.sDir);
    }

    this.sTemplateFile = (sFile? path.join(this.sDir, sFile) : path.join(sServerRoot, sTemplateFile));

    HTMLOut.logDebug('HTMLOut("' + this.sPath + '", "' + this.sTemplateFile + '", ' + fRebuild + ')');

    this.fDebug = (fServerDebug || net.hasParm(net.GORT_COMMAND, net.GORT_DEBUG, req)) && !net.hasParm(net.GORT_COMMAND, net.GORT_RELEASE, req);
    this.fRebuild = fRebuild;
    this.req = req;
    this.done = done;

    this.sHTML = "";
    this.sTemplate = "";
    this.aTokens = {};
    this.fRandomize = false;

    /*
     * Since we now pass fDebug to the MarkOut module, which may generate some debug
     * info in the final output that we wouldn't want to cache, I've changed the behavior
     * of fDebug to simply never cache, instead of always rebuilding the cache.
     *
     *      if (this.fDebug) this.fRebuild = true;
     *
     * Note that a production server should not need the GORT_REBUILD command, so we accept
     * it only if fServerDebug is true.
     */
    if (fServerDebug && net.hasParm(net.GORT_COMMAND, net.GORT_REBUILD, req)) {
        req.query[net.GORT_COMMAND] = undefined;
        this.fRebuild = true;
    }

    /*
     * Check the global cache setting, as well as the presence of ANY special commands
     * that we would never want to cache.
     */
    if (!fCache || fServerDebug || net.hasParm(net.GORT_COMMAND, null, req) || net.hasParm(net.REVEAL_COMMAND, null, req)) {
        this.loadFile(this.sTemplateFile, true);
        return;
    }

    /*
     * Set the name of the default file (eg, "index.html") we will use to cache the template
     * after all tokens have been replaced.
     */
    if (this.sExt == "md") {
        this.sCacheFile = this.sPath.replace(".md", ".html");
    } else {
        this.sCacheFile = path.join(this.sDir, sDefaultFile);
    }

    if (this.fRebuild) {
        HTMLOut.logDebug("HTMLOut(): rebuilding " + this.sCacheFile);
        this.loadFile(this.sTemplateFile, true);
        return;
    }

    /*
     * Since caching is allowed, let's see if sDefaultFile has already been built
     * and is newer than the specified template file.
     */
    var obj = this;
    fs.stat(this.sCacheFile, function doneStatCacheFile(err, statsIndex) {
        if (err) {
            obj.loadFile(obj.sTemplateFile, true);
        } else {
            fs.stat(obj.sTemplateFile, function doneStatTemplateFile(err, statsTemplate) {
                if (!err && statsIndex.mtime.getTime() < statsTemplate.mtime.getTime()) {
                    /*
                     * Since the template has a new timestamp, we're going to load and process it
                     * as a template (so set fTemplate = true);
                     */
                    obj.loadFile(obj.sTemplateFile, true);
                } else {
                    /*
                     * If the specified template file can't be accessed, we can either report that as
                     * an error, or display the current sDefaultFile; it seems safer and friendlier to
                     * do the latter, and simply log the missing template error.
                     *
                     *  if (err) {
                     *      obj.setData(err, null);
                     *  }
                     */
                    if (err) {
                        HTMLOut.logError(err, true);
                    }
                    if (fSendDefault) {
                        /*
                         * Since the cached copy appears to be up-to-date, we can load it, but there's
                         * no need to (re)process it as a template (so set fTemplate = false).
                         */
                        obj.loadFile(obj.sCacheFile, false);
                    } else {
                        /*
                         * By passing null for the (2nd) data parameter, we're telling the caller to pass
                         * the request on as a static file request.
                         */
                        obj.done(null, null);
                    }
                }
            });
        }
    });
}

/**
 * CLI() provides a command-line interface for the htmlout module
 *
 * Usage:
 *
 *      htmlout --dir=(directory) [--file=(filename)] [--cache] [--console] [--rebuild]
 *
 * Arguments:
 *
 *      --cache turns "index.html" caching on or off; caching is ON by default.
 *
 *      --console turns diagnostic console messages on or off; they are OFF by default.
 *
 *      --debug turns internal debug console messages on or off; they are OFF by default.
 *
 *      --dir specifies a directory relative to the web server's root directory; it must begin with '/' and
 *      will be fully-qualified before being passed to HTMLOut().
 *
 *      --file specifies an optional filename (relative to the directory given by --dir) of an alternative HTML
 *      template file; otherwise, sTemplateFile (which is relative to sServerRoot) will be used.
 *
 *      --rebuild forces any cached version of the resulting HTML to be rebuilt (in other words, we will not read
 *      any cached version of the HTML, but if caching is enabled, we will write a new cached version).
 *
 * Examples:
 *
 *      node modules/htmlout/bin/htmlout --dir=/ --console --rebuild
 */
HTMLOut.CLI = function()
{
    var args = proc.getArgs();

    if (args.argc) {
        var argv = args.argv;

        /*
         * Create a dummy Express req object
         */
        var sDir = argv['dir'];
        var req = {'path': sDir};

        if (argv['debug'] !== undefined) fServerDebug = argv['debug'];

        /*
         * Note that we don't provide command-line control over the 'senddef' option, because
         * that option's only purpose is to force HTMLOut() to load and return the requested
         * file (and the CLI interface is not a filter function).
         */
        HTMLOut.setOptions({'cache': argv['cache'], 'console': argv['console'], 'senddef': true});

        if (fServerDebug) {
            console.log("args: " + JSON.stringify(argv));
            console.log("req: " + JSON.stringify(req));
        }

        if (sDir && sDir.charAt(0) == '/') {
            sDir = path.join(sServerRoot, sDir);
            var file = new HTMLOut(sDir, argv['file'], argv['rebuild'], req, function doneHTMLOutCLI(err, s) {
                if (err) {
                    HTMLOut.logError(err, true);
                }
                else {
                    console.log(s);
                }
            });
        } else {
            console.log("error: --dir missing or invalid");
        }
    } else {
        console.log("usage: htmlout [--dir=(directory)] [--file=(filename)] [--rebuild] [--cache=(true|false)] [--console=(true|false)]");
    }
};

/**
 * filter(req, res, next) is called by the Express web server to give us a crack at the URL
 *
 * If the URL path (req.path) refers to a directory, then we will read a common HTML template and fill
 * it with the contents of the README.md in that directory, and send the response ourselves.  Otherwise,
 * we pass the request back to Express, via next(), because req.path must either refer to a static file,
 * which the express.static() middleware will take care of, or a non-existent file, which Express should
 * handle by returning an error (eg, 404).
 *
 * @param {Object} req is an Express request object (http://expressjs.com/api.html#req.params)
 * @param {Object} res is an Express response object (http://expressjs.com/api.html#res.status)
 * @param {function()} next is the function to call to finish processing this request (unless WE finish it)
 */
HTMLOut.filter = function(req, res, next)
{
    HTMLOut.logDebug('HTMLOut.filter("' + req.url + '")');

    if (HTTPAPI.redirect(req, res, next)) return;

    var i;
    var sPath = path.join(sServerRoot, req.path);
    var sBaseName = path.basename(req.path);
    var sBaseExt = ((i = sBaseName.lastIndexOf('.')) > 0? sBaseName.substr(i+1) : "").toLowerCase();
    var sTrailingChar = req.path.slice(-1);

    if (!fServerDebug && !net.hasParm(net.GORT_COMMAND, net.GORT_DEBUG, req)) {
        if (asExtsNonServed.indexOf(sBaseExt) >= 0 || asFilesNonServed.indexOf(sBaseName) >= 0) {
            /*
             * Mimic the error code+message that express.static() displays for non-existent files/folders.
             */
            res.status(404).send("Cannot GET " + req.path);
            return;
        }
    }

    /*
     * This is a hack to strip ES6 syntax from JavaScript files that is not (yet) supported by browsers;
     * specifically, import (or require) and export (or module.exports) statements.
     *
     * What's particularly annoying, especially at this late stage of ES6 adoption, is that Node is perfectly
     * capable of processing require() statements for modules with classes, but browsers are not; browsers appear
     * to feel that a var declaration (which is what a require() statement, um, requires) is incompatible with
     * a class declaration.
     */
    if (sBaseExt == "js") {
        HTMLOut.logDebug("HTMLOut.filter(" + sBaseName + "): stripping unsupported ES6 syntax");
        fs.readFile(sPath, {encoding: "utf8"}, function doneReadFileJS(err, sData) {
            if (err) {
                HTMLOut.logError(err);
                next();     // alternatively: res.status(404).send("Cannot GET " + req.path);
            } else {
                sData = sData.replace(/^([ \t]*import\s+\S+\s+from\s+['"].*?['"];)/gm, "// $1");
                sData = sData.replace(/^([ \t]*export\s+default\s+\S+;)/gm, "// $1");
                sData = sData.replace(/^([ \t]*var\s+\S+\s*=\s*require\(['"].*?['"]\);)/gm, "// $1");
                sData = sData.replace(/^([ \t]*(if\s+\(NODE\)\s*|)module\.exports\s*=\s*\S+;)/gm, "// $1");
                res.set("Content-Type", "application/javascript");
                res.status(200).send(sData);
            }
        });
        return;
    }

    /*
     * The Safari "blank page" problem continues to plague us.  Our first work-around was for directory
     * "index.html" documents, which we resolved by setting fSendDefault to true, so that we would always send
     * it ourselves, along with an "ok" (200) response code, instead of letting the Express next() function
     * handle it with a "not modified" (304) response code.
     *
     * However, the problem also extends to any XML files that we serve to an initial Safari request
     * (eg, the machine.xml and manifest.xml files that we style as web pages).  Safari includes
     * "Cache-Control max-age=0" in the request, and if the response is "Cache-Control public, max-age=0"
     * along with a 304 response code, Safari may once again display a blank page.
     *
     * This problem appears limited to the initial resource request for a particular URL.  When these XML
     * files are requested by Safari while loading another web page, Safari's caching logic is different
     * (eg, it doesn't include the same "Cache-Control" setting).
     */
    if (sBaseName == "machine.xml" || sBaseName == "manifest.xml") {
        var sAgent = req.headers['user-agent'];
        if (sAgent && sAgent.indexOf("Safari/") >= 0 && sAgent.indexOf("Chrome/") < 0 && sAgent.indexOf("OPR/") < 0) {
            var sCacheControl = req.headers['cache-control'];
            if (sCacheControl && sCacheControl.indexOf("max-age=0") >= 0) {
                HTMLOut.logDebug("HTMLOut.filter(" + sBaseName + "): Safari work-around in progress");
                fs.readFile(sPath, {encoding: "utf8"}, function doneReadFileXML(err, sData) {
                    if (err) {
                        HTMLOut.logError(err);
                        next();     // alternatively: res.status(404).send("Cannot GET " + req.path);
                    } else {
                        /*
                         * HACK: Express may still modify our response, turning our 200 status code into a 304
                         * and adding an Etag, unless we ALSO change the req.method from "GET" to something else.
                         * Supposedly, we could also use app.disable('etag'), but I'm not sure that would prevent
                         * Express from changing the status code, and I'm tired of testing work-arounds for this
                         * irritating behavior.
                         */
                        req.method = "NONE";
                        res.set("Content-Type", "application/xml");
                        res.status(200).send(sData);
                    }
                });
                return;
            }
        }
    }

    if (asNonDirectories.indexOf(sBaseName) >= 0 || asExtsPlainText.indexOf(sBaseExt) >= 0) {
        res.set("Content-Type", "text/plain");
    }

    /*
     * Next, check for API requests (eg, "/api/v1/dump?disk=/disks/pcx86/dos/ibm/2.00/PCDOS200-DISK1.json&format=img")
     *
     * We perform this before the trailing-slash-redirect check below, because we don't require our API endpoints to
     * have a trailing slash.
     */
    if (HTTPAPI.filterAPI(req, res, next)) return;

    /*
     * If sBaseName contains a file extension, I want to save some time by assuming it's NOT a directory.
     * I simplistically check for a file extension by checking merely for the presence of a period ("dot").
     * Obviously, folder names *could* also contain periods, so this optimization works only so long as I promise
     * to not create any public directories containing periods (well, ignoring folders containing version numbers).
     *
     * Conversely, if there is NO period, then I want to assume that it IS a directory, and therefore if the
     * basename did NOT end with a trailing slash AND I've enabled "strict routing" in Express (which I should
     * have), then we want to pass this request on to next(), so that the "express-slash" module will get a
     * crack at the URL and redirect with a trailing slash as appropriate.
     *
     * This isn't just a cosmetic issue, because without "strict routing" and the "express-slash" module,
     * URLs like "http://localhost:8088/devices/pcx86/machine/5150/mda/64kb/debugger" will cause problems for
     * client-side JavaScript when it tries to do an XMLHttpRequest with a relative filename (eg, "machine.xml");
     * that request will fetch the "machine.xml" in the parent directory instead of the "debugger" directory.
     *
     * TODO: Verify the problem observed above is NOT a side-effect of some poorly written client-side JavaScript
     * forming improper paths.
     *
     * NOTE: To minimize unnecessary redirects, the getDirList() function should always (try to) generate URLs for
     * folders with trailing slashes.
     */
    var sDir = sPath;
    if (sBaseExt == "md") {
        sDir = sDir.replace("/blog", "/_posts");
    }
    else if (asNonDirectories.indexOf(sBaseName) < 0) {
        if (sTrailingChar != '/') {
            HTMLOut.logDebug('HTMLOut.filter("' + sBaseName + '"): passing static file request to next()');
            next();
            return;
        }
    }

    fs.stat(sDir, function doneStatDirFilter(err, stats) {
        if (err) {
            HTMLOut.logError(err);
            // res.status(404).send(err.message);
        } else {
            var fDir = stats.isDirectory();

            HTMLOut.logDebug('HTMLOut.filter(): isDirectory("' + sDir + '"): ' + fDir);

            if (fDir || sBaseExt == "md") {
                new HTMLOut(sPath, null, fRebuild, req, function doneHTMLOutFilter(err, sData) {
                    if (err) {
                        HTMLOut.logError(err);
                        next();
                    } else if (!sData) {
                        /*
                         * HTMLOut() has the option of returning null, if it determines we can
                         * simply pass the request (ie, treat it as a static request).
                         *
                         * TODO: Assert that this behavior is consistent with the fSendDefault setting
                         * (fSendDefault should be false).
                         */
                        HTMLOut.logDebug("HTMLOut.filter(): returned null");
                        next();
                    } else {
                        HTMLOut.logDebug("HTMLOut.filter(): returned " + sData.length + " bytes");
                        /*
                         * HACK: Express may still modify our response, turning our 200 status code into a 304
                         * and adding an Etag, unless we ALSO change the req.method from "GET" to something else.
                         * Supposedly, we could also use app.disable('etag'), but I'm not sure that would prevent
                         * Express from changing the status code, and I'm tired of testing work-arounds for this
                         * irritating behavior in Safari.
                         */
                        req.method = "NONE";
                        res.status(200).send(sData);
                    }
                });
                return;
            }
        }
        next();
    });
};

/**
 * logConsole(s)
 *
 * By using this instead of console.log(), we can eliminate the constant checks for fConsole (although
 * doing those checks might save some unnecessary string concatenation when fConsole is false), and we get
 * the added benefit of optionally being able to log all our messages to the server's log file.
 *
 * @param {string} s
 * @return {string}
 */
HTMLOut.logConsole = function(s)
{
    if (fConsole) console.log(s);
    if (logFile) logFile.write(s + "\n");
    return s;
};

/**
 * logDebug(s)
 *
 * @param {string} s
 * @return {string}
 */
HTMLOut.logDebug = function(s)
{
    if (fServerDebug) HTMLOut.logConsole(s);
    return s;
};

/**
 * logError(err) conditionally logs an error to the console
 *
 * @param {Error} err
 * @param {boolean} [fForce]
 * @return {string} the error message that was logged (or that would have been logged had logging been enabled)
 */
HTMLOut.logError = function(err, fForce)
{
    var sError = "";
    if (err) {
        sError = "HTMLOut error: " + err.message;
        if (fConsole || fForce) HTMLOut.logConsole(sError);
    }
    return sError;
};

/**
 * setOptions(options) is used by the Express web server to set module options
 *
 * Supported options include:
 *
 *      'cache'     fCache
 *      'console'   fConsole
 *      'debug'     fServerDebug
 *      'logfile'   logFile
 *      'private'   fPrivate
 *      'rebuild'   fRebuild
 *      'senddef'   fSendDefault
 *      'sockets'   fSockets
 *
 * Note that an option must be explicitly set in order to override the option's default value
 * (see fCache, fConsole, fServerDebug, fRebuild and fSockets, respectively).
 *
 * @param {Object} options
 */
HTMLOut.setOptions = function(options)
{
    if (options['cache'] !== undefined) {
        fCache = options['cache'];
    }
    if (options['console'] !== undefined) {
        fConsole = options['console'];
    }
    if (options['debug'] !== undefined) {
        fServerDebug = options['debug'];
    }
    if (options['logfile'] !== undefined) {
        logFile = options['logfile'];
        HTTPAPI.setLogFile(logFile);
    }
    if (options['private'] !== undefined) {
        fPrivate = options['private'];
    }
    if (options['rebuild'] !== undefined) {
        fRebuild = options['rebuild'];
    }
    if (options['senddef'] !== undefined) {
        fSendDefault = options['senddef'];
    }
    if (options['sockets'] !== undefined) {
        fSockets = options['sockets'];
    }
};

/**
 * setRoot(sRoot) is used by the Express web server to inform us of its root directory
 *
 * NOTE: We can't use __dirname, because every module has its own __dirname, so our __dirname
 * won't be the same as Express's __dirname.  Moreover, the Express web server won't necessarily
 * be configured to use __dirname as the root.  Normally, this should match whatever gets
 * passed to express.static().
 *
 * @param {string} sRoot
 */
HTMLOut.setRoot = function(sRoot)
{
    sServerRoot = sRoot;
    HTTPAPI(HTMLOut, sRoot);
};

/*
 * Object methods
 */

/**
 * loadFile()
 *
 * @this {HTMLOut}
 * @param {string} sFile
 * @param {boolean} fTemplate
 */
HTMLOut.prototype.loadFile = function(sFile, fTemplate)
{
    var obj = this;

    HTMLOut.logConsole('HTMLOut.loadFile("' + sFile + '")');

    fs.readFile(sFile, {encoding: "utf8"}, function doneLoadFile(err, sData) {
        obj.setData(err, sData, sFile, fTemplate);
    });
};

/**
 * setData(err, sData)
 *
 * Records the given HTML template and immediately parses it.
 *
 * @this {HTMLOut}
 * @param {Error} err
 * @param {string} sData
 * @param {string} sFile
 * @param {boolean} fTemplate
 */
HTMLOut.prototype.setData = function(err, sData, sFile, fTemplate)
{
    if (err) {
        HTMLOut.logError(err);
        sData = "unable to read " + sFile;
        fTemplate = false;
    }

    if (!fTemplate || !sData) {
        this.done(null, sData);
        return;
    }

    /*
     * Copy the HTML template, and then start finding/replacing tokens.
     *
     * We cheat slightly and insert one of those tokens right now, because otherwise
     * the template file itself would not render correctly in your web browser.
     */
    this.sTemplate = sData; // .replace("/modules/shared/templates/common.css", "/versions/pcx86/<!-- pcjs:version -->/common.css");
    this.sHTML = this.sTemplate;

    /*
     * But first, let's automatically massage any URLs in the template file.
     */
    var link;
    var reLinks = /(<a[^>]*?\shref=)(['"])([^'"]*)(\2[^>]*>)/gi;
    while ((link = reLinks.exec(this.sTemplate))) {
        var sReplacement = link[1] + link[2] + net.encodeURL(link[3], this.req, this.fDebug) +  link[4];
        this.sHTML = this.sHTML.replace(link[0], sReplacement);
    }

    var reTokens = /([ \t]*)<!--\s*([a-z]+):([a-z]+)(\(.*?\)|)\s*-->/gi;
    this.findTokens(reTokens);
};

/**
 * findTokens()
 *
 * @this {HTMLOut}
 * @param {RegExp} reTokens
 */
HTMLOut.prototype.findTokens = function(reTokens)
{
    while (true) {
        var token = reTokens.exec(this.sTemplate);
        if (!token) break;
        var sIndent = token[1];

        /*
         * As per the warning in replaceTokens(), we must beware of token characters that have special meaning
         * when parsed as a regular expression; for example, if there are any opening or closing parentheses in
         * the token, each must be escaped.
         */
        var sToken = token[0].substr(sIndent.length);
        sToken = sToken.replace(/([()*])/g, "\\$1");

        if (this.aTokens[sToken] === undefined) {
            this.aTokens[sToken] = "";
            if (HTMLOut.tokenFunctions[token[2]] !== undefined) {
                var fnToken = HTMLOut.tokenFunctions[token[2]][token[3]];
                if (fnToken !== undefined) {
                    this.aTokens[sToken] = null;
                    if (fnToken === null) {
                        this.aTokens[sToken] = undefined;
                        continue;
                    }
                    var aParms = [];
                    if (token[4]) {
                        var aMatch;
                        var reParms = /"(.*?)"/g;
                        while ((aMatch = reParms.exec(token[4]))) {
                            aParms.push(aMatch[1]);
                        }
                    }
                    fnToken.call(this, sToken, sIndent, aParms);
                }
            }
            /*
             *  We could yield here after every newly discovered token, but our templates
             *  are pretty simple, so I doubt finding all of them will take significant time.
             *
             *      var obj = this;
             *      setImmediate(function() { obj.findTokens(reTokens); });
             *      return;
             */
        }
    }
    this.replaceTokens();
};

/**
 * replaceTokens()
 *
 * @this {HTMLOut}
 */
HTMLOut.prototype.replaceTokens = function()
{
    var fPending = false;

    for (var sToken in this.aTokens) {

        if (!this.aTokens.hasOwnProperty(sToken)) continue;

        var sReplacement = this.aTokens[sToken];

        /*
         *  Skip tokens that have already been replaced.
         */
        if (sReplacement === undefined) {
            continue;
        }

        /*
         *  Unknown (null) tokens are pending replacements, which occur when a template function is waiting
         *  for a callback; the callback is required to call replaceTokens() once the replacement is known,
         *  starting the replacement process over again (eg, see getDirList()).
         */
        if (sReplacement === null) {
            fPending = true;
            continue;
        }

        // HTMLOut.logDebug('HTMLOut.replaceTokens: replacing "' + sToken + '" with "' + sReplacement + '"');

        /*
         * WARNING: Beware of tokens containing characters that have special meaning within regular
         * expressions; otherwise, this global search-and-replace will fail in unexpected ways.
         */
        this.sHTML = this.sHTML.replace(new RegExp(sToken, "g"), sReplacement);

        /*
         *  Mark the token as replaced, by setting it to undefined (it's tempting to simply "delete" it,
         *  but that would modify the object we're iterating over, which would be bad form).
         */
        this.aTokens[sToken] = undefined;
    }

    if (!fPending) {
        /*
         * Remove any lingering HTML/JavaScript comments and unnecessary scripts
         */
        this.sHTML = this.sHTML.replace(/[ \t]*<!--[\s\S]*?-->[\r\n]*/g, "");
        if (!this.fRandomize) {
            this.sHTML = this.sHTML.replace(/[ \t]*<script id="randomize"[\s\S]*?<\/script>[\r\n]*/g, "");
        }

        if (this.sCacheFile) {

            HTMLOut.logConsole('HTMLOut.writeFile("' + this.sCacheFile + '")');

            var today = new Date();
            this.sHTML = this.sHTML.replace(/(<body[^>]*>)(\s*)/, "$1$2<!-- " + sDefaultFile + " generated on " + today.toString() + " -->$2");

            fs.writeFile(this.sCacheFile, this.sHTML, function doneWriteFileReplaceTokens(err) {
                HTMLOut.logError(err);
            });
        }
        this.done(null, this.sHTML);
    }
};

/**
 * getTitle(sToken, sIndent, aParms)
 *
 * aParms[0], if present, is used as the preferred title for the home page
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 */
HTMLOut.prototype.getTitle = function(sToken, sIndent, aParms)
{
    this.aTokens[sToken] = ((this.req.path == "/" && aParms[0])? aParms[0] : this.req.path);
};

/**
 * getVersion(sToken, sIndent, aParms)
 *
 * Returns the current version in "package.json".
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 */
HTMLOut.prototype.getVersion = function(sToken, sIndent, aParms)
{
    /*
     * Use the same test that processMachines() uses for setting fCompiled: if we're not using compiled code,
     * then we should be using "current" CSS and template files (as opposed to version-specific template files).
     *
     * NOTE: I used to create a symlink in each app's "versions" directory (eg, /versions/pcx86/current ->
     * ../../modules/shared/templates), so that when fDebug was true, I could simply insert "current" in
     * place of a version number.  However, that symlink didn't get added to the repository, and I'm not sure
     * all operating systems would deal with it properly even if was added, so now I'm treating the "version"
     * token as the equivalent of a symlink here.
     */
    this.aTokens[sToken] = this.fDebug? "../../modules/shared/templates" : machines.shared.version;
};

/**
 * getPath(sToken, sIndent, aParms)
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 */
HTMLOut.prototype.getPath = function(sToken, sIndent, aParms)
{
    this.aTokens[sToken] = this.req.path;
};

/**
 * getPCPath(sToken, sIndent, aParms)
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 */
HTMLOut.prototype.getPCPath = function(sToken, sIndent, aParms)
{
    /*
     * SIDEBAR: We must use a regular expression to replace all forward slashes with backslashes, because
     * the string form of JavaScript's replace() method replaces only the FIRST occurrence of the search string.
     */
    var s = this.req.path.replace(/\//g, "\\").toUpperCase();
    /*
     * Remove any trailing backslash from the final result.
     */
    if (s.slice(-1) == '\\') s = s.slice(0, -1);
    this.aTokens[sToken] = s;
};

/**
 * getDirList(sToken, sIndent, aParms)
 *
 * Generate a list element for every subdirectory; each list element should look like:
 *
 *      <li>
 *          <a href="/apps/">[apps]</a>
 *      </li>
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 */
HTMLOut.prototype.getDirList = function(sToken, sIndent, aParms)
{
    var obj = this;

    fs.readdir(this.sDir, function doneReadDirList(err, asFiles) {
        if (err) {
            obj.aTokens[sToken] = HTMLOut.logError(err);
        } else {
            var sList = "";

            /*
             * We only want a parent directory entry if we're processing a file rather than a directory.
             */
            if (obj.sExt) asFiles = [];

            /*
             * We add an entry for the parent directory; when we call path.join() with obj.req.path,
             * the ".." will be replaced by the actual path to the parent, and if there is no parent
             * (ie, path.join() returns obj.req.path unmodified), we will discard the entry at that point.
             */
            asFiles.push("..");

            /*
             * For sorting purposes, I want all folders ending in "kb" and beginning with one to three
             * digits to sort as if they all began with FOUR digits (ie, with leading zeros as needed).
             * But I don't want to change the folder names that are ultimately displayed.  So instead,
             * I pad those names with slashes, since a leading slash will sort much like a leading zero
             * without being a valid filename character, meaning we can trim away those leading slashes
             * with impunity after the sort is done.
             *
             * Why does this work? The ASCII value of '0' is 48, whereas the ASCII value of '/' is 47,
             * so there are no intervening characters that could sort differently.
             */
            var re = /^([0-9]+)(kb|mb)$/i;
            for (var i = 0; i < asFiles.length; i++) {
                var match = re.exec(asFiles[i]);
                if (match) asFiles[i] = "///".substr(0, 4 - match[1].length) + asFiles[i];
            }

            if (path.basename(obj.sPath) != "blog") {
                asFiles.sort();
            } else {
                asFiles.sort(function(a, b) {return a < b? 1 : -1;});
            }

            for (var iFile = 0; iFile < asFiles.length; iFile++) {
                var sBaseName = asFiles[iFile].replace(/\//g, "");

                /*
                 * The only exception we currently make to the "no filenames with leading periods" rule
                 * is the parent directory entry that we explicitly added above.
                 */
                var iExt = sBaseName.lastIndexOf('.');
                if (sBaseName == "..") {
                    iExt = -1;
                } else if (sBaseName.charAt(0) == '.') {
                    continue;
                }
                var sExt = (iExt > 0? sBaseName.substr(iExt+1) : "");

                if (!obj.fDebug) {
                    if (sBaseName.indexOf("-debug") > 0) continue;
                    if (asExtsNonServed.indexOf(sExt) >= 0) continue;
                    if (asExtsNonListed.indexOf(sExt) >= 0) continue;
                    if (asFilesNonServed.indexOf(sBaseName) >= 0) continue;
                    if (asFilesNonListed.indexOf(sBaseName) >= 0) continue;
                } else {
                    /*
                     * Even when the server's in Debug mode, there are some files it makes no sense to list.
                     */
                    if (sBaseName == "index.html") continue;
                }

                /*
                 * If path.join() returns obj.req.path unmodified, we treat that as a sign we're at
                 * sServerRoot (ie, that sFile is ".." and there is no parent), so we discard the entry.
                 *
                 * IISNode hack: path.join() may return paths with backslashes, so convert back to slashes.
                 *
                 * Yes, encodeURL() would take care of that for us, but we must also perform some preliminary
                 * checks on sURL first, and having consistent slash-based paths make those checks simpler.
                 */
                var sURL = path.join(obj.req.path, sBaseName).replace(/\\/g, '/');
                if (sURL.length == obj.req.path.length) continue;

                /*
                 * Here's where we make the same assumption that filter() makes; ie, that any basename
                 * without a file extension (period) -- or a period followed by one or more digits -- should
                 * be considered a directory, and should therefore include a trailing slash, to minimize
                 * unnecessary redirects.  Unless, of course, the path is already a lone slash (ie, the root).
                 */
                var fDir = false;
                if (sURL == '/' || sBaseName == "..") {
                    fDir = true;
                    if (sURL != '/') sURL += '/';
                } else if (asNonDirectories.indexOf(sBaseName) < 0 && (iExt < 0 || sBaseName.match(/\.[0-9]+[Ma-c]?$/))) {
                    fDir = true;
                    sURL += '/';
                }
                sURL = net.encodeURL(sURL, obj.req, obj.fDebug);

                /*
                 * Here's where we add some code to massage disk image links: if this is a ".json" file in the
                 * /disks folders OR the basename contains "disk", then transform the link into one that will
                 * return an ".img" file when clicked (adapted from the code in browseFolder() in transform.php).
                 *
                 * We assume someone accessing/downloading such a file would rather have it in its original binary
                 * form rather than its JSON-ified form (which is all we typically check into the project).
                 */
                var sOnClick = "";
                if (sExt == DumpAPI.FORMAT.JSON && (sURL.indexOf("/disks/") === 0 || sBaseName.indexOf("disk") >= 0)) {
                    sOnClick = obj.genOnClick(sURL);
                }

                /*
                 * The following code would similarly convert any links to ".img" files to a JSON stream, but I'm
                 * not sure we really need to support the reverse of the above.
                 *
                 *      if (sExt == DumpAPI.FORMAT.IMG) {
                 *          sOnClick = obj.genOnClick(sURL, DumpAPI.FORMAT.JSON);
                 *      }
                 */

                sBaseName = '\\' + sBaseName.toUpperCase();
             // if (fDir) sBaseName = sBaseName + '\\';

                sList += sIndent + '\t<li><a href="' + sURL + '"' + sOnClick + '>' + sBaseName + '</a></li>\n';
            }
            if (sList) sList = '<ul class="common-list">\n' + sIndent + '\t' + sList.trim() + '\n' + sIndent + '</ul>';
            obj.aTokens[sToken] = sList;
        }
        obj.replaceTokens();
    });
};

/**
 * getYear(sToken, sIndent, aParms)
 *
 * Return the current year.
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 */
HTMLOut.prototype.getYear = function(sToken, sIndent, aParms)
{
    var year = new Date().getFullYear();
    if (year < 2015) year = 2015;
    this.aTokens[sToken] = year.toString();
};

/**
 * getBlog(sToken, sIndent, aParms)
 *
 * If we're in the "blog" folder, then enumerate all available blog entries and create a rendering of blog excerpts.
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 * @return {boolean} true if blog folder, false if not
 */
HTMLOut.prototype.getBlog = function(sToken, sIndent, aParms)
{
    var obj = this;

    if (this.sExt == "md") return false;

    if (this.sPath.match(/[\/\\]blog/)) {
        /*
         * The original blog structure created for the Node web server organized posts within
         * date-based subdirectories under "/blog", but the new blog structure for GitHub Pages is
         * date-based filenames within a single "_posts" directory.
         */

        var sDir = path.join(this.sDir, "*.md");
        // var sDir = path.join(this.sDir, "**/README.md");

        /*
         * WARNING: On Azure, this.sDir will contain backslashes instead of slashes, which means
         * you'd also expect the results from glob() to contain backslashes as well -- but they don't.
         *
         * For example, sDir on Azure is typically:
         *
         *      D:\home\site\wwwroot\blog\**\README.md
         *
         * but the results from glob() typically look like:
         *
         *      'D:/home/site/wwwroot/blog/2014/01/README.md',
         *      'D:/home/site/wwwroot/blog/2013/11/README.md'
         *
         * However, it would be VERY unwise to rely on that behavior.  Let's continue to operate in a
         * path-separator-agnostic mode, like passing any URL we form from these paths through encodeURL().
         */
        glob(sDir, {nosort: true}, function doneGlobForBlog(err, asDirs) {
            asDirs.sort(function(a, b) {return a < b? 1 : -1;});
            /*
             * Sorting the list of blog files now was all well and good, except that there's
             * no guarantee the readFile() callbacks will return in the same order we issue them.
             *
             * To deal with that, we turn asDirs into aExcerpts: an array of objects (instead of
             * strings) that can hold the excerpts.  We'll plug the excerpts into aExcerpts as they
             * come in, and then we'll assemble them all at the end.
             *
             * We also take this opportunity to cap the number of (most recent) excerpts.
             */
            var i;
            var cExcerpts = Math.min(asDirs.length, nBlogExcerpts);
            var aExcerpts = new Array(cExcerpts);
            var cExcerptsRemaining = aExcerpts.length;
            for (i = 0; i < cExcerpts; i++) {
                /*
                 * If any of the paths we received appear to be the same as obj.sDir (which we can
                 * infer simply based on path lengths, without worrying about slashes vs. backslashes),
                 * then we can presume that there's a README.md in the requested directory, meaning
                 * this is probably a "leaf" folder of the blog "tree", and so it's that README.md we
                 * should display, not these excerpts -- so set the excerpt count to zero and bail.
                 *
                 * NOTE: This is no longer a valid assumption with the new blog structure for GitHub Pages.
                 *
                if (path.dirname(asDirs[i]).length - obj.sDir.length <= 0) {
                    cExcerptsRemaining = 0;
                    break;
                }
                 */
                aExcerpts[i] = {dir: asDirs[i], excerpt: ""};
            }
            if (cExcerptsRemaining) {
                for (i = 0; i < aExcerpts.length; i++) {
                    (function(iPath) {
                        var sFile = aExcerpts[iPath].dir;
                        fs.readFile(sFile, {encoding: "utf8"}, function doneReadFileForBlog(err, sPost) {
                            if (err) {
                                aExcerpts[iPath].excerpt = HTMLOut.logError(err);
                            } else {
                                sPost = sPost.replace(/\r\n/g, "\n");

                                /*
                                 * Remove any Front Matter from the top of the post, after extracting the title.
                                 */
                                var aFM = sPost.match(/^---[\s\S]*?\stitle:\s*['"]?(.*?)['"]?\s*\n[\s\S]*?---\s*/);
                                if (aFM) sPost = aFM[1] + "\n---\n\n" + sPost.substr(aFM[0].length);

                                var cch = sPost.indexOf("\n\n");
                                cch = sPost.indexOf("\n\n", cch+2);
                                if (cch >= 0) {
                                    sPost = sPost.substr(0, cch+2);
                                    /*
                                     * I believe path.dirname() always removes any trailing slash, and since
                                     * these are directories, we definitely want a trailing slash on the URL.
                                     */
                                    // var sURL = path.dirname(sFile.substr(obj.sDir.length)) + "/";

                                    var sURL = "/blog/" + path.basename(sFile);

                                    /*
                                     * I would like to annotate the excerpt with date information, which we can
                                     * derive from sFile, which should be in one of two forms:
                                     *
                                     *      YYYY/MM
                                     * or:
                                     *      YYYY/MM/DD
                                     *
                                     * We adhere to those forms because, when sorted, they produce a chronological listing.
                                     */
                                    var asParts = sFile.match(/[\/\\](\d\d\d\d)[\/\\](\d\d)[\/\\]?(\d*)/);
                                    if (!asParts) {
                                        asParts = sFile.match(/[\/\\](\d\d\d\d)-(\d+)-(\d+)-/)
                                    }
                                    if (asParts) {
                                        var iYear = parseInt(asParts[1], 10);
                                        var iMonth = parseInt(asParts[2], 10) - 1;
                                        var iDay = asParts[3]? parseInt(asParts[3], 10) : 1;
                                        var sDate = usr.formatDate(asParts[3]? "F j, Y" : "F Y", new Date(iYear, iMonth, iDay));
                                        sPost = sPost.replace(/^([^\n]*\n[^\n]*\n)/, '$1<p style="font-size:x-small;margin-top:-12px">' + sDate + '</p>\n\n');
                                    }
                                    aExcerpts[iPath].excerpt = sPost + "[Read more](" + sURL + ")...";
                                } else {
                                    aExcerpts[iPath].excerpt = "Can't parse " + sFile;
                                }
                            }
                            if (!--cExcerptsRemaining) {
                                var sExcerpts = "";
                                for (var i = 0; i < aExcerpts.length; i++) {
                                    sExcerpts += aExcerpts[i].excerpt + "\n\n";
                                }
                                var mExcerpts = new MarkOut(sExcerpts, sIndent, obj.req, aParms, obj.fDebug);
                                obj.aTokens[sToken] = mExcerpts.convertMD("    ").trim();
                                obj.replaceTokens();
                            }
                        });
                    })(i);
                }
            } else {
                obj.getManifestXML(sToken, sIndent, aParms);
            }
        });
        return true;
    }
    return false;
};

/**
 * getDefault(sToken, sIndent, aParms)
 *
 * Process whatever default document(s) are appropriate for the folder being requested.
 *
 * getBlog() gets first crack; if we're in a blog folder, it will display the appropriate blog entries.
 * If getBlog() declines the request, we move on to getManifestXML(), because we have some folders where
 * there's BOTH a manifest and a README, such as /apps/pcx86/1981/visicalc, and we want the manifest to take
 * priority.  getManifestXML() will, in turn, pass the request on to getMarkdownFile(), which will, in turn,
 * pass the request on to getMachineXML().
 *
 * If getMachineXML() declines as well, then getRandomString() is called, which is kinda useless, but better
 * than nothing (well, maybe).
 *
 * Some wrinkles have been added to the above: getManifestXML() can alternatively call getMachineXML() with a
 * specific machine XML file, which would have had the potential to bypass getMarkdownFile() altogether, so
 * getMachineXML() may now call getMarkdownFile() -- which must NOT call getMachineXML() back whenever that happens.
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 */
HTMLOut.prototype.getDefault = function(sToken, sIndent, aParms)
{
    if (this.getBlog(sToken, sIndent, aParms)) {
        return;
    }
    this.getManifestXML(sToken, sIndent, aParms);
};

/**
 * getHTMLFile(sToken, sIndent, aParms)
 *
 * If the HTML file specified by aParms[0] exists, insert its contents into the current HTML document.
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 */
HTMLOut.prototype.getHTMLFile = function(sToken, sIndent, aParms)
{
    /*
     * If we're debugging, we don't want any HTML fragments embedded (at least not the Google Analytics or
     * AdSense fragments).
     *
     * TODO: Consider a cleaner way for a tokenFunction to bypass token replacement (such as returning
     * false); findTokens() sets the current token replacement value to null, to indicate a pending replacement,
     * so currently our only bypass option is to set the token replacement value to an empty string, otherwise
     * replaceTokens() won't think we're done.
     */
    if (fServerDebug || net.hasParm(net.GORT_COMMAND, null, this.req)) {
        this.aTokens[sToken] = "";
        return;
    }

    var obj = this;
    var sFile = path.join(sServerRoot, path.dirname(sTemplateFile), aParms[0]);

    HTMLOut.logConsole('HTMLOut.getHTMLFile("' + sFile + '")');

    fs.readFile(sFile, {encoding: "utf8"}, function doneReadHTMLFile(err, s) {
        if (err) {
            HTMLOut.logError(err);
            s = "";
        }
        obj.aTokens[sToken] = s.trim();
        obj.replaceTokens();
    });
};

/**
 * getMachineXML(sToken, sIndent, aParms, sXMLFile, sStateFile)
 *
 * If "machine.xml" exists in the current directory, open it and determine if embedding it makes sense.
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>|null} [aParms]
 * @param {string|null} [sXMLFile]
 * @param {string|null} [sStateFile]
 */
HTMLOut.prototype.getMachineXML = function(sToken, sIndent, aParms, sXMLFile, sStateFile)
{
    var obj = this;
    var fFromManifest = !!sXMLFile;
    var sFile = sXMLFile? path.join(sServerRoot, sXMLFile) : path.join(this.sDir, sXMLFile = sMachineXMLFile);

    HTMLOut.logConsole('HTMLOut.getMachineXML("' + sFile + '")');

    fs.readFile(sFile, {encoding: "utf8"}, function doneReadMachineXMLFile(err, sXML) {
        var s;
        if (!err) {
            /*
             * I've made this test stricter, to ensure we're only embedding machine XML files, because trying to
             * embed other kinds of XML files (eg, those using an "outline.xsl", such as the C1P "server array" demo)
             * will fail.
             */
            var aMatch = sXML.match(/<\?xml-stylesheet.*?href="(.*?machine\.xsl)"\?>/);
            if (aMatch) {
                var sStyleSheet = aMatch[1];
                /*
                 * Recognized machine stylesheets are either production stylesheets in ("/versions/pcx86"|"/versions/c1pjs")
                 * or development stylesheets in ("/modules/pcx86/templates"|"/modules/c1pjs/templates").
                 *
                 * The common denominator in both sets is either "/pc" or "/c1p", which in turn indicates the type of machine
                 * (eg, "pcx86", "c1p", etc).
                 */
                aMatch = sStyleSheet.match(/\/(pc|c1p|pdp)([^/]*)/);
                if (aMatch) {
                    var sMachineType = aMatch[1].toUpperCase() + (aMatch[2] != "js"? aMatch[2] : "");
                    /*
                     * Since the MarkOut module already contains the ability to embed a machine definition with
                     * one simple line of Markdown-like magic, we'll create such a line and let MarkOut do the rest.
                     *
                     * The string we initialize the MarkOut object should look like one of
                     *
                     *      '[Embedded PC](machine.xml "pcx86:machineID:stylesheet:version:options:state")'
                     *      '[Embedded C1P](machine.xml "c1p:machineID:stylesheet:version:options:state")'
                     *
                     * where machineID is the machine "id" embedded in the XML, stylesheet is the path to the XML stylesheet,
                     * version is a version number ('*' or blank for the latest version, which is all we support here), and
                     * options is a comma-delimited series of, well, options; the only option we currently output is "debugger"
                     * if a <debugger> element is present in the machine XML.
                     */
                    var sMachineID = "machine" + sMachineType;  // fallback to either "machinePCx86" or "machineC1P" if no ID found
                    aMatch = sXML.match(/<machine.*?\sid=(['"])(.*?)\1[^>]*>/);
                    if (aMatch) sMachineID = aMatch[2];

                    /*
                     * WARNING: Machine XML files use machine XSL stylesheets, which are designed to transform a
                     * machine definition into a complete self-contained HTML document, which is inappropriate for
                     * embedding inside an existing HTML document, so any "machine.xsl" stylesheet must be remapped
                     * to a corresponding "components.xsl" stylesheet (which is what the next line does).
                     */
                    var sMachineDef = sMachineType + ":" + sMachineID + ":" + sStyleSheet.replace("machine.xsl", "components.xsl");
                    sMachineDef += (sXML.indexOf("<debugger") > 0? ":*:debugger" : ":*:none");
                    sMachineDef += (sStateFile? ":" + sStateFile : "");

                    s = '[Embedded ' + sMachineType + '](' + sXMLFile + ' "' + sMachineDef + '")';
                    var m = new MarkOut(s, sIndent, obj.req, null, obj.fDebug);
                    s = m.convertMD("    ").trim();
                    obj.processMachines(m.getMachines(), m.getBuildOptions(), function doneProcessXMLMachines() {
                        obj.getMarkdownFile(obj.sFile, sToken, sIndent, aParms, s, sXMLFile);
                    });
                    return;
                }
            }
        }

        /*
         * If we were called from getManifestXML(), then let's fallback to getMarkdownFile() instead.
         */
        if (fFromManifest) {
            s = sIndent + "<p>" + HTMLOut.logError(err) + " (invalid manifest entry)</p>";
            obj.getMarkdownFile(obj.sFile, sToken, sIndent, aParms, s);
            return;
        }

        /*
         * If we're still here, one of the following happened:
         *
         *      1) there was no "machine.xml"; see err for details
         *      2) there was no stylesheet specified in "machine.xml"
         *      3) the specified stylesheet in "machine.xml" was not recognized
         *
         * But, instead of displaying a cryptic error message inside our beautiful HTML template, eg:
         *
         *      HTMLOut error: ENOENT, open '/Users/Jeff/Sites/pcjs/devices/pcx86/machine/5160/cga/256kb/win101/debugger/machine.xml'
         *
         * we have one more fallback: a random string!  Less useful, but more entertaining.  Well, maybe not even that.
         *
         *      s = HTMLOut.logError(err);
         */
        obj.aTokens[sToken] = obj.getRandomString(sIndent);
        obj.replaceTokens();
    });
};

/**
 * getManifestXML(sToken, sIndent, aParms)
 *
 * If "manifest.xml" exists in the current directory, open it and embed it.
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 */
HTMLOut.prototype.getManifestXML = function(sToken, sIndent, aParms)
{
    var obj = this;
    var sXMLFile = path.join(this.sDir, sManifestXMLFile);

    HTMLOut.logConsole('HTMLOut.getManifestXML("' + sXMLFile + '")');

    fs.readFile(sXMLFile, {encoding: "utf8"}, function doneReadManifestXMLFile(err, sXML) {
        var s;
        if (!err) {
            var match = sXML.match(/<\?xml-stylesheet.*?href="(.*?manifest\.xsl)"\?>\s*<manifest[^>]* type="([^"]*)"/);
            if (match) {
                var sListItems = "";
                var sHeading = "Manifest";
                var sStyleSheet = match[1];
                var sManifestType = match[2];

                /*
                 * Manifests contain a variety of metadata describing software or documentation, which we display
                 * in a "common-list-data" list.  Those data items are already listed in "manifest.xsl", so to minimize
                 * redundancy, I read the XSL file and enumerate the items to, uh, be enumerated.
                 */
                var sXSLFile = path.join(sServerRoot, sStyleSheet);
                fs.readFile(sXSLFile, {encoding: "utf8"}, function doneReadManifestXSLFile(err, sXSL) {
                    if (!err) {
                        var reTemplate = new RegExp("<xsl:template match=\"/manifest\\[@type\\s*=\\s*'" + sManifestType + "'[^>]*>([\\s\\S]*?)</xsl:template>");
                        var matchXSL = sXSL.match(reTemplate);
                        var sXSLTemplate = (matchXSL? matchXSL[1] : "");
                        var fCreationDate = false;
                        var matchItem, matchParams;
                        var sName = null, sVersion = null;
                        var reItems = /<xsl:call-template name="listItem">([\s\S]*?)<\/xsl:call-template>/g;
                        var reParams = /<xsl:with-param name="([^"]*)"\s+select="'?([^"']*)'?"[^>]*\/>/g;
                        while ((matchItem = reItems.exec(sXSLTemplate))) {
                            var sLabel = null, sNode = null, sDefault = null;
                            while ((matchParams = reParams.exec(matchItem[0]))) {
                                switch(matchParams[1]) {
                                case "label":
                                    sLabel = matchParams[2];
                                    break;
                                case "node":
                                    sNode = matchParams[2];
                                    if (!sLabel && sNode == "releaseDate") sLabel = (fCreationDate? "Updated" : "Released");
                                    break;
                                case "default":
                                    sDefault = matchParams[2];
                                    break;
                                default:
                                    break;
                                }
                            }
                            if (sLabel) {
                                var matchNode;
                                var fMatch = false;
                                var reNodes = new RegExp('<' + sNode + '([^>]*)>([\\s\\S]*?)</' + sNode + '>', "g");
                                while ((matchNode = reNodes.exec(sXML))) {

                                    var sNodeDesc = "", sNodeValue = matchNode[2];
                                    match = sNodeValue.match("<desc[^>]*>(.*?)</desc>");
                                    if (match) {
                                        sNodeDesc = match[1];
                                    } else {
                                        match = sNodeValue.match("<org[^>]*>(.*?)</org>");
                                        if (match) sNodeDesc = match[1];
                                    }

                                    match = sNodeValue.match("<name[^>]*>(.*?)</name>");
                                    if (match) {
                                        sNodeValue = match[1];
                                    } else if (!sNodeValue || sNodeValue.indexOf('<') >= 0) {
                                        if (!sDefault && sNode == "disk") {
                                            sDefault = (sName? sName + (sVersion? ' ' + sVersion : '') : '');
                                        }
                                        sNodeValue = sDefault;
                                    }

                                    if (!sNodeValue) continue;
                                    if (sNode == "name") sName = sNodeValue;
                                    if (sNode == "version") sVersion = sNodeValue;
                                    if (sNode == "creationDate") fCreationDate = true;

                                    var sNodeLink = "", sOnClick = "";
                                    if (matchNode[1] && (match = matchNode[1].match(/ href=(['"])(.*?)\1/))) {
                                        sNodeLink = match[2];
                                    }

                                    var matchCover = null;
                                    match = matchNode[2].match('<cover[^>]*href="([^"]*)"');
                                    if (match && match[1].indexOf("archive/") >= 0) {
                                        matchCover = match[1];
                                        if (obj.fDebug) {
                                            sNodeLink = matchCover.replace("/thumbs/", '/').replace(/ ?[0-9]*\.(jpeg|jpg)/, ".pdf");
                                        }
                                    }

                                    if (sNodeLink) {
                                        if (str.endsWith(sNodeLink, ".json") && (!sNodeLink.indexOf("/apps/") || !sNodeLink.indexOf("/disks/"))) {
                                            sOnClick = obj.genOnClick(sNodeLink);
                                        }
                                        sNodeValue = '<a href="' + net.encodeURL(sNodeLink, obj.req, obj.fDebug) + '"' + sOnClick + '>' + sNodeValue + '</a>';
                                    }

                                    var sItemPages = "";
                                    var rePages = /<page([^>]*)>([^<]*)<\/page>/g;
                                    while ((match = rePages.exec(matchNode[2]))) {
                                        var sPageName = match[2];
                                        match = match[1].match(/ href="([^"]*)"/);
                                        var sPageLink = (match? match[1] : null);
                                        if (sPageLink) {
                                            if (sPageLink.charAt(0) == '#') {
                                                match = sPageLink.match(/page=([0-9]+)/);
                                                if (!match || !matchCover) {
                                                    sPageLink = sNodeLink + sPageLink;
                                                } else {
                                                    sPageLink = matchCover.replace("/thumbs/", '/pages/').replace(/( ?)[0-9]*\.(jpeg|jpg)/, "$1" + match[1] + ".pdf");
                                                }
                                            }
                                            //noinspection JSCheckFunctionSignatures
                                            sPageName = '<a href="' + net.encodeURL(sPageLink, obj.req, obj.fDebug) + '" target="_blank">' + sPageName + '</a>';
                                        }
                                        sItemPages += sIndent + '\t\t\t<li>' + sPageName + '</li>\n';
                                    }

                                    if (!fMatch) {
                                        sListItems += sIndent + '\t<li>' + sLabel + '\n';
                                        sListItems += sIndent + '\t\t<ul class="common-list-data-items">\n';
                                        fMatch = true;
                                    }

                                    sListItems += sIndent + '\t\t\t<li' + (sNodeDesc? ' title="' + sNodeDesc + '"' : '') + '>' + sNodeValue;
                                    if (sItemPages) {
                                        sListItems += '\n' + sIndent + '\t\t<ul class="common-list-data-subitems">\n' + sItemPages + sIndent + '\t\t</ul>';
                                    }
                                    sListItems += '\n' + sIndent + '\t\t\t</li>\n';
                                }
                                if (fMatch) {
                                    sListItems += sIndent + '\t\t</ul>\n';
                                    sListItems += sIndent + '\t</li>\n';
                                }
                            }
                        }

                        sListItems = '<h4><a href="' + sManifestXMLFile + '">' + sHeading + '</a></h4>\n' + sIndent + '<ul class="common-list-data">\n' + sListItems + sIndent + '</ul>\n';
                        obj.aTokens["<!-- pcjs:manifest -->"] = sListItems;

                        var sXMLFile = null, sStateFile = null;
                        var matchMachine = sXML.match(/<machine(.*?)\/>/);
                        if (matchMachine) {
                            if ((match = matchMachine[1].match(/ href=(['"])(.*?)\1/))) {
                                sXMLFile = match[2];
                            }
                            if ((match = matchMachine[1].match(/ state=(['"])(.*?)\1/))) {
                                sStateFile = match[2];
                            }
                        }
                        /*
                         * Because it's common (and preferred, actually) to have a README.md file accompany a manifest,
                         * and because README.md files offer the preferred way to embed machines, we no longer immediately
                         * process any machine file specified by the manifest.  Instead, we pass along sXMLFile and
                         * sStateFile to getMarkdownFile(), which it will use if no README.md exists.
                         *
                         *  if (sXMLFile) {
                         *      obj.getMachineXML(sToken, sIndent, null, sXMLFile, sStateFile);
                         *      return;
                         *  }
                         */
                    }
                    /*
                     * If we're still here, then there was either a problem reading the manifest XSL file,
                     * or the manifest XML file didn't contain a machine reference (or, as explained above, we
                     * simply prefer to process README.md files first), so we fall back to getMarkdownFile().
                     */
                    obj.getMarkdownFile(obj.sFile, sToken, sIndent, aParms, null, sXMLFile, sStateFile);
                });
                return;
            }
        }
        /*
         * If we're still here, then there was either a problem reading the manifest XML file, or it didn't
         * contain a recognized stylesheet.  For now, we fall back to getMarkdownFile().
         */
        obj.getMarkdownFile(obj.sFile, sToken, sIndent, aParms);
    });
};

/**
 * getMarkdownFile(sFile, sToken, sIndent, aParms, sPrevious, sXMLFile, sStateFile)
 *
 * If sFile exists in the current directory, open it, convert it, and prepare for replacement.
 *
 * @this {HTMLOut}
 * @param {string} sFile
 * @param {string} [sToken]
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 * @param {string|null} [sPrevious] is text, if any, that should precede the file
 * @param {string} [sXMLFile] name (if any) of a default machine.xml
 * @param {string} [sStateFile] name (if any) of a default state file
 */
HTMLOut.prototype.getMarkdownFile = function(sFile, sToken, sIndent, aParms, sPrevious, sXMLFile, sStateFile)
{
    var obj = this;

    var sFilePath = path.join(this.sDir, sFile);

    HTMLOut.logConsole('HTMLOut.getMarkdownFile("' + sFilePath + '")');

    fs.readFile(sFilePath, {encoding: "utf8"}, function doneMarkdownFile(err, s) {
        if (err) {
            /*
             * HACK to look for a "machine.md" if our attempt to load a "README.md" failed.
             */
            if (sFile.indexOf(sReadMeFile) >= 0) {
                sFile = sFile.replace(sReadMeFile, sMachineMDFile);
                obj.getMarkdownFile(sFile, sToken, sIndent, aParms, sPrevious, sXMLFile, sStateFile);
                return;
            }
            /*
             * Instead of displaying a cryptic error message inside our beautiful HTML template, eg:
             *
             *      HTMLOut error: ENOENT, open '/Users/Jeff/Sites/pcjs/devices/pcx86/machine/5160/cga/256kb/win101/debugger/README.md'
             *
             * which is all this will give us:
             *
             *      s = HTMLOut.logError(err);
             *
             * we now try some fallbacks, like checking for a "machine.xml" -- but only if sPrevious is not defined.
             */
            if (sToken) {
                if (sPrevious != null) {                // this means getMachineXML() called us, so it's the end of road
                    obj.aTokens[sToken] = sPrevious;
                    obj.replaceTokens();
                } else {                                // we don't pass along aParms, because those are for Markdown files only
                    obj.getMachineXML(sToken, sIndent, null, sXMLFile, sStateFile);
                }
            }
        } else {
            var m = new MarkOut(s, sIndent, obj.req, aParms, obj.fDebug, sXMLFile, obj.sExt == "md");
            s = m.convertMD("    ").trim();

            if (sXMLFile && m.hasMachines()) sPrevious = null;

            /*
             * If the Markdown document begins with a heading, stuff that into the <title> tag;
             * it would be cleaner if this replacement could be performed by getTitle(), but unfortunately,
             * getTitle() is called long before we're called.
             */
            var match = s.match(/^\s*<h([0-9])[^>]*>(.*?)<\/h\1>/);
            if (match) {
                var sTitle = match[2];
                match = sTitle.match(/<a [^>]*>([^<]*)<\/a>/);
                if (match) sTitle = match[1];
                obj.sHTML = obj.sHTML.replace(/(<title[^>]*>)([^|]*)\|[^<]*(<\/title>)/, "$1$2| " + sTitle + "$3");
            }

            /*
             * Similarly, if the Markdown document contains any style definitions, we "paste" them in now.
             */
            var aStyleDefs = m.getStyles();
            if (aStyleDefs) {
                var sStyles = '<style type="text/css">\n';
                for (var id in aStyleDefs) {
                    sStyles += (id[0] != '.'? '#' : "") + id + ' {\n' + aStyleDefs[id] + '\n}\n';
                }
                sStyles += '</style>\n';
                obj.sHTML = obj.sHTML.replace(/([ \t]*<\/head>)/, sStyles + "$1");
            }

            /*
             * We need to query the MarkOut object for any machine definitions that the current Markdown
             * document contained and give them to processMachines(), so that any associated scripts can
             * be added to the current page.
             *
             * However, processMachines() may need to search the file system for the appropriate scripts,
             * and since that may not finish immediately, we defer updating the Markdown token, if any, until
             * the processMachines() callback has been called.  This insures that the HTML page will not be
             * delivered until all associated scripts for all machine definitions have been added.
             *
             * Note that if we ever decide to support more than one Markdown document (or "readme" token)
             * per HTML page, it may be better to collect all the machine definitions in an array, eliminate
             * any duplicates from that array, and then call processMachines() at some later point, after
             * all tokens have been replaced.
             */
            obj.processMachines(m.getMachines(), m.getBuildOptions(), function doneProcessMachines() {
                if (sToken) {
                    obj.aTokens[sToken] = sPrevious? (sPrevious + sIndent + s) : s;
                    obj.replaceTokens();
                }
            });
        }
    });
};

/**
 * getSocketScripts(sToken, sIndent, aParms)
 *
 * @this {HTMLOut}
 * @param {string} sToken
 * @param {string} [sIndent]
 * @param {Array.<string>} [aParms]
 */
HTMLOut.prototype.getSocketScripts = function(sToken, sIndent, aParms)
{
    this.aTokens[sToken] = (fSockets? '<script type="text/javascript" src="/socket.io/socket.io.js"></script>\n' + sIndent + '<script type="text/javascript" src="/modules/shared/lib/sockets.js"></script>' : "");
};

/**
 * getRandomString(sIndent)
 *
 * Generate a random string of words, purely for entertainment purposes (eg, something in honor of "ADVENT").
 *
 * @this {HTMLOut}
 * @param {string} [sIndent]
 * @return {string}
 */
HTMLOut.prototype.getRandomString = function(sIndent)
{
    var s = "";
    var asNouns = ["maze", "passages"];
    var asAdjectives = ["little", "twisty|twisting"];

    while (asNouns.length) {
        var cAdjectives = Math.floor(Math.random() * Math.min(2, asAdjectives.length));
        while (cAdjectives--) {
            var iAdjective = Math.floor(Math.random() * asAdjectives.length);
            var sAdjective = asAdjectives[iAdjective];
            var asVariations = sAdjective.split("|");
            sAdjective = asVariations[Math.floor(Math.random() * asVariations.length)];
            if (s) s += " ";
            s += sAdjective;
            asAdjectives.splice(iAdjective, 1);
        }
        if (s) s += " ";
        s += asNouns[0];
        asNouns.splice(0, 1);
        if (asNouns.length) s += " of";
    }
    s = sIndent + '<p id="random">You are in a ' + s + ', all ' + (Math.floor(Math.random() * 2)? 'alike' : 'different') + '.</p>\n';
    this.fRandomize = true;
    return s;
};

/**
 * processMachines(aMachines, buildOptions, done)
 *
 * At a minimum, each machine object should contain the following properties:
 *
 *      'type' (eg, a machine type, such as "c1p", "pcx86", "pc8080", "pdp10", or "pdp11")
 *      'version' (eg, "1.10", "*" to select the current version, or "uncompiled"; "*" is the default)
 *      'debugger' (eg, true or false; false is the default)
 *
 * @this {HTMLOut}
 * @param {Array} aMachines is an array of objects containing information about each machine on the current page
 * @param {Object} buildOptions
 * @param {function()} done
 */
HTMLOut.prototype.processMachines = function(aMachines, buildOptions, done)
{
    for (var iMachine = 0; iMachine < aMachines.length; iMachine++) {

        var infoMachine = aMachines[iMachine];

        HTMLOut.logDebug('HTMLOut.processMachines(' + JSON.stringify(infoMachine) + ')');

        var sType = infoMachine['type'];
        var machineConfig = machines[sType];
        while (machineConfig && machineConfig['alias']) {
            machineConfig = machines[machineConfig['alias']];
        }
        if (!machineConfig) {
            HTMLOut.logDebug('HTMLOut.processMachines(): unrecognized machine type "' + sType + '"');
            continue;
        }

        var fCompiled = !this.fDebug;
        var sVersion = infoMachine['version'];
        if (sVersion === undefined || sVersion == '*') {
            sVersion = machineConfig['version'] || machines.shared.version;
        } else {
            fCompiled = (sVersion != "uncompiled");
        }

        var fDebugger = infoMachine['debugger'];
        if (fDebugger === undefined) fDebugger = false;         // default to no debugger

        var fNoDebug = !this.fDebug;
        if (net.hasParm(net.GORT_COMMAND, net.GORT_NODEBUG, this.req)) {
            fNoDebug = true;
            fCompiled = false;
        }

        var sScriptEmbed = "";
        var sCreator = machineConfig['creator'];
        if (sCreator) {
            sScriptEmbed = '<script type="text/javascript">';
            if (sCreator.indexOf("new ") >= 0) {
                sCreator = "new window." + sCreator.substr(4);
                sScriptEmbed += sCreator + "('" + infoMachine['id'] + "','" + infoMachine['config'].replace(/\n/g, '\\n') + "');"
            } else {
                sScriptEmbed += 'window.' + sCreator;
                sScriptEmbed += "('" + infoMachine['id'] + "','" + infoMachine['xml'] + "'";
                sScriptEmbed += (infoMachine['xsl']? (",'" + infoMachine['xsl'] + "'") : ",''");
                sScriptEmbed += (infoMachine['parms']? (",'" + infoMachine['parms'] + "'") : '') + ');';
            }
            sScriptEmbed += '</script>';
        }

        var asFiles = [];
        if (fCompiled) {
            var sScriptFile = sType + (fDebugger? "-dbg" : "") + ".js";
            asFiles.push("/versions/" + machineConfig['folder'] + "/" + sVersion + "/components.css");
            asFiles.push("/versions/" + machineConfig['folder'] + "/" + sVersion + "/" + sScriptFile);
        }
        else {
            asFiles = machineConfig['styles'] || machines.shared['styles'];
            asFiles = asFiles.concat(machineConfig['scripts']);
            /*
             * SIDEBAR: Why the "slice()"?  It's a handy way to create a copy of the array, and we need a copy,
             * because if it turns out we need to "cut out" some of the files below (using splice), we don't want that
             * affecting the original array.
             */
            asFiles = asFiles.slice();
            /*
             * We need to find the shared "defines.js" source file, because we may need to follow it
             * with "nodebug.js" and/or "private.js".
             */
            for (var i = 0; i < asFiles.length; i++) {
                if (asFiles[i].indexOf("shared/lib/defines.js") >= 0) {
                    if (fPrivate) {
                        asFiles.splice(i + 1, 0, asFiles[i].replace("defines.js", "private.js"));
                    }
                    if (fNoDebug) {
                        asFiles.splice(i + 1, 0, asFiles[i].replace("defines.js", "nodebug.js"));
                    }
                    break;
                }
            }
            if (!fDebugger) {
                /*
                 * Step 1: We need to find the client's "defines.js" source file, and follow it with "nodebugger.js".
                 */
                for (i = 0; i < asFiles.length; i++) {
                    if (asFiles[i].indexOf("js/lib/defines.js") >= 0) {
                        asFiles.splice(i + 1, 0, asFiles[i].replace("defines.js", "nodebugger.js"));
                        break;
                    }
                }
                /*
                 * Step 2: If there are "debugger.js" source files in the list of uncompiled files, we need to remove
                 * them, which we do by using the Array splice() method, removing the matching element(s) from the array.
                 */
                for (i = 0; i < asFiles.length; i++) {
                    if (asFiles[i].indexOf("/debugger.js") >= 0) {
                        asFiles.splice(i, 1);
                        i--;
                    }
                }
            }
        }

        this.addFilesToHTML(asFiles, sScriptEmbed);

        if (infoMachine['sticky']) {
            asFiles = [];
            asFiles.push("/modules/shared/lib/sticky.js");
            sScriptEmbed = '<script type="text/javascript">addStickyMachine("' + infoMachine['id'] + '")</script>';
            this.addFilesToHTML(asFiles, sScriptEmbed);
        }

        if (buildOptions.id) {
            asFiles = [];
            asFiles.push("/modules/build/lib/build.js");
            sScriptEmbed = '<script type="text/javascript">buildPC("' + buildOptions.id + '")</script>';
            this.addFilesToHTML(asFiles, sScriptEmbed);
        }
    }
    if (done) done();
};

/**
 * addFilesToHTML(asFiles, sScriptEmbed)
 *
 * @this {HTMLOut}
 * @param {Array.<string>} asFiles is a list of CSS and/or JS files to include in the HTML
 * @param {string} [sScriptEmbed] is an optional script to embed in the <body> (after any JS files listed above)
 */
HTMLOut.prototype.addFilesToHTML = function(asFiles, sScriptEmbed)
{
    for (var sTag in aMachineFileTypes) {
        var aMatch = this.sHTML.match(new RegExp("<" + sTag + ">\n?([ \t]*)([\\s\\S]*?)[\n \t]*</" + sTag + ">", "i"));
        if (aMatch) {
            var sTextInsert = "";
            var sIndent = aMatch[1];
            var sText = aMatch[2];
            for (var iExt = 0; iExt < aMachineFileTypes[sTag].length; iExt++) {
                var sExt = aMachineFileTypes[sTag][iExt];
                for (var i = 0; i < asFiles.length; i++) {
                    var sFile = asFiles[i];
                    /*
                     * If the filenames coming from "package.json" begin with "./", strip the leading period.
                     */
                    if (sFile.substr(0, 2) == "./") sFile = sFile.substr(1);
                    /*
                     * SIDEBAR: substr(-4) is another way to extract the last 4 characters of a string,
                     * but it's non-standard (eg, early versions of IE didn't support it), so if you want to extract
                     * from the end of a string, using slice() with negative indexes is the safer way to go.
                     */
                    var sInsert;
                    if (sFile.slice(-sExt.length) == sExt) {
                        if (sExt == ".css") {
                            sInsert = '\n' + sIndent + '<link rel="stylesheet" type="text/css" href="' + sFile + '">';
                            if (sText.indexOf(sInsert) < 0) {
                                sTextInsert += sInsert;
                            }
                        }
                        else if (sExt == ".js") {
                            sInsert = '\n' + sIndent + '<script type="text/javascript" src="' + sFile + '"></script>';
                            if (sText.indexOf(sInsert) < 0) {
                                sTextInsert += sInsert;
                            }
                        }
                    }
                }
            }
            if (sScriptEmbed && sTag == "body") {
                sTextInsert += '\n' + sIndent + sScriptEmbed;
            }
            if (sTextInsert) {
                this.sHTML = str.replace(sText, sText + sTextInsert, this.sHTML);
            }
        }
        else {
            HTMLOut.logError(new Error("missing <" + sTag + "> in HTML template"));
        }
    }
};

/**
 * genOnClick(sURL)
 *
 * @this {HTMLOut}
 * @param {string} sURL
 * @param {string} [sFormat] (default is DumpAPI.FORMAT.IMG)
 * @return {string}
 */
HTMLOut.prototype.genOnClick = function(sURL, sFormat)
{
    return " onclick=\"window.location='" + DumpAPI.ENDPOINT + "?" + DumpAPI.QUERY.DISK + "=" + sURL.replace('?', '&') + "&" + DumpAPI.QUERY.FORMAT + "=" + (sFormat || DumpAPI.FORMAT.IMG) + "'; return false;\"";
};

/*
 * Class constants/globals
 */
HTMLOut.tokenFunctions = {
    'pcjs': {
        'title':    HTMLOut.prototype.getTitle,
        'version':  HTMLOut.prototype.getVersion,
        'path':     HTMLOut.prototype.getPath,
        'pcpath':   HTMLOut.prototype.getPCPath,
        'dirlist':  HTMLOut.prototype.getDirList,
        'manifest': null,
        'year':     HTMLOut.prototype.getYear,
        'default':  HTMLOut.prototype.getDefault,
        'htmlfile': HTMLOut.prototype.getHTMLFile,
        'sockets':  HTMLOut.prototype.getSocketScripts
    }
};

module.exports = HTMLOut;
