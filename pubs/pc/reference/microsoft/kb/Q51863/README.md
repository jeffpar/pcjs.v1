---
layout: page
title: "Q51863: Failure to Flag ELSEIF THEN &lt;Statement&gt; as Syntax Error"
permalink: /pubs/pc/reference/microsoft/kb/Q51863/
---

## Q51863: Failure to Flag ELSEIF THEN &lt;Statement&gt; as Syntax Error

	Article: Q51863
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50 SR# S890922-
	Last Modified: 20-SEP-1990
	
	In the products listed below, both the compiler and editor fail to
	trap an illegal block ELSEIF THEN <statement> syntax where a statement
	improperly follows on the same line as the THEN keyword. Despite the
	failure to trap this programming error, the code in the illegal syntax
	executes successfully.
	
	Microsoft has confirmed this to be a problem in the QB.EXE and BC.EXE
	environments of Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50
	for MS-DOS; in the QB.EXE and BC.EXE environments of Microsoft BASIC
	Compiler versions 6.00 and 6.00b (buglist6.00, buglist6.00b) for
	MS-DOS and MS OS/2; and in the QBX.EXE and BC.EXE environments of
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 (buglist7.00, buglist7.10). Microsoft
	is researching this problem and will post new information here as it
	becomes available.
	
	Code Example
	------------
	
	The following code violates the block IF...ELSEIF...END IF statement
	syntax, but fails to generate a syntax error. The program successfully
	prints both "Hello" and "Hello2", despite the untrapped syntax error:
	
	   IF 0 THEN
	   ELSEIF 1 THEN PRINT "Hello"
	      PRINT "Hello2"
	   END IF
	
	(In comparison, this code correctly generates a "Syntax Error" on the
	ELSEIF phrase in Microsoft QuickBASIC for Apple Macintosh systems.)
	
	As an offshoot issue, when you single-step through the above program
	in the QB.EXE or QBX.EXE editor environment with F8, the debugger
	fails to highlight the PRINT "Hello" statement but correctly
	highlights the PRINT "Hello2" statement. ("Hello" correctly prints
	despite the PRINT "Hello" not being highlighted.) When you correct the
	program by placing PRINT "Hello" on the next line, F8 in the debugger
	correctly highlights that line.
	
	The ELSEIF...THEN line is not supposed to allow any statement
	following the THEN on that line. The following is the correct,
	required syntax:
	
	   IF 0 THEN
	   ELSEIF 1 THEN
	      PRINT "Hello"
	      PRINT "Hello2"
	   END IF
