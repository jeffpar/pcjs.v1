---
layout: page
title: "Q60391: Operator Missing in C 6.00 A.P.T. Manual's /Oz Example"
permalink: /pubs/pc/reference/microsoft/kb/Q60391/
---

## Q60391: Operator Missing in C 6.00 A.P.T. Manual's /Oz Example

	Article: Q60391
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 17-DEC-1990
	
	The example for the command-line compiler switch /Oz on Page 18 of
	"Microsoft C Advanced Programming Techniques" is missing a "<" sign in
	a FOR statement. The incorrect line of code in the manual appears as
	follows:
	
	   for( i = 0; i  100; ++i )
	
	The correct code should read as follows:
	
	   for( i = 0; i <100; ++i )
