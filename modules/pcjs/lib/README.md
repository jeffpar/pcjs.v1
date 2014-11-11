PCjs Sources
===

Structure
---
All the code for PCjs is contained in the following JavaScript files, which roughly divide the
functionality into major PC components, aka "devices".  However, not every file implements a device,
and "component" is an overloaded term, since *[Component](/docs/pcjs/component/)* is also the name of
the shared base class used for most PCjs devices (see [component.js](../../shared/lib/component.js)).
So it's best to refer to these files generically as "modules", and more specifically as "device modules"
whenever they implement a specific device (or set of devices, in the case of [*Chipset*](/docs/pcjs/chipset/)).

Examples of non-device modules include UI modules like [panel.js](panel.js) and [debugger.js](debugger.js),
and sub-modules like [x86opxx.js](x86opxx.js), [x86mods.js](x86mods.js) and [x86help.js](x86help.js)
that separate the CPU functionality of [x86.js](x86.js) into more manageable pieces.

These modules should always be loaded or compiled in the order listed by the *pcJSFiles* property in
[package.json](../../../package.json), which includes all the necessary *shared* modules as well.
At the time of this writing, the order is:

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
* [pcjs/panel.js](panel.js)
* [pcjs/bus.js](bus.js)
* [pcjs/mem.js](mem.js)
* [pcjs/cpu.js](cpu.js)
* [pcjs/x86.js](x86.js)
* [pcjs/x86seg.js](x86seg.js)
* [pcjs/x86cpu.js](x86cpu.js)
* [pcjs/x86grps.js](x86grps.js)
* [pcjs/x86help.js](x86help.js)
* [pcjs/x86mods.js](x86mods.js)
* [pcjs/x86op0f.js](x86op0f.js)
* [pcjs/x86opxx.js](x86opxx.js)
* [pcjs/chipset.js](chipset.js)
* [pcjs/rom.js](rom.js)
* [pcjs/ram.js](ram.js)
* [pcjs/keyboard.js](keyboard.js)
* [pcjs/video.js](video.js)
* [pcjs/serial.js](serial.js)
* [pcjs/mouse.js](mouse.js)
* [pcjs/disk.js](disk.js)
* [pcjs/fdc.js](fdc.js)
* [pcjs/hdc.js](hdc.js)
* [pcjs/debugger.js](debugger.js)
* [pcjs/state.js](state.js)
* [pcjs/computer.js](computer.js)
* [shared/embed.js](../../shared/lib/embed.js)

Some of the modules *can* be reordered or even omitted (eg, [debugger.js](debugger.js) or
[embed.js](../../shared/lib/embed.js)), but you should observe the following:

* [component.js](../../shared/lib/component.js) must be listed before any module that extends [*Component*](/docs/pcjs/component/)
* [panel.js](panel.js) should be loaded early to initialize the Control Panel (if any) as soon as possible
* [computer.js](computer.js) should be the last device module, as it supervises and notifies all the other device modules

To minimize ordering requirements, the init() handlers and constructors of all modules should avoid
referencing other modules.  Device modules should define an initBus() notification handler, which the
[*Computer*](/docs/pcjs/computer/) will call after it has created/initialized the *Bus* object.
