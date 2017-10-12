---
layout: page
title: "Q58933: Cannot Allocate More Than 64K with Calloc()"
permalink: /pubs/pc/reference/microsoft/kb/Q58933/
---

	Article: Q58933
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 8-MAR-1990
	
	Although calloc() takes two unsigned integers as parameters, it does
	not allocate more than 64K. Calloc() determines the size you are
	attempting to allocate by multiplying the two arguments. If the size
	is greater than 64K, it will return NULL.
	
	The confusion typically arises because, with malloc(), it is
	impossible to ask for more than 64K due to the size of the argument
	malloc() takes. Malloc() takes an unsigned int as an argument;
	therefore, the largest number you can pass it cannot be greater than
	64K. This is not the case with calloc() -- so one might make the
	assumption that you COULD allocate more than 64K with calloc(). This
	is simply not the case.
