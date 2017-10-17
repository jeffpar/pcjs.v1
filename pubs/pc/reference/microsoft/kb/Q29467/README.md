---
layout: page
title: "Q29467: Mouse EGA Register Interface"
permalink: /pubs/pc/reference/microsoft/kb/Q29467/
---

## Q29467: Mouse EGA Register Interface

	Article: Q29467
	Version(s): 6.x 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 4-NOV-1988
	
	An application note concerning the Mouse EGA Register Interface can be
	obtained by contacting the Microsoft Product Support Services Hardware
	Group at (206) 454-2030.
	
	The Microsoft Mouse EGA Register Interface is a library of nine
	functions. It can be called from assembly language programs or high
	level languages, such as FORTRAN, Pascal, C, and compiled BASIC. Its
	functions allow you to do the following:
	
	1. Read and write to one or more of the EGA write-only registers.
	
	2. Define default values for the EGA write-only registers or reset the
	   registers to these default values.
	
	3. Confirm that the EGA Register Interface is present and if so,
	   return its version number.
	
	If your program tries to set the EGA registers directly, rather than
	through the interface, the mouse cursor will draw incorrectly.
