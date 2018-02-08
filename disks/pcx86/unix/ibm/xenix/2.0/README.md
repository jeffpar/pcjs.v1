---
layout: page
title: IBM PC Xenix 2.0
permalink: /disks/pcx86/unix/ibm/xenix/2.0/
machines:
  - id: ibm5170
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/5170/ega/640kb/rev1/debugger/machine.xml
    autoMount:
      A:
        name: IBM Xenix 2.0 (INSTALL)
      B:
        name: None
    autoStart: true
---

IBM PC Xenix 2.0
----------------

{% include machine.html id="ibm5170" %}
