---
layout: page
title: "Q63197: Using PWB with Both BASIC PDS 7.10 and C PDS 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q63197/
---

## Q63197: Using PWB with Both BASIC PDS 7.10 and C PDS 6.00

	Article: Q63197
	Version(s): 7.10   | 7.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900618-153 S_C S_PWB
	Last Modified: 6-SEP-1990
	
	The Programmer's WorkBench (PWB) is designed as a multilanguage,
	project-oriented development environment for MS-DOS and MS OS/2.
	
	The key to each language's interface into PWB is the .HLP files and
	the .MXT files for MS-DOS and the .PXT files for MS OS/2. The .HLP
	files are the help files for each language product. The .MXT and .PXT
	files are PWB extensions for each language that define menus and
	dialog boxes for each compiler. Thus, to use PWB with both BASIC and
	C, you must copy the PWBC.MXT file (for MS-DOS) or PWBC.PXT file (for
	MS OS/2) into the directory containing the BASIC PWB.EXE file, and SET
	the HELPFILES environment variable to find both the C and BASIC help
	files.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) version 7.10 and to Microsoft C PDS version 6.00 for
	MS-DOS and MS OS/2.
