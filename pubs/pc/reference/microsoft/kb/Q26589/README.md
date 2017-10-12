---
layout: page
title: "Q26589: Variables in C 5.00/5.10 splitpath() Example Declared Wrong"
permalink: /pubs/pc/reference/microsoft/kb/Q26589/
---

	Article: Q26589
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 11-FEB-1991
	
	On page 560 of the "Microsoft C Optimizing Compiler: Run-Time Library
	Reference" that shipped with C versions 5.00 and 5.10, the example for
	the _splitpath() function declares its variables incorrectly. It
	declares arrays of pointers, rather than arrays of characters, as
	follows:
	
	   char * drive [3];
	   char * dir [30];
	   char * fname [9];
	   char * ext [4];
	
	The correct declaration should be as follows:
	
	   char drive [3];
	   char dir [30];
	   char fname [9];
	   char ext [4];
	
	Both declarations work correctly, but unpredictable results may occur
	with the original form of the array declarations.
