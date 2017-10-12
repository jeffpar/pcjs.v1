---
layout: page
title: "Q62307: Internal Compiler Error '@(#)p3symtab.c:1.39', Line 450"
permalink: /pubs/pc/reference/microsoft/kb/Q62307/
---

	Article: Q62307
	Product: Microsoft C
	Version(s): 6.00 5.10 | 6.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist6.00 buglist5.10
	Last Modified: 22-JUN-1990
	
	The code below, when compiled with Microsoft C 6.00 with default
	options, produces the following error message:
	
	   fatal error C1001: Internal Compiler Error
	                      (compiler file '@(#)p3symtab.c:1.39', line 450)
	                      Contact Microsoft Product Support Services
	
	Microsoft C 5.10 produces the following error message:
	
	   fatal error C1001: Internal Compiler Error
	                      (compiler file '@(#)p3symtab.c:1.32', line 358)
	                      Contact Microsoft Technical Support
	
	Sample Code
	-----------
	
	    static void _export child( void );
	
	    void main( void )
	    {
	        child();
	    }
	
	    static void _export child( void )
	    {
	    }
	
	Microsoft has confirmed this to be a problem with C versions 5.10 and
	6.00. We are researching this problem and will post new information
	here as it becomes available.
