---
layout: page
title: "Q47029: .DBG File Needed to Debug .COM File"
permalink: /pubs/pc/reference/microsoft/kb/Q47029/
---

## Q47029: .DBG File Needed to Debug .COM File

	Article: Q47029
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JUL-1989
	
	To debug a .COM file produced with the QuickAssembler, the linker
	places necessary symbolic information in a file with the extension
	.DBG. If this file is deleted, no error message is issued, but the
	QuickAssembler will report that the program does not contain debug
	information. At this point, it asks if you would like to rebuild with
	the debug information. In general, you should do this rebuild so that
	you can use the full power of the QuickAssembler debugger.
	
	If you choose not to rebuild by selecting "No", then any debugging
	command that requires debugging information, including breakpoints and
	displays of variables by name, will be unavailable. Because of this,
	Microsoft recommends rebuilding to include debugging information
	before debugging.
