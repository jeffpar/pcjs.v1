---
layout: page
title: "Q27303: Passing BASIC 2-Dimension INTEGER Array to C by Far Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q27303/
---

## Q27303: Passing BASIC 2-Dimension INTEGER Array to C by Far Reference

	Article: Q27303
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The following example demonstrates how to pass a two-dimensional array
	of INTEGERs from compiled BASIC to Microsoft C by far reference.
	
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
	
	 DECLARE SUB TwoIntArray CDECL (_
	            BYVAL p1o AS INTEGER,_
	            BYVAL p1s AS INTEGER)
	CLS
	DIM x(4, 4) AS INTEGER
	FOR i = 0 TO 4
	   FOR j = 0 TO 4
	       x(i, j) = i * j
	   NEXT j
	NEXT i
	CALL TwoIntArray(VARPTR(x(0, 0)), VARSEG(x(0, 0)))
	END
	
	/* ===== C ROUTINE ===== */
	
	#include <stdio.h>
	struct two_int_array{
	       int a[5][5];
	       };
	
	void TwoIntArray(x)
	     struct two_int_array far *x;
	     /* Note: The array does not have to be in a struct. */
	 {
	    int i,j;
	    for (i=0;i<5;i++)
	    {
	       for (j=0;j<5;j++)
	       {
	          printf("  %3d   ",x->a[i][j]);
	       };
	       printf("\n");
	    };
	 }
	
	===== OUTPUT =====
	
	    0       0       0       0       0
	    0       1       2       3       4
	    0       2       4       6       8
	    0       3       6       9      12
	    0       4       8      12      16
