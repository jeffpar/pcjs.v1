---
layout: post
title: Turbo Pascal vs. QuickPascal
date: 2018-03-22 10:00:00
permalink: /blog/2018/03/22/
machines:
  - id: ibm5170-msdos320-1
    type: pcx86
    class: machine-left
    state: /disks/pcx86/tools/microsoft/pascal/quickpascal/1.00/state.json
    config: /devices/pcx86/machine/5170/ega/640kb/rev3/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:1,path:"/pcjs-disks/pcx86/drives/10mb/MSDOS320-C400.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: None
    autoStart: true
    autoType: CD TP\rTURBO\r$10$altF$right$right$right$right$right$right$right
  - id: ibm5170-msdos320-2
    type: pcx86
    class: machine-right
    state: /disks/pcx86/tools/microsoft/pascal/quickpascal/1.00/state.json
    config: /devices/pcx86/machine/5170/ega/640kb/rev3/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:1,path:"/pcjs-disks/pcx86/drives/10mb/MSDOS320-C400.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: None
    autoStart: true
    autoType: CD QP\rQP SAMPLES\\SORTDEMO.PAS\r$20$f5TI
---

Below are side-by-side PCjs machines running
[Borland Turbo Pascal 5.00](/disks/pcx86/tools/borland/pascal/5.00/) and
[Microsoft QuickPascal 1.00](/disks/pcx86/tools/microsoft/pascal/quickpascal/1.00/).
 
{% include machine.html id="ibm5170-msdos320-1" %}

{% include machine.html id="ibm5170-msdos320-2" %}

*[@jeffpar](http://twitter.com/jeffpar)*  
*Mar 22, 2018*
