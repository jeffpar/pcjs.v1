---
layout: page
title: IBM PC ROMs
permalink: /devices/pcx86/rom/
---

IBM PC ROMs
-----------

ROMs are added to machines by including one *[ROM](/docs/pcx86/rom/)* component in the machine XML configuration file
for each ROM in the machine; eg:

```xml
<rom id="romBIOS" addr="0xf0000" size="0x10000" alias="0xff0000" file="/devices/pcx86/rom/5170/1984-01-10/ATBIOS-REV1.json"/>
```

### IBM BIOS ROMs

- [IBM PC (Model 5150)](5150/)
- [IBM PC XT (Model 5160)](5160/)
- [IBM PC AT (Model 5170)](5170/)

### IBM BASIC ROMs

The project supports the following [IBM PC BASIC ROMs](5150/basic/):

- [IBM BASIC C1.00](5150/basic/BASIC100.json)
- [IBM BASIC C1.10](5160/basic/BASIC110.json)

We informally refer to version C1.00 as the Model 5150 version, and C1.10 as the Model 5160 (and later) version of
Cassette BASIC.  It's true that the last few Model 5150 machines produced were upgraded with version C1.10, but we
are simply referring to the respective model with which each version of Cassette BASIC was *introduced*.

### OEM BIOS ROMs

The project also includes BIOS ROMs for a variety of PC-compatible OEM machines, including:

- [AT&amp;T 6300](att/)
- [Columbia Data Products MPC 1600](cdp/)
- [COMPAQ Portable and DeskPro Machines](compaq/)
- [Olivetti M24](olivetti/)
- [Zenith Data Systems Z-150](zenith/)

### Adapter ROMs

The project also includes ROMs for assorted adapters, including IBM [EGA](/devices/pcx86/video/ibm/ega/#ibm-ega-rom)
and [VGA](/devices/pcx86/video/ibm/vga/#ibm-vga-rom) ROMs, the Xebec Hard Drive Controller ROM used in
the PC XT, etc, but those ROMs seemed more appropriately filed in their respective component folders;
eg, [IBM PC Video Devices](/devices/pcx86/video/).
