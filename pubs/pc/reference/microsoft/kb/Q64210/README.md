---
layout: page
title: "Q64210: How to Simulate Bound Executables with BASIC 6.00 - 7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q64210/
---

## Q64210: How to Simulate Bound Executables with BASIC 6.00 - 7.10

	Article: Q64210
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | SR# S900724-5
	Last Modified: 27-JUL-1990
	
	Although Microsoft BASIC Compiler versions 6.00 and 6.00b and
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 can create protected and real mode
	programs, they cannot create bound programs. A bound program is one
	that can run both in protected mode and real mode (DOS). However,
	there is a way to simulate the functionality of a bound program by
	creating a real mode version of the program and then linking the
	protected mode version with a module-definition file containing the
	STUB statement. The procedure for doing this is described below.
	
	This information applies to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2 and Microsoft BASIC PDS versions 7.00 and
	7.10 for MS-DOS and MS OS/2.
	
	The STUB statement adds a DOS versions 3.x (real mode) executable file
	to the beginning of the protected mode program being created by
	LINK.EXE. The syntax of the STUB statement is the following:
	
	   STUB 'filename'
	
	Here, filename is the name of a real mode executable file. This real
	mode stub is invoked whenever the program is executed under DOS 2.x or
	DOS 3.x (or the DOS compatibility box of OS/2). By default, the linker
	adds its own standard stub that terminates after displaying a message
	similar to the following:
	
	   This program cannot run in DOS mode.
	
	You can use the STUB statement to replace this standard stub with a
	real mode program that exactly emulates the behavior of a protected
	mode version, thus simulating a bound executable.
	
	The following is an example of the steps necessary to do this. This
	example uses the following two BASIC source files:
	
	   REALMODE.BAS
	   ------------
	
	   PRINT "This program has the same output in protected and real modes."
	
	   PROTMODE.BAS
	   ------------
	
	   PRINT "This program has the same output in protected and real modes."
	
	Here are the steps:
	
	1. Create a real mode version of the program as you normally would.
	   For our example, the following two commands accomplish this:
	
	      bc /Lr realmode.bas;
	      link realmode.obj;
	
	2. Create a module-definition file containing the STUB statement. You
	   can do this with any text editor. Make sure the file is saved as an
	   ASCII text file. For our example, the module-definition file
	   (PROTMODE.DEF) would look like this:
	
	      STUB 'REALMODE.EXE'
	
	3. Create the protected mode version of the program, linking with the
	   module-definition file created in Step 2. Compile the program as
	   you normally would, but when linking, include the name of the
	   module-definition file in the fifth link parameter. The compile
	   and link commands for our example would be as follows:
	
	      bc /Lp protmode.bas;
	      link protmode.obj,,,,protmode.def;
	
	When PROTMODE.EXE is run from a protected mode session, the following
	will be the output:
	
	   This program has the same output in protected and real modes.
	
	When PROTMODE.EXE is run from a DOS (real mode) session, REALMODE.EXE
	will be executed instead of PROTMODE.EXE. Remember that REALMODE.EXE
	is appended to the beginning of PROTMODE.EXE, so it is not necessary
	to have a copy of REALMODE.EXE in the current directory. The output
	will be the same as if PROTMODE were run from a protected mode
	session:
	
	   This program has the same output in protected and real modes.
