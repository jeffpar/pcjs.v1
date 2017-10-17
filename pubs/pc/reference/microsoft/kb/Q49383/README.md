---
layout: page
title: "Q49383: Example Passing Numerics from BASIC to MASM by Near Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q49383/
---

## Q49383: Example Passing Numerics from BASIC to MASM by Near Reference

	Article: Q49383
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 5-SEP-1990
	
	The two programs shown below demonstrate how a Microsoft BASIC program
	can pass standard numeric types to assembly language routines.
	
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
	
	The following BASIC program is BNUMNEAR.BAS, which passes standard
	numeric types (by near reference) to assembly language routines:
	
	   DECLARE SUB Numint(i%)
	   DECLARE SUB Numlong(l&)
	   DECLARE SUB Numsng(s!)
	   DECLARE SUB Numdbl(d#)
	   i% = 2                   ' Initialize values
	   l& = 4
	   s! = 3.4
	   d# = 5.6
	   CLS
	   PRINT "         BEFORE","AFTER"
	   PRINT "Integer: ";i%,,
	   CALL Numint(i%)
	   PRINT i%
	
	   PRINT "Long   : ";HEX$(l&),,
	   CALL Numlong(l&)
	   PRINT HEX$(l&)
	
	   PRINT "Single : ";s!,
	   CALL Numsng(s!)
	   PRINT s!
	
	   PRINT USING "Double : ##.####            ";d#,
	   CALL Numdbl(d#)
	   PRINT USING "##.####"; d#
	
	   END
	
	The following assembler program is ANUMNEAR.ASM, which accepts
	standard numerics by near reference and alters their values:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.CODE
	        PUBLIC Numint, Numlong, Numsng, Numdbl
	Numint  PROC
	        push bp
	        mov bp, sp        ; set stack frame
	        mov bx, [bp+6]
	        mov ax, [bx]   ; get integer
	        shl ax, 1         ; multiply by 2
	        mov [bx], ax   ; put new value back
	        pop bp
	        ret 2
	Numint  ENDP
	
	Numlong PROC
	        push bp
	        mov bp, sp        ; set stack frame
	        mov bx, [bp+6]
	        mov cx, [bx]   ; get long
	        mov ax, [bx+2] ; switch high and low words
	        mov [bx+2], cx ; put new value back
	        mov [bx], ax
	        pop bp
	        ret 2
	Numlong ENDP
	
	Numsng  PROC
	        push bp
	        mov bp, sp        ; set stack frame
	        mov bx, [bp+6]
	        or byte ptr [bx+2],80h   ; Set sign bit
	        pop bp
	        ret 2
	Numsng  ENDP
	
	Numdbl  PROC
	        push bp
	        mov bp, sp         ; set stack frame
	        mov bx, [bp+6]
	        or byte ptr [bx+6],80h  ; Set sign bit
	        pop bp
	        ret 2
	Numdbl  ENDP
	
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC /O BNUMNEAR.BAS;
	   MASM ANUMNEAR.ASM;
	   LINK BNUMNEAR ANUMNEAR;
	
	BNUMNEAR.EXE produces the following output:
	
	           BEFORE     AFTER
	   Integer:  2          4
	   Long   :  4          40000
	   Single :  3.4       -3.4
	   Double :  5.6000    -5.6000
