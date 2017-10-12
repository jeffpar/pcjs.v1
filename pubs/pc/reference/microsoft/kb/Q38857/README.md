---
layout: page
title: "Q38857: "Invalid Object Module" with Indirection Problem"
permalink: /pubs/pc/reference/microsoft/kb/Q38857/
---

	Article: Q38857
	Product: Microsoft C
	Version(s): 1.00 1.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00 buglist1.01
	Last Modified: 13-DEC-1988
	
	QuickC Versions 1.00 and 1.01 generate an "L1101: Invalid Object
	Module" when a program containing a statement of the following syntax
	is placed into a program, and the program is compiled inside of the
	environment (regardless of warning level):
	
	#include <stdio.h>
	
	char greeting = "hello";
	
	main()
	 {
	 }
	
	The program will appear to compile correctly, however, it should be
	generating the following warning:
	
	   Warning C4047: 'initializing': different levels of indirection
	
	Microsoft has confirmed this to be a problem in Versions 1.00 and 1.01.
	We are researching this problem and will post new information as it
	becomes available.
	
	This confusing lack of any compile-time warning only occurs inside of
	the QuickC environment. If the linker version is correct, and you
	suspect that this is the problem, quit QuickC and compile on a QCL or
	CL command line. If there is an indirection problem, either of the
	command line drivers will generate the above warning message at
	Warning Level 1 or above. The QCL driver will also generate the
	"Invalid Object Module" error at link time, in addition to the
	indirection warning. The CL driver will generate the correct
	indirection warning, then link successfully.
	
	To correct the error, modify your code in one of the following two
	ways:
	
	char greeting[5]="hello";
	char* greeting="hello";
	
	The program should then compile and link successfully.
