---
layout: page
title: "Q49423: WINDOWCOMPAT Directs CodeView to Create a Window"
permalink: /pubs/pc/reference/microsoft/kb/Q49423/
---

## Q49423: WINDOWCOMPAT Directs CodeView to Create a Window

	Article: Q49423
	Version(s): 2.20 2.30
	Operating System: OS/2
	Flags: ENDUSER | S_C
	Last Modified: 10-NOV-1989
	
	The WINDOWCOMPAT directive in a linker definition file can cause
	strange behavior in non-Presentation Manager (PM) programs being
	debugged under CodeView. WINDOWCOMPAT is one of three application
	types that can be specified after the NAME directive. WINDOWCOMPAT is
	used for OS/2 programs that use VIO, MOU, and KBD calls and can be
	used inside a PM window or as a separate screen group.
	
	Debugging a non-PM application that was linked with the WINDOWCOMPAT
	option instructs CodeView to create a PM window to run the program. In
	some cases this feature could be desirable, but for most debugging, a
	PM window is only cumbersome. The way to work around this feature is
	to relink without the WINDOWCOMPAT directive.
