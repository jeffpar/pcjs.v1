---
layout: page
title: 68Mb Hard Drive (Fixed Disk) Images
permalink: /disks/pcx86/fixed/68mb/
---

68Mb Hard Drive (Fixed Disk) Images
-----------------------------------

This folder contains the following 68Mb (COMPAQ Type 4) fixed disk images:

* Windows 95 Compact Installation (WIN95.json)

The [Microsoft Windows 95: First Retail Release](/disks/pcx86/windows/win95/4.00.950/) demo machine uses the
following settings: 

    drives: '[{name:"68Mb Hard Disk",type:4,path:"/disks/pcx86/fixed/68mb/WIN95.json"}]'

Since that machine is a [COMPAQ DeskPro 386](/devices/pcx86/machine/compaq/deskpro386/vga/4096kb/machine.xml)
which uses a [COMPAQ DeskPro 386 ROM](/devices/pcx86/rom/compaq/deskpro386/) (specifically, ROM Revision J.4, dated
January 8, 1988), the characteristics of drive type 4 come from that ROM's Fixed Disk Parameter Table:

- 1023 cylinders
- 8 heads
- 17 sectors/track

yielding a capacity of 71,233,536 bytes (1023 * 8 * 17 * 512), or approximately 68Mb
(since PCjs considers 1 megabyte to be 1,048,576 bytes).

NOTE: There is a discrepancy between the ROM and the COMPAQ Technical Reference; the latter claims that a Type 4 drive
supports 1024 cylinders rather than 1023.  However, it's possible that the larger total included a cylinder at the end
of the disk reserved for diagnostic operations and "head parking".  Further investigation is required.

Also note that when using this disk with an IBM PC AT, only 62Mb can be accessed, because the IBM PC AT ROM defines
a Type 4 drive as having 940 cylinders rather than 1023. 
