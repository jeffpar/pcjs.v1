---
layout: page
title: "Q63146: Expression in Brackets &quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q63146/
---

## Q63146: Expression in Brackets &quot;

	Article: Q63146
	Version(s): 1.00 1.01 1.10 1.11 | 1.01 1.10 1.11
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER |
	Last Modified: 27-JUN-1990
	
	When using the !IF directive in conjunction with the square brackets
	"[]" in the NMAKE utility, all expressions inside square brackets will
	be evaluated when NMAKE initially reads the makefile, before any
	commands are executed (and before dependency blocks are evaluated).
	
	The square brackets are used within NMAKE to denote program
	invocations in expressions within an !IF directive, as documented in
	Section 6.3.5, Pages 120-121 of the "Advanced Programming Techniques"
	manual shipped with the Microsoft C compiler version 6.00.
	
	By design, all the program invocations are executed when NMAKE starts
	up, regardless of whether or not they are contained in a dependency
	block. The return values of these program invocations can then be used
	within the !IF expression to evaluate the expression.
	
	The following makefile displays this behavior:
	
	   test.exe: test.c
	   !IF ( [check /f] < 3 )
	      cl test.c
	   !ENDIF
	
	In this example, the program "check /f" will be executed each time the
	makefile is called, regardless of whether or not the file TEST.EXE is
	up to date.
