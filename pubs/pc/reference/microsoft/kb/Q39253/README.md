---
layout: page
title: "Q39253: QB 4.50 Debugger Reference Bar Displays until STOP or END"
permalink: /pubs/pc/reference/microsoft/kb/Q39253/
---

## Q39253: QB 4.50 Debugger Reference Bar Displays until STOP or END

	Article: Q39253
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881208-23
	Last Modified: 14-DEC-1988
	
	In the QB.EXE Version 4.50 environment, when a program is run using
	any of the debug features, the reference bar is replaced by a debug
	reference bar listing the debugging keys and their actions. The normal
	reference bar is as follows:
	
	   <SHIFT+F1=Help> <F6= > <F2=Subs> <F5=Run> <F8=Step>
	
	The debug mode reference bar is as follows:
	
	   <SHIFT+F1=Help> <F5=Continue> <F9=Toggle Bkpt> <F8=Step>
	
	The normal reference bar is not replaced until the program ends by
	reaching an END or STOP statement.
	
	To restore the normal reference bar, go to the immediate window and
	type STOP and press ENTER. This will terminate the program and restore
	the reference bar.
