---
layout: page
title: "Q58108: BASIC 7.00 Wrong Integer FOR-NEXT Index Results in .EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q58108/
---

## Q58108: BASIC 7.00 Wrong Integer FOR-NEXT Index Results in .EXE

	Article: Q58108
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900123-121 buglist7.00 fixlist7.10
	Last Modified: 1-AUG-1990
	
	In a compiled .EXE program, a FOR ... NEXT loop with an ending loop
	counter value that is a variable and with a body that contains an
	integer or long integer array assigned to a single- or
	double-precision value can PRINT an incorrect value for the loop
	counter. This problem occurs in a compiled .EXE program only, not in
	the QuickBASIC Extended environment (QBX.EXE). An example of this
	problem is shown in the program below.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) version 7.00 for MS-DOS and MS
	OS/2. This problem was corrected in Microsoft BASIC PDS version 7.10.
	
	The program below illustrates two conditions that, when occurring
	together, can produce an undesirable effect. The root of this error is
	embedded in the BASIC compiler (BC.EXE) optimization techniques. The
	two conditions necessary to show this problem are as follows:
	
	1. A variable (not a constant) is used as the stop (ending) loop
	   counter value on a FOR ... NEXT statement.
	
	2. An integer or long integer array (which is subscripted with the
	   loop counter) is assigned to a single- or double-precision number.
	   (This is known as "typecasting" -- a single- or double-precision
	   number is typecasted to an integer or long integer.)
	
	The problem occurs only on the first PRINT statement in the source
	file that prints the loop counter (i%). For all loop iterations, that
	PRINT i% statement incorrectly displays the fixed value of t#, the
	ending loop value. PRINT i% statements farther down in the source code
	work correctly.
	
	To eliminate the problem, use one of the following workarounds:
	
	1. Compile with the BC /X option.
	
	     Note: In the example below, the debug compiler option (/D) does
	     not correct the problem.
	
	2. Use the CINT() function to convert the real number to an integer
	   before assigning it to the integer or long integer array.
	
	3. Use a numeric constant (instead of a variable) for the ending
	   value of the FOR loop counter.
	
	4. Compile with the BC /FPa option (instead of the default /FPi).
	
	Code Example
	------------
	
	   Dim ia%(10)            'An integer or long array shows problem.
	   t# = 5                 't# can be any numeric type (!, @, #, %, or &)
	   FOR i% = 1 to t#       't# is the ending value of the loop counter, i%
	   PRINT i%;              'This value incorrectly prints equal to t# in .EXE
	   ia%(i%) = 46.7         'A real number is typecast to an integer or
	                          'long-integer value and assigned to the array
	REM ia%(i%) = CINT(46.7)  'Workaround: use CINT(46.7) in the above line.
	   PRINT i%;              'This value prints correctly.
	   PRINT ia%(i%)          'This value prints correctly.
	   NEXT i%
	   END
	
	Below is the (incorrect) output from this .EXE (compiled without
	BC /X):
	
	   5   1   46.7
	   5   2   46.7
	   5   3   46.7
	   5   4   46.7
	   5   5   46.7
	
	The output should be as follows:
	
	   1   1   46.7
	   2   2   46.7
	   3   3   46.7
	   4   4   46.7
	   5   5   46.7
