---
layout: page
title: Microsoft Word 3.0 (with Debugger)
permalink: /disks/pcx86/apps/microsoft/word/3.0/debugger/
machines:
  - id: ibm5160
    type: pcx86
    debugger: true
    uncompiled: true
    commands: bp &060E:0005 "dh"
    config: /devices/pcx86/machine/5160/ega/640kb/debugger/machine.xml
    autoMount:
      A:
        name: PC DOS 2.00 (Disk 1)
      B:
        name: MS Word 3.0 (Disk 2)
    autoStart: true
    autoType: $date\r$time\rB:\rSPELL\r
---

Microsoft Word 3.0 (with Debugger)
----------------------------------

The [IBM 5160 Machine](/devices/pcx86/machine/5160/ega/640kb/debugger/) below is configured as follows:

    id: ibm5160
    type: pcx86
    debugger: true
    uncompiled: true
    commands: bp &060E:0005 "dh"
    config: /devices/pcx86/machine/5160/ega/640kb/debugger/machine.xml
    autoMount:
      A:
        name: PC DOS 2.00 (Disk 1)
      B:
        name: MS Word 3.0 (Disk 2)
    autoStart: true
    autoType: $date\r$time\rB:\rSPELL\r

The "uncompiled" version of PCx86 is required in order for *[BackTrack](/modules/pcx86/#backtrack-support)* information
to be available to the PCjs Debugger.

Use the command `BC *` to clear all predefined breakpoints and allow the program to run normally.

{% include machine.html id="ibm5160" %}
