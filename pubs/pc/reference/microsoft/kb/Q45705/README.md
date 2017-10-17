---
layout: page
title: "Q45705: Why There's a 128K Limit on Some Huge Arrays and halloc()s"
permalink: /pubs/pc/reference/microsoft/kb/Q45705/
---

## Q45705: Why There's a 128K Limit on Some Huge Arrays and halloc()s

	Article: Q45705
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC S_QuickASM
	Last Modified: 21-AUG-1989
	
	Question:
	
	Why am I limited to allocating 128K with halloc() or a huge array
	unless the size of the elements I am using is a power of 2?
	
	Response:
	
	With huge pointers and arrays, the Microsoft C Compiler produces
	32-bit pointer arithmetic only when accessing whole elements. Only the
	16-bit offset of a pointer is used when accessing the individual
	members of elements. This technique is used in the interest of speed
	and smaller code size. However, it assumes that elements do not extend
	from the end of one segment into the beginning of the next. When
	crossing a 64K segment boundary, elements must end evenly with the end
	of that segment. The following diagram illustrates the conditions
	necessary for huge pointers and arrays:
	
	                         Seg1 Seg2
	     Segment 1               FFFF 0000               Segment 2
	     ----------------------------+----------------------------
	    ......| Elem | Elem  | Elem  + Elem  | Elem  | Elem  |.....
	    ......| X     | X+1  | X+2   + X+3   | X+4   | X+5   |.....
	     ----------------------------+----------------------------
	                                 ^ Elements must not cross
	                   a segment boundary.
	
	If an element's size is not a power of 2, an array of that element
	will not fit evenly into a 64K segment. This is the root of the 128K
	limitation. To avoid breaking an element across a segment boundary in
	this case, extra space is left at the beginning of the first segment,
	pushing the entire array upwards in memory so that the element before
	the one that would have spanned the segment boundary ends exactly at
	the segment ending. The element that would have spanned the segment
	boundary is pushed to the beginning of the second segment.
	
	If the allocated elements do not fit evenly into a segment, there can
	be only one segment boundary onto which they fall evenly. The function
	halloc() uses the element size it is passed to calculate and return a
	pointer with an offset that results in the allocated elements falling
	evenly on this boundary. The following diagram demonstrates the way
	this is done and what can happen at the end of the second segment:
	
	        Segment 1                     Segment 2
	        0000           FFFF 0000           FFFF
	     +----------------------+-------------------+
	     +Pad |Elem |Elem |Elem +Elem |Elem |Elem | +
	     +----------------------+-------------------+
	      ^   ^                                   ^
	      ^   ^                                   Next element will not fall
	      ^   ^                                   on segment bounds.
	      ^   ^
	      ^   Offset returned to allow elements to fall on segment bounds.
	      ^
	      Padding area used to force element boundary to fall on segment
	      boundary
	
	These restrictions should also be considered when allocating memory
	for very large elements. For example, a request for three 33K
	structures will fail. Two of the structures could be allocated, but
	since each would go into a separate segment, neither of the segments
	would contain enough space for the third element.
