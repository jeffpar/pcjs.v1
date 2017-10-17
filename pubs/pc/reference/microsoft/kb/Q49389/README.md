---
layout: page
title: "Q49389: Example Passing Fixed-Length String from BASIC to MASM (Far)"
permalink: /pubs/pc/reference/microsoft/kb/Q49389/
---

## Q49389: Example Passing Fixed-Length String from BASIC to MASM (Far)

	Article: Q49389
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 13-AUG-1990
	
	The two programs shown below demonstrate how Microsoft BASIC passes a
	fixed-length string to assembly language by far reference.
	
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
	
	The following BASIC program is BFSTRF.BAS, which creates a
	fixed-length string and passes it to assembly language to be printed:
	
	   DECLARE SUB RString(BYVAL sseg AS INTEGER, BYVAL soff AS INTEGER)
	
	   DIM a AS STRING * 20
	
	   CLS
	   a = "BASIC String$" ' "$" terminates string for assembly
	   CALL RString(VARSEG(a), VARPTR(a))
	   END
	
	The following program is AFSTRF.ASM, which gets a fixed-length string
	from BASIC and prints it:
	
	.MODEL MEDIUM, BASIC
	.CODE
	        PUBLIC RString
	RString PROC
	        push bp
	        mov bp, sp       ; set stack frame
	        push ds
	        mov ds, [bp+8]   ; segment of string
	        mov dx, [bp+6]   ; offset of string
	        mov ah, 9        ; DOS interrupt to print string
	        int 21h
	        pop ds
	        pop bp
	        ret 4
	RString ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BFSTRF.BAS;
	   MASM AFSTRF.ASM;
	   LINK BFSTRF AFSTRF;
	
	BFSTRF.EXE produces the following output:
	
	   BASIC String
