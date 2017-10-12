---
layout: page
title: "Q69475: How to Increase the Size of the PWB Build Status Box Under DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q69475/
---

	Article: Q69475
	Product: Microsoft C
	Version(s): 1.00 1.10
	Operating System: MS-DOS
	Flags: ENDUSER | window dialog
	Last Modified: 22-FEB-1991
	
	In the DOS version of the Microsoft Programmer's WorkBench (PWB)
	versions 1.00 and 1.10, the status box displayed in the center of the
	screen during a compile can be made larger by increasing the length of
	the command being executed.
	
	When Build or Rebuild All is selected from the Make menu in PWB, a
	build status box appears on the screen showing the command currently
	being executed. Unfortunately, this box is often too small and the
	current command being displayed gets truncated. One way to increase
	the size of this box is to increase the length of the NMAKE command
	line.
	
	To increase the length of the NMAKE command line, add the following
	text (without the quotation marks) to the NMAKE Options dialog box,
	which can be selected from the Options menu:
	
	   "                                                /NOLOGO"
	
	Be sure to include the spaces when you type this line. Then, when you
	select Build or Rebuild All from the Make menu, the build status box
	will be almost as wide as the screen, allowing most of the subsequent
	commands to fit completely into the box.
	
	If you use the PWB "compile" command, or choose the Compile File
	option from the Make menu, the build status box behaves similarly --
	the longer the command to be executed command, the larger the box will
	be.
	
	
	
	
	
	
	Microsoft CodeView
	=============================================================================
