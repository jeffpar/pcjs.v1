---
layout: page
title: "Q48206: Example of C Functions Returning Numeric Types to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q48206/
---

## Q48206: Example of C Functions Returning Numeric Types to BASIC

	Article: Q48206
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 20-DEC-1989
	
	The two programs shown below demonstrate how Microsoft C functions can
	return common numeric types to BASIC.
	
	This information about inter-language calling applies to QuickBASIC
	Versions 4.00, 4.00b, 4.50 for MS-DOS, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	PDS Version 7.00 for MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and C, and a list of which BASIC and C versions are compatible
	with each other, query in the Software/Data Library for the following
	word:
	
	   BAS2C
	
	Code Example
	------------
	
	The following BASIC program is BFUNC.BAS, which invokes several C
	functions, and prints out the values returned by the functions:
	
	DECLARE FUNCTION cintfunc% CDECL ()
	DECLARE FUNCTION clongfunc& CDECL ()
	DECLARE FUNCTION cdoublefunc# CDECL ()
	PRINT "Integer: "; cintfunc
	PRINT "Long   : "; clongfunc
	PRINT "Double : "; cdoublefunc
	
	The following program is CFUNC.C, which contains several functions
	called from BASIC. These functions return standard numeric types to
	the calling BASIC program.
	
	int cintfunc(void)        /* BASIC INTEGER */
	{
	   int theint = 32767;
	   return(theint);
	}
	
	long clongfunc(void)      /* BASIC LONG */
	{
	   long thelong = 32769;
	
	   return(thelong);
	}
	
	double cdoublefunc(void)  /* BASIC DOUBLE */
	{
	   double thedouble = 129381.123;
	   return(thedouble);
	}
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BFUNC.BAS;
	   CL /c /AM CFUNC.C;
	   LINK /NOE BFUNC CFUNC;
	
	BFUNC.EXE produces the following output:
	
	   Integer:  32767
	   Long   :  32769
	   Double :  129381.123
