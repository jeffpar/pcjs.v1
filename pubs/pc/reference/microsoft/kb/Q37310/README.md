---
layout: page
title: "Q37310: LPRINT Forced to Screen Using OPEN in FUNCTION Procedure"
permalink: /pubs/pc/reference/microsoft/kb/Q37310/
---

## Q37310: LPRINT Forced to Screen Using OPEN in FUNCTION Procedure

	Article: Q37310
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	You should avoid invoking a FUNCTION procedure that performs I/O in
	I/O statements.
	
	For example, if a FUNCTION procedure that opens a file is invoked in
	an LPRINT statement, the printing occurs on the screen instead of the
	printer in the example below. The simplest way to work around this
	limitation is to assign the FUNCTION procedure value to a temporary
	variable and then LPRINT the temporary variable. You can also
	eliminate the problem by taking the OPEN statement out of the FUNCTION
	procedure.
	
	This behavior applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	This limitation for the FUNCTION statement is documented on Page 201
	of the "Microsoft QuickBASIC 4.0: BASIC Language Reference" manual for
	Versions 4.00 and 4.00b. The following information appears in this
	manual:
	
	   Because BASIC may rearrange arithmetic expressions for greater
	   efficiency, avoid using FUNCTION procedures that change program
	   variables in arithmetic expressions. Also avoid using FUNCTION
	   procedures that perform I/O in I/O statements. Using FUNCTION
	   procedures that perform graphics operations in graphics statements
	   may also cause side effects.
	
	To work around this problem, assign the value of the FUNCTION
	procedure to a temporary variable, then use the temporary variable in
	the arithmetic expression, I/O statement, or graphics statement.
	
	Versions of QuickBASIC earlier than 4.00 do not have the FUNCTION
	statement.
	
	The following example, which LPRINTs a temporary variable, works
	correctly:
	
	   DECLARE FUNCTION code$ (a!)
	   CLS
	   x$=code$(a)
	   LPRINT x$; "stuff to print"
	   END
	   FUNCTION code$ (a)
	      OPEN "temp" FOR RANDOM AS #1 LEN=1
	      code$="abcd"
	      CLOSE #1
	   END FUNCTION
	
	The following example, which LPRINTs a FUNCTION procedure that uses
	the OPEN statement, incorrectly prints to the screen:
	
	   DECLARE FUNCTION code$ (a!)
	   CLS
	   LPRINT code$(a); "stuff to print"
	   END
	   FUNCTION code$ (a)
	      OPEN "temp" FOR RANDOM AS #1 LEN=1
	      code$="abcd"
	      CLOSE #1
	   END FUNCTION
