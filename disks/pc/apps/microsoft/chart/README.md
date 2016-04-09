---
layout: page
title: Microsoft Chart
permalink: /disks/pc/apps/microsoft/chart/
---

Microsoft Chart
---

Demos are available for these versions of [Microsoft Chart](https://en.wikipedia.org/wiki/Microsoft_Office_shared_tools#Graph):

* [Microsoft Chart](2.02/)

Notes
---

The Microsoft Chart 2.02 disk is clearly not an original distribution disk.

The disk image contains "SPERRY Personal Computer MS-DOS 2.11 version 1.11 Copyright 1981,82,83 Microsoft Corp."
with a COMMAND.COM dated "3-16-87".  It boots but then crashes when COMMAND.COM attempts to display the current date.

COMMAND.COM appears to be loaded too high in conventional memory, because it builds the current date string above
segment 0xA000, so when it attempts to print that string, DOS finds only garbage (0xFF bytes, and no terminating $).
This suggests that either there is a mismatch between the IBMBIO.COM, IBMDOS.COM and COMMAND.COM files on this disk,
or that there is something special about the BIOS found on a SPERRY computer that is critical to booting these files.

I'm sure with further debugging we could find out one way or the other, but let's leave that for another day.  It's not
clear it's really worth the effort.  To start, the IBMBIO.COM, IBMDOS.COM and COMMAND.COM files should be placed onto
their own MS-DOS disk image and archived appropriately.  A search for the rest of the SPERRY OEM distribution files
should also be conducted.

I would much rather post copies of original distribution disks here, but this is all we've currently got.
