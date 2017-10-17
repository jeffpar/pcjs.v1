---
layout: page
title: "Q40872: Some Coprocessor Assembler Instructions Are Not Emulated"
permalink: /pubs/pc/reference/microsoft/kb/Q40872/
---

## Q40872: Some Coprocessor Assembler Instructions Are Not Emulated

	Article: Q40872
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | B_QuickBas S_C H_Fortran H_MASM SR# S890111-171
	Last Modified: 1-FEB-1990
	
	Microsoft Macro Assembler Version 5.10 does not come with routines to
	emulate a math coprocessor.
	
	Page 382 of the "Microsoft Macro Assembler 5.1: Programmer's Guide"
	states that to emulate math-coprocessor instructions, you must link
	with a Microsoft high-level language that supports floating-point
	emulation of the coprocessor. You would write the assembler procedure
	using coprocessor instructions, then assemble with the /E option, and
	finally link it with the high-level language modules.
	
	However, only a subset of coprocessor instructions are emulated by the
	Microsoft high-level languages.
	
	If you link your Microsoft higher-level language to an assembler
	routine that invokes an instruction that is NOT emulated by the
	higher-level language, then the program gives a run-time error (or
	possibly hangs, or gives incorrect results) when run on a machine that
	has no coprocessor.
	
	This information applies to the following products:
	
	1.  Microsoft BASIC Compiler Versions 6.00 and 6.00b
	
	2.  Microsoft BASIC Professional Development System (PDS) Version 7.00
	
	3.  Microsoft QuickBASIC Version 4.50
	
	4.  Microsoft C Compiler Version 5.10
	
	5.  Microsoft FORTRAN Compiler Version 4.10
	
	Below is a list of the coprocessor (8087 or 80287) instructions that
	are not emulated by Microsoft high-level languages:
	
	   FBLD    - packed decimal load
	   FBSTP   - packed decimal store and pop
	   FCOS    - cosine function
	   FDECSTP - decrement stack pointer
	   FINCSTP - increment stack pointer
	   FINIT   - initialize processor
	   FLDENV  - load environment
	   FNOP    - No operation
	   FPREM1  - partial remainder
	   FRSTOR  - restore saved state
	   FSAVE   - save state
	   FSETPM  - set protected mode
	   FSIN    - only sine function
	   FSINCOS - sine and cosine function
	   FSTENV  - store environment
	   FUCOM   - unordered comparison
	   FUCOMP  - unordered comparison and pop
	   FUCOMPP - unordered comparison and double pop
	   FXTRACT - extract exponent and significant
	
	Also, some of the No-Wait forms of instructions are not emulated, such
	as FNSTENV and FNINIT.
