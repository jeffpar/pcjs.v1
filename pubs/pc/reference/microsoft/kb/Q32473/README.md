---
layout: page
title: "Q32473: /C No Effect on Communications Receive Buffer in CHAINed Prog"
permalink: /pubs/pc/reference/microsoft/kb/Q32473/
---

## Q32473: /C No Effect on Communications Receive Buffer in CHAINed Prog

	Article: Q32473
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 13-MAR-1990
	
	Programs can be given a new communications device receive buffer size
	using the /C:size option at compile time. This option sets up a new
	receive buffer size as specified, except for the program PROG2.EXE,
	when all of the following conditions are true:
	
	1. PROG2.EXE was compiled with the /C:size option.
	
	2. PROG1.EXE CHAINs to PROG2.EXE with the CHAIN statement.
	
	3. The CHAINing program (PROG1.EXE) was NOT compiled with the /C
	   option.
	
	4. The programs (PROG1.EXE and PROG2.EXE) were both compiled with the
	   "BRUN" run-time module (NOT compiled with /O).
	
	Thus, if you plan to change the default communications receive buffer
	size with the /C option in a CHAINed program (such as PROG2.EXE), you
	must compile the CHAINing program (PROG1.EXE) with the same /C option.
	
	The communications buffer is set when PROG1.EXE (the CHAINing program)
	and the BRUN library are loaded into memory at run time. During a
	CHAIN, the BRUN run-time module is not reloaded, so the buffer is not
	reset to the /C size that you specified for the CHAINed program
	(PROG2.EXE).
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b and 4.50, and to Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and OS/2.
	
	An alternative, independent of the /C compile-time option, is to use
	the RB option to set the receive buffer size at run time in the OPEN
	COM statement in PROG2.EXE. The RB option to set the receive buffer
	size in the OPEN COM statement is introduced in QuickBASIC 4.00 and
	later versions, and is not available in QuickBASIC 2.00, 2.01, and
	3.00. Using the RB option lets a CHAINed program (PROG2.EXE) set the
	receive buffer size independent of the settings in the CHAINing
	program (PROG1.EXE).
