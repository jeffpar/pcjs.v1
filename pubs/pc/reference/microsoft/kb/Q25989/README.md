---
layout: page
title: "Q25989: DATE&#36;, TIME&#36; in Loop Can Push System Time Backwards in DOS 3.x"
permalink: /pubs/pc/reference/microsoft/kb/Q25989/
---

## Q25989: DATE&#36;, TIME&#36; in Loop Can Push System Time Backwards in DOS 3.x

	Article: Q25989
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | TAR67824 B_BasicCom
	Last Modified: 31-AUG-1989
	
	The following BASIC program makes the system time go backwards when
	run under MS-DOS Versions 3.x.
	
	FOR i = 1 TO 40
	   DATE$ = "11/17/87"
	   PRINT TIME$
	NEXT
	
	This behavior is caused by a DOS Versions 3.x problem, not a BASIC
	problem. The problem does not occur in MS OS/2 real mode.
	
	As a workaround, do not reset the date multiple times within a loop.
	
	This information applies to Microsoft QuickBASIC Versions 3.00, 4.00,
	4.00b, and 4.50 and to Microsoft BASIC Compiler Versions 6.00 and
	6.00b when run under MS-DOS Versions 3.x.
	
	For related information concerning Microsoft C, query on the following
	words:
	
	   _DOS_SETDATE and CLOCK and TIME and C
