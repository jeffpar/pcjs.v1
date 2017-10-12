---
layout: page
title: "Q40103: QuickC 2.00's In-Line Assembler"
permalink: /pubs/pc/reference/microsoft/kb/Q40103/
---

	Article: Q40103
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: enduser |
	Last Modified: 17-JAN-1989
	
	QuickC Version 2.00 has the ability to handle assembly-language
	instructions in your C program. This feature is built into QuickC
	Version 2.00 and does not require an external assembler program.
	
	In-line assembly instructions can appear at any place that a valid
	C statement can reside. The following is an example using in-line
	assembly:
	
	    void main ()
	    {
	      .   ( C Code )
	      .
	      _asm {
	             mov    ah, 5
	             mov    al, 1
	             int    10h
	           }
	      .
	      .
	    }
	
	The _asm designates the code that follows as assembly. QuickC uses its
	In-Line Assembler instead of the compiler. The _asm keyword can be
	applied to individual assembly statements and blocks of assembly code.
	As in the above example, the block of assembly code is delimited by
	the {} braces. If you have only one assembly statement, the {} braces
	are not required.
	
	If you want to place more than one assembly instruction on a single
	line, place the _asm before each instruction, as in the following code
	fragment:
	
	    _asm    mov  ah, 5   _asm   mov  al, 1    _asm  int 10h
