---
layout: page
title: "Q61305: Warning C4018: signed/unsigned Mismatch Not in QuickHelp"
permalink: /pubs/pc/reference/microsoft/kb/Q61305/
---

	Article: Q61305
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 23-JAN-1991
	
	Compiler warning C4018 is not documented in the online help files that
	come with the Microsoft C version 6.00 compiler. C4018 is a warning
	message that is new to C 6.00, and it is generated at warning level 3
	or 4 when the compiler finds code comparing a signed and an unsigned
	data type.
	
	Code Example
	------------
	
	The following code generates C4018 at warning level 3 or 4:
	
	unsigned int u = 2;
	int i = 1;
	
	void main ( void )
	{
	    if ( i == u )    // Warning is generated on this line.
	        i = 0;
	}
