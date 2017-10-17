---
layout: page
title: "Q40631: QB.EXE 4.x Won't Trace or Single Step through KEY Routine"
permalink: /pubs/pc/reference/microsoft/kb/Q40631/
---

## Q40631: QB.EXE 4.x Won't Trace or Single Step through KEY Routine

	Article: Q40631
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 SR# S881220-50 ptm240
	Last Modified: 8-MAR-1989
	
	When single stepping or tracing through a program, the QB.EXE Version
	4.00, 4.00b, or 4.50 editor executes key-trapping or event-trapping
	routines correctly, but fails to display the tracing through the
	routine unless you place a breakpoint there.
	
	Microsoft has confirmed this to be a problem in Versions 4.00 and
	4.00b. We are researching this problem and will post new information
	as it becomes available.
	
	QuickBASIC Version 3.00 successfully displays the single stepping or
	tracing through key-trapping or event-trapping routines.
	
	This article applies to all forms of ON Event GOSUB, where the
	Event can be COM(n), KEY(n), PEN, PLAY(q), STRIG(n), and TIMER(n).
	
	To trace through a program in QuickBASIC Versions 4.x, choose the
	Debug menu, toggle the Trace On option, and run the program. (In
	QuickBASIC Version 3.00, insert the statement TRON as the first
	statement of the program and run it.)
	
	To Single Step through a program in QuickBASIC Versions 4.x, press F8
	repeatedly. (In QuickBASIC Version 3.00, you need to choose DEBUG from
	the Run menu, then press F8 repeatedly.)
	
	When you single step or trace the program below in the QuickBASIC
	Versions 4.00, 4.00b, and 4.50 editors, press F1 or F2 while the
	program is waiting for INPUT activates the key-trapping routine. After
	you press ENTER to terminate the INPUT, the editor executes the
	key-trapping routine but does not display the single stepping or
	tracing.
	
	To work around this behavior, set a breakpoint at the label of the
	key-handling routine to stop execution at the label. Then, the QB.EXE
	editor correctly single steps or traces through the key routine. You
	can press F5 to continue tracing or press F8 for single stepping.
	
	The following is a code example:
	
	ON KEY(1) GOSUB KeyRoutine1
	ON KEY(2) GOSUB KeyRoutine2
	KEY(1) ON
	KEY(2) ON
	WHILE 1
	INPUT "Press F1 or F2 and then hit ENTER key", X$
	WEND
	END
	KeyRoutine1: 'Must set a breakpoint here to single step
	                   'or trace through this routine.
	   PRINT "inside key routine 1"
	   RETURN
	KeyRoutine2: 'Must set a breakpoint here to single step
	                   'or trace through this routine.
	   PRINT "inside key routine 2"
	   RETURN
