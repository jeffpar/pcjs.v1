---
layout: page
title: "Q37548: Using CodeView to Examine FORTRAN Arrays"
permalink: /pubs/pc/reference/microsoft/kb/Q37548/
---

## Q37548: Using CodeView to Examine FORTRAN Arrays

	Article: Q37548
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 14-AUG-1989
	
	Question:
	
	I have allocated memory for a three-dimensional array in FORTRAN. How
	can I examine the contents of a row using CodeView?
	
	Response:
	
	You can use CodeView to display a single element of the array using
	?arrayname(x,x,x), where "arrayname" consists of the first six
	characters of the array name and "(x,x,x)" must be a valid cell in the
	array.
	
	There is no way to display more than one cell of the array using this
	command. To display many cells, you must do a memory dump of the
	addresses where the array is stored. Use the examine command (X) to
	get the starting address of the array, and dump (D) to dump the
	elements.
	
	FORTRAN stores array elements in column-major order. Use the following
	formula to determine the address where any cell (i,j,k) is stored,
	where Max_Row is the maximum i possible and Max_Col is the maximum j
	possible:
	
	    MemAddr = start_addr+(size of elements)*
	                     (Max_Row((k-1)(Max_Col)+(j-1))+(i-1))
	
	"Size of elements" is the number of bytes of each element in the
	array.
