---
layout: page
title: "Q68337: ftell() May Return an Invalid Value with a Text File"
permalink: /pubs/pc/reference/microsoft/kb/Q68337/
---

## Q68337: ftell() May Return an Invalid Value with a Text File

	Article: Q68337
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | s_quickc buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 11-FEB-1991
	
	When ftell() is used on a file opened in text mode that contains only
	line feeds (0x0A) with no carriage returns (0x0D), it may return an
	incorrect value on the first call, causing all subsequent return
	values to be wrong as well. Opening the file in binary mode will
	eliminate this problem.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	void main( void)
	{
	   FILE *ptr;
	   char a[80];
	   fpos_t offset;
	
	   ptr = fopen( "foo", "r" );    /* foo contains 12 lines of 40 chars
	                                   each with line feeds only */
	   fgets( a, 79, ptr );          /* positions (or should position)
	                                   the file pointer at an offset of 41 */
	   offset = ftell( ptr );
	   printf( "offset = %ld\n", offset );   /* prints out 30  */
	   fclose( ptr );
	}
