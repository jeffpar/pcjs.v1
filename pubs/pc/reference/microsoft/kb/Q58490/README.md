---
layout: page
title: "Q58490: Variable Arguments of Type CHAR Incorrectly Retrieved"
permalink: /pubs/pc/reference/microsoft/kb/Q58490/
---

## Q58490: Variable Arguments of Type CHAR Incorrectly Retrieved

	Article: Q58490
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | s_quickc buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 19-JAN-1991
	
	If a procedure with variable parameters uses either va_start or va_arg
	on a variable of type CHAR, all subsequent parameters retrieved with
	va_arg will return an incorrect value.
	
	Below there are two separate discussions, one for the workaround, and
	one for a description of the problem.
	
	Discussion of the Workaround
	----------------------------
	
	The following program illustrates the problem:
	
	#include <stdio.h>
	#include <stdarg.h>
	
	#define VA_START_CHAR(ap,v) (ap) = ((va_list) (&v) + sizeof (int))
	
	void main (void) ;
	void foo  (int, ...) ;
	void goo  (char, ...) ;
	
	void main (void)
	{
	    int x = 3 ;
	    char j = 'f' ;
	
	    foo (5, j, x) ;
	    goo (j, 5, x) ;
	}
	
	void foo (int s, ...)
	{
	    char c ;
	    int  i ;
	
	    va_list arg_marker ;
	
	    va_start (arg_marker, s) ;
	
	    c = va_arg (arg_marker, char) ;
	    i = va_arg (arg_marker, int) ;
	
	        printf ("FOO (%d, %c, %d)\n", s, c, i) ;
	
	        va_start (arg_marker, s) ;
	
	        c = (char) va_arg (arg_marker, int) ;
	        i = va_arg (arg_marker, int) ;
	
	        printf ("FOO (%d, %c, %d)\n\n", s, c, i) ;
	}
	
	void goo (char s, ...)
	{
	    int  i, i2 ;
	
	    va_list arg_marker ;
	
	    va_start (arg_marker, s) ;
	
	    i = va_arg (arg_marker, int) ;
	    i2 = va_arg (arg_marker, int) ;
	
	        printf ("GOO (%c, %d, %d)\n", s, i, i2) ;
	
	        VA_START_CHAR (arg_marker, s) ;
	
	        i = va_arg (arg_marker, int) ;
	        i2 = va_arg (arg_marker, int) ;
	
	        printf ("GOO (%c, %d, %d)\n", s, i, i2) ;
	
	}
	
	The output of the program is as follows:
	
	FOO (5, f, 768)
	FOO (5, f, 3)
	
	GOO (f, 1280, 768)
	GOO (f, 5, 3)
	
	The program shows both the typical way to retrieve variable arguments,
	and a way around the problem with a variable of type CHAR.
	
	If a function has a type CHAR as being one of the variable arguments
	and attempts to retrieve it with a call to va_arg (arg_marker, char),
	the correct value will be returned. Unfortunately, the arg_marker is
	incremented to an incorrect value. The next time that a variable is
	referenced off of arg_marker, va_arg will return an incorrect value.
	
	An easy way around this is to have va_arg return an INT, then just
	typecast the return value of va_arg to a CHAR.
	
	The function foo demonstrates both ways of retrieving arguments and,
	as you can see from the output, using the INT and then typecasting
	that value to a CHAR does work.
	
	A second problem with variable arguments and variables of type CHAR is
	when the first argument (the one actually defined) is of type CHAR. A
	call to va_start is supposed to set arg_marker to the next parameter.
	Again, arg_marker is set to an incorrect value. Any subsequent calls
	to va_arg will return an incorrect value.
	
	One way around this is to redefine va_start to the following macro:
	
	   #define VA_START_CHAR(ap,v)     (ap) = ((va_list) (&v) + sizeof (int))
	
	This works in the special case of a CHAR as being the value that you
	are attempting to set the frame reference (arg_maker in the program
	and ap in the macro) relative to. It also works if the type sent is an
	INT.
	
	Discussion of the Problem (Description of the Problem)
	------------------------------------------------------
	
	All CHAR values are pushed onto the stack in two bytes, rather than
	one. In STDARG.H, both va_start and va_arg use a sizeof operation to
	decide how much to move the frame reference. Because sizeof returns a
	1 (one) for a type CHAR and the value actually takes two bytes on the
	stack, va_start initializes the frame reference incorrectly, and
	va_arg increments the frame reference incorrectly.
	
	When we force va_start to use a type INT, it moves the frame reference
	to the correct position, and when we use an INT in va_arg, it forces
	the frame reference to be incremented by the correct amount.
