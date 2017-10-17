---
layout: page
title: "Q34682: Communications (COM1:, COM2:) Receive Buffer Lost During CHAIN"
permalink: /pubs/pc/reference/microsoft/kb/Q34682/
---

## Q34682: Communications (COM1:, COM2:) Receive Buffer Lost During CHAIN

	Article: Q34682
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 8-FEB-1990
	
	The communications receive buffer is cleared when chaining to another
	module; at this point, data can be lost. This problem occurs only in a
	compiled .EXE program, and does not occur in the QB.EXE editor.
	Compiling with the BC /d (debug) option does not help. Data received
	at the communications port after the CHAIN operation is received
	normally.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00,
	buglist6.00b). This problem was corrected in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 (fixlist7.00).
	
	The programs below demonstrate the problem:
	
	   ' File: P1.BAS
	   OPEN "com1:1200,e,7,1,cs,ds" FOR RANDOM AS #2
	   for x=1 to 10000 :next
	   y=loc(2)
	   print y;
	   CHAIN "p2"    'Chain to second program and print out buffer size
	
	   ' File: P2.BAS
	   a$=input$(loc(2),2)
	   print a$;
	
	   ' File:P.bas
	   'This program will send the characters
	   open "com1:1200,e,7,1,cs,ds" for random as #1
	   print "start"
	   for x=1 to 10000
	   print #1, x;
	   next x
	   close #1
