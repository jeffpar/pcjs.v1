---
layout: page
title: "Q49395: Example of Passing Numerics from BASIC to MASM by Value"
permalink: /pubs/pc/reference/microsoft/kb/Q49395/
---

## Q49395: Example of Passing Numerics from BASIC to MASM by Value

	Article: Q49395
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 10-AUG-1990
	
	The two programs below demonstrate how a Microsoft BASIC program
	passes standard numeric types to assembly language by value.
	
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
	
	The following BASIC program is BNUMVAL.BAS, which passes two standard
	numeric types to assembly language by value:
	
	   DECLARE SUB ValInt(BYVAL i%)
	   DECLARE SUB ValLong(BYVAL l&)
	   i% = ASC("A")
	   l& = ASC("B") * 65536 + ASC("C")
	   CLS
	   CALL ValInt(i%)
	   CALL ValLong(l&)
	   END
	
	The following program is ANUMVAL.ASM, which gets two standard numeric
	types by value and prints them out:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.CODE
	        PUBLIC ValInt, ValLong
	ValInt  PROC
	        push bp
	        mov bp, sp            ; set stack frame
	        mov dx, [bp+6]        ; get integer
	        mov ah, 02            ; DOS interrupt to print character
	        int 21h
	        pop bp
	        ret 2
	ValInt  ENDP
	
	ValLong PROC
	        push bp
	        mov bp, sp            ; set stack frame
	        mov dx, [bp+6]        ; get first part of long
	        mov ah, 02            ; DOS interrupt to print character
	        int 21h
	        mov dx, [bp+8]        ; get second part of long
	        int 21h               ; print it
	        pop bp
	        ret 4
	ValLong ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BNUMVAL.BAS;
	   MASM ANUMVAL.ASM;
	   LINK BNUMVAL ANUMVAL;
	
	BNUMVAL.EXE produces the following output:
	
	   ABC
