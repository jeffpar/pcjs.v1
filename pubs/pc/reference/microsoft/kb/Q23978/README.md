---
layout: page
title: "Q23978: Warning C4040: near/far/huge Ignored"
permalink: /pubs/pc/reference/microsoft/kb/Q23978/
---

## Q23978: Warning C4040: near/far/huge Ignored

	Article: Q23978
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER |
	Last Modified: 26-SEP-1988
	
	Question:
	
	I am trying to declare some far data in small model, but I keep
	getting "Warning 40: near/far/huge ignored" with C Version 4.00, or
	the same warning with the number C4040 using C Versions 5.x. Does this
	mean I cannot declare far data in the small model?
	
	Response:
	
	The far data can be declared in the small-memory model. This warning
	means that the far descriptor is improper and/or unnecessary in the
	context in which it is being used. Far or huge arrays should be
	defined outside of functions, or with the static storage class if
	defined within functions.
	
	It also may mean you are trying to make the type of pointer definition
	"char * far pvar;" within the body of a function. This definition
	attempts to define a pointer to data (either near or far, depending on
	the memory model) and place it in a far data segment outside the
	default data segment. This process only will work properly if it is a
	global definition, or if it is defined as static within the body of
	the function.
	
	Please note the difference between the above definition and defining a
	pointer to far data, which is "char far *pvar;". The latter definition
	declares a pointer that can point to data outside the default data
	segment, but the pointer itself is within the default data segment.
	This declaration is quite acceptable within the body of a function.
