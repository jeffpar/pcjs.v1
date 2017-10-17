---
layout: page
title: "Q31301: Subscript Out of Range Can Hang .EXE without /d Debug Option"
permalink: /pubs/pc/reference/microsoft/kb/Q31301/
---

## Q31301: Subscript Out of Range Can Hang .EXE without /d Debug Option

	Article: Q31301
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-DEC-1989
	
	In an .EXE program compiled without the debug option (BC /d), a
	reference to an out-of-range array element can hang the machine. This
	occurs only in a compiled .EXE program.
	
	The QB.EXE editor correctly reports the "subscript out of range" error
	because the debug option is automatically active by default.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	The "subscript out of range" error message is documented on Page 501
	of the "Microsoft QuickBASIC: BASIC Language Reference."  The /d
	(debug) option is documented on Page 210 of "Microsoft QuickBASIC:
	Learning to Use."
	
	When a program is compiled with the BC /d (debug) option, the error
	will be reported at run time.
	
	If the following program is compiled to an .EXE file without the BC /d
	option, it will hang the machine at run time:
	
	DIM x$(3)
	OPEN "junk" FOR RANDOM AS 1 LEN = 200
	
	FOR i% = 0 TO 10
	FIELD 1, i% * 10 AS pad$, 10 AS x$(i%)
	NEXT i%
	
	FOR i% = 0 TO 10
	LSET x$(i%) = "fld " + STR$(i%): PRINT x$(i%)
	NEXT i%
