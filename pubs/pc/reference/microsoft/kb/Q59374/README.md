---
layout: page
title: "Q59374: Problems with Using TYPE Operator and SI Index Register"
permalink: /pubs/pc/reference/microsoft/kb/Q59374/
---

## Q59374: Problems with Using TYPE Operator and SI Index Register

	Article: Q59374
	Version(s): 5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist5.10a
	Last Modified: 29-MAR-1990
	
	There is a problem when using the type operator referenced from a
	variable and the SI register.
	
	The following commented code can be assembled to demonstrate the
	problem.
	
	 .model small
	 .stack 800h                 ; Allocate 2K stack space
	 .data
	 var1 dw 0
	 .code
	 main proc
	 mov ax,@data                ; This line and the next are required to
	 mov ds,ax                   ; access the data segment properly.
	
	 ; Each of the following CMP instructions should produce the exact same
	 ; code. The first three items do not produce the correct code.
	 ;
	 ; The opcode portion of the instruction is 3b84 in the correct examples
	 ; and 3b06 in the incorrect examples.
	 ;
	 ; The type operator returns a number that represents the type of an
	 ; expression. This is normally the size of the variable.
	 ; For example, a variable declared as dw will cause TYPE to return
	 ; the number 2.
	
	 cmp ax,var1[si]+type var1   ; Incorrect code generated
	 cmp ax,var1[si]+(type var1) ; Incorrect code generated
	 cmp ax,var1[si]+[type var1] ; Incorrect code generated
	 cmp ax,type var1+var1[si]   ; correct code generated
	 cmp ax,var1[si+type var1]   ; correct code generated
	 cmp ax,var1[si]+2           ; correct code generated
	 cmp ax,var1[si+2]           ; correct code generated
	
	 main endp
	 end main
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
