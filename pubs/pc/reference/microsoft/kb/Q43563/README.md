---
layout: page
title: "Q43563: Function MENU%() Fails in Hergert's &quot;QuickBASIC, 2nd Edition&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q43563/
---

## Q43563: Function MENU%() Fails in Hergert's &quot;QuickBASIC, 2nd Edition&quot;

	Article: Q43563
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 14-DEC-1989
	
	The MENU%() function in the Microsoft Press book "Microsoft
	QuickBASIC, Second Edition" by Douglas Hergert will fail if it is
	coded without the variables "true%" and "false%" defined in the main
	program. If these lines are not included, the program will eventually
	enter an infinite loop that can only be exited with CTRL+BREAK.
	
	The program can be found on Pages 68-71 in Hergert's book. This
	program, which is designed to be incorporated into your program,
	displays a menu box with menu options and returns a value equal to
	your selection. The book assumes that you have defined the variables
	"true%" and "false%" in the title of your main program. This is a
	documentation omission.
	
	This information applies to Microsoft QuickBASIC Versions 3.00, 4.00,
	4.00b, and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b,
	and to Microsoft BASIC PDS Version 7.00.
	
	The workaround for this problem is to add one of the following lines
	of code to the beginning of the program:
	
	   false% = 0 : true% = NOT false%
	   true% = -1 : false% = NOT true%
