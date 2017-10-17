---
layout: page
title: "Q50221: How to Resize and Turn On/Off the Text Mode (SCREEN 0) Cursor"
permalink: /pubs/pc/reference/microsoft/kb/Q50221/
---

## Q50221: How to Resize and Turn On/Off the Text Mode (SCREEN 0) Cursor

	Article: Q50221
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891018-112 B_BasicCom
	Last Modified: 13-DEC-1989
	
	This article demonstrates how to control the text mode cursor by
	directly accessing the BIOS with CALL INTERRUPT. There are two ways to
	control the text mode cursor. The BASIC LOCATE statement enables a
	program to position the cursor, size the cursor, and turn the cursor
	on and off. This article describes how this can be done by CALLing the
	BIOS INTERRUPT 10 hex, with function 12 hex, with subfunction 34 hex,
	which allows a program to turn the cursor on or off. BIOS INTERRUPT 10
	hex with function 1 allows a program to set the cursor size.
	
	This information applies to Microsoft QuickBASIC 4.00, 4.00b, and 4.50
	for MS-DOS and to Microsoft BASIC Compiler 6.00, and 6.00b for MS-DOS
	and Microsoft BASIC PDS 7.00 for MS-DOS.
	
	The text mode cursor and its size, blinking, and position are all
	controlled by the video hardware. The text mode cursor is not created
	by the QuickBASIC editor, compiler, or its applications. Because the
	hardware supports cursor emulation only in text mode (that is, SCREEN
	0 in BASIC) there is no graphics mode cursor. This is not a problem or
	limitation of QuickBASIC.
	
	Even though there is no hardware-generated blinking cursor in a
	graphics mode, the BIOS does keep track of the current text position.
	The program can call BIOS INTERRUPT &H10 functions &H2 and &H3 to get
	and set the current position of the cursor. If desired, a graphics
	mode cursor can be placed on the screen by the program itself. BASIC
	uses a solid, nonblinking block cursor in graphics mode. This graphics
	mode cursor is placed there by the QuickBASIC editor and compiler.
	
	The cursor is controlled by CALLing BIOS service routines that allow
	the cursor to be enabled, disabled, and resized. The largest possible
	cursor fills one entire character box. Depending on the graphics
	adapter, one character box can have a different number of scan lines.
	For the BIOS routines to work regardless of the video adapter, the
	BIOS routines assume that there is an 8-pixel by 8-scan-line format
	for the cursor. This means that you can set the cursor to eight
	different sizes by CALLing the BIOS.
	
	For more information on CALLing both BIOS and DOS INTERRUPTs query
	on the word QB4INT.
	
	The following code example demonstrates how to use the BIOS service
	routines to turn the cursor off, turn it back on, and how to resize
	the cursor to each of the possible sizes.
	
	Code Example
	------------
	
	REM $INCLUDE: 'qb.bi'
	' FOR QBX.EXE editor the include file is 'QBX.BI'
	
	DIM inregs AS regtype, outregs AS regtype
	CLS
	' Set up the parameters to disable the cursor emulation.
	inregs.ax = &H1201  ' AH = 12H for function 12H
	                    ' AL = 1 to disable the cursor.
	inregs.bx = &H34    ' Subfunction 34
	' Disable the cursor:
	' For QB.EXE : run QB /L QB.QLB, or LINK to QB.LIB, to enable
	'    CALL INTERRUPT.
	' For QBX.EXE: run QBX/L QBX.QLB, or LINK to QBX.LIB, to enable
	'    CALL INTERRUPT.
	CALL interrupt(&H10, inregs, outregs)
	PRINT "The cursor should be off. Hit ENTER to bring it back "
	WHILE INKEY$ = "": WEND
	
	' Set up parameters to enable cursor emulation.
	inregs.ax = &H1200 ' AH = 12H for function 12H
	                   ' AL = 0 to enable the cursor.
	inregs.bx = &H34   ' BX = 34H for subfunction 34H.
	
	'Enable cursor emulation.
	CALL interrupt(&H10, inregs, outregs)
	
	' Even though the cursor has been enabled, it will not show.
	' This is because we need to set the size.  The following
	' loop cycles through the sizes.
	
	FOR i = 1 TO 8 ' 0 - 8 is the maximum size.
	
	   inregs.ax = &H100 ' AH = 1 for function 1.
	   inregs.cx = i     ' CH = 0 for starting line.
	                     ' CL = ending line.
	   CALL interrupt(&H10, inregs, outregs)
	   PRINT "Hit return to increase the cursor size: "
	   WHILE INKEY$ = "": WEND
	NEXT
	END
