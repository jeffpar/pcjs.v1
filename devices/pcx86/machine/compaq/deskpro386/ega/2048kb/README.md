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
display the disk as having "49.0 Megabytes", so drive manufacturers were already treating "megabyte" as 1,000,000
bytes.

After installation, `CHKDSK` reports:

     48916480 bytes total disk space
        55296 bytes in 2 hidden files
         4096 bytes in 1 directories
      1359872 bytes in 80 user files
     47497216 bytes available on disk
    
       655360 bytes total memory
       593440 bytes free

displaying yet another total disk space value: 48,916,480 bytes.

We can use `DEBUG` to inspect the hard disk's BPB:

    C:\>debug
    -l100 2 0 1
    -d100
    1309:0100  EB 28 90 49 42 4D 20 20-33 2E 33 00 02 04 01 00   .(.IBM  3.3.....
    1309:0110  02 00 02 00 00 F8 5E 00-11 00 06 00 11 00 00 00   ......^.........
    1309:0120  11 76 01 00 00 00 00 00-00 00 FA 33 ED B8 C0 07   .v.........3....
    1309:0130  8E D8 C4 1E 1C 00 88 16-FD 01 0A D2 79 08 89 1E   ............y...
    1309:0140  24 00 8C 06 26 00 8E C5-8E D5 BC 00 7C FC 1E 36   $...&.......|..6
    1309:0150  C5 36 78 00 BF 2A 7C B9-0B 00 F3 A4 1F C6 06 2E   .6x..*|.........
    1309:0160  00 0F BF 78 00 B8 2A 7C-AB 91 AB FB 8A 16 FD 01   ...x..*|........
    1309:0170  CD 13 A0 10 00 98 F7 26-16 00 03 06 0E 00 E8 73   .......&.......s



{% include machine.html id="deskpro386" %}
