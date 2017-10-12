---
layout: page
title: "Q63058: Function Prototype with Undefined Structure Causes Error"
permalink: /pubs/pc/reference/microsoft/kb/Q63058/
---

	Article: Q63058
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1990
	
	A function prototype, which is defined using an undeclared structure
	in C version 6.00, will give the following error message:
	
	   error C2079: 'Formal' uses undefined struct/union '<union name>'
	
	In C 5.10, the same program (assuming the structure is defined
	sometime before the function itself is defined) will compile without
	any errors or warnings.
	
	Sample Code
	-----------
	
	#include "stdio.h"
	
	// prototype
	
	void ItFunc(struct s);
	
	// the struct itself
	
	struct s
	{
	   int x;
	   int y;
	};
	
	void ItFunc(xstruct)
	struct s xstruct;
	{
	  printf("in the function\n");
	}
	
	For this code to compile correctly in C 6.00, the structure definition
	should appear before the function prototype.
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
