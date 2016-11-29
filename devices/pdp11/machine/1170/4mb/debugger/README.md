---
layout: page
title: PDP-11/70 with 4Mb, Front Panel, and Debugger
permalink: /devices/pdp11/machine/1170/4mb/debugger/
machines:
  - id: test1170
    type: pdp11
    debugger: true
    autoStart: true
    autoMount:
      RL2:
        path: http://archive.pcjs.org/disks/dec/rl01k/RL01K-RSTS-V70.json
---

{% include machine.html id="test1170" %}
