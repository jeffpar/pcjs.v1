---
layout: page
title: "DONKEY.BAS (1981) with Debugger"
permalink: /apps/pcx86/1981/donkey/debugger/
machines:
  - type: pcx86
    id: ibm5150-donkey
    config: /devices/pcx86/machine/5150/cga/64kb/debugger/machine.xml
    state: /apps/pcx86/1981/donkey/state.json
    autoMount:
      A:
        path: /disks/pcx86/dos/ibm/1.00/PCDOS100.json
      B:
        name: None
---

IBM PC Running DONKEY.BAS (with Debugger)
-----------------------------------------

{% include machine.html id="ibm5150-donkey" %}

The above simulation is configured for a clock speed of 4.77Mhz, with 64Kb of RAM and a CGA display,
using the original IBM PC Model 5150 ROM BIOS and CGA font ROM.  This configuration also includes a
predefined state, with PC-DOS 1.0 already booted and DONKEY.BAS ready to run.

And now that PCx86 automatically saves all your changes (subject to the limits of your browser's local
storage), you can even close the browser in the middle of a game of DONKEY, and the next time you load
this page, your progress (and the donkey) will be perfectly restored.
