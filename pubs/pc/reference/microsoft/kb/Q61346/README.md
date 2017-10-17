---
layout: page
title: "Q61346: Dynamic Array Using INT in FOR Loop Returns Bad Results"
permalink: /pubs/pc/reference/microsoft/kb/Q61346/
---

## Q61346: Dynamic Array Using INT in FOR Loop Returns Bad Results

	Article: Q61346
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900409-113 buglist7.00 fixlist7.10
	Last Modified: 20-SEP-1990
	
	Assigning values to a dynamic array using the INT function in a FOR
	loop that contains a variable for the maximum index can produce
	incorrect results when compiled. The problem seems to be an addressing
	problem where all array values contain the result of the last
	computation.
	
	Microsoft has confirmed this to be a problem in the BC.EXE environment
	of Microsoft BASIC Professional Development System (PDS) version 7.00.
	This problem was corrected in BASIC PDS 7.10. This problem does not
	occur in the QBX.EXE editor in 7.00, or in earlier versions of
	Microsoft QuickBASIC or Microsoft BASIC Compiler.
	
	Any of the following workarounds will correct this problem:
	
	1. Compile with the BC /D compiler option.
	2. Use a static array.
	3. Use a temporary variable for the function value.
	4. Use a literal to define the FOR loop.
	
	Code Example
	------------
	
	The following code example demonstrates the problem:
	
	   'Compile and link lines:
	   '
	   ' BC FORARRAY;               NOTE: The BC /D compiler option
	   '                                  corrects the problem.
	   ' LINK FORARRAY;
	   DEFINT A-Z                   'Any numeric type shows problem.
	   n = 1                        'n=1 is required for FOR upper index.
	   DIM a(n)                   'Array must be dynamic to show problem.
	   a(0) = 1
	   a(1) = 2
	   FOR i = 0 TO n               'Variable n required to cause problem.
	      a(i) = INT(a(i))          'INT or FIX functions cause problem.
	      PRINT a(i)       'Incorrectly prints 2 for each iteration; it
	                       'should have printed 1, then 2.
	   NEXT
	   END
	
	When compiled without /D, the above program displays the following
	incorrect results:
	
	   2
	   2
	
	When run in the QBX.EXE editor or compiled with /D option, the above
	program displays the following correct results:
	
	   1
	   2
