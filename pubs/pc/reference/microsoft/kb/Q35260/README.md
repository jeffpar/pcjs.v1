---
layout: page
title: "Q35260: How to Write Selected Text to a File in M Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q35260/
---

	Article: Q35260
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 1-NOV-1988
	
	To write a block or stream of text from a file currently being edited
	to another file (either new or currently existing), do the following:
	
	1. Select text by using Arg (ALT+A) and the cursor movement keys.
	
	2. Put the text block or stream into the Clipboard by using the
	   functions Copy (CTRL+INSERT, or + on the keypad) or Ldelete
	   (CTRL+Y) or Sdelete (DELETE).
	
	3. Load the desired new file (see the "Working with Multiple Files"
	   section of the "Microsoft Editor" manual).
	
	4. Paste (SHIFT+INSERT) the contents of the Clipboard into the new
	   file.
	
	When writing to a file that does not yet exist, another procedure can
	be used, as follows:
	
	1. Write the selected text to the Clipboard as described above.
	
	2. Use Setfile to load the <clipboard> pseudofile the same way that
	   other files are loaded.
	
	3. When the Clipboard contents appear on the screen, save the file to
	   the desired new filename with Arg Arg textarg Setfile (ALT+A ALT+A
	   filename F2). If a file by that name already exists, it will be
	   overwritten.
	
	4. Return to the originally edited file with Setfile (F2).
	
	The second method can be put into a macro in one of the following two
	ways:
	
	1. Create a macro definition for copying to a file of prespecified name
	   by using, for example, the following:
	
	sendtofil:=copy arg "<clipboard>" setfile arg arg "foo.txt" setfile
	setfile
	
	Assign the macro to a keystroke with an argument of the following
	form, for example:
	
	sendtofil:alt+s.
	
	This macro can be placed in TOOLS.INI, or can be the textarg in the
	command to enter a macro, as follows:
	
	Arg textarg Assign (ALT+A textarg ALT+=).
	
	2. Create a macro definition for copying to a file of any name by
	   using two macros in sequence, for example, as follows:
	
	send1:=copy arg "<clipboard>" setfile arg arg
	send2:=setfile setfile
	
	Enter and assign them as described above. To execute this set of
	macros, select the text block or stream, execute the first macro, type
	the desired filename, then execute the second macro.
