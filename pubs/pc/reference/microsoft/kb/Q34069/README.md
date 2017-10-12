---
layout: page
title: "Q34069: Putting Global Variables in the Default Data Segment"
permalink: /pubs/pc/reference/microsoft/kb/Q34069/
---

	Article: Q34069
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER |
	Last Modified: 18-AUG-1988
	
	Question:
	   How can I tell the compiler to put my global variables in the
	default data segment when I am using the large- or huge-memory models?
	
	Response:
	   In any memory model, if the near keyword is applied to global
	variables, they will be put in the default data segment. This action
	ensures that the variable is referenced with a 16-bit address, as
	opposed to the far 32-bit addresses, which will make variables defined
	with the near keyword faster to access.
