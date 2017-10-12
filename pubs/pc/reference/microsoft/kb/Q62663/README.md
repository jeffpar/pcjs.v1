---
layout: page
title: "Q62663: CodeView 3.00 Hangs on gets() with Screen Swap Off"
permalink: /pubs/pc/reference/microsoft/kb/Q62663/
---

	Article: Q62663
	Product: Microsoft C
	Version(s): 3.00   | 3.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_c s_quickc s_quickasm
	Last Modified: 25-JUL-1990
	
	CodeView 3.00 will hang if you step or execute past a call to the
	gets() run-time routine if the Screen Swap option is turned off.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	char string[256];
	
	void main (void)
	{
	    printf ( "Enter a string: ") ;
	    gets ( string ) ;
	    printf ( "Echoing : %s\n", string) ;
	}
	
	Compile the above file with the following:
	
	   cl /Od /Zi test.c
	
	Bring the file up in CodeView, then select the Options.Screen Swap
	option. Next, step past the gets() call. Under DOS, your machine will
	hang, and under OS/2, the current screen group will be hung.
