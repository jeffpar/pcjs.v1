---
layout: page
title: "Q60429: Using the C Emulator Library with an Assembly Program"
permalink: /pubs/pc/reference/microsoft/kb/Q60429/
---

## Q60429: Using the C Emulator Library with an Assembly Program

	Article: Q60429
	Version(s): 5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JUN-1990
	
	An Assembler module may use a C emulator library if the assembler
	module is called by a main C module. The C emulator library must be
	used during the linking of the assembler and C modules.
	
	Linking with the emulator library ensures that the assembler will have
	floating-point math support with or without a a math coprocessor.
	
	The math functions in the C run-time library require floating-point
	support to perform calculations with real numbers. This support can be
	provided by the floating-point emulator libraries that accompany your
	compiler software or by an 8087 or 80287 coprocessor.
	
	The assembler module -- if run as a stand-alone module, without a math
	coprocessor, and linked to an emulator library -- generates emulator
	interrupts for floating-point math code, but will not run because the
	interrupts will not be initialized. The C start-up code is necessary
	to initialize the interrupts. If you want to run the assembler module
	as stand-alone, you must write your own emulator library.
	
	With C, /FPi is the default switch. This switch selects the emulator
	math package and generates inline floating-point instructions.
	
	   CL /c calling.c
	
	The assembler module is assembled with the following command, where
	(by default) code is generated for a math coprocessor (if
	floating-point instructions are used)
	
	   MASM /E called.asm
	
	where CALLING.C and CALLED.ASM are the calling and called modules,
	respectively.
	
	While programming in the QuickC environment, /FPi must be specified in
	the Global Custom Flags field of the Assembler Flags Dialog box
	(reached through the Options menu). This allows the C emulator library
	to be used for all the assembler modules.
