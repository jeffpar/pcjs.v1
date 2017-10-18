---
layout: page
title: "Q39235: An Example of Declaring a Communal Variable of a Record Type"
permalink: /pubs/pc/reference/microsoft/kb/Q39235/
---

## Q39235: An Example of Declaring a Communal Variable of a Record Type

	Article: Q39235
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	Question :
	
	How can I declare a communal variable that has a record type?
	
	Response:
	
	Declare the variable with the size matching the size of the record
	type defined in the same source file. There is no need to specify that
	the variable has the predefined record type.
	
	The following sample program demonstrates this information:
	
	; module 1
	        .model small
	        dosseg
	extrn   proc2:proc
	        .stack 100h
	        .data
	color   record   blink:1, back:3, intense:1, fore:3
	        comm     near pixel:byte     ; use "byte" because
	                                     ; color has size byte.
	        .code
	start:  mov ax, @data
	        mov ds, ax
	
	        mov pixel, color <1,2,1,3> ; now the variable pixel
	                                   ; should have the value "abh",
	                                   ; which matches the
	                                   ; pattern 1,010,1,011
	        call proc2
	        mov ax, 4c00h
	        int 21h
	        end start
	
	******************************
	; module 2
	        .model small
	        dosseg
	        .stack 100h
	        .data
	color   record   blink:1, back:3, intense:1, fore:3
	        comm     near pixel:byte
	        .code
	        public proc2
	proc2   proc
	        mov ah, 0
	        mov ah, pixel  ; ah should have the value "abh"
	        ret
	proc2   endp
	        end
