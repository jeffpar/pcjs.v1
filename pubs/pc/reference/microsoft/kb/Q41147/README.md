---
layout: page
title: "Q41147: Getting Help on NULL CONST String Hangs QB 4.50 Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q41147/
---

## Q41147: Getting Help on NULL CONST String Hangs QB 4.50 Editor

	Article: Q41147
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890206-5 buglist4.50
	Last Modified: 17-FEB-1989
	
	In the QuickBASIC Version 4.50 QB.EXE editor, getting Help on a CONST
	string, which is assigned to a NULL string, hangs the computer.
	
	Microsoft has confirmed this to be a problem in Version 4.50. We are
	researching this problem and will post new information as it becomes
	available.
	
	To demonstrate the problem, run QB.EXE Version 4.50 and type in the
	following:
	
	   CONST A$ = ""
	
	Position the cursor on anything in the line except CONST and press the
	F1 key to invoke the QB Advisor Help. The computer now hangs and must
	be restarted with CTRL+ALT+DELETE.
