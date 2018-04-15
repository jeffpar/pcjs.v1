---
layout: page
title: Challenger 1P Emulation Module (C1Pjs)
permalink: /modules/c1pjs/
---

Challenger 1P Emulation Module (C1Pjs)
======================================

Overview
--------

C1Pjs is our 6502-based machine emulation module for the [Ohio Scientific Challenger 1P](/docs/c1pjs/).

C1Pjs is comprised of the following non-shared components, as listed in
[machines.json](https://github.com/jeffpar/pcjs/blob/master/_data/machines.json) (see the *c1p.scripts* property):

* [defines.js](lib/defines.js)
* [panel.js](lib/panel.js)
* [cpu.js](lib/cpu.js)
* [rom.js](lib/rom.js)
* [ram.js](lib/ram.js)
* [keyboard.js](lib/keyboard.js)
* [video.js](lib/video.js)
* [serial.js](lib/serial.js)
* [disk.js](lib/disk.js)
* [debugger.js](lib/debugger.js)
* [computer.js](lib/computer.js)
