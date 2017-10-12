---
layout: page
title: "Q29197: Why Pointer Subtraction Gives Signed Results"
permalink: /pubs/pc/reference/microsoft/kb/Q29197/
---

	Article: Q29197
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 14-MAR-1990
	
	Pointer subtraction is performed in signed arithmetic. This can
	become confusing when the pointers being subtracted are more than 32K
	apart, because the result becomes a negative number.
	   This is correct behavior for the C language as documented in the
	"Microsoft C Language Reference Manual" and the ANSI C Draft Proposed
	Standard.
	
	   Consider the following code fragment:
	
	        long size;
	        char *ptr1, *ptr2;
	        if (size < (ptr2 - ptr1))
	          ...
	   If the size is 32000, ptr1 is 0, and ptr2 is 33000, then ptr2 minus
	ptr1 exceeds the range of a signed value and is therefore negative.
	The comparison size (ptr2 - ptr1) is false, even though ptr1 and ptr2
	are 33000 elements apart.
	   This situation is documented on Page 124 of the "Microsoft C
	Language Reference Manual," (Version 5.00 and Version 5.10) which says
	the following:
	
	   "When two pointers are subtracted, the difference is converted to a
	signed integral value by dividing the difference by the size of a
	value of the type that the pointers address. The size of the integral
	value is defined by the type ptrdiff_t in the standard include file
	stddef.h."
	
	   This also is documented on Page 3.3.6 of the November 9, 1987,
	edition of the Draft Proposed ANSI C Standard, which states the
	following:
	
	   "The size of the result is implementation-defined, and its type (a
	signed integral type) is ptrdiff_t defined in the <stddef.h> header.
	As with any other arithmetic overflow, if the result does not fit in
	the space provided, the behavior is undefined."
	
	   If you want to think of these pointers as unsigned quantities, you
	can typecast them as follows:
	
	        long size;
	        char *ptr1, *ptr2;
	        if (size < ((unsigned) ptr2 - (unsigned) ptr1))
	          ...
