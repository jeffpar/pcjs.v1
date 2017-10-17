---
layout: page
title: "Q43568: Program That Returns the Address of an Interrupt Vector"
permalink: /pubs/pc/reference/microsoft/kb/Q43568/
---

## Q43568: Program That Returns the Address of an Interrupt Vector

	Article: Q43568
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890412-84 B_BasicCom
	Last Modified: 13-DEC-1989
	
	The QuickBASIC program below will return the address of the interrupt
	vector whose number you input. This program operates correctly with
	Microsoft QuickBASIC Versions 3.00, 4.00, 4.00b, and 4.50, the
	Microsoft BASIC compiler Versions 6.00 and 6.00b, and the Microsoft
	BASIC PDS Version 7.00.
	
	'Program GETVECTR.BAS looks in low memory to get the address of
	'any interrupt vector that you input.
	
	DEFINT A-Z
	DEF SEG = 0
	CLS
	VIEW PRINT 25 TO 25
	COLOR 15, 1
	PRINT
	LOCATE 25, 30
	PRINT "Ctrl-Break to EXIT";
	VIEW PRINT 1 TO 1
	PRINT
	LOCATE 1, 34
	PRINT "GETVECTOR";
	
	   VIEW PRINT 9 TO 15
	   COLOR 0, 7
	   PRINT : PRINT : PRINT : PRINT : PRINT : PRINT : PRINT
	
	DO
	  PRINT "  Enter the Number of the Interrupt. Use &H to specify a "
	  PRINT "  Hex Number (such as &H5 for Interrupt 5 Hex)"
	   PRINT
	   INPUT "  Interrupt ", intnum
	   offset = 4 * intnum
	   byte1$ = HEX$(PEEK(offset))
	   byte2$ = HEX$(PEEK(offset + 1))
	   byte3$ = HEX$(PEEK(offset + 2))
	   byte4$ = HEX$(PEEK(offset + 3))
	   vector$ = byte4$ + " " + byte3$ + " : " + byte2$ + " " + byte1$
	   LOCATE 13, 1
	   PRINT SPACE$(40)
	   LOCATE 13, 1
	   PRINT "Handler for Interrupt      "; HEX$(intnum) + " Hex"
	   PRINT "is located at address -->  "; vector$
	   PRINT
	LOOP
	DEF SEG
	CLS
