---
layout: page
title: "Q11867: C_FILE_INFO in Environment of Child Process"
permalink: /pubs/pc/reference/microsoft/kb/Q11867/
---

## Q11867: C_FILE_INFO in Environment of Child Process

	Article: Q11867
	Version(s): 3.00 4.00 5.00
	Operating System: MS-DOS
	Flags: ENDUSER | TAR55563
	Last Modified: 25-AUG-1989
	
	When you shell from a C program (spawn a process), the environment
	will appear to become corrupted with a ;C_FILE_INFO (or _C_FILE_INFO)
	string. (Version 5.10 uses an underscore rather than a semicolon.)
	
	When a process is spawned, the C run time passes information about
	open files to the child by inserting the identifier ";C_FILE_INFO" (or
	"_C_FILE_INFO" -- no quotation marks in either case), followed by up
	to 20 bytes, into the environment. During start-up, the C run time
	reads the identifier, uses the information passed, and removes it from
	the environment.
	
	System() is implemented by spawning COMMAND.COM, and since COMMAND.COM
	is not a C program, ";C_FILE_INFO" (or "_C_FILE_INFO") gets left in
	the environment.
	
	This behavior is harmless. The leading ";" (or "_") prevents any
	collision with user-entered environment variables.
