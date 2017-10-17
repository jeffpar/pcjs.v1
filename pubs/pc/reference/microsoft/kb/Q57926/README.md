---
layout: page
title: "Q57926: &quot;Subscript out of Range&quot; Long-Integer Array in IF/THEN in 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q57926/
---

## Q57926: &quot;Subscript out of Range&quot; Long-Integer Array in IF/THEN in 4.50

	Article: Q57926
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 SR# S900117-6
	Last Modified: 31-JAN-1990
	
	The QuickBASIC Version 4.50 program shown below produces a "Subscript
	out of range" error if compiled with the BC /D (debug) switch. This
	appears to be caused by a compiler optimization problem for the
	particular combination of using a long-integer variable to subscript a
	long-integer array in an IF ... THEN statement.
	
	If the program is run from the QB.EXE environment or is not compiled
	with the BC /D switch, the error does not occur.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Version 4.50. We are researching this problem and will post new
	information here as it becomes available.
	
	This problem does not occur in versions of QuickBASIC prior to
	Version 4.50, in Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, or in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	The following program exhibits the behavior:
	
	   DIM a(10) AS LONG
	   a(1) = 5
	   k& = 5
	   i& = 1
	   IF a(i&) = k&  THEN
	      a(i&) = -k&       'this statement causes the error to occur
	   END IF
	
	Compile and link the program as follows:
	
	   BC /D TEST;
	   LINK TEST;
	
	The "Subscript out of range" error does not occur if the IF ... THEN
	syntax is removed or if the variables i and k are of any type other
	than long integers.
	
	To work around the problem, replace the problem-assignment statement,
	a(i&) = -k&, with either of the following equivalent assignments:
	
	   1. a(i&) = k&
	      a(i&) = -a(i&)
	
	   2. a(i&) = -a(i&)
