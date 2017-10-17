---
layout: page
title: "Q40890: BC &quot;Variable Name Not Unique&quot; on SUB with Period in Name"
permalink: /pubs/pc/reference/microsoft/kb/Q40890/
---

## Q40890: BC &quot;Variable Name Not Unique&quot; on SUB with Period in Name

	Article: Q40890
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890123-207 B_BasicCom
	Last Modified: 14-DEC-1989
	
	If a BASIC SUBprogram name contains a period (that is, a dot), then
	any variables that have the same name as the portion of the SUBprogram
	name that is left of the period produce a "Variable name not unique"
	error message from BC.EXE at compile time. The program does not
	produce the error inside the QB.EXE editor environment.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2.
	
	This behavior does not occur in Microsoft BASIC PDS Version 7.00.
	BASIC PDS Version 7.00 will successfully compile a program under the
	above conditions.
	
	The sample program below runs inside the QuickBASIC environment.
	However, when compiled using BC.EXE, a "Variable name not unique"
	error message is produced.
	
	It is recommended that variable and subprogram/function names contain
	no periods. Periods are now used by BASIC in specifying individual
	elements of a user-defined type variable. To eliminate the problem in
	the program below, remove the period from the SUBprogram name.
	
	The following is a code example:
	
	DECLARE SUB Test.one ()
	COMMON SHARED Test AS SINGLE
	Test = 4
	CALL Test.one
	END
	
	SUB Test.one
	  PRINT "in Test.one"
	END SUB
