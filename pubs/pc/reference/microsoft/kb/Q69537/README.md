---
layout: page
title: "Q69537: MSHERC.COM Mistakenly Loads on CGA Computer; README Addition"
permalink: /pubs/pc/reference/microsoft/kb/Q69537/
---

## Q69537: MSHERC.COM Mistakenly Loads on CGA Computer; README Addition

	Article: Q69537
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910212-174 docerr B_BasicCom
	Last Modified: 21-FEB-1991
	
	MSHERC.COM is a Hercules graphics driver supplied with Microsoft
	QuickBASIC version 4.50 and Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10. QBHERC.COM is the equivalent
	driver supplied with Microsoft QuickBASIC versions 4.00 and 4.00b. You
	must run MSHERC.COM or QBHERC.COM before you can use Hercules graphics
	(SCREEN 3) in your BASIC programs.
	
	MSHERC.COM or QBHERC.COM should not load on a system that is using a
	graphics adapter other than Hercules. If invoked on a system using an
	EGA or VGA graphics card, MSHERC.COM or QBHERC.COM reports the
	following error and does not load:
	
	   Hercules Video Card not present.
	   Hercules Video Support Routines not installed.
	
	However, on some systems using CGA graphics cards, MSHERC will load
	into memory and display the following:
	
	   Hercules Video Support Routines installed.
	
	This behavior consumes memory unnecessarily, and the message can be
	misleading because Hercules graphics (SCREEN 3) does not work on CGA
	systems. MSHERC.COM or QBHERC.COM should not be run on computers that
	have a CGA card.
	
	README.DOC Addition for MSHERC.COM
	----------------------------------
	
	All documentation for the driver file MSHERC.COM was mistakenly left
	out of the manuals, online Help, and README.DOC file of QuickBASIC
	version 4.50 and BASIC PDS versions 7.00 and 7.10. MSHERC.COM is
	briefly mentioned in the packing list (PACKING.LST) of these products,
	but instructions are missing.
	
	The following instructions for QBHERC.COM are taken from the
	README.DOC file for QuickBASIC versions 4.00/4.00b and BASIC compiler
	versions 6.00/6.00b; this information applies to both QBHERC.COM and
	MSHERC.COM:
	
	   The SCREEN statement now includes mode 3 for Hercules display
	   adapters. The following is a brief summary of screen mode 3. See
	   your Hercules documentation for details.
	
	   QuickBASIC supports Hercules Graphics Card, Graphics Card Plus,
	   InColor Card, and 100% compatibles.
	
	   You must use a monochrome monitor.
	
	   Hercules text mode is SCREEN 0; Hercules Graphics mode is SCREEN 3.
	
	   You must load the Hercules driver (QBHERC.COM) before running your
	   program. If the driver is not loaded, SCREEN 3 statement gives an
	   "Illegal function call" error message. Type QBHERC to load the
	   driver.
	
	   Text dimensions are 80x25 (9x14 character box); bottom 2 scan lines
	   of 25th row are not visible.
	
	   Resolution is 720x348 pixels, monochrome.
	
	   Number of screen pages supported is 2.
	
	   The PALETTE statement is not supported.
	
	   In order to use the Mouse, you must follow special instructions for
	   Hercules cards in the Microsoft Mouse Programmer's Reference Guide.
	   (This must be ordered separately; it is not supplied with either
	   the QuickBASIC or the Mouse package.)
	
	
	
	
	
	
	Microsoft Mouse
	=============================================================================
