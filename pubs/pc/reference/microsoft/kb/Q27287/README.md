---
layout: page
title: "Q27287: How to Assign High &amp; Low Registers for CALL INTERRUPT, INT86"
permalink: /pubs/pc/reference/microsoft/kb/Q27287/
---

## Q27287: How to Assign High &amp; Low Registers for CALL INTERRUPT, INT86

	Article: Q27287
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 31-OCT-1988
	
	The QuickBASIC interrupt routines (CALL INT86 and PTR86 in QuickBASIC
	2.x and 3.00; and INT86old and INTERRUPT in QuickBASIC 4.00/4.00b and
	the BASIC Compiler 6.00/6.00b) are passed full-word register variables
	such as AX instead of half registers AH (high byte of AX) and AL (low
	byte of AX). The CALL statement documentation in the reference manual
	for QuickBASIC Versions 2.x, 3.00, and 4.00 does not clearly state how
	to assign or read half registers before or after calling the interrupt
	routines.
	
	The following are two methods to assign values to high and low
	registers and to load them into the full word (two-byte) registers:
	
	1. The simplest method is to combine the hexadecimal values of the
	   high and low registers into one hexadecimal constant:
	
	   AX = &H0941             ' where AH=&H09, AL=&H41
	   BX = &H0002             ' where BH=&H00, BL=&H02
	   CX = &H07D0             ' where CH=&H07, CL=&HD0
	
	2. The following is a more flexible method, letting you assign
	   variables to the high and low registers with a formula:
	
	   AX, BX, CX, or DX = (high% * 256) + low%
	
	   In this case, "high" and "low" contain the decimal values which you
	   want to assign to the respective half registers. For example:
	
	   high% = 9                   ' 9 = &H09
	   low% = 65                   ' 65 = &H41
	   AX = (high% * 256) + low%    ' AX = 2369 = &H0941
	
	Note that the following is a quick way to convert a decimal number to
	hexadecimal using the immediate mode window of the QuickBASIC Version
	4.00 editor:
	
	PRINT HEX$(number)
	
	(Pressing F6 in the QuickBASIC Version 4.00 editor lets you activate
	the immediate mode window. Pressing F4 toggles between viewing the
	editor and viewing the output window.)
	
	The following formulas return the contents of the half registers,
	which are stored in the two bytes of a full register such as AX
	returned from an interrupt routine:
	
	AL% = AX% MOD 256 ' MOD operator returns integer remainder of division
	PRINT "The AL register contains &H"; HEX$(AL%)
	
	AH% = AX% \ 256  ' Integer division by 256 removes the lower byte.
	PRINT "The AH register contains &H"; HEX$(AH%)
