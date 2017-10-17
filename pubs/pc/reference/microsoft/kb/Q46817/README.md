---
layout: page
title: "Q46817: Getting High-Intensity Background Color in SCREEN 0"
permalink: /pubs/pc/reference/microsoft/kb/Q46817/
---

## Q46817: Getting High-Intensity Background Color in SCREEN 0

	Article: Q46817
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-JAN-1991
	
	To print text with a high-intensity background, you must meet the
	following requirements:
	
	1. Be in SCREEN 0 (text mode)
	2. Operate on a machine with an EGA, VGA, or MCGA graphics adapter
	
	To get a high-intensity background, use ROM BIOS interrupt 10 Hex,
	with function 10 Hex and subfunction 3 Hex, to set the third bit in
	the Attribute Controller's Mode Control Register. This disables
	blinking and enables high intensity. Once this is done, you can print
	characters to the screen through the BIOS, using BIOS interrupt 10 Hex
	with function 9 Hex. In this way, a background color that had
	previously been blinking is now in high intensity.
	
	For information on controlling background color in screen modes other
	than SCREEN 0, query in this Knowledge Base on the word S9COLOR. This
	query locates an article about using foreground colors to emulate
	background colors.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS; and to Microsoft BASIC PDS versions 7.00 and 7.10
	for MS-DOS.
	
	For a detailed discussion of the Attribute Controller and BIOS
	interrupts, please refer to the following sources:
	
	1. "Programmer's Guide to the EGA and VGA Cards" by Richard F.
	   Ferraro.
	
	2. "Programmer's Guide to PC and PS/2 Video Systems" by Richard
	   Wilton, published by Microsoft Press (1987). See especially Pages
	   53-54 and 466-472.
	
	The following program demonstrates printing with a high-intensity
	background color; it operates in SCREEN 0 on machines equipped with an
	EGA, VGA, or MCGA graphics card:
	
	' $INCLUDE: 'QB.BI'
	' For BC.EXE and QBX.EXE for BASIC 7.00/7.10 use include file 'QBX.BI'
	
	'DIM InReg as RegType, OutReg as RegType
	
	CLS
	COLOR 15,13
	PRINT "Before the call to the interrupt"
	PRINT "CCCCCCCC"
	
	InReg.ax = &H943                   'Call BIOS interrupt to
	InReg.bx = &HDF                    'display characters
	InReg.cx = &H8
	CALL Interrupt(&H10, InReg, OutReg)
	
	LOCATE 4, 1
	INPUT "Press ENTER to change to high intensity..."; a$
	
	InReg.ax = &H1003                  'Call BIOS interrupt to
	InReg.bx = 0                       'enable high intensity
	CALL Interrupt(&H10, InReg, OutReg)
	
	PRINT "After the call to the interrupt"
	PRINT "CCCCCCCC"
	
	InReg.ax = &H943                   'Call interrupt to print
	InReg.bx = &HDF                    'characters again. Both
	InReg.cx = &H8                     'the BIOS-printed sets of
	CALL interrupt(&H10, InReg,OutReg) 'characters will have a
	                                   'high-intensity background.
	END
