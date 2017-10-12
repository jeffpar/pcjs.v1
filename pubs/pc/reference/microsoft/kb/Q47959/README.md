---
layout: page
title: "Q47959: Description of a .MAP File's "Program Entry Point""
permalink: /pubs/pc/reference/microsoft/kb/Q47959/
---

	Article: Q47959
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 16-JAN-1990
	
	The "Program entry point" is the last item in a .MAP file. It refers
	to the segment:offset address of the first instruction of the program
	to be executed, relative to the lowest memory address in the .EXE load
	image (the program loaded into RAM). A more detailed description and
	the use of entry point(s) are noted below.
	
	The load address can be obtained by adding 10h to the segment address
	of the PSP. (In C, this is available in the variable _psp.)
	
	An entry point is where code in a module actually begins execution
	via the loading of the CS:IP (CodeSegment:InstructionPointer --
	segment:offset) registers with the entry point address. The entry
	point could be the actual beginning of a program executed by the
	operating system, or it could be an exported function from an
	OS/2 or DOS Windows dynamic link library (DLL).
	
	The "Program entry point" specified at the end of a .MAP file is where
	the operating system will begin executing the program, RELATIVE to the
	lowest memory address where the program's code will be loaded. In DOS
	or real-mode OS/2, the lowest memory address will be the lowest
	physical address in RAM. In protected-mode OS/2, the lowest relative
	address will be segment selector 1, offset 0.
	
	The lowest address your code occupies in RAM is usually the first
	routine (function, procedure, or main program body) defined at the
	beginning of your main source file, and it is assigned a RELATIVE
	address of 0000:0000 [or, typically, 0:10 for main()] in DOS or
	real-mode OS/2, or an address of 0001:0000 in protected-mode OS/2.
	
	For our current high-level languages (except Microsoft QuickPascal
	1.00), the entry point is at the beginning of the routine "__astart".
	Our high-level languages require initialization code before executing
	C's main() function or the main program code for other languages such
	as Microsoft Pascal 3.3x or 4.00, and currently __astart is where the
	initializations begin.
	
	The "Program entry point" is a segment:offset address above the
	program's relative address of 0:0. For a C program, the entry point
	will be __astart. If the entry point is something like 2:0abc hex, the
	absolute DOS physical address or the virtual OS/2 address where
	__astart will be located can be calculated as follows:
	
	     lowest address of your program's load image  1234:0400
	   + relative entry point                         +  2:0abc
	   ---------------------------------------------  ---------
	   = DOS absolute or OS/2 virtual address of      1236:0e34
	     the entry point (__astart)
