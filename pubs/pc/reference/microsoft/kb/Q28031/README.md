---
layout: page
title: "Q28031: QB Fast-Load Format Source Code Cannot Be Used in MS CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q28031/
---

## Q28031: QB Fast-Load Format Source Code Cannot Be Used in MS CodeView

	Article: Q28031
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | S_CodeView B_BasicCom
	Last Modified: 12-DEC-1988
	
	Microsoft CodeView is not able to read the QuickBASIC source file if
	it is saved in Fast Load format. If you plan to use the Microsoft
	CodeView debugger, be sure the source file is saved in ASCII format.
	
	To save a file in ASCII format, use the SAVE AS... option in the FILE
	menu in the QB.EXE editor.
	
	To compile a BASIC program for use with CodeView, use the following:
	
	1. BC filename /Zi [other switches]
	
	2. LINK filename /Co [other switches]
	
	If your program invokes subprograms in separate modules, you will need
	to make sure that the subprogram source files are all saved in ASCII
	text format instead of Fast Load format, or CodeView will not be able
	to view or step through the subprogram.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, 4.50, and
	the QuickBASIC which comes with the BASIC Compiler Version 6.00 or
	6.00b for MS-DOS.
