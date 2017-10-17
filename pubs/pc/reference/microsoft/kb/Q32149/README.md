---
layout: page
title: "Q32149: &quot;Duplicate Definition&quot; in QB.EXE; &quot;Equals Missing&quot; in BC.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q32149/
---

## Q32149: &quot;Duplicate Definition&quot; in QB.EXE; &quot;Equals Missing&quot; in BC.EXE

	Article: Q32149
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	If a line of code in the QuickBASIC editor begins with two occurrences
	of the same nonreserved word, the second word will be correctly
	flagged as a "Duplicate definition" when either the Start or Make EXE
	File command is chosen on the Run menu. If the same word is used as
	a variable elsewhere in the program, it will give a "Duplicate
	definition" error at that occurrence of the word.
	
	To generate the "Duplicate definition" message, enter "a a" in the
	QuickBASIC editor, then choose Start on the Run menu. Please note
	that the line "a a" generates a different message, "Equal sign
	missing," when compiled with BC.EXE.
	
	The "Duplicate definition" message occurs because the editor assumes
	the first "a" to be the name of a SUBprogram and the second "a" to be
	a parameter to be passed to the SUBprogram. Routines and variables
	must have different names.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b and 4.50,
	to the QuickBASIC compiler that comes with Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to the QBX.EXE
	that comes with Microsoft BASIC PDS Version 7.00 for MS-DOS and MS
	OS/2.
	
	The following code example produces a "Duplicate definition" error on
	the second "a":
	
	   a a
	
	The following code example produces a "Duplicate definition" error on
	the first line:
	
	   a = 1
	   a a
