---
layout: page
title: "Q32274: Do Not Use DOS Interrupts to Terminate Compiled Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q32274/
---

## Q32274: Do Not Use DOS Interrupts to Terminate Compiled Programs

	Article: Q32274
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	The following information applies to QuickBASIC Versions 4.00, 4.00b
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	Some DOS interrupts should not be invoked from QuickBASIC programs.
	For example, "Terminate With Return Code" (Interrupt 21H, function
	4CH) can cause loss of the cursor the first time it is executed, then
	a hard hang on a subsequent CALL.
	
	QuickBASIC must control its own termination to correctly return to
	DOS. Please use the END statement in BASIC rather than a DOS interrupt
	to terminate a program.
	
	The following is a code example:
	
	'WARNING:
	'Execution of the following code will result in unpredictable results,
	'such as system lockup or loss of the DOS cursor in some instances.
	DIM inarray%(7), outarray%(7)
	inarray%(0) = &H4C00
	CALL int86old(&H21, inarray%(), outarray%())
	'The INT86OLD routine is located in QB.QLB and QB.LIB.
