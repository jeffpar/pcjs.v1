---
layout: page
title: "Q64109: 7.0 Manual Correction for BASIC Calling C Passing a Far String"
permalink: /pubs/pc/reference/microsoft/kb/Q64109/
---

## Q64109: 7.0 Manual Correction for BASIC Calling C Passing a Far String

	Article: Q64109
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900719-55 docerr
	Last Modified: 1-AUG-1990
	
	Page 501 of the "Microsoft BASIC 7.0: Programmer's Guide" for versions
	7.00 and 7.10 shows an incorrect example of passing a far string to C.
	The error is in the BASIC code. The C code is correct.
	
	The BASIC code needs to be changed in the following two places on Page
	501:
	
	1. The incorrect fourth line of the example is as follows (where the
	   underscore means to place the statement all on one line):
	
	      DECLARE FUNCTION addstring$(SEG s1$,BYVAL_
	              s1length,SEG s2$,BYVAL s2length)
	
	   and should be changed to read as follows (where the underscore
	   means to place the statement all on one line):
	
	      DECLARE FUNCTION addstring$ CDECL_
	             (BYVAL s1offset%, BYVAL s1segment%, BYVAL s1length%,_
	              BYVAL s2offset%, BYVAL s2segment%, BYVAL s2length%)
	
	   In other words, to create a C far pointer, you have to pass the
	   segment followed by the offset and pass this BYVAL so it will be
	   pushed on the stack.
	
	2. The incorrect tenth line is as follows:
	
	      C$ = addstring$(A$, LEN(A$), B$, LEN(B$))
	
	   and should be changed to read as follows (where the underscore
	   means to place the statement all on one line):
	
	      C$ = addstring$(SSEG(A$), SADD(A$), LEN(A$), SSEG(B$),_
	                      SADD(B$), LEN(B$))
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	For more information on passing parameters between BASIC and C, query
	in the Knowledge Base or in the Software/Data Library on the word
	BAS2C.
