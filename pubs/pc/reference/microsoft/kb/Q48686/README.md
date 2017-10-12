---
layout: page
title: "Q48686: How to Find the Total Stack Size from within a Program"
permalink: /pubs/pc/reference/microsoft/kb/Q48686/
---

	Article: Q48686
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G890831-26299
	Last Modified: 16-JAN-1990
	
	Question:
	
	How can I find the total size of the stack from within my program?
	
	Response:
	
	The program below calculates the total size of the stack. Note that
	this works slightly differently for protected-mode and bound programs
	than for real-mode programs. (Normally, the two-byte difference
	shouldn't be important.)
	
	The symbol "_end" is declared just below the lowest location in the
	stack. At any given time, the amount of space left on the stack is SP
	- offset _end. (The C program doesn't use the underscore because C
	automatically prepends an underscore to all identifiers.)
	
	The start-up code stores the maximum (initial) value of SP in the
	variable __atopsp. (The program below uses only one underscore rather
	than two for the reason described in the previous paragraph.)
	
	Default stack checking on function entry fails when the amount left is
	less than 256 bytes for DOS, or less than 512 bytes for OS/2. When
	stack checking fails, you receive the following run-time error:
	
	   run-time error R6000
	   - stack overflow
	
	The program to calculate the total stack size follows:
	
	#include <stdio.h>
	
	extern unsigned int end;
	
	extern unsigned int _atopsp;
	
	void main(void)
	{
	    unsigned stksize;
	
	    stksize = _atopsp - (unsigned)&end + 2;
	        /* don't add 2 for protected-mode or bound programs */
	
	    printf("Total stack size is %u bytes (%x hex bytes)\n",
	        stksize, stksize);
	}
