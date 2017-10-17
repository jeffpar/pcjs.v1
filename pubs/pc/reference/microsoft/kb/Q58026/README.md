---
layout: page
title: "Q58026: No QB Error Message If File Listed in .MAK File Does Not Exist"
permalink: /pubs/pc/reference/microsoft/kb/Q58026/
---

## Q58026: No QB Error Message If File Listed in .MAK File Does Not Exist

	Article: Q58026
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900119-50 B_BasicCom
	Last Modified: 31-JAN-1990
	
	When a program that has a corresponding .MAK file is loaded into the
	QuickBASIC (QB.EXE) or QuickBASIC Extended (QBX.EXE) environment, all
	files listed in the .MAK file are in turn loaded into the environment.
	If a file listed in the .MAK file does not exist, an empty module is
	created with the name of that nonexistent file. There is no message
	generated informing you that a file did not exist.
	
	This is not a problem with the QuickBASIC environment. QuickBASIC
	reacts to nonexistent files in a .MAK file the same way it reacts if
	the environment is invoked using a nonexistent filename as a command
	line argument, for example, QB myprog. In this case, "myprog" will be
	created.
	
	This information applies to the QB.EXE environment in QuickBASIC
	Versions 4.00, 4.00b, and 4.50, to the QB.EXE environment included
	with Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS, and
	to the QBX.EXE environment in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	The QuickBASIC environment automatically creates a .MAK file for
	multiple-module (multiply-loaded-source file) programs when you choose
	the Save All command from the File menu.
