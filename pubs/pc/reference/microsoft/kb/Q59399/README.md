---
layout: page
title: "Q59399: BASIC 7.0 UEVENT Example Causes Subsequent Programs to Hang"
permalink: /pubs/pc/reference/microsoft/kb/Q59399/
---

## Q59399: BASIC 7.0 UEVENT Example Causes Subsequent Programs to Hang

	Article: Q59399
	Version(s): m7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900222-46 docerr buglist7.00 buglist7.10
	Last Modified: 20-SEP-1990
	
	The sample program for trapping a user-defined event on Pages 310-312
	of the "Microsoft BASIC 7.0: Programmer's Guide" for Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 contains
	a misprint, but even if corrected, this sample program may cause the
	computer to hang after it is run.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10. We are
	researching this problem and will post new information here as it
	becomes available.
	
	Page 311 of "Microsoft BASIC 7.0: Programmer's Guide" contains a
	misprint in the MASM programming example for trapping a user-defined
	event. If the code is not corrected, an "A2009: Symbol not defined"
	error will result when the code is assembled.
	
	The last section of code for this example reads as follows:
	
	    RestInt  proc  uses ds
	       lds dx, cs:OldVector
	       mov  x, 251CH          ; <== this line contains the misprint
	
	To correct the code, make the following change:
	
	    RestInt  proc  uses ds
	       lds dx, cs:OldVector
	       mov ax, 251CH          ; <== change "x" to "ax"
	
	However, even when this misprint is corrected, if the BASIC program is
	compiled so that it requires a run-time module or if the assembly code
	is put into a Quick library, running the program may cause the
	computer to hang. The problem does not occur if the BASIC program is
	compiled with the BC /O option.
	
	The following compiling and linking steps will reproduce the problem:
	
	1. Assemble the MASM code as follows:
	
	      MASM MASMPROG.ASM;
	
	2. Compile the BASIC code so that it requires a run-time module (no
	   /O) and enables event trapping (/V). If the program is compiled as
	   a stand-alone program (with the /O option), the problem does not
	   exist.
	
	      BC BASPROG.BAS /V;
	
	3. LINK the program using the BASIC PDS 7.00 or 7.10 linker, as
	   follows:
	
	      LINK BASPROG.OBJ + MASMPROG.OBJ;
	
	4. Run the program.
	
	5. The computer may hang instantly or may hang after attempting to run
	   another program, such as QBX.EXE.
