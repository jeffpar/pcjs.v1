---
layout: page
title: "Q60964: NO87 Environment Variable Echoed to Screen When Run"
permalink: /pubs/pc/reference/microsoft/kb/Q60964/
---

## Q60964: NO87 Environment Variable Echoed to Screen When Run

	Article: Q60964
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900406-108 B_BasicCom
	Last Modified: 14-MAY-1990
	
	The QB.EXE and QBX.EXE environments echo to the screen the string
	stored in the environment variable NO87. This is to notify you
	whether or not the math coprocessor (if one exists) will be used by
	these environments in floating-point calculations. NO87 must be set to
	null if the coprocessor is to be used; any other string value turns it
	off. To set the NO87 environment variable, execute the following
	statement from the DOS command line:
	
	   SET NO87=[string-expression]
	
	Note: <string-expression> would be entered only if the coprocessor
	were not to be used.
	
	This information applies to Microsoft QuickBASIC Compiler versions
	4.00, 4.00b, 4.50 for MS-DOS, and to Microsoft BASIC Professional
	Development System (PDS) version 7.00 for MS-DOS. Furthermore, EXE
	files compiled in all Microsoft languages that use an IEEE emulation
	math package (BASIC, C, Pascal, FORTRAN) will exhibit the same
	behavior when run.
	
	For example, enter the following at the DOS command line:
	
	   SET NO87=OFF
	
	Then run QB (or QBX). The word "OFF" will be displayed on the next
	line.
