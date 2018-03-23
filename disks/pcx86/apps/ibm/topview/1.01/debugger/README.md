---
layout: page
title: "TopView 1.01 (With Debugger)"
permalink: /disks/pcx86/apps/ibm/topview/1.01/debugger/
machines:
  - id: ibm5160
    type: pcx86
    config: /devices/pcx86/machine/5160/cga/640kb/mouse/debugger/machine.xml
    autoMount:
      A:
        name: PC-DOS 2.00 (Disk 1)
      B:
        name: TopView 1.01 (Program)
    autoScript: startMouse
machineScripts:
  startKbd: |
    wait Keyboard DOS;
    type Keyboard "$date\r$time\rB:\rTV\r";
  startMouse: |
    wait Keyboard DOS;
    type Keyboard "$date\r$time\r";
    wait Keyboard;
    sleep 1000;
    select FDC listDrives "A:";
    select FDC listDisks "MS Mouse 5.00 (SYSTEM)";
    loadDisk FDC;
    wait FDC;
    type Keyboard "MOUSE\r";
    sleep 7000;
    type Keyboard "B:\rSETUP\r$50.3\r$20n\r$20y\r$20\r$20\r$20.1\r";
---

TopView 1.01 (With Debugger)
----------------------------

{% include machine.html id="ibm5160" %}
