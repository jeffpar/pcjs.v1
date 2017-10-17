---
layout: page
title: "Q35147: Capturing Paintbrush and FRIEZE Screens with QuickBASIC BSAVE"
permalink: /pubs/pc/reference/microsoft/kb/Q35147/
---

## Q35147: Capturing Paintbrush and FRIEZE Screens with QuickBASIC BSAVE

	Article: Q35147
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 22-OCT-1990
	
	With the Microsoft Mouse Paintbrush package you can create graphic
	images that can be displayed on the screen with the FRIEZE
	terminate-and-stay resident program. This article explains how to save
	a copy of a Paintbrush graphic image in a form that can be used in
	Microsoft BASIC.
	
	You can invoke FRIEZE with hardware interrupt 5 from a Microsoft BASIC
	program. With FRIEZE versions 7.25 and earlier, you can load a
	Paintbrush image into video memory. The BSAVE statement in BASIC lets
	you write a video memory image into a disk file, which can be used by
	the BASIC BLOAD command. BLOAD lets you load images from a
	BSAVE-format disk file back into video memory.
	
	This information only applies to FRIEZE versions 7.25 and earlier.
	This article does not apply to FRIEZE versions 8.05 or later, which do
	not have a load option.
	
	This information applies to QuickBASIC versions 4.00, 4.00b, and 4.50
	for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC Professional Development System (PDS)
	version 7.00 for MS-DOS.
	
	An easier technique to create BLOAD format graphics files (from file
	formats used by a variety of graphics programs) is to use the
	PICEM.EXE freeware program. PICEM.EXE is described in a separate
	article, which can be found by querying for the following words:
	
	   PICEM and freeware
	
	The following steps demonstrate this process:
	
	1. Load the FRIEZE program into memory. (FRIEZE is a TSR, a
	   terminate-and-stay-resident program, provided with the Microsoft
	   Mouse PaintBrush program.)
	
	2. Run BASIC Program 1 (below), which invokes hardware interrupt
	   number 5. This interrupt activates FRIEZE, which appears as a
	   horizontal menu in the upper-left corner of the screen. Execution
	   of BASIC Program 1 is now suspended by the interrupt.
	
	3. Using the Load option in the FRIEZE menu, load the desired
	   PaintBrush image.
	
	4. Immediately after the image loads, the BASIC Program 1
	   automatically resumes running and executes the BSAVE statement. The
	   BSAVE statement saves the current screen to a disk file. Program 1
	   then stops.
	
	5. You may run Program 2 at any later time to display the image that
	   is stored in the IMAGE.PIC disk file.
	
	Code Examples
	-------------
	
	Program 1
	---------
	
	   REM The QB.BI definition file is found on the QuickBASIC release disk:
	   REM For BASIC Compiler 7.00 and QBX.EXE you must include 'QBX.BI'
	   REM $INCLUDE: 'qb.bi'
	   DIM regs AS RegType
	   SCREEN 3   ' Use SCREEN 3 for Hercules display adapter.
	   CALL INTERRUPT(&H5, regs, regs)   ' Invokes hardware interrupt 5.
	   DEF SEG = &HB000 ' Monochrome video memory starts at address &HB000
	   ' If you have a CGA display, change the previous SCREEN and DEF SEG
	   ' statements to the following:
	   ' SCREEN 1
	   ' DEF SEG = &HB800  ' Starting Video memory address for CGA is &HB800
	   BSAVE "image.pic", 0, 32767
	   DEF SEG   ' Returns segment pointer to default data segment.
	
	Program 2
	---------
	
	   SCREEN 3   ' Use SCREEN 3 for Hercules display adapter.
	   DEF SEG = &HB000
	   ' If you have a CGA, change the previous two statements to the
	   ' following:
	   ' SCREEN 1
	   ' DEF SEG = &HB800
	   BLOAD "image.pic", 0
	   DEF SEG
