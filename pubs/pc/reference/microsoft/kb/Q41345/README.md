---
layout: page
title: "Q41345: Calculating Available Memory in Large Model"
permalink: /pubs/pc/reference/microsoft/kb/Q41345/
---

	Article: Q41345
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G890215-12018
	Last Modified: 16-MAY-1989
	
	Question:
	
	I am using large-memory model (C Version 5.10). My program makes a
	call to the _memavl() function to see how much memory is remaining. I
	get back some number (e.g. 29320 bytes). Then I malloc some buffers
	for linked lists, data structures and place another call to _memavl. I
	get the same number back.
	
	Shouldn't the number get smaller after I have malloc'd memory?
	
	Is there a way for me to find out how much free memory (total) is
	available?
	
	Response:
	
	There are actually two memory-allocation heaps when you're using large
	model. The near heap is the unused portion of the 64K DGROUP segment.
	The far heap is the unused memory above your program. malloc() uses
	the near heap for small and medium models and the far heap for
	compact, large, and huge models. (You can choose which heap to use by
	using _fmalloc() for the far heap and _nmalloc() for the near heap.)
	
	The _memavl() function only measures the amount of memory available
	on the near heap. Because the near heap is not used in far model until
	the far heap is exhausted, _memavl() shouldn't change.
	
	To measure the amount of memory available on the far heap, you can
	use the _dos_allocmem() function. (This function calls the DOS
	memory-allocation function.) Pass the function 0xFFFF for the number
	of 16-byte paragraphs to allocate (which is 1 megabyte more memory
	than the machine has) and the address of an unsigned int. When the
	function returns, the unsigned int whose address you passed will
	contain the paragraph size of the largest contiguous block in the far
	heap. To find the number of bytes, multiply this by the 16L, which is
	the size of a paragraph. (Use 16L rather than 16 so that the
	multiplication will be done using long math, avoiding possible
	overflow.)
	
	The total memory available is the sum of the amount available on the
	far and near heaps. For best accuracy, you should do this calculation
	immediately after your program begins.
	
	There are a few traits of the malloc() allocation you should be aware
	of, as follows:
	
	1. malloc() does NOT call DOS for each small allocation. Instead, it
	   asks DOS for an 8K block (this size can be set by setting the
	   global variable _amblksiz, as described on Page 33 of the
	   "Microsoft C Run-Time Library Reference"), then allocates from this
	   block. If the requested allocation is more than than 8K, malloc
	   allocates enough 8K blocks to fulfill the allocation. Before
	   malloc() asks DOS for memory, it first tries to allocate the
	   request from memory it already has.
	
	2. free() NEVER returns memory to DOS. So, if you allocated a block,
	   checked the far heap space using _dos_allocmem(), free()'d the
	   block and checked again, the amount of memory available to DOS
	   would NOT increase on the second call. You can get a better idea of
	   how much memory is available by using _fheapwalk() to find out how
	   much memory is available to malloc() but not to DOS.
	
	Note: halloc() calls DOS directly and frees directly to DOS.
	
	A program that calculates an estimate of the total amount of free
	memory follows:
	
	#include <malloc.h>
	#include <dos.h>
	#include <stdio.h>
	
	void main(void)
	{
	long totalavail;
	unsigned farparaavail;
	
	    _dos_allocmem(0xFFFF, &farparaavail);
	
	    totalavail = (long)farparaavail * 16L + _memavl();
	
	    printf("Total memory available is about %ld bytes\n", totalavail);
	
	}
