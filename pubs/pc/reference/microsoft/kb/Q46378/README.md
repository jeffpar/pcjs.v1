---
layout: page
title: "Q46378: MASM: Linker Error L2002: Fixup Overflow"
permalink: /pubs/pc/reference/microsoft/kb/Q46378/
---

## Q46378: MASM: Linker Error L2002: Fixup Overflow

	Article: Q46378
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 30-AUG-1989
	
	The following message occurs when data defined in the data segment is
	accessed with a CS segment override:
	
	foo.OBJ(foo.ASM) : error L2002: fixup overflow at 0012 in segment _TEXT
	pos: 658 Record type: 73EE
	frm seg _TEXT, tgt seg _DATA
	
	Code Sample
	-----------
	
	       .DATA
	old_dma_vect    dd      0
	       .CODE
	;
	capture proc
	      .
	        mov     word ptr cs:old_dma_vect,bx  ;(This line caused the error)
	      .
	        end capture
