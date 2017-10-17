---
layout: page
title: "Q38205: Capabilities of Real Mode CodeView and the 386"
permalink: /pubs/pc/reference/microsoft/kb/Q38205/
---

## Q38205: Capabilities of Real Mode CodeView and the 386

	Article: Q38205
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_c, h_masm, h_fortran, s_pascal
	Last Modified: 1-DEC-1988
	
	The information below discusses the CodeView debugger and its use
	of 80386 hardware capabilities.
	
	The DOS CodeView does not keep track of any of this information because
	DOS does not use any of these features. Essentially, a 386 running DOS
	is just a very fast PC and CodeView treats it as such.
	
	The OS/2 CodeView does not have the privilege to track many of the
	OS/2 functionality.
	
	The following is a list of CodeView behaviors:
	
	1. CodeView does not keep track of task states.
	
	2. CodeView does not handle privilege levels.
	
	3. CodeView Version 2.20 makes limited use of the 386 debug
	   registers. Previous versions do not use these registers.
	
	4. CodeView does not keep track of interrupt gates and trap gates.
	
	5. CodeView cannot operate in both real and Virtual 86 mode.
	
	6. CodeView cannot trace to protected mode and back to real mode.
	
	7. CodeView does not handle traces in protected mode.
