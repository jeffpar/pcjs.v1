---
layout: page
title: "Q32998: malloc May Truncate Request More Than 64K"
permalink: /pubs/pc/reference/microsoft/kb/Q32998/
---

	Article: Q32998
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 19-JUL-1988
	
	When trying to allocate memory with malloc() and calloc(), the
	request for memory will be truncated if it exceeds 64K.
	   The maximum number of bytes that can be allocated by malloc is less
	than 64K because the allocation routines will consume a certain number
	of bytes to track memory allocation within the segment. The maximum
	number of bytes you can allocate using malloc or calloc is
	approximately 65516.
	   Requests for more than 65516 bytes and less than 64K will result in
	malloc returning NULL. Requests for more than 64K will potentially
	return a pointer but it will be a pointer to a block of a size other than
	that requested because the parameter passed to malloc is an unsigned
	integer. This integer has a maximum value of 64K; passing a number greater
	than this value will result in undefined behavior. If malloc is passed a
	parameter greater than 64K, the compiler will issue a data-conversion
	warning, which should be heeded.
	   If you require more than about 65516 bytes for a single allocation,
	you should use halloc().
	
	   The following program demonstrates the behavior described above:
	
	#include <stdio.h>
	#include <malloc.h>
	
	int *intarray;
	
	main()
	{
	    intarray= (int *)malloc(32768*sizeof(int));
	    if (intarray == NULL)
	        printf("not enough memory, no allocation");
	    else
	        printf("memory allocated");
	
	    intarray= (int *)malloc(32767*sizeof(int));
	    if (intarray == NULL)
	        printf("not enough memory, no allocation");
	    else
	        printf("memory allocated");
	
	}
