---
layout: page
title: "Q39179: Using a Debugging Terminal with CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q39179/
---

## Q39179: Using a Debugging Terminal with CodeView

	Article: Q39179
	Version(s): 2.20
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	It is possible to use either a dumb terminal or another machine (PC or
	Macintosh, running a communications package at 9600 baud) as a
	debugging terminal for CodeView. To take advantage of this option, do
	the following:
	
	1. Connect the second terminal to the com port (COM1 or COM2).
	
	2. Initialize the communications package to set up the
	   second machine as a dumb terminal. Set the baud rate at
	   9600.
	
	3. Start CodeView in either window or sequential mode.
	
	4. Redirect either the output ( >COM1 ) or both input and output
	   ( =COM1 ) to the second terminal.
	
	   If you redirect just the output to the second terminal, you will
	   see the debugging output on the second terminal, and program output
	   on the primary terminal. If you redirect input and output, you will
	   also be able input program information (responses to prompts,
	   input from the keyboard, etc.) on the primary terminal, and input
	   CodeView information on the secondary terminal.
	
	5. Set your options and run the program.
