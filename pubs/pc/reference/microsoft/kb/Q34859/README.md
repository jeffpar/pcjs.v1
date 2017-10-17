---
layout: page
title: "Q34859: C4047 Occurs when Function Prototype Is Omitted or Misnamed"
permalink: /pubs/pc/reference/microsoft/kb/Q34859/
---

## Q34859: C4047 Occurs when Function Prototype Is Omitted or Misnamed

	Article: Q34859
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 26-AUG-1988
	
	The compiler warning message
	
	"C4047 'operator' : different levels of indirection"
	
	can occur when a function prototype declaration is not specified, when
	the header file that contains the declaration is not given in a
	#include directive, when a reference to a function is misspelled,
	or when a pointer is assigned a value of a different type without
	using an appropriate type cast.
	
	When the function declaration is omitted, a default prototype is
	created with a return type of int assumed. A later use of the function
	then may cause the C4047 warning, such as assigning the return value
	of the function to a non-int variable.
	
	If the call to the function is not spelled the same as the name of the
	prototype, the prototype will not be referred to, the default
	assumption for the function return type will be int, and the warning
	may occur.
	
	More information on function prototyping can be found beginning on
	Page 169 in Chapter 7 of the "Microsoft C Optimizing Compiler Language
	Reference" manual.
