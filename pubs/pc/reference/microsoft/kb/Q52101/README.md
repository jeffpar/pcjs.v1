---
layout: page
title: "Q52101: /Zr Generates Error When Assigning to Video Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q52101/
---

## Q52101: /Zr Generates Error When Assigning to Video Memory

	Article: Q52101
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 17-JAN-1990
	
	Question:
	
	Why does the following code generate run-time error R6013 (illegal far
	pointer use) for the second reference to farptr, but not the first,
	when compiled with /Zr or when compiled within the QuickC environment
	with pointer checking turned on?
	
	Sample Code
	-----------
	
	void main(void)
	{
	    int far *farptr;
	    int n=0;
	    farptr=(int far *)0xb8000000lu;
	    *(farptr+n)=177 | 0x0700; /* no error */
	    n=12;
	    n -= 11;
	    *farptr=178 | 0x0700;      /* error  */
	}
	
	Response:
	
	This is expected behavior from the /Zr option.
	
	The code generated for pointer checking (/Zr) checks for out-of-range
	pointers. As farptr is pointing to segment b800 (video memory), it
	assumes that this is an error because b800 is larger than the variable
	__asegh, which is defined as the highest segment in memory owned by
	the program.
	
	This variable gets updated if an _fmalloc, for example, allocates a
	new segment higher than __asegh. When an assignment is made, for
	instance "farptr=0xb8000000", __asegh is not modified.
	
	Therefore, when the pointer assignment is made and the code is
	generated to check for invalid pointers, the compiler thinks that this
	pointer is invalid, since its segment (0xb800) is greater than
	__asegh.
	
	To use this code, you need to compile without /Zr (or turn off pointer
	checking in the environment) when assigning pointers to memory higher
	than the value __asegh. (Similarly, __aseglo marks the lowest segment
	in use in memory.) This is valid code.
	
	The pointer checking does not have any effect on the line *(farptr+n)
	in the code because, since QuickC is a one pass compiler, QuickC
	recognizes this line as one of incremental nature; its purpose in this
	case is to increment the pointer. Due to the precedence of the "()"
	over the "*" operator, and since this is a line of incremental nature,
	QuickC does not generate the code to check the segment and offset with
	_asegh and _aseglo.
	
	It does generate the correct code to make the assignment; however, it
	is too late to then generate the code for the segment:offset checking.
