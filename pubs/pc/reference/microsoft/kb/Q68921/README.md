---
layout: page
title: "Q68921: Using float/double Function as Subscript May Cause Bad Code"
permalink: /pubs/pc/reference/microsoft/kb/Q68921/
---

## Q68921: Using float/double Function as Subscript May Cause Bad Code

	Article: Q68921
	Version(s): 6.00a  | 6.00a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 6-FEB-1991
	
	Multiple calls to float functions in the same logical statement may
	cause the floating-point accumulator to be overwritten if the result
	of one of the calls is used as a subscript.
	
	In the sample code below, "fone" returns "0.0" in the floating-point
	accumulator. However, the floating-point accumulator is not saved
	before "ftwo" is called. The function "ftwo" returns "12.0" in the
	floating-point accumulator, which overwrites the "0.0" returned by
	"fone". As a result, array[12] is changed, instead of array[0]. As a
	workaround, the function's return value may be stored in a temporary
	variable, or the two functions may be declared as "pascal".
	
	This behavior occurs only when using the Microsoft C Optimizing
	Compiler, under all optimizations and all memory models. The code
	performs as expected using QuickC or compiling with the "/qc" option.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	float fone(void);
	float ftwo(void);
	
	float goo[20];
	
	void main(void)
	{
	int   i;
	
	// This doesn't work.
	   goo[(int)fone()] = ftwo();
	   printf("goo[0] (should equal 12.0) = %f\n",goo[0]);
	
	// This works.
	   i = (int)fone();
	   goo[i] = ftwo();
	   printf("goo[0] (should equal 12.0) = %f\n",goo[0]);
	}
	
	float fone()
	{
	   return((float)0.0);
	}
	
	float ftwo()
	{
	   return((float)12.0);
	}
	
	Microsoft has confirmed this to be a problem in Microsoft C versions
	6.00 and 6.00a. We are researching this problem and will post new
	information here as it becomes available.
