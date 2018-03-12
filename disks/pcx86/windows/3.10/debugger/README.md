---
layout: page
title: Microsoft Windows 3.10 with Debugger
permalink: /disks/pcx86/windows/3.10/debugger/
machines:
  - id: ibm5170
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/5170/vga/2048kb/debugger/machine.xml
    drives: '[{name:"20Mb Hard Disk",type:2,path:"/pcjs-disks/pcx86/drives/20mb/PCDOS330-WIN310-VGA.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: None
---

Microsoft Windows 3.10 with Debugger
------------------------------------

The PCjs machine below loads [Microsoft Windows 3.10](../) with the PCjs Debugger.

{% include machine.html id="ibm5170-win310" %}
