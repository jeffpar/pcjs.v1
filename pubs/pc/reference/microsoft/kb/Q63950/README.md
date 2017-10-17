---
layout: page
title: "Q63950: Creating a Compile Window Macro for the M Editor Version 1.02"
permalink: /pubs/pc/reference/microsoft/kb/Q63950/
---

## Q63950: Creating a Compile Window Macro for the M Editor Version 1.02

	Article: Q63950
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 27-JUL-1990
	
	The macro below creates a "compile window" in either the M or MEP
	Editor version 1.02 when you press ALT+C. Note that a compile window
	is helpful for viewing general compilation errors and errors generated
	from utilities that were invoked.
	
	The following macro, CompWindow, can be added to the [M] or [MEP]
	tagged section of the TOOLS.INI file to create a compile window:
	
	   CompWindow:= savecur home meta down  \
	                up up up up arg window  \
	                window arg "<compile>" setfile  \
	                window restcur
	
	   CompWindow: alt+c
	
	The CompWindow macro above creates a compile window by performing the
	following steps:
	
	1. Use the "savcur" function to save the current position of the
	   cursor.
	
	2. Use the "home" function to place the cursor in the upper-left
	   corner of the screen. This function guarantees that the cursor will
	   be in a left-most position when the compile window is created.
	
	3. Use the "meta down" function to move the cursor to the bottom of
	   the window without changing the column position.
	
	4. Use "up up up up arg window" functions to create a horizontal
	   window four lines above the bottom of the screen. A larger compile
	   window can be created by adding more "up" functions to this line in
	   the macro.
	
	5. Use the 'arg "<compile>" setfile' function to create a
	   dynamic-compile log. More information concerning the
	   dynamic-compile log can be found on Pages 47-48 of the "Microsoft
	   Editor User's Guide."
	
	6. Finally, the original position of the cursor is restored in the
	   original window by using the "window restcur" functions.
	
	7. The macro is assigned to the ALT+C keystroke, although any unused
	   keystroke may be used.
	
	Error messages will now be displayed in the compile window when
	running a compilation or invoking a utility.
