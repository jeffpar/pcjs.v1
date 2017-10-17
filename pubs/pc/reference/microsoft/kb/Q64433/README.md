---
layout: page
title: "Q64433: Can't Resize a Window with a Macro in PWB"
permalink: /pubs/pc/reference/microsoft/kb/Q64433/
---

## Q64433: Can't Resize a Window with a Macro in PWB

	Article: Q64433
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-AUG-1990
	
	A window cannot be resized using the "resize" function in a macro.
	After Programmer's WorkBench (PWB) performs the resize function, it
	waits for the you to respond with the UP ARROW or DOWN ARROW key.
	Functions that are placed in the macro after the resize function are
	ignored. If "record on" is selected and you try to record the resizing
	of a window, the macro will stop recording until the ENTER key on the
	numeric keypad is pressed.
	
	The following is an example:
	
	   resizeit:= cancel arg arg nextmsg window resize up up up NumEnter
	
	The above example stops at the resize function and waits for you to
	resize the window. The remaining functions are ignored.
	
	To make a window a specified size, move the cursor to a location on
	the screen and then open the window with the "window" function.
	
	The following is an example of a macro that opens the "<compile>"
	window with a specified size:
	
	compile_size:= up up up up up up up up up up
	resize_it:=cancel meta down compile_size arg window window arg \
	           "<compile>" setfile window
	resize_it:ALT+U
	
	Note: The size of the compile window can be adjusted by changing the
	number of ups on the compile_size line.
