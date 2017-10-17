---
layout: page
title: "Q66648: Compiler Hangs If Array of Voids Is Initialized"
permalink: /pubs/pc/reference/microsoft/kb/Q66648/
---

## Q66648: Compiler Hangs If Array of Voids Is Initialized

	Article: Q66648
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00a
	Last Modified: 1-NOV-1990
	
	If the sample code below is compiled with the Microsoft C version 6.00
	compiler, under any optimization or memory model, it will hang the
	computer after generating a C2182 warning message.
	
	Microsoft has confirmed this to be a problem with C version 6.00. This
	problem has been corrected in the C 6.00a maintenance release.
	
	The C2182 warning is defined as follows:
	
	   'identifier' : has type void
	
	    The given variable was declared with the void keyword. The void
	    keyword can be used only in function declarations.
	
	Sample Code
	-----------
	
	void buf[] = { 1, 2 };
	
	void main (void)
	{
	   return;
	}
