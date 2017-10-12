---
layout: page
title: "Q35537: Developing Macros"
permalink: /pubs/pc/reference/microsoft/kb/Q35537/
---

	Article: Q35537
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | appnote
	Last Modified: 4-MAY-1989
	
	The following information is taken from an application note called
	"Microsoft Editor Questions and Answers." The application note also is
	available from Microsoft Product Support Services by calling (206)
	454-2030.
	
	Develop my Own Macros
	
	Developing a macro is similar to programming in a high-level language.
	Each macro represents a command. Instead of a collection of library
	routines, you have a collection of editor functions. You begin with an
	idea of a process that you would like to be performed by simply
	pressing one keystroke.
	
	Suppose you would like to be able to move the cursor to the lower-left
	corner of the editing window. You know you can do this "manually" with
	the arrow keys that are assigned to the "Left" and "Down" editor
	functions. However, it can be simplified more. "Meta Down" moves the
	cursor to the bottom of the window; "Meta Begline" moves the cursor to
	the first column of the line. Together, these functions will do the
	job.
	
	This macro must now be given a unique name, for example, "Bottom". The
	TOOLS.INI statement would look as follows:
	
	   Bottom:=Meta Begline Meta Down
	
	A macro also can be a combination of other macros. The following is an
	example:
	
	   Waydown:=Meta Down
	   Wayleft:=Meta Begline
	   Bottom:=Waydown Wayleft
	
	Suppose that the "Meta Begline" command did not exist. You would need
	to find some way to know that the cursor is in the first column.
	Almost all of the editor functions have boolean (TRUE/FALSE) Return
	Values that can be useful in developing macros.
	
	For the "Bottom" macro, you know that "Begline" will at least move the
	cursor to the first nonblank character on the line. Any further cursor
	movement would have to be done using "Left". "Left" returns TRUE when
	the cursor moves and FALSE when the cursor does not move.
	
	You would want to move left until the cursor does not move anymore,
	i.e., move left until "Left" returns FALSE. The editor allows you to
	do this with Macro Conditionals. The following is an example:
	
	   Bottom:=Begline :>LT Left +>LT Meta Down
	
	   :>LT   defines a label LT
	   +>LT   if Left returns TRUE, go to label LT
	          if Left returns FALSE, continue
	
	Macro Conditionals and a table of Return Values can be found in the
	"Microsoft Editor User's Guide."
	
	The final step is to assign the macro to a keystroke, as follows:
	
	   Bottom:CTRL+END
