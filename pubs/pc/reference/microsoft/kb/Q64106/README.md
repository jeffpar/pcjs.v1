---
layout: page
title: "Q64106: Sample Assembly Function Returning Single to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q64106/
---

## Q64106: Sample Assembly Function Returning Single to BASIC

	Article: Q64106
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | H_MASM S_QUICKASM B_BasicCom SR# S900718-21
	Last Modified: 10-AUG-1990
	
	The two programs below demonstrate how an assembly language function
	can return a single-precision variable to a Microsoft BASIC program.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, search in the Software/Data Library or the Knowledge
	Base for the following word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is SFUNC.BAS, which displays a
	single-precision number returned from an assembly language function:
	
	   DECLARE FUNCTION QPrint!
	   FOR i% = 1 to 2
	      PRINT QPrint!
	   NEXT
	
	The following program is ASING.ASM, which will return a
	single-precision number when called:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.DATA
	        singlenum dd 98.6
	
	.CODE
	        PUBLIC QPrint
	QPrint  PROC FAR
	        push bp
	        mov bp, sp
	        push si
	        push di
	        push es
	
	        push ds         ; set es = ds
	        pop es
	
	        mov si, offset dgroup:singlenum
	        mov di, [bp+6]  ; load value into address at bp+6
	
	        mov cx, 4
	        rep movsb
	
	        mov ax, [bp+6]  ; load offset of temp value in ax and
	        mov dx, ss      ; ss into dx
	
	        pop es
	        pop di
	        pop si
	        pop bp
	        ret 2
	QPrint  ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC IFUNC.BAS;
	   MASM ASING.ASM;
	   LINK IFUNC ASING;
	
	IFUNC.EXE produces the following output:
	
	   98.6
	   98.6
