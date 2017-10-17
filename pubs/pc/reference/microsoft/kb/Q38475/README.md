---
layout: page
title: "Q38475: Change for SELECT CASE Example 2 in QB.EXE 4.50 On-Line Help"
permalink: /pubs/pc/reference/microsoft/kb/Q38475/
---

## Q38475: Change for SELECT CASE Example 2 in QB.EXE 4.50 On-Line Help

	Article: Q38475
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 13-DEC-1989
	
	In the second SELECT CASE example available through QuickBASIC Version
	4.50 Advisor on-line Help, there is an error in a CASE statement.
	
	The following correction applies to "HELP: SELECT Statement
	Programming Examples." To check for digit entry, the CASE statement
	should read as follows
	
	   CASE 48 TO 57
	
	instead of the following:
	
	   CASE 30 TO 29
	
	The correct ASCII decimal values for digit entries 0 through 9 are 48
	to 57.
	
	Version 4.50 is the first version of QuickBASIC that offers the QB
	Advisor, a hypertext-based, on-line help system with instant cross
	referencing. This error was corrected in the QBX.EXE Microsoft Advisor
	that is included with Microsoft BASIC PDS Version 7.00.
