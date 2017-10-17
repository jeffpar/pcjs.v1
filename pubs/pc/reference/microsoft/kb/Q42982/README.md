---
layout: page
title: "Q42982: Altering BP Register in In-Line Assembly Block"
permalink: /pubs/pc/reference/microsoft/kb/Q42982/
---

## Q42982: Altering BP Register in In-Line Assembly Block

	Article: Q42982
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | inline
	Last Modified: 2-MAY-1989
	
	In Microsoft QuickC Version 2.00, altering BP register in an in-line
	assembly block is not recommended. BP is used to reference the
	variables on the stack. If, for some reason, the BP register has to be
	modified, it should be pushed on the stack first. Before the BP
	register is popped back, referencing stack variables should avoided.
	The following is an example:
	
	/* sample program */
	#include <stdio.h>
	
	int nGlobal = 10 ;
	void main (void)
	{
	int nStackVar = 1 ;
	
	/* open the register window to observe the registers.
	** open the debug window to observe the variables */
	_asm {
	        mov ax, nStackVar   ; nStackVar is referenced correctly
	        push bp
	        mov bp, sp          ; change bp
	        mov ax, nStackVar   ; nStackVar is not right
	        mov bx, nGlobal     ; nGlobal is OK
	        pop bp
	        mov ax, nStackVar   ; nStackVar is OK again
	        }
	}
