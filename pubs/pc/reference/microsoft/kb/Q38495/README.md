---
layout: page
title: "Q38495: &quot;Subscript Out of Range&quot; Using Complex Expression with BC /D"
permalink: /pubs/pc/reference/microsoft/kb/Q38495/
---

## Q38495: &quot;Subscript Out of Range&quot; Using Complex Expression with BC /D

	Article: Q38495
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 16-DEC-1989
	
	The program below returns a "Subscript Out Of Range" error message at
	run time when compiled with the BC /D (debug) option. The program
	works correctly inside the QB.EXE editor.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in QuickBASIC Version 4.50 and in Microsoft
	BASIC PDS Version 7.00 (fixlist7.00).
	
	To work around the problem, you can break up the complex expression.
	For example, replace the following line:
	
	        r = SGN(t(b%)) * SQR(ABS(t(b%)))
	
	with the following:
	
	        r1 = t(b%)
	        r2 = ABS(r1)
	        r = SGN(r1) * SQR(r2)
	
	The following is a code example:
	
	DIM t(12)
	FOR i = -6 TO 6
	  t(i + 6) = i
	NEXT i
	FOR b% = 1 TO 12
	  r = SGN(t(b%)) * SQR(ABS(t(b%)))
	  PRINT r
	NEXT b%
