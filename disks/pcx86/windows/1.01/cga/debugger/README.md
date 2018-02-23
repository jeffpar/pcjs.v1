---
layout: page
title: Microsoft Windows 1.01 with CGA Display and Debugger
permalink: /disks/pcx86/windows/1.01/cga/debugger/
redirect_from:
  - /configs/pc/machines/5160/cga/256kb/win101/debugger/
  - /configs/pc/machines/5160/cga/256kb/win101/softkbd/
  - /devices/pcx86/machine/5160/cga/256kb/win101/debugger/
  - /devices/pcx86/machine/5160/cga/256kb/win101/softkbd/
  - /disks/pcx86/windows/1.01/cga/softkbd/
machines:
  - id: ibm5160-cga-win101
    type: pcx86
    debugger: true
    resume: 1
    state: /disks/pcx86/windows/1.01/cga/state.json
    config: /devices/pcx86/machine/5160/cga/256kb/debugger/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:3,path:"https://jeffpar.github.io/pcjs-disks/pcx86/drives/10mb/PCDOS200-WIN101-CGA.json"}]'
---

Microsoft Windows 1.01 with CGA Display and Debugger
----------------------------------------------------

{% include machine.html id="ibm5160-cga-win101" %}
