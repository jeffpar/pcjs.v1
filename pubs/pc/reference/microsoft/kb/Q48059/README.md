---
layout: page
title: "Q48059: &quot;String Space Corrupt&quot; If BSAVE Variable-Length-String Array"
permalink: /pubs/pc/reference/microsoft/kb/Q48059/
---

## Q48059: &quot;String Space Corrupt&quot; If BSAVE Variable-Length-String Array

	Article: Q48059
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890724-71 B_BasicCom
	Last Modified: 15-DEC-1989
	
	If you want to use BSAVE and BLOAD with string arrays, you must use an
	array of fixed-length strings. Fixed-length strings are available in
	Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50 for MS-DOS, in
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS, and in
	Microsoft BASIC PDS Version 7.00, but not in earlier versions.
	
	Arrays of variable-length strings CANNOT be BSAVEd to a file, nor can
	a file that was BSAVEd from a variable-length-string array be BLOADed
	into another variable-length-string array. A "String space corrupt"
	error message can display if you attempt to BLOAD a file into a
	variable-length-string array, because the pointers in the BSAVEd
	string descriptors will overlay and tangle existing pointers to string
	space. This is the same mistake as POKEing a spurious value into a
	string descriptor, which can corrupt the integrity of string space.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to
	Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	Each element of variable-length-string array has a 4-byte string
	descriptor composed of an offset (a 2-byte pointer) and length field
	(2 bytes). The array of string descriptors is stored sequentially, but
	the actual contents of the strings are stored separately in the
	dynamic string space. Each 2-byte offset points to a location in the
	string space. The string space memory is very dynamic, and strings are
	given new offsets whenever new string values are reassigned. The
	string contents of an array are not usually adjacent, especially if
	they have been reassigned values. As a result, BSAVEing a certain
	number of bytes does not mean that you've BSAVEd the contents of the
	variable-length-string array.
	
	The following code example attempts to BSAVE a variable-length-string
	array, but generates the error "String Space Corrupt" when run within
	the QuickBASIC QB.EXE Version 4.00, 4.00b, or 4.50 environment.
	
	To work around this situation, create fixed-length-string arrays and
	BSAVE that information. Fixed-length-string space is allocated
	statically and sequentially in memory, and can be BSAVEd and BLOADed.
	
	Code Example
	------------
	
	This example requires Microsoft QuickBASIC Version 4.00, 4.00b, or
	4.50 for MS-DOS, Microsoft BASIC Compiler Version 6.00 or 6.00b for
	MS-DOS, or Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	To alter this program to work correctly, change the DIMension
	statements to create a fixed-length-string array and BSAVE just that
	many bytes.
	
	OPTION BASE 1
	DIM Arr1$(10)   ' Instead, use DIM Arr1(10) AS STRING*20
	DIM Arr2$(10)   ' Instead, use DIM Arr2(10) AS STRING*20
	StrDesc% = 4
	ArrayLength% = 0
	PRINT "This is the BSAVE array:"
	PRINT
	FOR I = 1 TO 10
	   Arr1$(I) = "TEST" + STR$(I)
	   ArrayLength% = ArrayLength% + LEN(Arr1$(I))
	   PRINT Arr1$(I)
	NEXT I
	
	DEF SEG = VARSEG(Arr1$(1))
	' In BC.EXE and QBX.EXE for BASIC 7.00 use SSEG for far variable
	' length strings.
	
	BSAVE "Test.Dat", VARPTR(Arr1$(1)), ArrayLength% + StrDesc%
	DEF SEG
	PRINT
	PRINT "Hit a Key"
	PRINT
	SLEEP
	DEF SEG = VARSEG(Arr2$(1))
	' In BC.EXE and QBX.EXE for BASIC 7.00 use SSEG for far variable
	' length strings.
	
	BLOAD "Test.Dat", VARPTR(Arr2$(1))
	DEF SEG
	PRINT "This is the BLOADed array:"
	PRINT
	FOR I = 1 TO 10
	   PRINT Arr2$(I)
	NEXT I
