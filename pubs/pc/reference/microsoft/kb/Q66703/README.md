---
layout: page
title: "Q66703: C 6.00/6.00a Online Help Example for _heapwalk() Is Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q66703/
---

	Article: Q66703
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr _heapwalk
	Last Modified: 28-JAN-1991
	
	The program example HEAPWALK.C that is found in the C versions 6.00
	and 6.00a online help is incorrect. Compiling the program under large
	model in OS/2 causes a general protection error. When compiling the
	program without the Quick Compile option (/qc) turned on, the
	following warning message will appear twice:
	
	   Warning c4061: long/short mismatch in argument: conversion supplied
	
	This warning message is cause by the failure to type cast the
	following statement
	
	   heapdump(254);
	
	to the following:
	
	   heapdump((char)254);
	
	The second "for" loop in the program causes the general protection
	fault. The variable "i" is not initialized to the correct value. The
	code currently reads as follows:
	
	   for( ; i >= 0; i-- )
	   {
	      free( p[i] );
	      printf("Deallocating %u at %Fp\n",
	               _msize( p[i] ), (void _far *)p[i]);
	   }
	
	It should read as follows:
	
	   for( i=9; i >= 0; i-- )    // <--- THIS LINE HAS BEEN CHANGED.
	   {
	      free( p[i] );
	      printf( "Deallocating %u at %Fp\n",
	              _msize( p[i] ), (void _far *)p[i] );
	   }
	
	The problem with the loop is that the value of i is equal to 10 when
	the loop begins; it should be 9.
