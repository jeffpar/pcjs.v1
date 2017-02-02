---
layout: page
title: RX11 Disk Controller
permalink: /devices/pdp11/rx11/
---

RX11 Disk Controller
--------------------

The RX11 Disk Controller controls up to two RX01 disk drives, which in turn read/write 8-inch diskettes that DEC
merely describes as "compatible with the IBM 3740 family of equipment."  We refer to them simply as RX01 diskettes.

RX01 diskettes are single-sided, with a logical format of 77 tracks, 26 sectors per track, and a sector size of 128
bytes, for a total capacity of 250Kb (256,256 bytes).

> **SIDEBAR**: DEC's [documentation](/pubs/dec/pdp11/rx11/) claims a capacity of "256K bytes", but like many disk drive
manufacturers, they overstated the capacity by treating "K" as 1000 rather than 1024, which was its traditional meaning
within the computer industry at the time.  DEC's own processor handbooks, for example, invariably used "K" to mean 1024.

> However, since 1998, standards organizations have been pushing the term "kibibyte" (abbreviated KiB) to mean 1024 bytes,
in an effort to redefine the "K" in "Kilobyte" (Kb) as 1000, but that doesn't change what the term commonly meant prior
to 1998 (the marketing departments of disk drive manufacturers notwithstanding).

Machines containing the [RX11 Component](/modules/pdp11/lib/rx11.js) include:

- [PDP-11/70 with Front Panel](/devices/pdp11/machine/1170/panel/) (with [Debugger](/devices/pdp11/machine/1170/panel/debugger/))
- [PDP-11/70 with VT100 Terminal](/devices/pdp11/machine/1170/vt100/) (with [Debugger](/devices/pdp11/machine/1170/vt100/debugger/))

PCjs has archived a selection of [RX01 Disk Images](/disks/dec/rx01/) for use by those machines, which are listed in
the following RX11 Device XML file:

- [Default](/devices/pdp11/rx11/default.xml)

which is typically referenced by a Machine XML file as:

```xml
<device ref="/devices/pdp11/rx11/default.xml"/>
```
		
Device XML files not only configure a device, but also list all the resource the device will use, and define UI elements
used to control the device, such as choosing which disks should be "auto-mounted" by the RX11 device.  For example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<device id="rx11" type="rx11" pos="left" width="35%" padLeft="8px" padBottom="8px">
	<name>Disk Drive Controls</name>
	<control type="container">
		<control type="list" binding="listDrives"/>
		<control type="list" binding="listDisks">
			<disk id="disk01" name="RT-11 V3 SYS (1 OF 9)" path="http://archive.pcjs.org/disks/dec/rx01/RX01-RT11-V03-1.json"/>
			<disk id="disk01" name="RT-11 V3 SYS (2 OF 9)" path="http://archive.pcjs.org/disks/dec/rx01/RX01-RT11-V03-2.json"/>
			<disk id="disk01" name="RT-11 V3 SYS (3 OF 9)" path="http://archive.pcjs.org/disks/dec/rx01/RX01-RT11-V03-3.json"/>
			<disk id="disk01" name="RT-11 V3 SYS (4 OF 9)" path="http://archive.pcjs.org/disks/dec/rx01/RX01-RT11-V03-4.json"/>
			<disk id="disk01" name="RT-11 V3 SYS (5 OF 9)" path="http://archive.pcjs.org/disks/dec/rx01/RX01-RT11-V03-5.json"/>
			<disk id="disk01" name="RT-11 V3 SYS (6 OF 9)" path="http://archive.pcjs.org/disks/dec/rx01/RX01-RT11-V03-6.json"/>
			<disk id="disk01" name="RT-11 V3 SYS (7 OF 9)" path="http://archive.pcjs.org/disks/dec/rx01/RX01-RT11-V03-7.json"/>
			<disk id="disk01" name="RT-11 V3 SYS (8 OF 9)" path="http://archive.pcjs.org/disks/dec/rx01/RX01-RT11-V03-8.json"/>
			<disk id="disk01" name="RT-11 V3 SYS (9 OF 9)" path="http://archive.pcjs.org/disks/dec/rx01/RX01-RT11-V03-9.json"/>
		</control>
		<control type="button" binding="loadDisk">Load</control>
		<control type="button" binding="bootDisk">Boot</control>
		<control type="description" binding="descDisk" padRight="8px"/>
		<control type="file" binding="mountDisk"/>
	</control>
</device>
```
