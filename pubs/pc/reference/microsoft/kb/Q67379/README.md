---
layout: page
title: "Q67379: How to Use CALL INTERRUPT to Detect If SHARE.EXE Is Loaded"
permalink: /pubs/pc/reference/microsoft/kb/Q67379/
---

## Q67379: How to Use CALL INTERRUPT to Detect If SHARE.EXE Is Loaded

	Article: Q67379
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BASICCOM
	Last Modified: 5-DEC-1990
	
	SHARE.EXE provides file sharing and locking to MS-DOS versions 3.00
	and later. To determine whether SHARE.EXE is currently loaded, you can
	make a call to the MS-DOS interrupt, &H2F (2F hex). You should load
	the ax register with &H1000 before the CALL INTERRUPT statement. After
	the call, the ax register will return with the value &H00FF (ff hex)
	if SHARE.EXE is loaded.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS; and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The following program demonstrates how to call interrupt &H2F to
	detect if SHARE.EXE is loaded. It makes the interrupt call and then
	PRINTs what the three separate types of returns can mean. To use this
	program in the QB.EXE or QBX.EXE environment, use the /L environment
	switch to load the default Quick library, QB.QLB (or QBX.QLB for BASIC
	PDS 7.00 or 7.10). To make an executable program from this code, you
	must link with the library, QB.LIB (or QBX.LIB for BASIC PDS 7.00 or
	7.10).
	
	Program Example
	---------------
	
	' Use 'QBX.BI' with BASIC PDS 7.10 or 7.00 instead of 'QB.BI':
	REM $INCLUDE: 'QB.BI'
	
	DIM inregs as regtype
	DIM outregs as regtype
	inregs.ax = &H1000
	CALL interrupt(&H2F,inregs,outregs)
	
	' CHECK results.
	IF outregs.ax = &HFF THEN
	   PRINT "SHARE.EXE installed"
	ELSEIF outregs.ax = &H1 THEN
	   PRINT "SHARE.EXE not installed, NOT O.K. to install"
	ELSE  ' outregs.ax = &H0
	   PRINT "SHARE.EXE not installed, O.K. to install"
	ENDIF
	END
