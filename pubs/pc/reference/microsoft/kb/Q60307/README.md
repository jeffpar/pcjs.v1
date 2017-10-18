---
layout: page
title: "Q60307: MASM 5.10 Setup Shows Blank Display on LCD/Monochrome Monitor"
permalink: /pubs/pc/reference/microsoft/kb/Q60307/
---

## Q60307: MASM 5.10 Setup Shows Blank Display on LCD/Monochrome Monitor

	Article: Q60307
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 13-APR-1990
	
	When running the RUNME setup program for Microsoft Macro Assembler
	Version 5.10, the setup program changes the screen colors. On LCD
	displays and some monochrome displays, the colors that the setup
	program changes to are not visible. Therefore, when the setup program
	is run, you can't see anything on the screen. The program is running
	properly, but the text color is the same as the background color.
	
	On the MS OS/2 and MS-DOS Macro Assemblers setup disk, there is a file
	that holds all of the commands that the setup program RUNME uses. The
	file is called SETUP.SUS and the first line in that file is as
	follows:
	
	   CLS a: 30 "Microsoft(R) MASM 5.10 Setup"
	
	To have the setup program use the standard colors of the operating
	system, remove the "a: 30" from the file and rerun RUNME. This will
	correct the problem.
	
	The new line should be as follows:
	
	   CLS "Microsoft(R) MASM 5.10 Setup"
