---
layout: page
title: "Q28591: BC.EXE &quot;Argument-Count Mismatch&quot; Compiling Underscore in CALL"
permalink: /pubs/pc/reference/microsoft/kb/Q28591/
---

## Q28591: BC.EXE &quot;Argument-Count Mismatch&quot; Compiling Underscore in CALL

	Article: Q28591
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 31-JAN-1990
	
	Inserting a line-continuation character (underscore) between the
	subprogram name and the argument list in a CALL statement produces an
	"Argument-count mismatch" message when compiled with Microsoft BASIC
	Compiler. If the subprogram is not DECLAREd, a "Syntax error" message
	results.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	4.00 and 4.00b and in Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and OS/2 (buglist6.00 buglist6.00b). This problem was
	corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	If an underscore is inserted at any other point in the CALL statement
	(between the CALL and the subprogram name or in the argument list), it
	is properly recognized as a line-continuation character. This problem
	does not occur in the editor because the editor removes continuation
	characters.
	
	Note: DECLARE statements are not supported in earlier versions of
	QuickBASIC. If the DECLARE statement is removed and STATIC is added to
	the SUB statement, QuickBASIC Versions 2.00 and 3.00 handle the
	underscore properly.
	
	To work around the problem, move the continuation character to some
	other point in the CALL statement.
	
	The following example works correctly:
	
	   CALL_
	   a(b)
	
	The following code example shows the problem:
	
	   DECLARE SUB a (b)
	   CALL a_
	   (b)
	
	   SUB a (x)
	   END SUB
