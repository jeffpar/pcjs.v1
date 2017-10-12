---
layout: page
title: "Q32442: _Heapchk() Performs Consistency Check on Heap"
permalink: /pubs/pc/reference/microsoft/kb/Q32442/
---

	Article: Q32442
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JUL-1988
	
	The _heapchk() routine performs a consistency check on the heap by
	examining the header information of the memory blocks in the heap.
	However, it cannot detect corruption of data within the heap's nodes;
	it only can detect corruption of the heap's header information.
	   The _heapchk() routine checks for the following:
	
	   1. It checks to see if any heap has been allocated at all. If not,
	      _heapchk() returns _HEAPEMPTY.
	   2. It checks the beginning of the heap block to see if the first
	      allocation block has been corrupted; if so, it returns _HEAPBADBEGIN.
	      (Note that only the header information is checked.)
	   3. It scans through the far heap block, moving from node to node.
	      For each node, it checks the header information to make sure it has
	      not been corrupted; if so, _heapchk() returns _HEAPBADNODE.
	      Note that the only kind of corruption _heapchk() can detect is an
	      out-of-bounds value in the header; it cannot detect corrupted data
	      within the heap block itself. If the fill value passed is not
	      _HEAPSET_NOFILL, and the block is unallocated, _heapchk() fills
	      memory with the fill value.
	   4. If _heapchk() made it all the way through the heap (i.e., it checked
	      the headers for all nodes), it returns _HEAPOK.
