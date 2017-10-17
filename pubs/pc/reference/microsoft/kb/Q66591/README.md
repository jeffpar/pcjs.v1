---
layout: page
title: "Q66591: ALT+240 Hangs QBX.EXE or QB.EXE with Phoenix BIOS"
permalink: /pubs/pc/reference/microsoft/kb/Q66591/
---

## Q66591: ALT+240 Hangs QBX.EXE or QB.EXE with Phoenix BIOS

	Article: Q66591
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901025-47 B_QuickBas
	Last Modified: 12-NOV-1990
	
	The extended ASCII characters can be typed into a BASIC program using
	the combination of the ALT key plus the three digits that correspond
	to the character. However, in Microsoft QuickBASIC version 4.50 and
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10, typing ALT+240 can hang the QB.EXE and QBX.EXE environments
	temporarily. This problem has been reproduced on a Wyse 386 with a
	Phoenix BIOS version 3.53. Pressing CTRL+BREAK will get you out of the
	hang.
	
	To work around the problem, use the PRINT CHR$(240) statement instead.
	
	This problem also occurs in a WYSE 286, running Phoenix 286 ROM BIOS
	version 2.72, and has been reported with a clone computer running
	Phoenix ROM BIOS version 3.07.
	
	For a related article concerning how to enter extended ASCII and
	control characters into QB.EXE and QBX.EXE, search in this Knowledge
	Base for the following words:
	
	   extended and ASCII and ALT and 240 and 255
