---
layout: page
title: "Q66217: Pascal Modifier Might Generate Bogus Warning C4059"
permalink: /pubs/pc/reference/microsoft/kb/Q66217/
---

## Q66217: Pascal Modifier Might Generate Bogus Warning C4059

	Article: Q66217
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-OCT-1990
	
	In certain cases, the use of the Pascal modifier on a function will
	generate the following warning incorrectly:
	
	   test.c(18): warning C4059: segment lost in conversion
	
	The following code, when compiled using "cl /W2 /c test.c" will
	generate the C4059 warning:
	
	Code Example
	------------
	
	#include <stdio.h>
	
	struct s {int i,j,k,l; };
	
	struct s Pascal foo(void)
	{
	struct s b = {1, 2, 3, 4};
	
	    return b;
	}
	
	void foobar(struct s b)
	{
	    printf("%d %d %d %d\n", b.i, b.j, b.k, b.l);
	}
	
	void main () {
	   foobar(foo());              /* this line causes warning C4059 */
	}
	
	This warning should not be generated for the above code. The problem
	occurs if you call a function that takes a structure as an argument
	with a procedure that returns a structure and is declared with the
	Pascal modifier, as in the above example. The problem does not occur
	with C 5.10.
	
	Although the warning is intended to flag a possible problem, the
	warning is not valid and the compiler generates the correct code in
	the above situation. Note that the code is incorrect only if /Au or
	/Aw are used.
	
	The warning goes away if you do one of the following:
	
	1. Compile with the /qc option. This uses the quick compiler rather
	   than the full optimizing compiler.
	
	2. Remove the Pascal modifier from line 3.
	
	3. Compile in compact or large memory models (/AC or /AL).
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
