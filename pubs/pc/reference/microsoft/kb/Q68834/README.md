---
layout: page
title: "Q68834: When Compiling with /P, Errors Are Directed to STDERR"
permalink: /pubs/pc/reference/microsoft/kb/Q68834/
---

## Q68834: When Compiling with /P, Errors Are Directed to STDERR

	Article: Q68834
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 31-JAN-1991
	
	The Microsoft C compiler can create a preprocessor listing by compiling
	with the /P option. When this option is used and when output is
	redirected to a file, preprocessor error messages that are generated
	will go to the screen and not to that file because these errors are
	directed to STDERR, rather than STDOUT.
	
	To resolve the problem, redirect STDERR to the file where you want the
	error messages to go. This can been done in DOS by using a utility,
	such as ERROUT.EXE, which comes with C 5.10. Under OS/2, the STDERR
	output can be redirected to a file by specifying the handle for
	STDERR, which is 2, followed by ">" and then the name of the file. The
	examples below demonstrate the syntax.
	
	For DOS using ERROUT.EXE, use the following:
	
	   ERROUT /f err.txt cl /P example.c
	
	For OS/2, use the following:
	
	   CL /P 2>outfile.txt example.c
	
	Microsoft has confirmed this to be a problem with C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
