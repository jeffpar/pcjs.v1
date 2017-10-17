---
layout: page
title: "Q26895: Using Joystick, STRIG(1) Incorrectly Returns 1, Not -1"
permalink: /pubs/pc/reference/microsoft/kb/Q26895/
---

## Q26895: Using Joystick, STRIG(1) Incorrectly Returns 1, Not -1

	Article: Q26895
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 18-OCT-1989
	
	The joystick buttons are not recognized in the program shown below.
	The program incorrectly returns a 1 instead of a -1 when the button is
	pressed in programs compiled with QuickBASIC Versions 4.00 and 4.00b
	and with Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS
	(buglist6.00, buglist6.00b).
	
	This problem was corrected in Microsoft QuickBASIC Version 4.50.
	
	The problem does not occur in QuickBASIC Version 3.00, which correctly
	returns -1.
	
	Under GW-BASIC Version 3.20, the program also works correctly and
	returns -1.
	
	The following is a code example of this problem:
	
	   lp:
	   button= 0
	   button = strig(1)
	   print button
	   goto lp
