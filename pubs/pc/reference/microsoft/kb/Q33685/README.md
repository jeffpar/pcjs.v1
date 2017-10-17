---
layout: page
title: "Q33685: &quot;Illegal Function Call&quot; Using SCREEN 0 Pages, then SCREEN 1"
permalink: /pubs/pc/reference/microsoft/kb/Q33685/
---

## Q33685: &quot;Illegal Function Call&quot; Using SCREEN 0 Pages, then SCREEN 1

	Article: Q33685
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 5-DEC-1988
	
	When invoking multiple video pages (as in SCREEN 0) and then switching
	to a SCREEN that does not support multiple pages (SCREEN 1), the error
	"Illegal function call" will occur on the second SCREEN statement, as
	in the following example:
	
	   SCREEN 0,,1,0
	   SCREEN 1       'This gives "Illegal function call"
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the Microsoft BASIC Compiler Version 6.00 for
	MS-DOS and MS OS/2 (buglist6.00). This problem was corrected in
	QuickBASIC Version 4.50.
	
	A workaround is to reset both pages to zero with another SCREEN
	statement just before changing screen modes, as in the following code
	example:
	
	SCREEN 0,,1,0
	SCREEN 0,,0,0  'Resets both pages to 0
	SCREEN 1
