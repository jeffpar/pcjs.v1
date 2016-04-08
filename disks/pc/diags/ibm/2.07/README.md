---
layout: page
title: "IBM PC AT (Model 5170) running IBM PC AT Advanced Diagnostics 2.07"
permalink: /disks/pc/diags/ibm/2.07/
machines:
  - type: pc
    id: ibm5170
    debugger: true
    config: /devices/pc/machine/5170/vga/4096kb/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pc/diags/ibm/2.07/5170_ADVDIAG_207.json
---

{% include machine.html id="ibm5170" %}
