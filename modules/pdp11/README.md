---
layout: page
title: PDP-11 Machine Emulation Module (PDPjs)
permalink: /modules/pdp11/
---

PDP-11 Machine Emulation Module (PDPjs)
=======================================

Overview
---
PDPjs, our [PDP-11 Machine](/devices/pdp11/machine/) emulation module, is adapted from
the [PDP-11/70 Emulator (v1.4)](http://skn.noip.me/pdp11/pdp11.html) written by
Paul Nankervis.

PDPjs is currently comprised of the following non-shared components, as listed in
[package.json](../../package.json) (see the *pdp11Files* property):

* [defines.js](/modules/pdp11/lib/defines.js)
* [messages.js](/modules/pdp11/lib/messages.js)
* [panel.js](/modules/pdp11/lib/panel.js)
* [bus.js](/modules/pdp11/lib/bus.js)
* [device.js](/modules/pdp11/lib/device.js)
* [memory.js](/modules/pdp11/lib/memory.js)
* [cpu.js](/modules/pdp11/lib/cpu.js)
* [cpustate.js](/modules/pdp11/lib/cpustate.js)
* [cpuops.js](/modules/pdp11/lib/cpuops.js)
* [rom.js](/modules/pdp11/lib/rom.js)
* [ram.js](/modules/pdp11/lib/ram.js)
* [keyboard.js](/modules/pdp11/lib/keyboard.js)
* [serialport.js](/modules/pdp11/lib/serialport.js)
* [pc11.js](/modules/pdp11/lib/pc11.js)
* [disk.js](/modules/pdp11/lib/disk.js)
* [rk11.js](/modules/pdp11/lib/rk11.js)
* [rl11.js](/modules/pdp11/lib/rl11.js)
* [debugger.js](/modules/pdp11/lib/debugger.js)
* [computer.js](/modules/pdp11/lib/computer.js)
