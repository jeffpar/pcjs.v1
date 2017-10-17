---
layout: page
title: "Q37417: SHELL Statement Loses Current Data in Serial Port Input Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q37417/
---

## Q37417: SHELL Statement Loses Current Data in Serial Port Input Buffer

	Article: Q37417
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 21-SEP-1990
	
	A SHELL statement will empty the input buffer (thus losing data) of
	the currently opened serial communications port (COM1 or COM2).
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	versions 4.00, 4.00b, and 4.50; in Microsoft BASIC Compiler versions
	6.00 and 6.00b (buglist6.00, buglist6.00b); and in Microsoft BASIC
	Professional Development System (PDS) version 7.00 (buglist7.00).
	
	This problem is corrected in Microsoft BASIC PDS 7.10 (fixlist7.10) if
	you compile with BC /O or run in the QBX.EXE environment. However, if
	you compile your program in 7.10 to use the BRT71xxx.EXE run-time
	module (in other words, you don't compile with BC /O), you will still
	lose data in the communications input buffer because the support for
	communications is in the run-time module, and the run-time module is
	released from memory during a SHELL to make more room for other
	programs to load. This is not a problem; it is a design limitation.
	
	To work around the problem, empty the buffer (such as with the INPUT$
	statement) before invoking the SHELL statement to retain information
	that would have been lost.
	
	The following steps reproduce the behavior:
	
	1. Open a serial port (COM1 or COM2).
	
	2. Allow the buffer to be filled.
	
	2. Using the LOC function, print out the number of bytes in the
	   buffer.
	
	3. Execute the SHELL statement with any valid parameter (such as SHELL
	   "DIR").
	
	4. Using the LOC function again, print out the number of bytes in the
	   buffer. This number will be 0 (zero).
	
	The following code will reproduce the above behavior. (Please note
	that the size of the buffer after the SHELL statement will be 0.)
	
	   OPEN "com1:9600" FOR RANDOM AS #1
	   ' This loop will allow data to begin flowing into COM1.
	   ' The loop terminates when an ESC key is pressed.
	   DO UNTIL INKEY$ = CHR$(27)
	   LOOP
	   PRINT "Size of buffer before SHELL statement: ", LOC(1)
	   PRINT
	   PRINT "press any key to shell"
	   WHILE (INKEY$ = ""): WEND
	   SHELL "dir"
	   PRINT "Size of buffer after SHELL statement: ", LOC(1)
	   CLOSE
