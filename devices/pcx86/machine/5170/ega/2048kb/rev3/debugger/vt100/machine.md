---
layout: page
title: IBM PC AT (Model 5170, 2Mb, 20Mb Hard Disk) with EGA Display and VT100 Debugger
permalink: /devices/pcx86/machine/5170/ega/2048kb/rev3/debugger/vt100/
machines:
  - id: ibm5170
    type: pcx86
    debugger: true
  - id: vt100
    type: pc8080
    debugger: true
    config: /devices/pc8080/machine/vt100/machine.xml
---

{% include machine.html id="ibm5170" %}

{% include machine.html id="vt100" %}
