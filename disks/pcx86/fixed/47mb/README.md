---
layout: page
title: 47Mb Hard Drive (Fixed Disk) Images
permalink: /disks/pcx86/fixed/47mb/
---

47Mb Hard Drive (Fixed Disk) Images
-----------------------------------

This folder contains the following 47Mb (PC AT Type 5) fixed disk configurations:
 
* [Unformatted Disk](unformatted-at5.xml)

Note that in order to use an unformatted fixed disk with DOS, it must first be partitioned using `FDISK`
and then formatted using `FORMAT`.  Moreover, you should use DOS 3.30 or newer if you want to make full use
of the disk; DOS 3.30 was still limited to 32Mb partitions, but it was the first version that allowed you
to create both "Primary" and "Extended" DOS partitions.

It should be safe to use Type 5 drives in both IBM PC AT and COMPAQ DeskPro machines, because the drive
parameters are identical in both types of machines:

- 940 cylinders
- 6 heads
- 17 sectors/track

which yields a capacity of 49,090,560 bytes (940 * 6 * 17 * 512), or approximately 47Mb, since 1 megabyte (as
it was understood in 1988) is equal to 1,048,576 bytes.

---

Machines using the [Unformatted Disk](unformatted-at5.xml) include:

* [IBM PC AT (Model 5170) with Enhanced Color Display](/devices/pcx86/machine/5170/ega/640kb/)
