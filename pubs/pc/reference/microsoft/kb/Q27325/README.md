---
layout: page
title: "Q27325: Example Passing Near Numeric Variables between BASIC and C"
permalink: /pubs/pc/reference/microsoft/kb/Q27325/
---

## Q27325: Example Passing Near Numeric Variables between BASIC and C

	Article: Q27325
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 6-NOV-1989
	
	The two programs shown below demonstrate how numeric variables can be
	passed from compiled BASIC to Microsoft C by near reference.
	
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
	
	The following BASIC program is BNUMNEAR.BAS, which passes each of the
	standard numeric types to a C subroutine:
	
	DECLARE SUB NumericNear CDECL (a%,b&,c!,d#)
	a% = 32767
	b& = 32769
	c! = 123.312
	d# = 129381.333#
	CLS
	CALL NumericNear(a%, b&, c!, d#)
	END
	
	The following program is CNUMNEAR.C, which prints out the standard
	numeric values passed from BASIC:
	
	#include <stdio.h>
	void NumericNear(a, b, c, d)
	   int near *a;
	   long near *b;
	   float near *c;
	   double near *d;
	 {
	    printf("INTEGER %d  \n", *a);
	    printf("LONG    %ld \n", *b);
	    printf("FLOAT   %f  \n", *c);
	    printf("DOUBLE  %lf \n", *d);
	 }
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	     BC BNUMNEAR.BAS;
	
	     CL /c /AM CNUMNEAR.C;      < for Microsoft C Optimizing Compiler >
	
	           or
	
	     QCL /c /AM CNUMNEAR.C;     < for Microsoft QuickC Compiler >
	
	     LINK /NOE BNUMNEAR CNUMNEAR;
	
	BNUMNEAR.EXE produces the following output:
	
	     INTEGER  32767
	     LONG     32769
	     FLOAT    123.311996
	     DOUBLE   129381.333000
