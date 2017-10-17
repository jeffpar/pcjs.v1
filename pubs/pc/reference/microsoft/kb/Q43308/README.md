---
layout: page
title: "Q43308: Differences among QuickBASIC Versions 2.00, 3.00, 4.00, 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q43308/
---

## Q43308: Differences among QuickBASIC Versions 2.00, 3.00, 4.00, 4.50

	Article: Q43308
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 18-OCT-1989
	
	This article describes differences among Microsoft QuickBASIC Versions
	2.00, 3.00, 4.00, and 4.50. (2.01 can be grouped with 2.00, and 4.00b
	can be grouped with 4.00 in the comparisons below.)
	
	FEATURE
	-------
	                                         QuickBASIC Version
	Development Environment         2.00       3.00       4.00       4.50
	-----------------------         ----       ----       ----       ----
	
	Assembly-language listings      No         No         Yes        Yes
	during separate compilation
	(compiler /A option)
	
	Error listings during           No         Yes        Yes        Yes
	separate compilation
	
	Microsoft CodeView support      No         No         Yes        Yes
	
	Hercules graphics card support  No         No         Yes        Yes
	
	Immediate mode execution        No         No         Yes        Yes
	
	Insert/overtype modes           No         Yes        Yes        Yes
	
	Instant Watches for variables   No         No         No         Yes
	and expressions
	
	Multiple modules in memory      No         No         Yes        Yes
	
	Multifile/multiwindow editing   No         No         Yes        Yes
	
	On-line QuickBASIC Advisor      No         No         No         Yes
	
	On-line help                    No         No         Yes        Yes
	
	ProKey, SideKick, and           No         Yes        Yes        Yes
	SuperKey compatibility
	
	Selectable right mouse button   No         No         No         Yes
	function
	
	Set default search paths        No         No         No         Yes
	
	Syntax checking on entry        No         No         Yes        Yes
	
	WordStar-style keyboard         No         No         Yes        Yes
	interface
	
	                                         QuickBASIC Version
	                                2.00       3.00       4.00       4.50
	Language Features               ----       ----       ----       ----
	-----------------
	
	BINARY file Input/Output        No         No         Yes        Yes
	
	Block IF/THEN/ELSE              Yes        Yes        Yes        Yes
	
	DEF FN                          Yes        Yes        Yes        Yes
	
	Definable lower array-bounds    No         No         Yes        Yes
	
	Fixed-length strings            No         No         Yes        Yes
	
	FUNCTION procedures             No         No         Yes        Yes
	
	Long (32-bit) integers          No         No         Yes        Yes
	
	Recursive procedures            No         No         Yes        Yes
	
	User-defined variable types     No         No         Yes        Yes
	
	                                         QuickBASIC Versions
	                                2.00       3.00       4.00       4.50
	Math Support                    ----       ----       ----       ----
	------------
	
	IEEE format, math coprocessor   No         Yes        Yes        Yes
	support
	
	8087/80287 support              No         Yes        Yes        Yes
	
	8087/80287 emulation            No         Yes        Yes        Yes
	
	                                         QuickBASIC Versions
	                                2.00       3.00       4.00       4.50
	Memory Model and Linking        ----       ----       ----       ----
	------------------------
	
	Build quick libraries from      No         No         Yes        Yes
	environment
	
	Compatibility with other        MASM only  MASM only  Yes        Yes
	languages
	
	Huge arrays                     No         No         Yes        Yes
	
	Quick library support or        User       User       Quick      Quick
	user library support            Library    Library    Library    Library
	
	FEATURES NEW TO QuickBASIC 4.50
	-------------------------------
	
	In QuickBASIC 4.50, you can access on-line help for QuickBASIC's
	keywords, commands, and menus, and on-line help for general topics and
	your own variables. Examples shown on the help screens can be copied
	and pasted directly into your own program, reducing development time.
	
	In the 4.50 editor, you can set the function of the right mouse button
	with the Right Mouse command from the Options menu. Use the function
	that best suits your needs.
	
	For faster debugging, QuickBASIC 4.50 offers an Instant Watch command
	for immediately identifying the value of a variable or the condition
	(true or false) of an expression.
	
	Version 4.50 also lets you set default search paths to specific types
	of files. This lets you organize your files by type and keep them in
	separate directories. QuickBASIC searches the correct directory after
	you set the new default search path. You can set default paths for
	executable, include, library, and help files.
