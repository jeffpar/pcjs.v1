---
layout: page
title: "Q49823: Inconsistent Use of fscanf %x.xf Formatting May Produce Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q49823/
---

	Article: Q49823
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_C S_QuickC
	Last Modified: 17-JUL-1990
	
	Using the Microsoft C 5.10 run-time library function fscanf() with the
	format specifier %x.xf to read floating-point values usually produces
	undesirable results. This happens especially if the file contains
	floating point information that was not recorded using the same %x.x
	specifier that is being used to read.
	
	This is not a problem with the fscanf() function (see below).
	
	The following code can be used as an example of expected behavior:
	
	#include<stdio.h>
	
	void main( void )
	{
	   float a = 3.104f, b = 34.23534f, c = 834.3432f, d = 5968.394f;
	   float e = 34253.2f;
	   float ar, br, cr, dr, er;
	   FILE *stream;
	
	   if( (stream = fopen( "file.tst", "a" )) == NULL )
	      printf( "ERROR:  Unable to open output file" );
	   else
	      fprintf( stream, "%f,%f,%f,%f,%f\n", a, b, c, d, e );
	   fclose( stream );
	   if( (stream = fopen( "file.tst", "r" )) == NULL )
	      printf( "ERROR:  Unable to open input file" );
	   else
	                    /* NOTE:  %x.x format specifier */
	   {                /*  |  */
	      printf("Values: %2.4f, %f, %f, %f, %f\n", a, b, c, d, e );
	      fscanf( stream, "%4f,%4f,%4f,%4f,%4f", &ar, &br, &cr, &dr, &er);
	      printf("After Read: %f, %f, %f, %f, %f\n", ar, br, cr, dr, er );
	   }
	}
	
	The output from the program is as follows:
	
	   Values: 3.104000, 34.235340, 834.343201, 5968.394043
	   After Read: 3.1000, 0.000000, 0.000000, 0.000000
	
	The unwanted behavior is obvious, as the "Values" above are what is
	contained in the output file "file.tst" and these are definitely not
	the values that are read back in.
	
	However, this is not a problem with the fscanf() function. The first
	value is read in correctly. After the first value is read, the file
	pointer points to the second 0 (zero) in 3.104000. When the second
	value is read, the information in the file does not conform to
	floating-point format, and zeros are read after that. The compiler has
	no way of knowing how far to move the file pointer to get to the next
	value.
	
	If the %2.4f in the fscanf() line in the code above were replaced by
	%f, the program output would be as follows:
	
	   Values:     3.104000, 34.235340, 834.343201, 5968.394043
	   After Read: 3.104000, 34.235340, 834.343201, 5968.394043
	
	To read truncated or formatted floating-point values from a file, use
	the %f format specifier and modify the values after they are read.
