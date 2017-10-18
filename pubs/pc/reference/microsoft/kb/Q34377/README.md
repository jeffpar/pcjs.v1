---
layout: page
title: "Q34377: Function Pointers"
permalink: /pubs/pc/reference/microsoft/kb/Q34377/
---

## Q34377: Function Pointers

	Article: Q34377
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following sample program illustrates function pointers, C and
	MASM, from a MASM point of view.
	   It takes the address of the function (in this example, the address
	is loaded into ES:DX) and moves it into a 4-byte variable; it then
	does a far call to that address.
	   In this example it seems odd to call a function in this manner
	because the function is defined locally and its name in known;
	however, what if the name of the function was not known? What if you
	were programming a device driver and all that was know was the entry
	point of the function?
	   Lets say the entry point was given in ES:DX. Using the following
	technique, a name could be given to the address of the function and
	the function could be called like any other function.
	
	   The following sample program demonstrates this information:
	
	;
	;
	;    NAME:  fptr.asm
	;
	;    This program illustrates how to implement a function pointer
	;    in MACRO Assembler.
	;
	;    This technique is the same as the C compiler would generate
	;    if you were to get an assembly listing of a C program that
	;    contained a pointer to a function.
	;
	;
	dosseg
	.model small
	
	.data
	     fptr dd 1 dup(?)   ; set aside four bytes for function address
	
	.code
	;
	;   MACRO Definitions
	;
	FARCALL MACRO func_ptr
	            call dword ptr func_ptr  ; call by 4-byte far function reference
	        ENDM
	
	DosExit MACRO
	             mov  ax, 4C00h    ; ah = 4Ch ( dos exit interrupt) al = 0
	             int  21h
	        ENDM
	;
	;   FUNCTION Definitions
	;
	     PUBLIC _ClrScr
	_ClrScr PROC FAR
	
	     push bp          ; save bp
	     mov  bp, sp      ; get sp
	     push bx          ; save registers
	     push cx
	     push dx
	
	     mov ax, 0700h    ;  ah = 7,  al = 0
	     mov bx, 0700h    ;  bh = 7,  bl = 0
	     xor cx, cx       ;  cx = 0
	     mov dx, 184Fh    ;  dh = 24, dl = 79, decimal
	     int 10h
	
	     mov ax, 0200h    ; ah = 2, al = 0
	     xor bx, bx       ; bx = 0
	     xor dx, dx       ; dx = 0
	     int 10h
	
	     xor  ax, ax      ; function returns void
	
	     pop  dx          ; restore registers
	     pop  cx
	     pop  bx
	
	     mov  sp, bp      ; reset sp
	     pop  bp          ; restore bp
	
	     ret              ; return
	
	_ClrScr ENDP
	
	BEGIN:     ; main part of the program
	
	    ; Get address of the function
	
	    mov  dx, SEG _ClrScr
	    mov  es, dx
	    mov  dx, OFFSET _ClrScr   ; es:dx is the address of the function
	
	    ; Load function address into fptr
	
	    mov  WORD PTR fptr, dx    ; low word of fptr is the
	                              ; offset of the function
	    mov  WORD PTR fptr+2, es  ; high word of fptr is the
	                              ; segment of the function
	
	    ; Call the function via a function pointer
	
	    FARCALL fptr              ; call function. FARCALL is a macro
	                              ; defined above
	
	    ; Exit to DOS
	
	    DosExit                   ; Exit to DOS. DosExit is a macro
	                              ; defined above
	
	END BEGIN
