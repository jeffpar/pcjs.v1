---
layout: page
title: "Q45171: How to Detect Keypress in BASIC without Reading in Character"
permalink: /pubs/pc/reference/microsoft/kb/Q45171/
---

## Q45171: How to Detect Keypress in BASIC without Reading in Character

	Article: Q45171
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BASICCOM
	Last Modified: 13-DEC-1989
	
	The program shown below demonstrates how to check for a keypress
	without reading in the character, thus leaving the character in the
	keyboard buffer.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and to Microsoft BASIC Compiler Versions 6.00, and 6.00b for
	MS-DOS, and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	The following program, INTKEY.BAS, uses an MS-DOS interrupt to check
	if a key has been pressed. This can be used to check for a keypress
	before doing an INPUT, LINE INPUT, or INKEY$ statement. This approach
	is an alternative to invoking the INKEY$ function, which takes one
	character at a time out of the keyboard buffer.
	
	This example uses MS-DOS interrupt 33 (21 hex) with function call 11
	(0B hex), "Check Input Status." For more information about MS-DOS
	interrupts, please refer to "Advanced MS-DOS Programming" (Second
	Edition) by Ray Duncan (published by Microsoft Press, 1988).
	
	Example
	-------
	
	' $INCLUDE: 'qb.bi'
	' For BC.EXE and QBX.EXE in BASIC 7.00 the include file is 'QBX.BI'
	
	DIM inregs AS RegType, outregs AS RegType
	inregs.ax = &HB00  ' Move a hex value of B into the AH register
	outregs.ax = 0
	PRINT "Press any key: "
	DO
	  CALL INTERRUPT(&H21, inregs, outregs)
	LOOP UNTIL (outregs.ax AND &HFF) = &HFF
	INPUT X$   ' The first character typed appears in the INPUT line.
	' Or you can PRINT INKEY$ instead of using INPUT X$ to see the
	' character waiting in the keyboard buffer.
