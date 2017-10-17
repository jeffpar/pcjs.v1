---
layout: page
title: "Q49394: Example of Passing User-Defined Type from MASM to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q49394/
---

## Q49394: Example of Passing User-Defined Type from MASM to BASIC

	Article: Q49394
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 5-SEP-1990
	
	The two programs below demonstrate how Microsoft assembly language can
	pass a user-defined type to BASIC.
	
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
	
	The following BASIC program is BUTYPE.BAS, which receives a
	user-defined type from an assembly language program and prints it out:
	
	DEFINT A-Z
	DECLARE SUB MasmSub
	TYPE mixed
	   i AS INTEGER
	   l AS LONG
	   s AS SINGLE
	   d AS DOUBLE
	   fx AS STRING * 19
	END TYPE
	DIM dummy AS mixed
	CLS
	PRINT "Calling assembly routine which will fill the";
	PRINT " user-defined type."
	CALL MasmSub
	END
	
	SUB BASICSub (dummy AS mixed)
	   PRINT "Values in user-defined type:"
	   PRINT
	   PRINT "Integer: ", dummy.i
	   PRINT "Long: ", dummy.l
	   PRINT "Single: ", dummy.s
	   PRINT "Double: ", dummy.d
	   PRINT "fixed-length String: ", dummy.f
	END SUB
	
	The following program is AUTYPE.ASM, which builds a user-defined type
	and passes it to BASIC:
	
	.MODEL MEDIUM
	          usrdefType   STRUC
	                       iAsm       DW 10
	                       lAsm       DD 43210
	                       sAsm       DD 32.10
	                       dAsm       DQ 12345.67
	                       fxAsm      DB 'Fixed-length string'
	          usrdefType   ENDS
	EXTRN BASICSub:PROC
	.DATA
	          BASICRec usrdefType <>
	.CODE
	
	          PUBLIC MasmSub
	MasmSub   PROC                     ; no stack frame is needed
	                                   ;   because no arguments are
	                                   ;   passed to assembly
	          mov ax, OFFSET BASICRec  ; get address of structure
	          push ax                  ; pass it as argument to BASIC
	          CALL BASICSUb
	          ret
	MasmSub   ENDP
	          END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BUTYPE.BAS;
	   MASM AUTYPE.ASM;
	   LINK BUTYPE AUTYPE;
	
	BUTYPE.EXE produces the following output:
	
	   Integer:   10
	   Long:      43210
	   Single:    32.10
	   Double:    12345.67
	   fixed-length String:  Fixed-length string
