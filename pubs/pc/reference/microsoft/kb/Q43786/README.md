---
layout: page
title: "Q43786: QB 4.00/4.00b Can Wrongly Assign User-TYPE Variable; 4.50 OK"
permalink: /pubs/pc/reference/microsoft/kb/Q43786/
---

## Q43786: QB 4.00/4.00b Can Wrongly Assign User-TYPE Variable; 4.50 OK

	Article: Q43786
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 SR# S890117-41
	Last Modified: 27-APR-1989
	
	In the program below, the QB.EXE editor (from QuickBASIC Versions 4.00
	and 4.00b) fails to correctly assign a value to a variable of a
	user-defined type (f.inx). This variable remains zero at all times.
	The problem does not occur when the program is compiled into an .EXE.
	
	Almost any change to the program corrects the error, such as renaming
	the variable. It is difficult to find the same problem in a different
	program.
	
	Microsoft has confirmed this to be a problem in Versions 4.00 and
	4.00b. This problem was corrected in QB.EXE from QuickBASIC Version
	4.50.
	
	Code Example
	
	TYPE rectype
	  a AS SINGLE
	  inx AS INTEGER
	END TYPE
	
	DIM f AS rectype
	
	f.a = 355
	f.inx = 5
	
	CLS
	PRINT f.a
	PRINT f.inx   ' this value will print out 0
	END
