---
layout: page
title: "Q44230: MARKEXE.EXE in OS/2 May Cause .EXE Hang at Run Time"
permalink: /pubs/pc/reference/microsoft/kb/Q44230/
---

## Q44230: MARKEXE.EXE in OS/2 May Cause .EXE Hang at Run Time

	Article: Q44230
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S890424-101
	Last Modified: 4-JAN-1990
	
	Microsoft BASIC Compiler programs running in OS/2 protected mode take
	over the full screen by default and will not run from an OS/2
	Presentation Manager (PM) windowed environment unless you first alter
	the .EXE program's header with the MARKEXE utility or with PM's Start
	Programs window (as shown further below).
	
	It has been reported that system crashes may intermittently occur
	while running graphics-mode programs from the PM windowed environment.
	Only nongraphics programs using SCREEN 0 in a PM windowed environment
	seem to work without problems, and this is not always the case either.
	It has also been reported that system crashes have occurred while
	running character-mode (SCREEN 0) programs from within a PM windowed
	environment.
	
	Microsoft has not tested programs running within a PM window that were
	compiled with Microsoft BASIC Compiler Versions 6.00, 6.00b, or
	Microsoft BASIC PDS Version 7.00. This feature is under review and
	will be considered for inclusion in a future release.
	
	While there are problems running BASIC programs from within a PM
	window, you can write OS/2 Presentation Manager (PM) applications
	using BASIC compiler Versions 6.00 and 6.00b and BASIC PDS Version
	7.00. This information is detailed in a separate article that can be
	found by querying on the following words:
	
	  OS/2 and Presentation and Manager and BASIC
	
	The MARKEXE.EXE utility program is shipped on the Toolkit 1 disk
	with the Microsoft OS/2 Software Development Kit and is used for
	altering the header of a bound or protected-mode executable program
	(.EXE) to run from a PM windowed environment. The following is an
	example of running MARKEXE:
	
	   MARKEXE progname windowcompat
	
	Another method to modify your compiled BASIC .EXE to run under a PM
	window (in protected mode) is to do the following:
	
	1. Choose the Add option from the Program menu of the Start Programs
	   window in PM.
	
	2. Choose Change from the Program menu. The Change Program Information
	   window now appears.
	
	3. Choose Other for the Program Type. Press the ENTER key. The How To
	   Run The Program window now appears.
	
	4. Choose Run The Program In A Text Window to run your program in a
	   PM window. Press the ENTER key.
	
	You can now run your program in a PM window from OS/2's Start Program
	window or from the OS/2 full-screen command prompt.
	
	If the program is deleted from the Start Program menu, the .EXE header
	is changed back to what it was prior to being entered into the Start
	Program menu.
