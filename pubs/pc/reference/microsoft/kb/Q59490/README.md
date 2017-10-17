---
layout: page
title: "Q59490: Errors When Space Exists Between Macro Name and Parameters"
permalink: /pubs/pc/reference/microsoft/kb/Q59490/
---

## Q59490: Errors When Space Exists Between Macro Name and Parameters

	Article: Q59490
	Version(s): 4.x 5.00 5.10 | 5.10
	Operating System: MS-DOS        | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 17-DEC-1990
	
	If you put a space between a macro name and the left parenthesis that
	begins the parameter list for a macro, you will receive multiple
	compiler errors because the preprocessor is designed to accept any
	code after the first space after the macro name as the code definition
	for the macro.
	
	Sample Code
	-----------
	
	#define incr (x) x+1      /* Change to incr(x) to correct. */
	#include <stdio.h>
	
	void main ( void )
	{
	    int f1, f2;
	
	    f2 = 0 ;
	
	    f1 = incr(f2);
	
	    printf ( "%d %d ", f1, f2 ) ;
	}
	
	Compiling this program under C Versions 4.x, 5.00, and 5.10, or QuickC
	Version 1.00, 1.01, 2.00, or 2.01, returns the following error
	messages:
	
	   macro.c
	   macro.c(10) : error C2065: 'x' : undefined
	   macro.c(10) : error C2146: syntax error : missing ';' before
	                 identifier 'x'
	   macro.c(10) : error C2064: term does not evaluate to a
	                 function
	
	Removing the space between the macro name and the left parenthesis
	eliminates the errors.
	
	The following error and warning messages are returned by C Version
	6.00 under warning level 2 and above:
	
	   macro.c
	   macro.c(10) : error C2065: 'x' : undefined
	   macro.c(10) : error C2146: syntax error : missing ';'
	                 before identifier 'x'
	   macro.c(10) : error C2064: term does not evaluate to a
	                 function
	   macro.c(10) : warning C4071: 'function through ptr' : no
	                 function prototype given
