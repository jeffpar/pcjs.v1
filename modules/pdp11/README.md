---
layout: page
title: PDP-11 Machine Emulation Module (PDP11)
permalink: /modules/pdp11/
---

PDP-11 Machine Emulation Module (PDP11)
=======================================

Overview
---
PDP11 is our PDP-11 machine emulation module.  The code is being adapted from
the JavaScript [PDP 11/70 Emulator (v1.3)](http://skn.noip.me/pdp11/pdp11.html) written by
[Paul Nankervis](mailto:paulnank@hotmail.com).

PDP11 is currently comprised of the following non-shared components, as listed in
[package.json](../../package.json) (see the *pdp11Files* property):

* [defines.js](/modules/pdp11/lib/defines.js)
* [cpudef.js](/modules/pdp11/lib/cpudef.js)
* [messages.js](/modules/pdp11/lib/messages.js)
* [panel.js](/modules/pdp11/lib/panel.js)
* [bus.js](/modules/pdp11/lib/bus.js)
* [memory.js](/modules/pdp11/lib/memory.js)
* [cpu.js](/modules/pdp11/lib/cpu.js)
* [cpustate.js](/modules/pdp11/lib/cpustate.js)
* [cpuops.js](/modules/pdp11/lib/cpuops.js)
* [rom.js](/modules/pdp11/lib/rom.js)
* [ram.js](/modules/pdp11/lib/ram.js)
* [keyboard.js](/modules/pdp11/lib/keyboard.js)
* [debugger.js](/modules/pdp11/lib/debugger.js)
* [computer.js](/modules/pdp11/lib/computer.js)
