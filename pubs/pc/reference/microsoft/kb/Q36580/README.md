---
layout: page
title: "Q36580: How Tabs Are Treated in the Microsoft Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q36580/
---

	Article: Q36580
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 14-OCT-1988
	
	Problem:
	
	Some text editors preserve tab characters automatically. These editors
	maintain tabs (ASCII 9 characters) as they are stored in a file, and
	distinguish between tab characters and spaces.
	
	The Microsoft Editor translates tab characters into spaces. This
	behavior only affects lines that you modify. If you load and save a
	file without changing any lines of text, the lines are written back to
	disk with all tab characters and spaces intact. Only the modified
	lines are affected by this conversion.
	
	It is not possible to disable this translation of tab characters into
	spaces in a modified line.
	
	In the Microsoft Editor, "tab"  is both a function name and the name
	of a key. The TAB key is assigned to the tab function by default. As a
	function, tab is nothing more than a move-to-next-column movement
	function. The placement of columns in determined by the TABSTOPS
	switch.
	
	When ever you edit a line, tab characters are translated to space
	characters using the FILETAB switch. So modified lines in the file are
	stored in the editor with spaces only. The FILETAB switch determines
	how the editor translates tab characters to spaces when reading in a
	line of text. If ENTAB is set to 1 or 2, then FILETAB also determines
	how the editor translates spaces to tabs when you save the file to
	disk. (Again, only modified lines are affected.)
	
	If you need to view the tabs as they are situated in your file you can
	use the TABDISP switch to show you which spaces will be compressed
	into a tab character at the next write to the disk file.
