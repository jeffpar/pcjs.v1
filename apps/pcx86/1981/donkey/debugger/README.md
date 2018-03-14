---
layout: page
title: "DONKEY.BAS (1981) with Debugger"
permalink: /apps/pcx86/1981/donkey/debugger/
machines:
  - id: ibm5150-donkey
    type: pcx86
    resume: 1
    config: /devices/pcx86/machine/5150/cga/64kb/debugger/machine.xml
    state: /apps/pcx86/1981/donkey/state.json
    autoMount:
      A:
        name: PC-DOS 1.00
      B:
        name: None
    autoType: $date\rbasica donkey\r
---

IBM PC Running DONKEY.BAS (with Debugger)
-----------------------------------------

{% include machine.html id="ibm5150-donkey" %}

The above simulation is configured for a clock speed of 4.77Mhz, with 64Kb of RAM and a CGA display,
using the original IBM PC Model 5150 ROM BIOS and CGA font ROM.  This configuration includes a predefined
state, with PC-DOS 1.0 already booted and DONKEY.BAS ready to run.

This particular machine has been configured to automatically save all your changes (subject to the limits
of your browser's local storage), so you can close the browser in the middle of a game of DONKEY, and
the next time you load this page, your progress (and the donkey) should be perfectly restored.

For more classic PC software, see the PCjs collection of [IBM PC Application Demos](/apps/pcx86/).
