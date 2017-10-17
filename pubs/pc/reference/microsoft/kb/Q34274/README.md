---
layout: page
title: "Q34274: How to Perform Spell Checking in M"
permalink: /pubs/pc/reference/microsoft/kb/Q34274/
---

## Q34274: How to Perform Spell Checking in M

	Article: Q34274
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 29-AUG-1988
	
	Question:
	   Does the Microsoft Editor have any spell checking capabilities?
	
	Response:
	   The M editor does not have built-in spell checking. If you have a
	separate spell-check program you can write a macro to invoke it on
	your current file.
	   For example, you could use the spell checker that comes with
	Microsoft Word Version 4.00 by doing the following:
	
	    [M]
	        ...
	        Spell:=Arg "spell-am " Curfile Shell
	        Spell:ALT+S
	
	   The macro works as follows:
	
	   1. Arg introduces an argument to the shell command.
	   2. "spell-am" is the name of the spell-check utility
	      included in Word Version 4.00.
	   3. Curfile is the name of the current file you are editing. Note
	      the space at the end of "spell-am "; this space is needed so the
	      argument you pass to Shell is "spell-am YourCurrentFile" instead
	      of "spell-amYourCurrentFile".
	   4. The Shell command invokes COMMAND.COM and passes it the
	      spell-am command. When spell-am completes its spell-check,
	      it will return to the editor.
