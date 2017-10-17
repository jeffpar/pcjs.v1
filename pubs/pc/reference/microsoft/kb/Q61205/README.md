---
layout: page
title: "Q61205: C 6.00 README: Signal() Function Limited in Multithread Usage"
permalink: /pubs/pc/reference/microsoft/kb/Q61205/
---

## Q61205: C 6.00 README: Signal() Function Limited in Multithread Usage

	Article: Q61205
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-AUG-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	Signal() Function Limited in Multithread Usage
	----------------------------------------------
	
	The signal() function has limitations when used to build multithreaded
	applications or dynamic-link libraries. Specifically, only
	signal(SIGFPE,...) is supported in a multithreaded environment. To
	trap error or interrupt conditions in this case, use direct calls to
	DOSSETSIGHANDLER or DOSSETVEC.
