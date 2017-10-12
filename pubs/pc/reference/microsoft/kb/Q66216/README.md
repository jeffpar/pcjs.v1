---
layout: page
title: "Q66216: Loop Optimizations May Generate Bad Code on Nested Loops"
permalink: /pubs/pc/reference/microsoft/kb/Q66216/
---

	Article: Q66216
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 24-OCT-1990
	
	The code below illustrates a problem in using loop optimizations with
	nested loops.
	
	With loop optimizations disabled, the compiler calculates the value of
	x for each iteration of the loop and produces the correct result.
	
	When loop optimizations are turned on, the compiler initializes the
	value of x and subtracts it by 10 on each loop iteration. The problem
	occurs here with the miscalculation of x when variable i increments.
	
	Workaround
	----------
	
	The only workaround is to compile without loop optimizations, which
	can be done in the following ways:
	
	1. Do not use the /Ol option.
	
	2. Insert the #pragma optimize statement in the code to turn off loop
	   optimization for the particular function.
	
	Microsoft has confirmed this to be a problem in C version 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	#include<stdio.h>
	
	void main(void)
	{
	     int i, j, x;
	
	     for (i=0; i<2; i++)
	     {
	          for (j=0; j<4; j++)
	          {
	               x=(i*4+3-j)*10;
	               printf("%d\n", x);
	          }
	     }
	}
	
	The following table demonstrates the output when the code above is
	compiled with and without loop optimizations:
	
	   Correct Output Without /Ol     Incorrect Output with /Ol
	   --------------------------     -------------------------
	
	      30                             30
	      20                             20
	      10                             10
	       0                              0
	      70                             -10
	      60                             -20
	      50                             -30
	      40                             -40
