---
layout: page
title: "Q46749: Some Causes of Differences in Floating-Point Results"
permalink: /pubs/pc/reference/microsoft/kb/Q46749/
---

## Q46749: Some Causes of Differences in Floating-Point Results

	Article: Q46749
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G890124-10419
	Last Modified: 25-JUL-1989
	
	This article discusses some reasons why programs might produce
	different floating-point results when compiled with different compiler
	options.
	
	The program below produces different results when complied using
	
	   cl -AM -FPi prog.c
	
	than when using the following:
	
	   cl -AM -FPa prog.c
	
	Part of the reason for these differences is that /FPa and /FPi
	generate math routines that work differently. /FPi math emulates the
	80x87, to the point of actually converting 8-byte doubles to 10-byte
	internal format and doing the math in internal format. /FPa uses an
	8-byte format for calculations; therefore, it is less accurate. This
	often accounts for differences in results.
	
	Also of special interest is the fact that the second number printed in
	the /FPi case is smaller than DBL_MIN, as defined in FLOAT.H. This
	situation is also correct because DBL_MIN is the smallest possible
	NORMALIZED value. (Normalized means that the high-order bit of the
	mantissa is a one.)
	
	"Denormals" (numbers where there are zeros in some of the high-order
	bits of the mantissa), however, can represent numbers "x" in the
	ranges + DBL_MIN > x > 0 and 0 > x > -DBL_MIN. Although this is an
	unusual situation, it is not an error. Although it is less precise
	than a normalized number, a denormal is still more precise than 0
	(zero) (which is the next best representation). By allowing use of
	denormal numbers, we make our floating-point result slightly more
	accurate. The alternate math library (/FPa) represents denormal
	numbers as 0 (zero).
	
	There is a good explanation of floating point exceptions (including
	the denormal exception, which is always masked) in the FPEXCEPT.DOC
	file that comes with the C compiler. For more detailed background, see
	the Intel "80387 Programmer's Reference Manual."
	
	Another possible cause of differences in floating-point results is the
	inclusion or omission of the /Op option. When /Op is omitted, the
	compiler may skip storing intermediate results as 64-bit objects in
	memory, leaving them instead in the 80-bit registers of the 80x87 (or
	emulator package). This increases the speed and accuracy of the
	calculation. However, this can decrease the consistency of the
	calculations because other intermediate results may have been stored
	in 64-bit objects in memory anyway. Including /Op forces all
	intermediate results to be stored in memory, giving more consistent
	results. This option is often handy in programs involving complicated
	floating-point calculations.
	
	The program and its output follow:
	
	#include <stdio.h>    // START OF PROG.C
	#include <float.h>
	
	main()
	{
	    double  a,d,c,prod1,prod2;
	
	    _fpreset();
	    a=9.5788979e-283;
	    b=8.050847e-1;
	    c=9.5588526e-28;
	
	    prod1=a*b;
	    printf("\n product1 = %1.15le \n",prod1);
	    prod2=c*prod1;
	    printf("\n product2 = %1.15le \n",prod2);
	
	}  // END OF PROG.C
	
	 // RESULTS OBTAINED USING CL -AM -FPi  PROG.C
	
	 product1 = 7.711824142152130e-283
	
	 product2 = 7.371619025195353e-310 // This value is less than DBL_MIN
	
	 // RESULTS OBTAINED USING CL -AM -FPa PROG.C
	
	 product1 = 7.711824142152130e-283
	
	 product2 = 0.000000000000000e+000
