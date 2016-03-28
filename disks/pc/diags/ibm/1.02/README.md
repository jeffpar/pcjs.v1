---
layout: page
title: "IBM PC (Model 5150) running IBM PC Advanced Diagnostics 1.02"
permalink: /disks/pc/diags/ibm/1.02/
machines:
  - type: pc
    id: ibm5150
    debugger: true
    config: /devices/pc/machine/5150/mda/64kb/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pc/diags/ibm/1.02/5150_ADVDIAG_102.json
---

{% include machine.html id="ibm5150" %}
