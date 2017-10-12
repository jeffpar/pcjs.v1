---
layout: page
title: "Q39998: Search and Replace Macro for M Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q39998/
---

	Article: Q39998
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	Question:
	
	Can you write a macro to perform a search and replace on a particular
	string? When I try to do so, the replace function prompts me for a
	string argument. I want the replace function to read the string from
	the macro.
	
	Response:
	
	The following is an example of a replace macro that accepts its
	argument from inside the macro:
	
	   myreplace:=replace "oldtext" newline "newtext" newline
	
	When the myreplace macro is invoked, all the occurrences of "oldtext"
	string, from the cursor position to the end of the file, are replaced
	with the "newtext" string. The use of the newline function allows the
	macro to respond to the replace-function prompt for a string argument.
	
	To define the myreplace macro and assign it to the F12 key, enter the
	following keystrokes from inside the M editor:
	
	   ALT+A
	   MyReplace:=replace "oldtext" newline "newtext" newline
	   ALT+=
	
	   ALT+A
	   MyReplace:F12
	
	To execute the myreplace macro, press the F12 key.
