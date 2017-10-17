---
layout: page
title: "Q35145: &quot;String Space Corrupt&quot; If Drive Door Open, &amp; QB.INI Not Found"
permalink: /pubs/pc/reference/microsoft/kb/Q35145/
---

## Q35145: &quot;String Space Corrupt&quot; If Drive Door Open, &amp; QB.INI Not Found

	Article: Q35145
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b B_BasicCom fixlist4.50
	Last Modified: 8-DEC-1989
	
	When all of the following conditions are true, invoking the QuickBASIC
	editor from the DOS command line will give a "String Space Corrupt"
	error and hang your machine:
	
	1. The Drive A or Drive B door is open.
	
	2. A:\ or B:\ is in the DOS search path, for example:
	
	      PATH=A:\;B:\
	
	3. The QB.INI file is not present in the current directory or in any
	   directory appearing in the search path before A:\ or B:\.
	
	Microsoft has confirmed this to be a problem in the QB.EXE editor that
	comes with Microsoft QuickBASIC Compiler Versions 4.00 and 4.00b and
	with Microsoft BASIC Compiler Versions 6.00 (buglist6.00) and 6.00b
	(buglist6.00b) for MS-DOS and MS OS/2. This problem was corrected in
	QuickBASIC Version 4.50 and in QBX.EXE of Microsoft BASIC Compiler
	Version 7.00 (fixlist7.00).
	
	QB.INI is a file that automatically is created when the settings in
	the QB.EXE editor are changed with the Options command from the View
	menu.
	
	The QuickBASIC environment automatically looks for the QB.INI file
	immediately upon start-up. If the file is not in the current
	directory, QuickBASIC uses the search path in its attempt to find the
	file.
	
	If a floppy drive (Drive A or Drive B) is in the DOS search path and
	the drive door is open, QB.EXE fails to stop the hardware error, and a
	"String Space Corrupt" error occurs. A warm boot (CTRL+ALT+DEL)
	usually must be used to restart the computer.
	
	The following are three ways to work around the problem:
	
	1. Remove the floppy specification in the search path.
	
	2. Make sure there is a disk in the floppy drive and that the door is
	   closed.
	
	3. Create a QB.INI file in your QuickBASIC directory.
	
	In QuickBASIC Versions 3.00 and earlier, if the drive door is left
	open, the following DOS error message is correctly generated:
	
	   "Not Ready Error Reading Drive A:
	   Abort, Retry, Ignore, Fail?"
