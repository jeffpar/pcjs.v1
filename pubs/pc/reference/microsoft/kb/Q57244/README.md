---
layout: page
title: "Q57244: Workaround for Converting a Float/Double to a String"
permalink: /pubs/pc/reference/microsoft/kb/Q57244/
---

## Q57244: Workaround for Converting a Float/Double to a String

	Article: Q57244
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 15-JAN-1990
	
	Question:
	
	The gcvt() function returns an exponential number in the string even
	if the number fits in the specified precision when the number is of
	the form 0.0x, where x is any digit(s). Because of this behaviour with
	the gcvt() function, I am unable to convert my floating point number
	to a string in the format that I want. Is there another function I can
	use to convert a floating point number to a string?
	
	Response:
	
	Another function that converts a floating point number to a string is
	fcvt(). Unfortunately, it does not do all the conversion for you
	because it leaves out both the decimal point and the sign of the
	number.
	
	You can also use the sprintf() or printf() functions with the "%lf"
	format specifier to obtain the correct results. However, if you do not
	want to use any printf() constructs, supporting code is needed to
	completely convert the floating point number to a string. The
	following program shows one possible way this can be done, and the
	printf() statements can be replaced by puts() statements:
	
	Sample Program
	--------------
	
	#include <stdio.h>
	#include <stdlib.h>
	#include <malloc.h>
	#include <string.h>
	
	#define PRECISION   8
	
	char *double_to_char (double) ;
	
	char *temp2 ;
	
	void main (void)
	{
	        temp2 = (char *) malloc (100) ;
	        if (temp2 == NULL)
	                printf ("Hey, it didn't work (the malloc for temp)\n") ;
	
	        temp2 = double_to_char ((double) 0.0004567891) ;
	        printf ("temp = %s\n", temp2) ;
	        temp2 = gcvt ((double) 0.0004567891, PRECISION, temp2) ;
	        printf ("temp = %s\n", temp2) ;
	
	        temp2 = double_to_char ((double) 123.564) ;
	        printf ("temp = %s\n", temp2) ;
	        temp2 = double_to_char ((double) -43.7864383846738) ;
	        printf ("temp = %s", temp2) ;
	}
	
	/*  Translates a double to an ASCIIZ string
	*/
	
	char *double_to_char (double number)
	{
	        char *buffer,
	                 *temp ;
	
	        int  decimal_spot,
	                 sign,
	                 count,
	                 current_location = 0 ;
	
	        buffer = (char *) malloc (PRECISION + 3) ;
	        temp   = (char *) malloc (PRECISION + 1) ;
	        if (buffer == NULL || temp == NULL)
	        {
	                printf ("Memory allocating attempt has failed in"
	                        "'double_to_char'\n") ;
	                exit (-1) ;
	        }
	
	        temp = fcvt (number, PRECISION, &decimal_spot, &sign) ;
	
	/*      Force the number to be precise to only PRECISION digits, notice
	                that no rounding is done here...
	*/
	        temp [PRECISION] = '\0' ;
	
	/*      Is this a negative number ?, if so add a negative sign.
	*/
	        if (sign)
	                buffer [current_location++] = '-' ;
	
	/*      Now we need to put the decimal point in the correct place,
	                followed by the rest of the digits.
	*/
	        if (decimal_spot > 0)
	        {
	                strncpy (&buffer [current_location], temp, decimal_spot) ;
	                buffer [decimal_spot + current_location] = '.' ;
	                strcpy (&buffer [decimal_spot + current_location + 1],
	                                &temp [decimal_spot]) ;
	        }
	        else
	        {
	                buffer [current_location] = '.' ;
	                for (count = current_location;
	                     count < abs (decimal_spot);
	                     count++)
	                        buffer [count + 1] = '0' ;
	                strcpy (&buffer [count + 1], temp) ;
	        }
	
	        return (buffer) ;
	}
