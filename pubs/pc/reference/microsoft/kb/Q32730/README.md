---
layout: page
title: "Q32730: Use Logical AND to Determine Which Bits Are Set in an Integer"
permalink: /pubs/pc/reference/microsoft/kb/Q32730/
---

## Q32730: Use Logical AND to Determine Which Bits Are Set in an Integer

	Article: Q32730
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_GWBasicI B_BasicInt B_BasicCom
	Last Modified: 21-DEC-1989
	
	The CALL INTERRUPT or INT86OLD functions in QuickBASIC Version 4.00
	return information by setting certain bits in the AH or AL register.
	(In the $INCLUDE file QB.BI provided on the QuickBASIC Versions 4.00
	or 4.00b release disk, InRegs.AX is an integer variable, where the
	first byte represents AH (High) and the second byte represents AL
	(Low).)
	
	The logical "AND" operator can be used in BASIC to determine which
	bits are set. For example, the program below determines whether a bit
	has been set in the High or Low byte of a 2-byte integer variable.
	
	The example below applies to Microsoft QuickBASIC Versions 4.00, 4.00b
	and 4.50, to Microsoft BASIC Compiler Version 6.00 for MS-DOS and MS
	OS/2, to Microsoft BASIC PDS Version 7.00 for MS-DOS and OS/2, to
	GW-BASIC Interpreter Version 3.22, to previous versions of these
	products, and to Microsoft BASIC for XENIX and Macintosh.
	
	The following is a code example:
	
	INPUT x%
	PRINT "Bits set in the High byte of x%."
	IF x% < 0 THEN PRINT "Bit 7 set!"
	mask% = &H4000
	FOR i% = 6 TO 0 STEP -1
	   IF x% AND mask% THEN PRINT "Bit"; i%; " set!"
	   mask% = mask% \ 2
	NEXT
	PRINT "Bits set in the Low byte of x%."
	'For just the Low byte, mask% starts out as 128.
	FOR i% = 7 TO 0 STEP -1
	   IF x% AND mask% THEN PRINT "Bit"; i%; " set!"
	   mask% = mask% \ 2
	NEXT
