---
layout: page
title: "Q35295: Getting the Address of a Function with FP_SEG and FP_OFF"
permalink: /pubs/pc/reference/microsoft/kb/Q35295/
---

	Article: Q35295
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	To get the address of a function, you may set a pointer to the
	function by using FP_SEG and FP_OFF to get the segment and offset
	for the function.
	
	The following sample code demonstrates this process:
	
	#include <dos.h>
	#include <stdio.h>
	
	int foo();
	int (*foo_ptr)();
	unsigned int seg_val;
	unsigned int off_val;
	
	void main(void);
	void main(void)
	{
	    /* set the pointer to the function */
	    foo_ptr = foo;
	
	    /* use FP_SEG() and FP_OFF() to get segment and offset */
	    seg_val = FP_SEG(foo_ptr);
	    off_val = FP_OFF(foo_ptr);
	    printf("Segment is %d; Offset is %d\n", seg_val, off_val);
	}
	
	int foo()
	    {}
