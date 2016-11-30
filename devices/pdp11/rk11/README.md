---
layout: page
title: RK11 Disk Controller
permalink: /devices/pdp11/rk11/
---

RK11 Disk Controller
--------------------

The RK11 Disk Controller controls up to eight RK05 disk drives, which in turn read/write [RK03-KA](/disks/dec/rk03/)
disk cartridges.

Machines containing the [RK11 Component](/modules/pdp11/lib/rk11.js) include:

- [PDP-11/70 Boot Monitor](/devices/pdp11/machine/1170/monitor/) (with [Debugger](/devices/pdp11/machine/1170/monitor/debugger/))
- [PDP-11/70 with Front Panel](/devices/pdp11/machine/1170/panel/) (with [Debugger](/devices/pdp11/machine/1170/panel/debugger/))

PCjs has archived a selection of [RK03 Disk Images](/disks/dec/rk03/) from [Paul Nankervis](http://skn.noip.me/pdp11/)
for use by those machines, which are listed in the following RK11 Device XML file:

- [Default](/devices/pdp11/rk11/default.xml)

which is typically referenced by a Machine XML file as:

```xml
<device ref="/devices/pdp11/rk11/default.xml"/>
```
		
Device XML files not only configure a device, but also list all the resource the device will use, and define UI elements
used to control the device, such as choosing which disks should be "auto-mounted" by the RK11 device.  For example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<device id="rk11" type="rk11" autoMount='{RK0:{path:"http://archive.pcjs.org/disks/dec/rk03/RK03-XXDP.json"}}' pos="left" width="35%" padLeft="8px" padBottom="8px">
	<name>Disk Drive Controls</name>
	<control type="container">
		<control type="list" binding="listDrives"/>
		<control type="list" binding="listDisks">
			<disk id="disk01" name="XXDP+ Diagnostics" path="http://archive.pcjs.org/disks/dec/rk03/RK03-XXDP.json"/>
		</control>
		<control type="button" binding="loadDrive">Load</control>
		<control type="description" binding="descDisk" padRight="8px"/>
		<control type="file" binding="mountDisk"/>
	</control>
</device>
```
