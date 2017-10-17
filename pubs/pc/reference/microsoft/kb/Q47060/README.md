---
layout: page
title: "Q47060: CodeView Can't Watch Array Passed to BASIC SUBprogram"
permalink: /pubs/pc/reference/microsoft/kb/Q47060/
---

## Q47060: CodeView Can't Watch Array Passed to BASIC SUBprogram

	Article: Q47060
	Version(s): 6.00 6.00b 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | B_QuickBas buglist6.00 buglist6.00b buglist7.00 fixlist7.10
	Last Modified: 20-SEP-1990
	
	When debugging a BASIC program (compiled with BC.EXE versions 7.00 and
	earlier) with Microsoft CodeView (version 2.20, 2.30, 2.35, 3.00, or
	3.10), an attempt to watch an array passed to a SUBprogram produces
	the error "Not an array."
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	4.00, 4.00b, and 4.50 (even though they do not provide CodeView on the
	release disks) (buglist4.00, buglist4.00b, buglist4.50); in Microsoft
	BASIC Compiler versions 6.00 and 6.00b (which provide CodeView version
	2.20 on the release disks); and in Microsoft BASIC Professional
	Development System (PDS) version 7.00 (which provides CodeView version
	2.35 on the release disks). This problem is corrected by compiling the
	program with BASIC PDS version 7.10 and using Microsoft CodeView
	version 3.10, which comes with BASIC PDS 7.10.
	
	As a workaround in earlier versions, you can make the array global by
	putting it in a COMMON statement and not passing it through a CALL
	statement's parameter list.
	
	Note that CodeView version 2.20 is shipped with Microsoft BASIC
	Compiler versions 6.00 and 6.00b; CodeView 2.30 is shipped with
	Microsoft FORTRAN version 5.00; CodeView version 2.35 is shipped with
	Microsoft BASIC Professional Development System (PDS) version 7.00;
	CodeView version 3.00 is shipped with Microsoft C Compiler version
	6.00; and CodeView 3.10 is shipped with Microsoft BASIC PDS version
	7.10.
	
	The following program is CVTEST.BAS, which demonstrates the above
	problem when compiled in BC.EXE 7.00 or earlier, and run under
	Microsoft CodeView:
	
	   DECLARE SUB test (a() AS INTEGER)
	   DIM a(5) AS INTEGER
	   a(3) = 3
	   PRINT a(3)
	   CALL test(a())
	   END
	
	   SUB test (a() AS INTEGER)
	     PRINT a(3)
	   END SUB
	
	To demonstrate the problem, compile and link as follows:
	
	   BC /Zi TEST.BAS;
	   LINK /CO TEST;
	
	Load the program into CodeView (CV.EXE) and set a Watch (CTRL+W) on
	the variable a(3), then single-step the program (by pressing function
	key F8) until you execute the PRINT a(3) statement inside the
	SUB...END SUB procedure. At this point, the "Not an array" error
	message appears.
	
	Additional article reference words: S_CodeView
