---
layout: page
title: "Q69142: Reinitializing After Changing Editor Settings Is Very Slow"
permalink: /pubs/pc/reference/microsoft/kb/Q69142/
---

	Article: Q69142
	Product: Microsoft C
	Version(s): 1.10   | 1.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 11-FEB-1991
	
	The current editor settings in the Programmer's WorkBench (PWB) may be
	changed by choosing Editor Settings from the Options menu, making a
	change to the <assign> pseudofile, and then saving that file. If
	SHIFT+F8 (initialize) is pressed while the <assign> pseudofile is
	still displayed, PWB may appear as though it is hung; it is actually
	reinitializing each statement of the editor settings (<assign>)
	pseudofile.
	
	The following steps will reproduce this behavior:
	
	1. Enter PWB and select the Options menu.
	
	2. Choose the Editor Settings menu.
	
	3. Make a change in the <assign> pseudofile and then save it.
	
	4. Press the "initialize" keystroke combination (SHIFT+F8) and a popup
	   box will appear stating "reinitializing...". The reinitialization
	   is actually taking place but it is very slow because PWB is
	   rebuilding the <assign> pseudofile for each entry in your TOOLS.INI
	   file.
	
	This behavior does not occur in PWB version 1.00. Version 1.10
	includes a change to the earlier version; you can see a new assignment
	(made via "arg textarg <assign>") immediately updated if you are
	viewing the <assign> pseudofile.
	
	This is expected behavior because the <assign> pseudofile is meant to
	show the settings that were in effect at the time the file was
	displayed. It is not recommended that it be dynamically updated except
	via the mechanism of actually editing the file. If you changed a
	setting via "arg textarg assign" (ALT+A textarg ALT+=), a better way
	to view your new setting(s) is by using "refresh" (SHIFT+F7), or by
	switching away and back again via "setfile" (F2).
