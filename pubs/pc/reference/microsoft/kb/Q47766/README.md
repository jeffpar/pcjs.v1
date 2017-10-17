---
layout: page
title: "Q47766: _amblksiz Affects Memory Allocation in Near and Far Heaps"
permalink: /pubs/pc/reference/microsoft/kb/Q47766/
---

## Q47766: _amblksiz Affects Memory Allocation in Near and Far Heaps

	Article: Q47766
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 16-AUG-1989
	
	The documentation on Page 33 of the "Microsoft C for the MS-DOS
	Operating System: Run-Time Library Reference" states that adjusting
	the value of the global variable _amblksiz has no effect on halloc or
	_nmalloc() in any memory model.
	
	This statement in the manual is incorrect. In fact, _amblksiz is used
	to determine how much to expand both the near heap and the far heap
	segments, and is used by calls to _nmalloc(). The only difference
	between calls to _nmalloc() and _fmalloc is that _nmalloc() doesn't
	actually request memory from DOS, it takes it from the pre-allocated
	heap (in DOS).
	
	However, since the the memory allocated by a call to halloc() is
	maintained independently of the near and far heaps, the value of
	_amblksiz does not affect calls to halloc().
	
	The default value of _amblksiz is 8K (8192) bytes. The variable is
	declared in malloc.h. For more information about the use of _amblksiz,
	refer to the "Microsoft C for the MS-DOS Operating System: Run-Time
	Library Reference," Section 3.2.
