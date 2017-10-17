---
layout: page
title: "Q69157: Bad Values When QLB Function Used as SUB Parameter"
permalink: /pubs/pc/reference/microsoft/kb/Q69157/
---

## Q69157: Bad Values When QLB Function Used as SUB Parameter

	Article: Q69157
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910118-99
	Last Modified: 14-FEB-1991
	
	If a FUNCTION returning a floating-point value is located in a Quick
	library and is directly used as the second, third, or later parameter
	of a SUB or FUNCTION in a program, then incorrect values may be passed
	to the SUB or FUNCTION being called. This problem occurs only in the
	QuickBASIC environment.
	
	Microsoft has confirmed this problem with Microsoft QuickBASIC
	versions 4.00, 4.00b, and 4.50. This problem does not exist with the
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10.
	
	When compiled and linked (with the FUNCTION in a .LIB library) into an
	.EXE file, the same program will run correctly.
	
	A simple workaround for this problem is to assign a temporary variable
	to the return value of the Quick library function, then pass that
	temporary variable when you invoke the SUB or FUNCTION.
	
	The results may vary depending upon the number and type of parameters
	passed to the FUNCTION within the Quick library. If the Quick library
	function accepts parameters, bad values may be passed to the calling
	SUB or FUNCTION.  However, if no parameters are accepted by the Quick
	library function, a machine hang may occur when that function is used
	as a parameter to another SUB or FUNCTION.
	
	Using the debug options when creating the Quick library, or using the
	ON ERROR GOTO ... RESUME lines in either the main program or in the
	Quick library, does not eliminate the problem. The code below
	demonstrates the problem.
	
	The following function goes in the Quick library:
	
	DECLARE FUNCTION func1! (x!)
	FUNCTION func1! (x!)
	    func1! = x! * 2
	END FUNCTION
	
	The following program invokes the Quick library's function directly in
	the parameter list of the SUB foo, and demonstrates the problem:
	
	DECLARE FUNCTION func1! (x!)
	DECLARE SUB foo (a!, b!)
	CALL foo (100, func1! (45))
	END
	SUB foo (a!, b!)
	PRINT a!; b!  'This should print 100 90, but incorrectly prints 90 90
	END SUB
	
	A simple modification using a temporary variable (y!) in the calling
	program works around the problem, as shown below:
	
	DECLARE FUNCTION func1! (x!)
	DECLARE SUB foo (a!, b!)
	y! = func1! (45)
	CALL foo (100, y!)
	END
	SUB foo (a!, b!)
	    PRINT a!; b!
	END SUB
