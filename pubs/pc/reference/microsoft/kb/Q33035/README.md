---
layout: page
title: "Q33035: History On in Debug Menu Will Not Go through Event Traps"
permalink: /pubs/pc/reference/microsoft/kb/Q33035/
---

## Q33035: History On in Debug Menu Will Not Go through Event Traps

	Article: Q33035
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	The History On feature in the Debug menu in QB.EXE Version 4.00 should
	allow you to trace backward and forward through the last 20 statements
	executed by your program. However, if the program moves to an
	event-trapping subroutine, History On will not record these statements
	and will act as if the trap never occurred.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and in the QuickBASIC that comes with Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00,
	buglist6.00b). This problem was corrected in QuickBASIC Version 4.50
	and in QBX.EXE of Microsoft BASIC Compiler Version 7.00 (fixlist7.00).
	
	The following is a sample code:
	
	'Turn on History On before running this program, and set a Breakpoint
	'either on the last line, or the next-to-last line. By pressing
	'SHIFT+F8 (History Back), the program will not step through the trap
	'routine, but just step through the FOR..NEXT loop.
	
	ON KEY(1) GOSUB KeyTrap        'Traps the F1 key.
	KEY(1) ON
	FOR i = 1 TO 100
	  PRINT "hello there";
	  PRINT i
	NEXT
	END
	KeyTrap:
	     PRINT "I'm"
	     PRINT "     in"
	     PRINT "         a"
	     PRINT "            trap!"   'Put Breakpoint here, or on the RETURN.
	     RETURN
