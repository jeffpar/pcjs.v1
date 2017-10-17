---
layout: page
title: "Q49385: Example Passing Numerics from BASIC to MASM by Far Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q49385/
---

## Q49385: Example Passing Numerics from BASIC to MASM by Far Reference

	Article: Q49385
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 10-AUG-1990
	
	The two programs below demonstrate how a Microsoft BASIC program can
	pass standard numeric types to assembly language routines.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, search in the Software/Data Library or the Microsoft
	Knowledge Base for the following word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is BNUMFAR.BAS, which passes standard
	numeric types to assembly language routines:
	
	   DECLARE SUB Numint(SEG i%)
	   DECLARE SUB Numlong(SEG l&)
	   DECLARE SUB Numsng(SEG s!)
	   DECLARE SUB Numdbl(SEG d#)
	   i% = 2
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
	
	The following program is ANUMFAR.ASM, which accepts standard numerics
	by far reference and alters their values:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.CODE
	        PUBLIC Numint, Numlong, Numsng, Numdbl
	Numint  PROC
	        push bp
	        mov bp, sp        ; set stack frame
	        push es
	        mov es, [bp+8]    ; get seg
	        mov bx, [bp+6]    ; get offset
	        mov ax, es:[bx]   ; get actual integer
	        shl ax, 1         ; multiply by 2
	        mov es:[bx], ax   ; put back new value
	        pop es
	        pop bp
	        ret 4
	Numint  ENDP
	
	Numlong PROC
	        push bp
	        mov bp, sp        ; set stack frame
	        push es
	        mov es, [bp+8]    ; get seg
	        mov bx, [bp+6]    ; get offset
	        mov cx, es:[bx]   ; get actual long
	        mov ax, es:[bx+2] ; switch high and low words
	        mov es:[bx+2], cx ; put back new value
	        mov es:[bx], ax
	        pop es
	        pop bp
	        ret 4
	Numlong ENDP
	
	Numsng  PROC
	        push bp
	        mov bp, sp        ; set stack frame
	        push es
	        mov es, [bp+8]    ; get seg
	        mov bx, [bp+6]    ; get offset
	        mov ax, es:[bx+2] ; get actual single
	        or ah, 80h        ; set sign bit
	        mov es:[bx+2], ax ; put back new value
	        pop es
	        pop bp
	        ret 4
	Numsng  ENDP
	
	Numdbl  PROC
	        push bp
	        mov bp, sp         ; set stack frame
	        push es
	        mov es, [bp+8]     ; get seg
	        mov bx, [bp+6]     ; get offset
	        mov ax, es:[bx+6]  ; get actual double
	        or ah, 80h         ; set sign bit
	        mov es:[bx+6], ax  ; put back new value
	        pop es
	        pop bp
	        ret 4
	Numdbl  ENDP
	
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC /O BNUMFAR.BAS;
	   MASM ANUMFAR.ASM;
	   LINK BNUMFAR ANUMFAR;
	
	BNUMFAR.EXE produces the following output:
	
	            BEFORE     AFTER
	   Integer:  2          4
	   Long   :  4          40000
	   Single :  3.4       -3.4
	   Double :  5.6000    -5.6000
