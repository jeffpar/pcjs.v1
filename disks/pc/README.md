---
layout: page
title: IBM PC Disk Library
menu_title: Disks
menu_order: 4
permalink: /disks/pc/
---

IBM PC Disk Library
---

This [Disk Library](/disks/pc/library.xml) lists all the [Disk Manifests](#disk-manifests) in the
[PCjs Project](/docs/about/pcjs/), and makes those disks available to any [IBM PC Machine](/devices/pc/machine/)
in the project that uses the library.  However, most machines use the *[compiled](/disks/pc/compiled/library.xml)*
form of the library in order to reduce machine load time.

The [Disk Library](/disks/pc/library.xml) summary below is not a complete list of everything in the library,
just highlights.  For some of the disks, we have provided more information about the software, and in some cases,
machines that automatically run the software.  Ideally, everything in the library would also be listed below,
and linked to a page that describes the software in more detail, along with a live demonstration of the software,
but that's not yet a reality.

For application demos, see the [IBM PC Application Archive](/apps/pc/), which focuses excusively on applications.
The [Disk Library](/disks/pc/library.xml) is a superset, including operating systems, application software,
diagnostics, and more.

### Operating Systems

* [DOS](dos/)
* [OS/2](os2/)
* [Windows](windows/)
* [CP/M-86](cpm/)
* Minix 1.1
* PC/IX 1.0
* [Microport's AT&T UNIX System V-AT 2.3](unix/microport/system-v/2.3/)
* [SCO Xenix 8086 Operating System v2.1.3](xenix/sco/8086/2.1.3/)

### [Applications](apps/)

* [Infocom Games](games/infocom/)
* [Lotus 1-2-3](apps/lotus/123/)
* [MicroPro WordStar](apps/micropro/wordstar/)
* [Microsoft Chart](apps/microsoft/chart/)
* [Microsoft Games](games/microsoft/)
* [Microsoft Word](apps/microsoft/word/)
* [Microsoft Word for Windows](apps/microsoft/winword/)

### [Tools](tools/)

* [Borland Tools](tools/borland/)
* [IBM PC Diagnostics](diags/ibm/)
* [Microsoft Tools](tools/microsoft/)

### [Tests](tests/)

* [VGA "Black Book" Tests](/tests/pc/vga/)

---

Disk Manifests
---

Typically, all the distribution disks for a single version of a piece of software are placed in a single
folder, along with a **manifest.xml** file containing metadata about the software and a list of the individual
disks.  This is generally referred to as a [Software Manifest](/apps/), but in the context of the Disk Library,
it's simply known as a Disk Manifest.

A Disk Manifest can then be added to a *[Floppy Disk Controller (FDC)](/docs/pcjs/fdc/)* configuration file,
making all its disks available to any machine loading that particular configuration file.

A simple FDC configuration file, such as [samples.xml](samples.xml), *could* contain individual &lt;disk&gt;
entries like:

	<disk path="/disks/pc/dos/ibm/1.00/PCDOS100.json">PC-DOS 1.00</disk>
	<disk path="/disks/pc/dos/ibm/1.10/PCDOS110.json">PC-DOS 1.10</disk>
	<disk path="/disks/pc/dos/ibm/2.00/PCDOS200-DISK1.json">PC-DOS 2.00 (Disk 1)</disk>
	<disk path="/disks/pc/dos/ibm/2.00/PCDOS200-DISK2.json">PC-DOS 2.00 (Disk 2)</disk>
	...

However, listing individual diskettes like that is tedious, so support was added for Disk Manifest references:

Instead of listing the PC-DOS 2.00 diskettes individually, they can now be added to an XML configuration file
with a single Disk Manifest reference:

	<manifest ref="/disks/pc/dos/ibm/2.00/manifest.xml" disk="*"/>

When you want to include only one particular disk from a manifest, set the *disk* value to the *id* of the disk.
Here's how you would include only the *first* disk from PC-DOS 2.00:

	<manifest ref="/disks/pc/dos/ibm/2.00/manifest.xml" disk="disk01"/>

Here's what the entire Disk Manifest for PC-DOS 2.00 currently looks like:

	<manifest type="software">
	    <title>PC-DOS</title>
	    <version>2.00</version>
	    <type>DOS</type>
	    <category>Operating System</category>
	    <author>IBM/Microsoft</author>
	    <releaseDate/>
	    <disk id="disk01" size="184320" chs="40:1:9" img="archive/PCDOS200-DISK1.img" href="/disks/pc/dos/ibm/2.00/PCDOS200-DISK1.json" md5="d57ceef82122790d1c0ff7bebc12f90a" md5json="2507c02da6cbafe9a94a35cbdd993be2">
	        <name>PC-DOS 2.00 (Disk 1)</name>
	    </disk>
	    <disk id="disk02" size="184320" chs="40:1:9" img="archive/PCDOS200-DISK2.img" href="/disks/pc/dos/ibm/2.00/PCDOS200-DISK2.json" md5="1c7aac53c78446992f8821cf42d04c4a" md5json="b66e296319c1f97990b596b1aa376d39">
	        <name>PC-DOS 2.00 (Disk 2)</name>
	    </disk>
	</manifest>
