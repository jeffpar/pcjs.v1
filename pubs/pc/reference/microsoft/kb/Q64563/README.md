---
layout: page
title: "Q64563: Command Line Error D2030: INTERNAL COMPILER ERROR IN 'QC'"
permalink: /pubs/pc/reference/microsoft/kb/Q64563/
---

## Q64563: Command Line Error D2030: INTERNAL COMPILER ERROR IN 'QC'

	Article: Q64563
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	The program below when compiled under OS/2 with the /qc switch will
	issue the following error:
	
	   Command line error D2030 : INTERNAL COMPILER ERROR in 'QC'
	                   Contact Microsoft Product Support Services
	
	The error gives no line number indicating which line within the source
	code is causing the problem.
	
	Sample Code
	-----------
	
	1: double d = +.1 ;
	2:
	3: void main( void )
	4:     {
	5:     }
	
	The error can be avoided by not placing the unary plus before the ".1"
	in line 1: or by not using the /qc (quick compile) option.
	
	Since no source code line number is given in this error message, it
	can be quite difficult to track down this type of error. The error can
	occur almost anywhere in a program. A double variable need only be
	initialized at the time of declaration to a simple floating point
	number with a unary plus preceding it. This problem can occur in a
	global or local declaration.
	
	The following are suggested methods for tracking down the error:
	
	1. Search for all lines containing "double". This error occurs only
	   when the type specifier double is used.
	
	2. Comment out sections of code or break up the code into smaller
	   parts until you find the problem line.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
