---
layout: page
title: "Q12159: Questions and Answers About the Use of malloc() and _fmalloc()"
permalink: /pubs/pc/reference/microsoft/kb/Q12159/
---

	Article: Q12159
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	Question:
	
	I am designing a product using the medium model, but need some dynamic
	memory larger than the default segment for temporary storage and
	semi-permanent main data structures. Things seem to be working
	properly, but I have the following questions:
	
	1. Can malloc() and _fmalloc() be used together without restriction,
	   for example, using malloc() for the temporary data and _fmalloc()
	   for the semi-permanent data?
	
	2. Are there ever any user-visible delays for garbage collection
	   (compression of string space)?
	
	3. Are there fragmentation risks? In experimenting with _fmalloc(), it
	   appears that contiguous blocks freed at different times are
	   automatically consolidated, which should reduce the fragmentation
	   risk.
	
	4. Does _fmalloc() ensure that any single assignment is within one
	   data segment (so assembly move/access routines need not deal with
	   segment boundaries)?
	
	Response:
	
	1. Yes, malloc() and _fmalloc() may be used together. They both track
	   their memory allocation separately and, in fact, you must use two
	   different functions to free the allocated data: free() and _ffree()
	   respectively.
	
	2. The malloc() functions do not perform any form of garbage
	   collection. You allocate the space and you decide when it is to be
	   freed up for later usage. Therefore, there will be no visible or
	   unexpected time delays during execution.
	
	3. The _fmalloc() function will consolidate adjacent free blocks. This
	   reduces the risk of fragmentation problems.
	
	4. The _fmalloc() function will not allocate across segment
	   boundaries. Only halloc() (the huge-model memory allocation
	   routine) can perform this function. Therefore you are assured that
	   no one allocation will cross a segment boundary (because it cannot
	   allocate larger then 64K).
