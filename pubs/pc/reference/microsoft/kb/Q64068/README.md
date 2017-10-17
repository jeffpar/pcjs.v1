---
layout: page
title: "Q64068: 8087 Registers Not Viewable in QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q64068/
---

## Q64068: 8087 Registers Not Viewable in QuickC

	Article: Q64068
	Version(s): 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm buglist2.50
	Last Modified: 1-AUG-1990
	
	In Microsoft QuickC version 2.50 and QuickAssembler version 2.51, you
	cannot watch the 8087 registers while debugging.
	
	If you select Display from the QuickC Options Menu and activate the
	"Show 8087" option, the debug window will always claim that the
	floating point package has not been loaded. The problem seems to be
	with the built-in QuickC debugger, rather than the compiler and linker
	that produce the symbolic information. The same executable can
	successfully be debugged under CodeView version 3.00, which uses the
	same symbolic information format.
	
	Microsoft has confirmed this to be a problem with QuickC version 2.50.
	We are researching this problem and will post new information here as
	it becomes available.
