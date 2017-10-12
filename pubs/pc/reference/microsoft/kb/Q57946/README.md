---
layout: page
title: "Q57946: An Example of a delay() Function in C 5.10 or QuickC 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q57946/
---

	Article: Q57946
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_C
	Last Modified: 7-MAR-1990
	
	The Microsoft C or QuickC run-time library does not include a delay()
	function. The sample code below demonstrates a function that could be
	used to generate a delay within a program.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <time.h>        /* needed for delay()    */
	
	void delay (clock_t ms); /* prototype for delay() */
	
	void main (void)
	{
	     puts("This is a test of a delay function.");
	
	     delay(5000);        /* 5 second delay        */
	
	     puts("Back from delay function.");
	}
	
	void delay (clock_t ms)
	{
	     clock_t stop;
	
	     stop = ms + clock();
	     while(stop > clock());
	}
	
	The delay() function generates a delay in milliseconds. For example,
	to have a 10 second delay, pass the value 10000 to the function.
