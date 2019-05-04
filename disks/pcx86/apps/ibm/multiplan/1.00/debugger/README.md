---
layout: page
title: IBM Multiplan 1.00 (with Debugger)
permalink: /disks/pcx86/apps/ibm/multiplan/1.00/debugger/
machines:
  - id: ibm5150
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/5150/cga/64kb/debugger/machine.xml
    autoMount:
      A:
        name: "IBM Multiplan 1.00 (Program)"
      B:
        name: None
    autoType: $date\r$time\r
---

IBM Multiplan 1.00 (with Debugger)
----------------------------------

{% include machine.html id="ibm5150" %}

### Copy-Protection Information

The following *diskdump* command was used to reflect the necessary copy-protection in our disk image:

    diskdump --disk=archive/MULTIPLAN-IBM100-PROGRAM-BACKUP.img --format=json --output=MULTIPLAN-IBM100-PROGRAM.json --sectorID=11:0:8:61 --manifest --overwrite
