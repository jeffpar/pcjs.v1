---
layout: page
title: "Q44887: MEP GP Faults After Consecutive Searches."
permalink: /pubs/pc/reference/microsoft/kb/Q44887/
---

	Article: Q44887
	Product: Microsoft C
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | buglist1.00
	Last Modified: 1-JUN-1989
	
	MEP gets an access violation and crashes after several searches for a
	string.
	
	Microsoft has confirmed this to be a problem with MEP.EXE Version
	1.00. This problem was corrected in MEP.EXE Version 1.02.
	
	Note: Version 1.02 of the Microsoft Editor is only available with
	FORTRAN 5.00. The documentation required for M and MEP Version 1.02
	make it impossible to release except with a major language release.
	
	The text file that caused MEP to fail was 54400 bytes and contained
	the string "error" in 81 different locations. To reproduce this
	problem, search for the string "error". The default keystrokes are
	
	   Arg "error" F3
	
	for the first search, and the following for each additional search:
	
	   F3
	
	On the 81st search, the Microsoft Editor for Protect, generates a
	General Protection Violation.
