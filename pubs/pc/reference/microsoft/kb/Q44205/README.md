---
layout: page
title: "Q44205: BIND: "Structure Error in .EXE File" Caused by Non-FAPI Call"
permalink: /pubs/pc/reference/microsoft/kb/Q44205/
---

	Article: Q44205
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G890502-17544
	Last Modified: 22-MAY-1989
	
	A possible cause of the BIND error message "Structure error in .EXE
	file" is calling a non-FAPI function from within the program to be
	bound.
	
	The solution is to be sure to call only FAPI functions or to follow
	the directions in the BIND documentation for programs that make
	non-FAPI calls.
