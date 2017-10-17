---
layout: page
title: "Q25998: &quot;Duplicate Definition&quot; with Same Name of SUBprogram, Variable"
permalink: /pubs/pc/reference/microsoft/kb/Q25998/
---

## Q25998: &quot;Duplicate Definition&quot; with Same Name of SUBprogram, Variable

	Article: Q25998
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 7-FEB-1989
	
	When you run the program below, a "Duplicate definition" occurs
	because a variable and SUBprogram have the same name, not counting the
	type of declaration suffix (i.e., !, #, $, &, or %).
	
	You can work around this design limitation by changing the variable
	name or the subprogram name.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	and the BASIC compiler Versions 6.00 and 6.00b.
	
	The following program demonstrates the "Duplicate Definition"
	error:
	
	' THIS IS THE MAIN PROGRAM:
	DECLARE SUB abc ()
	DEFINT A-Z
	abc! = 2
	CALL abc
	
	SUB abc STATIC
	PRINT "hello"
	END SUB
