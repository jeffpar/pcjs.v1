---
layout: page
title: "Q33366: How _fheapwalk() Checks the Heap"
permalink: /pubs/pc/reference/microsoft/kb/Q33366/
---

## Q33366: How _fheapwalk() Checks the Heap

	Article: Q33366
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 27-JUL-1988
	
	The following information describes how _fheapwalk() checks the
	heap.
	
	   The _fheapwalk() function traverses those parts of the far heap
	that have been allocated either by fmalloc() or by a system call. This
	process is done by covering one such allocation per call of
	_fheapwalk(), independent of the size of the block allocated.
	   On each call of _fheapwalk(), a manifest-constant int is returned
	as documented on Page 357 of the "Microsoft C 5.1 Optimizing Compiler
	Run-Time Reference Library" manual.
	   Also, a pointer to a structure is returned that contains
	information about the block allocated, which also is documented on
	Page 356 of the C manual.
	   One undocumented feature of the function is that it does not return
	the actual memory address of an _fmalloc()ed block, only the block's
	size.
	   As a result, it is incorrect to assume that the memory location of
	the beginning of a block can be determined by adding up the values of
	the blocks already allocated. The header information in each such
	block is omitted from the structure whose pointer is returned by
	_fmalloc(). In particular, the size of the header is omitted from the
	structure.
