---
layout: page
title: "Q27139: WIDTH Over 255 Not Trapped as Error in Version 4.00 Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q27139/
---

## Q27139: WIDTH Over 255 Not Trapped as Error in Version 4.00 Editor

	Article: Q27139
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 22-JAN-1990
	
	If a width greater than 255 is used in the WIDTH statement, no error
	is generated within the QuickBASIC editor. No error is given by either
	the editor or BC.EXE if the width is specified using a variable.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	The maximum allowable width that can be specified using the WIDTH
	statement is 255. If a number greater than that is given, the error
	"Math overflow" should be generated. However, this message is not
	given when running in the editor or when the WIDTH argument is
	assigned to a variable.
	
	Results of testing with previous versions indicate that an error
	message is correctly given in the Version 3.00 editor.
	
	The following is a code example:
	
	open "cons:" for output as #1
	a = 400
	width #1, a   ' If 400 is used instead of "a", the error is correctly
	              ' flagged when compiled with BC.EXE.
