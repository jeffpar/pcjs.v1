/**
 * grunt-manifester
 * https://github.com/jeffpar/pcjs
 *
 * Copyright (c) 2014-2018 jeffpar
 * Licensed under the MIT license.
 *
 * TODO: Update this header with our standard header and fix all the JSHint warnings
 */

"use strict";

var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var url = require("url");
var async = require("async");
var parseXML = require("xml2js").parseString;   // see: https://github.com/Leonidas-from-XIV/node-xml2js
var unzip = require("unzip");
var util = require("util");
var defines = require("../../../shared/lib/defines");
var net = require("../../../shared/lib/netlib");

module.exports = function (grunt) {

    /*
     * Please see the Grunt documentation for more information regarding task
     * creation: http://gruntjs.com/creating-tasks
     */
    grunt.registerMultiTask('manifester', 'manifest.xml processor', function() {

        /*
         * Merge task-specific and/or target-specific options with these defaults
         *
        var options = this.options({
        });
         */

        /*
         * Tell grunt this task is asynchronous
         */
        var asManifests = [];
        var doneGrunt = this.async();

        /*
         * Iterate over all specified file groups
         */
        this.files.forEach(function(file) {

            file.src.filter(function(sFilePath) {
                /*
                 * Warn on and remove invalid source files (if nonull was set)
                 */
                if (!grunt.file.exists(sFilePath)) {
                    grunt.log.warn('Source file "' + sFilePath + '" not found.');
                    return false;
                }
                return true;
            }).map(function(sFilePath) {
                /*
                 * TODO: Given the memory constraints I've run into with Grunt in the past, it would
                 * probably be better queue up the file paths instead of the file contents, and do async
                 * readFile() calls.
                 */
                asManifests.push(sFilePath);
            });
        });

        async.each(asManifests, function processXML(sManifestFile, doneAsync) {
            var sManifestXML = grunt.file.read(sManifestFile);
            parseXML(sManifestXML, function doneParseXML(err, xml) {
                var cCallbacks = 0;
                if (xml.manifest) {
                    // console.log(util.inspect(xml, false, null));
                    for (var iRepo in xml.manifest.repo) {
                        var repo = xml.manifest.repo[iRepo];
                        if (repo.src) {
                            var src = repo.src[0];
                            var sURL = src.$['href'];
                         // var sURL = src._ || src;    // the former is set if there are any attributes, otherwise the element is just a string
                            console.log('found src URL: "' + sURL + '"');
                            if (sURL.slice(0, 5) == "http:" && sURL.slice(-1) == '/') {
                                for (var iDownload in repo.download) {
                                    var download = repo.download[iDownload];
                                    var sDownloadFile = download.$['href'];
                                 // var sDownloadFile = download._ || download;
                                    console.log("processing download " + sDownloadFile);
                                    var sRemoteFile = sURL + sDownloadFile;
                                    var sLocalDir = path.join(path.dirname(sManifestFile), repo.$['dir']);
                                    if (grunt.file.exists(sLocalDir) || mkdirp.sync(sLocalDir)) {
                                        var sLocalFile = path.join(sLocalDir, sDownloadFile);
                                        if (grunt.file.exists(sLocalFile)) {
                                            console.log("file already exists: " + sLocalFile);
                                        } else {
                                            console.log('downloadFile("' + sRemoteFile + '", "' + sLocalFile + '")...');
                                            cCallbacks++;
                                            net.downloadFile(sRemoteFile, sLocalFile, function doneDownloadFile(err, status) {
                                                console.log('downloadFile("' + sRemoteFile + '") returned ' + status + ': ' + (err? false : true));
                                                if (!err && status == 200 && sLocalFile.slice(-4) == ".zip") {
                                                    var sLocalZipDir = path.join(sLocalDir, path.basename(sLocalFile, ".zip"));
                                                    if (grunt.file.exists(sLocalZipDir) || mkdirp.sync(sLocalZipDir)) {
                                                        /*
                                                         * TODO: As explained here (https://github.com/EvanOxfeld/node-unzip/issues/40), determine why this ZIP
                                                         * file (http://beej.us/moria/files/pc/zip-arc/mor55-88.zip) causes an "invalid stored block lengths" error.
                                                         */
                                                        fs.createReadStream(sLocalFile).pipe(unzip.Extract({path: sLocalZipDir})).on('close', function() {
                                                            console.log("unzip complete: " + sLocalZipDir);
                                                            if (--cCallbacks == 0) doneAsync();
                                                        });
                                                        return;
                                                    } else {
                                                        grunt.log.warn("unzip directory not available: " + sLocalZipDir);
                                                    }
                                                }
                                                if (--cCallbacks == 0) doneAsync();
                                            });
                                        }
                                    } else {
                                        grunt.log.warn("download directory not available: " + sLocalDir);
                                    }
                                }
                            } else {
                                grunt.log.warn("unsupported repo src: " + sURL);
                            }
                        }
                    }
                }
                if (!cCallbacks) doneAsync();
            });
        }, function(err) {
            doneGrunt();
        });

    });
};
