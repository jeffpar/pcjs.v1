---
layout: page
title: "Q49396: Example of Passing Variable-Length String from BASIC to MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q49396/
---

## Q49396: Example of Passing Variable-Length String from BASIC to MASM

	Article: Q49396
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 10-AUG-1990
	
	The two programs below demonstrate how a Microsoft BASIC program
	passes a variable-length string to assembly language by near
	reference.
	
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
	
	The following BASIC program is BSTR.BAS, which passes the offset of a
	variable-length string to assembly language:
	
	   DECLARE SUB RString(BYVAL soff AS INTEGER)
	   A$ = "This is the string" + "$"  ' "$" terminates string for INT call
	   CALL RString(SADD(A$))
	   END
	
	The following program is ASTR.ASM, which gets the address of a
	variable-length string and prints the string out:
	
	.MODEL MEDIUM
	.CODE
	        PUBLIC RString
	RString PROC
	        push bp
	        mov bp, sp           ; set stack frame
	        mov dx, [bp+6]       ; get offset to string
	        mov ah, 9            ; DOS interrupt to print string
	        int 21h
	        pop bp
	        ret 2
	RString ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BSTR.BAS;
	   MASM ASTR.ASM;
	   LINK BSTR ASTR;
	
	BSTR.EXE produces the following output:
	
	   This is the string
