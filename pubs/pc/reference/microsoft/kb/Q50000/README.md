---
layout: page
title: "Q50000: How to Save and Restore the VGA Palette Registers in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q50000/
---

## Q50000: How to Save and Restore the VGA Palette Registers in BASIC

	Article: Q50000
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891017-45 B_BasicCom
	Last Modified: 12-DEC-1989
	
	In Microsoft QuickBASIC, a program can save and restore the VGA
	PALETTE registers using the CALL INTERRUPT statement. This can be
	useful when SHELLing to other programs that might change the PALETTE
	registers.
	
	This can also be used along with BSAVE and BLOAD to save graphic
	images. BLOAD and BSAVE save the binary image of the graphic image,
	but not the color PALETTE. The INTERRUPT can be used to read the
	PALETTE registers into an array, which can then be saved along with
	the graphic image.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS, and Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	The BASIC program below is SAVPAL.BAS, which displays a multicolored
	image and then restores the palette registers after setting all of the
	palette registers to black.
	
	To demonstrate this program from an .EXE program, compile and link as
	follows:
	
	   BC SAVEPAL.BAS;
	   LINK SAVEPAL;
	
	If running the program from the QuickBASIC editor environment, the
	Quick library QB.QLB must be loaded in. This can be done with the
	following command line:
	
	   QB SAVPAL /L
	
	If running in the BASIC Compiler 7.00 QuickBASIC Extended environment,
	the Quick library QBX.LIB must be loaded in. This can be done with
	the following command line:
	
	   QBX SAVEPAL /L
	
	Code Example
	------------
	
	TYPE colortype           ' structure to hold RGB color palette
	   red AS STRING * 1
	   green AS STRING * 1
	   blue AS STRING * 1
	END TYPE
	
	REM $INCLUDE: 'qb.bi'    ' defines for CALL INTERRUPTX
	' For QBX.EXE environment use the include file 'QBX.BI'
	
	DIM inregsx AS RegTypeX
	DIM outregsx AS RegTypeX
	DIM colorbuf(255) AS colortype
	SCREEN 13
	
	inregsx.ax = &H1017      ' BIOS interrupt to save palette registers
	inregsx.bx = 0
	inregsx.cx = 256         ' save all 256 color registers
	inregsx.es = VARSEG(colorbuf(0))  ' address of array holding palette
	inregsx.dx = VARPTR(colorbuf(0))
	
	CALL INTERRUPTX(&H10, inregsx, outregsx)  ' save palette registers
	
	FOR i% = 2 TO 255      ' display colorful pattern
	   LINE (i%, 10)-(i%, 199), i%
	NEXT
	
	LOCATE 1, 1
	COLOR 1
	PRINT "press any key to blank palette"
	WHILE INKEY$ = "": WEND
	
	FOR i% = 2 TO 255  ' set all but first palette register to black
	        PALETTE i%, 0
	NEXT
	
	LOCATE 1, 1
	PRINT "press any key to restore palette"
	
	WHILE INKEY$ = "": WEND
	
	inregsx.ax = &H1012      ' BIOS interrupt to restore palette registers
	inregsx.bx = 0
	inregsx.cx = 256         ' restore all 256 color registers
	inregsx.es = VARSEG(colorbuf(0))  ' address of array holding palette
	inregsx.dx = VARPTR(colorbuf(0))
	
	CALL INTERRUPTX(&H10, inregsx, outregsx)  ' restore palette registers
