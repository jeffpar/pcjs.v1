---
layout: page
title: "Q62305: _fastcall Register Argument Has Incorrect Value"
permalink: /pubs/pc/reference/microsoft/kb/Q62305/
---

## Q62305: _fastcall Register Argument Has Incorrect Value

	Article: Q62305
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 fastcall
	Last Modified: 15-NOV-1990
	
	In the case below, the Microsoft C 6.00 compiler will generate
	incorrect code for enregistering the arguments of a function declared
	with the _fastcall attribute.
	
	The following code provides an example of this behavior:
	
	Sample Code
	-----------
	
	#include <stddef.h>
	
	void init_windows( void );
	
	void _fastcall wxxopen( short   up_r,
	                        short   up_c,
	                        short   lo_r,
	                        short   lo_c,
	                        char    *title,
	                        short   ctrl,
	                        short   dth,
	                        short   wth,
	                        short   wc,
	                        short   fch );
	
	void init_windows()
	{
	    wxxopen( 00, 00, 02, 79, NULL, 10, 0, 0, 0, 32 );
	    wxxopen( 04, 01, 11, 78, NULL, 10, 0, 0, 0, 32 );
	    wxxopen( 22, 00, 24, 79, NULL, 10, 0, 0, 0, 32 );
	}
	
	The incorrectly generated code is for the third call to wxxopen().
	Rather than 0 (zero) being placed into the DX register for the second
	argument, a copy of the AX register, which contains 22, is moved into
	DX. This can be clearly seen in the following code lifted from the
	.COD file generated for the above source.
	
	Sample Code
	-----------
	
	;|***     wxxopen( 22, 00, 24, 79, NULL, 10, 0, 0, 0, 32 );
	; Line 22
	        *** 000041      b8 4f 00        mov     ax,79
	        *** 000044      50              push    ax
	        *** 000045      2b c0           sub     ax,ax
	        *** 000047      50              push    ax
	        *** 000048      b8 0a 00        mov     ax,10
	        *** 00004b      50              push    ax
	        *** 00004c      2b c0           sub     ax,ax
	        *** 00004e      50              push    ax
	        *** 00004f      50              push    ax
	        *** 000050      50              push    ax
	        *** 000051      56              push    si
	        *** 000052      b8 16 00        mov     ax,22
	        *** 000055      8b d0           mov     dx,ax
	        *** 000057      bb 18 00        mov     bx,24
	        *** 00005a      e8 00 00        call    @wxxopen
	
	The conditions for the error to occur appear to be very narrowly
	defined. The argument being placed into DX must be a constant 0
	(zero). The compiler must be in such a state that it considers the AX
	register to contain 0 (zero) from a previous operation. This is apparently
	the state after the SUB AX, AX instruction above. Regrettably, the AX
	register has since been used to hold the first enregistered argument.
	
	It is difficult to convince the compiler to reach this state. The
	sequence of three calls to wxxopen() with the specified arguments has
	been found to reliably produce the error on the third call.
	
	Microsoft has confirmed this to be a problem with C 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
