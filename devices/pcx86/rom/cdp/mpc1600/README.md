---
layout: page
title: Columbia Data Products MPC 1600 ROM BIOS
permalink: /devices/pcx86/rom/cdp/mpc1600/
---

Columbia Data Products MPC 1600 ROM BIOS
---
[BIOS-434.json](BIOS-434.json) is a JSON-encoded dump of the ROM images (MPC4.34_U45.BIN, MPC4.34_U46.BIN, and
MPC4.34_U47.BIN) obtained from the
[www.minuszerodegrees.net](http://www.minuszerodegrees.net/rom/rom.htm) website.  

The dump was produced by concatenating the three 4Kb ROM images to produce a single 12Kb ROM image and then running
[FileDump](/modules/filedump/):

	cat archive/MPC4.34_U47.BIN archive/MPC4.34_U46.BIN archive/MPC4.34_U45.BIN > archive/BIOS-434.rom
	filedump --file=archive/BIOS-434.rom --output=BIOS-143.json
