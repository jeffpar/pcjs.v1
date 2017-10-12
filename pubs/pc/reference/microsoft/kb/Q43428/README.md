---
layout: page
title: "Q43428: The Storage of Environment Variables"
permalink: /pubs/pc/reference/microsoft/kb/Q43428/
---

	Article: Q43428
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 17-MAY-1989
	
	Question:
	
	How can I find out where the environment variables (PATH, LIB, etc.)
	are being stored?
	
	Response:
	
	The environment variables are stored in the near heap, which is part
	of DGROUP. The ENVIRON variable is an array of pointers to the strings
	that constitute the process environment. The C start-up code takes the
	environment information and initializes the ENVIRON variable to point
	to the environment table. The function getenv() uses the ENVIRON
	variable to access the environment table. ENVIRON can be used to
	obtain the environment table address directly.
	
	The following program will print out the address of the beginning of
	the environment table and the PATH environment variable:
	
	#include <stdlib.h>
	#include <stdio.h>
	
	char *path;
	
	void main (void)
	{
	  path = getenv( "PATH" );
	  printf( "path: %s\nenviron: %x\n", path, environ );
	}
