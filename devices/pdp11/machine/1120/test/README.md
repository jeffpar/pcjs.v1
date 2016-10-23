---
layout: page
title: PDP-11/20 Boot Test 
permalink: /devices/pdp11/machine/1120/test/
machines:
  - id: test1120
    type: pdp11
---

PDP-11/20 Boot Test
-------------------

The machine below pre-loads the [PDP-11 Boot Test](/apps/pdp11/boot/test/) code into RAM:

	<ram id="ram" addr="0x0000" size="0xE000" file="/apps/pdp11/boot/test/BOOTTEST.json" load="0xC000" exec="0xC000"/>

{% include machine.html id="test1120" %}

This machine is also available with our built-in [Debugger](debugger/).
