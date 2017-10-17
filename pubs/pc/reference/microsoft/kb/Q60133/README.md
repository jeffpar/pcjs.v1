---
layout: page
title: "Q60133: Description of How LOCATE Can Change the Cursor Size"
permalink: /pubs/pc/reference/microsoft/kb/Q60133/
---

## Q60133: Description of How LOCATE Can Change the Cursor Size

	Article: Q60133
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890714-76 B_BasicCom
	Last Modified: 3-APR-1990
	
	The LOCATE statement provides the ability to change the cursor size in
	text mode (SCREEN 0). The number of scan lines varies depending on the
	video system and the operating system.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b
	and 4.50 for MS-DOS, Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and OS/2, and Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and OS/2.
	
	The following table shows the valid settings for most video systems:
	
	   Video System | Op Sys | Scan lines
	   -------------+--------+-----------
	   Hercules     |  DOS   |    12
	   CGA/EGA/VGA  |  DOS   |     8
	   Any          |  OS/2  |    16
	
	The cursor is a text mode feature and is not available for use with
	the LOCATE statement in graphics modes. INPUT is the only statement
	that automatically uses a cursor in graphics modes.
	
	The following information, taken from the QBX.EXE online help from
	BASIC PDS 7.00, is the description of the usage of the start and stop
	lines in the LOCATE statement:
	
	The start and stop lines are the CRT scan lines that specify the
	following:
	
	1. Which pixels on the screen are lit.
	
	   A wider range between the start and stop lines produces a taller
	   cursor, such as one that occupies an entire character block.
	
	   In OS/2 real mode and under DOS, LOCATE assumes there are eight
	   lines (numbered 0 to 7) in the cursor. In OS/2 protected mode, there
	   are 16 lines (numbered 0 to 15).
	
	2. When start% is greater than stop%, LOCATE produces a two-part
	   cursor.
	
	   If the start line is given, but the stop line is omitted, stop%
	   assumes the same value as start%.
	
	   A value of 8 for both start% and stop% produces the underline
	   cursor.
	
	   The maximum cursor size is determined by the character block size
	   of the screen mode in use.
	
	   Setting start% greater than stop% displays a full-height cursor on
	   VGA-equipped systems.
	
	Code Example
	------------
	
	The following code example prompts you for start and stop scan lines
	and displays the cursor:
	
	SCREEN 0
	CLS
	LOCATE 8, 10
	
	DO
	  INPUT "Start line: ",StartLine%
	  IF StartLine% = -1 THEN END       'Enter -1 to end
	  LOCATE 9, 10
	  INPUT "Stop  line: ",StopLine%
	  CLS
	  LOCATE 10, 10, 1, StartLine%, StopLine%
	LOOP
