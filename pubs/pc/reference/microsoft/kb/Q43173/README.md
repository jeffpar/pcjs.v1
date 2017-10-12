---
layout: page
title: "Q43173: Using printf with %p in Small or Medium Model"
permalink: /pubs/pc/reference/microsoft/kb/Q43173/
---

	Article: Q43173
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-MAY-1989
	
	When using the %p format in the C Run-Time Library function printf()
	in the small or medium memory model, the corresponding argument must
	be cast to a far pointer. If the argument is not cast to a far
	pointer, the segmented address of the pointer will not be displayed
	correctly.
	
	This behavior occurs because printf does not have a formal parameter
	list that will automatically cause the type conversion to take place.
	In small or medium memory model, a pointer argument will be pushed
	onto the stack as a near address if it is not cast to a far pointer,
	i.e., only the offset is pushed onto the stack. At run time, printf
	sees %p and then assumes both the segment and the offset for the
	corresponding argument are pushed onto the stack. This action causes
	the function to print an incorrect segment for that argument.
	Explicitly casting the argument to a far pointer will force the
	segment address to be pushed onto the stack as well.
	
	The following program will point the wrong content of the variable ch:
	
	/* sample program */
	#include <stdio. h>
	
	char ch[1] ;
	void main (void)
	{
	printf ("ch = %p\n", ch) ;    /* wrong !! */
	}
	/* end of sample program */
	
	The following is the correct statement in small and medium model:
	
	    printf ("ch = %p\n", (char far *) ch) ;
