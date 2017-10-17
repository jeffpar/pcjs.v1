---
layout: page
title: "Q48000: CVP Restart Command (Dialog Version) Doesn't Properly Set argc"
permalink: /pubs/pc/reference/microsoft/kb/Q48000/
---

## Q48000: CVP Restart Command (Dialog Version) Doesn't Properly Set argc

	Article: Q48000
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist2.20 buglist2.30
	Last Modified: 28-AUG-1989
	
	When using the dialog version of the Restart command, you can restart
	your program with command-line arguments; however, under CodeView
	Protect (CVP) Versions 2.20 and 2.30, argc does not get properly set.
	
	The Dialog Restart command is often used to restart a program with
	command line arguments. For example, you could use the following:
	
	   L arg1 arg2 arg3
	
	This example restarts the current executable file, retaining any
	breakpoints, watchpoints, and tracepoints, with arg1, arg2, and arg3
	loaded into argv[1], argv[2], and argv[3], respectively. Argv[0] is
	always set to the name of the current executable file. Argc, at this
	point, should be set to four. The problem presents itself here; argc
	either remains unchanged from the value it was initially set to when
	CodeView was started, or is decremented by one. If, for example,
	CodeView is started with two command-line arguments (argc would then
	be set to three) and then executed, the previous example argc (which
	should then set argc to four) would remain unchanged. When using the
	Dialog Restart command and specifying fewer arguments than were
	specified at start up, argc sometimes is decremented by one.
	
	Microsoft has confirmed this to be a problem with CodeView Versions
	2.20 and 2.30. We are researching this problem and will post new
	information as it becomes available.
