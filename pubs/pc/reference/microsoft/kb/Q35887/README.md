---
layout: page
title: "Q35887: BC.EXE &quot;Internal Error&quot; Using GOTO 0; Don't Use Linenumber 0"
permalink: /pubs/pc/reference/microsoft/kb/Q35887/
---

## Q35887: BC.EXE &quot;Internal Error&quot; Using GOTO 0; Don't Use Linenumber 0

	Article: Q35887
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	The following program runs in the QB.EXE editor, but BC.EXE gives an
	"Internal error near xxx" message at compile time (where the address
	xxx may vary). This problem occurs in Microsoft QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in Microsoft BASIC Compiler Version 7.00
	(fixlist7.00).
	
	As stated on Page 9 of the "Microsoft QuickBASIC 4.0: BASIC Language
	Reference" manual for Versions 4.00 and 4.00b, using 0 (zero) as a
	line number is not recommended. The error ceases if you change the
	line number to a number or label other than 0.
	
	Compiling with or without the BC /O (stand-alone) option or BC /D
	(debug) option does not correct the problem.
	
	The following is a code example:
	
	PRINT "Seattle Seahawks are going to the Superbowl!"
	GOTO 0
	PRINT "NOT PRINTED"
	0 PRINT "Don't you agree?"
