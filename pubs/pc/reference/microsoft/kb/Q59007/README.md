---
layout: page
title: "Q59007: How BASIC Can Display Multiple Text Colors at Once on SCREEN 1"
permalink: /pubs/pc/reference/microsoft/kb/Q59007/
---

## Q59007: How BASIC Can Display Multiple Text Colors at Once on SCREEN 1

	Article: Q59007
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900202-98 B_BasicCom
	Last Modified: 26-FEB-1990
	
	In SCREEN 1, the COLOR statement cannot be used to put text of more
	than one color on the screen at one time. However, this can be done by
	using the ROM BIOS INTERRUPT hex 10, function 9, which displays a
	character with a specified attribute at the current cursor position.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, 4.50 for MS-DOS, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2.
	
	The specified attribute of a character can be 0, 1, 2, or 3. This
	attribute and the COLOR statement determine the color of the
	character. When an even expression (0 to 254) is the value for the
	palette in the COLOR statement, the default colors are 1 (green), 2
	(red), and 3 (yellow on CGA, or brown on EGA). When an odd expression
	(1 to 255) is the value for the palette in the COLOR statement, the
	default colors are 1 (cyan), 2 (magenta), and 3 (white). When the
	attribute is 0, the character is the background color specified by the
	COLOR statement. Attribute 0 can be used to erase a character. If no
	COLOR statement is used, the default is COLOR 0,1.
	
	The following program CALLs INTERRUPT 10 Hex (16 decimal), with
	function 9, to display a character of a certain color on the screen.
	To use this program, do the following:
	
	1. Invoke QuickBASIC by typing the following:
	
	      QB /L QB.QLB       [for QuickBASIC 4.00, 4.00b, or 4.50]
	   or
	      QBX /L QBX.QLB     [for BASIC PDS Version 7.00]
	
	   (The /L option above loads the QB.QLB or QBX.QLB Quick library,
	   which contains the CALL INTERRUPT routine.)
	
	2. QB.BI must be used in the $INCLUDE metacommand (see below). QB.BI
	   contains the user-defined TYPEs RegTypeX and RegType. Refer to the
	   QB.BI text file for more information. For BASIC PDS 7.00, this file
	   is called QBX.BI.
	
	3. If you are compiling and linking outside the environment, QB.LIB
	   must be linked in. For BASIC PDS 7.00, you must link in QBX.LIB.
	
	This program allows text to be printed to the screen at the location
	of the cursor by CALLing a subprogram named PrintColors. The text,
	attribute, and row and column position of the cursor are passed.
	
	DECLARE SUB PrintColors (text$, attribute, col, row)
	' $INCLUDE: 'qb.bi'
	' For BASIC PDS you must include 'qbx.bi'
	DIM SHARED inregs AS RegType, outregs AS RegType
	CLS
	SCREEN 1
	COLOR 0, 0                   'black background and even palette
	col = 1: row = 1             'current position of the cursor
	attribute = 1
	CALL PrintColors("green text ", attribute, col, row)
	attribute = 2
	
	CALL PrintColors("red text ", attribute, col, row)
	attribute = 3
	
	CALL PrintColors("yellow/brown text", attribute, col, row)
	PRINT "Default is yellow on CGA, brown on EGA"
	END
	
	REM Subprogram PrintColors prints text to the screen at position col
	REM and row in a color determined by the attribute passed and the
	REM palette selected by the COLOR statement. The cursor is updated.
	
	SUB PrintColors (text$, attribute, col, row)
	  FOR i = 1 TO LEN(text$)
	    inregs.ax = &H900 + ASC(MID$(text$, i, 1)) 'function 09 in the
	                              'high part of the register and the ASCII
	                              'code of a character in the low part
	    inregs.bx = attribute 'display page (0 is the current page) in the
	                          'high part and the attribute in the low part
	    inregs.cx = &H1         'number of times to display the character
	    CALL Interrupt(&H10, inregs, outregs)
	    col = col + 1        'relocate the cursor one place to the right
	    LOCATE row, col      'for every character written to the screen
	  NEXT
	END SUB
