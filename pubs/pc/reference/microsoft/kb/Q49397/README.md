---
layout: page
title: "Q49397: Example of Passing a String Descriptor from MASM to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q49397/
---

## Q49397: Example of Passing a String Descriptor from MASM to BASIC

	Article: Q49397
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 13-AUG-1990
	
	The two programs shown below demonstrate how Microsoft assembly
	language can create a BASIC string descriptor and pass it to BASIC.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2 and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, search in the Software/Data Library or the Microsoft
	Knowledge Base for the following word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is BSTRDESC.BAS, which is passed a string
	created in assembly language and prints the string out:
	
	   DECLARE SUB MkString
	   CALL MkString
	   END
	   SUB BasicSub(TheString AS STRING)
	      PRINT LEN(TheString)
	      PRINT TheString
	   END SUB
	
	The following program is ASTRDESC.ASM, which builds a string
	descriptor that is passed back to the calling BASIC program:
	
	.MODEL MEDIUM
	        SType   STRUC
	                SLength DW 18
	                Soff    DW ?
	        SType   ENDS
	.DATA
	        StringDesc  SType <>
	        TheString   DB 'This is the string'
	
	.CODE
	            EXTRN BasicSub:PROC
	
	            PUBLIC MkString
	MkString    PROC
	            mov ax, OFFSET TheString       ; set up string descriptor
	            mov bx, OFFSET StringDesc.Soff
	            mov [bx], ax
	            mov ax, OFFSET StringDesc.SLength
	            push ax           ; pass address of descriptor to BASIC
	            CALL BasicSub
	            ret
	MkString    ENDP
	            END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BSTRDESC.BAS;
	   MASM ASTRDESC.ASM;
	   LINK BSTRDESC ASTRDESC;
	
	BSTRDESC.EXE produces the following output:
	
	   This is the string
