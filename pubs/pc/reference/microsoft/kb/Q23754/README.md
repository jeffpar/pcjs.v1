---
layout: page
title: "Q23754: Unassigning Predefined Keys"
permalink: /pubs/pc/reference/microsoft/kb/Q23754/
---

## Q23754: Unassigning Predefined Keys

	Article: Q23754
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | TAR62300
	Last Modified: 1-SEP-1988
	
	The following are two ways to unassign a predefined key:
	
	1. Assign the key to a different function.
	2. Assign the key to the "unassigned" function.
	
	If ALT+A currently is assigned to the ARG function, you can assign
	it to another function by putting the following line in your
	TOOLS.INI file:
	
	NewFunct:ALT+A
	
	If you don't want ALT+A to be assigned to any function, place the following
	line in your TOOLS.INI file:
	
	Unassigned:ALT+A.
