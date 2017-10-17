---
layout: page
title: "Q50470: .BAS in Set Paths for Include Files in QB 4.50 Options Menu"
permalink: /pubs/pc/reference/microsoft/kb/Q50470/
---

## Q50470: .BAS in Set Paths for Include Files in QB 4.50 Options Menu

	Article: Q50470
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891026-52
	Last Modified: 12-DEC-1989
	
	In the QB.EXE editor in Microsoft QuickBASIC Version 4.50, and the
	QBX.EXE editor in Microsoft BASIC PDS 7.00, there is a box for
	"Include Files (.BI, .BAS):" in the Set Paths command on the Options
	menu. The ".BAS" and ".BI" in the parentheses are only examples of the
	three-character name extensions possible for Include files. The (.BI,
	.BAS) box refers ONLY to the path to find Include files and does NOT
	relate to any other feature.
	
	All filename extensions will be searched for in the specified
	directory, not just Include files with the extensions .BI and .BAS.
	
	This information applies to QuickBASIC 4.50 and QBX.EXE for BASIC PDS
	7.00. (Versions of the QB.EXE editor earlier than 4.50 don't have a
	Set Paths command or an Options menu.)
	
	The "Include Files (.BI, .BAS):" option refers to which directory will
	be searched for Include files at compile time when the REM $INCLUDE
	metacommand is used in the source code.
	
	If no explicit path qualifies the filename in the REM $INCLUDE:
	'filename' statement, QuickBASIC will search for the file in the
	following directories in exactly the following order:
	
	1. The current directory
	
	2. The directory specified by the "SET INCLUDE=" environment variable
	   (set with the MS-DOS SET command in the AUTOEXEC.BAT file.)
	
	3. The directory specified in the "Include Files (.BI, .BAS):" box in
	   the Set Paths command of the Options menu.
	
	In the following example, the file BOB.INC will be searched for in the
	current directory, the directory specified by "SET INCLUDE=", then in
	the Set Paths directory:
	
	   REM $INCLUDE: 'BOB.INC'
