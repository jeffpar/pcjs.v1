---
layout: page
title: "Q61975: Odd Size Structures &gt; 10 Bytes Passed Incorrectly If Packed"
permalink: /pubs/pc/reference/microsoft/kb/Q61975/
---

## Q61975: Odd Size Structures &gt; 10 Bytes Passed Incorrectly If Packed

	Article: Q61975
	Version(s): 6.00    | 6.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 11-JUL-1990
	
	If you declare a structure of odd length greater than 10 and pass that
	structure by value, the Microsoft C version 6.00 compiler will pass a
	correct size for the structure, but will pad the size of the structure
	by an extra byte in the receiving function. The next byte on the stack
	after the structure will be overwritten with a null padding character.
	
	The best workaround for this problem is to manually pad the structure
	to an even size.
	
	The sample code shown below declares an 11-byte structure and passes
	that as well as a character to a function. Note that the character
	following the structure is overwritten with a null character.
	
	Remove the comment from the struct ODDSTRUCT definition to add in a
	char pad and recompile to demonstrate the workaround for the problem.
	
	Sample Code
	-----------
	
	// Compile with /Zp
	
	#include <stdio.h>
	#include <string.h>
	
	struct ODDSTRUCT
	   {
	   char string[11];
	  // char pad ;          /* Remove comments to pad structure. */
	   }   oddstruct;
	
	void catchastruct ( struct ODDSTRUCT , char ) ;
	
	void main ( void )
	{
	   strcpy ( oddstruct.string, "0123456789" ) ;
	   printf ("Msg = %s\n", oddstruct.string ) ;
	   catchastruct ( oddstruct , '!' );
	}
	
	void catchastruct ( struct ODDSTRUCT oddstruct, char trashme )
	{
	   printf ( "Msg = %s\ntrashme=%c(char) or %x(hex)\n",
	            oddstruct.string , trashme, trashme ) ;
	}
	
	The following is the output of this code:
	
	Msg = 0123456789
	Msg = 0123456789
	trashme= (char) or 0(hex)
