---
layout: page
title: "Q32098: QB Program Can Hang If Coprocessor Switch Is Set Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q32098/
---

## Q32098: QB Program Can Hang If Coprocessor Switch Is Set Incorrectly

	Article: Q32098
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 1-SEP-1989
	
	QuickBASIC Versions 4.00b and 4.50, and programs compiled with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS OS/2 and
	MS-DOS or its copy of QuickBASIC, detect the presence or absence of a
	math coprocessor differently than QuickBASIC Version 4.00 does.
	
	QuickBASIC Version 4.00 loads and runs on a standard IBM PC even when
	the coprocessor switch on the PC motherboard is incorrectly set to
	indicate the presence of a math coprocessor when one is not actually
	present. Programs run in QuickBASIC versions later than 4.00 (in the
	QB.EXE editor or from an executable .EXE program) will hang under
	these same conditions.
	
	If you suspect that the hardware switch for the coprocessor is set
	incorrectly, type the following DOS command to turn off coprocessor
	checking and try the program again:
	
	   SET NO87="Coprocessor has now been disabled."
	
	If the program now runs without hanging, then the hardware switch for
	the coprocessor is probably incorrectly set to indicate that a
	coprocessor is installed when one is not actually present. Another
	possibility is that the installed coprocessor wrongly has a speed
	(Megahertz) rating faster than the CPU (central processing unit) --
	the coprocessor's speed must be equal to or less than the speed of
	the CPU.
	
	Some customers have reportedly run QuickBASIC Version 4.00 without
	problems on older PCs and did not realize that the hardware switches
	were set incorrectly until they tried the QuickBASIC Version 4.00b
	upgrade and their machines hung.
	
	According to one customer, his original IBM documentation listed the
	coprocessor switch as unused, and two of his machines came from IBM
	with the switches set in what is now considered the incorrect
	position.
	
	One customer with an "original" PC 1 from IBM (with a BIOS dated
	10-27-1982, and 16/64K stamped on the motherboard) found that the IBM
	PC documentation was wrong for Switch Block One on the PC System
	Board. Switch number 2 must be ON in Switch Block One for a computer
	that has no coprocessor.
	
	Please refer to Page 457 of the following book for a correct list of
	all switch settings for the IBM PC:
	
	   "The Programmer's PC Sourcebook" by Thom Hogan (published by
	   Microsoft Press, 1988)
	
	This book contains reference tables for IBM PCs and compatibles, PS/2
	machines, and MS-DOS.
