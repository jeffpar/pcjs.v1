---
layout: page
title: "Q49889: PUTting a CONST to a RANDOM File Hangs QB.EXE 4.50 Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q49889/
---

## Q49889: PUTting a CONST to a RANDOM File Hangs QB.EXE 4.50 Editor

	Article: Q49889
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 B_BasicCom
	Last Modified: 27-FEB-1990
	
	Using a CONSTant as the third argument of a PUT statement when writing
	to a RANDOM file hangs QB.EXE at run time and during the Make EXE File
	command, leaving the word "Binding..." in the lower-left corner of the
	screen. This problem occurs only within the QuickBASIC Version 4.50
	editor.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	4.50 for MS-DOS. We are researching this problem and will post new
	information here as it becomes available.
	
	When compiled outside the environment, BC.EXE correctly flags the
	error with the message "Variable required," displaying the PUT
	statement with a caret pointing to the offending CONSTant. The third
	argument of the PUT statement requires a variable, and CONSTants are
	not allowed.
	
	This problem does not occur in the QBX.EXE environment of Microsoft
	BASIC Professional Development System (PDS) Version 7.00 for MS-DOS
	and MS OS/2. Within QBX.EXE, the error "Variable required" is flagged
	and the offending constant is highlighted.
	
	Code Example
	------------
	
	The QuickBASIC editor hangs, displaying the message "Binding..." in
	the lower-left corner of the screen, when you run (by pressing
	SHIFT+F5) or compile (by using the Make EXE File command on the Run
	menu) the following program:
	
	   CONST a = 1
	   OPEN "test.dat" FOR RANDOM AS #1
	   PUT #1, 1, a
