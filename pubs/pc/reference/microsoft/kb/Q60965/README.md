---
layout: page
title: "Q60965: Problem When Using Integer Array and FOR Loop in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q60965/
---

## Q60965: Problem When Using Integer Array and FOR Loop in BASIC 7.00

	Article: Q60965
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900411-147 buglist7.00 fixlist7.10
	Last Modified: 1-AUG-1990
	
	The code example below shows a case where using an integer variable
	for a FOR loop-counter can produce incorrect results in a compiled
	BASIC program. The program must have the following elements to
	reproduce the problem:
	
	1. The program must contain a simple FOR loop (not nested, etc.).
	
	2. The FOR loop must contain a call to the INT function.
	
	3. The upper bound of the FOR loop must be specified with a
	   variable, not a literal.
	
	4. The loop-counter variable and upper-bound variable must be
	   integers.
	
	The code example below demonstrates these conditions and prints out
	the value of the loop counter each time it loops. In a compiled BASIC
	program, this example always prints the upper bound of the loop
	counter.
	
	Microsoft has confirmed this to be a problem in the BC.EXE compiler
	that comes with Microsoft BASIC Professional Development System (PDS)
	version 7.00 for MS-DOS and MS OS/2. This problem was corrected in
	BASIC PDS version 7.10.
	
	This problem does not occur in QBX.EXE (the QuickBASIC extended
	environment that comes with BASIC PDS 7.00). This problem also does
	not occur in the BC.EXE or QB.EXE environments that come with
	QuickBASIC versions 4.00, 4.00b, or 4.50.
	
	Any of the following workarounds corrects the problem:
	
	1. Compile with the BC /X option.
	
	2. Compile with the BC /FPa option.
	
	3. Change the DEFINT statement to DEFtype, where "type" is anything
	   but INT (integer).
	
	4. Change the upper bound on the FOR-LOOP to a literal.
	
	Code Example
	------------
	
	DEFINT A-Z                    'Change to something other than INT
	                              'or remove the line
	DIM test(4)
	temp = 4
	FOR k = 1 TO temp             'Use 4 instead of temp.
	   PRINT k                    'In a compiled program, this line
	                              'always prints the upper bound
	                              'of the FOR-LOOP.
	   test(k) = INT(1.0)         'Remove the INT function CALL.
	NEXT k
	
	The following is the output in the QBX.EXE environment (correct):
	
	   1
	   2
	   3
	   4
	
	The following is the output from a compiled 7.00 .EXE program
	(incorrect):
	
	   4
	   4
	   4
	   4
