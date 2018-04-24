---
layout: page
title: 20Mb Hard Drive (Fixed Disk) Images
permalink: /disks/pcx86/drives/20mb/
---

20Mb Hard Drive (Fixed Disk) Images
-----------------------------------

This folder contains the following 20Mb (PC AT Type 2) fixed disk configurations:

* [Unformatted 20Mb Disk](unformatted-at2.xml)
* [PC-DOS 3.30 Formatted 20Mb Disk (Empty)](pcdos330-empty-at2.xml)
* [IBM OS/2 1.0 for EGA](ibmos210-ega-at2.xml)
* [IBM OS/2 1.1 for VGA](ibmos211-vga-at2.xml)
* [PC-DOS 3.20 with Windows 3.00 for EGA](pcdos320-win300-ega-at2.xml)
* [PC-DOS 3.30 with Windows 3.10 for VGA](pcdos330-win310-vga-at2.xml)
* [COMPAQ MS-DOS 3.10 with Windows/386 2.01 for VGA](compaq310-win386201-vga-at2.xml)

Type 2 PC AT drives use the following drive parameters:

    615 cylinders
    4 heads
    17 sectors/track

yielding a capacity of 21,411,840 bytes (615 * 4 * 17 * 512), or approximately 20.42Mb 
(since PCjs considers 1 megabyte to be 1,048,576 bytes).

PC AT Type 2 drives are compatible with COMPAQ DeskPro 386 Type 2 drives.
See the [COMPAQ DeskPro 386 Fixed Disk Drive Parameter Table Values](/pubs/pc/reference/compaq/deskpro386/#fixed-disk-drive-parameter-table-values) for more information.

Note that in order to use an unformatted fixed disk with DOS, it must first be partitioned using `FDISK` and then
formatted using `FORMAT`.
