---
layout: page
title: "Q50521: QuickAssembler 2.01 Cannot Debug Code in INCLUDELIB Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q50521/
---

## Q50521: QuickAssembler 2.01 Cannot Debug Code in INCLUDELIB Libraries

	Article: Q50521
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.01
	Last Modified: 18-DEC-1989
	
	Due to the INCLUDELIB directive, the QuickAssembler cannot debug
	source code in libraries that are linked in. When tracing into the
	library that is included with the directive, the debugger stops
	execution of the program and reassembles the source for the library
	routine. This is not the expected behavior of the assembler/debugger,
	but the following workarounds are quite simple.
	
	The first option is to debug the library routine before placing it in
	the library. To do this, include the file in the program list, which
	then links the object file instead of the library. In this form, the
	routine can be traced into and the code can be debugged. When the
	modules have been debugged, they can then be included in a library
	that is linked in by use of the INCLUDELIB directive. After the
	routines are included in the library, use the F10 key to step over the
	calls to routines in the library. This executes the routine without
	trying to display the source for it.
	
	Another workaround is to put the library in the program list instead
	of using INCLUDELIB. By including the library in the program list,
	QuickAssembler will debug source code that is in the library routine.
	Therefore, you can trace into the source code (even when it is
	included in a library) without problem. Use this option if you want to
	trace into any function in your program (meaning routines in both
	object modules and libraries.
	
	Microsoft has confirmed this to be a problem with QuickAssembler
	Version 2.01. We are researching this problem and will post new
	information as it becomes available.
	
	Below is a sample program (consisting of two files) that demonstrates
	the problem:
	
	******** FILE 1 ********
	
	;  HELLO.ASM
	;
	;  This is a simple hello world program that will use
	;  both DOS display string and DOS Write functions.
	
	TITLE  HELLO
	DOSSEG
	; Uncomment the following INCLUDELIB statement, then step through the
	; CALL WRT line to step into the code for WRT. This will cause the
	; problem.
	;INCLUDELIB wrt.lib
	.MODEL SMALL
	.DATA
	MSG      DB   "Hello World",0Dh,0Ah,24h
	
	.STACK 800H
	
	.CODE
	                EXTRN WRT:PROC
	.STARTUP
	                PUSH  DX
	                PUSH  CX
	                PUSH  BX
	
	                MOV   AH, 09h           ; DOS DISPLAY STRING
	                MOV   DX, OFFSET MSG    ; ADDRESS OF STRING
	                INT   21h
	
	                CALL  WRT               ; MAKE THE WRITE CALL!
	
	    XOR   AL,AL             ; SET UP RETURN CODE
	.EXIT
	                END
	
	******** FILE 2 ********
	
	; WRT.ASM
	;
	; Assemble this file and put it into a library called WRT.LIB. (This
	; can be done by typing LIB WRT.LIB+WRT.OBJ; after you have assembled
	; WRT.ASM.
	;
	; This file MUST be linked to the above program to avoid unresolved
	; externals. Either link the .OBJ file or the .LIB file with a program
	; list, OR uncomment the INCLUDELIB directive above.
	
	TITLE  WRT
	DOSSEG
	.MODEL SMALL
	.DATA
	MYNAME   DB   "John Smith",0Dh, 0Ah,24h
	LNAME    EQU  $-MYNAME-1
	
	.CODE
	PUBLIC WRT
	WRT   PROC
	                MOV   AH, 40h           ; DOS WRITE FUNCTION
	                MOV   BX, 01h           ; HANDLE FOR STDOUT
	                MOV   CX, LNAME         ; NUMBER OF CHARACTER TO WRITE
	                MOV   DX, OFFSET MYNAME ; OFFSET OF STRING TO PRINT
	                INT   21h
	
	                RET
	WRT   ENDP
	                END
