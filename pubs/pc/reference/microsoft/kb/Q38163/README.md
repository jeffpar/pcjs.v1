---
layout: page
title: "Q38163: /DOSSEG Link Switch Fails to Make CodeView .exe"
permalink: /pubs/pc/reference/microsoft/kb/Q38163/
---

	Article: Q38163
	Product: Microsoft C
	Version(s): 2.20 2.30
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 9-AUG-1989
	
	Question:
	
	CodeView is failing on an .exe produced using the /DOSSEG linker
	switch. CodeView responded to an attempt to run with this .exe
	with a "not enough space" diagnostic. What is the problem?
	
	Response:
	
	The modules below demonstrate the problem. In this case, compiling the
	C source module and assembling the MASM source module with the
	appropriate CodeView switches, then linking with the /CO /DO switches
	generates a bad .exe. The problem is that CodeView displays source
	with extended ASCII characters.
	
	To work around this problem, put .DOSSEG in the MASM modules
	being linked, and omit the /DO switch rather that trying to
	force the linker to do the work. Also, switching the order of
	the linker switches may solve the problem.
	
	The following example demonstrates the problem:
	
	#include <stdio.h>
	main ()
	  {
	  long int getds(void), getdsq(void);
	  printf("ds.DATA  = %lX\nds.DATA? = %lX\n",getds(),getdsq());
	  }
	
	**************************************************************
	;        DOSSEG could be put here
	        .MODEL  small
	        .DATA
	array   dd      0
	        .DATA?
	arrayq  dd      ?
	        .CODE
	        PUBLIC  _getds,_getdsq
	_getds  PROC
	        mov     ax,SEG array
	        mov     dx,ds
	        ret
	_getds  ENDP
	_getdsq PROC
	        mov     ax,SEG arrayq
	        mov     dx,ds
	        ret
	_getdsq ENDP
	        END
