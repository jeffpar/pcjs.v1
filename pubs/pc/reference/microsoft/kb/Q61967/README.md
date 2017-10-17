---
layout: page
title: "Q61967: Using /help Option with RM.EXE Displays EXP.EXE Online Help"
permalink: /pubs/pc/reference/microsoft/kb/Q61967/
---

## Q61967: Using /help Option with RM.EXE Displays EXP.EXE Online Help

	Article: Q61967
	Version(s): 1.01   | 1.01
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_rm s_pwb s_editor docerr
	Last Modified: 17-DEC-1990
	
	The utility program RM.EXE version 1.01 displays the wrong help screen
	when invoked with the /help option. The /help parameter is designed to
	invoke the Quick Help (QH) utility in order to display the online help
	for RM.EXE. Because the wrong utility name was written into the RM.EXE
	file, the help screen displayed for RM with /help is the help
	information for the EXP utility.
	
	This error is due to a problem in the RM.EXE file, rather than being a
	problem in the help files; thus there is no easy way to correct this
	problem. To access the correct help information for RM, one of the
	following methods may be used:
	
	1. Invoke Quick Help directly. Use RM as the parameter to indicate RM
	   as the item on which to find help (for example, type QH RM at the
	   DOS or OS/2 prompt).
	
	2. Invoke RM with the /help option (for example, type RM /help at the
	   prompt) and when the EXP help screen appears, page down to the
	   bottom where there is a link labeled "RM Command." Select this link
	   and the RM help screen will be displayed.
	
	3. Help on RM can be accessed from within the Programmer's WorkBench
	   (PWB) by selecting "Miscellaneous" on the main Help Contents screen
	   (in the box titled Microsoft Utilities), and then selecting "RM
	   Command" from the submenu.
