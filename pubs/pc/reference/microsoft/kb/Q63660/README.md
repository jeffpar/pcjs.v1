---
layout: page
title: "Q63660: Error D2030 May Hide Other Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q63660/
---

## Q63660: Error D2030 May Hide Other Errors

	Article: Q63660
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 15-AUG-1990
	
	When compiling the example code shown below with C6.00 under OS/2
	version 1.20, the compiler issues the following error messages at the
	command line:
	
	   x.c(2) : error C2065: 'UNDEFINED_CONST' : undefined
	   x.c(2) : error C2057: expected constant expression
	   Command line error D2030 : INTERNAL COMPILER ERROR in 'P1'
	                   Contact Microsoft Product Support
	
	Programmer's WorkBench (PWB) only issues the following message:
	
	   Command line error D2030 : INTERNAL COMPILER ERROR in 'P1'
	                   Contact Microsoft Product Support
	
	This is also the only error message issued if you compile from the
	command line and redirect the output.
	
	Turning off or on any optimizations makes no difference. Defining the
	the undefined constant causes the error to disappear.
	
	This error is indicating that the first pass of the compiler ("P1") is
	getting a GP fault. Since the pass is GP faulting, the error message
	output doesn't get flushed from the buffer and the extra error
	messages are lost.
	
	In general, if you receive a D2030 error, other error messages may
	have been lost. Ways to find the problem include using different
	optimizations and memory models, using the "-qc" option, and breaking
	your code into smaller pieces until you find the problem code.
	
	Code Example
	------------
	
	typedef int FOO ;
	void funcA( int array[ UNDEFINED_CONST ] ) ;
	void funcB( void ) ;
