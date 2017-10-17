---
layout: page
title: "Q31161: LINE INPUT Avoids INPUT Statement's &quot;Redo from Start&quot; Error"
permalink: /pubs/pc/reference/microsoft/kb/Q31161/
---

## Q31161: LINE INPUT Avoids INPUT Statement's &quot;Redo from Start&quot; Error

	Article: Q31161
	Version(s): 1.00 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_BasicInt B_GWBasicI B_MQuickB
	Last Modified: 28-DEC-1989
	
	To avoid the "Redo from Start" error message encountered when
	incorrect input is entered in response to an INPUT statement, use the
	LINE INPUT statement instead. (The INPUT statement's "Redo from Start"
	error message cannot be trapped or handled with the ON ERROR GOTO
	statement.)
	
	However, because LINE INPUT accepts all characters until it encounters
	a carriage return, you must parse the input string yourself using
	string manipulation (for example, MID$, INSTR) and type conversion
	(for example, VAL).
	
	This information applies to the following Microsoft retail BASIC
	products:
	
	1. Microsoft BASIC Compiler Versions 5.35, 5.36, 6.00, and 6.00b for
	   MS-DOS
	
	2. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	3. Microsoft BASIC Interpreter Version 5.28 for MS-DOS
	
	4. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23
	
	5. Microsoft BASIC Interpreter Versions 1.x, 2.x, and 3.00 for the
	   Apple Macintosh
	
	6. Microsoft BASIC Compiler Version 1.00 for the Apple Macintosh
	
	7. QuickBASIC Version 1.00 for the Apple Macintosh
