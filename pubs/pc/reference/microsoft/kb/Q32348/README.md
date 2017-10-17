---
layout: page
title: "Q32348: Incorrect Comment Pragma Example"
permalink: /pubs/pc/reference/microsoft/kb/Q32348/
---

## Q32348: Incorrect Comment Pragma Example

	Article: Q32348
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 15-JAN-1990
	
	Page 12 (Update-12) of the Update section for the "Microsoft C
	Optimizing Compiler User's Guide and Language Reference" manual shows
	an incorrect example of the comment pragma.
	
	The second parameter of the pragma is a string literal and should be
	enclosed in double quotation marks. The example should look like the
	following:
	
	   #pragma comment(lib, "mylibry")
	
	Note: If the quotation marks are missing, the compiler will issue
	error C4079.
