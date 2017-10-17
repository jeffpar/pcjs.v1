---
layout: page
title: "Q64105: Example of Assembly Function Returning Long Integer to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q64105/
---

## Q64105: Example of Assembly Function Returning Long Integer to BASIC

	Article: Q64105
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | H_MASM S_QUICKASM B_BasicCom SR# S900718-16
	Last Modified: 10-AUG-1990
	
	The two programs below demonstrate how an assembly language function
	can return a long integer to a Microsoft BASIC program.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, query in the Knowledge Base or the Software/Data
	Library for the following word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is IFUNC.BAS, which displays a long
	integer returned from an assembly language function:
	
	   DECLARE FUNCTION QPrint&
	
	   FOR i% = 1 to 5
	      PRINT QPrint&
	   NEXT
	
	The following program is AINT.ASM, which will return a long integer
	parameter when called:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in
	; MASM 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.DATA
	        longnum dd 12345
	
	.CODE
	        PUBLIC QPrint
	QPrint  PROC
	        mov ax, WORD PTR longnum        ; return value in ax and
	        mov dx, WORD PTR longnum + 2    ;   dx registers
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
