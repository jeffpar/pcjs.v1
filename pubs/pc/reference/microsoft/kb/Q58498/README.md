---
layout: page
title: "Q58498: No Error in QB Using Duplicate Parameter Name in DECLARE"
permalink: /pubs/pc/reference/microsoft/kb/Q58498/
---

## Q58498: No Error in QB Using Duplicate Parameter Name in DECLARE

	Article: Q58498
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900126-79 B_BasicCom buglist4.00 buglist4.00b buglist4.
	Last Modified: 20-SEP-1990
	
	The QuickBASIC environment fails to give an error message for a
	DECLARE statement that has several parameters with the same name. But
	when compiled with BC.EXE, the same statement correctly causes the
	following severe errors:
	
	   Formal parameters not unique
	   Formal parameter specification illegal
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50; in the QB.EXE
	environment of Microsoft BASIC Compiler versions 6.00 and 6.00b
	(buglist6.00, buglist6.00b); and in the QBX.EXE (QuickBASIC Extended)
	environment of Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
	
	The following code example fails to produce an error inside the
	QuickBASIC QB.EXE or QBX.EXE environment:
	
	   DECLARE SUB test (a%, a%)   'This line should cause error
	   CALL test(1, 2)
	   END
	
	   SUB test (a%, b%)
	   PRINT a%, b%
	   END SUB
	
	When the above program is compiled with BC.EXE, the compiler correctly
	flags the DECLARE line as follows:
	
	   DECLARE SUB test (a%, a%)   'This line should cause error
	                         ^ Formal parameters not unique
	                         ^ Formal parameter specification illegal
