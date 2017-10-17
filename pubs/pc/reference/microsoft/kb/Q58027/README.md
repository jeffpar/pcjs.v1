---
layout: page
title: "Q58027: BASIC PDS 7.10 Allows Line Numbers 40 Digits Long; Correction"
permalink: /pubs/pc/reference/microsoft/kb/Q58027/
---

## Q58027: BASIC PDS 7.10 Allows Line Numbers 40 Digits Long; Correction

	Article: Q58027
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900120-1 docerr
	Last Modified: 8-JAN-1991
	
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 are enhanced to allow line numbers as
	long as 40 numbers (characters) long. However, Page 697 of Appendix A
	in the "Microsoft BASIC 7.0: Programmer's Guide" (for 7.00 and 7.10)
	incorrectly states that the largest line number possible is 65,529.
	
	The following code example demonstrates using large line numbers in
	BASIC PDS 7.00 and 7.10
	
	   ON KEY(1) GOSUB 1234567890123456789012345678901234567891
	   KEY(1) ON
	   CLS
	   PRINT "starting"
	   WHILE a$ <> "q" AND a$ <> "Q"
	   a$ = INKEY$
	   WEND
	   END
	
	   1234567890123456789012345678901234567891
	             PRINT "That is the F1 key"
	             PRINT "Hit 'q' or 'Q' to quit"
	             RETURN
