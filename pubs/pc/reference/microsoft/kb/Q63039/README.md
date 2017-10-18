---
layout: page
title: "Q63039: Passing a Constant from C to Assembly with a Header File"
permalink: /pubs/pc/reference/microsoft/kb/Q63039/
---

## Q63039: Passing a Constant from C to Assembly with a Header File

	Article: Q63039
	Version(s): 5.10 5.10a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 3-JUL-1990
	
	The example below illustrates how to pass a constant value between C
	and Assembly without passing the constant as a parameter. This
	information also applies to Microsoft C for OS/2 versions 5.10 and
	6.00.
	
	The constant in C is given the type identifier "const" and placed in a
	header file. This makes the constant public. Within the assembly
	module, the variable is declared as "extrn" in two places.
	
	At the top of the assembly module it indicates to the assembler that
	the variable is declared externally. It then needs to be declared
	within the procedure. This allows the language translator (assembler)
	to provide the right correction record for the linker to resolve.
	
	The following code illustrates the above:
	
	#include <stdio.h>
	#include "test.h"     /*Header file with constant declared*/
	
	extern void testor();
	
	main()
	
	{
	
	 printf("Selec is initially %xH\n", selec);
	
	 testor();
	
	 printf("Selec is modified to %xH\n", selec);
	
	 }
	
	The contents of the header file "test.h" are as follows:
	
	   const int selec = 0x77;
	
	The following is the assembly module that is called:
	
	extrn _selec:far               ;selec declared extrn
	dgroup    group dataseg
	dataseg   segment para public 'data'
	dataseg   ends
	
	codeseg   segment para public 'code'
	codeseg   ends
	
	codeseg   segment
	
	          public _testo
	_testor proc far
	
	          extrn  _selec:far            ;selec declared extrn
	          push    bp
	          mov     bp,sp
	
	          assume  ds:dgroup
	          mov ax, dgroup
	          mov ds, ax
	
	          lea bx, dgroup:_selec  ;underscore added for compatibility
	                                 ;with C language conventions
	
	          mov ax, word ptr dgroup:[bx] ;viewed through CodeView ax=77H
	
	          mov word ptr[bx], 0A8H       ;value in selec changed to A8H
	
	          pop     bp
	
	          ret
	
	_testor endp
	
	codeseg ends
	
	     end
	
	The following is the makefile used to compile and link the above
	files:
	
	all=1.obj 2.obj
	                       ;update pseudo-target ensures a
	                       ;compile and link each time make is invoked
	update: 1.c
	    cl /Zi /AL /c 1.c
	
	update: 2.asm
	    masm /Zi 2.asm;
	
	update: $(all)
	    link /co /M  $(all),,1,/nod llibcer;
