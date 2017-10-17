---
layout: page
title: "Q32151: QB.EXE Hang After Editing &quot;Duplicate Definition&quot; in SHARED"
permalink: /pubs/pc/reference/microsoft/kb/Q32151/
---

## Q32151: QB.EXE Hang After Editing &quot;Duplicate Definition&quot; in SHARED

	Article: Q32151
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	The sample program below demonstrates a problem in the QB.EXE editor
	after editing a variable in a SHARED statement that is the source of a
	"Duplicate Definition" error. Inconsistent problems can occur, such as
	hanging the editor or losing characters in the file after doing a
	Save.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the version of QuickBASIC provided with the
	Microsoft BASIC Compiler Versions 6.00 and 6.00b (buglist6.00,
	buglist6.00b) for MS-DOS and MS OS/2. This problem was corrected in
	QuickBASIC Version 4.50 and in the QBX.EXE of the Microsoft BASIC
	Compiler Version 7.00 (fixlist7.00).
	
	The following steps demonstrate the problem:
	
	1. Run the sample program below in the QB.EXE Version 4.00 or 4.00b
	   editor. A "Duplicate Definition" error correctly displays.
	
	2. Delete the character "c" from "c%" in the second SHARED statement.
	
	It is now possible for the editor to hang or cause the source code to
	be incompletely saved when you perform a save.
	
	The following is a code example:
	
	   DECLARE SUB testsub ()
	   DIM c%(2, 2)
	   CALL testsub
	
	   SUB testsub
	   SHARED a, b, c%()
	   SHARED x$, c%()
	   END SUB
