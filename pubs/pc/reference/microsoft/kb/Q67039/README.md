---
layout: page
title: "Q67039: /qc Option Cannot Be Combined with /Ol and register Variables"
permalink: /pubs/pc/reference/microsoft/kb/Q67039/
---

	Article: Q67039
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | S_QUICKC buglist6.00 buglist6.00a
	Last Modified: 28-NOV-1990
	
	When using either QuickC or the quick compile option (/qc) with the
	Microsoft C compiler, loop optimization (/Ol) cannot be specified for
	any functions that contain variables declared with the register
	storage-class that are referenced in an inline assembly (_asm) block.
	
	This combination will result in the following compiler error for any
	register variables referenced in the inline assembly code:
	
	   error C2418: variable not in a register.
	
	This problem occurs because /Ol results in register variables not
	being allocated in registers, a problem that also occurs with the C
	compiler without /qc. For more information, query on the following
	words:
	
	    C4024 and register and inline and stack
	
	Because the variables are not in registers, the compiler cannot handle
	register instructions that reference them in the inline assembly.
	Therefore, the C2148 error is generated. When using the C compiler
	without /qc, /Ol is prevented from causing this problem.
	
	To work around this problem, eliminate one of the following three
	contributing factors:
	
	1. Turn off loop optimization.
	
	-or-
	
	2. Do not use register variables that are referenced in an _asm block.
	
	-or-
	
	3. Compile without /qc.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and QuickC versions 2.50 and 2.51 (buglist2.50 and buglist2.51).
	We are researching this problem and will post new information here as
	it becomes available.
