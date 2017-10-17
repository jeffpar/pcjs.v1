---
layout: page
title: "Q45584: Can't Take Address of Frame Variable in DLL (SS!=DS)"
permalink: /pubs/pc/reference/microsoft/kb/Q45584/
---

## Q45584: Can't Take Address of Frame Variable in DLL (SS!=DS)

	Article: Q45584
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | SR# G890605-19757
	Last Modified: 25-JUL-1989
	
	Question:
	
	In my .DLL, whenever I take the address of an automatic variable, the
	compiler issues the following warning:
	
	   "address of frame variable taken, DS != SS"
	
	Whenever the DLL is called, it causes a GP fault. What is causing this
	problem and how do I correct it?
	
	When I added "NONSHARED" to the DATA directive in the .DEF file, the
	GP trapping stopped. Why did the trapping stop?
	
	Response:
	
	If you're using small or medium memory model, your pointers are
	2-byte pointers, which contain only the offset of the variable into
	the data segment.
	
	In compact, large, and huge models, pointers are 4 bytes, containing
	both a segment and an offset.
	
	When a .DLL is executing, it uses your stack (normally in your
	data segment) and the .DLL's default data segment. Thus, you must
	compile with /Au or /Aw, telling the compiler that it should not
	assume (as it normally does) that DS (the default data segment
	selector) and SS (the current stack segment selector) are the same.
	
	All near (2-byte) pointers are assumed to be relative to current DS.
	When you take the address of a frame (automatic) variable, this
	address is relative to SS. When SS == DS, as is the usual case, this
	is not a problem. However, it does cause problems in .DLLs, where SS
	cannot be equal to DS.
	
	There is no way to take a near address of a stack variable when
	DS!=SS. You do have several alternatives, however:
	
	1. Change to compact, large, or huge model. Since the pointers are far
	   pointers, you'll be able to represent the address properly. In
	   addition, all the run-time library functions accept such far
	   pointers.
	
	2. Use a far pointer to hold the address. You can do this without
	   changing memory models. This method has the advantage that the only
	   pointer accesses that are slowed are the individual far pointers
	   used to access the stack. The disadvantage is that most small and
	   medium model library routines do not support far pointers, so
	   you must either avoid those routines or copy the far data into
	   the default data segment before calling the routine. Please note
	   that this is only necessary with routines that accept pointers;
	   routines that accept variables by value aren't affected because the
	   value of the expression doesn't change when the pointer size does.
	   It is strongly recommended that you use prototypes and new-style
	   declarations for ALL your functions to prevent errors.
	
	3. Rework the code to avoid the need for taking the address of frame
	   variables.
	
	The reason the trapping seems to stop when you changed the .DEF file
	probably has more to do with the sizes of the segments involved -- in
	one case, the address generated was larger than the maximum for that
	segment; in the other, it happened not to be. In each case, the
	address was wrong because the compiler used DS rather than SS.
	Therefore, changing the data directive in the .DEF file covered up but
	did not correct the error.
	
	.DLL's which use the C Runtime Library **ALWAYS** use NONSHARED
	default data and instance initialization.  Instance initialization is
	specified in the LIBRARY statement of the .DEF file.
