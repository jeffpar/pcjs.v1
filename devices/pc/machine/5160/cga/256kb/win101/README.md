---
layout: page
title: "IBM PC XT (Model 5160, 256Kb, 10Mb Drive) with Color Display running Windows 1.01"
permalink: /devices/pc/machine/5160/cga/256kb/win101/
redirect_from:
  - /configs/pc/machines/5160/cga/256kb/win101/
  - /demos/pc/cga-win101/xt-cga-win101.xml/
  - /demos/pc/cga-win101/
machines:
  - type: pc
    id: ibm5160
---

IBM PC XT running Windows 1.01
---

[Microsoft Windows 1.01](/disks/pc/windows/1.01/), the first public version of Windows, was released on
November 20, 1985.  It is shown here running on an IBM PC XT (Model 5160) with a CGA Display.

You can also run [Windows 1.01 with an EGA Display](/disks/pc/windows/1.01/).

{% include machine.html id="ibm5160" %}

The above simulation is configured for a clock speed of 4.77Mhz, with 256Kb of RAM and a CGA Display,
using the original IBM PC Model 5160 ROM BIOS and CGA font ROM.  Even though the CGA was a "Color Graphics Adapter,"
the only CGA mode that Windows supported was the 640x200 2-color mode, hence its black-and-white appearance.

This PC XT configuration also includes a 10Mb hard disk with Windows 1.01 pre-installed.
This particular configuration will NOT save any changes when your browser exits, since it has
been pre-configured to always start Windows 1.01 in the same state.

NOTE: The Windows 1.01 mouse pointer can be controlled with your mouse, but only when your mouse is
within the "CGA Display" window. This is a restriction imposed by your web browser, not PCjs.

For more control over this machine, try the [Control Panel](debugger/) configuration, featuring the
built-in PCjs Debugger, with save/restore enabled.
