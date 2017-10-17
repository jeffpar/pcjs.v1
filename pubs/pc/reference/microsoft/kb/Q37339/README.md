---
layout: page
title: "Q37339: A Single-Precision Number as a File Number Causes &quot;Overflow&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q37339/
---

## Q37339: A Single-Precision Number as a File Number Causes &quot;Overflow&quot;

	Article: Q37339
	Version(s): 6.00 6.00b | 6.00 6.00b
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 2-FEB-1990
	
	A program compiled with Microsoft BASIC Compiler Version 6.00 or
	6.00b, or QuickBASIC Version 4.00 or 4.00b, generates an "Overflow"
	error message if you are using a single-precision variable as the
	number of a file to be opened.
	
	This behavior does not occur in Microsoft QuickBASIC Version 4.50 for
	MS-DOS or Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and MS OS/2.
	
	The following sample code demonstrates the problem. If the file number
	"F" is redefined as an integer, the program works correctly. The
	program also can be forced to work correctly using any of the
	following alternatives:
	
	1. By compiling with the /o, /d, /v, or /x compiler-option switches
	
	2. By putting line numbers on affected lines
	
	3. By deleting a few lines of code in the subroutine
	
	Earlier versions of Microsoft QuickBASIC do not have this problem.
	
	The following is an example:
	
	   DIM SHARED f9$(22, 9), id$(9), size%(9), fdr$(9)
	   CLS
	   f = 1
	   fi$ = "FILENAME.DAT"
	   CALL OPEN.ISAM(f, fi$)
	   END
	
	   SUB OPEN.ISAM (f, fid$) STATIC
	        OPEN "r", f, fid$, 256
	           FIELD #f, 256 AS f9$
	        fdr$(f) = SPACE$(256)
	           size%(f) = LOF(f) / 256
	           id$(f) = fid$
	   END SUB
