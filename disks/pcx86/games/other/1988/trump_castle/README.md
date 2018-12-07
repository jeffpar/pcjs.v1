---
layout: page
title: "Trump Castle (1988)"
permalink: /disks/pcx86/games/other/1988/trump_castle/
machines:
  - id: ibm5170-trump120
    type: pcx86
    config: /devices/pcx86/machine/5170/ega/640kb/rev1/enhanced/debugger/machine.xml
    autoMount:
      A:
        name: PC DOS 3.30 (Disk 1)
      B:
        name: Trump Castle 1.20 (1988)
    resume: 1
    autoScript: startMouse
machineScripts:
  startMouse: |
    wait Keyboard DOS;
    type Keyboard "\r\r";
    wait Keyboard;
    sleep 1000;
    select FDC listDrives "A:";
    select FDC listDisks "MS Mouse 5.00 (SYSTEM)";
    loadDisk FDC;
    wait FDC;
    type Keyboard "MOUSE\r";
    sleep 5000;
    type Keyboard "B:\rTRUMP\r";
---

Trump Castle (1988)
-------------------

{% include machine.html id="ibm5170-trump120" %}

For more classic PC software experiences, see the PCjs collection of [IBM PC Application Demos](/apps/pcx86/).
