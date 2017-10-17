---
layout: page
title: "Q50225: How to Convert VGA Colors to Their Equivalent Gray Scale"
permalink: /pubs/pc/reference/microsoft/kb/Q50225/
---

## Q50225: How to Convert VGA Colors to Their Equivalent Gray Scale

	Article: Q50225
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891010-159 B_BasicCom
	Last Modified: 11-DEC-1989
	
	In Microsoft QuickBASIC, VGA colors can be converted to their
	equivalent gray scale values using the CALL INTERRUPT statement. This
	can be useful when printing an image or having the image scanned by
	devices that do not support color.
	
	This procedure can be used to convert a color image to a monochrome
	equivalent before printing out the image on a dot-matrix printer.
	
	Once the color registers are converted to their gray scale
	equivalents, the original red, green, and blue values are lost. If
	this information needs to be restored, the VGA color registers should
	be saved before doing the gray scale summing, and then restored
	afterward.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS and to Microsoft BASIC Compiler Versions 6.00,
	and 6.00b for MS-DOS, and Microsoft BASIC PDS 7.00 for MS-DOS.
	
	The following BASIC program is GRAY.BAS, which displays a multicolored
	image in VGA SCREEN 13, then converts all of the colors to their
	equivalent gray scale values:
	
	REM $INCLUDE: 'qb.bi'  ' defines for CALL INTERRUPT
	' For BC.EXE and QBX.EXE in BASIC PDS 7.00 the include file is 'QBX.BI'
	
	DIM inregs AS RegType
	DIM outregs AS RegType
	SCREEN 13
	
	FOR i% = 2 TO 255      ' display colorful pattern
	        LINE (i%, 10)-(i%, 199), i%
	NEXT
	
	LOCATE 1, 1
	COLOR 7
	PRINT "press any key to convert to gray scale"
	WHILE INKEY$ = "": WEND
	
	inregs.ax = &H101B     ' BIOS call to set gray scale values
	inregs.bx = 0          ' start at color register 0
	inregs.cx = 256        ' convert all 256 color registers
	CALL INTERRUPT(&H10, inregs, outregs)
	
	LOCATE 1, 1
	PRINT "press any key to end                   "
	WHILE INKEY$ = "": WEND
	END
	
	To demonstrate this program from an .EXE program, compile and link as
	follows:
	
	   BC GRAY.BAS;
	   LINK GRAY,,,QB.LIB;
	
	For BASIC compiler 7.00, compile and link as follows:
	
	   BC GRAY.BAS;
	   LINK GRAY,,,QBX.LIB;
	
	If you are running the program from the QuickBASIC QB.EXE editor, the
	Quick library QB.QLB must be loaded in as follows:
	
	   QB GRAY /L QB.QLB
	
	For QBX.EXE in BASIC compiler 7.00, the Quick library QBX.QLB must be
	loaded as follows:
	
	   QBX GRAY /L QBX.QLB
