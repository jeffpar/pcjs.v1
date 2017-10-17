---
layout: page
title: "Q32099: BC.EXE &quot;Internal Error&quot; Using Function as Argument to INSTR"
permalink: /pubs/pc/reference/microsoft/kb/Q32099/
---

## Q32099: BC.EXE &quot;Internal Error&quot; Using Function as Argument to INSTR

	Article: Q32099
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	If a function is used as an argument to the INSTR function and the
	INSTR function is the expression in an ON <expression> GOTO statement,
	the BC.EXE compiler will give an "internal error" message. This error
	occurs with functions defined with the DEF FN method.
	
	Compiling with the BC /D (debug) option does not correct the problem.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This problem
	has been corrected in QuickBASIC Version 4.50 and in the Microsoft
	BASIC Compiler Version 7.00 (fixlist7.00).
	
	A workaround is to assign the result of the function to an
	intermediate variable and to use that variable as the argument to the
	function.
	
	This problem does not occur with QuickBASIC Version 3.00 using DEF FN
	functions. Please note that Version 3.00 does not support FUNCTION/END
	FUNCTION statements.
	
	The following code causes BC.EXE to generate an "internal error"
	message:
	
	          DEF FNT$(A$) = CHR$(ASC(A$) AND &H5F)
	          B$ = "z"
	          on  INSTR("XYZ", FNT$(B$)) goto 1000
	        print
	     1000 print "this is a test"
	
	The following code works around the error:
	
	          DEF FNT$(A$) = CHR$(ASC(A$) AND &H5F)
	          B$ = "z"
	           X$ = FNT$(B$)
	          on  INSTR("XYZ", X$) goto 1000
	    1000  print "this is a test"
