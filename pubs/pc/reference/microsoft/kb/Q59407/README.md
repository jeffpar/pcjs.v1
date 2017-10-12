---
layout: page
title: "Q59407: Inaccurate Representation of Large Double Values"
permalink: /pubs/pc/reference/microsoft/kb/Q59407/
---

	Article: Q59407
	Product: Microsoft C
	Version(s): 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 15-APR-1990
	
	Subtracting double values greater than or equal to 1.0E+025 may return
	inaccurate results. This is expected behavior and is due to the
	imprecise nature of floating-point math. Anytime floating-point math
	uses large numbers, there will be rounding/truncation errors and
	errors introduced due to imprecise representation of a result in
	binary format.
	
	Since double values are only 15-digit precise, simple subtraction of
	two large numbers can give unexpected results. The following sample
	code demonstrates this behavior.
	
	Double values less than 1.0E+25 may not experience the same problem.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	double a = 1E+28, tmp = 9E+28;
	
	void main (void)
	{
	
	   printf ("a = %le    tmp = %le\n", a, tmp);
	
	   while (tmp >= 1E+25) {
	      tmp -= a;
	      printf ("a = %le    tmp = %le\n", a, tmp);
	   }
	}
	
	The above sample code produces the following output:
	
	a = 1.000000e+028    tmp = 9.000000e+028
	a = 1.000000e+028    tmp = 8.000000e+028
	a = 1.000000e+028    tmp = 7.000000e+028
	a = 1.000000e+028    tmp = 6.000000e+028
	a = 1.000000e+028    tmp = 5.000000e+028
	a = 1.000000e+028    tmp = 4.000000e+028
	a = 1.000000e+028    tmp = 3.000000e+028
	a = 1.000000e+028    tmp = 2.000000e+028
	a = 1.000000e+028    tmp = 1.000000e+028
	a = 1.000000e+028    tmp = 1.319414e+013
