---
layout: page
title: "Q44078: Allocation of Variables within Blocks in C"
permalink: /pubs/pc/reference/microsoft/kb/Q44078/
---

## Q44078: Allocation of Variables within Blocks in C

	Article: Q44078
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 23-MAY-1989
	
	The "Microsoft C for the MS-DOS Operating System: Language Reference"
	manual in Section 3.5.2 states the following:
	
	   An item with a local lifetime (a "local item") has storage and a
	   defined value only within the block where the item is defined or
	   declared. A local item is allocated new storage each time the
	   program enters that block, and it loses its storage (and hence its
	   value) when the program exits the block.
	
	This statement is true for function blocks. All nonstatic variables
	within a function, whether they are within a block or not, are
	allocated space from the stack upon entry to the function.
	
	According to the ANSI standard, the C language should support jumps
	into blocks. To ensure that variables always are allocated, regardless
	of the entry point into the block, the space for local variables
	within a block must be allocated upon entry of the function, not the
	block. Consider the following code example:
	
	int checkup (int var)
	{
	      .
	      .
	      .
	    if (var)
	       goto test2;
	    else
	    {
	       char buffer[80];
	         strcpy (buffer, "This is a different test");
	       test1:
	         strcpy (buffer, "This is a test");
	           .
	           .
	           .
	    }
	    test2:
	       printf("testing stuff is coming up next");
	       goto test1;
	    return (0);
	}
	
	Although this is not the best way to implement this code sample, this
	method should be legal, according to the ANSI standard. If the block
	is entered through the label test1, and the array of characters has
	not been allocated on the stack previously, the strcpy after the test1
	label does not work properly. To ensure that "buffer" is allocated
	space, it is allocated stack space upon entry to the function, and not
	upon entry to the block.
	
	Note: The 80-character buffer is removed from the stack upon exit from
	the block, and not upon exit from the function.
