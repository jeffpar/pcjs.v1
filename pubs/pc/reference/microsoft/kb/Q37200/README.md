---
layout: page
title: "Q37200: Redirection with spawn() or exec()"
permalink: /pubs/pc/reference/microsoft/kb/Q37200/
---

	Article: Q37200
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S880925-1 s_quickc
	Last Modified: 18-NOV-1988
	
	Question:
	
	There is a problem when you use spawnvp or spawnlp to invoke the
	SORT.EXE that usually comes with DOS. When you run the program, it
	seems that SORT.EXE starts, but then it does nothing. The behavior is
	similar to starting SORT.EXE from the DOS prompt without any arguments.
	
	How do I do any redirection with spawn() or exec()?
	
	Response::
	
	Use the system() function. For example, you can make a run SORT.EXE
	by executing the following:
	
	   system("SORT <INFILE >OUTFILE");
	
	This process has the minor disadvantage of taking up extra memory for
	another copy of COMMAND.COM. This behavior shouldn't be a problem
	unless you're short on available memory. If you do not have very much
	memory, the following information may help.
	
	Because COMMAND.COM, and NOT the EXEC loader, handles redirection,
	this behavior is expected. Child processes inherit the handles of
	their parents; therefore, to redirect the input and output of the
	child, change the definitions of STDIN and STDOUT in the
	parent process. The proper way to redirect input for a filter is
	described starting on Page 441 of the "MS-DOS Encyclopedia," along with
	a complete MASM example.
	
	Note: the dup and dup2 functions in the C Version 5.10 run-time
	library are the same as the INT 21h functions 45h and 46h,
	respectively.
	
	There also are partial examples of this technique on Page 230 of the
	"Microsoft C 5.1 Run-Time Library Reference" manual and on page 353 of
	"Advanced MS-DOS Programming" (by Duncan, published by Microsoft
	Press).
	
	It is possible to use freopen() to redefine STDIN and STDOUT; however,
	doing so causes any redirection that may have been performed on the
	parent process to be lost.
