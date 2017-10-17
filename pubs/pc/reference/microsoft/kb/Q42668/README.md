---
layout: page
title: "Q42668: &quot;Statement Illegal in TYPE Block&quot; Using F7 in QB.EXE Debug"
permalink: /pubs/pc/reference/microsoft/kb/Q42668/
---

## Q42668: &quot;Statement Illegal in TYPE Block&quot; Using F7 in QB.EXE Debug

	Article: Q42668
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890309-14 B_BasicCom
	Last Modified: 15-DEC-1989
	
	The following information applies to QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to the QB.EXE programs supplied with Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2, and to the
	QBX.EXE environment supplied with the BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2.
	
	The F7 function in the QB.EXE editor/debugger causes the program to
	execute up to the current location of the cursor. If you attempt to
	execute a program using F7 while the cursor is inside a user-defined
	TYPE...END TYPE block, the error message "Statement illegal in TYPE
	block" is returned. This only happens the first time that the program
	is executed.
	
	Code Example
	------------
	
	TYPE USER
	   ANYDATA AS INTEGER
	END TYPE
	CLS
