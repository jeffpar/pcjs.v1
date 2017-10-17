---
layout: page
title: "Q68381: The D Modifier to &#36;? Is Broken in NMAKE Version 1.11"
permalink: /pubs/pc/reference/microsoft/kb/Q68381/
---

## Q68381: The D Modifier to &#36;? Is Broken in NMAKE Version 1.11

	Article: Q68381
	Version(s): 1.11   | 1.11
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.11 fixlist1.12
	Last Modified: 24-JAN-1991
	
	The D modifier to the $? macro is supposed to return the directory and
	drive portion of the dependent. This does not work properly with NMAKE
	version 1.11. Instead, the full pathname and filename are returned.
	This was corrected in NMAKE version 1.12, which shipped with Microsoft
	COBOL version 4.00.
	
	Sample Makefile
	---------------
	
	all : c:\dos\command.com
	   echo The D modifier of $? is $(?D)
