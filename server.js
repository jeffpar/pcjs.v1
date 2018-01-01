/**
 * @fileoverview Node web server for pcjs.org
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 * @copyright © Jeff Parsons 2012-2018
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
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see COPYRIGHT in /modules/shared/lib/defines.js).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

/*
 * Usage:
 *
 *      node server.js [options]
 *
 * The options supported are basically just pass-through options for the HTMLOut module;
 * (eg, --cache, --console, --debug, --rebuild, and --sockets).  See HTMLOut for details.
 *
 * Options specific to this module include --logging, which turns on our own private logging
 * (redundant when running on a service like Azure), and --sockets (which we also pass on to
 * HTMLOut so that it can enable/disable client-side socket support).
 */

"use strict";

var fs       = require("fs");
var path     = require("path");
var http     = require("http");
var express  = require("express");
var slash    = require("express-slash");

var defines  = require("./modules/shared/lib/defines");
var proclib  = require("./modules/shared/lib/proclib");
var args     = proclib.getArgs();

var fCache   = (args.argv['cache']   === undefined? true  : args.argv['cache']);
var fConsole = (args.argv['console'] === undefined? false : args.argv['console']);
var fDebug   = (args.argv['debug']   === undefined? false : args.argv['debug']);
var fLogging = (args.argv['logging'] === undefined? false : args.argv['logging']);
var fPrivate = (args.argv['private'] === undefined? false : args.argv['private']);
var fRebuild = (args.argv['rebuild'] === undefined? false : args.argv['rebuild']);
var fSockets = (args.argv['sockets'] === undefined? false : args.argv['sockets']);

var HTMLOut  = require("./modules/htmlout");

var sServerRoot = __dirname;
HTMLOut.setRoot(sServerRoot);

/*
 * In a production environment, you probably want to leave the 'console',
 * 'debug' and 'rebuild' options OFF, which is why we warn if they're enabled.
 */
if (fConsole || fDebug || fRebuild) console.log("warning: non-production options enabled");
HTMLOut.setOptions({'cache': fCache, 'console': fConsole, 'debug': fDebug, 'private': fPrivate, 'rebuild': fRebuild, 'sockets': fSockets});

var app = express();
app.enable("strict routing");
app.set('port', args.argv['port'] || process.env.PORT || 8088);

/*
 * For more information about express.logger():
 *
 *      http://www.senchalabs.org/connect/logger.html
 *
 * NOTE: use {flags: 'a'} to open in append mode instead of write mode.  The latter is the default,
 * so that a simple server restart will generate a new log file.
 *
 * TODO: Consider some simple rotation scheme to retain at least a few previous log files.
 */
if (fLogging) {
    var streamLog = fs.createWriteStream(path.join(sServerRoot, "./logs/node.log"), {flags: 'w'});
    HTMLOut.setOptions({'logfile': streamLog});
    app.use(express.logger({ format: 'default', stream: streamLog }));
}

/*
 * To be able to save states for machines with large states, I have to rely on server-side
 * state API support (see processUserAPI() in httpapi.js in the HTMLOut module), because there
 * don't seem to be any good client-side solutions (localStorage is notoriously limited, and
 * "data:" URLs crash the browser if they're too large).  However, I don't want to jack up the
 * server upload limits too high on a "production" server, so I set a higher limit only for
 * "debug" servers).
 */
app.use(express.json({limit: fDebug? '128mb' : '4mb'}));
app.use(express.urlencoded({limit: fDebug? '128mb' : '4mb'}));

app.use(HTMLOut.filter);
app.use(express.compress());

/*
 * The following hack ensures that our JavaScript files are delivered as UTF-8 files.
 * You can tell when they're not: the copyright symbol (©) in my file headers doesn't
 * display properly.
 *
 * TODO: Determine if we have any other UTF-8 files that Express fails to deliver as such.
 */
app.use(function(req, res, next) {
    if (/.*\.(js|json)$/.test(req.path)) {
        res.charset = "utf-8";
    }
    next();
});

app.use(express.static(sServerRoot));
app.use('/favicon.ico', express.static(path.join(sServerRoot, "versions/icons/current/favicon.ico")));
app.use(slash());

var server = http.createServer(app).listen(app.get('port'), function() {
    if (fConsole) console.log('Express server listening on port ' + app.get('port'));
});

/*
 * socket.io support is still very experimental, so it should not be enabled by default
 */
if (fSockets) {
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function(socket) {
        if (fConsole) console.log('A new user connected!');
        socket.emit('info', { msg: 'The world is round, there is no up or down.' });
    });
}
