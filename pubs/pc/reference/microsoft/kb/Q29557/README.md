---
layout: page
title: "Q29557: Precision of Floating Point Numbers with printf()"
permalink: /pubs/pc/reference/microsoft/kb/Q29557/
---

	Article: Q29557
	Product: Microsoft C
	Version(s): 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	The printf() function defaults to six digits of precision when
	displaying floating point numbers, even when the value displayed is a
	double precision number.
	
	To see more precision, use the precision field in the following
	printf() format specification:
	
	   %[flags][width][.precision]
	
	The following program demonstrates what appears to be a problem in
	printf(), but is actually documented behavior that is described in the
	online help and run-time library references for printf():
	
	   #include <stdio.h>
	
	   main()
	   {
	       double d = 1.2345678912;
	
	       printf("%e\n", d);
	       printf("%le\n", d);
	   }
	
	The following is the output from this program:
	
	   1.234568e+000
	   1.234568e+000
	
	This may seem incorrect because the double variable d actually has 10
	digits of accuracy after the decimal place. However, the documentation
	for printf() states that default precision is 6 decimal places.
	
	To see the full precision of this number, you should use the following
	line of code:
	
	   printf("%.15le",d);
