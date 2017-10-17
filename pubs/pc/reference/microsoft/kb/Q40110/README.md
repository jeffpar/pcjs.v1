---
layout: page
title: "Q40110: Copying Text from Display Window to Dialog Window"
permalink: /pubs/pc/reference/microsoft/kb/Q40110/
---

## Q40110: Copying Text from Display Window to Dialog Window

	Article: Q40110
	Version(s): 2.20   | 2.20
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	Question:
	
	Is it possible to copy text from the display window down to the dialog
	window to use at the command line in Microsoft CodeView?
	
	Response:
	
	Yes, if you have a mouse. You can highlight with the mouse the section
	of text you would like to copy and press the INSERT key. The
	highlighted text will appear in the dialog box.
	
	This is very useful if you have very long variable names that you want
	to watch and don't want to retype the long variable name each time.
	Simply type a w? on the command line, then highlight the variable name
	with the mouse and press the INSERT key.
	
	Strange behavior can occur if you use the SHIFT key in combination
	with the INSERT key. For example, if you use the INSERT key on the
	extended keyboard along with the SHIFT key, it works the same as using
	INSERT alone. However, if you turn NUM LOCK off on the keypad so you
	can you the INSERT key with the SHIFT key, you will get a zero instead
	of the string of text. To get the string of text, you have to turn NUM
	LOCK on. This seems backwards because with NUM LOCK on you would
	expect to get a zero, but you get the text.
	
	The workaround is not to use the SHIFT key in conjunction with the
	INSERT key. INSERT alone works correctly.
