---
layout: page
title: "Q26483: CALL INTERRUPTX to Read Disk Sector Can Fail in QB; OK in .EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q26483/
---

## Q26483: CALL INTERRUPTX to Read Disk Sector Can Fail in QB; OK in .EXE

	Article: Q26483
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 20-SEP-1990
	
	The program below uses the CALL INTERRUPTX statement to invoke a
	software interrupt to read a disk sector (interrupt 13 hex, function
	2). The program correctly reads the specified sector when an .EXE file
	is created. However, the program does not read the correct sector from
	within the QuickBASIC editor environment.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	4.00, 4.00b, and 4.50 for MS-DOS; in Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS (buglist6.00, buglist6.00b); and in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS (buglist7.00, buglist7.10). We are researching
	this problem and will post new information here as it becomes
	available.
	
	This problem is specific to interrupt 13 hex, function 2 -- other
	interrupts invoked with CALL INTERRUPTX should work properly.
	
	The following is a code example:
	
	' Define the type needed for INTERRUPTX
	TYPE RegTypeX
	     ax    AS INTEGER
	     bx    AS INTEGER
	     cx    AS INTEGER
	     dx    AS INTEGER
	     bp    AS INTEGER
	     si    AS INTEGER
	     di    AS INTEGER
	     flags AS INTEGER
	     ds    AS INTEGER
	     es    AS INTEGER
	END TYPE
	
	' Generate a software interrupt 13 hex, function 2, loading all
	' registers.
	' Note: The underscore line-continuation mark is no longer supported in
	'       QuickBASIC version 4.00. For illustrative purposes it appears
	'       in the DECLARE statement below. If this program were to be
	'       loaded into the QuickBASIC version 4.00 editor, the underscore
	'       would be stripped out and the DECLARE statement would be
	'       contained on one line.
	DECLARE SUB INTERRUPTX (intnum AS INTEGER, inregs AS RegTypeX,_
	                        outregs AS RegTypeX)
	DEFINT A-Z
	DIM buf(1792)
	DIM inregs AS RegTypeX, outregs AS RegTypeX
	CLS
	inregs.ax = &H201
	inregs.cx = &H101
	inregs.dx = &H0
	inregs.bx = VARPTR(buf(0))
	inregs.es = VARSEG(buf(0))
	CALL INTERRUPTX(&H13, inregs, outregs)
	DEF SEG
	FOR I = 0 TO (512)
	  p = PEEK(VARPTR(buf(0)) + I)
	  IF p > 31 AND p < 127 THEN PRINT CHR$(p);  ELSE PRINT ".";
	NEXT I
	PRINT HEX$(inregs.ax)
