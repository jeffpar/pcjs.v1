---
layout: page
title: PDP-11/20 with 16Kb, DEC BASIC, and Debugger
permalink: /devices/pdp11/machine/1120/basic/debugger/
machines:
  - id: test1120
    type: pdp11
    debugger: true
    autoMount: ''
---

DEC PDP-11 BASIC Demo (with Debugger)
-------------------------------------

This machine pre-loads the **[DEC PDP-11 BASIC](/apps/pdp11/tapes/basic/)** tape image into 16Kb of RAM:

	<ram id="ram" addr="0x0000" size="0x4000" file="/apps/pdp11/tapes/basic/DEC-11-AJPB-PB.json"/>

However, if this is too convenient for you, you can manually load it into memory using the
[Bootstrap Loader](/apps/pdp11/boot/bootstrap/).

See [Bootstrap Loader Demo (with Debugger)](/devices/pdp11/machine/1120/bootstrap/debugger/) for details.

{% include machine.html id="test1120" %}
