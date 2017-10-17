---
layout: page
title: "Q42666: QB.EXE &quot;Type Mismatch&quot;, BC.EXE &quot;String Expression Required&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q42666/
---

## Q42666: QB.EXE &quot;Type Mismatch&quot;, BC.EXE &quot;String Expression Required&quot;

	Article: Q42666
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890217-143 B_BasicCom
	Last Modified: 15-DEC-1989
	
	This article describes a case where a syntax error in the filename for
	an OPEN statement gives "Type Mismatch" in the environment and a
	different (but more informative) message, "String Expression
	Required," in BC.EXE. This is a design limitation.
	
	The following program line causes the QB.EXE environment of QuickBASIC
	to highlight "LEN = 20" and issue the error message "Type Mismatch."
	Under the QBX.EXE environment of Microsoft BASIC PDS 7.00, "FILE.DAT"
	is highlighted when the "Type Mismatch" error occurs:
	
	   OPEN FILE.DAT FOR RANDOM AS #1 LEN = 20
	
	"Type Mismatch" occurs because a string variable was expected instead
	of FILE.DAT, which is by default a single-precision variable.
	
	The BC.EXE compiler instead identifies this syntax error as "String
	Expression Required" and points to the "T" in FILE.DAT.
	
	This information applies to QB.EXE in QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to QB.EXE in Microsoft BASIC Compiler Versions 6.00 and
	6.00b, and to QBX.EXE in Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	QuickBASIC Versions 2.00, 2.10, and 3.00 issue the "String Expression
	Required" message in both the environment and the separate compilation
	method.
	
	The following is the necessary correction to follow proper syntax:
	
	   OPEN "FILE.DAT" FOR RANDOM AS #1 LEN = 20
