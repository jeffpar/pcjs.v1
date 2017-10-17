---
layout: page
title: "Q23903: Too Much Data or Mixing Memory Models Causes &quot;Fixup Overflow&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q23903/
---

## Q23903: Too Much Data or Mixing Memory Models Causes &quot;Fixup Overflow&quot;

	Article: Q23903
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	Question:
	
	My large model program compiles fine, but I can't link. At that link
	time, I get an L2002 error, "Fixup Overflow." What does this error
	mean and how can I work around it?
	
	Response:
	
	This error occurs when a group is larger than 64K. The first suspect
	for such a problem is DGROUP, into which goes the stack, the near
	heap, and all near data. This can exceed 64K if you have a large
	amount of static or global data initialized by the compiler. This
	problem can be avoided by doing the following:
	
	1. Explicitly force certain items into segments of their own.
	
	2. Use the far keyword.
	
	3. Specify the /Gt compiler option. This places all such data items
	   larger than a given size into their own segments.
	
	If you are trying to mix memory models by applying the near keyword to
	a function used by another module, the code for the function and the
	call will be placed in different segments. A fixup error will occur if
	the segment containing the near address comes before the segment using
	it, or if it is more than 64K away from the start of the segment.
	Removing the near keyword will correct the problem in this case.
