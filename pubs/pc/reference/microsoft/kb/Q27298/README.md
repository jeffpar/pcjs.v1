---
layout: page
title: "Q27298: Passing BASIC Array of Long Integers to C by Far Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q27298/
---

## Q27298: Passing BASIC Array of Long Integers to C by Far Reference

	Article: Q27298
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The following example demonstrates how to pass an array of long
	integers from compiled BASIC to Microsoft C by far reference.
	
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
	
	DECLARE SUB LongArray CDECL (_
	            BYVAL p1 AS INTEGER,_
	            BYVAL p2 AS INTEGER)
	DEFINT A-Z
	DIM i AS LONG
	DIM array(10) AS LONG
	CLS
	FOR i = 1 TO 10
	   array(i) = i + 100
	NEXT i
	'Array must be a FAR pointer, so offset and segment must be passed:
	CALL LongArray(VARPTR(array(0)), VARSEG(array(0)))
	LOCATE 15, 1
	PRINT "Back in BASIC"
	FOR i = 1 TO 10
	   PRINT i, array(i)
	NEXT i
	END
	
	/* ===== C ROUTINES ===== */
	
	#include <stdio.h>
	void LongArray(array)
	   long far *array;
	 {
	    int i;
	    printf("Index         Value\n");
	    for (i=0;i < 11; i++)
	       {
	         printf("  %d          %ld\n",i,array[i]);
	         array[i]=array[i]+100;
	       };
	 }
	
	===== OUTPUT =====
	
	Index         Value
	  0          0
	  1          101
	  2          102
	  3          103
	  4          104
	  5          105
	  6          106
	  7          107
	  8          108
	  9          109
	  10          110
	
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
