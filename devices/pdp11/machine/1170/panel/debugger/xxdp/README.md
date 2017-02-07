---
layout: page
title: PDP-11/70 with Front Panel and Debugger
permalink: /devices/pdp11/machine/1170/panel/debugger/xxdp/
machines:
  - id: test1170
    type: pdp11
    config: /devices/pdp11/machine/1170/panel/debugger/machine.xml
    debugger: true
    autoStart: true
    autoMount:
      RL0:
        path: http://archive.pcjs.org/disks/dec/rl02k/RL02K-XXDP.json
    sticky: top
commands:
  runEKBAD0: |
    selectDrive RL11 RL0;
    select RL11 listDisks "XXDP+ Diagnostics";
    loadDisk RL11;
    wait RL11;
    bootDisk RL11;
    sleep 1000;
    receiveData SerialPort "\r";
    sleep 500;
    receiveData SerialPort "R EKBAD0\r";
  testPanel: |
    hold Panel TEST 1000;
    toggle Panel ENABLE;
    sleep 2000;
    reset Panel;
    hold Panel CONT 500;
---

This machine is ready to boot [XXDP+ Diagnostics](/disks/dec/rl02k/xxdp/) ("BOOT RL0") and run diagnostics
(e.g., "R EKBEE1"):

- [EKBAD0: 11/70 CPU DIAGNOSTIC (PART 1)](/disks/dec/rl02k/xxdp/ekbad0/)
- [EKBBF0: 11/70 CPU DIAGNOSTIC (PART 2)](/disks/dec/rl02k/xxdp/ekbbf0/)
- [EKBEE1: 11/70 MEMORY MANAGEMENT DIAGNOSTIC](/disks/dec/rl02k/xxdp/ekbee1/)

Step-by-step instructions are included below.  Other interesting things to know about this machine:

* It includes an [M9312 ROM](/devices/pdp11/rom/M9312/) at address 165000.  The exact ROM is [23-616F1](/devices/pdp11/rom/M9312/23-616F1.txt).

{% include machine.html id="test1170" %}

### Instructions 

We need to select a drive to load the [RL02K XXDP+ Diagnostics Disk](/disks/dec/rl02k/xxdp/), and since it is
an RL02K disk, we need to use an RL02 drive.  A typical PDP-11 machine with a single [RL11 Disk Controller](/devices/pdp11/rl11/)
could contain up to four such drives, which we refer to as RL0 through RL3.

To automatically boot the [RL02K XXDP+ Diagnostics Disk](/disks/dec/rl02k/xxdp/) and run the **EKBAD0** diagnostic,
press: {% include machine-command.html type='button' label='Run EKBAD0' machine='test1170' command='runEKBAD0' %}

To test the Front Panel LEDs and the ENABLE/CONT switches,
press: {% include machine-command.html type='button' label='Test Panel' machine='test1170' command='testPanel' %}
