---
layout: page
title: "Q50004: Example of Saving Numeric Array to Disk Using BLOAD and BSAVE"
permalink: /pubs/pc/reference/microsoft/kb/Q50004/
---

## Q50004: Example of Saving Numeric Array to Disk Using BLOAD and BSAVE

	Article: Q50004
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891017-63  B_BasicCom
	Last Modified: 12-DEC-1989
	
	The program below demonstrates how to BSAVE a numeric array as a
	memory image file to disk and how to BLOAD the array from disk into a
	new array in memory.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft PDS Version 7.00 for MS-DOS.
	
	The BSAVE statement allows you to copy the contents of a memory
	location to a memory-image file on disk. A memory-image file is a
	byte-for-byte copy of what is in memory along with control information
	used by BLOAD to load the file. The program below initializes an
	array, transfers the contents of it to an output file using BSAVE,
	erases that array from memory, and then loads the saved array into a
	new array in memory using BLOAD.
	
	Code Example
	------------
	
	REM $DYNAMIC
	DIM array%(8, 8)       ' 9 elements per dimension.
	FOR i% = 0 TO 8        ' Initialize the array with desired values.
	    FOR j% = 0 TO 8
	        array%(i%, j%) = i% + j%   ' Arbitrary values assigned.
	    NEXT j%
	NEXT i%
	' Set DEF SEG at the segment (paragraph address) of the array:
	DEF SEG = VARSEG(array%(0, 0))
	' Specify the output disk file name (JUNK.DAT), the offset of the
	' starting address of the area in memory to be saved, and the number
	' of bytes to save (9*9*2 is 162 bytes):
	BSAVE "Junk.dat", VARPTR(array%(0, 0)), 162
	DEF SEG                'Restore BASIC segment to default
	PRINT "After save"
	ERASE array%
	DIM array2%(8, 8)      ' Dimension new array.
	DEF SEG = VARSEG(array2%(0, 0))   ' Set DEF SEG for subsequent BLOAD.
	BLOAD "Junk.dat", VARPTR(array2%(0, 0))   ' Reloads the array.
	FOR j% = 0 TO 8
	    FOR i% = 0 TO 8
	        PRINT array2%(i%, j%);   ' Confirms array is reloaded.
	    NEXT i%
	    PRINT
	NEXT j%
	
	The following is the output for this program:
	
	After save
	 0  1  2  3  4  5  6  7  8
	 1  2  3  4  5  6  7  8  9
	 2  3  4  5  6  7  8  9  10
	 3  4  5  6  7  8  9  10  11
	 4  5  6  7  8  9  10  11  12
	 5  6  7  8  9  10  11  12  13
	 6  7  8  9  10  11  12  13  14
	 7  8  9  10  11  12  13  14  15
	 8  9  10  11  12  13  14  15  16
