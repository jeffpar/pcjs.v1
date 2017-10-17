---
layout: page
title: "Q47503: LINK Environment Variable Ignored When Linking Through CL"
permalink: /pubs/pc/reference/microsoft/kb/Q47503/
---

## Q47503: LINK Environment Variable Ignored When Linking Through CL

	Article: Q47503
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_C S_QuickC
	Last Modified: 15-AUG-1989
	
	Problem:
	
	To increase the size of my stack, when I set an environment variable
	called LINK equal to /ST:4096, it doesn't work correctly when I link
	using CL.
	
	Response:
	
	Before CL spawns the linker, it clears the environment of all
	variables except LIB. Consequently, the LINK environment variable
	doesn't exist when the linker is invoked, and any options that were
	specified by it are not seen. When linking with CL, any desired linker
	options should be specified on the CL command line after the /link
	switch.
	
	The same behavior is seen with the command line compilers from QuickC
	Version 1.00 and 1.01, but not with QuickC 2.00 or QuickAssembler.
