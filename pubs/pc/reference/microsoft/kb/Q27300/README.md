---
layout: page
title: "Q27300: Passing BASIC Array of Fixed-Length Strings to C"
permalink: /pubs/pc/reference/microsoft/kb/Q27300/
---

## Q27300: Passing BASIC Array of Fixed-Length Strings to C

	Article: Q27300
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The following example demonstrates how to pass an array of
	fixed-length strings from compiled BASIC to Microsoft C.
	
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
	
	DECLARE SUB StringFar CDECL (_
	        length%,_
	        num%,_
	        BYVAL p3o AS INTEGER,_
	        BYVAL p3s AS INTEGER)
	CLS
	DIM array(10) AS STRING * 10
	length% = 10
	num% = 3
	FOR i = 0 TO 10
	   array(i) = STRING$(9, 65 + i) + CHR$(0)
	NEXT i
	CALL StringFar(length%, num%, VARPTR(array(0)), VARSEG(array(0)))
	END
	
	/* ===== C ROUTINE ===== */
	
	#include <stdio.h>
	void StringFar(len,num,array)
	   int  *len;
	   int  *num;
	   char far *array;
	 {
	    int i;
	    printf("The string length is : %d \n\n",*len);
	    printf("The number of elements is : %d \n\n",*num);
	    printf(" Index        String\n");
	    for (i=0;i < *num; i++)
	       {
	         printf("  %2d         %s\n",i,array);
	         array=array+*len;
	       };
	 }
	
	===== OUTPUT =====
	
	The string length is : 10
	
	The number of elements is : 3
	
	 Index        String
	   0         AAAAAAAAA
	   1         BBBBBBBBB
	   2         CCCCCCCCC
