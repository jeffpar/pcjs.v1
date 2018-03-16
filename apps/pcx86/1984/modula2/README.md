---
layout: page
title: "Logitech Modula-2/86 Compiler (1984)"
permalink: /apps/pcx86/1984/modula2/
machines:
  - id: ibm5160-msdos320
    type: pcx86
    state: /apps/pcx86/1984/modula2/state.json
    config: /devices/pcx86/machine/5160/ega/640kb/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:3,path:"/pcjs-disks/pcx86/drives/10mb/MSDOS320-C400.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: None
---

Logitech Modula-2/86 Compiler (1984)
------------------------------------

This is a demo of Logitech's [Modula-2/86 Compiler 1.10](/disks/pcx86/tools/logitech/modula2/1.10/).
The compiler has been installed in an
[IBM PC XT (Model 5160, 640Kb, 10Mb Drive) with EGA Display](/devices/pcx86/machine/5160/ega/640kb/),
along with a [10Mb Drive](/disks/pcx86/drives/10mb/) containing
[MS-DOS 3.20 with Microsoft C 4.00](/disks/pcx86/drives/10mb/msdos320-c400-xt3.xml).

PCjs has also archived some Modula-2 sample code.  See the "[FantasyLand](/blog/2017/07/03/)" PCjs blog post
for details.

{% include machine.html id="ibm5160-msdos320" %}

For more classic PC software, see the PCjs collection of [IBM PC Application Demos](/apps/pcx86/).

References
----------

* [Logitech Modula-2/86 v1.0 Manual](http://bitsavers.informatik.uni-stuttgart.de/pdf/logitech/modula-2/Logitech_Modula-2_86_1.0_Feb84.pdf)
