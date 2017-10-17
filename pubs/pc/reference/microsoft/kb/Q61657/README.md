---
layout: page
title: "Q61657: Setting the Border Color in EGA and VGA with CALL INTERRUPT"
permalink: /pubs/pc/reference/microsoft/kb/Q61657/
---

## Q61657: Setting the Border Color in EGA and VGA with CALL INTERRUPT

	Article: Q61657
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900325-26
	Last Modified: 8-MAY-1990
	
	In EGA and VGA SCREEN modes, the color of the border cannot be set
	using the COLOR statement. However, the ROM BIOS interrupt 10 Hex,
	function 10 Hex, subfunction 01 can be used to control the color of
	the screen border.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	4.50 for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and 6.00b
	for MS-DOS, and to Microsoft BASIC Professional Development System
	(PDS) version 7.00 for MS-DOS.
	
	The following program calls interrupt 10 Hex (16 decimal), with
	function 10 Hex and subfunction 1, to set the border color. The color
	value is put in register BH. To use this program, do the following:
	
	1. Invoke QuickBASIC by typing one of the following:
	
	      QB /L QB.QLB       [for QuickBASIC 4.00, 4.00b, or 4.50 and
	                         BASIC compiler 6.00 and 6.00b]
	   or
	      QBX /L QBX.QLB     [for BASIC PDS version 7.00]
	
	   (The /L option above loads the QB.QLB or QBX.QLB Quick library,
	   which contains the CALL INTERRUPT routine.)
	
	2. Use the QB.BI include file using the $INCLUDE metacommand. QB.BI
	   contains the user-defined types RegTypeX and RegType. Refer to the
	   QB.BI text file for more information. For QBX.EXE, this file is
	   called QBX.BI.
	
	3. If you are compiling and linking outside the QB.EXE (or QBX.EXE)
	   environment, QB.LIB must be linked in. For QBX.EXE, you must link
	   in QBX.LIB.
	
	Code Example
	------------
	
	   REM $INCLUDE: 'qb.bi'
	   DIM inregs AS RegType, outregs AS RegType
	   SCREEN 12   ' Any EGA or VGA SCREEN mode can be used here
	   inregs.ax = &H1001   ' Function 10 Hex and subfunction 1 are put in
	                        ' AX
	   inregs.bx = &H200    ' 2 representing green is put in BH
	   CALL Interrupt(&H10, inregs, outregs)   ' A green border is produced
