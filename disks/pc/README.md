---
layout: page
title: IBM PC Disk Archive
permalink: /disks/pc/
---

IBM PC Disk Archive
---

This is a list of disks available to any of the [IBM PC Machines](/devices/pc/machine/) that use the
[library.xml](/disks/pc/library.xml) disk configuration file.

For some of the disks below, we have provided more information about the software, and in some cases, machines
that automatically run the software.

### PC-DOS (IBM)

* [PC-DOS 1.00](/disks/pc/dos/ibm/1.00/)
* [PC-DOS 1.10](/disks/pc/dos/ibm/1.10/)
* [PC-DOS 2.00](/disks/pc/dos/ibm/2.00/)
* [PC-DOS 2.10](/disks/pc/dos/ibm/2.10/)
* [PC-DOS 3.00](/disks/pc/dos/ibm/3.00/)
* [PC-DOS 3.10](/disks/pc/dos/ibm/3.10/)
* [PC-DOS 3.20](/disks/pc/dos/ibm/3.20/)
* [PC-DOS 3.30](/disks/pc/dos/ibm/3.30/)
* PC-DOS 4.00
* PC-DOS 5.00
* PC-DOS 6.10
* PC-DOS 7.00

### MS-DOS (Microsoft)

* MS-DOS 1.25
* MS-DOS 2.00
* [MS-DOS 3.20](/disks/pc/dos/microsoft/3.20/)
* MS-DOS 3.21
* MS-DOS 3.30
* MS-DOS 3.31
* [MS-DOS 4.00](/disks/pc/dos/microsoft/4.00/)
* [MS-DOS 4.01](/disks/pc/dos/microsoft/4.01/)
* [MS-DOS 4.0M](/disks/pc/dos/microsoft/4.0M/)
* MS-DOS 5.00
* MS-DOS 6.00
* MS-DOS 6.20
* MS-DOS 6.22

### Compaq DOS

* Compaq DOS 3.10
* Compaq DOS 3.31

### IBM OS/2

* [IBM OS/2 1.0](/disks/pc/os2/ibm/1.0/)
* IBM OS/2 1.1
* IBM OS/2 1.3

### Microsoft OS/2

* [MS OS/2 1.0](/disks/pc/os2/microsoft/1.0/)
* MS OS/2 1.1
* MS OS/2 1.2

### Other OS/2 Disks

* [OS/2 1.0 Debugger Boot Disk](/disks/pc/os2/misc/1.0/debugger/)
* [OS/2 FOOTBALL Boot Disk (v7.68.17)](/disks/pc/os2/misc/football/debugger/)

### Microsoft Windows

* Microsoft Windows 1.00
* [Microsoft Windows 1.01](/disks/pc/windows/1.01/)
* Microsoft Windows 1.03
* Microsoft Windows 1.03A
* Microsoft Windows 1.04
* Microsoft Windows 2.01
* Microsoft Windows 2.03
* Microsoft Windows 3.00
* Microsoft Windows 3.11
* [Microsoft Windows 95 (Build 499)](/disks/pc/windows/win95/4.00.499/)
* [Microsoft Windows 95 (Build 950)](/disks/pc/windows/win95/4.00.950/)

### Other Operating Systems

