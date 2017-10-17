---
layout: page
title: "Q37774: &quot;Hit Any Key...&quot; If CHAIN or RUN from Error Handler; BC /O"
permalink: /pubs/pc/reference/microsoft/kb/Q37774/
---

## Q37774: &quot;Hit Any Key...&quot; If CHAIN or RUN from Error Handler; BC /O

	Article: Q37774
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 12-DEC-1989
	
	When two programs, both compiled with BC /O/X, CHAIN or RUN between
	one another, a "Hit any key to continue" error message is displayed if
	the CHAIN or RUN occurs in an error-handler routine. This problem does
	not occur if the programs are compiled to use the BASIC run-time
	module (without /O).
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00b and 4.50 (buglist4.00b, buglist4.50), and Microsoft
	BASIC Compiler Versions 6.00 and 6.00b (buglist6.00 buglist6.00b) for
	MS-DOS and OS/2. This problem was corrected in Microsoft BASIC PDS
	Version 7.00 (fixlist7.00).
	
	To work around this problem, use RESUME <label> to return program
	control to a label that contains the CHAIN statement.
	
	The following is a code example:
	
	'==== Prog a ====
	ON ERROR GOTO trap
	ERROR 57
	END
	trap:
	   PRINT "error in a"
	   'uncomment the next line to get the programs to work
	   'RESUME leave
	leave:
	 CHAIN "b"
	 stop
	
	'==== Prog b ====
	ON ERROR GOTO trap
	ERROR 57
	END
	trap:
	   PRINT "error in b"
	   'uncomment the next line to get the programs to work
	   'RESUME leave
	leave:
	   CHAIN "a"
	   stop
