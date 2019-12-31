---
layout: post
title: Creating New Machines
date: 2020-02-20 10:00:00
permalink: /blog/2020/02/20/
---

The easiest way to create a new PCjs machine is to start with an old one.  That's what I recently did for a pair
of 8080-based machines: [Space Invaders](/devices/pc8080/machine/invaders/new/) and the
[DEC VT100 Terminal](/devices/pc8080/machine/vt100/new/).  There's nothing particularly exciting about these new machines,
other than they are easier to configure, embed, and maintain than my earlier [PC8080](/modules/pc8080/) versions.

In honor of the 8080, there are few more 8080-based machines I'd like to build soon, such as the
[MITS Altair 8800](https://livingcomputers.org/Computer-Collection/Vintage-Computers/Microcomputers/MITS-Altair-8800.aspx),
and I want to add Z-80 functionality so that I can support more classic PCs like the
[TRS-80](https://livingcomputers.org/Computer-Collection/Vintage-Computers/Microcomputers/TRS-80.aspx) as well as arcade
machines like [Galaxian](https://en.wikipedia.org/wiki/Galaxian).

However, at the moment, I need to switch gears and make a new PDP-11-based machine.  More on *why* I need to do that later.

## First Steps

I started by adding a new entry for the machine to the PCjs machine "catalog" in [machines.json](https://github.com/jeffpar/pcjs/blob/master/_data/machines.json).

For this new PDP-11 machine, I simply copied the lines from the "vt100" machine, edited them a bit, and pasted them:

    "pdp11v2": {
      "name": "PDP-11",
      "version": "2.00",
      "defines": [
        "FACTORY",
        "VERSION"
      ],
      "folder": "devices",
      "factory": "PDP11",
      "scripts": [
        "./modules/devices/lib/defs.js",
        "./modules/devices/lib/numio.js",
        "./modules/devices/lib/stdio.js",
        "./modules/devices/lib/webio.js",
        "./modules/devices/main/device.js",
        "./modules/devices/main/input.js",
        "./modules/devices/main/led.js",
        "./modules/devices/main/time.js",
        "./modules/devices/bus/bus.js",
        "./modules/devices/bus/memory.js",
        "./modules/devices/bus/ports.js",
        "./modules/devices/bus/ram.js",
        "./modules/devices/bus/rom.js",
        "./modules/devices/cpu/cpu.js",
        "./modules/devices/cpu/debugger.js",
        "./modules/devices/main/machine.js"
      ]
    }

Every machine key must be unique, and since there was already an older machine with key "pdp11", I chose "pdp11v2"
for the new PDP-11 machine.  Each key is also known as the machine's *type*, which determines the name of the compiled
JavaScript module (eg, "pdp11v2.js") and how web pages indicate which machine to load (eg, "type: pdp11v2").

This new machine immediately compiled (`gulp compile/pdp11v2`), although it won't do anything useful, because its
CPU and Debugger consist only of base classes that don't contain any CPU-specific code.

Next, I needed to create a machine configuration file describing a particular PDP-11 configuration.
The [PDP-11/20 BASIC Demo (with Debugger)](/devices/pdp11/machine/1120/basic/debugger/) seemed like a nice simple machine
to replicate.  Since that's an older (v1) PCjs machine that uses XML configuration files, let's take a peek at the primary
[XML file](/devices/pdp11/machine/1120/basic/debugger/machine.xml):

    <machine id="test1120" type="pdp11" border="1" pos="center" background="default">
        <name pos="center">PDP-11/20: 16Kb, PDP-11 BASIC, Debugger</name>
        <computer id="computer" busWidth="16"/>
        <cpu id="cpu" model="1120" cycles="6666667"/>
        <ram id="ram" addr="0x0000" size="0x4000" file="/apps/pdp11/tapes/basic/DEC-11-AJPB-PB.json"/>
        <device id="default" type="default"/>
        <serial id="dl11" adapter="0" binding="print" upperCase="true"/>
        <panel ref="/devices/pdp11/panel/test/debugger/terminal.xml"/>
        <debugger id="debugger" base="8" messages="" commands=""/>
        <device ref="/devices/pdp11/pc11/default.xml"/>
    </machine>

I translated the critical pieces of information to the following [JSON file](/devices/pdp11/machine/1120/basic/debugger/new/pdp1120.json):

    {
      "pdp1120": {
        "class": "Machine",
        "type": "Computer",
        "name": "PDP-11/20",
        "version": 2.00,
        "autoSave": false,
        "autoStart": false
      },
      "clock": {
        "class": "Time",
        "cyclesPerSecond": 6666667
      },
      "bus": {
        "class": "Bus",
        "addrWidth": 16,
        "dataWidth": 8
      },
      "cpu": {
        "class": "PDP11",
        "model": "KA11"
      },
      "ram": {
        "class": "RAM",
        "addr": 0,
        "size": 16384
      },
      "debugger": {
        "class": "DbgPDP11",
        "_JSONDoc": [
          "It's best to initialize the Debugger last, so that it can find any device it wants -- at the very least, the CPU."
        ]
      }
    }

At the moment, it's a very bare-bones machine with no I/O devices.  The important properties are:

- 6666667 *cyclesPerSecond*
- RAM *size* of 16Kb at *addr* 0
- *autoSave* and *autoStart* disabled (preferred when debugging a new machine)

I now had enough pieces to create a [page](https://github.com/jeffpar/pcjs/blob/master/devices/pdp11/machine/1120/basic/debugger/new/README.md)
on which to run the machine.  At the top of the page, I placed the following information:

    ---
    layout: page
    title: PDP-11/20 BASIC Demo with Debugger (New)
    permalink: /devices/pdp11/machine/1120/basic/debugger/new/
    machines:
    - id: pdp1120
      type: pdp11v2
      config: pdp1120.json
    ---

Unfortunately, the page immediately crashed because although the "pdp11v2" machine type in machines.json indicated that
the machine's factory was "PDP11", I had neglected to add that new factory name to [machine.js](/modules/devices/main/machine.js):

    window['PDP11'] = window[FACTORY];

Compiled machines have their factory name automatically hard-coded into the compiled code, but during early machine
development, I always run uncompiled code, with DEBUG-only code enabled.  The PCjs node web server knows how to read
machines.json and serve all appropriate scripts for the specified machine type.

After relaoding the web page, the following call:

    PDP11('pdp1120','pdp1120.json');

created the machine and generated the following console messages:

    PCjs PDP-11/20 v2.00
    Copyright © 2012-2019 Jeff Parsons <Jeff@pcjs.org>
    License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>
    Configuration: pdp1120.json
    unrecognized cpu device class: PDP11
    unrecognized debugger device class: DbgPDP11
    power on

which was to be expected, since as already noted, there is no CPU-specific (specifically, PDP11) code in the machine yet.

## Next Steps

*[@jeffpar](https://jeffpar.com)*  
*November 11, 2019*
