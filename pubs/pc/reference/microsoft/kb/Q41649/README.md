---
layout: page
title: "Q41649: QuickC 2.00 README.DOC: Limits on _asm Identifiers"
permalink: /pubs/pc/reference/microsoft/kb/Q41649/
---

	Article: Q41649
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 2, "Notes on 'C for Yourself.'" The following
	notes refer to specific pages in "C for Yourself."
	
	Page  273  Limits on _asm Identifiers
	
	Never use reserved assembly words as labels, variable names, or other
	identifiers within an _asm block. This includes words in the following
	categories:
	
	   ASM Opcodes such as CMP or MOV
	   Opcodes new to the 80186, 80286, and 80386 such as ARPLS or CLTS
	   Reserved operand words such as WORD or PARA
	   C library functions such as "exit" or "time".
	
	For example, the following code is not permitted:
	
	   main()
	   {
	     int word;
	     _asm{mov WORD PTR [word], ax }
	   }
	
	The variable "word" can be used in the C part of the program, but not
	within the assembly block.
