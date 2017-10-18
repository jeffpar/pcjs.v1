---
layout: page
title: "Q59754: MASM Err Msg: A2006: Phase Error Forward Referencing..."
permalink: /pubs/pc/reference/microsoft/kb/Q59754/
---

## Q59754: MASM Err Msg: A2006: Phase Error Forward Referencing...

	Article: Q59754
	Version(s): 5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 12-JUL-1990
	
	Using the "SEG" directive in conjunction with forward reference to a
	procedure or a segment name will produce the error "A2006 : phase
	error between passes."
	
	The assembler incorrectly places a "NOP" instruction in the code
	generated during Pass 1. This NOP is not generated in Pass 2, so the
	assembler generates a phase error. This phase error most often will be
	against the first subsequent instruction that is associated with a
	fixup (an instruction that contains any address, such as a JMP
	<label>, CALL <label>, or MOV <reg>,<label>).
	
	Microsoft has confirmed this to be a problem in the Microsoft Macro
	Assembler Version 5.10. We are researching this problem and will post
	new information here as it becomes available.
	
	The following code produces the errors. The errors do not occur when
	the ax register is used. They occur when the bx, cx, and dx registers
	are used.
	
	_TEXT           SEGMENT PARA PUBLIC 'CODE'
	                ASSUME CS:_TEXT
	
	                mov     cx, SEG PROC1     ;error using cx, bx or dx
	
	                mov     ax, SEG PROC1     ;no error using ax
	
	                mov     cx, SEG STACKSEG ;error using cx, bx, or dx
	
	                mov     ax, SEG STACKSEG ;no error using ax
	
	STACKSEG                SEGMENT PARA PUBLIC 'STACK'
	                DB 100 DUP (?)
	STACKSEG                ENDS
	
	PROC1           PROC    FAR
	                nop
	PROC1           ENDP
	_TEXT           ENDS
	                END
	
	To work around this problem, introduce a NOP that is seen by the
	assembler only during the second pass. The following code assembles
	without an error:
	
	filler macro                      ;macro that codes a nop
	        if2                          ;in the second pass of the
	        nop                          ;assembler
	        endif
	        endm
	
	_TEXT           SEGMENT PARA PUBLIC 'CODE'
	                ASSUME CS:_TEXT
	
	                mov     cx, SEG PROC1
	                filler
	
	                mov     cx, SEG STACKSEG
	                filler
	
	STACKSEG                SEGMENT PARA PUBLIC 'STACK'
	                DB 100 DUP (?)
	STACKSEG                ENDS
	
	PROC1           PROC    FAR
	                nop
	PROC1           ENDP
	_TEXT           ENDS
	                END
