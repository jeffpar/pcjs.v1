---
layout: page
title: "Q44897: system() Returns an Exit Code Under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q44897/
---

	Article: Q44897
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 31-MAY-1989
	
	The system() function under OS/2 returns the exit code of the process
	executed, unlike MS-DOS. Under MS-DOS the system() function always
	returns 0 to indicate successful completion.
	
	Under both operating systems, if the system() function fails then a
	value of -1 is returned.
