---
layout: page
title: "Q27291: Example Passing Numeric Variables from BASIC to C by Value"
permalink: /pubs/pc/reference/microsoft/kb/Q27291/
---

## Q27291: Example Passing Numeric Variables from BASIC to C by Value

	Article: Q27291
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The program below demonstrates how to pass numeric values from
	compiled BASIC to Microsoft C by VALUE.
	
	This information about inter-language calling applies to QuickBASIC
	Versions 4.00, 4.00b, and 4.50 and to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and C, and a list of which BASIC and C versions are compatible
	with each other, query in the Software/Data Library on the following
	word:
	
	   BAS2C
	
	Code Example
	------------
	
	REM ===== BASIC PROGRAM =====
	
	DECLARE SUB NumericValue CDECL (_
	            BYVAL p1 AS INTEGER,_
	            BYVAL p2 AS LONG,_
	            BYVAL p3 AS SINGLE,_
	            BYVAL p4 AS DOUBLE)
	a% = 32767
	b& = 32769
	c! = 123.312
	d# = 129381.333#
	CLS
	CALL NumericValue(a%, b&, c!, d#)
	END
	
	/* ===== C ROUTINE ===== */
	/* The variables are put into structs for memory alignment. */
	#include <stdio.h>
	struct struct_int{
	   int x;
	   };
	struct struct_long{
	   long x;
	   };
	struct struct_float{
	   float x;
	   };
	struct struct_double{
	   double x;
	   };
	void NumericValue(a, b, c, d)
	   struct struct_int a;
	   struct struct_long b;
	   struct struct_float c;
	   struct struct_double d;
	   {
	         printf("INTEGER  %d        \n",a.x);
	         printf("LONG     %ld        \n",b.x);
	         printf("FLOAT    %f        \n",c.x);
	         printf("DOUBLE   %lf        \n",d.x);
	   }
	
	===== OUTPUT =====
	
	INTEGER  32767
	LONG     32769
	FLOAT    123.311996
	DOUBLE   129381.333000
