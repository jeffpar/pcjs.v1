---
layout: page
title: IBM PC (Model 5150, 64Kb) with Dual Displays
permalink: /devices/pcx86/machine/5150/dual/64kb/
machines:
  - id: ibm5150
    type: pcx86
    autoMount:
      A:
        name: PC DOS 3.00 (Disk 1)
---

IBM PC (Model 5150, 64Kb) with Dual Displays
--------------------------------------------

The original IBM PC supported multiple display adapters.  This page demonstrates a PCjs hardware configuration with
both a Monochrome Display connected to an MDA (Monochrome Display Adapter) and a Color Display connected to a CGA
(Color Display Adapter).

At any given time, only one display was considered "active", and the initial active display was determined by switches
on the motherboard.  After booting DOS, you could use **MODE** commands to change the active display:

- *mode co40* selects the Color Display and sets it to 40-column mode
- *mode co80* selects the Color Display and sets it to 80-column mode
- *mode mono* selects the Monochrome Display, which supports only 80-column mode

The initial active display for the machine below is the Monochrome Display.  Third-party software with dual-display 
support could write to both displays simultaneously, but most text-based applications only wrote to the active display.
Programs that used color graphics, on the other hand, might use the Color Display whether or not it was currently
active.

{% include machine.html id="ibm5150" %}
