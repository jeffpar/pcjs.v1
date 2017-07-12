---
layout: page
title: PC Magazine Disks (with Debugger)
permalink: /disks/pcx86/shareware/pcmag/debugger/
machines:
  - id: ibm5160-pcmag
    type: pcx86
    config: /devices/pcx86/machine/5160/ega/640kb/debugger/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:3,path:"/disks/pcx86/fixed/10mb/MSDOS320-C400.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: PC Magazine (Vol. 06 No. 08)
    autoStart: true
---

PC Magazine Disks (with Debugger)
---------------------------------

{% include machine.html id="ibm5160-pcmag" %}
