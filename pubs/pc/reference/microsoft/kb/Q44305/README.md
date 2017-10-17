---
layout: page
title: "Q44305: TIME&#36; Problem in IF Statement at Midnight (24:00:00)"
permalink: /pubs/pc/reference/microsoft/kb/Q44305/
---

## Q44305: TIME&#36; Problem in IF Statement at Midnight (24:00:00)

	Article: Q44305
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 20-SEP-1990
	
	The following program demonstrates a possible programming mistake with
	the TIME$ function in the Microsoft QuickBASIC environment. If you
	test the TIME$ function twice in one IF statement, the returned time
	may change between invocations and give you a conditional result that
	you did not expect. In the example below, the symptoms occur only
	intermittently during the tenth of a second at midnight (24:00:00). To
	correct this programming mistake, you should assign the value returned
	by TIME$ to a temporary string variable, which can then be reliably
	tested multiple times in the IF statement.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS; and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS. (Programs compiled
	with BC.EXE may not be as sensitive to this timing issue as the QB.EXE
	or QBX.EXE environment.)
	
	When run inside the QuickBASIC environment (QB.EXE), the two TIME$
	functions in the following program may return different values
	(depending upon timing) and sometimes make the IF statement STOP the
	program. You might think that the IF statement should never be
	executed, and the programmed loop should continue until you press
	CTRL+BREAK. But after the program runs long enough, it will eventually
	show the behavior in QB.EXE or QBX.EXE. This behavior may not occur in
	the executable version (.EXE) of the program.
	
	To correct this programming error, assign a string variable to the
	TIME$ function and execute the IF statement using this variable
	instead of TIME$, as noted in the commented portions of the program
	below.
	
	The following code demonstrates this behavior. At 24:00:00, this
	program will (sometimes) unexpectedly execute the IF statement. The
	faster the machine, the more likely the behavior will show up. The
	behavior occurs only during the tenth of a second at midnight, since
	at that time, the TIME$ function may return 24:00:00 and then 00:00:00
	at the next invocation. You may have to run the program a number of
	times to demonstrate the behavior, since it does not occur every time.
	
	CLS
	MISSED:
	       TIME$ = "23:59:00"
	START:
	       '*** The IF statement below sometimes executes, even though
	       '*** you may have thought it was not logically possible:
	       IF TIME$ >= "10:00:00" AND TIME$ < "16:59:58" THEN STOP
	       'To correct this behavior, replace the line above with the
	       'following two lines:
	       '  TimeVar$ = TIME$
	       '  IF TimeVar$ >= "10:00:00" AND TimeVar$ < "16:59:58" THEN STOP
	       LOCATE 3, 1
	       PRINT TIME$
	       '*** If program didn't stop, reset time and try again:
	       IF MID$(TIME$, 5, 1) = "1" THEN GOTO MISSED
	       GOTO START
	
	If you implement the correction shown above, the program will not stop
	in QB.EXE or QBX.EXE until you press CTRL+BREAK.
