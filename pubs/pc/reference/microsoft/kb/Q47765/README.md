---
layout: page
title: "Q47765: CopyBox Function Doesn't Work Across Files"
permalink: /pubs/pc/reference/microsoft/kb/Q47765/
---

## Q47765: CopyBox Function Doesn't Work Across Files

	Article: Q47765
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_C S_Pascal H_Fortran H_MASM
	Last Modified: 26-SEP-1989
	
	CopyBox is a C-extension function for the Microsoft editor that is
	designed to copy square regions of text from one location to another,
	including to another file.
	
	This function works properly when copying to the same file, but fails
	when copying to another file. The function appears to work
	successfully, but the copied text does not appear in the target file.
	This lack of functionality has been corrected in Version 1.02 of the
	editor.
	
	You can work around this problem by using the GetLine and PutLine
	functions. A line can be read from the source file, trimmed to get the
	proper portion of the line, and then written to the target file. This
	procedure must be followed for each line of the box to copy.
