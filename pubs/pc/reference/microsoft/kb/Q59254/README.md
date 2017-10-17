---
layout: page
title: "Q59254: NMAKE 1.01 Does Not Properly Expand Wildcard Arguments"
permalink: /pubs/pc/reference/microsoft/kb/Q59254/
---

## Q59254: NMAKE 1.01 Does Not Properly Expand Wildcard Arguments

	Article: Q59254
	Version(s): 1.01   | 1.01
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-MAY-1990
	
	NMAKE version 1.01 doesn't properly expand wildcard command-line arguments.
	For example, if we were to have a makefile that looked similar to the
	following
	
	a.exe : a.c
	    echo cl a.c
	
	b.exe : b.c
	    echo cl b.c
	
	And we were to say:
	
	NMAKE *.exe /A
	
	NMAKE wouldn't properly expand "*.exe" to equate to both a.exe and
	b.exe; it would merely build only the first target in the list.
	
	NMAKE versions 1.00 and 1.10 do not exhibit this behavior.
