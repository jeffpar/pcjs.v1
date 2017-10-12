---
layout: page
title: "Q47254: SideKick 1.56x Causes Problems with Keyboard Input"
permalink: /pubs/pc/reference/microsoft/kb/Q47254/
---

	Article: Q47254
	Product: Microsoft C
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM
	Last Modified: 10-OCT-1989
	
	Borland's SideKick Version 1.56x has been found to cause problems
	with keyboard input in QuickC and QuickAssembler.
	
	The following routines have been observed to show the problem with
	SideKick loaded: gets, getch, getche, cgets, cscanf, scanf, and kbhit.
	
	In all cases, when a program requiring keyboard input is run with one
	of these routines, input does not occur as expected. The first 15 keys
	pressed during a call to one of these run-time library functions do
	not appear on the run screen. The 16th and all following keys are
	received by the input function/procedure. Upon termination of the
	program being run under the QuickC environment, the 15 keys pressed
	during run time appear on the QuickC editing screen.
	
	To alleviate this problem, either do not load SideKick after booting,
	or use the Hot-Key combination to remove it from memory. The key
	combination should be used at the DOS command prompt, as follows:
	
	   CTRL+ALT (To call up the main selection window), then
	   CTRL+HOME+END
