---
layout: page
title: "Q65243: _memavl() Returns 0 If Not Bound with APILMR.OBJ"
permalink: /pubs/pc/reference/microsoft/kb/Q65243/
---

	Article: Q65243
	Product: Microsoft C
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 31-AUG-1990
	
	When creating a large or compact model bound program that uses the
	_memavl() function, APILMR.OBJ must be added to the BIND line or the
	function will always return 0 (zero). The following code duplicates
	the problem along with the solution:
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <malloc.h>
	
	int main(void)
	{
	   size_t bytes;
	
	   bytes = _memavl();
	   printf("_memavl returns: %x\n", bytes);
	   return(0);
	}
	
	If the above code is compiled with /AL or /AC, and bound with BIND,
	it will return the following message:
	
	   _memavl returns: 0
	
	However, when APILMR.OBJ is specified as follows, the program will
	return a valid value:
	
	   bind foo.exe apilmr.obj
	
	For more information on the APILMR.OBJ file, query in QuickHelp on
	BIND, then click the button for APILMR.OBJ.
