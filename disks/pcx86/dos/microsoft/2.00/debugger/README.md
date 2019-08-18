---
layout: page
title: Microsoft MS-DOS 2.00 with Debugger
permalink: /disks/pcx86/dos/microsoft/2.00/debugger/
machines:
  - id: ibm5160
    type: pcx86
    config: /devices/pcx86/machine/5160/cga/512kb/debugger/machine.xml
    drives: '[{name:"PC-DOS 2.00 w/Tools (10Mb)",type:3,path:"/disks-demo/pcx86/drives/10mb/PCDOS200-C400.json"},{name:"MS-DOS 1.x/2.x Source (10Mb)",type:3,path:"/disks-demo/pcx86/dos/microsoft/2.00/MSDOS-SRC.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: None
    autoStart: true
    autoType: $date\r$time\rD:\rMODE COM1:9600,N,8,1\r
---

Microsoft MS-DOS 2.00 with Debugger
-----------------------------------

See [Microsoft MS-DOS 2.00](/disks/pcx86/dos/microsoft/2.00/) for more information about this release.

### MS-DOS Source Build Machine

A quick note about speed: the typical PC in the early 1980s was still a 4.77Mhz 8088-based machine, so it took
a considerable amount of time to assemble all the MS-DOS 2.x sources.  If you're impatient, you can load the machine
on this page with a higher speed multiplier (eg, [multiplier=8](https://www.pcjs.org/disks/pcx86/dos/microsoft/2.00/debugger/?multiplier=8))
or click the *Speed* button below until it's running at speed that you prefer (and that your browser supports).

In addition, all the build products (**OBJ**, **EXE**, **COM**, **LST**, and **MAP** files) from a successful
`MK ALL` command have already been saved in the [pcjs-disks](https://github.com/jeffpar/pcjs-demo-disks) repository, in the
[/pcx86/dos/microsoft/2.11/built](https://github.com/jeffpar/pcjs-demo-disks/tree/master/pcx86/dos/microsoft/2.11/built)
folder.

{% include machine.html id="ibm5160" %}
