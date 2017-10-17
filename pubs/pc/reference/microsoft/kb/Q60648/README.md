---
layout: page
title: "Q60648: C 6.00 STARTUP.DOC: Placing the Stack Outside of DGROUP"
permalink: /pubs/pc/reference/microsoft/kb/Q60648/
---

## Q60648: C 6.00 STARTUP.DOC: Placing the Stack Outside of DGROUP

	Article: Q60648
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | readme readme.doc start-up
	Last Modified: 19-APR-1990
	
	The following information is taken from the C Version 6.00 STARTUP.DOC
	file.
	
	Placing the Stack Outside of DGROUP
	-----------------------------------
	
	If your program requires a large amount of stack space, the run-time
	library can be configured to place the stack in a separate segment
	outside of DGROUP. By doing this, the stack can be up to 64K in size
	without reducing the amount of storage available in DGROUP for near
	data. In order to do this your program must be either compact, large,
	or huge model. You must also direct the compiler to assume that that
	SS != DS. Thus, your memory model specification should be -ACw, -ALw,
	or -AHw. See the compiler documentation for more information about
	these options.
	
	To use a far stack, you must assemble the startup sources provided
	with C 6.0. In the startup sources directory is a file called
	"makefile" which controls the startup module build process for the run
	time library. To enable a far stack, you need to edit the makefile.
	Near the top of the file are two lines which begin "CFLAGS=" and
	"ASMFLAGS=". You should add the text " -DFARSTACK" to the end of these
	two lines. Then build the startup modules according to instructions
	given previously in this file. You should then use the LIB utility to
	replace the startup modules in your library with the new modules you
	have built. When linking, the size of the stack can be controlled with
	the /STACK command line option.
	
	If you are creating DOS programs, the size of your .EXE file will be
	increased by the size of your stack. This is a consequence of the DOS
	.EXE format. To reduce the size of your .EXE file, link with the
	/EXEPACK option.
