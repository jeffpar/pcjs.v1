---
layout: page
title: "Q47958: Patching malloc() to Reuse Memory within an Allocated Block"
permalink: /pubs/pc/reference/microsoft/kb/Q47958/
---

	Article: Q47958
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 16-JAN-1990
	
	The malloc() family of functions properly reuse the blocks of memory
	that they allocate from DOS. The size of a block that malloc()
	allocates is 8K bytes by default, but can be modified by assigning a
	different block size in bytes to the C run-time library variable
	"_amblksiz", as noted on Page 33 of the "Microsoft C 5.1 Optimizing
	Compiler Run-Time Library Reference."
	
	However, for small suballocations of "chunks" (author's terminology)
	within an 8K block, previously freed chunks will not be immediately
	reused and fragmentation within blocks can occur; this can cause DOS
	programs that make many small (e.g. 10-byte) allocations to
	prematurely run out of memory. This problem occurs because the "rover"
	pointer that points to the next chunk of memory to be allocated points
	to the memory after the last chunk allocated without being set to
	point to the beginning of chunks that were freed.
	
	Reducing the size of allocated blocks by declaring _amblksiz as above
	and assigning values under 8096 to it may help reduce fragmentation
	within blocks in some cases simply because there is less memory to
	lose to fragmentation per block and your allocations and frees are
	more likely to be on reusable block boundaries.
	
	A better alternative would be to allocate large blocks yourself, then
	perform your own memory management within them to prevent
	fragmentation within blocks.
	
	For those who purchase the C run-time library source code for C 5.10
	available through our Sales department at (800) 426-9400, you can
	force the rover pointer to point at the bottom of the block prior to a
	memory request as noted below, so that any adequately large freed
	chunks will be reused. This technique will result in executable speed
	degradation, but will more fully allocate the last bytes of memory.
	
	To change the behavior of the rover pointer to reallocate freed chunks
	of memory within a block, make the following change to line 83 of
	AMALLOC.ASM, the workhorse module called by malloc() functions:
	
	1. Delete or comment out line 83 with a semicolon (;), as follows:
	
	    ;   mov     si,[bx].roveroff; si = starting rover offset
	
	2. Replace the line above with the following two lines:
	
	        mov     si,[bx].bottom
	        mov     [bx].roveroff,si ;*** put rover at bottom each time
	
	3. Reassemble AMALLOC.ASM with MASM, as follows
	
	        masm /Mx /Dmem_L amalloc;
	
	   where the /Mx option preserves symbol name case sensitivity, and
	   /Dmem_L defines the constant to indicate large memory model for
	   pointers defined by macros in AMALLOC.ASM and other .ASM files used
	   for the C library. The constant "mem_L" is for large model, "mem_S"
	   for small, "mem_C" for compact, and "mem_M" is for medium model.
	
	4. Either link with the new AMALLOC.OBJ (and /NOE), or use lib to
	   replace the module in the appropriate memory model library, as
	   follows:
	
	        lib llibcer.lib -+amalloc;
