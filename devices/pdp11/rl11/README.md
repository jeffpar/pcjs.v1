---
layout: page
title: RL11 Disk Controller
permalink: /devices/pdp11/rl11/
---

RL11 Disk Controller
--------------------

The RL11 Disk Controller controls up to four RL01 or RL02 disk drives, which in turn read/write
[RL01K](/disks/dec/rl01k/) or [RL02K](/disks/dec/rl02k/) disk cartridges, respectively.

RL01K disks are single-platter cartridges with 256 tracks per side, 40 sectors per track, and a sector size of
256 bytes, for a total capacity of 5Mb (5,242,880 bytes).

RL02K disks are single-platter cartridges with 512 tracks per side, 40 sectors per track, and a sector size of
256 bytes, for a total capacity of 10Mb (10,485,760 bytes).

Machines containing the [RL11 Component](/modules/pdp11/lib/pc11.js) include:

- [PDP-11/70 with Front Panel](/devices/pdp11/machine/1170/panel/) (with [Debugger](/devices/pdp11/machine/1170/panel/debugger/))
- [PDP-11/70 with VT100 Terminal](/devices/pdp11/machine/1170/vt100/) (with [Debugger](/devices/pdp11/machine/1170/vt100/debugger/))

PCjs has archived a selection of [RL01K](/disks/dec/rl01k/) and [RL02K](/disks/dec/rl02k/) disk images
from [Paul Nankervis](http://skn.noip.me/pdp11/) for use by those machines, which are also listed in the
following RL11 Device XML file:

- [Default](/devices/pdp11/rl11/default.xml)

which is typically referenced by a Machine XML file as:

```xml
<device ref="/devices/pdp11/rl11/default.xml"/>
```
	
Device XML files not only configure a device, but also list all the resource the device will use, and define UI elements
used to control the device, such as choosing which disks should be "auto-mounted" by the RL11 device.  For example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<device id="rl11" type="rl11" autoMount='{RL0:{path:"http://archive.pcjs.org/disks/dec/rl02k/RL02K-XXDP.json"}}' pos="left" width="35%" padLeft="8px" padBottom="8px">
    <name>Disk Drive Controls</name>
    <control type="container">
        <control type="list" binding="listDrives"/>
        <control type="list" binding="listDisks">
            <disk id="disk01" name="XXDP+ Diagnostics" path="http://archive.pcjs.org/disks/dec/rl02k/RL02K-XXDP.json"/>
        </control>
        <control type="button" binding="loadDisk">Load</control>
        <control type="button" binding="bootDisk">Boot</control>
        <control type="description" binding="descDisk" padRight="8px"/>
        <control type="file" binding="mountDisk"/>
    </control>
</device>
```
