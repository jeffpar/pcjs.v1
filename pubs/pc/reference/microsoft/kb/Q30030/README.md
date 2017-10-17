---
layout: page
title: "Q30030: M.EXE Editor Macro to Join Current Line with Next Line"
permalink: /pubs/pc/reference/microsoft/kb/Q30030/
---

## Q30030: M.EXE Editor Macro to Join Current Line with Next Line

	Article: Q30030
	Version(s): 1.00    | 1.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 29-AUG-1988
	
	The following macro will join the current line with the following
	line, leaving one space between the last character on the current line
	and the first character of the next line.
	   Place the following three lines in the [M] and/or [MEP] section(s)
	of your TOOLS.INI file, or enter them from the keyboard using the
	ASSIGN function (ALT+= in the default keyboard setup):
	
	   ;Macro to join current line with next line.
	       join:=endline right arg down begline sdelete
	       join:alt+j
	
	   The following is a description of how the join macro works:
	
	   1. Endline moves one place beyond the last character on the current
	      line.
	   2. Right moves one character further, to insert a space.
	   3. arg introduces the argument to the next command (in this case,
	      sdelete).
	   4. down begline moves to the first character on the next line.
	
	   This process defines a Streamarg for the command sdelete (S stands
	for Stream).
	   Note that sdelete should be used, not ldelete, because the down
	begline sequence would have defined either a Linearg or a Boxarg,
	neither of which would join the lines.
	   Use sdelete because it closes the stream of characters and/or white
	space between the starting cursor position and the ending cursor
	position.
