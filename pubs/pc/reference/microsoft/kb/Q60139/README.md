---
layout: page
title: "Q60139: LEN Function Returns Wrong Length in LEFT&#36; in OPEN Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q60139/
---

## Q60139: LEN Function Returns Wrong Length in LEFT&#36; in OPEN Statement

	Article: Q60139
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900319-95 buglist7.00 fixlist7.10
	Last Modified: 20-SEP-1990
	
	The LEN function in Microsoft BASIC Professional Development System
	(PDS) version 7.00 may return an incorrect string length when used
	within a string function in an OPEN statement. This occurs only when
	the program is compiled with the Far Strings (BC /Fs) option, and
	doesn't occur in the QuickBASIC Extended (QBX.EXE) environment or when
	the program is compiled without the Far Strings option (in other
	words, compiled with the BC.EXE default near strings).
	
	To work around this problem, use a temporary variable for the result
	of the LEN function and use that result in the string function.
	
	Microsoft has confirmed this to be a problem with BC /Fs in Microsoft
	BASIC Professional Development System (PDS) version 7.00. This problem
	was corrected in BASIC PDS 7.10.
	
	This problem occurs because the compiler incorrectly assumes that the
	length will be the first 2 bytes of the descriptor when LEN is used in
	a string function in the OPEN statement. This assumption is correct
	for near strings, but the far string descriptor is different and the
	length must be retrieved in a different manner.
	
	Code Example
	------------
	
	The following are the compile and link lines that reproduce the
	problem in the code example:
	
	   BC LENTEST /Fs;
	   LINK LENTEST;
	
	The following code example OPENs the wrong file on the first OPEN
	statement:
	
	   ' LENTEST.BAS
	   tmp$ = "TEST.12X"
	   l% = LEN(tmp$)        'Temporary for work-around
	
	   'This should incorrectly create a file named 'TEST.12X'
	   OPEN LEFT$(tmp$, LEN(tmp$) - 1) FOR RANDOM AS #1
	   CLOSE #1
	
	   'For a workaround, use temporary variable (l%) for LEN(tmp$) and
	   'you will get 'TEST.12'
	   OPEN LEFT$(tmp$, l% - 1) FOR RANDOM AS #1
	   CLOSE #1
	
	Both OPEN statements in the above code example should open "TEST.12",
	but the first OPEN actually opens "TEST.12X" because the string length
	is returned incorrectly and is thus too large. Subtracting 1 from this
	larger value still leaves the full string to be returned from LEFT$.
