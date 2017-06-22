---
layout: page
title: IBM PC (Model 5150, 64Kb, Color Display) running DONKEY.BAS
permalink: /devices/pcx86/machine/5150/cga/64kb/donkey/
redirect_from:
  - /configs/pc/machines/5150/cga/64kb/donkey/
  - /configs/pc/machines/5150/cga/64kb/donkey/machine.xml/
  - /demos/pc/donkey/
  - /devices/pc/machine/5150/cga/64kb/donkey/
machines:
  - type: pcx86
    id: ibm5150
    autoMount:
      A:
        path: /disks/pcx86/dos/ibm/1.00/PCDOS100.json
      B:
        name: None
---

IBM PC Running DONKEY.BAS
---

{% include machine.html id="ibm5150" %}

The above simulation is configured for a clock speed of 4.77Mhz, with 64Kb of RAM and a CGA display,
using the original IBM PC Model 5150 ROM BIOS and CGA font ROM.  This configuration also includes a
predefined state, with PC-DOS 1.0 already booted and DONKEY.BAS ready to run.

And now that PCx86 automatically saves all your changes (subject to the limits of your browser's local
storage), you can even close the browser in the middle of a game of DONKEY, and the next time you load
this page, your progress (and the donkey) will be perfectly restored.

For more control over this machine, try the [Control Panel](debugger/) configuration, featuring the
built-in PCx86 Debugger.
