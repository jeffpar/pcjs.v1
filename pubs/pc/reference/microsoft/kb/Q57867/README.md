---
layout: page
title: "Q57867: system() Call May Cause CodeView to Terminate Process"
permalink: /pubs/pc/reference/microsoft/kb/Q57867/
---

## Q57867: system() Call May Cause CodeView to Terminate Process

	Article: Q57867
	Version(s): 2.20 2.30
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.20 buglist2.30
	Last Modified: 22-JAN-1990
	
	Using real-mode CodeView to trace over the system() run-time function
	will cause the debugger to terminate the parent process upon return
	from the child process in certain situations where the child does a
	multiple directory-level traversal.
	
	Instead of tracing, use the "Go" Command (F5) to run past the system()
	call. This procedure allows the program to run to completion.
	
	The program below demonstrates this problem, but it requires that
	TREE.COM be somewhere in the path. Compile the code with the /Zi and
	/Od options and use CodeView to trace into the program, using F8.
	After TREE.COM executes, CodeView will display the "Program terminated
	normally" message, preventing the last printf() from being executed.
	
	Microsoft has confirmed this to be a problem with CodeView Versions
	2.20 and 2.30. We are researching this problem and will post new
	information here as it becomes available.
	
	Code Example
	------------
	
	#include <process.h>
	#include <stdio.h>
	
	void main (void)
	{
	        printf ("This is the beginning of the program\n");
	        printf ("Calling TREE.COM\n");
	        system ("tree");
	
	        /* This line will never be executed */
	        printf ("Back from spawn\n");
	}
