---
layout: page
title: "IBM PC (Model 5150) running IBM PC Advanced Diagnostics 2.20"
permalink: /disks/pcx86/diags/ibm/2.20/
machines:
  - type: pcx86
    id: ibm5150
    debugger: true
    config: /devices/pcx86/machine/5150/mda/64kb/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/diags/ibm/2.20/5150_5155_5160_ADVDIAG_220.json
---

{% include machine.html id="ibm5150" %}
