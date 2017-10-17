---
layout: page
title: "Q27302: Passing BASIC Array of User-Defined Type to C"
permalink: /pubs/pc/reference/microsoft/kb/Q27302/
---

## Q27302: Passing BASIC Array of User-Defined Type to C

	Article: Q27302
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The following example demonstrates how to pass an array of
	user-defined-type records from compiled BASIC to Microsoft C.
	
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
	DECLARE SUB TypeArray CDECL (_
	            BYVAL p1o AS INTEGER,_
	            BYVAL p1s AS INTEGER)
	CLS
	DIM element(10) AS record
	FOR I = 0 TO 10
	    element(I).a = 128 + I
	    element(I).b = STR$(I) + ". " + DATE$ + CHR$(0)
	    element(I).c = 39.6 * I
	NEXT I
	CALL TypeArray(VARPTR(element(0)), VARSEG(element(0)))
	END
	
	/* ===== C ROUTINE ===== */
	
	#include <stdio.h>
	struct record{
	       int a;
	       char b[20];
	       float c;
	};
	void TypeArray(element)
	     struct record far *element;
	 {
	    int i;
	    for (i=0;i<3;i++)
	      {
	        printf("Record[%d].A = %d\n",i,element->a);
	        printf("Record[%d].B = %s\n",i,element->b);
	        printf("Record[%d].C = %f\n",i,element->c);
	        printf("\n");
	        element++;
	      };
	 }
	
	===== OUTPUT =====
	
	Record[0].A = 128
	Record[0].B =  0. 02-02-1988
	Record[0].C = 0.000000
	
	Record[1].A = 129
	Record[1].B =  1. 02-02-1988
	Record[1].C = 39.599998
	
	Record[2].A = 130
	Record[2].B =  2. 02-02-1988
	Record[2].C = 79.199997
