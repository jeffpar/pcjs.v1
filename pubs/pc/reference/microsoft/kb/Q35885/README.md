---
layout: page
title: "Q35885: LONG INTEGER Overflow Is Not Detected in EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q35885/
---

## Q35885: LONG INTEGER Overflow Is Not Detected in EXE

	Article: Q35885
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 20-SEP-1990
	
	The program below, when run in the QB.EXE or QBX.EXE editor, correctly
	generates an "Overflow" message. However, the EXE program incorrectly
	prints a -2 (even when compiled with the /D (debug) option).
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	4.00, 4.00b, and 4.50; in Microsoft BASIC Compiler versions 6.00 and
	6.00b (buglist6.00, buglist6.00b) for MS-DOS and MS OS/2; and in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 (buglist7.00, buglist7.10) for MS-DOS and MS OS/2. We are
	researching this problem and will post new information here as it
	becomes available.
	
	The following is a code example:
	
	   a& = 2147483647     ' Largest positive long integer
	   b& = 2
	   x& = a& * b&
	   PRINT x&            ' EXE version prints a -2
