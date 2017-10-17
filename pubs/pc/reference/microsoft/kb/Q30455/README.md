---
layout: page
title: "Q30455: Why QB/QBX Editor Options Might Revert to Default; QB.INI File"
permalink: /pubs/pc/reference/microsoft/kb/Q30455/
---

## Q30455: Why QB/QBX Editor Options Might Revert to Default; QB.INI File

	Article: Q30455
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 13-AUG-1990
	
	In the QB.EXE environment of QuickBASIC version 4.50 or in the QBX.EXE
	environment of Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10, the settings in the Options menu (ALT+O)
	(Display, Set Paths, Right Mouse, Syntax Checking, Full Menus) are
	automatically saved to the QB.INI or QBX.INI file whenever the options
	are changed.
	
	Similarly, in the QB.EXE environment of QuickBASIC versions 4.00 and
	4.00b and of Microsoft BASIC Compiler versions 6.00 and 6.00b, the
	color, display attributes, tab, and scroll bar options in the View
	menu's Options command (ALT+V+O) are automatically saved to the QB.INI
	file whenever the options are changed.
	
	If the QB.EXE (or QBX.EXE) environment does not find a QB.INI (or
	QBX.INI) file in the current working directory or in the DOS PATH, the
	environment reverts to the default options. If you then change the
	default options, QB.EXE (or QBX.EXE) creates a QB.INI (or QBX.INI)
	file in the current directory (since a QB.INI or QBX.INI doesn't
	already exist along the PATH). If the name of your current directory
	is not displayed at the DOS prompt, typing CHDIR at the DOS prompt
	displays the name of your current working directory.
	
	To keep the QB.EXE (or QBX.EXE) options consistent, you should keep
	one QB.INI (or QBX.INI) file in your DOS PATH; this QB.INI (or
	QBX.INI) file will be updated each time you change the options.
	
	The following steps show that if QB.EXE (or QBX.EXE) does not find a
	QB.INI (or QBX.INI) file in the current working directory or in the
	DOS PATH, it creates a new QB.INI (or QBX.INI) file in the current
	directory:
	
	1. Type PATH in MS-DOS to see what directories lie in the PATH.
	
	2. Run QB.EXE (or QBX.EXE), and change one or more editor options.
	
	3. Exit QB.EXE (or QBX.EXE).
	
	4. Change to a different directory that is not in your PATH.
	
	5. Run QB.EXE (or QBX.EXE), and note that the environment reverts
	   to the default options and does not reflect the option(s) you
	   specified in Step 2.
	
	6. If you now change one or more editor options, a new QB.INI (or
	   QBX.INI) file is created in the current directory.
	
	In Step 5 above, QuickBASIC reverts to its default options. This could
	make you incorrectly conclude that QuickBASIC forgot the changes that
	you made (if any) to the options.
	
	If QB.EXE finds QB.INI (or QBX.EXE finds QBX.INI) in the DOS PATH or
	in the current directory, the options are updated in that copy of
	QB.INI (or QBX.INI). To make the environment always use the same
	option preferences, use only one copy of QB.INI (or QBX.INI) in your
	DOS PATH.
	
	The DOS PATH is set with the PATH command. For example, the following
	DOS command sets your search path to the directory called QB.450 on
	Drive C:
	
	   PATH C:\QB.450
