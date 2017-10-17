---
layout: page
title: "Q50219: Reasons for &quot;File Not Found&quot; Error Using &#36;INCLUDE Metacommand"
permalink: /pubs/pc/reference/microsoft/kb/Q50219/
---

## Q50219: Reasons for &quot;File Not Found&quot; Error Using &#36;INCLUDE Metacommand

	Article: Q50219
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 7-FEB-1990
	
	The text file specified in a $INCLUDE metacommand must exist on disk,
	or the message "File not found" appears.
	
	You get the "File not found" message unless you do one of the following:
	
	1. Qualify the filename with an explicit directory path in the
	   $INCLUDE statement.
	
	2. If an unqualified filename is specified in the $INCLUDE statement,
	   the file must be in the current directory or the root directory. In
	   addition, QuickBASIC Version 4.50 and Microsoft BASIC Professional
	   Development System (PDS) Version 7.00 are enhanced to recognize the
	   DOS INCLUDE environment variable (for both QB.EXE, QBX.EXE and
	   BC.EXE) for unqualified $INCLUDE filenames. Both of these versions
	   also let you set additional $INCLUDE file paths in the Options
	   menu.
	
	   The following products DON'T recognize the DOS INCLUDE environment
	   variable to search for unqualified $INCLUDE filenames: Microsoft
	   QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00, 4.00, and
	   4.00b for MS-DOS, and Microsoft BASIC Compiler Versions 6.00 and
	   6.00b for MS-DOS and MS OS/2.
	
	If the file isn't found, a "File not Found" error is flagged on the
	REM in the REM $INCLUDE: 'filename' statement (instead of on the
	filename in the single quotation marks in QuickBASIC 4.00, 4.00b, and
	4.50 and in QuickBASIC extended shipped with Microsoft BASIC PDS
	Version 7.00).
	
	To create an include file while in the QuickBASIC QB.EXE 4.00, 4.00b,
	or 4.50 editor, or the QBX.EXE editor, use the Create File command on
	the File menu and select Include. Then when you try to execute the
	program in the editor, it will inform you to save the Include file
	before execution can occur, preventing the "File not Found" error.
