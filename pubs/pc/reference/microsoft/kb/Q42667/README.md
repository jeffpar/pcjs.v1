---
layout: page
title: "Q42667: Accessing Huge Array (Larger Than 64K) Can Hang 386 Computers"
permalink: /pubs/pc/reference/microsoft/kb/Q42667/
---

## Q42667: Accessing Huge Array (Larger Than 64K) Can Hang 386 Computers

	Article: Q42667
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 SR# S890227-131
	Last Modified: 26-FEB-1990
	
	The program shown below, which works correctly on computers using
	8088, 8086, and 80286 processors, causes many computers using the
	80386 processor to hang when a huge array exceeds 64K and leaves a gap
	with an odd number of bytes in far heap. If the gap is an even number
	of bytes, the problem does not occur. You can also work around the
	problem by making the array record size a power of 2, so that no gap
	is created in far heap.
	
	To obtain the size of the gap, calculate the quantity (65,536) MOD
	(array record size) or obtain the value returned by the VARPTR
	function invoked for the first array element.
	
	This problem occurs in QuickBASIC Versions 4.00, 4.00b, and 4.50 for
	MS-DOS and in Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This problem was
	corrected in Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	To duplicate the problem, compile the following program with BC /AH or
	QB /AH, and run it on a computer that has an Intel 80386 chip.
	
	Code Example
	------------
	
	' $DYNAMIC
	DIM a(4000) AS STRING * 25
	FOR x% = 1 TO 4000
	  PRINT a(x%); x%
	NEXT
	
	Note: The 80386 computers hang after printing the array element number
	2619. Therefore, the hang occurs as the program accesses element
	number 2620, which is 2621 elements from the start (starting at
	element 0). Each element is 25 characters long, and the program hangs
	after byte position 65,525 (25 * 2621), which is immediately before
	the 64K (65,536-byte) boundary.
	
	Array elements cannot be split across the 65,536-byte (64K) boundary;
	thus, an 11-byte (odd-length) gap is automatically created in front of
	the array within far heap so the array can be aligned exactly at a 64K
	boundary. When the gap has an odd length, the 80386 computer hangs.
	When the gap has an even length (such as by using an array of
	STRING*26), the program runs correctly.
	
	Background Information for Huge Arrays
	--------------------------------------
	
	Space is allocated for a huge array contiguously in far heap, with the
	restriction that no single array element (or record) is allowed to be
	split across a 64K boundary. If a record size is not a power of 2, the
	array is allocated at an offset high enough, relative to the array's
	base segment address (returned by the VARSEG function), so that no
	array element is split across the boundary at exactly 64K above the
	base segment. The value returned by the VARPTR function for the first
	element of the array then indicates both the offset of the array and
	the size of a gap created in far heap. The size of the gap is also
	equal to <65,536> MOD <array record size>. This gap fragments far heap
	and is wasted, unused memory. In the worst case, the gap can be up to
	<array record size> minus 1 in size.
	
	A "Subscript Out of Range" message correctly displays when allocating
	a huge array larger than 128K if the array elements have a size that
	is not an even power of 2. Arrays larger than 128K must have an
	element (or record) size that is a power of 2 (2, 4, 8, 16, 32, 64,
	etc.), since arrays are stored contiguously and no single array
	element is allowed to span across a 64K boundary.
	
	A huge array must be DIMensioned as a dynamic array, either with a
	variable in the array subscript or with a preceding metacommand REM
	$DYNAMIC. The /AH option allows dynamic arrays of user-defined TYPEs,
	fixed-length strings, and numeric data to occupy all of available
	memory.
	
	Huge (larger than 64K) arrays are not available in versions of
	QuickBASIC earlier than Version 4.00.
	
	Additional reference word: B_BasicCom
