---
layout: page
title: "Q41713: Watching a Character Array in QuickC Version 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q41713/
---

## Q41713: Watching a Character Array in QuickC Version 2.00

	Article: Q41713
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 6-JUN-1989
	
	The program below declares six different character type variables.
	Watching each variable in QuickC Version 2.00 as a string might not
	have the desired effect.
	
	Watching any of the three arrays with explicit sizes displays all
	eight elements as an array of characters, as follows:
	
	   array1 : { 'A', 'r', 'r', 'a', 'y', '1', '\0', '\0' }
	
	Watching either of the two arrays with implicit sizes reveals a
	problem with QuickC Version 2.00: nothing is displayed between the
	curly braces. The following is an example:
	
	   array4 : {  }
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	Watching the pointer displays the contents of array1 as follows (as
	expected):
	
	   pointer : "Array1"
	
	Watching any of the arrays with an "s" formatter also gives results
	that probably are unwanted. The arrays with explicit sizes show eight
	different strings; strings that are pointed to by the character
	elements of the array. The array with implicit sizes again shows an
	empty set of braces.
	
	Watching the pointer with an "s" gives the expected results, as
	follows:
	
	   pointer,s : "Array1"
	
	All six variables can be watched as strings, and not as arrays of
	characters, with the following watch format:
	
	   &array1[0],s : "Array1"
	
	The first element of any of the variables is a character, the address
	of which is a character pointer. This pointer can then be cast to a
	string.
	
	The following sample program is an example of watching string
	variables in QuickC Version 2.00:
	
	#include <string.h>
	
	char array1[8];
	char array2[8] =  "Array2";
	char array3[8] = {'A', 'r', 'r', 'a', 'y', '3', '\0'};
	char array4[]  =  "Array4";
	char array5[]  = {'A', 'r', 'r', 'a', 'y', '5', '\0'};
	
	char *pointer  = array1;
	
	void main( void )
	{
	    strcpy( array1, "Array1" );
	}