* [CP/M-86](/disks/pc/cpm/)
* Minix 1.1
* PC/IX 1.0
* [Microport's AT&T UNIX System V-AT 2.3](/disks/pc/unix/microport/system-v/2.3/)
* [SCO Xenix 8086 Operating System v2.1.3](/disks/pc/xenix/sco/8086/2.1.3/)

### Applications

* Lotus 1-2-3 1.0A
* Microsoft Chart 2.02
* Microsoft Word 3.0
* Microsoft Word 3.1
* Microsoft Word 5.0
* Microsoft Word for Windows 2.0C

### Borland Tools

* Borland Pascal 3.00B
* Borland Pascal 3.01A

### IBM Tools

* [IBM Diagnostics v2.20](/disks/pc/diags/ibm/2.20/)

### Microsoft Tools

* Microsoft BASIC
* [Microsoft C 4.00](/disks/pc/tools/microsoft/c/4.00/)
* Microsoft MASM 4.00
* Microsoft Mouse 5.00
* [Microsoft OS/2 SDK 1.02](/disks/pc/tools/microsoft/os2/sdk/1.02/)
* Microsoft Windows SDK 1.01
* Microsoft Windows SDK 1.03
* Microsoft Windows SDK 1.04
* Microsoft Windows SDK 2.03
* Microsoft Windows SDK 3.00

NOTE: We also have links to all the [Microsoft Languages NewsLetters](/disks/pc/tools/microsoft/) that were published
in [PC Tech Journal](/pubs/pc/magazines/pctj/).

### Microsoft Games

* Microsoft Flight Simulator

### Other Games

* [Infocom Zork I](/disks/pc/games/infocom/zork1/)

Learn more about
[Disk Sets](https://github.com/jeffpar/pcjs/tree/master/disks/pc) in the
[PCjs Project](https://github.com/jeffpar/pcjs) on [GitHub](https://github.com/).

{% if page.developer %}

### Developer Notes: Disk Sets and Manifests

Collections of related disks are organized into *Disk Sets* which can then be loaded from the
[FDC (Floppy Disk Controller)](/docs/pcjs/fdc/) component of an [IBM PC Machine Configuration](/devices/pc/machine/).

Disk Sets are stored in their own folders, along with a **manifest.xml** file listing the individual diskettes.
Manifests also record a variety of metadata about the software; more information about the manifest format
is available in [Application Archives](/apps/).

A simple FDC XML file, such as [samples.xml](samples.xml), *could* contain &lt;disk&gt; entries like:

	<disk path="/disks/pc/dos/ibm/1.00/PCDOS100.json">PC-DOS 1.0</disk>
	<disk path="/disks/pc/dos/ibm/1.10/PCDOS110.json">PC-DOS 1.1</disk>
	<disk path="/disks/pc/dos/ibm/2.00/PCDOS200-DISK1.json">PC-DOS 2.0 (Disk 1)</disk>
	<disk path="/disks/pc/dos/ibm/2.00/PCDOS200-DISK2.json">PC-DOS 2.0 (Disk 2)</disk>
	...

listing all the diskettes available for the machine to load.  However, listing individual diskettes is tedious,
so the FDC also supports **manifest.xml** files.  Instead of listing the PC-DOS 2.0 diskettes individually,
they can be added to [samples.xml](samples.xml) with a single line:

	<manifest ref="/disks/pc/dos/ibm/2.00/manifest.xml" disk="*"/>

The same feature works with [Application Manifests](/apps/#software-application-manifests).  Here's how you might
add [VisiCalc](/apps/pc/1981/visicalc/) to [samples.xml](samples.xml):

	<manifest ref="/apps/pc/1981/visicalc/manifest.xml" disk="disk"/>

The application must have a **manifest.xml** with &lt;disk&gt; section containing an *id* value that matches the
*disk* value specified above:

    <disk id="disk" dir="/apps/pc/1981/visicalc/bin/">
        <file>VC.COM</file>
        <file dir="../">README.md</file>
        <link href="http://www.bricklin.com/history/vclicense.htm">VisiCalc License</link>
    </disk>

If multiple disks are defined in the manifest, and you want to include them all, you can set the *disk* value to '*', as in:

	<manifest ref="/apps/pc/1981/visicalc/manifest.xml" disk="*"/>

As an added bonus, PCjs will automatically display the descriptive &lt;link&gt; whenever this item is selected, and it will
dynamically generate a disk image containing all the specified &lt;file&gt; entries when the selected item is loaded.

Pre-generated disk images are preferred to dynamically-generated images, and you can now include those in the application
**manifest.xml** as well, by adding an *href* value to the &lt;disk&gt; section that was used to create the image: 

    <disk id="disk" dir="/apps/pc/1981/visicalc/bin/" href="/apps/pc/1981/visicalc/disk.json">
        <file>VC.COM</file>
        <file dir="../">README.md</file>
        <link href="http://www.bricklin.com/history/vclicense.htm">VisiCalc License</link>
    </disk>

The PCjs [DiskDump](/modules/diskdump/) module is used to create all our pre-generated JSON-encoded disk images.
In the above example, a pre-generated disk image could be created from the command-line with either the "--dir" option
(which will traverse all subdirectories as well): 

	node diskdump --dir=./apps/pc/1981/visicalc/bin/ --format=json --output=./apps/pc/1981/visicalc/disk.json
	
or with the "--path" option, which specifies either a single file or a set files separated by semi-colons:

	node diskdump --path="./apps/pc/1981/visicalc/bin/vc.com;../readme.md" --format=json --output=./apps/pc/1981/visicalc/disk.json
	
or via the PCjs server's DiskDump API:

	http://www.pcjs.org/api/v1/dump?path=/apps/pc/1981/visicalc/bin/vc.com&format=json

Learn more about PCjs disk image formats [here](/disks/).

{% endif %}
