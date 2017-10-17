---
layout: page
title: "Q69108: Instant Watch Truncates Display of String After Null Byte"
permalink: /pubs/pc/reference/microsoft/kb/Q69108/
---

## Q69108: Instant Watch Truncates Display of String After Null Byte

	Article: Q69108
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BASICCOM SR# S910107-22 buglist4.50
	Last Modified: 6-FEB-1991
	
	If you set an instant watch on a string variable that contains a null
	byte, CHR$(0), then instant watch will only display the contents of
	the string up to the null character. The problem occurs for both
	variable length and fixed-length string variables.
	
	Microsoft has confirmed this to be a problem in QB.EXE in Microsoft
	QuickBASIC version 4.50 for MS-DOS and in QBX.EXE in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10
	(buglist7.00 and buglist7.10) for MS-DOS.
	
	To do an instant watch on a variable in either the QB.EXE or QBX.EXE
	environment, you must suspend execution of the program, move the
	cursor under the variable you want to watch, and press SHIFT+F9. The
	variable name and contents will appear. Instant watch is valuable for
	viewing the contents of your variables during execution of the
	program.
	
	Doing an instant watch on a variable (SHIFT+F9) will cause a window to
	pop up with the name of the variable and its value. Setting a watch on
	a variable is different than doing an instant watch. Setting a watch
	will cause a line to appear at the top of your editing screen with the
	name of the variable and its value. This line will remain at the top
	of your editing screen until you delete it.
	
	Code Example
	------------
	
	As the example below demonstrates, if you do an instant watch on a
	string variable that contains the null character, CHR$(0), then
	instant watch will only display the contents of the string up to the
	null character. If you set a watch on the same variable, the whole
	value of the string will be displayed.
	
	   C$ = "Hello" + CHR$(0) + "World"
	   PRINT "PRESS ANY KEY TO CONTINUE"
	   DO
	   LOOP UNTIL INKEY$ <> ""
	
	The following steps demonstrate the problem:
	
	1. Run the above code in either the QB.EXE or QBX.EXE environment.
	
	2. While the program waits for you to press a key, press CTRL+BREAK to
	   suspend execution of the program.
	
	3. Move the cursor under C$ and press SHIFT+F9. Just "Hello" will
	   display. "World" will fail to display.
	
	4. Select the Add Watch button from the instant watch window. The
	   following correct value will now display:
	
	      "Hello World"
	
	Note: CHR$(0) is displayed as a blank in the watch line at the top of
	the editing screen.
