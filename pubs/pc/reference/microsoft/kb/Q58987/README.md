---
layout: page
title: "Q58987: Pointer Arithmetic Wraps Around Segment Ends"
permalink: /pubs/pc/reference/microsoft/kb/Q58987/
---

## Q58987: Pointer Arithmetic Wraps Around Segment Ends

	Article: Q58987
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 1-MAR-1990
	
	When you increment or decrement a pointer beyond a segment boundary,
	the offset of the pointer will wrap around the end. For example, if
	the pointer is sitting at FFFF and you increment it by 1 (one), the
	resulting value of the offset is 0000. This wraparound behavior is
	expected behavior in all memory models except huge. The example below
	demonstrates the "hidden" wraparound.
	
	The C language permits writing beyond array boundaries and heap
	allocations. Consequently, C compilers do not generate warning or
	error messages if an index or pointer goes out of bounds. It is up to
	the programmer to monitor indices and pointers.
	
	If you have an array that is larger than 64K, use the huge keyword or
	compile in the huge memory model. Pointer arithmetic for huge data is
	performed on the full 32 bits of segment and offset address. For
	complete information on huge model programming, refer to Chapter 6 in
	the "Microsoft C Optimizing Compiler User's Guide."
	
	Sample Code:
	
	/* wrap.c */
	#include <stdio.h>
	#include <dos.h>
	#include <malloc.h>
	
	void main (void)
	{
	 char *ptr;
	
	 ptr = (char*) malloc (100);
	 printf ("\nSegment is %u, offset is %u\n", FP_SEG(ptr), FP_OFF(ptr));
	
	 FP_OFF(ptr) = 0x0000;
	 printf ("\nSegment is %u, offset is %u\n", FP_SEG(ptr), FP_OFF(ptr));
	 ptr--;
	 printf ("\nSegment is %u, offset is %u\n", FP_SEG(ptr), FP_OFF(ptr));
	
	 FP_OFF(ptr) = 0xFFFF;
	 printf ("\nSegment is %u, offset is %u\n", FP_SEG(ptr), FP_OFF(ptr));
	 ptr++;
	 printf ("\nSegment is %u, offset is %u\n", FP_SEG(ptr), FP_OFF(ptr));
	}
