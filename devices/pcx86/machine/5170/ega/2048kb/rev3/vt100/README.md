---
layout: page
title: IBM PC AT (8Mhz, 2Mb, 20Mb Drive) with Enhanced Color Display and VT100
permalink: /devices/pcx86/machine/5170/ega/2048kb/rev3/vt100/
machines:
  - id: ibm5170
    type: pcx86
    connection: com2->vt100.serialPort
    config: /devices/pcx86/machine/5170/ega/2048kb/rev3/machine.xml
  - id: vt100
    type: pc8080
    connection: serialPort->ibm5170.com2
    config: /devices/pc8080/machine/vt100/machine.xml
---

IBM PC AT with VT100 Terminal
-----------------------------

Demonstration of an IBM PC AT with VT100 Terminal connected via COM2.

A [Dual Debugger Configuration](../debugger/vt100/) is also available.

{% include machine.html id="ibm5170" %}

{% include machine.html id="vt100" %}
