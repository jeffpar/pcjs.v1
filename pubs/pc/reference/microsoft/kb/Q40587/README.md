---
layout: page
title: "Q40587: Floating-Point Routines Are Not Reentrant"
permalink: /pubs/pc/reference/microsoft/kb/Q40587/
---

	Article: Q40587
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 25-MAY-1989
	
	Even if you only want simple arithmetic operations, the 80x87 chip
	doesn't provide a means for saving and restoring all of its registers.
	Microsoft wrote its library routines for DOS, which for the most part
	handle single-process routines, and therefore do not provide the
	routines necessary for achieving this effect with the coprocessor
	chip.
	
	If you want to develop a program that requires the coprocessor to be
	reentrant, you must provide your own routines that save and restore
	the registers of the coprocessor.
