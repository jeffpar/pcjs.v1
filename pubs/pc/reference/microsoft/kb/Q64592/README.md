---
layout: page
title: "Q64592: &quot;Overflow&quot; from &quot;&amp;H nn&quot; or &quot;&amp;O nn&quot; with Illegal Embedded Space"
permalink: /pubs/pc/reference/microsoft/kb/Q64592/
---

## Q64592: &quot;Overflow&quot; from &quot;&amp;H nn&quot; or &quot;&amp;O nn&quot; with Illegal Embedded Space

	Article: Q64592
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 10-AUG-1990
	
	The ampersand character, when used to signify Hexadecimal (&H) or
	Octal (&O) values, can give an "Overflow" error if a space is embedded
	in the number.
	
	This information applies to QuickBASIC versions 4.00, 4.00b, and 4.50,
	to Microsoft BASIC Compiler versions 6.00 and 6.00b, and to Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	The following code examples cause an "Overflow" error (in the QB.EXE
	or QBX.EXE environment or in the BC.EXE compiler):
	
	   AnyVarName = &H 80
	
	   AnyVarName = & 80
	
	   AnyVarName = &O 80
	
	   PRINT &H 80
	
	The QBX.EXE environment immediately displays this error message
	because of the syntax checker, while the QB.EXE environment only
	catches the error upon execution.
	
	QuickBASIC compiler versions 3.00 and earlier ignore this syntax error
	and interpret the faulty information as a zero (0).
