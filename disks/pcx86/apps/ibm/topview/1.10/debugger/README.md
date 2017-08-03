---
layout: page
title: "TopView 1.10 (With Debugger)"
permalink: /disks/pcx86/apps/ibm/topview/1.10/debugger/
machines:
  - id: ibm5160
    type: pcx86
    config: /devices/pcx86/machine/5160/cga/640kb/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/dos/ibm/2.00/PCDOS200-DISK1.json
      B:
        path: /disks/pcx86/apps/ibm/topview/1.10/TOPVIEW110.json
    autoType: \r\rb:\rtv\r
---

TopView 1.10 (With Debugger)
----------------------------

{% include machine.html id="ibm5160" %}
