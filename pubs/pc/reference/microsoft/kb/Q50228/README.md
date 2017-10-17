---
layout: page
title: "Q50228: How to Use CALL INTERRUPTX to Get Name of Current Directory"
permalink: /pubs/pc/reference/microsoft/kb/Q50228/
---

## Q50228: How to Use CALL INTERRUPTX to Get Name of Current Directory

	Article: Q50228
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891018-85 B_BasicCom
	Last Modified: 12-DEC-1989
	
	This article gives an explanation and code example for how CALL
	INTERRUPTX can be used to get the name of the current directory on a
	specified drive using Microsoft QuickBASIC.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to
	Microsoft BASIC PDS Version 7.00.
	
	MS-DOS interrupt 21 hex function 47 hex returns an ASCIIZ string that
	describes the name of the current directory and the path from the root
	to the current directory. An ASCIIZ string is a series of ASCII
	characters terminated by a null byte. A null byte or null character is
	a 1-byte data item (a char in C) that has the value zero. It is the
	first character on any ASCII chart.
	
	The "current directory" is the subdirectory that you are currently
	working in. The MS-DOS CHDIR (CD) command is used to change the
	current directory.
	
	Note: It is necessary to use the CALL INTERRUPTX statement to call
	this DOS function. This is not possible with the CALL INTERRUPT
	statement. CALL INTERRUPT does not allow a program to change the value
	of the DS or ES registers. CALL INTERRUPTX allows both DS and ES to be
	set.
	
	Code Example
	------------
	
	REM $INCLUDE: 'qb.bi'
	' For BASIC PDS 7.00 and QBX.EXE the include file is 'QBX.BI'
	
	DIM InRegs AS RegTypeX
	DIM OutRegs AS RegTypeX
	DIM CurrentDirectory AS STRING * 64
	
	CurrentDirectory = STRING$(64, CHR$(32))   '32 is ASCII for SPACE
	InRegs.Ax = &H4700                       'Function Number     in AH
	InRegs.Si = VARPTR(CurrentDirectory)     'Offset of Variable  in SI
	InRegs.Ds = VARSEG(CurrentDirectory)     'Segment of Variable in DS
	InRegs.Dx=0                              'Drive Number        in DX
	                                         '(0=default, 1=A, etc.)
	CALL INTERRUPTX(&H21, InRegs, OutRegs)
	CLS
	PRINT "Current Directory = " + RTRIM$(CurrentDirectory)
	END
