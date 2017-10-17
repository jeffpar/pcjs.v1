---
layout: page
title: "Q23977: Creating Pointers to Specific Addresses in Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q23977/
---

## Q23977: Creating Pointers to Specific Addresses in Memory

	Article: Q23977
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 6-FEB-1991
	
	Accessing specific addresses in memory in Microsoft C can be easily
	accomplished by using the FP_SEG and FP_OFF macros or by creating a
	far pointer directly from a long.
	
	The FP_SEG and FP_OFF macros are defined in DOS.H, and can be used to
	set or get the segment and offset of a far pointer.
	
	The following example shows how FP_SEG and FP_OFF could be used to
	create a pointer for directly accessing video memory:
	
	   char far *p;
	   FP_SEG(p) = 0xb800;   /* point to segment of video memory */
	   FP_OFF(p) = 0;        /* set offset to first screen position */
	
	See the C run-time library documentation or online help supplied with
	your compiler for more information on FP_SEG and FP_OFF.
	
	You can also access a specific address in memory by casting a long to
	a far pointer, as in the following example:
	
	   p = (char far *) 0xb8000000L;   /* video memory again */
	
	When converting a pointer to or from a long, the upper 16 bits hold
	the segment and the lower 16 bits hold the offset.
