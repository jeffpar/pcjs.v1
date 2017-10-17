---
layout: page
title: "Q59006: How to Distinguish Between a Standard and Enhanced Keyboard"
permalink: /pubs/pc/reference/microsoft/kb/Q59006/
---

## Q59006: How to Distinguish Between a Standard and Enhanced Keyboard

	Article: Q59006
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 26-FEB-1990
	
	The following code example demonstrates calling interrupts to
	determine whether an enhanced or standard keyboard is connected to
	your machine. This example applies to Microsoft QuickBASIC Versions
	4.00, 4.00b, and 4.50, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b, and to Microsoft BASIC Professional Development System (PDS)
	Version 7.00 under MS-DOS. (The information about the interrupt 16
	Hex, with Functions 2 and 12 Hex, also applies to any language that
	can call BIOS interrupts.)
	
	The information for the interrupts was taken from Pages 581-586 of the
	book "Advanced MS-DOS Programming, Second Edition," by Ray Duncan,
	(Microsoft Press, 1988). This information can also be found on Pages
	105-112 of the "Programmer's Quick Reference Series: IBM ROM BIOS," by
	Ray Duncan (Microsoft Press, 1988).
	
	The information about the address for the PEEK statement was taken
	from Pages 137 and 138 of the book "The New Peter Norton Programmer's
	Guide to the IBM PC and PS/2," by Peter Norton and Richard Wilton,
	(Microsoft Press, 1988).
	
	To compile and link the program in QuickBASIC 4.50, do the following:
	
	   BC Keytest.bas ;
	   LINK Keytest,,,BRUN45.LIB+QB.LIB ;
	
	Code Example
	------------
	
	REM $INCLUDE: 'qb.bi'   ' Change to qbx.bi for BASIC PDS Version 7.00
	DIM inregs AS regtype, outregs AS regtype
	CLS
	inregs.ax = &H1200
	CALL interrupt(&H16, inregs, outregs)
	key2% = outregs.ax
	DEF SEG = &H40
	test% = PEEK(&H17)
	DEF SEG
	LOCATE 13, 23
	IF key2% <> test% THEN PRINT "You have a Standard Keyboard"
	IF key2% = test% THEN PRINT "You have an Enhanced Keyboard"
	LOCATE 25, 20
	PRINT "Hit a key to end test"
	SLEEP
	CLS
	END
