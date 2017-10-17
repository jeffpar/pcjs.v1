---
layout: page
title: "Q65402: BC /R Makes UBOUND and LBOUND Incorrect for Multi-DIM Array"
permalink: /pubs/pc/reference/microsoft/kb/Q65402/
---

## Q65402: BC /R Makes UBOUND and LBOUND Incorrect for Multi-DIM Array

	Article: Q65402
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | B_QuickBas buglist6.00 buglist6.00b buglist7.00 buglist7.10
	Last Modified: 4-SEP-1990
	
	The UBOUND and LBOUND functions return the upper and lower bounds of
	an array. However, if a program is compiled using the BC /R compiler
	option, which stores multidimensional arrays in row major order, the
	UBOUND and LBOUND functions return incorrect dimension bounds for
	multidimensional arrays.
	
	Microsoft has confirmed this to be a problem with the BC /R option in
	QuickBASIC versions 4.00, 4.00b, and 4.50 (buglist4.00, buglist4.00b,
	buglist4.50) for MS-DOS; in Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2; and in Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and OS/2.
	Microsoft is researching this problem and will post new information
	here as it becomes available.
	
	Note that by default (without the /R option), BC.EXE stores arrays in
	column major order, and the UBOUND and LBOUND functions return correct
	values. Note also that the /R switch cannot be used within QBX.EXE;
	therefore, QBX.EXE can only store arrays in column major order. UBOUND
	and LBOUND work correctly in QBX.EXE.
	
	For more information on using the BC /R compiler switch, query in this
	Knowledge Base on the following words:
	
	   MULTIDIMENSIONAL AND COLUMN AND ROW AND MAJOR
	
	Although the array is stored differently in memory by the /R compiler
	option, the upper and lower bounds of each dimension do not change.
	Therefore the values returned by UBOUND and LBOUND for a given
	dimension are supposed to be the same compiling with or without BC /R.
	
	When a program is compiled with the BC /R switch, the UBOUND and
	LBOUND (for a given dimension) incorrectly return the bounds for the
	opposite dimension. For example, in a two-dimensional array, if you
	request the UBOUND and LBOUND values for the first dimension, the
	values returned will incorrectly be those of the second dimension.
	Requesting the UBOUND and LBOUND values for the second dimension
	incorrectly gives you the bounds for the first dimension.
	
	In an odd-dimensioned array, UBOUND and LBOUND return correct bounds
	for the middle dimension, but incorrect bounds for all other
	dimensions when compiled BC /R. For example, in a three-dimensional
	array, UBOUND and LBOUND for the first dimension incorrectly return
	bounds for the third dimension; UBOUND and LBOUND for the third
	dimension incorrectly return bounds for the first dimension; but
	UBOUND and LBOUND for the second dimension correctly return bounds for
	the second dimension.
	
	Code Example
	------------
	
	The following program example demonstrates the problem:
	
	DIM A(-1 TO 1, -2 TO 2)     ' DIMensions A() as a 2-dimensional array.
	   ' Print lower and upper bound of first dimension:
	PRINT LBOUND(A, 1), UBOUND(A, 1)
	   ' Print lower and upper bound of second dimension:
	PRINT LBOUND(A, 2), UBOUND(A, 2)
	
	Output when compiled without BC /R (correct):
	
	   -1      1
	   -2      2
	
	Output when compiled with BC /R (incorrect):
	
	   -2      2
	   -1      1
