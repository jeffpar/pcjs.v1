---
layout: page
title: "Q38308: Spawn Will Not Pass Redirection to Child"
permalink: /pubs/pc/reference/microsoft/kb/Q38308/
---

	Article: Q38308
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S880925-1
	Last Modified: 12-DEC-1988
	
	Question:
	
	When using the program below to spawn sort.exe, it seems that "sort"
	starts, but then sits there doing nothing. The behavior is similar to
	starting "sort" from the DOS prompt without any arguments.
	
	The following program demonstrates the problem:
	
	#include <stdio.h>
	#include <process.h>
	main()
	{
	        char *args[6] ;
	        args[0] = "sort" ;
	        args[1] = "<" ;
	        args[2] = "infile.dat" ; /* exists */
	        args[3] = ">" ;         /* direct output to a disk file */
	        args[4] = "outfile.dat" ;
	        args[5] = NULL ;
	
	        spawnvp (P_WAIT, "sort.exe", args) ;
	}
	
	Why doesn't this work correctly? What can I do about it?
	
	Response:
	
	Because COMMAND.COM, and NOT the EXEC loader, handles indirection,
	this is the expected behavior. Child processes inherit the handles of
	their parents; therefore, to redirect the input and output of the
	child you first change the definitions of STDIN and STDOUT in the
	parent process. The proper way to redirect input for a filter is
	described starting on Page 441 of the "MS-DOS Encyclopedia," along with
	a complete MASM example. Note: the dup and dup2 functions in the C
	Version 5.10 run-time library are the same as the INT 21h functions 45h
	and 46h, respectively.
	
	There also are partial examples of this technique on Page 230 of the
	"Microsoft C Version 5.10 Run-Time Library Reference" manual and on
	Page 353 of "Advanced MS-DOS Programming" (by Duncan, published by
	Microsoft Press).
	
	It is possible to use freopen() to redefine STDIN and STDOUT; however,
	doing so loses any redirection that may have been performed on the
	parent process.
	
	The easiest workaround is to use the system function to spawn a copy
	of COMMAND.COM that runs SORT.EXE, as follows:
	
	   system("sort.exe <infile.dat >outfile.dat");
