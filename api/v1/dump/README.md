---
layout: page
title: PCjs DiskDump and FileDump API
permalink: /api/v1/dump/
scripts: # the following list of scripts should mirror what /modules/diskdump/lib/diskdump.js requires 
  - /modules/shared/lib/defines.js
  - /modules/shared/lib/netlib.js
  - /modules/shared/lib/weblib.js
  - /modules/shared/lib/diskapi.js
  - /modules/shared/lib/dumpapi.js
  - /modules/diskdump/lib/diskdump.js
---

PCjs DiskDump and FileDump API
===

The PCjs [DiskDump](/modules/diskdump/) and [FileDump](/modules/filedump/) API are not supported by the current
PCjs web server.  When **pcjs.org** switched from a Node.js web server running on Amazon Web Services to GitHub Pages,
the server-side API had to be abandoned.

However, we're working on a client-side replacement of the API that will run
entirely in your browser, so hopefully portions of the original API will be available in the near future.
In the meantime, check out the
[Developer Notes](https://github.com/jeffpar/pcjs#user-content-developer-notes) section of the
[PCjs Project](https://github.com/jeffpar/pcjs) for instructions on running your own local cope of Node.js and the
PCjs web server.
