---
layout: page
title: "Q67036: ANSI Spec Says Taking Address of register Array is Not Allowed"
permalink: /pubs/pc/reference/microsoft/kb/Q67036/
---

## Q67036: ANSI Spec Says Taking Address of register Array is Not Allowed

	Article: Q67036
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | S_QUICKC buglist6.00 buglist6.00a
	Last Modified: 19-JAN-1991
	
	According to the ANSI specification, you may not explicitly or
	implicitly compute the address of an object declared with register
	storage-class. Yet, the C and QuickC compilers DO allow you to take
	the address of such an array declared with register storage-class. The
	only operator that should be allowed to be used with these types of
	arrays is sizeof.
	
	The sample code below should give an error according to ANSI but no
	errors or warnings are generated.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and QuickC versions 2.50 and 2.51 (buglist2.50 and buglist2.51).
	We are researching this problem and will post new information here as
	it becomes available.
	
	Sample Code
	-----------
	
	void main(void)
	{
	    register int array[10]; /* declared w/register storage-class */
	    int *ptr;
	
	    /* According to ANSI, none of the following should be allowed */
	
	    ptr = array;         /* implicit address computation of array */
	    ptr = &array[0];     /* explicit address computation with '&' */
	    ptr = array + 5;     /* computation based on address of array */
	}
	
	In Section 3.5.1 of the ANSI specification, there is a footnote (55)
	that includes the following information:
	
	    ...whether or not addressable storage is actually used, the
	    address of any part of an object declared with storage-class
	    specifier register may not be computed, either explicitly (by
	    use of the unary & operator) or implicitly (by converting an
	    array name to a pointer). Thus the only operator that can be
	    applied to an array with storage-class specifier register is
	    sizeof.
