---
layout: page
title: IBM PC ROMs
permalink: /devices/pc/rom/
redirect_from:
  - /devices/pc/bios/
---

IBM PC ROMs
---

ROMs are added to machines by including one *[ROM](/docs/pcjs/rom/)* component in the machine XML configuration file
for each ROM in the machine; eg:

	<rom id="romBIOS" addr="0xf0000" size="0x10000" alias="0xff0000" file="/devices/pc/rom/5170/bios/1984-01-10/ATBIOS-REV1.json"/>

### BASIC ROMs

The project contains the following IBM PC BASIC ROMs:

 * [IBM BASIC 1.00](5150/basic/BASIC100.json)
 * [IBM BASIC 1.10](5160/basic/BASIC110.json)

### BIOS ROMs

The project contains the following IBM PC BIOS ROMs:

 * [Model 5150: Apr 24, 1981](5150/bios/1981-04-24/PCBIOS-REV1.json)
 * [Model 5150: Oct 19, 1981](5150/bios/1981-10-19/PCBIOS-REV2.json)
 * [Model 5150: Oct 27, 1982](5150/bios/1982-10-27/PCBIOS-REV3.json)
 * [Model 5160: Nov 08, 1982](5160/bios/1982-11-08/XTBIOS-REV1.json)
 * [Model 5160: May 09, 1986](5160/bios/1986-05-09/XTBIOS-REV3.json)

The project also contains BIOS ROMs, along with more detailed information, for the following machines:

 * [IBM PC AT Model 5170](5170/bios/)
 * [COMPAQ Portable and DeskPro Machines](compaq/bios/)

### Other ROMs

The project contains other ROMs, including IBM [EGA](/devices/pc/video/ibm/ega/#ibm-ega-rom) and
[VGA](/devices/pc/video/ibm/vga/#ibm-vga-rom) ROMs, the Xebec Hard Disk Controller ROM used in
the PC XT, etc, but those ROMs seemed more appropriately filed in their respective component folders;
eg, [IBM PC Video Devices](/devices/pc/video/).
