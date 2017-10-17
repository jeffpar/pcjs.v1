---
layout: page
title: "Q38284: 80386 and 80387 Instruction Set"
permalink: /pubs/pc/reference/microsoft/kb/Q38284/
---

## Q38284: 80386 and 80387 Instruction Set

	Article: Q38284
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | h_fortran s_pascal s_quickc
	Last Modified: 7-DEC-1988
	
	Question:
	
	According to the "Microsoft C 5.1 Optimizing Compiler User's Guide,"
	you can generate 80286 and 80287 instructions with your high-level
	language compilers. Can I also use the 80386 and 80387 instruction
	set?
	
	Response:
	
	You can use the 80386 and 80387 chips. However, none of our products
	generate true 80386 code, or use 32-bit addressing. Although our
	compilers do not generate specific 80386 or 80387 code, the code which
	is generated will run faster than on a 80286 and 80287.
