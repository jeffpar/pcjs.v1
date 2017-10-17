---
layout: page
title: "Q45170: Using CALL INTERRUPT to Return DOS Version Number"
permalink: /pubs/pc/reference/microsoft/kb/Q45170/
---

## Q45170: Using CALL INTERRUPT to Return DOS Version Number

	Article: Q45170
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 13-DEC-1989
	
	The program shown below demonstrates how to use CALL INTERRUPT to
	return the DOS version number.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and to the Microsoft BASIC Compiler Versions 6.00, and 6.00b
	for MS-DOS, and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	The following program is INTVER.BAS:
	
	' $INCLUDE: 'qb.bi'
	' For BC.EXE and QBX.EXE in BASIC 7.00 the include is 'QBX.BI'
	
	DIM inregs AS RegType, outregs AS RegType
	inregs.ax = &H3000
	CALL INTERRUPT(&H21, inregs, outregs)
	majorver = outregs.ax AND &HFF
	minorver = (outregs.ax AND &HFF00) / 256
	PRINT "MS-DOS Version: "; majorver; "."; minorver
