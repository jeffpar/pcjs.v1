---
layout: page
title: "Q49398: Example of Passing BASIC Two-Dimensional Integer Array to MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q49398/
---

## Q49398: Example of Passing BASIC Two-Dimensional Integer Array to MASM

	Article: Q49398
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 13-AUG-1990
	
	The two programs shown below demonstrate how a Microsoft BASIC program
	can pass a two-dimensional integer array to assembly language.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2 and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, search in the Software/Data Library for the following
	word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is BTWODIMI.BAS, which passes an
	uninitialized two-dimensional integer array to an assembly routine
	that initializes the array:
	
	   DECLARE SUB TwoInt(BYVAL ASeg AS INTEGER, BYVAL AOff AS INTEGER)
	   DIM IntArray(1 TO 2, 1 TO 3) AS INTEGER
	   CALL TwoInt(VARSEG(IntArray(1, 1)), VARPTR(IntArray(1, 1)))
	   FOR row% = 1 TO 2
	      FOR col% = 1 TO 3
	         PRINT IntArray(row%, col%)
	      NEXT
	   NEXT
	   END
	
	The following program is ATWODIMI.ASM, which initializes a
	two-dimensional integer array passed from BASIC:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.DATA
	        i11 DW 11
	        i21 DW 21
	        i12 DW 12
	        i22 DW 22
	        i13 DW 13
	        i23 DW 23
	.CODE
	        PUBLIC TwoInt
	TwoInt  PROC
	        push bp
	        mov bp, sp             ; set stack frame
	        push es
	        push si
	        push di
	        mov es, [bp+8]         ; segment of array
	        mov di, [bp+6]         ; offset of array
	        mov si, OFFSET i11
	        mov cx, 6              ; number of items to copy
	        rep movsw              ; copy data to array
	        pop di
	        pop si
	        pop es
	        pop bp
	        ret 4
	TwoInt  ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BTWODIMI.BAS;
	   MASM ATWODIMI.ASM;
	   LINK BTWODIMI ATWODIMI;
	
	BTWODIMI.EXE produces the following output:
	
	   11
	   12
	   13
	   21
	   22
	   23
