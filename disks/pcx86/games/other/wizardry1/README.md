---
layout: page
title: "Wizardry I: Proving Grounds of the Mad Overlord"
permalink: /disks/pcx86/games/other/wizardry1/
machines:
  - id: ibm5150-wizardry1
    type: pcx86
    config: /devices/pcx86/machine/5150/cga/256kb/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/games/other/wizardry1/WIZARDRY1-MASTER.json
      B:
        path: /disks/pcx86/games/other/wizardry1/WIZARDRY1-SCENARIO.json
    autoStart: true
    resume: 1
    sound: false
---

Wizardry I: Proving Grounds of the Mad Overlord
-----------------------------------------------

{% include machine.html id="ibm5150-wizardry1" %}

For more classic PC software experiences, see the PCjs collection of [IBM PC Application Demos](/apps/pcx86/).
