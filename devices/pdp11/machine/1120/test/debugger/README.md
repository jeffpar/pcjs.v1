---
layout: page
title: PDP-11/20 Boot Test with Debugger
permalink: /devices/pdp11/machine/1120/test/debugger/
machines:
  - id: test1120
    type: pdp11
    debugger: true
---

PDP-11/20 Boot Test (with Debugger)
-----------------------------------

The machine below pre-loads the [PDP-11 Boot Test](/apps/pdp11/boot/test/) code into RAM:

	<ram id="ram" addr="0x0000" size="0xE000" file="/apps/pdp11/boot/test/BOOTTEST.json" load="0xC000" exec="0xC000"/>

{% include machine.html id="test1120" %}
