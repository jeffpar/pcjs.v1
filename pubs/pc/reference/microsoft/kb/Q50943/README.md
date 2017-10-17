---
layout: page
title: "Q50943: Using CALL INTERRUPT to Get Current SCREEN Video Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q50943/
---

## Q50943: Using CALL INTERRUPT to Get Current SCREEN Video Mode

	Article: Q50943
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891113-112 B_BasicCom
	Last Modified: 14-DEC-1989
	
	It is possible to get the current SCREEN mode using the CALL INTERRUPT
	statement in compiled BASIC. This is useful if the program does not
	keep track of the current SCREEN mode, and the current video state
	needs to be saved.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, Microsoft BASIC Compiler Versions 6.00, and 6.00b
	for MS-DOS, and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	The following BASIC program allows you to change the video mode, then
	uses CALL INTERRUPT to return the current video mode. The return
	values from the CALL INTERRUPT are not the same as the BASIC SCREEN
	modes, so the program creates an array that is used to translate the
	returned values back to BASIC SCREEN modes.
	
	Code Example: SCRMODE.BAS
	-------------------------
	
	REM $INCLUDE: 'qb.bi'   ' defines for CALL INTERRUPT
	' For BC.EXE and QBX.EXE for BASIC 7.00, use the include file 'QBX.BI'
	' and the Quick library  QBX.QLB.
	DIM inregs AS regtype
	DIM outregs AS regtype
	DIM screenarray(19) AS INTEGER
	FOR i% = 0 TO 19
	        READ screenarray(i%)
	NEXT
	INPUT "enter screen mode: "; smode%
	inregs.ax = &HF00       ' BIOS interrupt to return video mode
	CALL interrupt(&H10, inregs, outregs)
	smode% = outregs.ax AND &HFF   ' mask off contents of AL register
	PRINT "Current screen mode = "; screenarray(smode%)
	' Define conversion array for SCREEN modes
	DATA 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 0, 0, 7, 8, 10, 9, 11, 12, 12
	END
	
	To demonstrate this program from an .EXE program, compile and link as
	follows:
	
	   BC SCRMODE.BAS;
	   LINK SCRMODE,,,QB.LIB;
	
	For BASIC PDS 7.00, use QBX.LIB instead of QB.LIB.
	
	If you run the program within the QuickBASIC QB.EXE editor, the
	default Quick library QB.QLB must be loaded in, as follows:
	
	   QB SCRMODE /L
	
	For QBX.EXE 7.00, the default Quick library QBX.QLB must be loaded in,
	as follows:
	
	   QBX SCRMODE /L
