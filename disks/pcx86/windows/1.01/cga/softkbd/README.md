---
layout: page
title: Microsoft Windows 1.01 with CGA Display and Soft Keyboard
permalink: /disks/pcx86/windows/1.01/cga/softkbd/
redirect_from:
  - /configs/pc/machines/5160/cga/256kb/win101/softkbd/index.xml/
  - /configs/pc/machines/5160/cga/256kb/win101/softkbd/machine.xml/
  - /devices/pcx86/machine/5160/cga/256kb/win101/softkbd/
machines:
  - id: ibm5160
    type: pcx86
    debugger: true
    state: /disks/pcx86/windows/1.01/cga/state.json
    config: /devices/pcx86/machine/5160/cga/256kb/softkbd/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:3,path:"/disks/pcx86/fixed/10mb/PCDOS200-WIN101-CGA.json"}]'
---

Microsoft Windows 1.01 with CGA Display and Soft Keyboard
---------------------------------------------------------

{% include machine.html id="ibm5160" %}
