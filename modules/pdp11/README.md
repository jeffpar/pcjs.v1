---
layout: page
title: PDP-11 Machine Emulation Module (PDPjs)
permalink: /modules/pdp11/
---

PDP-11 Machine Emulation Module (PDPjs)
=======================================

Overview
---
PDPjs, our [PDP-11 Machine](/devices/pdp11/machine/) emulation module, was added to the PCjs Project in 2016.

It was adapted from the [PDP-11/70 Emulator](http://skn.noip.me/pdp11/pdp11.html) written by Paul Nankervis,
with permission.

PDPjs is currently comprised of the following PDP-11 components, as listed in [package.json](../../package.json)
(see the *pdp11Files* property):

* [bus.js](/modules/pdp11/lib/bus.js)
* [computer.js](/modules/pdp11/lib/computer.js)
* [cpu.js](/modules/pdp11/lib/cpu.js)
* [cpuops.js](/modules/pdp11/lib/cpuops.js)
* [cpustate.js](/modules/pdp11/lib/cpustate.js)
* [debugger.js](/modules/pdp11/lib/debugger.js)
* [defines.js](/modules/pdp11/lib/defines.js)
* [device.js](/modules/pdp11/lib/device.js)
* [disk.js](/modules/pdp11/lib/disk.js)
* [drive.js](/modules/pdp11/lib/drive.js)
* [keyboard.js](/modules/pdp11/lib/keyboard.js)
* [memory.js](/modules/pdp11/lib/memory.js)
* [messages.js](/modules/pdp11/lib/messages.js)
* [panel.js](/modules/pdp11/lib/panel.js)
* [pc11.js](/modules/pdp11/lib/pc11.js)
* [ram.js](/modules/pdp11/lib/ram.js)
* [rk11.js](/modules/pdp11/lib/rk11.js)
* [rl11.js](/modules/pdp11/lib/rl11.js)
* [rom.js](/modules/pdp11/lib/rom.js)
* [serial.js](/modules/pdp11/lib/serial.js)

Since this module was written in 2016, it seemed appropriate to start adopting some of the more useful features of
[ECMAScript](http://www.ecma-international.org/ecma-262/6.0/index.html) 2015 (aka ES6), including:

* Classes
* *const* and *let*
* Computed Properties
* Default Parameters
* Octal and Binary Constants
* Template Literals
	- String Interpolation (i.e., ${*expr*})
* New Built-in Methods
	- String.repeat()
* *import* and *export*

However, I've still configured the Closure Compiler to "transpile" to ECMAScript 5 (aka ES5), because some people
may still be using older browsers that don't support ES6 -- or at least the subset of ES6 features I'm currently
using.

Eventually, I need to do some performance testing and determine whether the ES6 version performs any faster and/or
consumes fewer resources than the ES5 version.  If it does, then I should either bite the bullet and generate ES6 code,
or generate both versions and use a loader that detects the browser's capabilities and loads the appropriate version.

Caveats
-------

### *import* and *export*

With regard to *import* and *export* statements, the main reason I use them is to inform my development environment
(WebStorm) about each file's dependencies, thereby preventing inspection warnings.  And ultimately, I plan to make PDPjs
run as a Node application, so explicitly declaring all imports and exports will be required, but for now, it's just
a web application, so strictly speaking, they're not required.

When loading uncompiled PDPjs files into a web browser, the Node-based web server bundled with PCjs still relies on
the `<script>` tag to load all JavaScript files, and as far as I know, no browser currently knows what to do with the
*import* and *export* keywords under those conditions.  Chrome, for example, will immediately throw an exception when
it encounters a file containing them.

As a work-around, the bundled web server intercepts all requests for .js files and inserts line comments in front of
every *import* and *export* statement, so that your web browser won't barf on them.  The statements are completely
superfluous anyway, since the web server generates `<script>` tags for all the necessary scripts, in the order they are
listed in [package.json](../../package.json).

This work-around assumes that all *export* statements appear AFTER the object they're exporting; e.g.:

	export default ComputerPDP11;

and NOT as part of the object declaration; e.g.:

	export default class ComputerPDP11 extends Component { ... }

