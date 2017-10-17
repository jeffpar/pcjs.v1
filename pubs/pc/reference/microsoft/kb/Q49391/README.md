---
layout: page
title: "Q49391: Example of Passing Array of BASIC String Descriptors to MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q49391/
---

## Q49391: Example of Passing Array of BASIC String Descriptors to MASM

	Article: Q49391
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 13-AUG-1990
	
	The two programs shown below demonstrate how a Microsoft BASIC program
	can pass an array of string descriptors to assembly language.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) version 7.00 and 7.10 for MS-DOS
	and MS OS/2.
	
	For Microsoft BASIC PDS versions 7.00 or 7.10, this example works
	only with near strings. If using far strings (BC /Fs or in QBX.EXE),
	you must use SSEG and SADD to gain access to the location of strings.
	
	For more information about passing other types of parameters between
	BASIC and MASM, search in the Software/Data Library or the Microsoft
	Knowledge Base for the following word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is BSTR.BAS, which gets an array of
	strings from the user and calls an assembly language program that
	capitalizes the strings:
	
	' This program demonstrates passing an array of strings
	' to an assembly language routine. The assembly language
	' routine then receives the address of the array and
	' interprets the array as an array of string descriptors.
	' It then uses the descriptors to get the length and address
	' of the strings. It uses these two values to capitalize all of
	' the lowercase alphabetic characters in any of the strings, and
	' to skip all others.
	' It is very important to pass the assembly routine the number
	' of elements in the array.
	
	OPTION BASE 0
	DECLARE SUB UpCaseArray (BYVAL ArrayAddress%, arraylen%)
	' BYVAL is necessary because we want to pass the VALUE of
	' the address, not a pointer to the address.
	DIM Num%, Array1$(20)
	CLS
	
	WHILE NOT a$ = "quit"
	   INPUT "Enter a string ('quit' to end): ", a$
	   Array1$(Num%) = a$
	   Num% = Num% + 1
	WEND
	
	CALL UpCaseArray(VARPTR(Array1$(0)), Num%)
	CLS
	FOR i% = 0 TO (Num% - 1)
	   PRINT Array1$(i%)
	NEXT
	END
	
	The following program is ASTR.ASM. It accepts an array of BASIC string
	descriptors. ASTR.ASM goes through each of the strings in the array
	and capitalizes all of the letters.
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in MASM
	; 5.10 but not in earlier versions:
	.MODEL MEDIUM,BASIC
	.CODE
	        PUBLIC UpCaseArray
	UpCaseArray PROC FAR
	        push bp
	        mov  bp,sp
	        push di
	        mov bx,[bp+6]    ; Argument #2: Number of array elements.
	        mov cx,[bx]      ; Get the actual number of array elements.
	        jcxz EndOutLoop  ; If the array has 0 elements, then quit.
	        mov bx,[bp+8]    ; Argument #1: Which is a pointer to an
	                         ; array of descriptors.
	OutLoop:                 ; CX is the outer-OutLoop counter.
	        push cx          ; Save the outer loop counter.
	        mov cx,[bx]      ; Get the first 2 bytes of the current
	                         ; descriptor which is the string length.
	        jcxz EndInLoop   ; If zero length, end the inner loop.
	        mov di,[bx+2]    ; The second 2 bytes is the address.
	                         ; DI = pointer to current string.
	InLoop:                  ; Check if the char needs to be capitalized.
	        cmp byte ptr [di],'a'  ; Is it < a ?
	        jb I1                  ; If so, then move to the next char.
	        cmp byte ptr [di],'z'  ; Is is > z ?
	        ja I1                  ; If so, then move on to the next char.
	        and byte ptr [di],05Fh ; Make uppercase. Mask -> (0101 1111).
	I1:     inc di                 ; Move on to next character in the
	                               ;    string.
	        loop InLoop            ; Do it for all characters
	                               ;    (until CX = 0).
	                               ; Note: 'loop' decrements CX.
	EndInLoop:
	        add bx,4               ; Move on to next descriptor.
	        pop cx                 ; Restore the outer loop counter.
	        loop OutLoop           ; Do for all descriptors
	                               ;    (until CX = 0).
	EndOutLoop:
	        pop di
	        pop bp
	        ret 4
	UpCaseArray ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BSTR.BAS;
	   MASM ASTR.ASM;
	   LINK BSTR ASTR;
	
	BSTRF.EXE produces the following output:
	
	   Enter a string ('quit' to end): First String
	   Enter a string ('quit' to end): Second String
	   Enter a string ('quit' to end): quit
	
	   FIRST STRING
	   SECOND STRING
