---
layout: page
title: "Q42469: FOR...NEXT with Floating-Point Counter May Not Execute Fully"
permalink: /pubs/pc/reference/microsoft/kb/Q42469/
---

## Q42469: FOR...NEXT with Floating-Point Counter May Not Execute Fully

	Article: Q42469
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890301-38 B_BasicCom
	Last Modified: 15-DEC-1989
	
	Because of the nature of the IEEE floating-point format, using a
	floating-point counter (single or double precision) in a FOR NEXT loop
	can result in the loop being executed one fewer time than anticipated.
	Using an integer or long integer instead of floating point for the
	loop counter is the only way to guarantee that all iterations will
	execute.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	The following is an example:
	
	   DEFSNG A-Z
	   FOR x = 0 to .8 step .2
	     PRINT x" ";
	   NEXT x
	
	This will generate the following results:
	
	   0 .2 .4 .600000000000001
	
	Note that due to the rounding error in the fourth value, the loop
	counter will be greater than .8 on the next iteration, and the loop
	will execute only four times instead of the expected five times.
	
	This IEEE rounding behavior occurs in Microsoft QuickBASIC Versions
	4.00, 4.00b, and 4.50, in the BASIC compiler Versions 6.00 and 6.00b,
	and in BASIC PDS 7.00.
	
	In most cases, the rounding differences will be minimal when the
	variables and numbers involved are double precision. Changing the
	first line of the example program to the following will allow the loop
	to properly execute five times:
	
	   DEFDBL A-Z
