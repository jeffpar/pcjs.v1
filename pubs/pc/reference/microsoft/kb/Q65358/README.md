---
layout: page
title: "Q65358: C 6.00 Incorrectly Evaluates Pointer Arrays to Constant Data"
permalink: /pubs/pc/reference/microsoft/kb/Q65358/
---

	Article: Q65358
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc buglist6.00
	Last Modified: 17-DEC-1990
	
	When an array of pointers to constant data is declared, the C version
	6.00 and QuickC versions 2.50 and 2.51 compilers incorrectly consider
	both pointers and data to be constant.
	
	The following sample code demonstrates the problem:
	
	void main(void)
	{
	 const int *p[1];
	 const int Z = 0;
	
	 p[0] = &Z;
	}
	
	When the sample code is compiled, the following two errors are
	produced:
	
	   warning C4132: 'p': const object should be initialized
	
	   error C2166: lvalue specifies const object
	
	Only the data should be constant in this case. The compiler considers
	the pointers to be constant, which is in error, and does not allow
	their value to be changed.
	
	Microsoft has confirmed this to be a problem with the Microsoft C
	Compiler version 6.00. We are researching this problem and will post
	new information here as it becomes available.
