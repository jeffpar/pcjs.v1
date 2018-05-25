---
layout: page
title: Microsoft Word 3.0 (with Debugger)
permalink: /disks/pcx86/apps/microsoft/word/3.0/debugger/
machines:
  - id: ibm5160
    type: pcx86
    debugger: true
    uncompiled: true
    commands: bp &060E:0005 "dh 3 3"
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

The [IBM PC (Model 5160)](/devices/pcx86/machine/5160/ega/640kb/debugger/) below is configured as follows:

    id: ibm5160
    type: pcx86
    debugger: true
    uncompiled: true
    commands: bp &060E:0005 "dh 3 3"
    config: /devices/pcx86/machine/5160/ega/640kb/debugger/machine.xml
    autoMount:
      A:
        name: PC DOS 2.00 (Disk 1)
      B:
        name: MS Word 3.0 (Disk 2)
    autoStart: true
    autoType: $date\r$time\rB:\rSPELL\r

This establishes a breakpoint on the `SPELL.COM` "CALL 5" entry point; instead of stopping, the breakpoint
simply dumps the 3 previous instructions and continues.  The "uncompiled" version of PCx86 is being used so that
[BackTrack](/modules/pcx86/#backtrack-support) information is available to the PCjs Debugger.

You can use the command `BC *` to clear all predefined breakpoints and allow the program to run normally.

{% include machine.html id="ibm5160" %}
