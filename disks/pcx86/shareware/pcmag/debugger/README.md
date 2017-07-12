---
layout: page
title: PC Magazine Disks (with Debugger)
permalink: /disks/pcx86/shareware/pcmag/debugger/
machines:
  - id: ibm5150-pcmag
    type: pcx86
    config: /devices/pcx86/machine/5160/ega/640kb/debugger/machine.xml
    autoMount:
      B:
        name: PC Magazine (Vol. 06 No. 08)
    autoStart: true
    autoType: $date\r$time\r
---

PC Magazine Disks (with Debugger)
---------------------------------

{% include machine.html id="ibm5150-pcmag" %}
