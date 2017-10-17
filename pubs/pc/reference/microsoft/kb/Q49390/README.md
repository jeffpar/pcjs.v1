---
layout: page
title: "Q49390: Example of Passing Numerics from MASM to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q49390/
---

## Q49390: Example of Passing Numerics from MASM to BASIC

	Article: Q49390
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 13-AUG-1990
	
	The two programs shown below demonstrate how Microsoft assembly
	language can pass common numeric types to BASIC subprograms.
	
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
	
	The following BASIC program is BNUM.BAS, which contains subprograms
	that receive common numeric types passed from assembly language:
	
	   DECLARE SUB AssemSub(dummy AS INTEGER)
	
	   CALL AssemSub(dummy%)
	   END
	
	   SUB NumInt(i AS INTEGER)
	      PRINT "Integer : "; i
	   END SUB
	
	   SUB NumLong(l AS LONG)
	      PRINT "Long    : "; l
	   END SUB
	
	   SUB NumSingle(s AS SINGLE)
	      PRINT "Single  : "; s
	   END SUB
	
	   SUB NumDouble(d AS DOUBLE)
	      PRINT "Double  : "; d
	   END SUB
	
	The following program is ANUM.ASM, which passes common numeric types
	to BASIC subprograms:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	EXTRN NumInt:PROC        ; declare BASIC procedures
	EXTRN NumLong:PROC
	EXTRN NumSingle:PROC
	EXTRN NumDouble:PROC
	.DATA
	  intnum    DW 32767              ; initialize data
	  Longnum   DD 37999
	  Singlenum DD 123.45
	  Doublenum DQ 1234.14159
	.CODE
	         PUBLIC AssemSub
	AssemSub PROC
	         push bp
	         mov bp, sp
	
	         mov ax, OFFSET intnum    ; get address of integer
	         push ax
	         call NumInt
	
	         mov ax, OFFSET Longnum   ; get address of long
	         push ax
	         call NumLong
	
	         mov ax, OFFSET Singlenum ; get address of single
	         push ax
	         call NumSingle
	
	         mov ax, OFFSET Doublenum ; get address of double
	         push ax
	         call NumDouble
	
	         pop bp
	         ret 2
	AssemSub ENDP
	         END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BNUM.BAS;
	   MASM ANUM.ASM;
	   LINK BNUM ANUM;
	
	BNUM.EXE produces the following output:
	
	   Integer : 32767
	   Long    : 37999
	   Single  : 123.45
	   Double  : 1234.14159
