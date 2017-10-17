---
layout: page
title: "Q45545: QB Debugger Step Problem with Breakpoint in Watched FUNCTION"
permalink: /pubs/pc/reference/microsoft/kb/Q45545/
---

## Q45545: QB Debugger Step Problem with Breakpoint in Watched FUNCTION

	Article: Q45545
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 20-SEP-1990
	
	The Step (press F8) command in the QuickBASIC version 4.50 editor may
	not operate correctly when all of the following conditions are met:
	
	1. You declared and defined a FUNCTION procedure.
	2. You chose Add Watch or Instant Watch on the FUNCTION name.
	3. You set a breakpoint inside the FUNCTION procedure being watched.
	
	The symptom of the problem is that when the Step process (F8) begins,
	it causes the watched FUNCTION to be executed from the beginning to
	the breakpoint, instead of executing intervening lines individually
	with each press of the F8 key. Choosing Restart from the Run menu or
	pressing F8 again causes the editor to again step through the FUNCTION
	from the beginning to the breakpoint.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50; in the QB.EXE
	environment of Microsoft BASIC compiler versions 6.00 and 6.00b
	(buglist6.00, buglist6.00b); and in the QBX.EXE environment of
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS (buglist7.00, buglist7.10). We are researching
	this problem and will post new information here as it becomes
	available.
	
	To work around this problem, either remove the breakpoint from the
	watched FUNCTION, or delete the watch on the FUNCTION.
	
	Code Example
	------------
	
	After you choose Add Watch on test% and set a breakpoint on the PRINT
	"world" line, the following code example executes the FUNCTION test%
	from the beginning to the PRINT "world" line when you perform a Step
	(F8) operation:
	
	   DECLARE FUNCTION test% ()
	   x% = test%
	   END
	
	   FUNCTION test%     'Add Watch... on test%
	     PLAY "CDEFGAB>C"   'These two lines are executed
	     PRINT "Hello"      'on every Step (F8)
	     PRINT "world"    'Set Breakpoint here
	     ' Never gets here
	     test% = 1
	   END FUNCTION
	
	To work around this problem, Add Watch on x% instead of test%, or
	remove the breakpoint.
