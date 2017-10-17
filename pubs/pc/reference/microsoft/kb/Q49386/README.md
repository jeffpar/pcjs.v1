---
layout: page
title: "Q49386: Example of Passing Array of Long Integers from BASIC to MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q49386/
---

## Q49386: Example of Passing Array of Long Integers from BASIC to MASM

	Article: Q49386
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 13-AUG-1990
	
	The two programs shown below demonstrate how a Microsoft BASIC program
	passes an array of long (4-byte) integers to assembly language.
	
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
	
	The following BASIC program is BLONG.BAS, which creates an array of
	long integers and passes it to assembly language by far reference:
	
	   DEFINT A-Z
	   DECLARE SUB MasmSub (BYVAL segment, BYVAL offset, BYVAL number)
	
	   'REM $DYNAMIC     'Can be either STATIC (the default) or DYNAMIC
	   DIM l&(1 TO 10)   'Remove comment to define array DYNAMICally
	
	   CLS
	   PRINT "Calling assembly routine to fill array elements..."
	   CALL MasmSub(VARSEG(l&(1)), VARPTR(l&(1)), 10)
	   PRINT "Values in array:"
	   FOR i% = 1 TO 10
	       PRINT l&(i);
	   NEXT
	   END
	
	The following program is ALONG.ASM, which receives an array of long
	integers and fills each array element with a 1:
	
	.MODEL MEDIUM
	.CODE
	        PUBLIC MasmSub
	MasmSub PROC
	        push bp
	        mov bp,sp
	        mov es,[bp+10]   ; get segment of array
	        mov bx,[bp+8]    ; get offset of array
	        mov cx,[bp+6]    ; get length of array
	        mov al,1
	next:   mov es:[bx], al  ; put one in the array element
	        add bx, 4        ; increment counter to next array element
	        loop next        ; loop to assign next array element
	        pop bp
	        ret 6
	MasmSub ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BLONG.BAS;
	   MASM ALONG.ASM;
	   LINK BLONG ALONG;
	
	BLONG.EXE produces the following output:
	
	   Calling assembly routine to fill array elements...
	   Values in array: 1 1 1 1 1 1 1 1 1 1
