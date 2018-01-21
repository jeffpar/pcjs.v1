---
layout: page
title: "Logitech Modula-2/86 Compiler (1984)"
permalink: /apps/pcx86/1984/modula2/
machines:
  - id: ibm5160-msdos320
    type: pcx86
    resume: 1
    state: /apps/pcx86/1984/modula2/state.json
    config: /devices/pcx86/machine/5160/ega/640kb/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:3,path:"/disks/pcx86/fixed/10mb/MSDOS320-C400.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: None
---

Logitech Modula-2/86 Compiler (1984)
------------------------------------

Logitech's Modula-2 Compiler (Modula-2/86 v1.10) has been installed in the machine below.  The machine is
an [IBM PC XT (Model 5160, 640Kb, 10Mb Drive) with EGA Display](/devices/pcx86/machine/5160/ega/640kb/), but
the hard drive has been replaced with a [10Mb Drive](/disks/pcx86/fixed/10mb/) containing
[MS-DOS 3.20 with Microsoft C 4.00](/disks/pcx86/fixed/10mb/msdos320-c400-xt3.xml), and then all the Modula-2 installation
changes have been overlaid onto it.

{% include machine.html id="ibm5160-msdos320" %}

For more classic PC software experiences, see the PCjs collection of [IBM PC Application Demos](/apps/pcx86/).

References
----------

* [Logitech Modula-2/86 v1.0 Manual](http://bitsavers.informatik.uni-stuttgart.de/pdf/logitech/modula-2/Logitech_Modula-2_86_1.0_Feb84.pdf)
