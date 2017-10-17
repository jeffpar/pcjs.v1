---
layout: page
title: "Q28046: WIDTH Resets Colors to Black, White in 4.00, 4.00b"
permalink: /pubs/pc/reference/microsoft/kb/Q28046/
---

## Q28046: WIDTH Resets Colors to Black, White in 4.00, 4.00b

	Article: Q28046
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 31-JAN-1990
	
	When the width of the screen is changed, the background and foreground
	colors are reset to the default of black and white. The problem occurs
	while running the program both in the QB.EXE editor and also as an .EXE
	executable program.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	The following is a code example:
	
	   COLOR 15,1
	   CLS
	   INPUT i$
	   WIDTH 40
	   CLS
	   INPUT a$
	   end
