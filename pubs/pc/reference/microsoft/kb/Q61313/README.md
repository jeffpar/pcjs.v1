---
layout: page
title: "Q61313: malloc() Is Slower in Large and Compact Models"
permalink: /pubs/pc/reference/microsoft/kb/Q61313/
---

	Article: Q61313
	Product: Microsoft C
	Version(s): 5.00 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 11-JUL-1990
	
	In LARGE and COMPACT models, it should be expected that malloc will be
	slower since it must use far pointer calls. It may be possible to
	improve malloc's performance by adjusting the _amblksiz variable to an
	appropriate size.
	
	The _amblksiz variable can be used to control the amount of memory
	space in the heap used by C for dynamic memory allocation. This
	variable is declared in the include file MALLOC.H.
	
	The first time your program calls one of the dynamic memory allocation
	functions (such as calloc or malloc), it asks the operating system for
	an initial amount of heap space that is typically much larger than the
	amount of memory requested by calloc or malloc. This amount is
	indicated by _amblksiz, whose default value is 8K (8192 bytes).
	Subsequent memory allocations are allotted from this 8K of memory,
	resulting in fewer calls to the operating system when many relatively
	small items are being allocated. C calls the operating system again
	only if the amount of memory used by dynamic memory allocations
	exceeds the currently allocated space.
	
	If the requested size in your C program is greater than _amblksiz,
	multiple blocks, each of size _amblksiz, are allocated until the
	request is satisfied. Since the amount of heap space allocated is more
	than the amount requested, subsequent allocations can cause
	fragmentation of heap space. You can control this fragmentation by
	using _amblksiz to change the default memory chunk to whatever value
	you like, as in the following example:
	
	   _amblksiz = 2000;
	
	Since the heap allocator always rounds the DOS request to the nearest
	power of 2 greater than or equal to _amblksiz, the preceding statement
	causes the heap allocator to reserve memory in the heap in multiples
	of 2K (2048 bytes).
	
	Note that adjusting the value of _amblksiz affects both near- and
	far-heap allocation. Adjusting this value has no effect on halloc or
	_nmalloc in any memory model.
