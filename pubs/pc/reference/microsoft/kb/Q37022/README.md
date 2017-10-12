---
layout: page
title: "Q37022: How to Determine the Amount of Available DOS Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q37022/
---

	Article: Q37022
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-DEC-1988
	
	Question:
	
	Is there a C run-time function that I can use to determine how much
	RAM is available under DOS?
	
	Response:
	
	No function exists that specifically performs this task. Functions
	"_freect" or "_memavl" only return available memory for dynamic
	allocation in the near heap. The near heap is located above the stack
	within the 64K byte or smaller default data segment called DGROUP.
	Function _memavl indicates the amount of near space that never has
	been allocated, whereas _freect allows you to detect what has been
	freed.
	
	However, you may use the function "_dos_allocmem" defined below
	to determine the amount of far heap above the default data segment:
	
	    #include <dos.h>
	    unsigned _dos_allocmem(size, segment) ;
	    unsigned size ;
	    unsigned *segment ;
	
	If the attempted memory allocation is NOT successful, _dos_allocmem
	puts the maximum possible free memory size (in 16-byte paragraphs)
	in the word pointed to by "segment". If you request to allocate
	0xFFFF paragraphs of memory (which will fail in any case), you should
	be able to find out the amount of available memory. (DOS function
	call 48h performs the same task.)
	
	Note: the value returned to *segment is in paragraphs too. If other
	memory allocation functions are going to use this value, it should be
	converted to bytes.
	
	Refer to the "Microsoft C Version 5.10 Optimizing Compiler Run-time
	Library Reference" for specific information on using _dos_allocmem.
