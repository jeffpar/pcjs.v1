---
layout: page
title: "Microsoft Windows 95 (First Retail Release) with Debugger"
permalink: /disks/pcx86/windows/win95/4.00.950/debugger/
machines:
  - type: pcx86
    id: deskpro386
    debugger: true
    state: /disks/pcx86/windows/win95/4.00.950/deskpro386.json
    config: /devices/pcx86/machine/compaq/deskpro386/vga/4096kb/debugger/machine.xml
    drives: '[{name:"68Mb Hard Disk",type:4,path:"http://archive.pcjs.org/disks/pcx86/fixed/68mb/win95.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: None
---

Microsoft Windows 95 (First Retail Release) with Debugger
---

Windows 95 is shown running below, following a "Compact Installation" on a 68Mb hard disk.  Before the machine can
start, it must download the disk image, which may take a minute or two, depending on the speed of your
internet connection.  You can also run [Windows 95](../) without the PCjs Debugger.

More information about this Windows 95 demo is available in the [PCjs Blog](/blog/2015/09/21/).

{% include machine.html id="deskpro386" %}
