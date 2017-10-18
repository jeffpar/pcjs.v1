---
layout: page
title: "Q39520: Passing an Integer from C to MASM, Returning a Double"
permalink: /pubs/pc/reference/microsoft/kb/Q39520/
---

## Q39520: Passing an Integer from C to MASM, Returning a Double

	Article: Q39520
	Version(s): 5.10
	Operating System: MS DOS
	Flags: ENDUSER | S_C
	Last Modified: 12-JAN-1989
	
	The following MASM program shows how to receive an integer from a C
	program, then pass the value back to the C program as a double. Note:
	This routine was composed for the large-memory model and assumes that
	a coprocessor exists on the system.
	
	Below is the C program that calls the MASM routine. It should be
	compiled for large-memory model and either 8087 or emulator-math
	library.
	
	The following is the sample program:
	
	#include <stdio.h>
	
	extern double abc(int x);
	
	main()
	{
	
	int x;
	double y;
	
	x=7;
	y=abc(x);
	printf("%lf is the value of y\n", y);
	
	}
	
	Below is the MASM routine. The main piece to this program is the
	filled instruction that transforms the integer to a floating-point
	real, then pushes the value on the co-processor stack. The other point
	is to obtain the segment and offset of the __fac variable. Anything
	over 2 bytes cannot be stored in the AX register, so C will look to
	the memory location pointed to by DX:AX.
	
	The following is the MASM routine:
	
	        .MODEL LARGE,C ;C so Masm will use C naming conventions
	        .DATA
	        .CODE
	EXTRN _fac:QWORD       ; __fac is the global variable used by C
	                       ; for storing floating point accumulations
	        PUBLIC  abc
	abc     PROC FAR
	        push    bp
	        mov     bp,sp
	        fild    WORD PTR [bp+6]
	        mov     dx,SEG _fac
	        mov     es,dx
	        fstp    QWORD PTR es:_fac  ; this pops the value off of
	        mov     ax,OFFSET _fac     ; the co-processor and puts it
	        fwait                      ; in __fac
	        mov     sp,bp
	        pop     bp
	        ret
	
	abc     ENDP
	        END
