---
layout: page
title: "Q50297: Calculating Available Memory in Large Model"
permalink: /pubs/pc/reference/microsoft/kb/Q50297/
---

	Article: Q50297
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickAsm
	Last Modified: 17-JUL-1990
	
	Question:
	
	I am using large-memory model (C Version 5.10). My program makes a
	call to the _memavl() function to see how much memory is remaining. I
	get back some number (for example, 29,320 bytes). Then I malloc some
	buffers for linked lists, data structures, and place another call to
	_memavl. I get back the same number.
	
	Shouldn't the number get smaller after I have malloc'd memory?
	
	Is there a way for me to find out how much free memory (total) is
	available?
	
	Response:
	
	There are two memory-allocation heaps when you're using large model.
	The near heap is the unused portion of the 64K DGROUP segment. The far
	heap is the unused memory above your program. malloc() uses the near
	heap for small and medium models and the far heap for compact, large,
	and huge models. [You can choose which heap to use by using _fmalloc()
	for the far heap and _nmalloc() for the near heap.]
	
	The _memavl() function measures only the amount of memory available on
	the near heap. Because the near heap is not used in far model until
	the far heap is exhausted, _memavl() does not necessarily change.
	
	To measure the amount of memory available on the far heap, you can use
	the _dos_allocmem() function. (This function calls the DOS
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
	
	The following are a few traits of the malloc() allocation family of
	which you should be aware:
	
	1. malloc() does NOT call DOS for each small allocation. Instead, it
	   asks DOS for an 8K block (this size can be set by setting the
	   global variable _amblksiz, as described on Page 33 of the
	   "Microsoft C Run-Time Library Reference"), then allocate from this
	   block. If the requested allocation is more than than 8K, malloc
	   allocates enough 8K blocks to fulfill the allocation. Before
	   malloc() asks DOS for memory, it first tries to allocate the
	   request from memory it already has.
	
	2. free() NEVER returns memory to DOS. So, if you allocated a block,
	   checked the far heap space using _dos_allocmem(), free()'d the
	   block and checked again, the amount of memory available to DOS
	   would NOT increase on the second call. You can get a better idea of
	   how much memory is available by using _heapwalk() to find out how
	   much memory is available to malloc() but not to DOS.
	
	Note: halloc() calls DOS directly and frees directly [using hfree()]
	back to DOS.
	
	A program that calculates an estimate of the total amount of free
	memory follows:
	
	Sample Program
	--------------
	
	#include <malloc.h>
	#include <dos.h>
	#include <stdio.h>
	
	void main(void)
	{
	long farheap = 0, total_free, available;
	unsigned farparaavail;
	struct _heapinfo hinfo;
	int heapstatus;
	
	  /* Calculates the total memory available in the far heap       */
	
	  hinfo._pentry = NULL;
	  while ((heapstatus = _heapwalk(&hinfo)) == _HEAPOK)
	         if (!hinfo._useflag)
	                farheap += hinfo._size;
	
	  /* _dos_allocmem will return the maximum block size available */
	  /* _memavl() will return the maximum memory in the near heap  */
	
	  _dos_allocmem(0xFFFF, &farparaavail);
	  available = (long)farparaavail * 16L + _memavl();
	
	  /* Total memory available for allocation */
	
	  total_free = farheap + available;
	  printf("Total memory available is about %ld bytes\n", total_free);
	}
	
	The total memory calculated in the far heap may not be in a contiguous
	block. To see whether or not memory has been fragmented, add the
	following line to the while loop:
	
	   printf ("%6s block at %p of size %4.4X\n,
	   (hinfo._useflag == _USEDENTRY ? "USED" : "FREE"),
	   hinfo._pentry, hinfo._size);
	
	To see how fragmented the near heap is, change the _heapwalk() in the
	while statement to _nheapwalk(). This forces the function to do a heap
	walk on the near heap. The _heapwalk() defaults to the following:
	
	   _fheapwalk in Compact and Large model
	   _nheapwalk in Medium and Small model
