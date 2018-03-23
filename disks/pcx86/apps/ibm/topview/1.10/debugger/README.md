---
layout: page
title: "TopView 1.10 (With Debugger)"
permalink: /disks/pcx86/apps/ibm/topview/1.10/debugger/
machines:
  - id: ibm5160
    type: pcx86
    config: /devices/pcx86/machine/5160/cga/640kb/mouse/debugger/machine.xml
    autoMount:
      A:
        name: PC-DOS 2.00 (Disk 1)
      B:
        name: TopView 1.10
    autoType: $date\r$time\rB:\rSETUP\r$30$15y \r$15.1\r
---

TopView 1.10 (With Debugger)
----------------------------

{% include machine.html id="ibm5160" %}
