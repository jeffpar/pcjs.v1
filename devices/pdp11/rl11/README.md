---
layout: page
title: RL11 Disk Controller
permalink: /devices/pdp11/rl11/
---

RL11 Disk Controller
--------------------

Machines containing the [RL11 Component](/modules/pdp11/lib/pc11.js) include:

- [PDP-11/70 Boot Test](/devices/pdp11/machine/1170/test/) (with [Debugger](/devices/pdp11/machine/1170/test/debugger/))
- [PDP-11/70 with Front Panel](/devices/pdp11/machine/1170/panel/) (with [Debugger](/devices/pdp11/machine/1170/panel/debugger/))

PCjs has archived a selection of [RL02K Disk Images](/disks/dec/rl02k/) for use by those machines, most of which are
listed in the following RL11 Device XML file:

- [Default](/devices/pdp11/rl11/default.xml)

which is typically referenced by a Machine XML file as:

	<device ref="/devices/pdp11/rl11/default.xml"/>
		
Device XML files not only configure a device, but also list all the resource the device will use, and define UI elements
used to control the device, such as choosing which disks should be "auto-mounted" by the RL11 device.  For example:

	<?xml version="1.0" encoding="UTF-8"?>
	<device id="pc11" type="pc11" baudReceive="9600" autoMount='{path:"/apps/pdp11/tapes/absloader/DEC-11-L2PC-PO.json"}' pos="left" width="35%" padLeft="8px" padBottom="8px">
		<name>Paper Tape Controls</name>
		<control type="container">
			<control type="list" binding="listTapes">
				<tape id="tape00" name="Bootstrap Loader (16Kb)" path="/apps/pdp11/boot/bootstrap/BOOTSTRAP-16KB.json"/>
				<tape id="tape01" name="Absolute Loader" path="/apps/pdp11/tapes/absloader/DEC-11-L2PC-PO.json"/>
				<tape id="tape02" name="BASIC (Single User)" path="/apps/pdp11/tapes/basic/DEC-11-AJPB-PB.json"/>
			</control>
			<control type="button" binding="attachTape">Attach</control>
			<control type="button" binding="loadTape">Load</control>
			<control type="description" binding="descTape" padRight="8px"/>
			<control type="file" binding="mountTape"/>
			<control type="progress" binding="readProgress" pos="default" width="250px" padTop="8px">Tape Progress</control>
		</control>
	</device>
