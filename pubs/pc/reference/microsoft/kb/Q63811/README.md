---
layout: page
title: "Q63811: Illegal RESUME NEXT Hangs QBX After ON LOCAL ERROR RESUME NEXT"
permalink: /pubs/pc/reference/microsoft/kb/Q63811/
---

## Q63811: Illegal RESUME NEXT Hangs QBX After ON LOCAL ERROR RESUME NEXT

	Article: Q63811
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900615-135 buglist7.00 buglist7.10
	Last Modified: 6-AUG-1990
	
	QBX.EXE hangs if an illegal RESUME NEXT statement is encountered in an
	IF statement inside a SUB where the statement ON LOCAL ERROR RESUME
	NEXT is active. This problem does not occur in a compiled and linked
	.EXE program.
	
	Microsoft has confirmed this to be a problem with QBX.EXE in Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS. We are researching this problem and will post new information
	here as it becomes available.
	
	The problem can be worked around by knowing and not programming
	illegal "RESUME without error" conditions.
	
	Instead of hanging the program below, the QBX environment should
	return an Error 20 ("RESUME without error"), which means that there is
	no active error-handling routine from which to RESUME. Error 20 should
	then have been automatically handled by the ON LOCAL ERROR RESUME NEXT
	statement (which does a valid RESUME NEXT).
	
	A RESUME NEXT statement by itself is only valid when it is within an
	error-handling routine that was an object of an ON [LOCAL] ERROR GOTO
	<linelabel> statement. When the program below is compiled and linked
	into an EXE, the .EXE does not hang, and it correctly returns and
	handles error 20.
	
	Code Example
	------------
	
	The following code example hangs QBX.EXE on the indicated line. Note
	that this program shows illegal usage of the second RESUME NEXT, which
	should have produced error 20. When run as an .EXE program, this code
	successfully returns error 20 and handles the error correctly with the
	local error handler:
	
	CALL test
	SUB test
	  ON LOCAL ERROR RESUME NEXT
	  ERROR 1
	  ' The following RESUME NEXT is a programming error:
	  IF ERR = 1 THEN RESUME NEXT   '*** This line hangs in QBX.EXE
	  ' The above statement correctly causes error 20 ("RESUME without
	  ' error") in a .EXE program, and ERR now returns 20 and prints as
	  ' follows:
	  PRINT "This is next line after programming error 20, and ERR= "; ERR
	  PRINT "Now ending subprogram"
	END SUB
