---
layout: page
title: "Q47510: Watch Value and Watchpoint Ignored During Event or ERROR Trap"
permalink: /pubs/pc/reference/microsoft/kb/Q47510/
---

## Q47510: Watch Value and Watchpoint Ignored During Event or ERROR Trap

	Article: Q47510
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 13-DEC-1989
	
	When using ON ERROR GOTO or any of the ON event GOSUB statements
	(where event includes KEY, TIMER, COM, PEN, PLAY, and STRIG),
	watchpoints or watch values will not function while you are in the ON
	ERROR GOTO or ON <event> GOSUB subroutine. Watch values will show the
	default value for the type of variable (either 0 or a null string),
	and watchpoints will not halt the program.
	
	This behavior occurs in the QB.EXE editor for QuickBASIC Versions
	4.00, 4.00b, 4.50 and the QB.EXE editor for Microsoft BASIC Compiler
	Versions 6.00 and 6.00b. This behavior is a known design limitation of
	these versions of QuickBASIC and is not an error.
	
	The QBX.EXE editor for Microsoft BASIC PDS 7.00 has been enhanced
	so that you may now use watchpoints and watch values in ON ERROR GOTO
	and ON <event> GOSUB subroutines.
	
	The following example demonstrates the limitation:
	
	ON TIMER (5) GOSUB 1000
	TIMER ON
	WHILE INKEY$ = "" : WEND
	END
	
	1000 PRINT "In routine"
	     FOR x = 1 TO 10
	       PRINT x
	     NEXT x
	     RETURN
	
	Execute the program with a watchpoint or watch value for the variable
	"x". The watchpoint will not halt the program in the FOR NEXT loop as
	you would expect. If you set a breakpoint inside the FOR NEXT loop,
	you will also see that a watch value on "x" will always report a value
	of 0.
