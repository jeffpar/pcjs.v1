---
layout: page
title: "Q50945: How to Get Blinking Text in BASIC SCREEN Modes 7, 8, 9, 12, 13"
permalink: /pubs/pc/reference/microsoft/kb/Q50945/
---

## Q50945: How to Get Blinking Text in BASIC SCREEN Modes 7, 8, 9, 12, 13

	Article: Q50945
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891113-97 B_BasicCom
	Last Modified: 5-SEP-1990
	
	The program example below demonstrates how to use the CALL INTERRUPT
	statement to enable blinking text in screen modes 7, 8, 9, 12, and 13.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS; and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	Interrupt 10 hex, with function 10 hex and subfunction 03 hex, can be
	used to toggle the blink/intensity bit on the video card. This
	determines whether the most-significant bit of the character attribute
	selects a blinking or intensified display. The default is for this bit
	to signify intensified display.
	
	After this interrupt has been called, anything displayed in colors 0
	through 7 is displayed normally, but anything displayed in colors 8
	through 15 is displayed blinking. This is because colors 8 through 15
	have the most-significant bit of the character attribute set.
	
	The registers to load for the interrupt call are as follows:
	
	   Interrupt 10 hex
	   AH = 10 hex
	   AL = 03 hex
	   BL = 0 = enable intensity (turns off blinking)
	        1 = enable blinking  (turns off intensity)
	
	Running the following program, BLINK.BAS, enables and disables
	blinking characters:
	
	REM $INCLUDE: 'qb.bi'
	' For BC.EXE and QBX.EXE in PDS 7.00 or 7.10, use the include file 'QBX.BI'
	
	DIM inregs AS regtype
	DIM outregs AS regtype
	SCREEN 9
	FOR x% = 1 TO 15
	   COLOR x%
	   PRINT "this is color: "; x%
	NEXT
	COLOR 7
	LOCATE 24, 1
	PRINT "Press any key to enable blinking";
	WHILE INKEY$ = "": WEND
	inregs.ax = &H1003
	inregs.bx = 1
	CALL interrupt(&H10, inregs, outregs)
	LOCATE 24, 1
	PRINT "Press any key to turn off blinking";
	WHILE INKEY$ = "": WEND
	inregs.ax = &H1003
	inregs.bx = 0
	CALL interrupt(&H10, inregs, outregs)
	
	Compile and link with Microsoft QuickBASIC 4.00, 4.00b, and 4.50 or
	with Microsoft BASIC Compiler 6.00 and 6.00b as follows:
	
	   BC Blink.bas;
	   LINK Blink.bas,,,BRUNxx.Lib+QB.Lib;
	
	The "xx" in the library name is for the current version of the product
	you are using (40, 41, 45, 60, or 61). For Microsoft BASIC Compiler
	6.00 and 6.00b, use BRUNxxER.Lib (emulation math package) or
	BRUNxxAR.Lib (alternate math package). For the alternate math library,
	you must compile with the BC /FPa switch. If you compile with BC /O,
	link with BCOMxx.LIB instead of BRUNxx.LIB.
	
	To run this program in the QB.EXE environment, you must load the Quick
	library QB.QLB: QB /L QB.QLB.
	
	For BASIC PDS 7.00 or 7.10, compile and link as follows:
	
	   BC Blink.bas;
	   LINK Blink.bas,,,BRT70ENR.Lib+QBX.Lib;
	
	The above example is for the math emulation, near strings, and real
	mode run-time library. The other possible run-time libraries and their
	corresponding compiler switches are as follows:
	
	   Library Name   Compiler Switches     Comments
	   ------------   -----------------     --------
	
	   BRT70ENR.LIB   [The default mode]    Emulation math, near strings
	   BRT70ANR.LIB   /FPa                  Alternate math, near strings
	   BRT70EFR.LIB        /Fs              Emulation math, far strings
	   BRT70AFR.LIB   /FPa /Fs              Alternate math, far strings
	
	To use stand-alone libraries, use BCL70xxx.Lib instead of
	BRT70xxx.Lib and add the compiler switch BC /O.
	
	For the QBX.EXE 7.00 or 7.10 environment, use QBX.QLB: QBX /L QBX.QLB.
	
	Note: This interrupt can be used to accomplish the same effect in
	SCREEN 0. Usually this in not needed because the COLOR statement can
	be used to control the intensity and blinking. However, if a program
	is directly accessing the hardware (through POKE, for example), this
	interrupt might be needed. This will have no effect for video cards
	that are NOT in a color mode (for example, MODE CO80). For example, if
	a program is running on a dual-monitor system (Hercules and VGA) and
	the current mode is monochrome, this interrupt will not affect the
	color card.
