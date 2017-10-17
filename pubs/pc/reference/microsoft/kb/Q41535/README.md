---
layout: page
title: "Q41535: Syntax Differs When Calling a SUB without the CALL Keyword"
permalink: /pubs/pc/reference/microsoft/kb/Q41535/
---

## Q41535: Syntax Differs When Calling a SUB without the CALL Keyword

	Article: Q41535
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-DEC-1989
	
	When calling a SUBprogram in QuickBASIC without the keyword "CALL" (by
	specifying just the SUB name and arguments), you must omit the
	parentheses around the parameter list. This is known as an "implied
	CALL" statement. You must also declare that procedure in a DECLARE
	statement.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b, and
	Microsoft BASIC PDS Version 7.00. Earlier versions of these products
	do not support the implied CALL syntax.
	
	The normal form of the CALL statement is as follows:
	
	   CALL foo (arg1,arg2)
	
	In the above example, arg1 and arg2 are passed "by reference." Passing
	"by reference" means that if the subprogram changes the values of the
	passed parameters, they are passed back changed.
	
	If an individual parameter is placed inside parentheses, the parameter
	is passed "by value":
	
	   CALL foo ((arg1),(arg2))
	
	Passing a variable "by value" means that only its value is passed, and
	the value of the variable in the calling program is not changed by
	assignments in the SUBprogram.
	
	If the CALL statement is omitted from the line (i.e., only the SUB
	name is given to indicate the CALL), then the outermost parentheses
	must be omitted.
	
	The proper syntax for a call by reference without the CALL keyword is
	as follows:
	
	   foo arg1,arg2
	
	The proper syntax for a call by value without the CALL keyword is as
	follows:
	
	   foo (arg1),(arg2)
	
	The following is an example of the difference between calling by
	reference and by value:
	
	  DECLARE SUB foo (arg1, arg2)
	  arg1 = 5
	  arg2 = 6
	  foo arg1, arg2                        ;call by reference
	  PRINT arg1, arg2                      ;results in 1 and 2
	  arg1 = 5
	  foo (arg1), (arg2)          ;call by value
	  PRINT arg1, arg2                      ;results in 5 and 6
	  END
	
	  SUB foo (arg1, arg2)
	    arg1 = 1
	    arg2 = 2
	  END SUB
