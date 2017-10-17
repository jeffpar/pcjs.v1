---
layout: page
title: "Q44306: Method for Clearing GOSUB...RETURN Subroutine Stack in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q44306/
---

## Q44306: Method for Clearing GOSUB...RETURN Subroutine Stack in BASIC

	Article: Q44306
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_GWBasicI B_BasicCom B_BasicInt B_BBasic B_MQuickB
	Last Modified: 15-DEC-1989
	
	When a program jumps out of a GOSUB subroutine without executing a
	RETURN statement, the return address is left on the stack. If the
	program jumps out multiple times, an "Out of Stack Space" or "Out of
	Memory" error eventually occurs. You must make your program execute an
	equal number of GOSUB and RETURN statements to avoid this error.
	
	The program below demonstrates a method for clearing the subroutine
	stack when a program executes more GOSUB statements than RETURN
	statements. Generally, a program should get out of a GOSUB subroutine
	with a RETURN statement, but when that is not feasible, the method
	below may be used.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS; Microsoft GW-BASIC
	Interpreter Versions 3.20, 3.22, and 3.23 for MS-DOS; Microsoft BASIC
	Interpreter Version 5.28 for MS-DOS; Microsoft BASIC Compiler Versions
	5.35 and 5.36 for MS-DOS; Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2; and Microsoft BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2.
	
	The following program, STACK.BAS, invokes RETURN in a continuous loop
	to clear the stack until a "RETURN Without GOSUB" error occurs. This
	error is trapped, and the program resumes execution. The program
	STACK.BAS is as follows:
	
	10 A = A + 1
	   IF A < 10 THEN GOSUB 10      ' Put 10 GOSUB addresses on the stack.
	   ON ERROR GOTO 30
	20 RETURN 20                    ' Pop addresses off stack until
	30 ON ERROR GOTO 0              ' "RETURN without GOSUB" error.
	   END
	
	Note: This method will not work with the SUB...END SUB subprogram
	procedure. A SUB...END SUB procedure should always be exited with
	either an EXIT SUB or an END SUB statement.
