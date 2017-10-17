---
layout: page
title: "Q43508: CodeView: View Command Fails with Underscore in Filenames"
permalink: /pubs/pc/reference/microsoft/kb/Q43508/
---

## Q43508: CodeView: View Command Fails with Underscore in Filenames

	Article: Q43508
	Version(s): 2.20   | 2.20
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist2.20
	Last Modified: 3-MAY-1989
	
	Assume that two source files, MAINPROG.C and FILE_NAM.C, have been
	compiled with CodeView information. The main function in MAINPROG.C
	calls a function in FILE_NAM.C.
	
	When the following command is executed in CodeView, CodeView responds
	with "syntax error":
	
	   V.FILE_NAM.C
	
	When FILE_NAM.C is renamed and recompiled as FILENAM.C, the following
	command works properly, and the source code in FILENAM.C is displayed:
	
	   V.FILENAM.C
	
	Attempts to open a file with an underscore character will work
	correctly through the "Open" menu in CodeView, but will fail with the
	View command.
	
	Microsoft has confirmed this to be a problem in Version 2.20. We are
	researching this problem and will post new information as it becomes
	available.
