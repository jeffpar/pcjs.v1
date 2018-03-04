---
layout: page
title: IBM EGA Demos and Utilities
permalink: /disks/pcx86/diags/ibm/ega/
machines:
  - id: ibm5160
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/5160/ega/256kb/debugger/machine.xml
    autoMount:
      A:
        name: PC-DOS 2.00 (Disk 1)
      B:
        name: IBM EGA FantasyLand Demo
    autoType: $date\r$time\rB:\rFLAND\r
---

IBM EGA "FantasyLand" Demo
--------------------------

In the October 1986 issue of [PC Tech Journal](http://www.pcjs.org/pubs/pc/magazines/pctj/), John T. Cockerham wrote
the article "[Evaluating the EGA: The EGA Standard](http://www.pcjs.org/modules/shared/templates/pdf.html?url=/pubs/pc/magazines/pctj/PCTJ-1986-10/pages/PCTJ-1986-10%2053.pdf&page=53&total=228)",
which described IBM's "FantasyLand" demo:

> IBM wrote FantasyLand in 1984 in order to demonstrate some of the more obscure features of the EGA.
The program was distributed very selectively to dealers and sales representatives; it has never been a product
intended for sale.

> FantasyLand builds a large, 150-by-400-character virtual text screen in the EGA video RAM. The screen uses custom
fonts to create a map of an imaginary continent, complete with rivers, lakes, mountains, and fantastic creatures
like dragons and sea serpents. The illusion of bit-mapped graphics is great, but all the drawings actually are done
with custom characters from a 25-by-80 window into the larger virtual text screen. The program allows vertical and
horizontal smooth scrolling throughout the map by using the cursor keys, allowing the user to tour FantasyLand. Help
screens are implemented with the EGA's split-screen abilities and scroll smoothly up from the bottom of the screen when
requested.

> To make the test even more rigorous, FantasyLand uses the EGA's switchable fonts to create animation effects.
The program loads several copies of a custom font into memory, and an interrupt service routine cycles through the
copies every four system clock ticks. Certain characters in the custom font have slight differences across the copies
so that, when cycled, they give the illusion of motion--a dragon flaps his wings, smoke billows from a chimney, grass
waves in the wind. By tying the animation directly to the system's 8253 timer interrupt, font switching happens
continuously, independent of CPU speed and divorced from other program operations. Rapid ongoing font changes, along
with fast smooth scrolling in both directions, test subtle timing dependencies between subunits of the EGA.

Thanks to Eric, a friend of PCjs, we finally have a copy of the FantasyLand program, along with an assortment of other
EGA utilities that he kindly provided.  Sadly, FantasyLand doesn't yet work in the PCx86 emulator, but it's on our
"to-do" list.  Stay tuned!

{% include machine.html id="ibm5160" %}

### Directory of IBM EGA FantasyLand Demo

	 Volume in drive A has no label

	Directory of A:\

	IBMBIO   COM      4608 03-08-83  12:00p
	IBMDOS   COM     17152 03-08-83  12:00p
	COMMAND  COM     17664 03-08-83  12:00p
	ASSIGN   COM       896 03-08-83  12:00p
	FLAND    BAT        38 07-23-84  12:11p
	FLAND    EXE     67410 07-23-84   1:37p
	FL1      CS       2048 01-01-80   2:03a
	FL2      CS       2048 01-01-80   2:03a
	FL3      CS       2048 01-01-80   2:03a
	FL4      CS       2048 01-01-80   2:03a
	CHAR     MAP     65536 01-01-80   2:06a
	ATTR     MAP     65536 07-23-84   1:42p
	SPEC     MAP     65536 07-23-84   1:42p
	TABLE    MSG     11036 01-01-80   2:11a
	FLAND    DMO      9144 01-01-80  12:14a
	READ     ME        834 07-23-84  12:32p
	       16 file(s)     333582 bytes

	Total files listed:
	       16 file(s)     333582 bytes
	                       25600 bytes free

### Directory of IBM EGA Utilities

	 Volume in drive A is OLD-EGA-UTI

	Directory of A:\

	ALAMODE  COM      1562 02-28-18   2:40p
	DAZZLE   COM      4546 02-28-18   2:40p
	EATER    COM       181 02-28-18   2:40p
	EGAD     EXE     90272 02-28-18   2:40p
	FACE     COM      3596 02-28-18   2:40p
	PERSIAN  EXE     25450 02-28-18   2:40p
	ROGUE    EXE     94720 02-28-18   2:40p
	VGAMAN   EXE     29794 02-28-18   2:40p
	VGAMAN   FOR      1046 02-28-18   2:40p
	        9 file(s)     251167 bytes

	Total files listed:
	        9 file(s)     251167 bytes
	                       65536 bytes free
