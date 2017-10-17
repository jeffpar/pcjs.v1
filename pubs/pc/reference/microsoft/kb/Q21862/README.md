---
layout: page
title: "Q21862: Duplicate Labels Can Only Be Separately Compiled             s"
permalink: /pubs/pc/reference/microsoft/kb/Q21862/
---

## Q21862: Duplicate Labels Can Only Be Separately Compiled             s

	Article: Q21862
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 27-DEC-1989
	
	Question:
	
	Can I use the same line numbers or line labels in different
	subprograms that are compiled in the same source file?
	
	Response:
	
	No, but you can use the same line numbers or line labels if the
	subprograms are separately compiled.
	
	Line numbers and labels are local to the compiled module in which they
	occur. Line numbers and labels must be unique within a given compiled
	module. You do not need to worry about duplicate labels in separately
	compiled modules.
	
	Note that using the REM $INCLUDE metacommand to include source code
	from a separate file is similar to putting the two sources into one
	file. Any files included at compile time with the REM $INCLUDE
	metacommand are considered as part of that module, and are included in
	the .OBJ file.
	
	This information needs to be added to Section 9.2.1, "Using Line
	Labels", on Page 160 of the "Microsoft QuickBASIC Compiler" manual for
	Versions 2.00, 2.01, and 3.00.
