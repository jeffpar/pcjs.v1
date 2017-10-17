---
layout: page
title: "Q39382: QuickBASIC 4.50 QB.EXE Does Not Allow CTRL+P, ESC Sequence"
permalink: /pubs/pc/reference/microsoft/kb/Q39382/
---

## Q39382: QuickBASIC 4.50 QB.EXE Does Not Allow CTRL+P, ESC Sequence

	Article: Q39382
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881209-34 buglist4.50
	Last Modified: 21-DEC-1988
	
	The QuickBASIC Version 4.50 editor will not allow you to insert the
	escape key code (ASCII 27) into a BASIC program by pressing CTRL+P
	followed by either ESC or CTRL+[.
	
	Note: QB.EXE Versions 4.00 and 4.00b do allow you to type a CTRL+P
	followed by either ESC or CTRL+[ and thereby insert a CHR$(27) byte
	into either a REMark or a quoted string.
