---
layout: page
title: Shared Modules
permalink: /modules/shared/lib/
---

Shared Modules
==============

This folder contains a mix of shared code, with some files used only by Node (server) modules,
some used only by Browser (client) modules, and others used by both.

At the moment, only a few files are completely agnostic; eg: [strlib.js](strlib.js) and [usrlib.js](usrlib.js).
One give-away is that neither contain references to any globals (although references to each other
would be fine).

[netlib.js](netlib.js) is appropriate only for Node modules, because it contains code that relies on Node's
global *Buffer* object, as indicated by:

	/* global Buffer: false */

[weblib.js](weblib.js) is appropriate only for client modules, because it contains code that relies on the
browser's global *window* object, as indicated by:

	/* global window: true */

We declare *window* modifiable (true) so that [defines.js](defines.js) can set *global.window* to *false*
when running within Node, allowing any other code to test the existence of *window* with a simple:

	if (window) {...}
	
instead of:

	if (typeof window !== "undefined") {...}
