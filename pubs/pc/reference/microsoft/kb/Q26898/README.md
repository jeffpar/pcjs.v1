---
layout: page
title: "Q26898: CASE Statement Never Executed When Tracing with F8 Key in QB"
permalink: /pubs/pc/reference/microsoft/kb/Q26898/
---

## Q26898: CASE Statement Never Executed When Tracing with F8 Key in QB

	Article: Q26898
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 8-FEB-1990
	
	When a CASE statement is selected inside the QuickBASIC Version 4.00
	or 4.00b editor as a breakpoint, that CASE is never executed when
	tracing through the program using the F8 key.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and the QB.EXE editor provided with Microsoft BASIC
	Compiler Versions 6.00 or 6.00b for MS-DOS and MS OS/2 (buglist6.00,
	buglist6.00b). This problem was corrected in QuickBASIC Version 4.50
	and in the QBX.EXE environment of Microsoft BASIC Professional
	Development System (PDS) Version 7.00 (fixlist7.00). QuickBASIC 4.50
	and BASIC PDS 7.00 do not allow CASE statements to become breakpoints,
	and will give an appropriate error message when an attempt is made to
	make a CASE statement a breakpoint.
	
	In the following example, the PRINT "a$= "; a$ statement is never
	executed when the line CASE "a" is set as a breakpoint.
	
	Results of testing with previous versions indicate that Version 3.00
	will allow the CASE statement to execute when it is set as a
	breakpoint.
	
	The following code example demonstrates the problem:
	
	CLS
	a$ = "a"
	SELECT CASE a$
	        CASE "a"                  'Set as breakpoint and PRINT "a$..." is
	             PRINT "a$= "; a$     'never executed when step through using
	        CASE ELSE                 'F8.
	END SELECT
	PRINT "done"                      'always executed
	END
