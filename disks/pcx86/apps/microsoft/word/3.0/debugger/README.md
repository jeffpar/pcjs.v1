---
layout: page
title: Microsoft Word 3.0 (with Debugger)
permalink: /disks/pcx86/apps/microsoft/word/3.0/debugger/
machines:
  - id: ibm5160
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/5160/ega/640kb/debugger/machine.xml
    autoMount:
      A:
        name: PC DOS 2.00 (Disk 1)
      B:
        name: MS Word 3.0 (Disk 1)
    autoStart: true
    autoType: $date\r$time\rB:\rWORD\r
---

Microsoft Word 3.0 (with Debugger)
----------------------------------

NOTE: For an interesting bit of trivia regarding Microsoft Word 3.0's `SPELL` utility, see the PCjs blog post
"[Somebody Put a SPELL On Me](/blog/2018/05/27/)".

{% include machine.html id="ibm5160" %}
