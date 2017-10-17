---
layout: page
title: "Q27323: Passing BASIC 2-Dimensional Variable-Length String Array to C"
permalink: /pubs/pc/reference/microsoft/kb/Q27323/
---

## Q27323: Passing BASIC 2-Dimensional Variable-Length String Array to C

	Article: Q27323
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The following example demonstrates how to pass a two-dimensional array
	of variable-length strings from compiled BASIC to Microsoft C.
	
	This information about inter-language calling applies to QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS and to Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and C, and a list of which BASIC and C versions are compatible
	with each other, query in the Software/Data Library on the following
	word:
	
	   BAS2C
	
	Code Example
	------------
	
	REM ===== BASIC PROGRAM =====
	
	DECLARE SUB TwoStringArray CDECL (_
	            BYVAL p1o AS INTEGER,_
	            BYVAL p1s AS INTEGER)
	CLS
	DIM array$(4, 4)
	FOR i = 0 TO 4
	 FOR j = 0 TO 4
	   array$(i, j) = STRING$(5, 65 + (i + j)) + CHR$(0)
	 NEXT j
	NEXT i
	CALL TwoStringArray(VARPTR(array$(0, 0)), VARSEG(array$(0, 0)))
	END
	
	/* ===== C ROUTINE ===== */
	
	#include <stdio.h>
	struct struct_string{
	     int length;
	     char *address;
	     };
	struct string_array{
	     struct struct_string x[5][5];
	};
	
	void TwoStringArray(array)
	   struct string_array far *array;
	 {
	    int i,j;
	    for (i=0;i < 5; i++)
	       {
	         for(j=0;j<5;j++)
	         {
	             printf("  %s  ",array->x[i][j].address);
	         };
	         printf("\n");
	       };
	 }
	
	===== OUTPUT =====
	
	  AAAAA    BBBBB    CCCCC    DDDDD    EEEEE
	  BBBBB    CCCCC    DDDDD    EEEEE    FFFFF
	  CCCCC    DDDDD    EEEEE    FFFFF    GGGGG
	  DDDDD    EEEEE    FFFFF    GGGGG    HHHHH
	  EEEEE    FFFFF    GGGGG    HHHHH    IIIII
