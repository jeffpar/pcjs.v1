---
layout: page
title: "Q33621: &quot;RETURN without GOSUB&quot; When ON ERROR and CHAIN in 4.00b"
permalink: /pubs/pc/reference/microsoft/kb/Q33621/
---

## Q33621: &quot;RETURN without GOSUB&quot; When ON ERROR and CHAIN in 4.00b

	Article: Q33621
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00b buglist4.50
	Last Modified: 8-DEC-1989
	
	If the following program is compiled in QuickBASIC Version 4.00b or
	4.50 or Microsoft BASIC Compiler Version 6.00 or 6.00b and CHAINed
	to/from another program, the error message "RETURN without GOSUB in
	line 10 of module" is generated. This problem does not occur when
	executed inside the QuickBASIC environment or if the two programs are
	compiled with the same switches or if A.BAS is compiled with /O
	switch.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00b and 4.50 and in Microsoft BASIC Compiler for MS-DOS and OS/2
	(buglist6.00, buglist6.00b). This problem has been corrected in
	Microsoft BASIC Compiler Version 7.00 (fixlist7.00).
	
	The following is a code example:
	
	   ' A.BAS, the CHAINing program:
	   CHAIN "B"
	
	   ' B.BAS, the CHAINed-to program:
	   ' Will give error message unless A.BAS was compiled with /E or /X.
	   GOSUB sub1
	   PRINT "It works!"
	   END
	   sub1:
	         PRINT "Here I am!"
	         ON 1 GOSUB sub2
	         PRINT "I'm back!"
	   10    RETURN                  'Says RETURN without GOSUB here when
	                                 'compiled.
	   sub2:
	         PRINT "I'm down here!"
	         RETURN
	   sub3: ON ERROR GOTO OhNo      'Should never get to this line.
	   OhNo: END                     'Never gets to this line.
