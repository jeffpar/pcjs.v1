---
layout: page
title: "Q67079: Error C2141 When Initializing enum Constant to -32768"
permalink: /pubs/pc/reference/microsoft/kb/Q67079/
---

## Q67079: Error C2141 When Initializing enum Constant to -32768

	Article: Q67079
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | S_QUICKC buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 4-DEC-1990
	
	Although the range of values for an enum constant should be the same
	as that for signed integer constants, the Microsoft C and QuickC
	compilers do not allow a value of -32768 to be used as an initializer
	for an enum constant.
	
	-32767 (Ox8000) is the largest negative number that will fit into a
	16-bit signed integer. The compilers will allow this value to be used
	as an integer constant. If you try to use this value to initialize an
	enum constant, the compilers will generate the following error
	message:
	
	    error C2141: value out of range for enum constant
	
	The sample program below demonstrates this limitation. Uncommenting
	the "Hex8000" line and compiling will result in the C2141 error above.
	
	Microsoft has confirmed this to be a problem in C versions 5.10, 6.00,
	and 6.00a and QuickC versions 2.00, 2.01, 2.50, and 2.51 (buglist2.00,
	buglist2.01, buglist2.50, and buglist2.51). We are researching this
	problem and will post new information here as it becomes available.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	int MaxNegative = 1 << 15;       // -32768 : this works for int
	
	enum {
	       Hex4000 =  1 << 14,       //  16384 : this works for enum
	       Hex7FFF = (1 << 15) - 1,  //  32767 : this is ok for enum
	//     Hex8000 =  1 << 15        // -32768 : this fails for enum
	     };
	
	void main(void)
	{
	    printf("\nHex4000 = %d\n", Hex4000);
	    printf("Hex7FFF = %d\n", Hex7FFF);
	    printf("MaxNegative = %d\n", MaxNegative);
	}
