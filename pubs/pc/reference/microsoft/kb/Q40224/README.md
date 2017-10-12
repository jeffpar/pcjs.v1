---
layout: page
title: "Q40224: Rare Problem with /Exepack Linker Option Can Hang QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q40224/
---

	Article: Q40224
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: enduser | s_link buglist2.00
	Last Modified: 3-MAR-1989
	
	There is a problem in the /EXEPACK option of the linker that can hang
	programs within QuickC. This problem affects the small- and medium-memory
	models only.
	
	If the program's initial SS:SP is within one of two very small ranges
	of the first 312 bytes of the minalloc region, and if an interrupt
	occurs immediately before the instruction in the unpacking module that
	jumps to the original CS:IP, then the program hangs.
	
	The minalloc region is the start of uninitialized data at the end of a
	program, i.e., bss + stack in a non-far-data program.
	
	As a result, the stack must be 312 bytes or less (the size of the
	unpacking module) for the problem to occur. Even then, there is only
	an 18/312 (6 percent) chance, depending on the initial SS:SP. (18 is the
	total size of the two unsafe regions.)  Also, there must be less than
	312 bytes of near bss for this problem to occur.
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
