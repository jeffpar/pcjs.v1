---
layout: page
title: "IBM PC (Model 5160) with 256K EGA running IBM EGA FantasyLand Demo"
permalink: /disks/pcx86/diags/ibm/fland/
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
