---
layout: post
title: The VT100 Terminal
date: 2016-08-03 18:00:00
permalink: /blog/2016/08/03/
machines:
  - type: pc8080
    id: vt100
    debugger: true
    config: /devices/pc8080/machine/vt100/debugger/machine.xml
---

Summer has been filled with distractions, but I've finally begun making headway on a
[DEC VT100 Terminal](/devices/pc8080/machine/vt100/debugger/) simulation.

Unlike other VT100 emulators, this isn't simply an emulation of VT100 protocols.  It's a simulation of the VT100's
8080 CPU, running the original [VT100 Firmware](/devices/pc8080/rom/vt100/) inside the [PC8080](/modules/pc8080/)
CPU emulator, along with other key components that the CPU interacts with to drive the display, keyboard, and serial port.

It's not operational yet, but as you can see below, pieces are starting to fall into place, including a test screen that
displays most of the VT100 font variations, built on-the-fly from the original VT100 Character Generator ROM, and LEDs that
respond to the firmware's commands.  When you click "Run" to start the simulation, it briefly displays a "WAIT" message
as it processes the VT100's Non-Volatile RAM (NVR), and then it spins, awaiting further stimulus.

The VT100 KEYMAP table in [keyboard.js](/modules/pc8080/lib/keyboard.js) maps modern keys to VT100 key addresses,
and most of the mappings are 1-1.  Function keys are mapped as follows:

- F1: PF1
- F2: PF2
- F3: PF3
- F4: PF4
- F6: BREAK
- F7: LINE FEED
- F8: NO SCROLL
- F9: SET-UP

The initial goal for the simulation is to provide a virtual terminal that can communicate with other PCjs machines
and provide a realistic serial communication experience, all from the comfort of your web browser.

In the interim, there's still a lot of debugging to do, because while DEC's Technical Manuals were excellent, they were
not comprehensive; there are no commented source-code listings, for example, like those that IBM used to provide in their
early Technical Reference manuals.  Check out the [VT100 Debugger Configuration](/devices/pc8080/machine/vt100/debugger/)
for additional information about VT100 internals and links to other technical resources.

{% include machine.html id="vt100" %}

*[@jeffpar](http://twitter.com/jeffpar)*  
*Aug 3, 2016*
