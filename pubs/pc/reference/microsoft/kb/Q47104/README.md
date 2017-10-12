---
layout: page
title: "Q47104: Cannot Use Overlays in a Bound Application"
permalink: /pubs/pc/reference/microsoft/kb/Q47104/
---

	Article: Q47104
	Product: Microsoft C
	Version(s): 5.01.21 5.03 | 5.01.21 5.03
	Operating System: MS-DOS       | OS/2
	Flags: ENDUSER |
	Last Modified: 30-AUG-1989
	
	Question:
	
	How can I incorporate overlays into my bound application?
	
	Response:
	
	You cannot use overlays in a bound application. To bind an
	application, you must first have a runnable OS/2 executable; then, you
	use the BIND utility to make it run in both OS/2 and DOS. OS/2
	executables do not understand overlays so you cannot incorporate them
	into an OS/2 executable. Hence, you cannot use overlays in a bound
	program.
