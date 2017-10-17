---
layout: page
title: "Q41040: QuickBASIC WIDTH Command Resets Default Values for PALETTE"
permalink: /pubs/pc/reference/microsoft/kb/Q41040/
---

## Q41040: QuickBASIC WIDTH Command Resets Default Values for PALETTE

	Article: Q41040
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 SR# S890206-73
	Last Modified: 17-FEB-1989
	
	Any switch of WIDTH causes the PALETTE values to be reset to their
	default values. In the example code below, the circle is always drawn
	in the color of the default value for PALETTEs 1 to 15. It should
	always be drawn in the color corresponding to 15948 (63 * 256). This
	is true of all SCREENs that allow multiple page lengths.
	
	Microsoft has confirmed this to be a problem in Version 4.00, 4.00b,
	4.50 and in Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and OS/2 (buglist6.00, buglist6.00b). We are researching this
	problem and will post new information as it becomes available.
	
	The following code will reproduce the problem:
	
	CLS
	SCREEN 12
	i=0
	FOR k = 1 TO 15
	   PALETTE k, 63 * 256
	   i = 30-i
	   WIDTH 80, 30 + i
	   CIRCLE (100, 100), 80, 5
	   PAINT (100, 100), k, 5
	   LOCATE 20, 1: PRINT i, k; : INPUT a$
	NEXT
