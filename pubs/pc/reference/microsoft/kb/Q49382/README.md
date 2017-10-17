---
layout: page
title: "Q49382: Example of Passing BASIC String Descriptor to MASM (Far)"
permalink: /pubs/pc/reference/microsoft/kb/Q49382/
---

## Q49382: Example of Passing BASIC String Descriptor to MASM (Far)

	Article: Q49382
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 13-AUG-1990
	
	The two programs shown below demonstrate how a Microsoft BASIC program
	passes a string descriptor to assembly language by far reference.
	
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
	
	The following BASIC program is BSTRF.BAS, which passes a string
	descriptor (of a variable-length string) to assembly language by far
	reference:
	
	   A$ = "This is the String" + "$"    ' "$" terminates the string for
	                                      ' INT call
	   CALLS RString(A$)   ' CALLS passes far address
	   END
	
	The following program is ASTRF.ASM, which gets a BASIC string
	descriptor, then prints the string:
	
	; The following handy .MODEL directive is found in MASM 5.10 but not
	; in earlier versions:
	.MODEL MEDIUM, BASIC
	.CODE
	        PUBLIC RString
	RString PROC
	        push bp
	        mov bp, sp       ; set stack frame
	        push ds
	        mov ds, [bp+8]   ; segment of descriptor
	        mov bx, [bp+6]   ; offset of descriptor
	        mov dx, [bx+2]   ; address of actual string
	        mov ah, 9        ; DOS interrupt to print string
	        int 21h
	        pop ds
	        pop bp
	        ret 4
	RString ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BSTRF.BAS;
	   MASM ASTRF.ASM;
	   LINK BSTRF ASTRF;
	
	BSTRF.EXE produces the following output:
	
	   This is the string
