---
layout: page
title: "Q43217: QuickC: MATH.C Sample Program Contains Incorrect Expressions"
permalink: /pubs/pc/reference/microsoft/kb/Q43217/
---

## Q43217: QuickC: MATH.C Sample Program Contains Incorrect Expressions

	Article: Q43217
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_c docerr
	Last Modified: 6-JUN-1989
	
	The sample program MATH.C found in the QuickC Version 2.00 on-line
	help system contains the following two statements, which do
	not produce the intended results:
	
	   printf( "Mantissa: %2.2lf\tExponent: %d\n", frexp( x, &n ), n );
	   printf( "Fraction: %2.2lf\tInteger: %lf\n", modf( x, &y ), y );
	
	The last parameter passed to printf() in each of these statements will
	not be displayed correctly when the program is compiled under QuickC
	because "n" and "y" are pushed onto the stack before they are altered
	in the calls to frexp() and modf().
	
	This example illustrates the danger of relying upon the order of
	expression evaluation. When compiled under Microsoft C 5.10 with
	default optimizations or optimizations disabled, these statements
	function as desired; that is, n and y are altered by frexp() and
	modf() before they are pushed onto the stack and displayed by
	printf(). When compiled under C 5.10 with maximum optimization,
	however, the statements will be pushed before being changed, just as
	in QuickC.
	
	Correcting this problem is simply a matter of ensuring that frexp()
	and modf() execute prior to the use of n and y, as follows:
	
	   double r;
	
	   r = frexp( x, &n );
	   printf( "Mantissa: %2.2lf\tExponent: %d\n", r, n );
	   r = modf( x, &y );
	   printf( "Fraction: %2.2lf\tInteger: %lf\n", r, y );
	
	The MATH.C program is associated with the following functions:
	
	   exp     pow      sqrt     frexp     log     log10
	   ldexp   modf     ceil     floor     fabs    fmod
