---
layout: page
title: "Q60487: Prototype in User's Guide for tglcase() Is Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q60487/
---

	Article: Q60487
	Product: Microsoft C
	Version(s): 1.02    | 1.02
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 15-APR-1990
	
	In the sample program for a C extension on Page 126 of the "Microsoft
	Editor User's Guide" for Microsoft FORTRAN 5.00 and Microsoft BASIC
	PDS Version 7.00, the prototype for tglcase() is incorrect.
	
	The function is prototyped as follows:
	
	   flagType pascal EXPORT tglcase (unsigned int, ARG far *, flagType);
	
	It should be as follows:
	
	   flagType pascal EXTERNAL tglcase (unsigned int, ARG far *, flagType);
	
	Note: The word EXTERNAL replaces EXPORT.
