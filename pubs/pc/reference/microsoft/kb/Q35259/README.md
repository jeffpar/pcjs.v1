---
layout: page
title: "Q35259: How to Read the Contents of the M Editor Clipboard"
permalink: /pubs/pc/reference/microsoft/kb/Q35259/
---

	Article: Q35259
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 31-MAR-1989
	
	The Clipboard is contained in a pseudofile named <clipboard>. It can
	be loaded the same way any other file is loaded. The contents of the
	Clipboard pseudofile can be examined in several ways.
	
	The pseudofile <clipboard> can be loaded with the command sequence Arg
	textarg Setfile, which is ALT-A <clipboard> F2 in default keystrokes.
	This process loads the named file. The contents of the clipboard then
	can be seen on the screen, and even can be edited and saved as a
	separate file.
	
	The file also can be loaded by bringing up the information file with
	the INFORMATION function (SHIFT-F1).
	
	Finally, if the clipboard is the file most recently switched from, the
	SETFILE function (F2) alone will call it up.
	
	The information file describes the nature of the Clipboard contents in
	two ways. The Clipboard line appears in the form in the list of
	files, as follows:
	
	<clipboard>                    *n lines
	
	Additionally, at the bottom of the information file is a line that
	gives information in one of two ways, as follows:
	
	n lines in line clipboard
	
	n lines in box clipboard
	
	This information indicates whether the Clipboard holds a block of text
	or a stream of text.
