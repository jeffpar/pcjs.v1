---
layout: page
title: "Q49400: Example of Passing Two-Dimensional Fixed-String Array to MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q49400/
---

## Q49400: Example of Passing Two-Dimensional Fixed-String Array to MASM

	Article: Q49400
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 5-SEP-1990
	
	The two programs shown below demonstrate how a Microsoft BASIC program
	can pass a two-dimensional fixed-length string array to assembly
	language.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2 and to Microsoft BASIC
	PDS versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, search in the Software/Data Library for the following
	word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is BTWOFIX.BAS, which passes an
	uninitialized two-dimensional array of fixed-length strings to an
	assembly routine that initializes the array:
	
	   DECLARE SUB TwoFix(BYVAL ASeg AS INTEGER, BYVAL AOff AS INTEGER)
	   DIM FixArray(1 TO 2, 1 TO 3) AS STRING * 9
	   CALL TwoFix(VARSEG(FixArray(1, 1)), VARPTR(FixArray(1, 1)))
	   FOR row% = 1 TO 2
	      FOR col% = 1 TO 3
	         PRINT FixArray(row%, col%)
	      NEXT
	   NEXT
	   END
	
	The following program is ATWOFIX.ASM, which initializes a
	two-dimensional array of fixed-length strings passed from BASIC:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.DATA
	        Fix11 DB 'String 11'     ; allocate string data
	        Fix21 DB 'String 21'
	        Fix12 DB 'String 12'
	        Fix22 DB 'String 22'
	        Fix13 DB 'String 13'
	        Fix23 DB 'String 23'
	.CODE
	        PUBLIC TwoFix
	TwoFix  PROC
	        push bp
	        mov bp, sp               ; set stack frame
	        push es
	        mov es, [bp+8]           ; segment of string array
	        mov di, [bp+6]           ; offset of string array
	        mov si, OFFSET Fix11     ; get offset to string data
	        mov cx, 54               ; length of all string data
	        rep movsb                ; copy string data to array
	        pop es
	        pop bp
	        ret 4
	TwoFix  ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	     BC BTWOFIX.BAS;
	     MASM ATWOFIX.ASM;
	     LINK BTWOFIX ATWOFIX;
	
	BTWOFIX.EXE produces the following output:
	
	     String 11
	     String 12
	     String 13
	     String 21
	     String 22
	     String 23
