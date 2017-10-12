---
layout: page
title: "Q37205: Operator sizeof Returns Type size_t, Defined as unsigned int"
permalink: /pubs/pc/reference/microsoft/kb/Q37205/
---

	Article: Q37205
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 21-NOV-1988
	
	The sizeof operator returns a value that is of type size_t. The
	definition of size_t is implementation-dependent, according to the
	ANSI standard. In Microsoft C, the size_t type is defined in STDEF.H
	and in MALLOC.H as an unsigned int. This information is documented in
	the "Microsoft C Optimizing Compiler Run-Time Library Reference" on
	Pages 38 and 98.
	
	To use sizeof on huge items, which can be larger than 64K, you will
	need to use a typecast on the sizeof expression as follows:
	
	   char huge a[95000];
	   unsigned long sizea;
	
	   sizea = (unsigned long) sizeof(a);
	
	Note: the Index entry for "size_t type" lists Pages 38 and 97; it
	should say Pages 38 and 98.
	
	The "Microsoft C Optimizing Compiler Language Reference" manual
	describes the sizeof operator on Pages 120-121, section 5.3.4, but
	does not give the return type.
