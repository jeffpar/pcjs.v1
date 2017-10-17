---
layout: page
title: "Q49384: Example of Passing BASIC String Descriptor to MASM (Near)"
permalink: /pubs/pc/reference/microsoft/kb/Q49384/
---

## Q49384: Example of Passing BASIC String Descriptor to MASM (Near)

	Article: Q49384
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 10-AUG-1990
	
	The two programs below demonstrate how a Microsoft BASIC program
	passes a BASIC string descriptor to assembly language by near
	reference.
	
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
	
	The following BASIC program is BSTRN.BAS, which passes a string
	descriptor to assembly language by near reference:
	
	   DECLARE SUB RString(A AS STRING)
	   A$ = "This is the String" + "$"  ' "$" terminates the string
	                                    '     for INT call
	   CALL RString(A$)
	   END
	
	The following program is ASTRN.ASM, which gets a string descriptor
	from BASIC by near reference and prints the string out:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.CODE
	        PUBLIC RString
	RString PROC
	        push bp
	        mov bp, sp
	        mov bx, [bp+6]     ; get offset of string descriptor
	        mov dx, [bx+2]     ; get address of string
	        mov ah, 9          ; int call to print string
	        int 21h
	        pop bp
	
	        ret 2
	RString ENDP
	
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BSTRN.BAS;
	   MASM ASTRN.ASM;
	   LINK BSTRN ASTRN;
	
	BSTRN.EXE produces the following output:
	
	   This is the string
