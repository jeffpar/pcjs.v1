---
layout: page
title: "Q48401: Multi-DIMensioned Arrays Are in Column Order; BC /R Row Order"
permalink: /pubs/pc/reference/microsoft/kb/Q48401/
---

## Q48401: Multi-DIMensioned Arrays Are in Column Order; BC /R Row Order

	Article: Q48401
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890801-7 B_BasicCom
	Last Modified: 28-DEC-1989
	
	By default, multidimensional arrays are stored in contiguous columns
	in memory (that is, column-major order) in compiled BASIC. With
	column-major order, the leftmost subscript (the row dimension)
	changes the fastest.
	
	You can force executable .EXE programs to store arrays in rows by
	using the BC /R option. However, the /R option (for row-major order)
	is not available in the QB.EXE or the QBX.EXE editor environment. With
	row-major order, the rightmost subscript (the column dimension)
	changes the fastest.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS.
	
	In the DIM X(row,column) statement, arrays are stored by default in
	column order in memory. When looking at a contiguous block of memory
	that is storing a two-dimensional array, you'll find one column stored
	after another. For example, for DIM X(2,2), the array elements are
	stored by default in the following column-major order:
	
	   X(0,0), X(1,0), X(2,0), X(0,1), X(1,1), X(2,1), X(0,2), X(1,2), X(2,2)
	
	If you compile the program with BC /R, you get row-major order, as
	follows:
	
	   X(0,0), X(0,1), X(0,2), X(1,0), X(1,1), X(1,2), X(2,0), X(2,1), X(2,2)
	
	An easy way to demonstrate the storage order is to BSAVE a two-
	dimensional array and then BLOAD the same data into a one-dimensional
	array. You then have a firsthand view of how the array is stored.
	
	Unlike BASIC, Microsoft C defaults to row-major order.
	
	This array-order information is taken from Page 313 of the "Microsoft
	QuickBASIC 4.0: Learning and Using" manual for QuickBASIC Versions
	4.00 and 4.00b, from Page 313 of the "Microsoft BASIC Compiler 6.0:
	Learning and Using Microsoft QuickBASIC" manual for Versions 6.00 and
	6.00b, and from Page 560 of the "Microsoft BASIC 7.0: Programmer's
	Guide" for BASIC PDS Version 7.00.
