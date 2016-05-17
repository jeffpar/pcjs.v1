---
layout: page
title: IBM PC Emulation Module (PCx86)
permalink: /modules/pcx86/
redirect_from:
  - /modules/pcjs/
---

IBM PC Emulation Module (PCx86)
===

Overview
---
PCx86, the PCjs IBM PC emulation module, is the engine powering all our [IBM PC Machines](/devices/pcx86/machine/).

This module divides PC functionality into variety of logical and visual components.
In general, each JavaScript file is responsible for a single component or set of related components (eg,
[chipset.js](lib/chipset.js)).  Most components represent familiar PC devices, such as video cards, disk
controllers, etc.

*Component* is an overloaded term, since **Component** is also the name of the shared base class in
[component.js](../shared/lib/component.js) used by most machine components.  A few low-level components
(eg, the **Memory** and **State** components, the Card class of the **Video** component, the Color and Rectangle
classes of the **Panel** component, etc) do not extend **Component**, so don't assume that every PCx86 object has
access to [component.js](../shared/lib/component.js) methods.

Examples of non-device components include visual components like [panel.js](lib/panel.js) and
[debugger.js](lib/debugger.js), and sub-components like [x86ops.js](lib/x86ops.js) and [x86func.js](lib/x86func.js),
which separate the CPU functionality of [x86.js](lib/x86.js) into more manageable pieces.

These components should always be loaded or compiled in the order listed by the *pcX86Files* property in
[package.json](../../package.json), which includes all the necessary *shared* components as well.
At the time of this writing, the recommended order is:

* [shared/defines.js](../shared/lib/defines.js)
* [shared/diskapi.js](../shared/lib/diskapi.js)
* [shared/dumpapi.js](../shared/lib/dumpapi.js)
* [shared/reportapi.js](../shared/lib/reportapi.js)
* [shared/userapi.js](../shared/lib/userapi.js)
* [shared/strlib.js](../shared/lib/strlib.js)
* [shared/usrlib.js](../shared/lib/usrlib.js)
* [shared/weblib.js](../shared/lib/weblib.js)
* [shared/component.js](../shared/lib/component.js)
* [pcx86/defines.js](lib/defines.js)
* [pcx86/x86.js](lib/x86.js)
* [pcx86/interrupts.js](lib/interrupts.js)
* [pcx86/messages.js](lib/messages.js)
* [pcx86/panel.js](lib/panel.js)
* [pcx86/bus.js](lib/bus.js)
* [pcx86/memory.js](lib/memory.js)
* [pcx86/cpu.js](lib/cpu.js)
* [pcx86/x86seg.js](lib/x86seg.js)
* [pcx86/x86cpu.js](lib/x86cpu.js)
* [pcx86/x86fpu.js](lib/x86fpu.js)
* [pcx86/x86func.js](lib/x86func.js)
* [pcx86/x86help.js](lib/x86help.js)
* [pcx86/x86mods.js](lib/x86mods.js)
* [pcx86/x86ops.js](lib/x86ops.js)
* [pcx86/x86op0f.js](lib/x86op0f.js)
* [pcx86/chipset.js](lib/chipset.js)
* [pcx86/rom.js](lib/rom.js)
* [pcx86/ram.js](lib/ram.js)
* [pcx86/keyboard.js](lib/keyboard.js)
* [pcx86/video.js](lib/video.js)
* [pcx86/parallelport.js](lib/parallelport.js)
* [pcx86/serialport.js](lib/serialport.js)
* [pcx86/mouse.js](lib/mouse.js)
* [pcx86/disk.js](lib/disk.js)
* [pcx86/fdc.js](lib/fdc.js)
* [pcx86/hdc.js](lib/hdc.js)
* [pcx86/debugger.js](lib/debugger.js)
* [pcx86/state.js](lib/state.js)
* [pcx86/computer.js](lib/computer.js)
* [shared/embed.js](../shared/lib/embed.js)
* [shared/save.js](../shared/lib/save.js)

Some of the components *can* be reordered or even omitted (eg, [debugger.js](lib/debugger.js) or
[embed.js](../shared/lib/embed.js)), but you should observe the following:

* [component.js](../shared/lib/component.js) must be listed before any component that extends **Component**
* [panel.js](lib/panel.js) should be loaded early to initialize the Control Panel (if any) as soon as possible
* [computer.js](lib/computer.js) should be the last device component, as it supervises and notifies all the other device components

To minimize ordering requirements, the init() handlers and constructors of all components should avoid
referencing other components.  Device components should define an initBus() notification handler, which the
*Computer* component will call after it has created/initialized the *Bus* component.

Features
---

[List of major existing features goes here]

### BackTrack Support

One major PCjs feature is known as BackTrack Support, or simply BackTracks.  When BackTracks are enabled, every
memory location (at the byte level) and every general-purpose byte register may have an optional link back to its
source.  These links are called BackTrack indexes.

All the code that a virtual machine initially executes enters the machine either via ROM or disk sectors, and as that
code executes, the machine is loading data into registers from memory locations and/or I/O ports and writing the results
to other memory locations and/or I/O ports.  BackTracks keep track of that data flow, allowing us to examine the history
of any piece of data at any time, down to the byte level; while this feature could be extended to the bit level, it
would make the feature dramatically more expensive, both in terms of size and speed.

A BackTrack index is encoded as a 32-bit value with three parts:

- Bits 0-8: 9-bit BackTrack object offset (0-511)
- Bits 9-15: 7-bit type and access info
- Bits 16-30: 15-bit BackTrack object number (1-32767, 0 reserved for dynamic data)

This represents a total of 31 bits, with bit 31 reserved.

For example, look at one of the last things a ROM does during boot: loading a disk sector into RAM.  It will be up to the
disk controller (or DMA controller, if used) to create a BackTrack object representing the sector that was read,
adding that object to the global BackTrack object array, and then associating the corresponding BackTrack index with
the first byte of RAM where the sector was loaded.  Subsequent bytes of RAM containing the rest of the sector will refer
to the same BackTrack object, using BackTrack indexes containing offsets 1-511.
