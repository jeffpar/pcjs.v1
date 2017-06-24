---
layout: page
title: "IBM PC AT (Model 5170) running IBM PC AT Advanced Diagnostics 2.07"
permalink: /disks/pcx86/diags/ibm/2.07/
machines:
  - id: ibm5170
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/5170/vga/4096kb/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/diags/ibm/2.07/5170_ADVDIAG_207.json
---

{% include machine.html id="ibm5170" %}
