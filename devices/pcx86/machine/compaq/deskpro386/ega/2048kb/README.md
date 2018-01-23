---
layout: page
title: COMPAQ DeskPro 386 (2Mb) with COMPAQ EGA
permalink: /devices/pcx86/machine/compaq/deskpro386/ega/2048kb/
machines:
  - id: deskpro386
    type: pcx86
---

This machine uses one of the earliest known [COMPAQ DeskPro 386 ROMs](/devices/pcx86/rom/compaq/deskpro386/)
(`Rev F`, dated September 4, 1986) along with a "Type 5" [47Mb Hard Disk](/disks/pcx86/fixed/47mb/), which
is defined as having:

- 940 cylinders
- 6 heads
- 17 sectors/track

yielding a capacity of 49,090,560 bytes (940 * 6 * 17 * 512), or approximately 47Mb (since PCjs considers
1 megabyte to be 1,048,576 bytes).

However, when you install [COMPAQ MS-DOS 3.31](/disks/pcx86/dos/compaq/3.31/) using their `FASTART` utility,
it will report "Format complete" after formatting 939 cylinders (0-938), presumably reserving the final cylinder
for diagnostic purposes and/or "head parking".  It will then report "48,834,560 bytes available on disk" and
display the disk as having "49.0 Megabytes", so drive manufacturers were already treating "megabyte" as 1,000,000 bytes.

{% include machine.html id="deskpro386" %}
