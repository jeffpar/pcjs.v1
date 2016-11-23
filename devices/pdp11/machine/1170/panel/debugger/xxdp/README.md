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
---

This machine is ready to boot [XXDP+ Diagnostics](/disks/dec/rl02k/xxdp/) ("BOOT RL0") and run
diagnostics (e.g., "R EKBEE1"):

- [EKBAD0: 11/70 CPU DIAGNOSTIC (PART 1)](/disks/dec/rl02k/xxdp/ekbad0/)
- [EKBBF0: 11/70 CPU DIAGNOSTIC (PART 2)](/disks/dec/rl02k/xxdp/ekbbf0/)
- [EKBEE1: 11/70 MEMORY MANAGEMENT DIAGNOSTIC](/disks/dec/rl02k/xxdp/ekbee1/)

For more information about booting and running these diagnostics, see [XXDP+ Diagnostics](/disks/dec/rl02k/xxdp/).

{% include machine.html id="test1170" %}

Other interesting things to know about this machine:

* It includes an [M9312 ROM](/devices/pdp11/rom/M9312/) at address 165000.  The exact ROM is [23-616F1](/devices/pdp11/rom/M9312/23-616F1.txt).
