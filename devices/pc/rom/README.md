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

	<rom id="romBIOS" addr="0xf0000" size="0x10000" alias="0xff0000" file="/devices/pc/rom/5170/1984-01-10/ATBIOS-REV1.json"/>

### BASIC ROMs

The project contains the following [IBM PC BASIC ROMs](/devices/pc/rom/5150/basic/):

 * [IBM BASIC C1.00](5150/basic/BASIC100.json)
 * [IBM BASIC C1.10](5160/basic/BASIC110.json)

We informally refer to version C1.00 as the Model 5150 version, and C1.10 as the Model 5160 (and later) version of
Cassette BASIC.  It's true that the last few Model 5150 machines produced were upgraded with version C1.10, but we
are simply referring to the respective model with which each version of Cassette BASIC was *introduced*.

### BIOS ROMs

The project contains the following IBM PC BIOS ROMs:

 * [Model 5150: Apr 24, 1981](5150/1981-04-24/PCBIOS-REV1.json) (included with [IBM BASIC C1.00](5150/basic/BASIC100.json))
 * [Model 5150: Oct 19, 1981](5150/1981-10-19/PCBIOS-REV2.json) (included with [IBM BASIC C1.00](5150/basic/BASIC100.json))
 * [Model 5150: Oct 27, 1982](5150/1982-10-27/PCBIOS-REV3.json) (included with [IBM BASIC C1.00](5150/basic/BASIC100.json) *or* [IBM BASIC C1.10](5160/basic/BASIC110.json))
 * [Model 5160: Nov 08, 1982](5160/1982-11-08/XTBIOS-REV1.json) (included with [IBM BASIC C1.10](5160/basic/BASIC110.json))
 * [Model 5160: Jan 10, 1986](5160/1986-01-10/XTBIOS-REV2.json) (includes [IBM BASIC C1.10](5160/basic/BASIC110.json))
 * [Model 5160: May 09, 1986](5160/1986-05-09/XTBIOS-REV3.json) (includes [IBM BASIC C1.10](5160/basic/BASIC110.json))

As hinted above, some newer Model 5150 machines with the **Oct 27, 1982** BIOS included IBM BASIC C1.10.  And
some even *newer* 5150 machines had a BIOS with a "1982" copyright year instead of "1981", which also changed the checksum
byte from 0x78 to 0x77.  However, the project includes only the original "1981" version, since the difference was trivial.

In general, IBM BASIC ROM images are 32Kb and IBM BIOS ROM images are 8Kb, and together they provided 40Kb of contiguous
read-only memory, with the BASIC ROM spanning physical addresses 0xF6000-0xFDFFF and the BIOS ROM spanning addresses
0xFE000-0xFFFFF.

However, starting with Model 5160 ROM images dated **Jan 10, 1986**, our ROM images are actually 64Kb images that
span addresses 0xF0000-0xFFFFF and include IBM BASIC C1.10 at offset 0x6000 (physical address 0xF6000), so there's no
need to load the BASIC ROM separately.  That trend continued with the IBM PC AT Model 5170, whose ROM images are also
64Kb and all contain IBM BASIC C1.10.

Apparently, even the first Model 5160 was socketed for two 32Kb ROMs, but it came with an 8Kb ROM in the first socket,
so that ROM (containing the first 8Kb of IBM BASIC C1.10) appeared at multiple addresses: 0xF0000, 0xF2000, 0xF4000,
and 0xF6000.  None of our Model 5160 machine configurations emulate that layout, but it could easily be done,
by extracting the first 8Kb of IBM BASIC C1.10 into a separate image and explicitly mapping it at each of those four
addresses.

See this [diagram](http://www.minuszerodegrees.net/5160/misc/5160_memory_layout_of_bios_and_basic.jpg) for a more
visual description of the Model 5160's ROM layout.

---

The project also contains BIOS ROMs, along with more detailed information, for the following machines:

 * [IBM PC AT Model 5170](5170/)
 * [COMPAQ Portable and DeskPro Machines](compaq/)

### Other ROMs

The project contains other ROMs, including IBM [EGA](/devices/pc/video/ibm/ega/#ibm-ega-rom) and
[VGA](/devices/pc/video/ibm/vga/#ibm-vga-rom) ROMs, the Xebec Hard Disk Controller ROM used in
the PC XT, etc, but those ROMs seemed more appropriately filed in their respective component folders;
eg, [IBM PC Video Devices](/devices/pc/video/).
