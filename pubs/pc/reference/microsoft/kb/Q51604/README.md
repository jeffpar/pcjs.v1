---
layout: page
title: "Q51604: SCREEN Function Doesn't Give Color Attribute in Graphics Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q51604/
---

## Q51604: SCREEN Function Doesn't Give Color Attribute in Graphics Mode

	Article: Q51604
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891026-104 B_BasicCom
	Last Modified: 11-DEC-1989
	
	In graphics mode, the number of the color returned by the SCREEN
	function will always have a value of 0 (zero).
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS and to
	Microsoft BASIC Compiler Versions 6.00, 6.00b, and 7.00 for MS-DOS and
	MS OS/2.
	
	The SCREEN function has the following syntax:
	
	   SCREEN (row,column[,colorflag])
	
	When colorflag is nonzero, SCREEN returns the number of the color at
	the location specified by row and column -- but only in text mode.
	
	When colorflag is zero or absent, the ASCII code of the character at
	the specified location is returned as an integer in both graphics and
	text modes.
