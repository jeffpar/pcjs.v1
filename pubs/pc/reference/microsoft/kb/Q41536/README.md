---
layout: page
title: "Q41536: PRINT TAB Can Change Value of Parameter in Subprogram"
permalink: /pubs/pc/reference/microsoft/kb/Q41536/
---

## Q41536: PRINT TAB Can Change Value of Parameter in Subprogram

	Article: Q41536
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 SR# S890216-214
	Last Modified: 14-FEB-1991
	
	The code below demonstrates that a variable that has been passed to a
	subprogram procedure may incorrectly be changed by a PRINT TAB(n)
	statement. However, the same statement in the main module does not
	cause the error.
	
	The problem can be avoided by not using the PRINT TAB(n) statement, or
	by assigning a local variable to the passed parameter in the SUB and
	using the local variable in the PRINT TAB(n) statement, or by
	compiling with the BC /X option. (The /X compiler switch is normally
	used only to flag an ON ERROR statement with RESUME, RESUME NEXT, or
	RESUME 0.)
	
	Microsoft has confirmed this to be a problem in an .EXE program
	compiled with BC.EXE in QuickBASIC version 4.50. No problem occurs in
	the QB.EXE environment. We are researching this problem and will post
	new information here as it becomes available.
	
	The program example below works correctly with all versions of
	QuickBASIC earlier than version 4.50.
	
	Code Example
	------------
	
	DECLARE SUB testsub (row%)
	row% = 9
	' this line is ok -- it is in the main module
	LOCATE row%, 1: PRINT "main line row%= "; row%; TAB(38); row%;
	row% = 10
	CALL testsub(row%)
	END
	
	SUB testsub (row%)
	  LOCATE row%, 1: PRINT "Sub row%= "; row%;
	  ' The value of row% prints incorrectly:
	  PRINT TAB(38); "row now = "; row%
	END SUB
	
	To work around the problem in QuickBASIC 4.50, print a local variable
	instead of the passed parameter, for example:
	
	SUB testsub (row%)
	  x%=row%
	  LOCATE row%, 1: PRINT "Sub row%= "; row%;
	  PRINT TAB(38); "row now = "; x%      ' x% prints ok.
	END SUB
