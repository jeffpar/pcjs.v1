---
layout: page
title: "Q29918: Defining &quot;Intersegment Short Jump&quot; (LINK Error L2002)"
permalink: /pubs/pc/reference/microsoft/kb/Q29918/
---

## Q29918: Defining &quot;Intersegment Short Jump&quot; (LINK Error L2002)

	Article: Q29918
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |  B_BasicCom
	Last Modified: 24-MAR-1989
	
	The L2002 linker error message is as follows:
	
	   "fixup overflow near <number> in frame seg <segname> target seg
	    <segname> target offset <number>."
	
	One possible reason for this error is that an assembler program
	contains an intersegment short jump or intersegment short call.
	
	LINK.EXE can also give this error if one of your compiled BASIC object
	modules is too large. The solution is to split the module into two or
	more separately compiled modules. This information applies to
	QuickBASIC Versions 4.00, 4.00b, and 4.50 for MS-DOS, and to BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2.
	
	During the normal execution of a program, instructions residing in the
	current code segment are being executed in a sequential order. A
	program flows sequentially from one instruction to the next by
	incrementing the IP register as each instruction is executed.
	
	However, it is possible to alter this normal program flow. One method
	is to transfer control to instructions residing in a different
	segment. Referred to as an intersegment jump or intersegment transfer,
	it is accomplished by altering both IP and CS.
	
	If the size of the jump is less than 64K, but still involves
	transferring to a different segment, then this is called an
	intersegment short jump.
	
	This error is usually associated with assembly language routines. It
	usually doesn't occur with QuickBASIC programs.
