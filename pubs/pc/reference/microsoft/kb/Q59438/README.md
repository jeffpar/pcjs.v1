---
layout: page
title: "Q59438: Assembly Main Module Calling a C Function"
permalink: /pubs/pc/reference/microsoft/kb/Q59438/
---

## Q59438: Assembly Main Module Calling a C Function

	Article: Q59438
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM
	Last Modified: 29-MAR-1990
	
	It is possible to call C function from an Assembly main program. It is
	not recommended because the functionality of the C code will be
	limited. Since most C run-time functions call either the C startup
	code or the C stack check routine, it usually is not possible to make
	any C run-time calls.
	
	When compiling the C source code, it is important to use the /Gs
	switch to disable stack checking and add the following line to the C
	source code to tell the compiler/linker to not link in the startup
	code.
	
	   int _acrtused = 0;
	
	The following is sample code to demonstrate how to write an Assembly
	main module calling a C function.
	
	Code Example
	------------
	
	; Assembly switch: MASM /Mx
	
	.MODEL MEDIUM,C
	
	  EXTRN  ptrmsg:PROC
	
	.STACK 100h
	
	.DATA
	  arg1 DB 65
	  arg2 DW 5
	
	.CODE
	
	main   PROC
	       mov   ax, @data           ; Set up DGROUP
	       mov   ds, ax              ; DS pointing to DGROUP
	       xor   ax, ax              ; Clear ax register
	       mov   ax, OFFSET arg2
	       push  ax                  ; Push second argument
	       mov   ax, OFFSET arg1
	       push  ax                  ; Push first argument
	       call  ptrmsg              ; Call C function
	       add   sp,4                ; Restore stack pointer
	       mov   ax, 4C00h
	       int   21h                 ; Terminate program
	main   ENDP
	       END
	
	-------------------------------
	
	/* Compiler line: cl /Gs /c /AM      */
	
	int _acrtused = 0;             /* Do not bring in the startup code */
	
	void ptrmsg (char *a, int *b)
	{
	    *a += 1;
	    *b += 1;
	}
