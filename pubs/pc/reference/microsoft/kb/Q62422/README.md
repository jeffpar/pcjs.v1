---
layout: page
title: "Q62422: C4047 Incorrectly Generated on Void Pointer Assignment"
permalink: /pubs/pc/reference/microsoft/kb/Q62422/
---

	Article: Q62422
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 22-JUN-1990
	
	The code below, when compiled with Microsoft C 6.00 at warning level 1
	or higher, incorrectly produces the following error message:
	
	   test.c(15) : warning C4047: '=' : different levels of indirection
	
	Sample Code
	-----------
	
	#include <stdlib.h>
	
	typedef void (*PFV)( void );    /* ptr to func returning void */
	typedef int  (*PFI)( void );    /* ptr to func returning int */
	
	void test( void )
	{
	    PFV     *pPFV;      /* ptr to ptr to func returning void */
	    PFI     *pPFI;      /* ptr to ptr to func returning int */
	
	    /* This assignment is made correctly with no warnings. */
	    pPFI = malloc( 10 * sizeof( *pPFI ) );
	
	    /* This assignment generates a warning C4047. */
	    pPFV = malloc( 10 * sizeof( *pPFV ) );
	}
	
	According to the ANSI C standard (Section 3.2.2.3) "A pointer to void
	may be converted to or from a pointer to any incomplete or object
	type." In this case, the assignment is to a pointer to a pointer,
	which is a pointer to an object type. So, this warning is being
	incorrectly generated for the assignment. As can be seen from the
	sample code, the same assignment does not cause an error for a pointer
	to pointer to function returning int.
	
	Microsoft C 5.10 compiles this code correctly, without generating any
	warning diagnostics.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
