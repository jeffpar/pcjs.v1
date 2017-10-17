---
layout: page
title: "Q27295: Passing BASIC SINGLE-Precision Array to C by Far Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q27295/
---

## Q27295: Passing BASIC SINGLE-Precision Array to C by Far Reference

	Article: Q27295
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The example below demonstrates how to pass a single-precision array
	from compiled BASIC to Microsoft C by far reference.
	
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
	
	===== BASIC PROGRAM =====
	
	DECLARE SUB FloatArray CDECL (_
	            BYVAL p1 AS INTEGER,_
	            BYVAL p2 AS INTEGER)
	DEFINT A-Z
	DIM i AS SINGLE
	DIM array(10) AS SINGLE
	CLS
	FOR i = 1 TO 10
	   array(i) = i + 100
	NEXT i
	'Array must be a FAR pointer, so offset and segment must be passed:
	CALL FloatArray(VARPTR(array(0)), VARSEG(array(0)))
	LOCATE 15, 1
	PRINT "Back in BASIC"
	FOR i = 1 TO 10
	   PRINT i, array(i)
	NEXT i
	END
	
	/* ===== C ROUTINE ===== */
	
	#include <stdio.h>
	void FloatArray(array)
	   float far *array;
	 {
	    int i;
	    printf("Index         Value\n");
	    for (i=0;i < 11; i++)
	       {
	         printf("  %d          %f\n",i,array[i]);
	         array[i]=array[i]+100;
	       };
	 }
	
	===== OUTPUT =====
	
	Index         Value
	  0          0.000000
	  1          101.000000
	  2          102.000000
	  3          103.000000
	  4          104.000000
	  5          105.000000
	  6          106.000000
	  7          107.000000
	  8          108.000000
	  9          109.000000
	  10          110.000000
	
	Back in BASIC
	 1             201
	 2             202
	 3             203
	 4             204
	 5             205
	 6             206
	 7             207
	 8             208
	 9             209
	 10            210
