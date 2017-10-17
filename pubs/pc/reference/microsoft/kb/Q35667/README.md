---
layout: page
title: "Q35667: OP Parameter Fails to Make OPEN &quot;COM1:&quot; Wait Indefinitely"
permalink: /pubs/pc/reference/microsoft/kb/Q35667/
---

## Q35667: OP Parameter Fails to Make OPEN &quot;COM1:&quot; Wait Indefinitely

	Article: Q35667
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 12-DEC-1989
	
	The manuals listed below incorrectly state that if the OP serial
	communications parameter is specified without a value, the OPEN COM
	statement will wait indefinitely for the port to be opened. The OPEN
	COM statement will actually wait only 10 seconds.
	
	This correction applies to the following manuals on Pages 298 and 299:
	
	1. "Microsoft QuickBASIC 4.0: BASIC Language Reference" manual for
	   Versions 4.00 and 4.00b
	
	2. "Microsoft BASIC Compiler 6.0: BASIC Language Reference" for
	   Versions 6.00 and 6.00b for MS OS/2 and MS-DOS
	
	This error also occurs on Page 255 of "Microsoft QuickBASIC 4.5: BASIC
	Language Reference" for Version 4.50.
	
	This error has been corrected in the Microsoft BASIC PDS Version 7.00
	documentation.
	
	Code Examples:
	-------------
	
	The following program demonstrates that you still get a time-out using
	the OP parameter:
	
	DEFINT A-Z
	PRINT "wait for open"
	OPEN "com1:19200,n,8,,OP,rb4048" FOR RANDOM AS #1
	PRINT "opened"
	.
	.
	.
	END
	
	As a workaround, you can use the following program, which will wait
	indefinitely with the error handler returning to the OPEN COM line
	until it is opened:
	
	ON ERROR GOTO check
	trial = 0
	OPEN "com1:9600,n,8,,OP,rb4048" FOR INPUT AS #1
	PRINT "opened...."
	END
	check:
	        IF ERR = 24 THEN
	                trial = trial + 1
	                PRINT "open attempt#"; trial
	                RESUME
	        ELSE
	                PRINT "fatal error abort"
	                END
	        END IF
