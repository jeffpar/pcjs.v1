---
layout: page
title: "Q28167: Long Integer Passed to SUB and Modified May Not Return OK"
permalink: /pubs/pc/reference/microsoft/kb/Q28167/
---

## Q28167: Long Integer Passed to SUB and Modified May Not Return OK

	Article: Q28167
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 31-JAN-1990
	
	When a long integer is passed to a subprogram as a parameter and its
	value is changed, the change is reflected only inside the subprogram
	in the code example below. When control is returned to the main
	section of the program, the variable incorrectly has its original
	value, instead of the changed value.
	
	The problem occurs only when running the program as an .EXE file;
	the program works correctly in the QB.EXE interpreter.
	
	This problem occurs in QuickBASIC Versions 4.00 and 4.00b, and in
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2
	(buglist6.00 and buglist6.00b). This problem was corrected in
	QuickBASIC Version 4.50 and in Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2
	(fixlist7.00).
	
	The problem results from the passing of a long integer to the
	subprogram. If the variable type is changed (that is, b& becomes b!,
	which is a change from a long integer to a single-precision real
	number), the problem is corrected.
	
	The following are three workarounds:
	
	1. Put the long integer into a COMMON SHARED block instead of passing
	   it as a parameter.
	
	2. In the subprogram, assign the VAL expression to a temporary
	   variable and use this temporary variable in the reassignment of the
	   long integer.
	
	3. Change the variable type to anything but a long integer.
	
	The following is a code example that demonstrates the problem:
	
	DECLARE SUB sub1 (b&, a$)
	a$ = "002": b& = 1
	b& = b& + VAL(a$)
	PRINT "main -- before: "; b&
	CALL sub1(b&, a$)
	'Output in editor is 5; from EXE is 3 (wrong):
	PRINT "main -- after: "; b&
	END
	SUB sub1 (b&, a$) STATIC
	   PRINT "subprogram -- before: "; b&
	   b& = b& + VAL(a$)
	   PRINT "subprogram -- after: "; b&
	END SUB
