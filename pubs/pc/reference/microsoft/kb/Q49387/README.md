---
layout: page
title: "Q49387: Example of Passing Array of Singles from BASIC to MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q49387/
---

## Q49387: Example of Passing Array of Singles from BASIC to MASM

	Article: Q49387
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 10-AUG-1990
	
	The two programs below demonstrate how a Microsoft BASIC program
	passes an array of single precision numbers to assembly language by
	far reference.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00 4.00b and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about passing other types of parameters between
	BASIC and MASM, search in the Software/Data Library for the following
	word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is BSINGLE.BAS, which creates an array of
	single-precision numbers, then passes the array to assembly language
	by far reference:
	
	   DEFINT A-Z
	   DECLARE SUB MasmSub (BYVAL segment, BYVAL offset, BYVAL number)
	
	   'REM $DYNAMIC     'Can be either STATIC (the default) or DYNAMIC
	   DIM s!(1 TO 10)   'Remove comment to define array DYNAMICally
	   FOR i% = 1 to 10
	      s!(i%) = i%
	   NEXT
	   CLS
	   PRINT "Calling assembly routine to fill array elements..."
	   CALL MasmSub(VARSEG(s!(1)), VARPTR(s!(1)), 10)
	   PRINT "Values in array:"
	   FOR i% = 1 TO 10
	       PRINT s!(i);
	   NEXT
	   END
	
	The following program is ASINGLE.ASM, which gets an array of
	single-precision numbers by far reference, then makes each number
	negative:
	
	.MODEL MEDIUM
	.CODE
	        PUBLIC MasmSub
	MasmSub PROC
	        push bp
	        mov bp, sp
	
	        mov es, [bp+10]  ; get segment of array
	        mov bx, [bp+8]   ; get offset of array
	        add bx, 3        ; offset to byte holding sign bit
	        mov cx, [bp+6]   ; get length of array
	        mov al, 1
	
	next:   or BYTE PTR es:[bx], 80h     ; set sign bit
	        add bx, 4        ; increment counter to next array element
	        loop next        ; loop to assign next array element
	        pop bp
	        ret 6
	MasmSub ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BSINGLE.BAS;
	   MASM ASINGLE.ASM;
	   LINK BSINGLE ASINGLE;
	
	BSTRF.EXE produces the following output:
	
	   Calling assembly routine to fill array elements...
	   Values in array:  -1 -2 -3 -4 -5 -6 -7 -8 -9 -10
