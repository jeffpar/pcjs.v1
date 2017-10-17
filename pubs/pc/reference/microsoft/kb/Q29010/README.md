---
layout: page
title: "Q29010: How Arrays of Fixed- and Variable-Length Strings Use Up Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q29010/
---

## Q29010: How Arrays of Fixed- and Variable-Length Strings Use Up Memory

	Article: Q29010
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 19-JAN-1989
	
	The following article is a general explanation of how arrays of fixed-
	and variable-length strings consume memory in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in the Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS OS/2 and MS-DOS.
	
	Programs should be compiled with the Debug (BC /D) option to trap
	array subscripting problems.
	
	The statement PRINT FRE("") displays the space available for storage
	of variable-length strings at any point in a program.
	
	The statement PRINT FRE(-1) displays the space available for far heap
	at any point in a program. Dynamic arrays of fixed-length strings
	utilize far heap (in both the QB.EXE editor and in compiled .EXE
	files) and can be larger than 64K if compiled with QB /AH or BC /AH.
	
	For a complete description of variable storage allocation, please read
	Pages 32 and 33 of the "Microsoft QuickBASIC 4.00: BASIC Language
	Reference." Arrays are stored in different places depending on whether
	the program is run from an .EXE file or the QB.EXE environment.
	
	The following statements dimension arrays of variable-length strings:
	
	      DIM X(2000) AS STRING
	      DIM W$(2000)
	
	Variable-length strings are always stored in DGROUP (the default data
	segment) that has less than 64K of memory free. The statement PRINT
	FRE("") can be placed at any point in the program to display at run
	time how much memory is available for strings in DGROUP at run time.
	
	Arrays of variable-length strings cannot use the far heap.
	
	The following statement dimensions an array of fixed-length strings:
	
	   DIM Y(2000) AS STRING*10
	
	When you make an array of fixed-length strings dynamic instead of
	static, it will use far-heap space instead of DGROUP.
	
	The following are two ways to make Array Y dynamic:
	
	1. A variable (D%) in the array subscript in the following DIM
	   statement makes Y dynamic:
	
	      D%=2000
	      DIM Y(D%) AS STRING * 10     ' Y is now a dynamic array.
	      DIM Z(2000) AS STRING * 10   ' Z defaults to be a static array.
	
	2. Adding REM $DYNAMIC makes all subsequent arrays dynamic:
	
	      REM $DYNAMIC
	      DIM Y(2000) AS STRING * 10
	
	Dynamic arrays (except for arrays of variable-length strings) can be
	larger than 64K if you compile with QB /AH or BC /AH, and if the
	length of each array element can be divided into 64K (65,536) without
	a remainder (i.e., any power of two).
	
	The statement PRINT FRE(-1) displays how much memory is free at any
	given time in the far heap.
	
	In the following example, the FRE function displays how much memory
	remains in DGROUP and far heap space as dynamic arrays of variable and
	fixed-length strings are dimensioned:
	
	REM $DYNAMIC
	CLS
	PRINT FRE("")   ' DGROUP string space available.
	PRINT FRE(-1)   ' Far heap available.
	DIM x(2000) AS STRING      ' same as DIM X$(2000)
	PRINT FRE("")   ' DGROUP string space available.
	PRINT FRE(-1)   ' Far heap available.
	DIM y(2000) AS STRING * 2  ' Fixed-string dynamic array uses far heap.
	PRINT FRE("")   ' DGROUP string space available.
	PRINT FRE(-1)   ' Far heap available.
	
	Note: Static arrays of fixed-length strings that are not in COMMON are
	stored in the far heap in the QB.EXE editor. However, they are stored
	in DGROUP in compiled EXE programs. All static arrays in COMMON are
	stored in DGROUP in both the QB.EXE editor and in compiled EXE
	programs.
	
	Note that 1K is equal to 1024 bytes.
