---
layout: page
title: "Q27324: Passing Numeric Variables between BASIC and C by Far Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q27324/
---

## Q27324: Passing Numeric Variables between BASIC and C by Far Reference

	Article: Q27324
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The following example demonstrates how to pass numeric values from
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
	
	===== BASIC PROGRAM =====
	
	DECLARE SUB NumericFar CDECL (_
	        BYVAL p1o AS INTEGER, BYVAL p1s AS INTEGER,_
	        BYVAL p2o AS INTEGER, BYVAL p2s AS INTEGER,_
	        BYVAL p3o AS INTEGER, BYVAL p3s AS INTEGER,_
	        BYVAL p4o AS INTEGER, BYVAL p4s AS INTEGER)
	a% = 32767
	b& = 32769
	c! = 123.312
	d# = 129381.333#
	CLS
	CALL NumericFar(VARPTR(a%), VARSEG(a%),_
	                VARPTR(b&), VARSEG(b&),_
	                VARPTR(c!), VARSEG(c!),_
	                VARPTR(d#), VARSEG(d#))
	END
	
	===== C ROUTINE =====
	
	#include <stdio.h>
	void NumericFar(a, b, c, d)
	   int far *a;
	   long far *b;
	   float far *c;
	   double far *d;
	 {
	         printf("INTEGER  %d        \n",*a);
	         printf("LONG     %ld        \n",*b);
	         printf("FLOAT    %f        \n",*c);
	         printf("DOUBLE   %lf        \n",*d);
	 }
	
	===== OUTPUT =====
	
	INTEGER  32767
	LONG     32769
	FLOAT    123.311996
	DOUBLE   129381.333000
