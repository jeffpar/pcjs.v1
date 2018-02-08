---
layout: page
title: SCO Xenix System V Release 2.1.3 for i8086
permalink: /disks/pcx86/unix/sco/xenix/086/2.1.3/
machines:
  - id: ibm5160
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/5160/cga/640kb/debugger/machine.xml
    autoMount:
      A:
        name: SCO Xenix 8086 (N1)
      B:
        name: None
    autoStart: true
---

SCO Xenix System V Release 2.1.3 for i8086
------------------------------------------

Boot from disk "N1" (must not be write-protected).

	Serial number: sco005312
	Activation key: thmjvbqz

Note: this Xenix version can't run with a VGA card.
You can use a Hercules monochrome card or a CGA/EGA card.

{% include machine.html id="ibm5160" %}
