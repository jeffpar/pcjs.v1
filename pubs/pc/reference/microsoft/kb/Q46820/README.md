---
layout: page
title: "Q46820: Library Support for Near, Far, and Huge Keywords"
permalink: /pubs/pc/reference/microsoft/kb/Q46820/
---

## Q46820: Library Support for Near, Far, and Huge Keywords

	Article: Q46820
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | mixed memory model S_QuickC
	Last Modified: 18-AUG-1989
	
	When using the "near", "far", and "huge" keywords to override
	addressing conventions within specific memory models, you can usually
	use one of the standard libraries. Often, you cannot pass far
	pointers, or the addresses of far data items, to a small-model library
	routine. Some exceptions are the library routines "halloc", "hfree",
	and the "printf" family of functions.
	
	For additional information, refer to the "Microsoft C Optimizing
	Compiler User's Guide," Page 145.
	
	Mixed-memory-model programming uses the "near", "far", and "huge"
	keywords to locate code or data outside of the segments specified by
	the memory model, e.g. declaring a "far" character array in a small
	memory model where it would ordinarily be "near".
	
	Mixed-model programming is useful when you have only a bit of data to
	put outside of the single data segment and you don't want to switch to
	a multiple-data-segment memory model. The standard library routines,
	however, were written to support the standard memory models, and so
	must be used with care.
	
	The following example demonstrates a function that performs as
	expected in large or compact model but returns incorrect results in
	the medium or small model because its data, "buffer", was declared
	"far":
	
	char far buffer[100];
	.
	.
	.
	fwrite ( buffer, size, count, stream);
	
	In single-data-segment models, data addresses are 2-bytes long. In
	multiple-data-segment models, data addresses are 4-bytes long. Data
	declared "far" also has 4-byte addresses. When fwrite() is called in a
	single-data-segment model, it expects 2-byte, not 4-byte, data
	addresses.
	
	Removing the "far" keyword or compiling in a multiple-data-segment
	model corrects the problem. Another solution is to assign the value of
	the far variable to a near variable. In the example below, each
	element of the far array is assigned to the near array. A strcpy()
	cannot be used in this case, since it is one of the library functions
	that operates properly only when the data addresses are consistent
	with their memory model:
	
	char far buffer[];
	char nearbuffer;   /* near by default in small and medium models */
	int i;
	
	for (i = 0; i < 100; i++)
	  nearbuffer[i] = buffer[i];
	.
	.
	.
	fwrite ( nearbuffer, size, count, stream);
