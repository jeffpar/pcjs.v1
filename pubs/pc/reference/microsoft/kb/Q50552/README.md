---
layout: page
title: "Q50552: QB.EXE Hangs If BACKSPACE after IF GOTO Syntax (with No THEN)"
permalink: /pubs/pc/reference/microsoft/kb/Q50552/
---

## Q50552: QB.EXE Hangs If BACKSPACE after IF GOTO Syntax (with No THEN)

	Article: Q50552
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 16-DEC-1989
	
	When editing a legal IF GOTO syntax that has no THEN word, if you
	press the BACKSPACE key in the column beneath the "I" in the "IF"
	statement, the computer hangs.
	
	This problem occurs in the QB.EXE editor in Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS and in QB.EXE in Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS (buglist6.00,
	buglist6.00b). This problem was corrected in QBX.EXE in Microsoft
	BASIC PDS (Professional Development System) Version 7.00
	(fixlist7.00).
	
	The hanging problem does not occur when you use the THEN word in the
	IF <condition> THEN GOTO syntax.
	
	The following is a code example:
	
	   IF x=0 GOTO label
	
	While the cursor is in the column beneath the "I" in the "IF"
	statement (the first column), press the BACKSPACE key to hang the
	machine.
