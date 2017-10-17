---
layout: page
title: "Q37305: LONG Integer Parameter Passed to SUB Fails after Assignment"
permalink: /pubs/pc/reference/microsoft/kb/Q37305/
---

## Q37305: LONG Integer Parameter Passed to SUB Fails after Assignment

	Article: Q37305
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 11-DEC-1989
	
	A problem can occur in an .EXE program when you pass a LONG integer
	parameter to a subprogram and then assign that parameter to a local
	short integer. The long integer parameter becomes corrupted; the
	program should have only changed the local short integer. This problem
	does not occur inside the QuickBASIC QB.EXE environment.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and Microsoft BASIC Compiler Versions 6.00 and
	6.00b (buglist6.00, buglist6.00b) for MS-DOS and MS OS/2. This problem
	was corrected in Microsoft BASIC Compiler Version 7.00 (fixlist7.00).
	
	This problem does not occur when the program is compiled with the
	debug option (BC /D). To work around the problem, compile with the
	debug option.
	
	The following steps will demonstrate this problem:
	
	1. Pass an integer to a subprogram whose formal parameter is declared
	   to be a LONG integer.
	
	2. Within the subprogram, initialize a temporary, short-integer
	   variable, and assign the LONG integer parameter to it. This forces
	   a type conversion from LONG to short integer.
	
	3. Immediately print out the LONG integer parameter. Even though the
	   program was not designed to change the LONG variable, it is
	   corrupted (i.e., an unexpected value appears). The temporary,
	   short-integer variable prints correctly.
	
	The program code example below will work as expected inside the
	QuickBASIC QB.EXE environment. However, when compiled into an
	executable (.EXE file), the problem occurs. Note that all three PRINT
	statements should return the same values (4).
	
	The following is a code example:
	
	DECLARE SUB foo (long1&, long2&)
	CLS
	CALL foo(4&, 4&)  ' Long or short integer constants both show problem.
	
	SUB foo (long1&, long2&)
	PRINT "initial parameters: ", long1&, long2&
	temp1% = 0
	temp2% = 0
	temp1% = long1&   ' It is here where the type conversion takes place
	temp2% = long2&   ' and long1& and long2& are corrupted.
	PRINT "Parameters after assignment: "; long1&, long2&
	PRINT "Temporary variables after assignment: "; temp1%, temp2%
	END SUB
