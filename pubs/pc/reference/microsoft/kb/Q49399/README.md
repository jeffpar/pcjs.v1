---
layout: page
title: "Q49399: Example Allocating Memory in MASM Released by BASIC's SETMEM"
permalink: /pubs/pc/reference/microsoft/kb/Q49399/
---

## Q49399: Example Allocating Memory in MASM Released by BASIC's SETMEM

	Article: Q49399
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_MASM S_QuickASM
	Last Modified: 5-SEP-1990
	
	The two programs shown below demonstrate how a BASIC program can use
	SETMEM to free memory for an assembly routine to get dynamic memory.
	
	This information about interlanguage calling applies to QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	For more information about interlanguage calling between BASIC and
	MASM, search in the Software/Data Library or the Microsoft Knowledge
	Base for the following word:
	
	   BAS2MASM
	
	Code Example
	------------
	
	The following BASIC program is BMEMSET.BAS, which uses SETMEM to free
	a block of memory for an assembly routine that uses a DOS interrupt to
	get dynamic memory:
	
	   DECLARE SUB AMem(BYVAL AllocSize AS INTEGER)
	   CLS
	   ' Decrease the size of the far heap so AMem can use a DOS
	   ' interrupt to get dynamic memory
	   BeforeCall% = SETMEM(-2048)
	   CALL AMem(1024%)
	   ' Return the memory to the far heap; use a larger value so
	   ' all space goes back into the heap.
	   AfterCall% = SETMEM(3500)
	   LOCATE 2, 1
	   IF AfterCall% <= BeforeCall% THEN
	      PRINT "Memory not reallocated"
	   ELSE
	      PRINT "Memory was successfully reallocated"
	   END IF
	   END
	
	The following program is AMEMSET.ASM, which allocates and deallocates
	a block of memory freed by BASIC:
	
	; The following handy .MODEL MEDIUM,BASIC directive is found in
	; MASM 5.10 but not in earlier versions:
	.MODEL MEDIUM, BASIC
	.DATA
	        Fail    DB 'Failed to allocate memory$'
	        Success DB 'Successfully allocated memory$'
	.CODE
	        PUBLIC AMem
	AMem    PROC
	        push bp
	        mov bp, sp                ; set stack frame
	        push cx
	        push es
	
	        mov ax, [bp+6]            ; get number of bytes freed
	        mov cl, 4                 ; divide by 16 to get number of
	        shr ax, cl                ;  paragraphs of memory
	        mov bx, ax
	        mov ah, 48h               ; DOS interrupt to allocate block
	        int 21h                   ;  of memory
	        mov es, ax
	        mov ah, 9
	        jnc NoFail                ; carry flag clear if successful
	        mov dx, OFFSET Fail       ; display failed message
	        int 21h
	        jmp Exit                  ; go back to BASIC
	
	NoFail: mov dx, OFFSET Success    ; display success message
	        int 21h
	        mov ah, 49h
	        int 21h
	
	Exit:   pop es
	        pop cx
	        pop bp
	        ret 2
	AMem    ENDP
	        END
	
	To demonstrate these programs from an .EXE program, compile and link
	as follows:
	
	   BC BMEMSET.BAS;
	   MASM AMEMSET.ASM;
	   LINK BMEMSET AMEMSET;
	
	BMEMSET.EXE produces the following output:
	
	   Successfully allocated memory
	   Memory was successfully reallocated
