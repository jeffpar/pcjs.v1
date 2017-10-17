---
layout: page
title: "Q22018: PLAY &quot;N0&quot; First Note of Rest Clicks Speaker in QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q22018/
---

## Q22018: PLAY &quot;N0&quot; First Note of Rest Clicks Speaker in QuickBASIC

	Article: Q22018
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist3.00 buglist4.00 buglist4.00b buglist4.50
	Last Modified: 20-SEP-1990
	
	In QuickBASIC, the PLAY statement can produce a click on the speaker
	for the first note of rest (but not for subsequent notes of rest). For
	example, the following program will produce no sound when run under
	the BASICA or GW-BASIC Interpreter, but produces a single click when
	run as a compiled QuickBASIC program:
	
	   10 while inkey$ = ""
	   20 play "N0"    ' N followed by zero (0) means play a note of rest.
	   30 wend
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	2.00, 2.01 (buglist2.00, buglist2.01), 3.00, 4.00, 4.00b, and 4.50; in
	Microsoft BASIC Compiler versions 6.00 and 6.00b (buglist6.00,
	buglist6.00b); and in Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
