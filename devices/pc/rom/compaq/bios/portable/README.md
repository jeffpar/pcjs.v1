---
layout: page
title: Compaq Portable Computer ROMs
permalink: /devices/pc/rom/compaq/bios/portable/
---

Compaq Portable Computer ROMs
---

The oldest COMPAQ Portable Computer ROM I have is an 8Kb [Rev C ROM](100666-001-REVC.json) from a REV D system board.

[<img src="http://archive.pcjs.org/pubs/pc/reference/compaq/images/COMPAQ_Portable_System_Board.jpg" alt="Compaq Portable System Board REV D"/>](http://archive.pcjs.org/pubs/pc/reference/compaq/images/COMPAQ_Portable_System_Board-FULL.jpg)

Printed on the back of the system board:

	(C) COMPAQ COMPUTER CORP. 1982
	BOARD NO. 000006-001   REV D 84490

Curiously, the system board contains two mask ROMs (AM9265DPC), both labeled `1000666-001 REV.C` but with two different
identifiers: `34569 8350KME` on the ROM in socket U40, and `34569 8350LME` on the ROM the socket below U40.  However,
when I dumped the ROMs with my homemade ROM reader, their contents were identical.

I've seen pictures of other COMPAQ Portable system boards with only one mask ROM installed, so I'm puzzled as to why
my board contains two.  Do the contents of the second ROM show up in a different part of the address space?  Unless
I'm someday able to power and test this board, I may never know.

Some clues can be found in this
[COMPAQ Portable/Plus Maintenance Guide (Excerpt)](http://archive.pcjs.org/pubs/pc/reference/compaq/portable/Compaq_Portable_Plus_Support_Discontinued.pdf).
Older (REV B) system boards apparently *did* require 2 ROMs, at locations U40 and U47.  REV C and later system boards
required only 1 (REV C or later) ROM at location U40.

That's all well and good, but it still doesn't explain why my REV D system board contains 2 ROMs.  It just raises
more questions.  For example, why did *older* system boards require 2 ROMs?  Were the earlier BIOS revisions larger
or the ROMs smaller (eg, 4Kb instead of 8Kb)?

Also, I've come across some other computer history sites that claim the COMPAQ Portable contained "12Kb" of ROM.
Hmmm.

### System ROM Revisions

Thanks to the aforementioned Maintenance Guide excerpt, we know that these other COMPAQ Portable ROM revisions existed;
however, REV C is the only revision currently available here.

	Rev  ROM #       Size  Date
	---  ----------  ----  ----
	B    100518-001
	C    100666-001   8Kb  None
	E    100298-004
	F    100298-005
	G    105681-001
    H    106265-001
	J    106265-002
