---
layout: page
title: "IBM PC (Model 5150) running IBM PC Advanced Diagnostics 1.02"
permalink: /disks/pcx86/diags/ibm/1.02/
machines:
  - id: ibm5150
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/5150/mda/64kb/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/diags/ibm/1.02/5150-ADV-DIAG-102.json
---

{% include machine.html id="ibm5150" %}
