---
layout: page
title: "Q28022: Extraneous Error Messages Compiling REMLINE.BAS with BC /E"
permalink: /pubs/pc/reference/microsoft/kb/Q28022/
---

## Q28022: Extraneous Error Messages Compiling REMLINE.BAS with BC /E

	Article: Q28022
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 15-JAN-1990
	
	Using only an /e switch, compile the program REMLINE.BAS that is
	distributed as a sample program with Microsoft BASIC Compiler Version
	6.00. You will get the following three errors:
	
	   bc remline /e;
	
	     RESUME
	          ^ Missing Resume Next (/X)
	     RESUME NEXT
	          ^ Missing Resume Next (/X)
	   LOOP
	      ^ Subprogram Error
	
	The LOOP referenced by the error is on line 248. It is not an error
	under any other combination of compilation switches, and the program
	compiles correctly with /X.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 (fixlist7.00).
