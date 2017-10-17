---
layout: page
title: "Q28040: Problems with VGA Modes on COMPAQ VGC Board &amp; Video Seven VGA"
permalink: /pubs/pc/reference/microsoft/kb/Q28040/
---

## Q28040: Problems with VGA Modes on COMPAQ VGC Board &amp; Video Seven VGA

	Article: Q28040
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom Video-7 Video 7
	Last Modified: 8-NOV-1990
	
	When using a COMPAQ VGC VGA or Video Seven VGA graphics card, you
	might receive only a blue foreground in QuickBASIC SCREEN mode 11.
	This behavior occurs because the COMPAQ VGC VGA and Video Seven VGA
	emulate SCREEN mode 11 by using SCREEN mode 12. This differs from the
	IBM VGA card's implementation of SCREEN 11 for which QuickBASIC is
	designed.
	
	The following versions of BASIC are not designed to work around this
	nonstandard case: Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50
	for MS-DOS, Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS, and Microsoft BASIC Professional Development System (PDS)
	version 7.00 for MS-DOS.
	
	BASIC PDS 7.10 compensates for this case and the colors will come up
	correctly.
	
	The following sample program is a work around for BASIC versions 7.00
	and earlier and QuickBASIC versions 4.x. By changing the Palette
	registers for SCREENs 12 and 13, this program changes the palette for
	SCREEN 11 for the video cards that perform this form of emulation.
	Interrupt 10 hex with function 10 hex and subfunction 12 hex changes a
	block of palette registers. The following program shows how to perform
	this interrupt call:
	
	Sample Code
	-----------
	
	' In BASIC PDS 7.00, use the following $INCLUDE:
	REM $INCLUDE: 'QBX.BI'
	' but if you are using QuickBASIC 4.x or BASIC compiler 6.00x, use:
	'         REM $INCLUDE: 'QB.BI' instead
	TYPE PaletteRegisterType
	  Red AS STRING * 1
	  Green AS STRING * 1
	  Blue AS STRING * 1
	END TYPE
	
	DIM inregs AS regtypex
	DIM outregs AS regtypex
	DIM PaletteArray(0 TO 1) AS PaletteRegisterType
	
	SCREEN 11
	PALETTE 0, 63 * 256              'Try to change the colors to
	PALETTE 1, 63                    '  green on red.
	PRINT "THIS IS IN THE WRONG COLOR(blue on green)"
	PRINT "HIT ANY KEY TO CONTINUE"
	WHILE INKEY$ = "": WEND          'pause for keypress
	
	'Set up the palette for the right colors: Each palette entry ranges
	'  from 0 to 63
	
	'Set up the Background: Bright green
	
	PaletteArray(0).Red = CHR$(0)    'Set the amount of red  : 0
	PaletteArray(0).Green = CHR$(63) 'Set the amount of green: 63
	PaletteArray(0).Blue = CHR$(0)   'Set the amount of blue : 0
	
	'Set up the Foreground: bright red
	
	PaletteArray(1).Red = CHR$(63)   'Set the amount of red  : 63
	PaletteArray(1).Green = CHR$(0)  'Set the amount of green: 0
	PaletteArray(1).Blue = CHR$(0)   'Set the amount of blue : 0
	
	'Set up the registers for the interrupt call.
	
	inregs.ax = &H1012               ' Function &H10, Subfunction &H12
	inregs.bx = 0                    ' Starting Color register
	inregs.cx = 2                    ' Number of Color registers
	inregs.dx = VARPTR(PaletteArray(0))
	inregs.es = VARSEG(PaletteArray(0))
	
	CALL interruptx(&H10, inregs, outregs)
	PRINT "THE COLORS ARE NOW CORRECT (red on green)"
