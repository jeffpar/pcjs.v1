---
layout: page
title: "Q40548: Using CALL INTERRUPT to Determine Current Video Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q40548/
---

## Q40548: Using CALL INTERRUPT to Determine Current Video Mode

	Article: Q40548
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881221-34
	Last Modified: 15-JAN-1991
	
	Microsoft QuickBASIC cannot determine which kind of video card is
	installed on your machine. However, you can use the CALL INTERRUPT
	statement to invoke ROM BIOS video interrupt 10 Hex, function 0F Hex
	(Get Video Mode), to find out which video mode the machine is
	currently using. From the information returned by this interrupt, you
	can determine whether the video card installed is a monochrome card,
	such as a Hercules or compatible card, or if it is a color card, such
	as an IBM CGA, EGA, VGA, or compatible card.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS. It also applies to Microsoft BASIC Compiler
	versions 6.00 and 6.00b and Microsoft BASIC PDS versions 7.00 and 7.10
	running under MS-DOS or in MS OS/2 real mode in the DOS compatibility
	box.
	
	In QuickBASIC versions 2.00, 2.01, and 3.00, you can use the CALL
	INT86 routine instead of CALL INTERRUPT to invoke the video interrupt.
	
	A BASIC application may need to determine whether or not the video
	system in the machine it is running on is monochrome or color (that
	is, to decide which colors to use for its output, etc.).
	
	The ROM BIOS interrupt 10 Hex, function 0F Hex, will return the
	current video mode. If this interrupt returns a 7 in the AL register,
	the video card is a monochrome card and cannot support color. If it
	returns something other than 7, the video card can support color;
	however, this does NOT determine whether or not a color monitor is
	connected to the computer.
	
	Also, this function can determine where video memory for text mode
	begins. If the function returns 7, video memory begins at the segment
	paragraph address of B000 hex; otherwise, it begins at segment B800
	hex.
	
	For more information, see Page 415 of "Advanced MS-DOS" by Ray Duncan
	(Microsoft Press, 1986) and Page 45 of "Microsoft QuickBASIC
	Programmer's Toolbox" by John Clark Craig (Microsoft Press, 1988).
	
	The following sample listing demonstrates the use of CALL INTERRUPT to
	obtain the current video mode. This program can be compiled in
	QuickBASIC 4.00, 4.00b, or 4.50 with QB /L QB.QLB or linked with
	QB.LIB, which contains the INTERRUPT routine:
	
	' Note: The QB.BI file includes the TYPE definition of RegType.
	' If you are using BASIC PDS version 7.00/7.10, the include file
	' name should be 'QBX.BI' and the Quick library should be QBX.QLB.
	
	REM $INCLUDE: 'QB.BI'
	FUNCTION GetVMode% STATIC
	'--------------------------------------------------------------------
	'Function to return the current video mode. The mode value returned is
	'the same value returned from INT 10H, function 0FH -- Get Video Mode
	'(7 = Monochrome card, other = color graphics card)
	'--------------------------------------------------------------------
	  DIM InRegs AS RegType, OutRegs AS RegType
	  InRegs.ax = &HF00                    'INT 10H, fn. 0FH (get vmode)
	  CALL INTERRUPT(&H10, InRegs, OutRegs)
	  GetVMode% = OutRegs.ax AND 255       'AL returns the Video Mode
	END FUNCTION
