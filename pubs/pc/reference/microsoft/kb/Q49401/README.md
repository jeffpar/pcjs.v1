---
layout: page
title: "Q49401: Example of Passing Array of Doubles from BASIC to MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q49401/
---

## Q49401: Example of Passing Array of Doubles from BASIC to MASM

	Article: Q49401
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 5-SEP-1990
	
	The two programs shown below demonstrate how a Microsoft BASIC program
	can pass an array of double-precision variables to assembly language.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, search in the Software/Data Library for the following
	word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is BDBL.BAS, which passes an uninitialized
	array of double precision numbers to an assembly routine that
	initializes the array:
	
	   DECLARE SUB FillDbl(BYVAL ASeg AS INTEGER, BYVAL AOff AS INTEGER)
	
	   DIM DblArray(1 TO 5) AS DOUBLE
	   CALL FillDbl(VARSEG(DblArray(1)), VARPTR(DblArray(1)))
	   FOR i% = 1 TO 5
	      PRINT DblArray(i%)
	   NEXT
	   END
	
	The following program is ADBL.ASM, which initializes an array of
	double-precision numbers passed from BASIC:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.DATA
	        Dbl1 DQ 123.45           ; initialize data table
	        Dbl2 DQ 456.78
	        Dbl3 DQ 98765.432
	        Dbl4 DQ 12345.678
	        Dbl5 DQ 777.888
	.CODE
	        PUBLIC FillDbl
	FillDbl PROC
	        push bp
	        mov bp, sp               ; set stack frame
	        push es                  ; Preserve (push) es, di, si
	        push di
	        push si
	        mov es, [bp+8]           ; segment of array
	        mov di, [bp+6]           ; offset of array
	        mov si, OFFSET Dbl1      ; get offset of data table
	        mov cx, 40               ; length of data in table
	        rep movsb                ; copy data table to array
	        pop si                   ; Restore (pop) si, di, es
	        pop di
	        pop es
	        pop bp
	        ret 4
	FillDbl ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BDBL.BAS;
	   MASM ADBL.ASM;
	   LINK BDBL ATWODBL;
	
	BDBL.EXE produces the following output:
	
	   123.45
	   456.78
	   98765.432
	   12345.678
	   777.888
