---
layout: page
title: "Q65393: Missing Semicolon Can Cause Internal Compiler Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q65393/
---

	Article: Q65393
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc buglist6.00
	Last Modified: 31-AUG-1990
	
	If a semicolon (;) is missing at the end of a structure definition and
	the following statement is a variable declaration of unsigned int or
	unsigned char, no compiler error is generated. However, several
	different internal compiler errors can be generated depending on what
	operating system and compiler you are using.
	
	Sample Code
	-----------
	
	int f(void);
	
	struct foo {
	    int x;
	    int y;
	    }                 // Note: no semicolon
	
	unsigned int goo;
	
	void main(void)
	{
	   goo = f();
	}
	
	The following are the results when the sample code above is compiled
	under various operating systems and versions of the C 6.00 compiler:
	
	Compiling Under C 6.00
	----------------------
	
	MS-DOS and OS/2 produce the following:
	
	      fatal error C1001: Internal Compiler Error
	      (compiler file '@(#)regMD.c:1.100', line 2886)
	      Contact Microsoft Product Support Services
	
	Compiling Under C 6.00 with the /qc Option
	------------------------------------------
	
	1. MS-DOS produces the following:
	
	      fatal error C1001: Internal Compiler Error
	      (compiler file 'gencode.c', line 437)
	      Contact Microsoft Product Support Services
	
	2. OS/2 produces the following:
	
	      fatal error C1063:
	
	Microsoft has confirmed this to be a problem with Microsoft C version
	6.00. We are researching this problem and will post new information
	here as it becomes available.
