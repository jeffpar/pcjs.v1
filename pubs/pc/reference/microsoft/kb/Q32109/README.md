---
layout: page
title: "Q32109: Two Syntaxes for Calling Functions with Pointers"
permalink: /pubs/pc/reference/microsoft/kb/Q32109/
---

	Article: Q32109
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-SEP-1988
	
	The source code below contains what appears to be an improper use of a
	pointer to a function. However, the compiler fails to flag this either
	as a warning or as an error, and the code seems to work as expected.
	
	The behavior exhibited in the sample code is expected. The proposed
	ANSI Standard (Document Number X3J11/88-002, January 11, 1988) allows
	a function to be called through a pointer with the following syntax
	
	pointer_to_function();
	
	in addition to the following traditional syntax:
	
	(*pointer_to_function)();
	
	The following is a quotation from Page 40 of "Rationale for Draft
	Proposed American National Standard for Information Systems
	Programming Language C":
	
	"The...construct, not sanctioned in the Base Document, appears in some
	present versions of C, is unambiguous, invalidates no old code, and
	can be an important shorthand."
	
	The following sample code demonstrates this problem:
	
	#include <stdio.h>
	void main()
	{
	   void ftn();
	   void (*ptr_to_ftn)();
	   ptr_to_ftn = ftn; /* the pointer is correctly assigned to
	                        an address */
	   printf("\nCalling all ftns\n\n");
	   (ptr_to_ftn)();  /* note that the function is improperly called.
	                       the correct syntax is (*ptr_to_ftn)() */
	   printf("back to main\n");
	}
	void ftn()
	{
	   printf("inside ftnland\n\n");
	}
