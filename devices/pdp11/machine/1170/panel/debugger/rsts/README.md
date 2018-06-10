---
layout: page
title: PDP-11/70 for RSTS/E with Front Panel and Debugger
permalink: /devices/pdp11/machine/1170/panel/debugger/rsts/
machines:
  - id: test1170
    type: pdp11
    config: /devices/pdp11/machine/1170/panel/debugger/machine.xml
    debugger: true
    autoStart: true
    autoMount:
      RL0:
        path: https://s3-us-west-2.amazonaws.com/archive.pcjs.org/disks/dec/rl01k/RL01K-RSTS-V70.json
---

This machine is ready to boot [RSTS/E v7.0](/disks/dec/rl01k/rstsv70/) ("BOOT RL0").

{% include machine.html id="test1170" %}
