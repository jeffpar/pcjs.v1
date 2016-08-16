---
layout: page
title: Dual VT100 Terminals
permalink: /devices/pc8080/machine/vt100/dual/
machines:
  - id: vt100a
    type: pc8080
    config: /devices/pc8080/machine/vt100/machine.xml
    connection: serialPort=vt100b.serialPort
  - id: vt100b
    type: pc8080
    config: /devices/pc8080/machine/vt100/machine.xml
    connection: serialPort=vt100a.serialPort
---

Dual VT100 Terminals
--------------------

{% include machine.html id="vt100a" %}

{% include machine.html id="vt100b" %}
