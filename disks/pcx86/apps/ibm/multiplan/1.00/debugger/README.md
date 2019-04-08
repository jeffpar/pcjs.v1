---
layout: page
title: IBM Multiplan 1.00 (with Debugger)
permalink: /disks/pcx86/apps/ibm/multiplan/1.00/debugger/
machines:
  - id: ibm5150
    type: pcx86
    config: /devices/pcx86/machine/5150/cga/64kb/debugger/machine.xml
    autoMount:
      A:
        name: PC DOS 1.10
      B:
        name: IBM Multiplan 1.00 (Program)
    autoType: $date\r$time\rB:\rMP80\r
---

IBM Multiplan 1.00 (with Debugger)
----------------------------------

{% include machine.html id="ibm5150" %}
