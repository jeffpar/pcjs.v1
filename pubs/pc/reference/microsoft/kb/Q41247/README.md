---
layout: page
title: "Q41247: Use Huge Pointers If Object Is Larger Than 64K Boundary"
permalink: /pubs/pc/reference/microsoft/kb/Q41247/
---

	Article: Q41247
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | SR# G890201-11081
	Last Modified: 16-MAY-1989
	
	Question:
	
	I'm declaring a pointer that points into an array by saying the
	following:
	
	  char huge carray[70000];
	  char *pchar = carray;
	
	I compile the program using large-memory model.
	
	When I access the array using carray, everything work correctly.
	However, when I use the pointer pchar, I can't seem to access the
	array past the 64K boundary. What's wrong?
	
	Response:
	
	The problem is caused by using a far pointer in a situation where you
	need a huge pointer.
	
	There are three types of data pointers in Microsoft C: near, far, and
	huge. Near pointers represent offsets within DGROUP (the default data
	segment) and are stored in 2 bytes. Far and huge pointers contain both
	a segment address/selector and an offset and therefore take 4 bytes.
	
	Although far and huge pointers are identical in format, the algorithms
	used to do addressing calculations involving these two types of
	pointers are very different. Far pointers are assumed to point to a
	data item that does not cross a segment boundary (in other words, the
	size of the item must be less than 64K). As a result, the compiler
	ignores the segment part of the pointer in all calculations except for
	"equals" and "not equals" tests. This gives a considerable (more than
	2 times) savings in execution time for these operations. In fact,
	calculations involving far pointers are almost as fast as calculations
	involving near pointers.
	
	Huge pointers may point to items that are larger than 64K. The
	addressing arithmetic work on both the segment and the offset, if
	necessary. Huge pointer arithmetic is therefore considerably slower
	than far arithmetic, but it has the advantage of working when the data
	item is larger than 64K.
	
	Your code should work correctly if you declare pchar to be a huge
	pointer rather than a far (default for large-memory model) pointer. If
	you didn't want to add the huge keyword to the declaration, you could
	compile with the /AH option. It is recommended to use the huge keyword
	rather than /AH because it allows you to control when huge arithmetic
	is performed -- if you use /AH, then ALL pointers are huge.
