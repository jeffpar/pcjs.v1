---
layout: page
title: "Q34913: QB.EXE &quot;String Space Corrupt&quot; Editing First Label in SUB"
permalink: /pubs/pc/reference/microsoft/kb/Q34913/
---

## Q34913: QB.EXE &quot;String Space Corrupt&quot; Editing First Label in SUB

	Article: Q34913
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 12-DEC-1989
	
	The QuickBASIC QB.EXE editor displays the error message "String Space
	Corrupt" when you perform the following steps:
	
	1. Run QB.EXE and type the following subprogram:
	
	   sub anyname
	   label:
	
	2. Position the cursor on the first column of the line that contains
	   the label, then press the BACKSPACE key. The "String Space Corrupt"
	   error message displays, control drops back to DOS, and the computer
	   hangs, forcing you to restart it.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b, and in the QuickBASIC editor that comes with
	the Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (buglist6.00, buglist6.00b). Microsoft has corrected this
	problem in QuickBASIC Version 4.50 and in the QBX.EXE environment of
	the Microsoft BASIC PDS Version 7.00 (fixlist7.00).
	
	This problem does not occur if the subroutine has parameters, or if the
	first line in the subprogram contains anything other than a label.
