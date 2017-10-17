---
layout: page
title: "Q32787: &quot;Overflow,&quot; &quot;Subscript Out of Range,&quot; &gt;32,767 Array Elements"
permalink: /pubs/pc/reference/microsoft/kb/Q32787/
---

## Q32787: &quot;Overflow,&quot; &quot;Subscript Out of Range,&quot; &gt;32,767 Array Elements

	Article: Q32787
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom docerr
	Last Modified: 26-FEB-1990
	
	Page 156 of the "Microsoft QuickBASIC 4.0: BASIC Language Reference"
	for Versions 4.00 and 4.00b and the "Microsoft BASIC Compiler 6.0:
	BASIC Language Reference" for Versions 6.00 and 6.00b for MS-DOS and
	MS OS/2 correctly states that an array dimension can have subscripts
	from -32,768 to 32,767. This is also stated on Page 103 of the
	"Microsoft BASIC 7.0: Language Reference" manual for Microsoft BASIC
	Professional Development System (PDS) Version 7.00. For example DIM
	Z%(-2000 TO 3000), which has 5001 elements, is legal.
	
	However, these pages fail to mention that the TOTAL NUMBER of elements
	in any one dimension of an array cannot exceed 32,767 (32K minus one).
	For example, the following DIM statements are not allowed because they
	make an array with more than 32,767 elements in one dimension:
	
	   DIM X(-10000 TO 25000)  ' 35,001 elements is too many.
	   DIM A%(0 TO 32767)  ' 32,768 elements is one too many.
	
	To make an array that exceeds 32,767 total elements, you must
	dimension it with two or more dimensions (making sure that no one
	dimension has more than 32,767 elements; you must also compile with
	the /AH option).
	
	Below is an explanation of array usages that could give one of the
	following errors:
	
	   "Overflow," "Math Overflow," "Subscript Out of Range,"
	   "Array Too Big," "Out of Memory"
	
	To dimension an array larger than 64K, you must make the array dynamic
	and compile with the /AH (huge array) option, as in the following
	example:
	
	   REM This program must be compiled with the /AH option
	   ' $DYNAMIC
	   OPTION BASE 1
	   DIM A%(20000, 2)  ' 40000 elements, taking 80000 bytes in memory.
	   DIM B%(20000, 4)  ' 80000 elements, taking 160000 bytes in memory.
	
	The following is a list of array-related error messages and their
	possible causes:
	
	1. Compiling an array that has a subscript larger than +32,767 or
	   smaller than -32,768 in the DIM statement causes an "Overflow"
	   error in the QB.EXE editor. If you compile it with BC.EXE, you
	   receive a "Math Overflow" error, as follows:
	
	      ' $DYNAMIC
	      DIM s%(33000)  ' produces "overflow" error in QB.EXE editor
	                        ' and "math overflow" error in BC.EXE.
	
	2. A "Subscript out of range" error occurs in the QB.EXE editor at
	   run time if you DIMension more than 32,767 elements in one
	   dimension, as in the following example (invoke QB /AH):
	
	      ' $DYNAMIC
	      DIM X%(-10000 TO 25000) ' Cannot use 35,000 elements in
	                                 ' one dimension.
	
	   Compiling the above program with BC.EXE does not cause a compile
	   error, but gives a "Subscript Out of Range" error at run time in
	   the .EXE program. (Be sure to compile with the BC /D (debug) option
	   to properly trap array-bounds errors.)
	
	   Note that if the array has exactly 32,768 elements, the error will
	   not occur on the DIM statement in QB.EXE or a compiled .EXE program;
	   the error will occur only when an array element is used later:
	
	   REM $DYNAMIC
	   DIM Y%(0 TO 32767)  ' Cannot use 32768 elements in one dimension.
	   PRINT Y%(2000)  ' "Subscript Out of Range" occurs here, not on DIM.
	
	3. An "Array Too Big" or "Subscript Out of Range" error will
	   display if the array exceeds 64K, is not dynamic, and was not
	   compiled with the /AH option. You must either make the array
	   dynamic and compile with /AH or make the array smaller than 64K.
	   If a dynamic array is larger than 128K, its array elements must
	   have a size that is a power of 2 (2, 4, 8, 16, 32, 64, 128, 256,
	   512, etc.) so that array elements do not overlap on boundaries
	   that are divisible by 64K.
	
	4. An "Out of Memory" error means you have exceeded available RAM
	   at run time. You should reduce the size of arrays or code, or
	   try running the program as an .EXE program instead of inside the
	   QB.EXE environment. You can use the FRE function to determine
	   run-time memory usage.
	
	Note that QuickBASIC Versions 2.00, 2.01, and 3.00 are limited to
	arrays that do not exceed 64K in size or 32,767 elements per
	dimension.
	
	Note: 1K is equal to 1024 bytes.
