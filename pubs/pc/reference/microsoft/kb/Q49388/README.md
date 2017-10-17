---
layout: page
title: "Q49388: Example of Passing Fixed-Length String Between BASIC and MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q49388/
---

## Q49388: Example of Passing Fixed-Length String Between BASIC and MASM

	Article: Q49388
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 10-AUG-1990
	
	The two programs below demonstrate how Microsoft BASIC and assembly
	language pass fixed-length strings by near reference.
	
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
	
	The following BASIC program is BFSTRN.BAS, which creates a
	fixed-length string that is passed to assembly language to print and
	receives a fixed-length string from assembly:
	
	   DECLARE SUB RString(BYVAL offs AS INTEGER)
	   TYPE fixstring
	      s AS STRING * 20
	   END TYPE
	   DIM a AS STRING * 20
	   CLS
	   a = "BASIC String$"      ' "$" terminates string for assembly
	   CALL RString(VARPTR(a))
	   END
	   SUB BasicSub(a AS fixstring)
	      LOCATE 2, 1    ' Must LOCATE because print in assembly won't move
	      PRINT a.s      '   BASIC's screen position
	   END SUB
	
	The following program is AFSTRN.ASM, which gets a fixed-length string
	by near reference, prints the string, then passes a string to a BASIC
	subprogram:
	
	; The following handy .MODEL directive is found in MASM 5.10 but not
	; in earlier versions:
	.MODEL MEDIUM, BASIC
	EXTRN BasicSub:PROC
	.DATA
	  astr  DB 'Assembly String      '
	
	.CODE
	
	        PUBLIC RString
	RString PROC
	        push bp
	        mov bp, sp           ; set stack frame
	        mov dx, [bp+6]       ; address of string
	        mov ah, 9            ; DOS interrupt to print string
	        int 21h
	
	        mov ax, OFFSET astr  ; address of assembly string
	        push ax              ; pass it to BASIC
	        call BasicSub
	
	        pop bp
	        ret 2
	RString ENDP
	
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BFSTRN.BAS;
	   MASM AFSTRN.ASM;
	   LINK BFSTRN AFSTRN;
	
	BFSTRN.EXE produces the following output:
	
	   BASIC String
	   Assembly String
