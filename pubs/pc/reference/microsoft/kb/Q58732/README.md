---
layout: page
title: "Q58732: QB 4.50 Parameter Passed to Separate Module Shows as Garbage"
permalink: /pubs/pc/reference/microsoft/kb/Q58732/
---

## Q58732: QB 4.50 Parameter Passed to Separate Module Shows as Garbage

	Article: Q58732
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900210-1 buglist4.50
	Last Modified: 1-MAR-1990
	
	A QuickBASIC 4.50 program that calls a subprogram located in a
	separate module (such as in a library or Quick library) can have a
	parameter's contents become corrupt under the specific circumstances
	described further below. After the parameter has been corrupted,
	PRINTing that parameter may display "garbage" instead of the correct
	results.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Version 4.50. We are researching this problem and will post new
	information here as it becomes available.
	
	This problem does NOT occur in earlier versions of QuickBASIC, in
	Microsoft BASIC Compiler Versions 6.00 or 6.00b for MS-DOS and MS
	OS/2, or in Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and MS OS/2.
	
	The conditions under which parameters may become corrupt are as
	follows:
	
	1. Variables are passed using argument and parameter lists to a
	   subprogram located in a separate module (a linked .OBJ, a library,
	   or a Quick library). (This problem does not occur if variables are
	   passed through a COMMON SHARED statement.)
	
	2. The second argument passed is of type SINGLE, DOUBLE, or INTEGER.
	   (This problem does not occur with long integers.)
	
	3. In the subprogram, the variable in the first position of the
	   parameter list is multiplied by the variable in the second
	   position, giving the result to a third variable such as a third
	   parameter or a variable local to the subroutine. The problem
	   does not occur if the order of multiplication is switched.
	
	4. If all of the above conditions are met, the variable that is
	   defined in the second position of the parameter list shows garbage
	   when PRINTed even though no changes were made to this variable.
	   All other variables are displayed correctly.
	
	The following program exhibits the problem:
	
	Main Level Code
	---------------
	
	   x = 5
	   y = 6
	   Print "Before Call "; x, y, z
	   CALL Garbage(x, y, z)
	   PRINT "After Call "; x, y, z   '--Correct values are displayed
	                                  '  after exiting the sub
	
	Separate Module (.OBJ, Library, or Quick Library) Code
	------------------------------------------------------
	
	   SUB Garbage (x, y, z)
	     PRINT "In sub, before multiplying "; x, y, z  '--Correct values
	                                                   '  are displayed
	     z = x * y                   '--Change this line to z = y * x
	                                 '  and program will work correctly
	     PRINT "In sub, after multiplying  "; x, y, z  '--y displays garbage
	   END SUB
	
	Workarounds
	-----------
	
	One workaround to the problem is to assign the variable located in the
	second position of the parameter list to a temporary variable and work
	with that temporary variable. At the end of the procedure, assign the
	parameter variable the value of the temporary variable. For example,
	the procedure in the library or Quick library would look like the
	following:
	
	   SUB Garbage (x, y, z)
	      ytemp = y
	      z = x * ytemp
	      y = ytemp
	      PRINT "Printing ytemp "; ytemp
	      PRINT "Printing y     "; y
	  END SUB
	
	Another workaround is to pass variables through a COMMON SHARED
	statement instead of a parameter list.
