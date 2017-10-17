---
layout: page
title: "Q61310: /Ot May Generate Incorrect Code with Nested Conditionals"
permalink: /pubs/pc/reference/microsoft/kb/Q61310/
---

## Q61310: /Ot May Generate Incorrect Code with Nested Conditionals

	Article: Q61310
	Version(s): 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 29-MAY-1990
	
	When using the default optimization of -Ot with nested conditional
	expressions, the compiler may generate incorrect code if the
	conditionals are the same expression.
	
	The following code sample demonstrates the problem:
	
	#include <stdio.h>
	
	void main (void)
	{
	   int i;
	
	   for ( i = 0; i < 5; i++)
	      if (i < 5)
	         printf ("%d\n", i);
	}
	
	Output
	------
	
	   Actual  Expected
	   ------  --------
	
	     1       0
	     2       1
	     3       2
	     4       3
	             4
	
	Below are some suggested workarounds:
	
	1. Change "i < 5" in the above for loop, or change "i < 5" in the
	   above if statement to "i <= 4".
	
	2. Use -Od to disable optimization when compiling.
	
	3. Use the #pragma optimization ("t", off/on) statement to
	   disable/enable the default -Ot optimization before and after the
	   function.
	
	4. Use a combination of optimizations (for example, -Ox, -Olt, etc.).
	
	The problem is with the default -Ot optimization, in particular; when
	used by itself, the optimizer will generate incorrect code.
	
	In the above code sample, the compiler does not generate the
	instruction for the first comparison in the for loop (as shown below).
	This causes the instruction pointer to jump to location $FC176 the
	first time through the loop.
	
	The end result is the same as if "i" went from 1 to 4 instead of from
	0 to 4.
	         .
	         .
	         mov   WORD PTR [bp-2], 0
	$F166:
	         cmp   WORD PTR [bp-2], 5 ;<- This "cmp" is missing
	         jge   $FC167
	
	         push  WORD PTR [bp-2]
	         mov   ax, OFFSET DGROUP:$SG170
	         push  ax
	         call  _printf
	         add   sp,4
	$FC176:
	         inc   WORD PTR [bp-2]
	         cmp   WORD PTR [bp-2], 5
	         jl    $F166
	         .
	         .
	
	Microsoft has confirmed this to be a problem with C version 6.00 We
	are researching this problem and will post new information here as it
	becomes available.
