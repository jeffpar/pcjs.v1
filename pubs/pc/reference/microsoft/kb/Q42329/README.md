---
layout: page
title: "Q42329: PRINT SPC(80) Statement May Not Wrap to the Next Line"
permalink: /pubs/pc/reference/microsoft/kb/Q42329/
---

## Q42329: PRINT SPC(80) Statement May Not Wrap to the Next Line

	Article: Q42329
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 14-DEC-1989
	
	In Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50, Microsoft
	BASIC Compiler Versions 6.00 and 6.00b, and Microsoft BASIC PDS
	Version 7.00, the SPC() function does not cause output to wrap around
	to the next line(s). In QuickBASIC Version 3.00, the SPC() function
	wraps to the next line.
	
	For comparison, the SPACE$() function wraps to the next line in all
	versions.
	
	The nonwrapping behavior of the SPC() function is an intentional
	feature in QuickBASIC Versions 4.00, 4.00b, and 4.50, BASIC compiler
	Versions 6.00 and 6.00b, and Microsoft BASIC PDS Version 7.00. If the
	value given to the SPC() function is greater than the defined screen
	width, the spacing will be: <desired spacing> MOD <width>. For
	example, the following line would actually print "Hello" in column 3
	of the same line:
	
	   PRINT SPC(83);"Hello"
	
	The documentation on this function is incomplete and will be
	corrected. Microsoft will post new information here as it becomes
	available.
	
	In the following code example, both outputs will incorrectly be on the
	same line:
	
	REM *** SPC() problem example ***
	CLS : LOCATE 1,1 : PRINT "           XXX"
	LOCATE 1,1 : PRINT SPC(80); "Hello";
	END
	
	The SPC(80) function should force the "Hello" literal to be displayed
	on the second line. The SPACE$() function can be used to simulate the
	line wrap, when given the space (Hex 20) character. Note that the
	SPACE$() function overwrites any screen information that comes in its
	path with the new SPACE$() character.
