---
layout: page
title: "Q61969: Changes to malloc() and the Rover Pointer Behavior in C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q61969/
---

	Article: Q61969
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 11-JUL-1990
	
	Many changes and additions have been made in C version 6.00 concerning
	the heap and heap management. The heap code is completely rewritten
	and, in addition to the new based heap capabilities and new heap
	minimization routines, the malloc() function has undergone several
	important changes. These changes include new malloc() rover pointer
	behavior in the near heap and a different malloc() allocation scheme
	in the far heap.
	
	The internal data layout for the heap is basically the same in C 6.00
	as it is in C 5.10, but all code and control structures are new. In
	the near heap, the malloc() rover pointer is now reset after each
	allocation, so freed memory is always allocated first if enough is
	available to meet a new request. In C 5.10, the rover pointer only
	moves forward, so freed memory is used only after the pointer wraps
	around to the beginning of the heap after it reaches the end of the
	current memory block.
	
	The near heap (in DGROUP) is where programs are usually limited in
	space, so it is considered a viable trade-off to change the rover
	logic to conserve space, rather than maximize speed. For the far and
	based heaps, we still do not reset the rover pointer, since resetting
	it there would take considerably more code than in the near heap,
	resulting in bigger programs and slower execution speed.
	
	A change concerning the far heap is that an attempt is no longer made
	to allocate space on the near heap when far memory is not available.
	In C 5.10, if the far heap does not have enough free memory to satisfy
	a memory request, then the near heap is checked to see if it could
	satisfy the request. In C 6.00, the near heap is not checked, so a
	null pointer is now returned if far memory is not available, even
	though enough near memory may be free.
