---
layout: page
title: "Q47694: Structures Declared with Near, Far, Pascal, and Fortran"
permalink: /pubs/pc/reference/microsoft/kb/Q47694/
---

## Q47694: Structures Declared with Near, Far, Pascal, and Fortran

	Article: Q47694
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_C S_QuickC buglist2.20 buglist2.30
	Last Modified: 16-AUG-1989
	
	CodeView is unable to display elements of structures declared with the
	following keywords:
	
	   near
	   far
	   pascal
	   fortran
	
	Using ?? to display a structure yields the structure table with only
	one value inside. This value is the first element in the structure.
	Using w? or ? yields the following error message:
	
	   Operand types incorrect for this operation
	
	Microsoft has confirmed this to be a problem with CodeView Versions
	2.20 and 2.30. We are researching this problem and will post new
	information as it becomes available.
	
	To work around this problem, recompile without these keywords, or
	obtain the address of the structure element and put a watch on the
	memory location.
	
	Consider the following large model program:
	
	struct { int x;
	         int y;
	         int z;} near a;    /* or far, pascal, fortran */
	
	void main(void)
	{
	  a.x = 1;
	}
	
	To put a watch on a.x, you could issue the following commands:
	
	? &a
	0x0345:0000       <- result is the address of the structure
	ww 0x0345:0x0     <- address of x
	ww 0x0345:0x2     <- address of y (two byte int from x)
	
	This puts a watch on the first and second elements (x and y) in the
	structure.
