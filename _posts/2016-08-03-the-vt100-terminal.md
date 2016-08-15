---
layout: post
title: The VT100 Terminal
date: 2016-08-03 18:00:00
permalink: /blog/2016/08/03/
machines:
  - type: pc8080
    id: vt100
    config: /devices/pc8080/machine/vt100/machine.xml
---

Summer has been filled with distractions, but I've finally begun making headway on a
[DEC VT100 Terminal](/devices/pc8080/machine/vt100/) simulation.

Unlike other VT100 emulators, this isn't simply an emulation of VT100 protocols.  It's a simulation of the VT100's
8080 CPU, running the original [VT100 Firmware](/devices/pc8080/rom/vt100/) inside the [PC8080](/modules/pc8080/)
CPU emulator, along with other key components that the CPU interacts with to drive the display, keyboard, and serial port.

It's not fully operational yet, but as you can see below, major pieces are falling into place, including a test screen that
displays most of the VT100 font variations, built on-the-fly from the original VT100 Character Generator ROM, and LEDs that
respond to the firmware's commands.  When the VT100 "powers on", it briefly displays a "WAIT" message as it processes the
VT100's Non-Volatile RAM (NVR), and then it spins, awaiting further stimulus.

{% include machine.html id="vt100" %}

Function keys are mapped as follows:

- F1: PF1
- F2: PF2
- F3: PF3
- F4: PF4
- F6: BREAK
- F7: LINE FEED
- F8: NO SCROLL
- F9: SET-UP

From the SET-UP screen, you can press **4** to switch to LOCAL mode and verify local operation of most VT100
keys.  The following keys have special meaning inside SET-UP Mode:

- 0: RESET
- 2: SET/CLEAR TAB
- 3: CLEAR ALL TABS
- 4: ONLINE/LOCAL
- 5: SET-UP A/B
- 6: TOGGLE FEATURE
- 7: TRANSMIT SPEED
- 8: RECEIVE SPEED
- 9: 80/132 COLUMNS
- SHIFT-S: Save SET-UP Features
- SHIFT-R: Restore SET-UP Features

The initial goal for the simulation is to provide a virtual terminal that can communicate with other PCjs machines
and provide a realistic serial communication experience, all from the comfort of your web browser.

There's still plenty of debugging to do, because while DEC's Technical Manuals were excellent, they were
not comprehensive; there are no commented source-code listings, for example, like those that IBM used to provide in their
early Technical Reference manuals, so we have to [create our own](/devices/pc8080/rom/vt100/).

Check out the [VT100 Debugger Configuration](/devices/pc8080/machine/vt100/debugger/) for additional information about
VT100 internals and links to other technical resources.

*[@jeffpar](http://twitter.com/jeffpar)*  
*Aug 3, 2016*
