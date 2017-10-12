---
layout: page
title: "Q66923: _fastcall Code Generation Error with Shifted Operands"
permalink: /pubs/pc/reference/microsoft/kb/Q66923/
---

	Article: Q66923
	Product: Microsoft C
	Version(s): 6.00 6.00a  | 6.00 6.00a
	Operating System: MS-DOS      | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a fastcall
	Last Modified: 18-NOV-1990
	
	When using _fastcall, shifted immediate operands may be passed
	incorrectly. In the example below, the two parameters to be passed to
	the sub1() function are stored in ax and dx (per _fastcall
	convention). Because of a problem in the compiler, the correct values
	are not used in this case. As a workaround, either use the /Os
	optimization or assign the value to a temporary variable and pass that
	variable instead.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	int _fastcall sub1(int i, int j);
	
	long a=0x12345678;
	
	void main(void)
	{
	   int llama;
	
	   printf("%x\n",(int)(a>>15));
	   llama = sub1( (int)(a>>15), (int)(a>>15) );
	   printf("%x\n",llama);
	}
	
	int _fastcall sub1(int i, int j)
	{
	   printf("%x \t %x\n",i,j);
	   return(i);
	}
	
	In all optimizations except /Os and /Od, the compiler calculates the
	right-shift value correctly but passes the high-order two bytes of the
	result instead of the low-order two bytes. When compiled with /Od, the
	generated code correctly passes one variable but not the other.
	Finally, with the /Os optimization, a helper function performs the
	shift calculation and the correct values are passed in both cases.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
