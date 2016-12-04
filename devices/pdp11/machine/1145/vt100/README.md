---
layout: page
title: PDP-11/45 with VT100 Terminal
permalink: /devices/pdp11/machine/1145/vt100/
machines:
  - id: test1145
    type: pdp11
    config: /devices/pdp11/machine/1145/vt100/machine-left.xml
    connection: dl11->vt100.serialPort
  - id: vt100
    type: pc8080
    config: /devices/pc8080/machine/vt100/machine-right.xml
    connection: serialPort->test1145.dl11
---

{% include machine.html id="test1145" %}

{% include machine.html id="vt100" %}

This PDP-11/45 is also available with our built-in [Debugger](debugger/).
