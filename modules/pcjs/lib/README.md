PCjs Sources
===

Structure
---
These JavaScript files divide PCjs functionality into major PC components.  Most of the files are device
components, implementing a specific device (or set of devices, in the case of [chipset.js](chipset.js)).

Be aware that *component* is an overloaded term, since **Component** is also the name of the
shared base class in [component.js](../../shared/lib/component.js) used by most machine components.
A few low-level components (eg, the **Memory** and **State** components, the Card class of the **Video**
component, the Color and Rectangle classes of the **Panel** component, etc) do not extend **Component**,
so don't assume that every PCjs object has access to [component.js](../../shared/lib/component.js) methods.

Examples of non-device components include UI components like [panel.js](panel.js) and [debugger.js](debugger.js),
and sub-components like [x86ops.js](x86ops.js) and [x86func.js](x86func.js) that separate the CPU
functionality of [x86.js](x86.js) into more manageable pieces.

These components should always be loaded or compiled in the order listed by the *pcJSFiles* property in
[package.json](../../../package.json), which includes all the necessary *shared* components as well.
At the time of this writing, the recommended order is:

* [shared/defines.js](../../shared/lib/defines.js)
* [shared/diskapi.js](../../shared/lib/diskapi.js)
* [shared/dumpapi.js](../../shared/lib/dumpapi.js)
* [shared/reportapi.js](../../shared/lib/reportapi.js)
* [shared/userapi.js](../../shared/lib/userapi.js)
* [shared/strlib.js](../../shared/lib/strlib.js)
* [shared/usrlib.js](../../shared/lib/usrlib.js)
* [shared/weblib.js](../../shared/lib/weblib.js)
* [shared/component.js](../../shared/lib/component.js)
* [pcjs/defines.js](defines.js)
* [pcjs/x86.js](x86.js)
* [pcjs/interrupts.js](interrupts.js)
* [pcjs/messages.js](messages.js)
* [pcjs/panel.js](panel.js)
* [pcjs/bus.js](bus.js)
* [pcjs/memory.js](memory.js)
* [pcjs/cpu.js](cpu.js)
* [pcjs/x86seg.js](x86seg.js)
* [pcjs/x86cpu.js](x86cpu.js)
* [pcjs/x86cpu.js](x86fpu.js)
* [pcjs/x86func.js](x86func.js)
* [pcjs/x86ops.js](x86ops.js)
* [pcjs/x86op0f.js](x86op0f.js)
* [pcjs/x86modb.js](x86modb.js)
* [pcjs/x86modw.js](x86modw.js)
* [pcjs/x86modb16.js](x86modb16.js)
* [pcjs/x86modw16.js](x86modw16.js)
* [pcjs/x86modb32.js](x86modb32.js)
* [pcjs/x86modw32.js](x86modw32.js)
* [pcjs/x86modsib.js](x86modsib.js)
* [pcjs/chipset.js](chipset.js)
* [pcjs/rom.js](rom.js)
* [pcjs/ram.js](ram.js)
* [pcjs/keyboard.js](keyboard.js)
* [pcjs/video.js](video.js)
* [pcjs/serialport.js](serialport.js)
* [pcjs/mouse.js](mouse.js)
* [pcjs/disk.js](disk.js)
* [pcjs/fdc.js](fdc.js)
* [pcjs/hdc.js](hdc.js)
* [pcjs/debugger.js](debugger.js)
* [pcjs/state.js](state.js)
* [pcjs/computer.js](computer.js)
* [shared/embed.js](../../shared/lib/embed.js)

Some of the components *can* be reordered or even omitted (eg, [debugger.js](debugger.js) or
[embed.js](../../shared/lib/embed.js)), but you should observe the following:

* [component.js](../../shared/lib/component.js) must be listed before any component that extends **Component**
* [panel.js](panel.js) should be loaded early to initialize the Control Panel (if any) as soon as possible
* [computer.js](computer.js) should be the last device component, as it supervises and notifies all the other device components

To minimize ordering requirements, the init() handlers and constructors of all components should avoid
referencing other components.  Device components should define an initBus() notification handler, which the
*Computer* component will call after it has created/initialized the *Bus* component.

Features
---

[List of major existing features goes here]

### BackTrack Support

The next major feature to be implemented is referred to as BackTrack Support, or simply BackTracks.  When BackTracks
are enabled, every memory location (at the byte level) and every general-purpose byte register may have an optional link
back to its source.  These links are called BackTrack indexes.

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
