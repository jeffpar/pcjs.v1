---
layout: page
title: "Q49571: typedefs Not Allowed for Function Definitions"
permalink: /pubs/pc/reference/microsoft/kb/Q49571/
---

## Q49571: typedefs Not Allowed for Function Definitions

	Article: Q49571
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 16-JAN-1990
	
	It is not valid to use a typedef statement in a function definition
	according to the ANSI C draft, December 7, 1988, Section 3.7.30, and
	also Footnote 76, which state, "The intent (of the rule) is that the
	type category in a function definition cannot be inherited from a
	typedef". This statement applies to Microsoft C Versions 5.00 and
	5.10. Using typedefs in function definitions can cause various errors
	at compile time. The function definition is followed by the function
	body included in "{}" (curly braces).
	
	The following code fragment produces errors at compile time due to the
	typedef in the function definition. In the code sample, error C1059
	"out of near heap space" is generated. Making slight modifications to
	the code, however, produces various other errors such as error C2055
	"expected formal parameter list, not a type list".
	
	Code Sample
	-----------
	
	     #include <stdio.h>
	
	     typedef void FTYPE (int f);
	
	     FTYPE foo_function  /* function definition with type from typedef
	                                is a syntax constraint error */
	     { printf ("f=%u",f);
	     }
	
	Microsoft has confirmed this to be a problem with C Version 5.10. We
	are researching this problem and will post new information as it
	becomes available.
