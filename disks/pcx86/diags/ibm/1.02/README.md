---
layout: page
title: "IBM PC (Model 5150) running IBM PC Advanced Diagnostics 1.02"
permalink: /disks/pcx86/diags/ibm/1.02/
redirect_from:
  - /disks/pc/diags/ibm/1.02/
machines:
  - type: pcx86
    id: ibm5150
    debugger: true
    config: /devices/pcx86/machine/5150/mda/64kb/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/diags/ibm/1.02/5150_ADVDIAG_102.json
---

{% include machine.html id="ibm5150" %}
