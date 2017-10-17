---
layout: page
title: "Q40588: Search Order for Include Files When Using APPEND Command"
permalink: /pubs/pc/reference/microsoft/kb/Q40588/
---

## Q40588: Search Order for Include Files When Using APPEND Command

	Article: Q40588
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | append include
	Last Modified: 25-MAY-1989
	
	A data file path can be specified in DOS by using the APPEND command.
	DOS searches for a data file using the APPEND path. A file included by
	a C program can be in a directory that is in the data file path. The C
	compiler searches for the include file in the following order:
	
	1. Current directory
	
	2. Directories specified by the INCLUDE environment variable
	
	3. Directories specified by the APPEND command
	
	Please refer to your DOS documentation for specific information about
	using the APPEND command.
	
	Note: The APPEND command can cause other problems during
	compilation, linking, and execution. Microsoft recommends not using
	the APPEND command when developing C programs.
