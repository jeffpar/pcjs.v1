---
layout: page
title: "TopView 1.01 (With Debugger)"
permalink: /disks/pcx86/apps/ibm/topview/1.01/debugger/
machines:
  - id: ibm5160
    type: pcx86
    config: /devices/pcx86/machine/5160/cga/640kb/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/dos/ibm/2.00/PCDOS200-DISK1.json
      B:
        path: /disks/pcx86/apps/ibm/topview/1.01/TOPVIEW101-PROGRAM.json
    autoScript: startKbd
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
    select FDC listDisks "MS Mouse 5.00 (System)";
    loadDisk FDC;
    wait FDC;
    type Keyboard "MOUSE\r";
    sleep 5000;
    type Keyboard "B:\rTV\r";
---

TopView 1.01 (With Debugger)
----------------------------

{% include machine.html id="ibm5160" %}
