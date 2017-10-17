---
layout: page
title: "Q43930: Recursive Procedure Variables Not Saved When in COMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q43930/
---

## Q43930: Recursive Procedure Variables Not Saved When in COMMON

	Article: Q43930
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890424-119 B_BasicCom
	Last Modified: 15-DEC-1989
	
	QuickBASIC procedures can recursively CALL themselves. Any needed
	variables to be used in the recursive procedure should be passed as
	parameters, and all local variables (variables dimensioned only in the
	SUB itself) variables whose values need to be preserved through each
	recursive CALL should be declared as STATIC. STATIC declaration causes
	each variable's values to be retained on the stack for later use.
	
	One important note is that all variables that are located in a COMMON
	or COMMON SHARED block and are used in a recursive procedure will not
	be saved through each recursive CALL.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and MS OS/2, and Microsoft BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2.
	
	More information concerning recursive procedures can be found on Pages
	79-83 of the "Microsoft QuickBASIC 4.0: Programming in BASIC: Selected
	Topics" manual for Versions 4.00 and 4.00b, and on Pages 69-72 of the
	"Microsoft QuickBASIC 4.5: Programming in BASIC" manual for Version
	4.50.
	
	Code Example
	------------
	
	The following program can be found in either the "Microsoft QuickBASIC
	4.0: BASIC Language Reference" manual on Pages 62-63, or on Pages
	50-51 of the ring-bound "Microsoft QuickBASIC 4.5: BASIC Language
	Reference" manual for Version 4.50:
	
	DECLARE FUNCTION Reverse$ (StringVar$)
	LINE INPUT "Enter string to reverse: ", X$
	PRINT Reverse$(X$)
	END
	
	FUNCTION Reverse$ (S$)
	  C$ = MID$(S$, 1, 1)
	  IF C$ = "" THEN
	    Reverse$ = ""
	  ELSE
	    Reverse$ = Reverse$(MID$(S$, 2)) + C$
	  END IF
	END FUNCTION
