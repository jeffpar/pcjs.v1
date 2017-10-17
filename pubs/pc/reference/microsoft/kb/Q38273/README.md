---
layout: page
title: "Q38273: PAINT Must Not Use Fixed-Length String Patterns"
permalink: /pubs/pc/reference/microsoft/kb/Q38273/
---

## Q38273: PAINT Must Not Use Fixed-Length String Patterns

	Article: Q38273
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	The following command can be used to fill in an enclosed polygon:
	
	   PAINT (x,y), pat, border
	
	In this case, x and y represent screen coordinates inside the polygon;
	the figure is drawn in a color specified by "border" and the variable
	"pat" may be either an integer or a character string. If "pat" is an
	integer, the fill is done with a solid color. But if "pat" is a string
	value, it represents a fill pattern.
	
	A string value for "pat" works correctly in the QB.EXE environment
	whether the string value is a fixed-length string or a variable-length
	string. However, the compiled .EXE version of such a program produces
	an "Illegal function call" error when "pat" is a fixed-length string.
	
	This design limitation applies to QuickBASIC Versions 4.00, 4.00b, and
	4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS
	and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS and MS
	OS/2.
	
	Note: Fixed-length strings are not implemented in earlier versions of
	these products.
	
	The following is a code example:
	
	DIM SHARED pat AS STRING * 16
	
	pat = "cc3c0c00"
	SCREEN 9
	WINDOW (0, 0)-(1250, 1000)
	COLOR 1, 0
	CIRCLE (600, 200), 150
	COLOR 3, 0
	PAINT (600, 200), pat, 1
	INPUT a$
