---
layout: page
title: "Q57930: BREAK Status Always Reports OFF Using BASIC CALL INTERRUPT"
permalink: /pubs/pc/reference/microsoft/kb/Q57930/
---

## Q57930: BREAK Status Always Reports OFF Using BASIC CALL INTERRUPT

	Article: Q57930
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900119-105 B_BasicCom
	Last Modified: 8-FEB-1990
	
	The status of the BREAK flag cannot be detected from within a BASIC
	program, and a DOS interrupt from BASIC always reports that it is OFF.
	This is true even if a BREAK ON command has been issued from DOS.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS, and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	The status of the BREAK flag can be detected from some languages by
	using interrupt 21 Hex with function 33 Hex. However, when calling
	this interrupt from a BASIC program, the interrupt always reports that
	BREAK is OFF.
	
	During initialization, BASIC records the current setting of BREAK and
	then turns it OFF. Upon termination, BASIC restores the setting of
	BREAK to its entry value.
	
	This is done because when BREAK is enabled, pressing CTRL+C causes a
	^C to be printed to the screen on the next DOS call. This is also
	printed before DOS invokes the CTRL+C handler.
	
	In BASICs prior to BASIC PDS Version 7.00, BREAK has to be OFF because
	these BASICs do not have a CTRL+C handler. In BASIC PDS 7.00, a CTRL+C
	handler was added to better trap CTRL+C conditions in certain
	situations (such as between resetting the BREAK state and termination,
	or during a Make EXE File command). It was decided to continue
	clearing the BREAK state to eliminate ^C on the screen.
	
	To demonstrate this, run the following program. (If running within the
	QuickBASIC environment, start with the /L option to load in the Quick
	library with support for the CALL INTERRUPT statement).
	
	Code Example
	------------
	
	   REM $INCLUDE: 'QB.BI'
	   ' Note: Must change the above file to 'QBX.BI' in BASIC PDS 7.00
	
	   DIM INREGS AS REGTYPE
	   DIM OUTREGS AS REGTYPE
	
	   INREGS.AX = &H3300
	   CALL INTERRUPT(&H21, INREGS, OUTREGS)
	   PRINT OUTREGS.DX  ' IF 0 THEN BREAK OFF
	
	Even if BREAK ON is previously set in DOS, the program reports that
	BREAK is OFF. After the program ends, issuing the BREAK command in DOS
	shows BREAK as still ON.
