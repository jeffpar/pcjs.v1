---
layout: page
title: DEC PDP-11 Tape Images
permalink: /apps/pdp11/tapes/
---

DEC PDP-11 Tape Images
----------------------

To load any of the DEC PDP-11 tapes listed below, you will need to use a [PDPjs Machine](/devices/pdp11/machine/)
with a [PC11 High-Speed Paper Tape Reader/Punch](/devices/pdp11/pc11/), such as this
[PDP-11/20](/devices/pdp11/machine/1120/basic/debugger), and then follow this three-step process:

- Load the [DEC PDP-11 Bootstrap Loader](/apps/pdp11/boot/bootstrap/)
- Attach the [Absolute Loader](absloader/) tape image, and load it with the Bootstrap Loader
- Attach one of the "Absolute Format" tape images below, and load it with the Absolute Loader 

This was the real-world process.  Fortunately, PDPjs machines include features that simplify the process.

For starters, any "Absolute Format" tape (which should include all the tapes listed below) can be loaded directly
into RAM using the machine's "Load" button instead of "Attach".  In most cases, this eliminates the first two steps.

DEC Paper Tape Software (circa 1970)
------------------------------------

As documented in the [PDP-11/20 Handbook (1971)](http://archive.pcjs.org/pubs/dec/pdp11/1120/PDP1120_Handbook_1971.pdf),
p. 155, "PAPER TAPE SOFTWARE", the following software was available on paper tape:

- [PAL-11A ASSEMBLER](pal11a/)
- PAL-11S ASSEMBLER (Program Assembly Language for the PDP-11, Relocatable Version)
- [ED-11](ed11/) (Text Editor program)
- [DUMPTT](dumptt/) (Dump Octal)
- [DUMPAB](dumpab/) (Dump Absolute Binary Code)
- [FPP-11](fpp11/) (Floating-Point and Math Package for the PDP-11)
- [ODT-11](odt11/) (On-line Debugging Technique for the PDP-11)
- [IOX](iox/) (PDP-11 Input/Output eXecutive)
- [PDP-11 BASIC](basic/) (Beginners All-purpose Symbolic Instruction Code)

There was a separate DEC publication, [PDP-11 Paper Tape Software Handbook](http://archive.pcjs.org/pubs/dec/pdp11/pc11/Paper_Tape_Software_Handbook.pdf),
that described all of the above software in greater detail, and it included some programs that the 1971 Handbook listed under
"Disk Operating System" instead of "Paper Tape System", such as:

- LINK-11S LINKER

Thanks to the [iamvirtual.ca](http://iamvirtual.ca/PDP-11/PTS-11/PTS-11.htm) website, most of the above programs are
available as paper tape image files, with the exception of PAL-11S and LINK-11S:

- [ED-11-V004A SA=12430 RA=3746](ed11/DEC-11-E1PA-PB.json)
- [PAL-11A (4K)-V002A SA=1410 RA=1410](pal11a/DEC-11-ASPA-PB.json)
- [PAL-11A (8K)-V002A SA=1410 RA=1410](pal11a/DEC-11-ASXA-PB.json)
- [ODT-11](odt11/DEC-11-O1PA-PA.json)
- [ODT-11 SA=13060](odt11/DEC-11-O1PA-PB.json)
- [ODT-11X](odt11x/DEC-11-O2PA-PA.json)
- [ODT-11X-V004A SA=12220 RA=12220](odt11x/DEC-11-O2PA-PB.json)
- [IOX TAPE 1 OF 2](iox/DEC-11-YIPA-PA1.json)
- [IOX TAPE 2 OF 2](iox/DEC-11-YIPA-PA2.json)
- [IOX-V004A LOAD ADDRESS=15100](iox/DEC-11-YIPA-PB.json)
- [FPP-11 V005A TAPE 1 OF 11](fpp11/DEC-11-YQPB-PA1.json)
- [FPP-11 V005A TAPE 2 OF 11](fpp11/DEC-11-YQPB-PA2.json)
- [FPP-11 V005A TAPE 3 OF 11](fpp11/DEC-11-YQPB-PA3.json)
- [FPP-11 V005A TAPE 4 OF 11](fpp11/DEC-11-YQPB-PA4.json)
- [FPP-11 V005A TAPE 5 OF 11](fpp11/DEC-11-YQPB-PA5.json)
- [FPP-11 V005A TAPE 6 OF 11](fpp11/DEC-11-YQPB-PA6.json)
- [FPP-11 V005A TAPE 7 OF 11](fpp11/DEC-11-YQPB-PA7.json)
- [FPP-11 V005A TAPE 8 OF 11](fpp11/DEC-11-YQPB-PA8.json)
- [FPP-11 V005A TAPE 9 OF 11](fpp11/DEC-11-YQPB-PA9.json)
- [FPP-11 V005A TAPE 10 OF 11](fpp11/DEC-11-YQPB-PA10.json)
- [FPP-11 V005A TAPE 11 OF 11](fpp11/DEC-11-YQPB-PA11.json)
- [DUMPTT-V001A SA=XX7440 RA=XX7440](dumptt/DEC-11-Y1PA-PO.json)
- [DUMPTT-V001A SA=LOAD ADDRESS RA=LOAD ADDRESS](dumptt/DEC-11-Y1PA-PB.json)
- [DUMPAB-V001A SA=LOAD ADDRESS RA=LOAD ADDRESS](dumpab/DEC-11-Y2PA-PB.json)
- [DEC-11-AJPB-PB BASIC-11 v007A SA=16104 RA=0](basic/DEC-11-AJPB-PB.json)

Some additional information on DEC's Paper Tape Software is available at [retrotechnology.com](http://retrotechnology.com/pdp11/11_20_PTS.html).

Newer Paper Tape Software (mid-1970s)
-------------------------------------

Thanks to the efforts of person(s) unknown, additional paper tape images have been uploaded to
[bitsavers.org](http://bitsavers.trailing-edge.com/bits/DEC/pdp11/papertapeimages/).  It's not super organized, so for now,
I'm just going to pick out selected tapes, archive them [here](misc/), and add them to the [Default PC11 Configuration](/devices/pdp11/pc11/).

Try this [PDP-11/70](/devices/pdp11/machine/1170/panel/debugger/) to test the newer tapes. 

- [MAINDEC-11-DEQKC-B1-PB 06/12/78; 11/70 cpu instruction; exerciser; (c)1975,76](misc/MAINDEC-11-DEQKC-B1-PB.json)
