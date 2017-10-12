---
layout: page
title: "Q46381: Compiler Options for Intel 80x86 Processors"
permalink: /pubs/pc/reference/microsoft/kb/Q46381/
---

	Article: Q46381
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 14-AUG-1989
	
	The following is extracted from the "Microsoft C Optimizing Compiler
	User's Guide," Page 81, Section 3.3.10, "Using the 80186, 80188, or
	80286 Processor (/G0, /G1, /G2)":
	
	Options
	-------
	
	   /G0 Enables instruction set for 8086/8088 processor (default)
	   /G1 Enables instruction set for 80186/80188 processor
	   /G2 Enables instruction set for 80286 processor
	
	If you have an 80186, 80188, or 80286 processor, you can use the /G1
	or /G2 option to enable the instruction set for your processor. Use
	/G1 for the 80186 and 80188 processors; use /G2 for the 80286.
	Although it is usually advantageous to enable the appropriate
	instruction set, you are not required to do so. If you have an 80286
	processor, for example, but you want your code to be able to run on an
	8086, you should not use the 80186/80188 or 80286 instruction sets.
	
	The /G0 option enables the instruction set for the 8086/8088
	processor. You need not specify this option explicitly, since the
	8086/8088 instruction set is used by default. Programs compiled in
	this way also run on machines with the 80186, 80188, or 80286
	processor.
	
	Since DOS and existing versions of OS/2 are not 80386 operating
	systems, Version 5.10 (as well as previous versions) of the C compiler
	do not offer a /G3 switch for 80386 code generation.
