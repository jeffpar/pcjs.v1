---
layout: page
title: "Q39783: Example of Using Formatting with _outtext"
permalink: /pubs/pc/reference/microsoft/kb/Q39783/
---

	Article: Q39783
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC
	Last Modified: 29-DEC-1988
	
	When programming with the Microsoft graphics library, the printf
	function can be used, but it is not recommended. Instead, to do any
	desired formatting, the _outtext function should be used with a prior
	call to sprintf. You should not mix printf() calls with _outtext()
	calls.
	
	The user-defined _outtextf function demonstrated in the program below
	performs formatting and printing in one function. This function
	simplifies conversion of non-Microsoft C graphics-compatible source
	code to Microsoft-compatible code. An intelligent text editor could
	simply do a global search and replace "printf" to "_outtextf".
	
	This following program defines and demonstrates the function "_outtextf":
	
	#include <stdio.h>
	#include <graph.h>
	#include <stdarg.h>
	
	int _outtextf (char *format,...);
	void main (void);
	
	void main (void)
	 { /* Clear the screen and display "Hello, world #87!" */
	   _clearscreen (_GCLEARSCREEN);
	   _outtextf ("Hello, %s #%d!","world",87);
	 }
	
	int _outtextf (char *format,...)
	 { va_list arglist;
	   char buffer[150]; /*Must be large enough to hold formatted string*/
	   int retval;
	
	   va_start (arglist,format);
	   retval = vsprintf(buffer,format,arglist);
	   va_end (arglist);
	
	   _outtext (buffer);
	   return (retval);
	 }
