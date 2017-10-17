---
layout: page
title: "Q35969: Do Not Mix Arrayname AS Type and % Type Suffix in DIM/COMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q35969/
---

## Q35969: Do Not Mix Arrayname AS Type and % Type Suffix in DIM/COMMON

	Article: Q35969
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 13-DEC-1989
	
	Do not mix the use of "AS Type" declaration syntax with explicit type
	declaration suffixes (%, &, !, #, and $) with a given array name that
	occurs in both DIM and COMMON statements. Programs should be run in
	the QuickBASIC QB.EXE editor to catch such a mismatch error.
	
	If you compile Example Program 1 (below) with the BC /D (debug)
	option, then the .EXE file will produce an error at run time. If you
	do not compile with BC /D (debug) option, then the mismatched
	DIM/COMMON declaration will not be detected, and the resulting .EXE
	file will hang the machine, requiring a cold boot.
	
	This article applies to Microsoft QuickBASIC 4.00, 4.00b, and 4.50 and
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b (buglist6.00,
	buglist6.00b) for MS-DOS and MS OS/2. This problem was corrected in
	Microsoft BASIC PDS Version 7.00 (fixlist7.00) for MS-DOS and MS OS/2.
	
	----------------
	
	For the example program below, BASIC PDS 7.00 produces the following
	message for this error:
	
	COMMON SHARED /x/ x() AS INTEGER   ' AS INTEGER used for type declare.
	                         ^ AS clause required on first declaration
	
	In Example Program 1, the array x% is treated as different from array
	x.  Because the AS clause takes precedence over the "%" type suffix,
	BC.EXE declares the array x in COMMON as a dynamic array, replacing
	the static array x% that was dimensioned with the DIM statement. Thus,
	when the final .EXE is run, array bounds are exceeded, and the machine
	hangs (without BC /D) or gives a run-time error (with BC /D).
	
	When run in the QB.EXE editor, the following program gives the error
	"AS Clause required in first declaration" due to illegal mixing of
	type declaration methods:
	
	' Example Program 1
	DIM x%(100)    ' % used for type declaration
	COMMON SHARED /x/ x() AS INTEGER   ' AS INTEGER used for type declare.
	FOR i% = 0 TO 99
	  PRINT "i% = "; i%
	  x%(i%) = 1
	NEXT i%
	
	The following program shows a correct method for type declaration:
	
	' Example Program 2
	DIM x%(100)
	COMMON SHARED /x/ x%()
	FOR i% = 0 TO 99
	  PRINT "i% = "; i%
	  x%(i%) = 1
	NEXT i%
	
	The following program shows another correct method for type declaration:
	
	' Example Program 3
	DIM x(100) AS INTEGER
	COMMON SHARED /x/ x() AS INTEGER
	FOR i% = 0 TO 99
	  PRINT "i% = "; i%
	  x(i%) = 1
	NEXT i%
