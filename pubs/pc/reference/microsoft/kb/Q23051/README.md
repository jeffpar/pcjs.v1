---
layout: page
title: "Q23051: Creating Macros for the Microsoft Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q23051/
---

## Q23051: Creating Macros for the Microsoft Editor

	Article: Q23051
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 1-SEP-1988
	
	Macros for the Microsoft Editor are sequences of editor functions. For
	example, a macro to delete the word to the right of the cursor is
	defined as follows:
	
	worddelete:=arg meta pword sdelete
	
	The above macro is named "worddelete". To associate "worddelete" with
	a particular keystroke, the following command is needed:
	
	worddelete:ALT+W
	
	The macro "worddelete" is now bound to the keystroke "ALT+W". Note
	that the macro definition (i.e., ":=") resembles a Pascal assignment
	statement, but the keybinding uses a colon to delimit the macro name
	from the key to which it is assigned. The following is another
	example:
	
	filestamp:=curfilenam curfileext " - " curdate " " curtime
	filestamp:ALT+S
	
	This macro creates a file-time stamp that contains the filename, the
	current date, and the current time; it is assigned to the keystroke
	"ALT+S".
