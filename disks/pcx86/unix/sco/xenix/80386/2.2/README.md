---
layout: page
title: SCO Xenix 386 v2.2
permalink: /disks/pcx86/unix/sco/xenix/80386/2.2/
machines:
  - id: deskpro386
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/compaq/deskpro386/ega/2048kb/debugger/machine.xml
    autoMount:
      A:
        name: SCO Xenix 386 2.2 (BOOTN1)
      B:
        name: None
    autoStart: true
    messages: fault
    commands: bp #0020:000000AA
---

SCO Xenix 386 v2.2
------------------

{% include machine.html id="deskpro386" %}
