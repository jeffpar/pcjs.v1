---
layout: page
title: "Q58194: How to Write Your Own &#95;&#95;chkstk Routine"
permalink: /pubs/pc/reference/microsoft/kb/Q58194/
---

	Article: Q58194
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm s_quickc
	Last Modified: 20-FEB-1990
	
	Problem:
	
	I am trying to rewrite the stack checking routine (__chkstk) so that I
	can work around some of the assumptions that it makes.
	
	These assumptions are DS==SS, and that Microsoft's internal variables
	point to the beginning/end of the stack.
	
	Response:
	
	The stack checking routine actually allocates space on the stack, so
	doing a stack checking routine that just does a RET does not work. The
	following code demonstrates the bare necessities for writing your own
	__chkstk routine:
	
	                ;   a chkstk routine for the small/compact memory models
	.MODEL SMALL
	.DATA
	
	PUBLIC STKHQQ
	
	STKHQQ dw     dataoffset _end+STACKSLOP
	
	.CODE
	
	PUBLIC __chkstk
	
	__chkstk PROC
	
	        pop     cx      ; grab the return address
	        sub     sp, ax
	        jmp     cx
	
	__chkstk ENDP
	
	END
	
	                ;   a chkstk routine for the medium/large memory models
	.MODEL LARGE
	.DATA
	
	PUBLIC STKHQQ
	
	STKHQQ dw    dataoffset _end+STACKSLOP
	
	.CODE
	
	PUBLIC __chkstk
	
	__chkstk PROC
	
	        pop     cx      ; grab the return address
	        pop     dx      ; (and its segment)
	
	        sub     sp, ax
	
	        push    dx      ; push the return address
	        push    cx
	        ret             ; and go back to that address
	
	__chkstk ENDP
	
	END
	
	Currently, STACKSLOP is defined as being 256 bytes for DOS and 512
	bytes for OS/2, although this may change with future versions of the
	compiler.
	
	It is unsafe to do just a simple return from inside this function
	because the stack would not be modified. In one scenario, if a
	function assumes that it has X amount of stack space and that the
	stack space hasn't been allocated, the function will write over
	whatever is currently on the stack (this function could do a memory
	move of data onto the stack rather than pushing and popping the
	stack). Because of this, you must allocate space on the stack.
	
	You cannot simply turn off stack checking because some functions
	(printf() in particular) have a call to __chkstk hardcoded.
	
	To get the above example working, let's assume that it is in a file
	called CHKSTK.ASM. Assemble with the /MX switch, to make all symbols
	case sensitive, as follows:
	
	   MASM /MX chkstk.asm ;
	
	   or
	
	   QCL /Cx chkstk.asm
	
	You can then link your program with this module in the following way:
	
	   LINK /NOE program chkstk ;
	
	This assumes that your program has been compiled successfully and that
	it is named "program." It also assumes that you are using the same
	memory model for both modules.
	
	This information is correct for Microsoft C Versions 5.10 and earlier.
	It is also correct for QuickC Versions 2.00 and earlier, as well as
	QuickAssembler Version 2.01.
