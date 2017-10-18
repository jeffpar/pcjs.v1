---
layout: page
title: "Q32762: Forward Reference to Segment Name Gives Phase Error"
permalink: /pubs/pc/reference/microsoft/kb/Q32762/
---

## Q32762: Forward Reference to Segment Name Gives Phase Error

	Article: Q32762
	Version(s): 5.00  5.10 5.10A
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 10-JUL-1990
	
	A forward reference to a segment name in MASM will incorrectly
	give a "A2006: Phase error between passes" error.
	   Microsoft has confirmed this to be a problem in Version 5.10. We
	are researching this problem and will post new information as it
	becomes available.
	   A workaround is to declare empty segments at the top of your MASM
	source code, defining all segments in the order needed.
	
	   The following source example demonstrates the problem:
	
	CSEG segment para public 'CODE'
	     assume CS:CSEG
	main proc near
	     mov bx,seg sseg               ;will generate phase error
	     ret
	main endp
	CSEG ends
	SSEG segment stack 'STACK'
	     db 100h dup(?)
	SSEG ends
	end  main
	
	   The above example would have the following empty segments declared
	at the top of the source file:
	
	CSEG segment para public 'CODE'
	CSEG ends
	SSEG segment stack 'STACK'
	SSEG ends
	
	   Because the SSEG segment is declared before the MOV instruction
	is assembled, the phase error is eliminated. The CSEG segment
	is also declared to ensure that the ordering of the two segments
	is unchanged.
	   For more information about ordering of segments, refer to the
	"Microsoft Macro Assembler Programmer's Guide" and the "Microsoft
	CodeView and Utilities Guide."
