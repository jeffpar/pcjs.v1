---
layout: page
title: "Q44311: Importing Pictures from Other Programs into BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q44311/
---

## Q44311: Importing Pictures from Other Programs into BASIC

	Article: Q44311
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 20-DEC-1989
	
	Screen images displayed in some painting and picture-viewing programs
	can be imported to QuickBASIC. To do this, you must be able to exit
	program that displays the picture, and leave the viewed picture on the
	screen. Most programs that can terminate while leaving the screen
	intact can be used, as described below.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50; Microsoft GW-BASIC Interpreter Versions
	3.20, 3.22, and 3.23; Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and MS OS/2; and to Microsoft BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2.
	
	1. The BASIC program must first activate the screen mode that the
	   picture will be displayed in. This is done with a SCREEN statement.
	
	2. The BASIC program should then SHELL out to the picture viewing
	   program, which should display the picture and then exit, leaving
	   the picture displayed (check the picture program's manual for the
	   proper procedure to do this).
	
	3. When the picture-viewing program has terminated, control is passed
	   back to BASIC. The BASIC program can then use the BSAVE statement
	   to save the screen image to disk.
	
	Note: There are several graphics programs available on CompuServe and
	GE GEnie (General Electric Network for Information Exchange) that are
	suitable for this use.
