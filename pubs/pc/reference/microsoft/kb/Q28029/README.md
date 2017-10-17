---
layout: page
title: "Q28029: If ANSI.SYS Sets Background Color, BASIC Clears Line 25"
permalink: /pubs/pc/reference/microsoft/kb/Q28029/
---

## Q28029: If ANSI.SYS Sets Background Color, BASIC Clears Line 25

	Article: Q28029
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 25-AUG-1989
	
	If you have changed the background and foreground screen colors in
	MS-DOS using ANSI control codes, then when a BASIC program using
	screen input or output is run, the 25th line is incorrectly blackened
	(cleared) when the program exits.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the Microsoft BASIC Compiler Version 6.00 for
	MS-DOS (buglist6.00). The problem is corrected in QuickBASIC Version
	4.50 and in the Microsoft BASIC Compiler Version 6.00b for MS-DOS
	(fixlist6.00b).
	
	This problem does not occur in EXE programs compiled with QuickBASIC
	Version 3.00.
	
	The DOS ANSI.SYS driver can be used to change the background and
	foreground colors. For example, place the following in a file:
	
	   An ESC byte (ASCII 27) followed by [44;37m
	
	Then use the DOS TYPE command to send the file to the screen. Typing
	the file will change the background color to blue and the foreground
	color to white. If a BASIC program using screen input or output is
	then run, the 25th line is incorrectly blackened (cleared) when the
	program exits.
	
	Please note that the 25th line is not used by BASIC unless the
	statement < VIEW PRINT 1 to 25 > is used or the KEY statement is used.
	When the BASIC program ends, the 25th line automatically is cleared in
	case the KEY statement has been used.
	
	To use ANSI control codes, the ANSI.SYS driver must be installed at
	boot time by placing the following statement in your DOS CONFIG.SYS
	file on your root directory:
	
	   DEVICE=ANSI.SYS
