---
layout: page
title: "Q28244: Using qsort() to Sort on Multiple Fields Within a Structure"
permalink: /pubs/pc/reference/microsoft/kb/Q28244/
---

	Article: Q28244
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                    |
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	Question:
	
	I can sort on one structure member using the function qsort(). How can
	I sort on two or more structure members?
	
	Response:
	
	The library routine qsort() does not place any limits on how items are
	compared. When qsort needs to decide if one element is equal to,
	greater than, or less than another element, it calls a compare
	function which you write. Therefore, if you want to sort an array of
	structures by comparing multiple fields within the structures, you
	need to write a compare function that examines the appropriate fields
	of each structure being compared, then return a compare value
	indicating which was greater.
