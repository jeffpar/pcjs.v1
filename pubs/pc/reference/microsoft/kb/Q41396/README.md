---
layout: page
title: "Q41396: In QB, &quot;Blank lines Not Allowed before SUB/FUNCTION&quot; Misleads"
permalink: /pubs/pc/reference/microsoft/kb/Q41396/
---

## Q41396: In QB, &quot;Blank lines Not Allowed before SUB/FUNCTION&quot; Misleads

	Article: Q41396
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50
	Last Modified: 17-FEB-1989
	
	In the QB.EXE editor in QuickBASIC Versions 4.00, 4.00b, and 4.50, if
	the syntax of the parameter list in a SUB or FUNCTION statement is
	incorrect and the ENTER key is used to move to the next line, the
	following misleading error message is displayed:
	
	   "Blank lines not allowed before SUB/FUNCTION line. Is Remark OK?"
	
	If you select the "OK" option, a remark (') line is inserted AFTER the
	SUB or FUNCTION line, and the correct error message is then displayed.
	The message may differ based on what the actual error is.
	
	If you use the Mouse or ARROW keys (instead of the ENTER key) to move
	to the next line, the correct error message will then display. (You
	will not receive the incorrect error message, and a remark line will
	not be inserted after the SUB or FUNCTION line.)
	
	Microsoft is researching the initially misleading error message and
	will post new information as it becomes available.
	
	When using the ENTER key to move to the next line, the QuickBASIC
	Environment will not allow you to leave the SUB/FUNCTION line until
	the syntax error has been corrected. However, you can move to another
	line using the Mouse or ARROW keys without correcting the error.
	
	Moving to another line without correcting the error in a SUB or
	FUNCTION line is not a good idea. Various editing steps within the
	same window following this can cause unexpected results. The following
	example will hang the machine:
	
	1. Type in the following program:
	
	        CALL test(X)
	        SUB test(X)
	          PRINT
	        END SUB
	
	   (The Subprogram is displayed in its own window.)
	
	2. Edit the SUB statement so that it is incorrect (e.g. by deleting
	   the right parenthesis):
	
	        SUB test(X
	
	3. Press the ENTER key to produce the events described above.
	
	4. Attempt to enter another SUB or FUNCTION statement following
	   the END SUB statement.
	
	5. You will receive one or two incorrect error messages as described
	   previously.
	
	6. You will then receive one or two correct messages:
	
	     "END SUB or END FUNCTION must be last statement in window"
	
	7. If you ignore the messages and enter the SUB or FUNCTION statement,
	   the machine will hang, possibly requiring a cold boot.
