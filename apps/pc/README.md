---
layout: page
title: Application Archive
menu_title: Apps
menu_order: 4
permalink: /apps/pc/
---

IBM PC Application Archive
---

Below are selected demos of classic IBM PC applications running on [PCjs](/docs/about/pcjs/).

* [VisiCalc (1981)](1981/visicalc/)
* [Executive Suite (1982)](1982/esuite/)
* [Rogue (1985)](1985/rogue/)
* [ThinkTank (1987)](1987/thinktank/)
* The Dungeons of Moria (1988, [1992](1992/moria/))

Additional software is available in the [IBM PC Disk Archive](/disks/pc/).

Learn more about
[Application Demos](https://github.com/jeffpar/pcjs/tree/master/apps/pc) in the
[PCjs Project](https://github.com/jeffpar/pcjs) on [GitHub](https://github.com/).

{% if page.developer %}

### Developer Notes: How To Produce A Demo

We'll use the [VisiCalc Demo](1981/visicalc/) as an example.  First you must choose a machine configuration.
For VisiCalc, we chose a Model 5150 machine with a Monochrome Display, and then inserted a link to that machine
in the demo's [Manifest](1981/visicalc/manifest.xml):

	<machine href="/devices/pc/machine/5150/mda/64kb/machine.xml"/>

Next, the [Manifest](1981/visicalc/manifest.xml) required a disk image containing the VisiCalc program
(VC.COM).  We used the [DiskDump](/modules/diskdump/) module to create that disk image:

	cd apps/pc/1981/visicalc
	node ../../../../modules/diskdump/bin/diskdump --path="static/VC.COM;../README.md" --format=json --output=disk.json --manifest
	
The DiskDump command created a disk image named "disk.json" containing two files ("VC.COM" from the "static" subdirectory,
and "README.md" from the "static" parent directory) and automatically added that disk image to the demo's [Manifest](1981/visicalc/manifest.xml):

	<disk id="disk01" size="163840" chs="40:1:8" dir="static/" href="/apps/pc/1981/visicalc/disk.json" md5="61494f998d5fb0e31e7b8bd99f1cc588" md5json="3ad82ed815725e6bd786f92a4714e84f">
		<file size="27520" time="1981-12-16 23:00:00" attr="0x20" md5="28997dfedb2440c6054d8be835be8634">VC.COM</file>
		<file dir="../">README.md</file>
	</disk>
	
Now that the manifest contains a disk image, we were able to add the manifest to our set of [Sample Disks](/disks/pc/samples.xml):

	<manifest ref="/apps/pc/1981/visicalc/manifest.xml" disk="*"/>

Next, we started a version of our chosen machine that's also configured to use the Debugger, by loading
the following machine.xml into a web browser (it's assumed the Node web server is already running on port 8088):

	http://localhost:8088/devices/pc/machine/5150/mda/64kb/debugger/machine.xml

Then we booted DOS, loaded the VisiCalc disk, ran VisiCalc, pressed the Debugger's "Halt" button, pressed "Clear" to
clear the Debugger's output window, and typed the following Debugger command:
 
	d state

We copied-and-pasted the entire contents of the Debugger's output window into a file named "state.json", and then updated
the &lt;machine&gt; entry in the [Manifest](1981/visicalc/manifest.xml):

	<machine href="/devices/pc/machine/5150/mda/64kb/machine.xml" state="/apps/pc/1981/visicalc/state.json"/>

It's important to use a state file *only* with the machine configuration it was created with; in this case, we're OK,
because the only difference between the two chosen Model 5150 machines is the addition of the Debugger.

{% endif %}

