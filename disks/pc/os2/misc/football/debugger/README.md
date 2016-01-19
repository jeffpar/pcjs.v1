---
layout: page
title: "OS/2 FOOTBALL Boot Disk (v7.68.17)"
permalink: /disks/pc/os2/misc/football/debugger/
machines:
  - type: pc-dbg
    id: deskpro386
    config: /devices/pc/machine/compaq/deskpro386/ega/2048kb/machine.xml
    uncompiled: true
    automount:
        A:
          name: OS/2 FOOTBALL Boot Disk (v7.68.17)
          path: /disks/pc/os2/misc/football/debugger/FOOTBALL-7.68.17.json
---

OS/2 FOOTBALL Boot Disk (v7.68.17)
---

This boot disk contains a prototype version of OS/2 from early 1987 that added preliminary support for the Intel 80386
processor, including limited support for 32-bit code and the ability to run multiple DOS applications in V86-mode.
It was forked from pre-OS/2 1.0 sources, and the only machine it supported was the Compaq DeskPro 386-16.

{% include machine.html id="deskpro386" %}

Return to [Other OS/2 Disks](/disks/pc/os2/misc/).
