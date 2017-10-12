---
layout: page
title: "Q40590: Operator sizeof Returns Type size_t Defined as Unsigned int"
permalink: /pubs/pc/reference/microsoft/kb/Q40590/
---

	Article: Q40590
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 11-JAN-1990
	
	The sizeof operator returns a value that is of type size_t. The
	definition of size_t is implementation dependent, according to the
	ANSI standard. In Microsoft C, the size_t type is defined in STDDEF.H
	and in MALLOC.H as an unsigned int. This is documented on Pages 38 and
	98 of the "Microsoft C Optimizing Compiler Run-Time Library Reference"
	manual.
	
	The reference manual describes the sizeof operator on Pages 120-121,
	Section 5.3.4, but does not give the return type.
	
	The index entry for "size_t type" incorrectly lists Pages 38 and 97;
	it should say 38 and 98.
