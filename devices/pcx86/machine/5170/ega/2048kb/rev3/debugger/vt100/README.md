---
layout: page
title: IBM PC AT (Model 5170, 2Mb, 20Mb Hard Disk) with EGA Display, VT100, and Debuggers
permalink: /devices/pcx86/machine/5170/ega/2048kb/rev3/debugger/vt100/
machines:
  - id: ibm5170
    type: pcx86
    debugger: true
    autoStart: true
    connection: com2->vt100.serialPort
    config: /devices/pcx86/machine/5170/ega/2048kb/rev3/debugger/vt100/machine.xml
  - id: vt100
    type: pc8080
    debugger: true
    autoStart: true
    connection: serialPort->ibm5170.com2
    config: /devices/pc8080/machine/vt100/debugger/machine.xml
---

IBM PC AT with VT100 Terminal and Dual Debuggers
------------------------------------------------

Demonstration of a [IBM PC AT with VT100 Terminal](../../vt100/) connected via COM2, with Debuggers attached.

Use the DOS command `CTTY COM2` to use the VT100 for console operations.  `CTTY CON` will return control to the PC.

{% include machine.html id="ibm5170" %}

{% include machine.html id="vt100" %}
