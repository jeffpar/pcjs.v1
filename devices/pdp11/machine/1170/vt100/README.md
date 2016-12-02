---
layout: page
title: PDP-11/70 with VT100 Terminal
permalink: /devices/pdp11/machine/1170/vt100/
machines:
  - id: test1170
    type: pdp11
    config: /devices/pdp11/machine/1170/vt100/machine.xml
    connection: dl11->vt100.serialPort
  - id: vt100
    type: pc8080
    config: /devices/pc8080/machine/vt100/machine.xml
    connection: serialPort->test1170.dl11
---

{% include machine.html id="test1170" %}

{% include machine.html id="vt100" %}

This PDP-11/70 is also available with our built-in [Debugger](debugger/).
