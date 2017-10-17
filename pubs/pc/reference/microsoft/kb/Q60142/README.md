---
layout: page
title: "Q60142: Configuring M.EXE to Epsilon Format"
permalink: /pubs/pc/reference/microsoft/kb/Q60142/
---

## Q60142: Configuring M.EXE to Epsilon Format

	Article: Q60142
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900322-11
	Last Modified: 11-JUL-1990
	
	This article describes the correct way to set up the Microsoft M
	Editor (M.EXE) to simulate the Epsilon editor environment. The Epsilon
	editor is a text editing utility published by Lugaru Software, which
	emulates EMACS-type editors running on larger computers.
	
	This article applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00.
	
	In the BIN directory that Setup installs on the hard drive, there is a
	file called EPSILON.INI. This file contains the keystroke assignments
	necessary to reconfigure the M.EXE Editor. To get this field
	recognized, do one of the following:
	
	1. Rename the file to TOOLS.INI.
	
	2. Copy this file into your current TOOLS.INI file.
	
	Then, make sure that your DOS INIT variable is set to the directory
	that your TOOLS.INI file is located in; for example:
	
	   SET INIT=D:\BC7\BIN
	
	At the top of the EPSILON.INI file is the clause [M MEP]. This clause
	tells the computer that the following commands should be issued when a
	program called M.EXE or a program called MEP.EXE is executed. If you
	have changed the name of your M Editor, this label should be changed
	to include the current name of the editor.
