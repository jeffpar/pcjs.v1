---
layout: page
title: "Q43646: C: _acrtused Must Be Defined When Not Including Start-Up Code"
permalink: /pubs/pc/reference/microsoft/kb/Q43646/
---

## Q43646: C: _acrtused Must Be Defined When Not Including Start-Up Code

	Article: Q43646
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc acrtused __acrtused ROM
	Last Modified: 26-JAN-1990
	
	The object modules created by the Microsoft C Optimizing Compiler,
	Versions 5.10 and earlier, contain a reference to the variable
	_acrtused. This variable causes the linker to bring in the C start-up
	code. To not link the C start-up code, it is necessary to define
	_acrtused as follows:
	
	   int _acrtused = 0;
