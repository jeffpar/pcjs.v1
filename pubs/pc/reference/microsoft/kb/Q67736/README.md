---
layout: page
title: "Q67736: "missing ':' in -&gt;" Caused by Control Character"
permalink: /pubs/pc/reference/microsoft/kb/Q67736/
---

	Article: Q67736
	Product: Microsoft C
	Version(s): 1.00 1.10 | 1.00 1.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 14-DEC-1990
	
	When invoking the Programmer's WorkBench (PWB), if there is a control
	character at the end of the TOOLS.INI file, [usually a CTRL+Z (ASCII
	26) end-of-file marker] and you only have a [pwb] tagged section, an
	error message will appear stating "missing ':' in ->". Note that the
	"->" is the graphic right-arrow symbol.
	
	This is not a problem in the PWB. A control character is a legal macro
	name. The message indicates that a macro definition or key assignment
	is expected after the character. To keep this message from appearing,
	place the tag
	
	   [end]
	
	before the control character at the end of your TOOLS.INI file. With
	this tag at the end of the file, you always suppress the message, even
	if you edit TOOLS.INI with an editor that inserts CTRL+Z's at the end
	of the file. This is because the -> symbol must be within the [pwb]
	tagged section for this error message to be displayed, and the [end]
	tag forces the -> into its own tagged section.
	
	Simply deleting the control character will work until you edit the
	file with an editor that replaces the CTRL+Z, then this message
	reappears. This may also when using the COPY command to concatenate
	files.
