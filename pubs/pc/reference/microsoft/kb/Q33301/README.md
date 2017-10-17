---
layout: page
title: "Q33301: FUNCTION Procedures Cannot Be Invoked in I/O Statements"
permalink: /pubs/pc/reference/microsoft/kb/Q33301/
---

## Q33301: FUNCTION Procedures Cannot Be Invoked in I/O Statements

	Article: Q33301
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 9-JUL-1990
	
	You should avoid invoking (or nesting) a FUNCTION procedure in a BASIC
	statement that performs output to a file. Instead, the returned value
	of the FUNCTION procedure should be assigned to an intermediate
	variable, and the intermediate variable can then be used in the I/O
	statement. (A FUNCTION procedure is defined in a FUNCTION...END
	FUNCTION block.)
	
	This and other restrictions are described on Page 201 of the
	"Microsoft QuickBASIC 4.0: BASIC Language Reference" manual for
	versions 4.00 and 4.00b, as follows:
	
	   Because BASIC may rearrange arithmetic expressions for greater
	   efficiency, avoid using FUNCTION procedures that change program
	   variables in arithmetic expressions. Also avoid using FUNCTION
	   procedures that perform I/O in I/O statements. Using FUNCTION
	   procedures that perform graphics operations in graphics statements
	   may also cause side effects.
	
	The same restriction is mentioned on Page 201 of the "Microsoft BASIC
	Compiler 6.0: BASIC Language Reference" for versions 6.00 and 6.00b
	for MS OS/2 and MS-DOS. It is also mentioned on Page 146 of the
	"Microsoft BASIC 7.0: Language Reference" manual.
	
	Please note that user-defined functions defined with the DEF FN
	statement do not have the above restrictions.
