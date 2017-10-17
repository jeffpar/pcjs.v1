---
layout: page
title: "Q50001: The Width of Text Is Carried between BASIC SCREENs If Possible"
permalink: /pubs/pc/reference/microsoft/kb/Q50001/
---

## Q50001: The Width of Text Is Carried between BASIC SCREENs If Possible

	Article: Q50001
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891008-1 B_BasicCom
	Last Modified: 12-DEC-1989
	
	When switching from one SCREEN mode to another, the height and width
	of the text in the first SCREEN mode will be maintained in the second
	SCREEN mode if the height and width is supported by the second mode.
	
	If the second SCREEN mode does not support the height and width of the
	text used in the first SCREEN mode, then the height and width will
	change to the default of the second.
	
	Although the height and width of the text characters are maintained
	across SCREEN modes when possible, the text itself is cleared.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	The following sample program exhibits this behavior:
	
	SCREEN 0
	PRINT "80 X 25"        '80 X 25 is the default for screen mode 0.
	SLEEP
	
	SCREEN 1
	PRINT "40 X 25"        'SCREEN 1 does not support the 80 X 25 text
	SLEEP                  'format, so the format will be changed to
	                       'SCREEN 1's default of 40 X 25.
	
	SCREEN 0
	PRINT "40 x 25"        'SCREEN 0 does support the 40 X 25 text
	SLEEP                  'format, so the format that was used in
	                       'SCREEN 1 is maintained when switching to
	                       'SCREEN 0.
