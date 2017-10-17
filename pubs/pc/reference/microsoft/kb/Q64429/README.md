---
layout: page
title: "Q64429: Example of Assembly Function Returning Integer to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q64429/
---

## Q64429: Example of Assembly Function Returning Integer to BASIC

	Article: Q64429
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QUICKASM SR# S900718-12
	Last Modified: 5-SEP-1990
	
	The two programs below demonstrate how an assembly language function
	can return an integer to a Microsoft BASIC program.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, query in the Software/Data Library or this Knowledge
	Base for the following word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is IFUNC.BAS, which displays an integer
	returned from an assembly language function:
	
	   DECLARE FUNCTION QPrint%
	   FOR i% = 1 to 5
	      PRINT QPrint%
	   NEXT
	
	The following assembly language program is AINT.ASM, which contains
	the QPrint function. The Qprint function returns an integer.
	
	.MODEL MEDIUM, BASIC
	.DATA
	        shortnum dw 12345
	
	.CODE
	        PUBLIC QPrint
	QPrint  PROC
	        mov ax, shortnum    ; return value in ax register
	        ret
	QPrint  ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC IFUNC.BAS;
	   MASM AINT.ASM;
	   LINK IFUNC AINT;
	
	IFUNC.EXE produces the following output:
	
	   12345
	   12345
	   12345
	   12345
	   12345
