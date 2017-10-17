---
layout: page
title: "Q33706: Sample BASIC Code to Display ROM-BIOS Date for an IBM PC"
permalink: /pubs/pc/reference/microsoft/kb/Q33706/
---

## Q33706: Sample BASIC Code to Display ROM-BIOS Date for an IBM PC

	Article: Q33706
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_BasicInt B_GWBasicI H_Mach20
	Last Modified: 16-DEC-1989
	
	Getting the ROM-BIOS (Read-Only Memory, Basic Input/Output System)
	date for a computer can be an important clue in diagnosing a variety
	of potential hardware- and software-compatibility problems.
	
	Page 60 of "The Peter Norton Programmer's Guide to the IBM PC"
	(published by Microsoft Press, 1985) provides the following BASIC
	program to display the ROM-BIOS date in month-day-year format for an
	IBM PC:
	
	DEF SEG = &HF000
	FOR i = 0 TO 7
	  PRINT CHR$(PEEK(&HFFF5 + i));
	NEXT
	
	This sample program applies to most Microsoft BASIC products for the
	IBM PC, including the following:
	
	1. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02,
	   2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Versions 5.35, 5.36, 6.00, 6.00b, for
	   MS-DOS.
	
	3. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23
	
	4. Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	If your IBM PC ROM-BIOS is dated prior to 10/27/82, then the following
	restrictions apply:
	
	1. You may not be able to address a full 640K -- only 544K or so
	   may be available.
	
	2. The machine will not be compatible with the Microsoft MACH 20
	   board.
	
	3. Because the ROM-BIOS is earlier than 10/27/82, you have an
	   IBM PC 1 with a 16/64K motherboard (logic board).
	   This machine does not support hard drives, and just supports
	   floppies.
	
	4. IBM no longer offers the 10/27/82 ROM-BIOS upgrade for ROM
	   versions earlier than 10/27/82 if you have a 16/64K motherboard.
	   (IBM does currently upgrade the BIOS for the 64/256K motherboard.)
	
	5. Other BIOS-related restrictions or problems may occur.
	
	Another way to determine the age of your PC is to look on the
	front-left corner of your motherboard (logic board). IBM PC 1 machines
	are stamped with 16/64K. IBM PC 1 machines usually have ROM-BIOS
	Versions earlier than 10/27/82, and they don't support hard drives.
	IBM PC 2 machines are stamped with 64/256K on the motherboard and can
	optionally support hard drives.
