---
layout: page
title: "Q39373: Warnings and Incorrect Code from Register Mismatch"
permalink: /pubs/pc/reference/microsoft/kb/Q39373/
---

## Q39373: Warnings and Incorrect Code from Register Mismatch

	Article: Q39373
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |  buglist5.10
	Last Modified: 12-JAN-1989
	
	The code below is correctly flagged as an error in MASM Version 5.00,
	but is passed in Version 5.10.
	
	Macro Assembler Version 5.10 fails to generate an error on the MOV
	instruction using the 8-bit registers (AH, BH, CH, DH, AL, BL, CL, DL)
	with segement registers (CS, DS, ES, SS). The code generated is also
	in error. Each of the (8-bit) byte registers maps to the set (SP, DI,
	BP, SI, AX, BX, CX, DX).
	
	"Warning A4057: Illegal size for operand" is incorrectly generated.
	The correct message should be "Error A2019: Wrong type of register."
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
	
	The following sample code demonstrates the problem:
	
	_TEXT   segment word public 'CODE'
	                                ; Generated code
	        mov     ds, ah          ; mov   ds, sp
	        mov     ds, bh          ; mov   ds, di
	        mov     ds, ch          ; mov   ds, bp
	        mov     ds, dh          ; mov   ds, si
	
	        mov     ds, al          ; mov   ds, ax
	        mov     ds, bl          ; mov   ds, bx
	        mov     ds, cl          ; mov   ds, cx
	        mov     ds, dl          ; mov   ds, dx
	
	        mov     ah, 4ch
	        int     21h
	_TEXT   ends
	        end
