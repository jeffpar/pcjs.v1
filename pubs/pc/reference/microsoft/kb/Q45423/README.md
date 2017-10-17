---
layout: page
title: "Q45423: Example to Get and Set File Attributes in QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q45423/
---

## Q45423: Example to Get and Set File Attributes in QuickBASIC

	Article: Q45423
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 20-DEC-1989
	
	The program below demonstrates how to use CALL INTERRUPT to get and
	set the attributes of files in MS-DOS.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to Microsoft
	BASIC PDS Version 7.00.
	
	The following program is FILEATT.BAS:
	
	DECLARE SUB showattributes (status AS INTEGER)
	' $INCLUDE: 'qb.bi'
	' For QBX.EXE and BC.EXE in BASIC PDS 7.00 use the include file 'QBX.BI'
	
	CONST SETREADONLY = &H1
	CONST SETHIDDEN = &H2
	CONST SETSYSTEM = &H4
	CONST SETARCHIVE = &H32
	DIM inregs AS RegTypex, outregs AS RegTypex
	CLS
	INPUT "Enter File Name (with full pathname): "; filename$
	
	' add CHR$(0) to make ASCII Z string
	filename$ = filename$ + CHR$(0)
	
	inregs.ax = &H4300                    ' get file attributes
	inregs.dx = SADD(filename$)
	'   For BC.EXE and QBX.EXE for BASIC PDS 7.00 add the following line:
	' inregs.ds = SSEG(filename$)
	
	CALL INTERRUPTX(&H21, inregs, outregs)
	showattributes outregs.cx
	
	' set hidden attribute
	inregs.ax = &H4301                    ' set file attributes
	
	' mask off the volume labels directory and reserved bits
	setstatus% = outregs.cx AND &H27
	
	setstatus% = setstatus% OR SETHIDDEN ' set hidden attribute bit
	inregs.cx = setstatus%
	CALL INTERRUPTX(&H21, inregs, outregs)
	showattributes outregs.cx
	
	SUB showattributes (status AS INTEGER)
	  PRINT
	  PRINT "File Attributes Set"
	  PRINT "-------------------"
	  IF status% AND SETREADONLY THEN PRINT "read-only"
	  IF status% AND SETHIDDEN THEN PRINT "hidden"
	  IF status% AND SETSYSTEM THEN PRINT "system"
	  IF status% AND 8 THEN PRINT "volume label"
	  IF status% AND 16 THEN PRINT "directory"
	  IF status% AND SETARCHIVE THEN PRINT "archive"
	END SUB
