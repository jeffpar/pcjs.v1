---
layout: page
title: "Q28160: QB /L A: Does Not Find QB.QLB If SET LIB=A: Is Not Set"
permalink: /pubs/pc/reference/microsoft/kb/Q28160/
---

## Q28160: QB /L A: Does Not Find QB.QLB If SET LIB=A: Is Not Set

	Article: Q28160
	Version(s): 6.00 6.00b 7.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	Problem:
	
	If the default Quick library file QB.QLB is on Drive A and no LIB
	environment variable is set, then the following command line fails to
	find QB.QLB:
	
	   QB /L A:
	
	Response:
	
	This is how the Quick library search is supposed to work. If no
	argument is given to the /L switch, QB.EXE looks for a filename of
	QB.QLB. Otherwise, if you specify a drive such as Drive A, QB.EXE
	assumes that you are specifying a Quick library name other than
	QB.QLB.
	
	The following are easy workarounds:
	
	1. Specify QB /L A:QB, which is only two characters longer.
	
	2. An alternate workaround is to perform the following command from
	   the DOS command line before running QB /L:
	
	      SET LIB=A:
