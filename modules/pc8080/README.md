---
layout: page
title: 8080 Machine Emulation Module (PC8080)
permalink: /modules/pc8080/
---

8080 Machine Emulation Module (PC8080)
===

Overview
---
PC8080 is our 8080-based machine emulation module.  The code is derived from [PCx86](/modules/pcx86/).

See the list of available [PC8080 Machines](/devices/pc8080/machine/), which includes
[Space Invaders (1978)](/devices/pc8080/machine/invaders/).

PC8080 is comprised of the following non-shared components, as listed in [package.json](../../package.json)
(see the *pc8080Files* property):

* [defines.js](/modules/pc8080/lib/defines.js)
* [cpudef.js](/modules/pc8080/lib/cpudef.js)
* [messages.js](/modules/pc8080/lib/messages.js)
* [panel.js](/modules/pc8080/lib/panel.js)
* [bus.js](/modules/pc8080/lib/bus.js)
* [memory.js](/modules/pc8080/lib/memory.js)
* [cpu.js](/modules/pc8080/lib/cpu.js)
* [cpusim.js](/modules/pc8080/lib/cpusim.js)
* [cpuops.js](/modules/pc8080/lib/cpuops.js)
* [chipset.js](/modules/pc8080/lib/chipset.js)
* [rom.js](/modules/pc8080/lib/rom.js)
* [ram.js](/modules/pc8080/lib/ram.js)
* [keyboard.js](/modules/pc8080/lib/keyboard.js)
* [video.js](/modules/pc8080/lib/video.js)
* [debugger.js](/modules/pc8080/lib/debugger.js)
* [state.js](/modules/pc8080/lib/state.js)
* [computer.js](/modules/pc8080/lib/computer.js)
