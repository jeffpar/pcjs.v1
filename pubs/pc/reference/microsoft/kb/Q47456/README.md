---
layout: page
title: "Q47456: MASM Err Msg: Error L2002: Fixup Overflow"
permalink: /pubs/pc/reference/microsoft/kb/Q47456/
---

## Q47456: MASM Err Msg: Error L2002: Fixup Overflow

	Article: Q47456
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-SEP-1989
	
	The following message occurs when data defined in the data segment is
	overridden with a Segment Override using the code segment register:
	
	foo.OBJ(foo.ASM): error L2002: fixup overflow at 0012 in segment_TEXT
	pos: 658 Record type: 73EE
	frm seg _TEXT, tgt seg _DATA
	
	This error occurs when you incorrectly try to access data in the code
	segment rather than in the data segment in the following line:
	
	        mov     word ptr cs:old_dma_vect,bx     ;
	
	The line should be as follows:
	
	     mov        word ptr ds:old_dma_vect,bx   ;
	
	Code Sample:
	
	      .DATA
	old_dma_vect    dd      0
	       .CODE
	;
	capture proc
	      .
	      .
	      .
	        mov     word ptr cs:old_dma_vect,bx     ; (INCORRECT)
	     mov        word ptr ds:old_dma_vect,bx   ; (CORRECT)
	      .
	        end capture
