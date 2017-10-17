---
layout: page
title: "Q51615: C4056: Overflow in Constant Arithmetic"
permalink: /pubs/pc/reference/microsoft/kb/Q51615/
---

## Q51615: C4056: Overflow in Constant Arithmetic

	Article: Q51615
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1990
	
	The following code, when compiled at warning level 1 or greater,
	causes the Microsoft C 5.10 optimizing compiler to produce warning
	C4056:
	
	   test.c(5) : warning C4056: overflow in constant arithmetic
	
	This warning occurs because the compiler is reordering the addition of
	the unsigned constants. This practice is no longer allowed according
	to the ANSI standard.
	
	To work around the problem, perform the arithmetic using long integer
	constants where necessary (use 65535L rather than 65535u, for
	example).
	
	QuickC Versions 2.00 and 2.01 handle this code correctly because these
	versions conform to more recent releases of the draft ANSI standard.
	
	The following is the code that produces the error:
	
	   void
	   test ( unsigned dummy )
	   {
	       dummy = 65535u - (dummy - 1);
	   }
