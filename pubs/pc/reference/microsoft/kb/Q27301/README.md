---
layout: page
title: "Q27301: Passing BASIC User-Defined Type to C by Far Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q27301/
---

## Q27301: Passing BASIC User-Defined Type to C by Far Reference

	Article: Q27301
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The following example demonstrates how to pass a user-defined type
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
	
	REM ===== BASIC PROGRAM =====
	
	TYPE record
	   a AS INTEGER
	   b AS STRING * 20
	   c AS SINGLE
	END TYPE
	DECLARE SUB TypeReference CDECL (BYVAL p1o AS INTEGER, _
	                                 BYVAL p1s AS INTEGER)
	CLS
	DIM element AS record
	element.a = 128
	element.b = DATE$ + CHR$(0)
	element.c = 39.6
	CALL TypeReference(VARPTR(element), VARSEG(element))
	END
	
	/* ===== C ROUTINE ===== */
	
	#include <stdio.h>
	struct record{
	       int a;
	       char b[20];
	       float c;
	       };
	
	void TypeReference(element)
	     struct record far *element;
	 {
	     printf("Record.A = %d\n",element->a);
	     printf("Record.B = %s\n",element->b);
	     printf("Record.C = %f\n",element->c);
	 }
	
	===== OUTPUT =====
	
	Record.A = 128
	Record.B = 02-02-1988
	Record.C = 39.599998
