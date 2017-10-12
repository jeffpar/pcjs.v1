---
layout: page
title: "Q61312: Internal Compiler Error: '@(#)regMD.c:1.100', Line 3074"
permalink: /pubs/pc/reference/microsoft/kb/Q61312/
---

	Article: Q61312
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 11-JUL-1990
	
	The program example below generates the following C1001: error when
	compiled with only the following individual optimizations:
	
	   /Oa /Oc /Oi /On /Op /Or /Os /Ot /Ow /Oz
	
	   foo.c(24) : fatal error C1001: Internal Compiler Error
	         (compiler file '@(#)regMD.c:1.100', line 3074)
	         Contact Microsoft Product Support Services
	
	Code Example
	------------
	
	typedef struct
	{
	   short cursize;      /* The current size of this buffer. */
	   short nextscan;     /* The offset of the next scan entry.*/
	} struct1;
	
	typedef struct
	{
	   short len;          /* Buffer entry length */
	} struct2;
	
	void main(void)
	{
	   char far *cfptr1;
	   char far *cfptr2;
	   struct1 far *s1ptr;
	   struct2 far *s2ptr;
	   short    lenToMove;
	
	   s1ptr = (struct1 far *) cfptr1;
	   cfptr2 = (char far *) s2ptr + s2ptr->len;
	   lenToMove = s1ptr->cursize - (short)((long)cfptr2 - (long)cfptr1);
	
	   if ((cfptr1 + s1ptr->nextscan) >= cfptr2) // Line 24
	   s1ptr->nextscan -= s2ptr->len;
	}
	
	If only the above optimizations are used to compile the program, the
	internal compiler error (ICE) will occur. However, if ONE option from
	the following list is added, the ICE will not occur:
	
	 /Od /Oe /Og /Ol /Ox
	
	In addition, the following are several other workarounds that can be
	applied to the code itself:
	
	1. Use temporary variables to hold the intermediate results before the
	   "if" statement.
	
	2. Make a function call between any of the assignment statements.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
