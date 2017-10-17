---
layout: page
title: "Q30858: QuickBASIC 4.x Procedure Name Followed By Colon Not Executed"
permalink: /pubs/pc/reference/microsoft/kb/Q30858/
---

## Q30858: QuickBASIC 4.x Procedure Name Followed By Colon Not Executed

	Article: Q30858
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 b_basiccom
	Last Modified: 20-SEP-1990
	
	When you use the implied CALL syntax, a SUBprogram procedure name
	followed immediately by a colon is mistaken for a label name. This
	prevents the SUBprogram from being executed. The problem occurs both
	inside the QB.EXE environment and when compiled from BC.EXE.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	4.00, 4.00b, and 4.50 for MS-DOS; in Microsoft BASIC Compiler versions
	6.00 and 6.00b (buglist6.00, buglist6.00b) for MS-DOS and MS OS/2; and
	in Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
	
	This is not an issue in QuickBASIC version 3.00 and earlier versions,
	because these versions require the CALL statement to execute
	SUBprogram procedures. The implied CALL syntax was added to QuickBASIC
	version 4.00. An "implied CALL" is where a procedure name is invoked
	without a preceding "CALL" statement, then followed by parameters
	passed in a list without surrounding parentheses.
	
	The following are two workarounds for this problem:
	
	1. Place the command following the procedure name on a new line so
	   that the colon is not necessary.
	
	2. Use an explicit CALL statement to invoke the procedure.
	
	The following code example demonstrates the problem:
	
	   DECLARE SUB subtest ()
	   CLS
	   PRINT "this is the main"
	   subtest: PRINT "the end"
	
	   SUB subtest
	   PRINT "this is sub test"
	   END SUB
	
	The procedure (SUBTEST) above will not be executed because the
	compiler mistakes the procedure name followed by a colon for a label
	name.
	
	The following code will execute correctly:
	
	   DECLARE SUB subtest ()
	   CLS
	   PRINT "this is the main"
	   call subtest: PRINT "the end"
	
	   SUB subtest
	   PRINT "this is sub test"
	   END SUB
