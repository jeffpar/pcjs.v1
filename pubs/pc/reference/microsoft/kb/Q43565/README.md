---
layout: page
title: "Q43565: QuickBASIC Program to Detect if a Math Coprocessor Is Present"
permalink: /pubs/pc/reference/microsoft/kb/Q43565/
---

## Q43565: QuickBASIC Program to Detect if a Math Coprocessor Is Present

	Article: Q43565
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890412-46 B_BasicCom
	Last Modified: 14-DEC-1989
	
	Below is a QuickBASIC or BASIC compiler program that will detect
	whether or not a particular machine has a math coprocessor installed.
	This code will execute correctly in the Microsoft QuickBASIC Compiler
	Versions 4.00, 4.00b, and 4.50, Microsoft BASIC Compiler Versions 6.00
	and 6.00b, and Microsoft BASIC PDS Version 7.00.
	
	The program is as follows:
	
	DECLARE SUB display ()
	'===================================================================
	'Program MATH.BAS to detect math coprocessor, if present
	'===================================================================
	DEFINT A-Z
	
	CALL display
	
	DEF SEG = 0
	chip = PEEK(&H410)               'Look at 2nd bit of 0000:0410 Hex
	chipthere = chip \ 2 AND 1       'Equipment List Word bit
	                                 'for math coprocessor (8087 etc.)
	IF chipthere = 1 THEN
	   COLOR 2, 0
	   PRINT "                       Math coprocessor present";
	ELSE
	   COLOR 4, 0
	   PRINT "                       No math coprocessor detected";
	END IF
	
	DO UNTIL INKEY$ <> ""            'Wait for key then clear screen
	LOOP
	CLS
	END
	
	SUB display
	'===================== Display Screen Control =====================
	CLS
	VIEW PRINT 25 TO 25
	COLOR 7, 1
	PRINT
	LOCATE 25, 29
	PRINT "Press any key to exit";
	VIEW PRINT 1 TO 1
	COLOR 7, 1
	PRINT
	LOCATE 1, 34
	PRINT "MATH.BAS";
	VIEW PRINT 12 TO 12
	COLOR 0, 0
	PRINT
	END SUB
