---
layout: page
title: "Q49393: Example of Passing User-Defined Type from BASIC to MASM (Near)"
permalink: /pubs/pc/reference/microsoft/kb/Q49393/
---

## Q49393: Example of Passing User-Defined Type from BASIC to MASM (Near)

	Article: Q49393
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 5-SEP-1990
	
	The two programs shown below demonstrate how a Microsoft BASIC program
	passes a user-defined type to assembly language by near reference.
	
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
	
	The following BASIC program is UNEAR.BAS, which passes a user-defined
	type to assembly language by near reference:
	
	   DEFINT A-Z
	   TYPE mixed
	      i AS INTEGER
	      l AS LONG
	      s AS SINGLE
	      d AS DOUBLE
	      fx AS STRING * 19
	   END TYPE
	   DECLARE SUB MasmSub (dummy AS mixed)
	   DIM dummy AS mixed
	   CLS
	   PRINT "Calling assembly routine to fill the user-defined type."
	   CALL MasmSub(dummy)
	   PRINT "Values in user-defined type:"
	   PRINT "Integer: ", dummy.i
	   PRINT "Long: ", dummy.l
	   PRINT "Single: ", dummy.s
	   PRINT "Double: ", dummy.d
	   PRINT "fixed-length String: ", dummy.fx
	   END
	
	The following program is AUNEAR.ASM, which gets a BASIC user-defined
	type by near reference and copies data into it:
	
	.MODEL MEDIUM
	          usrdefType   STRUC
	                       iAsm       DW 10
	                       lAsm       DD 43210
	                       sAsm       DD 32.10
	                       dAsm       DQ 12345.67
	                       fxAsm      DB 'Fixed-length string'
	          usrdefType   ENDS
	.DATA
	          AsmRec usrdefType <>
	
	          PUBLIC MasmSub
	MasmSub   PROC
	          push bp
	          mov  bp,sp            ; set stack frame
	          push es
	          push di
	          push si
	          push cx
	          push ds
	          pop  es
	
	          mov di,[bp+6]         ; get offset of user-defined type
	          mov si,OFFSET AsmRec  ; set up for copy
	          mov cx,37             ; size of structure
	          rep movsb             ; copy values to BASIC variable
	
	          pop cx
	          pop si
	          pop di
	          pop es
	          pop bp
	          ret 2
	MasmSub   ENDP
	          END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC UNEAR.BAS;
	   MASM UANEAR.ASM;
	   LINK UNEAR UANEAR;
	
	UNEAR.EXE produces the following output:
	
	   Integer:   10
	   Long:      43210
	   Single:    32.10
	   Double:    12345.67
	   fixed-length String:  Fixed-length string
