---
layout: page
title: "Q62666: DosSetMaxFH Between 0-39 Fails Under CodeView 3.00"
permalink: /pubs/pc/reference/microsoft/kb/Q62666/
---

	Article: Q62666
	Product: Microsoft C
	Version(s): 3.00
	Operating System: OS/2
	Flags: ENDUSER | buglist3.00
	Last Modified: 25-JUL-1990
	
	OS/2's DosSetMaxFH routine can be called to reset the OS/2 default
	limit of a maximum of 20 open file handles to a larger number. By
	definition, DosSetMaxFH fails when trying to set the number smaller
	than the current maximum amount of handles. Under OS/2, the default
	maximum number of files is 20, so a DosSetMaxFH to a number between
	0-19 should fail.
	
	However, under CodeView 3.00, calling DosSetMaxFH with a number
	between 0-39 will return a fail value.
	
	Sample Code
	-----------
	
	/* compile with : cl /Od /Zi file.c */
	
	#define INCL_DOSFILEMGR
	
	#include <stdio.h>
	#include <os2.h>
	
	void main(void)
	{
	   int i;
	   for ( i = 0 ; i < 1000 ; i ++ )
	
	   if ( DosSetMaxFH ( i ) )
	   {
	      printf ( " DosSetMaxFH to %d failed!\n ",i ) ;
	   }
	}
	
	This program prints the error message on parameters from 0 to 39.
	
	You can call the DosSetMaxFH routine to set at least 40 file handles
	to work around this problem.
