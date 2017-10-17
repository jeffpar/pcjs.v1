---
layout: page
title: "Q58926: Array Storage DGROUP vs. Far Heap Differs in .EXE vs. QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q58926/
---

## Q58926: Array Storage DGROUP vs. Far Heap Differs in .EXE vs. QB.EXE

	Article: Q58926
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900112-152 B_BasicCom
	Last Modified: 27-FEB-1990
	
	Arrays can be stored in different places depending on array type and
	on whether the program is run from an .EXE file or the QB.EXE
	environment. All nonarray (scalar) variables are always stored in
	DGROUP.
	
	In the QuickBASIC QB.EXE environment, a static array of numeric type
	or fixed-length-string type must be in a COMMON or COMMON SHARED
	statement to be allocated in the DGROUP memory area; otherwise it will
	be stored in the far heap.
	
	In an executable file (.EXE), all types of static arrays are always
	stored in the DGROUP area (which can be referenced with a near
	address).
	
	Dynamic or static arrays of variable-length strings are always stored
	in DGROUP in both QB.EXE and .EXE programs.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, and to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2.
	
	For a complete description of variable storage allocation, please read
	Pages 32 and 33 of the "Microsoft QuickBASIC 4.0: BASIC Language
	Reference," or Pages 32 and 33 of the "Microsoft BASIC Compiler 6.0:
	BASIC Language Reference."
	
	DGROUP is also known as the default data segment, or the near data
	storage area.
	
	In summary, array storage in QB.EXE adheres to the following three
	rules:
	
	1. All $STATIC arrays in COMMON or COMMON SHARED are stored in DGROUP.
	
	2. All arrays of type variable-length string are stored in DGROUP.
	
	3. All other arrays are stored in far addresses.
	
	Array storage in .EXE programs adheres to the following three rules:
	
	1. All $STATIC arrays are stored in DGROUP.
	
	2. All $DYNAMIC arrays of variable-length strings are stored in
	   DGROUP.
	
	3. All other $DYNAMIC arrays are stored as far objects in the far heap.
	
	Program Example
	---------------
	
	The program below illustrates the preceding information.
	
	DIM ar1(100) AS INTEGER      ' REM $STATIC is the default for arrays
	DIM ar2(100) AS INTEGER      ' REM $STATIC is the default for arrays
	COMMON SHARED ar2() AS INTEGER
	' Must be in COMMON in QB.EXE environment to be placed in DGROUP.
	s$ = "hello"    ' this is put into the DGROUP
	REM $DYNAMIC
	DIM ar3(100) AS INTEGER
	PRINT VARSEG(s$), VARSEG(ar1(0)), VARSEG(ar2(0)), VARSEG(ar3(0))
