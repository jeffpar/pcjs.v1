---
layout: page
title: "Q44287: Problem Deleting a Line that Is a Breakpoint in QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q44287/
---

## Q44287: Problem Deleting a Line that Is a Breakpoint in QuickC

	Article: Q44287
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 31-MAY-1989
	
	Consider the following sequence of events:
	
	1. You are debugging a program named FILE.C in the QuickC environment.
	
	2. A line is marked as a breakpoint (by pressing F9 or using the
	   Debug.Breakpoint dialog box).
	
	3. That line is deleted (by pressing CTRL+Y for example).
	
	4. The program is rebuilt and re-executed (by pressing F5).
	
	   At this point, the following pop-up is displayed:
	
	      Cannot set breakpoint
	             file.c:0
	
	To get past this point, you must remove this mysterious breakpoint
	through the dialog box selected with the Debug.Breakpoint menu option.
	Using this dialog box, remove all breakpoints with a line of zero. The
	program may then be executed successfully.
	
	To avoid this problem altogether, do not delete a line that is a
	breakpoint. Instead, toggle the breakpoint off by pressing F9 on the
	breakpoint prior to deleting that line.
	
	This problem is caused because when a breakpoint line is deleted, the
	associated breakpoint entry is not deleted. Rather, its line number is
	set to zero. There is no line zero that the debugger can set a
	breakpoint on; thus, the error pop-up occurs.
