---
layout: page
title: "Q34810: QB.EXE Search and &quot;Change...&quot; on Line Label in IF...GOTO Hangs"
permalink: /pubs/pc/reference/microsoft/kb/Q34810/
---

## Q34810: QB.EXE Search and &quot;Change...&quot; on Line Label in IF...GOTO Hangs

	Article: Q34810
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	The QB.EXE editor hangs when using the Change option from the Search
	menu to replace a line label that is contained in an IF <cond> GOTO
	<linelabel> statement.
	
	You can work around this problem by putting a THEN in the IF...GOTO
	statement (i.e., IF...THEN GOTO) before selecting Change from the
	Search menu.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b and the QuickBASIC editor that comes with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (buglist6.00, buglist6.00b). This problem was corrected in
	QuickBASIC Version 4.50 and in QBX.EXE of Microsoft BASIC Compiler
	Version 7.00 (fixlist7.00).
	
	When the Change feature proceeds to the line containing the searched
	line label or number, it prompts you with "Change, Skip, Quit." When
	you press "C" to change the highlighted item, the line label
	disappears and the computer hangs.
	
	The following code example demonstrates the problem:
	
	10 a = a + 1
	20 PRINT a
	30 IF a < 10 GOTO 10
	40 PRINT "A = 10!"
	
	In the above program, perform Change from the Search menu on the line
	number 10. It will change the first 10, but will hang on the second
	one.
	
	To work around the problem, insert a THEN into the IF statement as
	follows:
	
	30 IF a < 10 THEN GOTO 10
