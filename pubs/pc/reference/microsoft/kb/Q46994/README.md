---
layout: page
title: "Q46994: Internal Compiler Error: grammar.c:1.29, Line 108"
permalink: /pubs/pc/reference/microsoft/kb/Q46994/
---

	Article: Q46994
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1989
	
	The program below generates the following error when compiled with the
	default command line options under the Microsoft C Optimizing Compiler
	Version 5.10:
	
	   func.c(11) : fatal error C1001: Internal Compiler Error
	                   (compiler file '@(#)grammar.c:1.29', line 108)
	                   Contact Microsoft Technical Support
	
	Compiling the following program demonstrates the error:
	
	#include <stdio.h>
	
	double fctn( void )
	{;}
	
	double( *call[] )( void ) = { fctn };
	
	void main( void )
	{
	    printf("%lf\n", call[0]() );
	}
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
	
	To eliminate the problem, the printf() statement can be broken up into
	two statements, thereby making the function call and assigning it to a
	temporary double variable in one statement, then printing that
	variable in a second statement. The following code exemplifies this:
	
	#include <stdio.h>
	
	double fctn( void )
	{;}
	
	double( *call[] )( void ) = { fctn };
	
	void main( void )
	{
	    double temp;
	
	    temp = call[0]();
	    printf("%lf\n", temp );
	}
