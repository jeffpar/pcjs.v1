---
layout: page
title: "Q40581: Overlays and BINDing Are Not Compatible"
permalink: /pubs/pc/reference/microsoft/kb/Q40581/
---

	Article: Q40581
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-MAY-1989
	
	Question:
	
	I have written a large program that needs to be overlaid to run in
	DOS. Is there a way I can compile it for OS/2, then BIND it to run in
	DOS with overlays so that I only have a single executable for both
	OS/2 and DOS?
	
	Response:
	
	You cannot do this; to BIND a program to run in DOS, you need a
	protected-mode executable. However, protected-mode executables do not
	understand overlays. As a result, there is no way to BIND a program
	that needs overlays in DOS. You have to have two different
	executables.
	
	Note: The two executables could be combined into one large executable
	by creating the real-mode executable and naming it in the STUB
	statement in the .DEF file when linking the OS/2 application. There is
	no real advantage to this; however, the new .EXE file will be a little
	larger than the two separate files. The STUB statement is documented
	by the C 5.10 utilities update in the LINK section.
