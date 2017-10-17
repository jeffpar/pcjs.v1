---
layout: page
title: "Q68835: Compiler Prints Filename but Does Not Compile the Program"
permalink: /pubs/pc/reference/microsoft/kb/Q68835/
---

## Q68835: Compiler Prints Filename but Does Not Compile the Program

	Article: Q68835
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 5-FEB-1991
	
	If your program prints out your filename after you type in the
	following
	
	   cl filename.c
	
	and then returns to the DOS prompt without creating an executable
	file, there may be duplicate compiler filenames. Within the
	Programmer's WorkBench, it will indicate that there are no warnings or
	errors after rebuilding, but the compiler will not create an
	executable file.
	
	The C compiler is a three-pass compiler, and invokes the files C1.EXE,
	C2.EXE, and C3.EXE. If there are any other files with these names on
	the path before the compiler, then the compiler may incorrectly
	execute the wrong file.
	
	There is a compiler switch that will enable you to print out which
	files are being invoked during each pass of the compiler. To implement
	this switch, enter the following:
	
	   cl /d filename.c
