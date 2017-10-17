---
layout: page
title: "Q64107: Sample Assembly Function Returning Double to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q64107/
---

## Q64107: Sample Assembly Function Returning Double to BASIC

	Article: Q64107
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | H_MASM S_QUICKASM B_BasicCom SR# S900718-40
	Last Modified: 13-AUG-1990
	
	The two programs shown below demonstrate how an assembly language
	function can return a double-precision number to a Microsoft BASIC
	program.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, query in the Software/Data Library for the following
	word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is DFUNC.BAS, which displays a
	double-precision number returned from an assembly language function:
	
	   DECLARE FUNCTION QPrint#
	   FOR i% = 1 to 2
	      PRINT QPrint#
	   NEXT
	
	The following program is ADBL.ASM, which will return a
	double-precision number when called:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.DATA
	        doublenum dq 6765.89
	
	.CODE
	        PUBLIC QPrint
	QPrint  PROC
	        mov bp, sp
	        push es
	        push si
	        push di
	
	        push ds          ; set es = ds
	        pop es
	
	        mov si, offset dgroup:doublenum
	        mov di, [bp+6]   ; load value into address at bp+6
	        mov cx, 4
	        rep movsw        ; 4 words at 2 bytes = 8 bytes
	
	        mov ax, [bp+6]   ; load offset of temp value in ax and
	        mov dx, ss       ;   ss into dx
	
	        pop di
	        pop si
	        pop es
	        pop bp
	
	        ret 2
	QPrint  ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC DFUNC.BAS;
	   MASM ADBL.ASM;
	   LINK DFUNC ADBL;
	
	DFUNC.EXE produces the following output:
	
	   6765.89
	   6765.89
