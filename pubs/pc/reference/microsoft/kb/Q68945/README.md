---
layout: page
title: "Q68945: DWORD Local Variables Use Wrong Offset in MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q68945/
---

## Q68945: DWORD Local Variables Use Wrong Offset in MASM

	Article: Q68945
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10 fixlist5.10a
	Last Modified: 6-FEB-1991
	
	When using the LOCAL directive in the Microsoft Macro Assembler (MASM)
	version 5.10 to declare stack space for a DWORD variable, the offset
	that is generated for the variable is [BP-2]. This may result in the
	saved value of the BP register to be overwritten when a value is
	stored in the DWORD local variable.
	
	Microsoft has confirmed this to be a problem in MASM version 5.10.
	This problem was corrected in version 5.10a.
	
	Beginning with MASM 5.10, if the optional language parameter is used
	with the .MODEL directive, the LOCAL directive may be used to declare
	local variables for a procedure (PROC). When the LOCAL directive is
	used in a procedure, stack space is set aside for the number and size
	of the local variables that were declared. For example, upon
	executing the first line of the sample assembly routine below, the
	stack frame appears as follows if assembled with MASM 5.10:
	
	      ----------
	      | Return | 2 bytes
	      | address|
	      ----------
	      | Saved  | 2 bytes
	      |   BP   |
	      ----------
	      | storage| 2 bytes
	SP--> | for foo|
	      ----------
	
	The problem is that DWORD needs four bytes of storage. Because the
	"saved BP" is at a higher memory location than the storage of foo, foo
	will "overflow" into the saved BP area. Using MASM 5.10a will solve
	the problem by properly allocating 4 bytes of storage for a DWORD.
	
	Sample Code
	-----------
	
	        .MODEL SMALL, C
	        PUBLIC C myproc
	        .CODE
	
	myproc  PROC
	        LOCAL   foo:DWORD
	        nop
	        ret
	myproc  ENDP
	
	        END
