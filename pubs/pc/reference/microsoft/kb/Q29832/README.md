---
layout: page
title: "Q29832: C 5.10 MTDYNA.DOC: Dynamic-Link Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q29832/
---

	Article: Q29832
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 1: Introduction" of the
	Microsoft C version 5.10 MTDYNA.DOC file.
	
	1.2   Dynamic-Link Libraries
	
	A dynamic-link library is a set of routines that are linked with the
	program at either load time or run time rather than at the time of
	compilation.
	
	The easiest way to understand dynamic linking is to contrast it with
	the more familiar method of static linking.
	
	Static linking involves the following steps:
	
	1. Write and compile a program that calls routines (such as the
	   printf() function) not in the source file. This produces an object
	   file that contains a reference to the external printf() function.
	
	2. Link the object file with a library file containing the external
	   function. This linking step combines the two files by including the
	   code for the printf() function into the final executable file. In
	   other words, the reference to printf() is resolved at link time.
	
	3. Run the executable file from step 2. This executable file is
	   totally self contained (since it contains the code for the external
	   function).
	
	Static linking is useful, but it has the following disadvantages:
	
	1. The finale executable code cannot be upgraded or changed without
	   relinking to the main program's object files. In the commercial
	   realm this means that a new release of a program requires that the
	   entire executable file be replaced with a new version.
	
	2. Common sets of code cannot be shared. Any and all executable files
	   that use the printf() function must explicitly link in this
	   function. Thus, the code for printf()may be duplicated in many
	   different executable files on a disk or in memory.
	
	Dynamic linking, on the other hand, involves the following general
	steps (the complete process is detailed in Section 5.0 below):
	
	1. Write and compile a program that references an external function,
	   just as you do for static linking.
	
	2. Create a special definition file (.DEF extension) that specifies
	   which functions the main program will import from the dynamic-link
	   library.
	
	3. Link the main program with the appropriate dynamic-link library
	   support library to produce an executable file. This file contains a
	   reference to the external function in the dynamic-link library.
	   This file does NOT contain any code from the external function.
	
	4. Create a dynamic-link library that contains the code referenced in
	   the main program.
	
	5. Execute the program created in step 3. When this executable file is
	   run, OS/2 loads the code and discovers the special reference to the
	   dynamic-link library. For each external dynamic-link-library
	   reference, OS/2 searches the dynamic-link-library directory and
	   resolves the external reference at load time.
	
	The process of dynamic linking has the following advantages:
	
	1. An executable file is smaller since it does not contain the code
	   for external functions.
	
	2. A program can be upgraded by supplying a new version of the
	   dynamic-link library without relinking the executable file.
	
	3. Code may be shared between executable files. A common set of
	   routines can be placed in a dynamic-link library and accessed by
	   any number of executable files. In fact, the OS/2 operating system
	   itself is a dynamic-link library. All of the OS/2 system functions
	   are presented as external procedures that a user program can call.
	
	4. Linking is faster.
