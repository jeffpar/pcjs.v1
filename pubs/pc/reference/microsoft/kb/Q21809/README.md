---
layout: page
title: "Q21809: FILES Statement Always Displays Name of Current Directory"
permalink: /pubs/pc/reference/microsoft/kb/Q21809/
---

## Q21809: FILES Statement Always Displays Name of Current Directory

	Article: Q21809
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 27-DEC-1989
	
	Problem:
	   When I request a directory listing of a subdirectory other than the
	current directory using FILES "\subdir", I get the file list for the
	different subdirectory, but I get the name of the current directory
	displayed at the top. I expected the requested subdirectory name to be
	at the top.
	
	Response:
	   The FILES statement in QuickBASIC is behaving in a manner
	consistent with BASICA and GW-BASIC Version 3.20. It is not likely that
	this behavior will change.
