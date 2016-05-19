---
layout: page
title: Olivetti M24 ROM BIOS
permalink: /devices/pcx86/rom/olivetti/m24/
redirect_from:
  - /devices/pc/rom/olivetti/m24/
  - /devices/pcx86/rom/olivetti/
---

Olivetti M24 ROM BIOS
---
[BIOS-143.json](BIOS-143.json) is JSON-encoded dump of the ROM images (OLIVETTI_M24_VERSION_1.43_LOW.BIN
and OLIVETTI_M24_VERSION_1.43_HIGH.BIN) obtained from the
[www.minuszerodegrees.net](http://www.minuszerodegrees.net/rom/rom.htm) website.  

The dump was produced by running [FileDump](/modules/filedump/) to merge the even and odd portions (8Kb each)
to produce a single 16Kb ROM image:

	filedump --file=archive/OLIVETTI_M24_VERSION_1.43_LOW.BIN --merge=archive/OLIVETTI_M24_VERSION_1.43_HIGH.BIN --output=BIOS-143.json
