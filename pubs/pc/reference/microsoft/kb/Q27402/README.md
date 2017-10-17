---
layout: page
title: "Q27402: BC Hangs Compiling on f(1) GOTO with Constant in Function"
permalink: /pubs/pc/reference/microsoft/kb/Q27402/
---

## Q27402: BC Hangs Compiling on f(1) GOTO with Constant in Function

	Article: Q27402
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 ptm154 buglist4.00b fixlist4.50
	Last Modified: 29-NOV-1988
	
	BC.EXE hangs at compile time when you compile a program that has an
	<ON x GOTO linelist> statement, where x is a FUNCTION statement that
	is passed as a constant in an argument.
	
	The program runs correctly in the editor/interpreter environment.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and the Microsoft BASIC Compiler Version 6.00
	(buglist6.00) for MS-DOS and OS/2. This problem is corrected in
	QuickBASIC Version 4.50 and in the BASIC Compiler Version
	6.00b(fixlist6.00b).
	
	The problem only occurs when the argument passed to the function is a
	literal value. The function size has no effect. BC will hang when
	invoked either from DOS or from "Make EXE" in the QB editor.
	
	Note that function procedures are not found in versions of QuickBASIC
	earlier than Version 4.00.
	
	The following is an example of the problem:
	
	   DECLARE FUNCTION TEST (i)
	   ON test((1)) GOTO ter
	   ter:
	     END
	
	   FUNCTION test (i)
	     test = i
	   END FUNCTION
	
	The workaround is to not pass a literal value as the function
	argument. For example, change the ON x GOTO to the following:
	
	    i = 1
	    ON test(i) GOTO ter
