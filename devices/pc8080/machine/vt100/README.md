---
layout: page
title: DEC VT100 Terminal
permalink: /devices/pc8080/machine/vt100/
machines:
  - type: pc8080
    id: vt100
    debugger: true
---

DEC VT100 Terminal
------------------

This is a PCjs work-in-progress emulation of another 8080-based machine: the VT100 Terminal.

Unlike other VT100 emulators, it is not simply an emulation of VT100 protocols.  It is a simulation of the original VT100
machine, running the [VT100 Firmware](/devices/pc8080/rom/vt100/) inside the [PC8080](/modules/pc8080/) CPU emulator.

Admittedly, terminals aren't that useful in isolation, since they're designed to be connected to other (host) machines.
But once this PCjs VT100 Terminal simulation is fully operational, you can expect to see it used in conjunction with a variety
of other PCjs machines. 

For now, play with the [Debugger Configuration](/devices/pc8080/machine/vt100/debugger/), which also provides information
about VT100 internals and links to other technical resources.

{% include machine.html id="vt100" %}
