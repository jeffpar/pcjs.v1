---
layout: page
title: PDP-11/70 "Server Array"
permalink: /devices/pdp11/machine/1170/array/
machines:
  - type: pdp11
    id: test1170a
    autoStart: true
    config: /devices/pdp11/machine/1170/panel/machine.xml
  - type: pdp11
    id: test1170b
    autoStart: true
    config: /devices/pdp11/machine/1170/panel/machine.xml
  - type: pdp11
    id: test1170c
    autoStart: true
    config: /devices/pdp11/machine/1170/panel/machine.xml
  - type: pdp11
    id: test1170d
    autoStart: true
    config: /devices/pdp11/machine/1170/panel/machine.xml
---

{% include machine.html id="test1170a" %}

{% include machine.html id="test1170b" %}

{% include machine.html id="test1170c" %}

{% include machine.html id="test1170d" %}
