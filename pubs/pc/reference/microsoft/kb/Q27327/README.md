---
layout: page
title: "Q27327: Passing COMMON Variables from BASIC to C by Far Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q27327/
---

## Q27327: Passing COMMON Variables from BASIC to C by Far Reference

	Article: Q27327
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The following example demonstrates how to pass COMMON variables from
	compiled BASIC to Microsoft C by far reference.
	
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
	
	DECLARE SUB RCommon CDECL (_
	            BYVAL p1o AS INTEGER,_
	            BYVAL p1s AS INTEGER)
	COMMON SHARED element1 AS INTEGER, element2 AS STRING * 20, _
	              element3 AS SINGLE
	element1 = 23
	element2 = "DATE : " + DATE$ + CHR$(0)
	element3 = 309.03
	CALL RCommon(VARPTR(element1), VARSEG(element1))
	END
	
	/* ===== C ROUTINE ===== */
	
	#include <stdio.h>
	struct common_block{   /* structure that looks like the BASIC */
	       int a;          /* common block                        */
	       char b[20];
	       float c;
	};
	void RCommon(pointer)
	     struct common_block far *pointer;
	 {
	     printf("Element1 = %d\n",pointer->a);
	     printf("Element2 = %s\n",pointer->b);
	     printf("Element3 = %f\n",pointer->c);
	 }
	
	===== OUTPUT =====
	
	Element1 = 23
	Element2 = DATE : 02-02-1988
	Element3 = 309.029999
