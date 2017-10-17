---
layout: page
title: "Q26494: &quot;Subscript Out of Range&quot; for Array &gt; 128K; Gaps in Far Heap"
permalink: /pubs/pc/reference/microsoft/kb/Q26494/
---

## Q26494: &quot;Subscript Out of Range&quot; for Array &gt; 128K; Gaps in Far Heap

	Article: Q26494
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 26-OCT-1989
	
	The program below, which is compiled with the /ah option (in QB.EXE or
	BC.EXE) to support a huge (larger than 64K) array, produces a
	"Subscript out of range" message for an array larger than 128K, even
	though the FRE(-1) function indicates that there should be enough
	available memory.
	
	To make an array larger than 128K and avoid the "Subscript out of
	range" message, the number of bytes in a single element of the huge
	array must be a power of 2 (i.e., evenly divisible into 64K), as
	explained below.
	
	This information applies to the Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50 for MS-DOS and to Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and MS OS/2.
	
	Space is allocated for a huge array contiguously in far heap, with the
	restriction that no single array element (or record) is allowed to be
	split across a 64K boundary. If a record size is not a power of 2, the
	array is allocated at an offset high enough, relative to the array's
	base segment address (returned by the VARSEG function), such that no
	array element is split across the boundary at exactly 64K above the
	base segment. The value returned by the VARPTR function for the first
	element of the array then indicates both the offset of the array, and
	also the size of a gap created in far heap. The size of the gap is
	also equal to (65,536) MOD (array record size). This gap fragments far
	heap, and is wasted, unused memory. In the worst case, the gap can be
	up to (array record size) minus 1 in size.
	
	A "Subscript out of range" error occurs when allocating a huge array
	larger than 128K if the array elements have a size that is not an even
	power of 2. Arrays larger than 128K must have an element (or record)
	size that is a power of 2 (2, 4, 8, 16, 32, 64, etc.), since arrays
	must be stored contiguously and no single array element is allowed to
	span across a 64K boundary.
	
	You can compensate for this limitation by padding each array element
	to a size that can be evenly divided into 64K (i.e., a power of 2,
	such as 4, 8, 16, 32, 64, 128, or 512 bytes), as shown in the example
	below.
	
	A huge array must be DIMensioned as a dynamic array, either with a
	variable in the array subscript or with the preceding metacommand
	REM $DYNAMIC. The /AH option allows dynamic arrays of user-defined
	types, fixed-length strings, and numeric data to occupy all of
	available memory.
	
	The following example shows how to work around the "Subscript out of
	range" error message:
	
	DEFINT A-Z
	TYPE test
	   a   AS DOUBLE         ' 8 bytes.
	   b   AS STRING * 288   ' 288 bytes.
	   PAD AS STRING * 216   ' Must pad to make 512-byte total record size
	END TYPE
	max = 453
	REM $DYNAMIC
	DIM x(1 TO max)  AS test
	END
	
	Note that huge (larger than 64K) arrays are not available in versions
	of QuickBASIC earlier than Version 4.00.
	
	The following code example demonstrates the "Subscript out of range"
	error message:
	
	DEFINT A-Z
	TYPE test
	   a  AS DOUBLE         ' uses 8 bytes
	   b  AS STRING * 288   ' uses 288 bytes
	END TYPE
	max = 453
	REM $DYNAMIC
	PRINT FRE(-1)                ' prints free heap space
	DIM x(1 TO max)  AS test     ' 453 * (288 + 8) = 134088 bytes used
	PRINT FRE(-1),"AFTER DIM"
	END
