---
layout: page
title: "Q58825: How BASIC Can Determine VGA Palette Colors with BIOS Interrupt"
permalink: /pubs/pc/reference/microsoft/kb/Q58825/
---

## Q58825: How BASIC Can Determine VGA Palette Colors with BIOS Interrupt

	Article: Q58825
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900214-79 B_BasicCom
	Last Modified: 6-MAR-1990
	
	The easiest way to determine the color value associated with a given
	VGA palette register is to use BIOS Interrupt 10 Hex, with Function 10
	Hex, and Subfunction 15 Hex. This information applies only to machines
	that have VGA adapters and return information only on the VGA palette.
	This interrupt does not supply information on the EGA or CGA palettes.
	
	The sample program below applies only to Microsoft QuickBASIC Versions
	4.00, 4.00b, and 4.50, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b, and to Microsoft BASIC Professional Development System (PDS)
	Version 7.00 under MS-DOS. It does not apply to earlier versions of
	QuickBASIC or BASIC compiler because they do support VGA SCREEN modes.
	(However, the information on Interrupt 10 Hex, with Function 10 Hex
	applies to any language with the ability to call BIOS routines,
	including QuickBASIC Versions 2.00, 2.01, and 3.00.)
	
	Interrupt 10 hex (16 decimal) contains all of the advanced video
	services available through the BIOS of the PC. Function 10 hex (16
	decimal) of interrupt 10 hex contains the color or palette services.
	These include services for setting or retrieving color information.
	Subfunction 15 hex (21 decimal) of these services returns the red,
	green, and blue intensities associated with a particular palette
	register. From this, you can determine the color number associated
	with that attribute.
	
	There are 16 (0-15) attributes in VGA Screen 12, and 256 (0-255)
	attributes in VGA Screen 13. Screen 11 has only 1. Each of these
	attributes has a corresponding palette register. When you do a PALETTE
	or PALETTE USING statement, you change the values in one or all of
	these registers. However, BASIC has no built-in procedure for reading
	these registers. Therefore, you must use CALL INTERRUPT.
	
	The sample program below uses CALL INTERRUPT to find the default
	values for all of the palette registers associated with screen mode
	12. This program can easily be modified to find all 256 registers
	available in screen mode 13 by looping 256 times instead of 16. The
	output of the program lists the register number and the red, green,
	and blue intensity values for each palette register. It also
	calculates the corresponding color number with the following formula:
	
	   Colornumber = (65536 * Blue) + (256 * Green) + Red
	
	For more information about BIOS interrupts and video graphics, see the
	following books:
	
	1. "Advanced MS-DOS Programming, 2nd Edition," by Ray Duncan
	   (Microsoft Press, 1988)
	
	2. "Programmer's Guide to PC & PS/2 Video Systems," by Richard Wilton
	   (Microsoft Press, 1987)
	
	Code Example
	------------
	
	The following program can be run in the QuickBASIC 4.00, 4.00b, or
	4.50 environment and in the QuickBASIC environment included with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b by loading QB.EXE
	with the QB.QLB Quick library. In the BASIC PDS 7.00 environment, load
	QBX.EXE with the QBX.QLB Quick library. If the program is compiled, it
	must be linked with either QB.LIB or QBX.LIB, respectively.
	
	'PALINFO.BAS
	'*** You must load QB.QLB or link with QB.LIB for QuickBASIC 4.x ***
	'*** You must load QBX.QLB or link with QBX.LIB for BASIC 7.00 ***
	
	REM $INCLUDE: 'qb.bi'   'qbx.bi for BASIC 7.00 and QBX
	DIM inregs AS regtype, outregs AS regtype
	
	SCREEN 12
	PRINT "Palette Information"
	PRINT "Register #", "Green", "Blue", "Red", "Color Number"
	PRINT "----------", "-----", "----", "---", "-------------"
	
	FOR i = 0 TO 15             '0 to 255 for screen 13
	  inregs.ax = &H1015          'AH = 10H,   AL=15H
	  inregs.bx = i               'BL = register #
	  CALL interrupt(&H10, inregs, outregs)
	
	'The following lines mask off the high/low bites of the registers
	'CH = green, CL = blue, DH = red
	
	  a% = (outregs.cx AND &HFF00) / &HFF
	  b% = (outregs.cx AND &HFF)
	  c% = (outregs.dx AND &HFF00) / &HFF
	
	  d& = 65536 * b% + 256 * a% + c%
	  PRINT i, a%, b%, c%, d&
	NEXT i
	
	END  ' End of example code.
	
	Additional reference words: &H10 10H &H15 15H
