---
layout: page
title: "Q57586: Float Data Type May Cause Problems in TSR Applications"
permalink: /pubs/pc/reference/microsoft/kb/Q57586/
---

## Q57586: Float Data Type May Cause Problems in TSR Applications

	Article: Q57586
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 26-FEB-1990
	
	The following TSR (terminate and stay resident) interrupt handler does
	not execute properly when invoked. The floating point values produced
	are invalid. If you change the data type "float" to "double", the
	problem disappears.
	
	Code Example
	------------
	
	#include <stdio.h>
	#include <conio.h>
	#include <math.h>
	#include <dos.h>
	
	void foo (void);
	void interrupt far myint (void);
	void main (void);
	
	/* Change the next line of code to "double a = 10.0"
	   and the problem will go away. */
	float a = (float) 10.0;
	
	void foo (void)
	   {
	   cprintf("The sqrt of %lf is %lf.\n\r",(double) a,sqrt((double) a));
	   }
	
	void interrupt far myint (void)
	   {
	   foo();
	   }
	
	void main (void)
	   {
	   foo();
	   _dos_setvect (0x65, myint);
	   _dos_keep (0, 2000);
	   }
	
	The above program is a TSR interrupt handler for INT 65h, which prints
	out the values 10.0 and sqrt(10.0) to the console when invoked. To see
	the problem with the above program, follow these steps:
	
	1. Compile with the large memory model (/AL), and run.
	
	2. Invoke interrupt 65h through the DOS DEBUG.EXE utility, as follows:
	
	   a. debug  Press ENTER.
	
	   b. a      Press ENTER.
	
	   c. int 65 Press ENTER.
	
	   d. ret    Press ENTER.
	
	   e. Press ENTER.
	
	   f. g      Press ENTER.
	
	   g. q      Press ENTER.
	
	The problem disappears if you change the variable "a" from type
	"float" to type "double".
