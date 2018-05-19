---
layout: page
title: IBM PC Hard Drive (Fixed Disk) Images
permalink: /disks/pcx86/drives/
---

IBM PC Hard Drive (Fixed Disk) Images
-------------------------------------

Pre-built fixed disk images with the following sizes are available:

* [10Mb](10mb/)
* [20Mb](20mb/)
* [47Mb](47mb/)
* [68Mb](68mb/)

IBM PC XT Drive Types
---------------------

The IBM PC XT BIOS supported 4 predefined drive types:

- Type 0: 306 cylinders, 2 heads, 17 sectors/track ( 5,326,848 bytes)
- Type 1: 375 cylinders, 8 heads, 17 sectors/track (26,112,000 bytes)
- Type 2: 306 cylinders, 6 heads, 17 sectors/track (15,980,544 bytes)
- Type 3: 306 cylinders, 4 heads, 17 sectors/track (10,653,696 bytes or ~[10Mb](10mb/))

Generally, our PC XT machines use [10Mb](10mb/) drives, configured as XT drive type 3.  Such drives can also
be used in our PC AT machines, but they must be configured as AT drive type 1 instead (see below).

IBM PC AT Drive Types
---------------------

The IBM PC AT introduced a new drive controller and defined many new drive types.  You can find a listing of them
in the PCjs [HDC](/modules/pcx86/lib/hdc.js) component (see **aDriveTypes**).

Generally, our PC AT machines use four common sizes, which correspond to the following AT drive types:

- Type 1: 306 cylinders, 4 heads, 17 sectors/track (10,653,696 bytes or ~[10Mb](10mb/))
- Type 2: 615 cylinders, 4 heads, 17 sectors/track (21,411,840 bytes or ~[20Mb](20mb/))
- Type 4: 940 cylinders, 8 heads, 17 sectors/track (65,454,080 bytes or ~62Mb)
- Type 5: 940 cylinders, 6 heads, 17 sectors/track (49,090,560 bytes or ~[47Mb](47mb/))

Note that we don't currently include any *true* Type 4 62Mb drive images.  For drives that large, we generally use a
[COMPAQ DeskPro 386](devices/pcx86/machine/compaq/deskpro386/) machine, and COMPAQ Drive Type 4 specifies 1023 cylinders,
not 940, which yields a drive capacity of [68Mb](68mb/).
