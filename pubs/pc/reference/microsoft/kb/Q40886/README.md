---
layout: page
title: "Q40886: PUT Statement Correction, Page 342 QB Language Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q40886/
---

## Q40886: PUT Statement Correction, Page 342 QB Language Reference

	Article: Q40886
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom docerr
	Last Modified: 15-DEC-1989
	
	Page 342 of the "Microsoft QuickBASIC: BASIC Language Reference"
	manual for Versions 4.00 and 4.00b and the "Microsoft BASIC 6.0
	Compiler: BASIC Language Reference" manual for Versions 6.00 and
	6.00b, ("PUT Statement - File I/O") incorrectly states the following:
	
	   ...characters in the string's value. For example,
	    the following two statements write 15 bytes to file
	    number 1:
	
	    VarString$=STRING$ (15, "X")
	    GET #1,,VarString$
	
	The GET should be changed to PUT as follows:
	
	    VarString$=STRING$ (15, "X")
	    PUT #1,,VarString$
	
	This documentation error was corrected in the QuickBASIC Version 4.50
	QB Advisor on-line Help system and in the "Microsoft QuickBASIC 4.5:
	BASIC Language Reference" manual for Version 4.50 and in the
	"Microsoft BASIC 7.0: Language Reference" manual for Microsoft BASIC
	PDS Version 7.00 for MS-DOS and MS OS/2.
