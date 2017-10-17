---
layout: page
title: "Q42762: Patches of Floating-Point Instructions at Run Time Are Normal"
permalink: /pubs/pc/reference/microsoft/kb/Q42762/
---

## Q42762: Patches of Floating-Point Instructions at Run Time Are Normal

	Article: Q42762
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G890217-12193
	Last Modified: 30-MAY-1989
	
	Question:
	
	I have noticed that memory overwrites occur in the library routine
	i8_input. While debugging the program under CodeView with the
	assembler listing, I noticed that after executing into the code, the
	first 2 bytes of each instruction beginning with a hex CD are
	overwritten. The C statement that generated the assembler code with
	the problem in it was an "fscanf" function call.
	
	Below is an listing example of what is occurring:
	
	Before
	------
	
	7E1F:4266 CD35C0       INT 35 ; FLD     ST(0)
	7E1F:4269 CD35E1       INT 35 ; FABS
	7E1F:426C CD372E7425   INT 37 ; FLD     TByte Ptr [__chbuf+5C (2574)]
	
	After
	-----
	
	7E1F:4266 90           NOP
	7E1F:4267 D9C0         FLD      ST(0)
	7E1F:4269 90           NOP
	7E1F:426A D9E1         FABS
	7E1F:426C 90           NOP
	7E1F:426D DB2E7425     FLD      TByte Ptr [__chbuf+5C (2574)]
	
	Response:
	
	The behavior you describe is quite normal and nothing to worry about.
	Our floating-point package works by generating the INT instructions
	you noticed. When these instructions are executed, the routine they
	call replaces the INT instructions with the either library calls to
	the emulator library or the actual 80 x 87 floating-point
	instructions, depending on whether or not a coprocessor is installed.
	
	When the instructions are executed again, there is no overhead for
	determining whether on not a coprocessor is installed: the proper
	instructions have been patched into place already. This patching
	occurs even if the -FPi87 option has been selected.
	
	You can force in-line 8087 instructions to be put into your code.
	For information on this technique, query on the following keywords:
	
	   in-line 8087 instructions
	
	There is no need to do this if your code is going to run under DOS or
	OS/2. Although this article mainly discusses FORTRAN, it applies to C
	as well because the two languages use the same floating-point library.
	
	This code modification occurs only under DOS. Under OS/2, coprocessor
	instructions (such as in the second listing) are always generated. If a
	coprocessor is not present at execution, the instructions cause
	exceptions that are handled by the floating-point emulator software.
	
	Note: Such code modification is impossible under OS/2 because there is
	no way to dynamically change a code segment under OS/2, although it is
	possible to cause a data segment to be executed.
