---
layout: page
title: "Q34501: word Causes &quot;Illegal Operand Size&quot; Warning"
permalink: /pubs/pc/reference/microsoft/kb/Q34501/
---

## Q34501: word Causes &quot;Illegal Operand Size&quot; Warning

	Article: Q34501
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following command causes the warning "illegal operand size:"
	
	lds  dx, word ptr [bp+6]
	
	However, using dword assembles clean.
	
	The line is from the code below. The procedure foo function
	receives a pointer to a string and writes it to the screen.
	
	It accept dword and not word because the LDS assembler instruction
	reads and stores a far pointer specified by the source-memory operand.
	Using the word type should cause a warning with small model.
	The following sample code demonstrates the problem:
	
	 .model     medium
	
	 .code
	            PUBLIC  _foo
	_foo        PROC
	            push    bp
	            mov     bp, sp
	
	            lds     dx, word ptr [bp+6]    ;causes 'illegal operand size'.
	                                           ;but not with use of 'dword'
	
	            mov     ah, 40h
	            mov     bx, 1
	            mov     cx, 17
	            int     21h
	
	            pop     bp
	            ret
	_foo        ENDP
	            END
