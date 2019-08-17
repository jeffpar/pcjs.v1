---
layout: page
title: Microsoft QuickBASIC 2.00 with Debugger
permalink: /disks/pcx86/tools/microsoft/basic/quickbasic/2.00/debugger/
machines:
  - id: ibm5160-msdos320
    type: pcx86
    config: /devices/pcx86/machine/5160/ega/512kb/debugger/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:3,path:"/disks-demo/pcx86/drives/10mb/MSDOS320-C400.json"}]'
    floppyDrives: '[{boot:false},{}]'
    autoMount:
      A:
        name: MS QuickBASIC 2.00 (Disk 1)
      B:
        name: MS QuickBASIC 2.00 (Personal)
---

Microsoft QuickBASIC 2.00 with Debugger
---------------------------------------

{% include machine.html id="ibm5160-msdos320" %}
