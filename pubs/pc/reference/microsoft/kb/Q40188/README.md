---
layout: page
title: "Q40188: FRE(-2) Returns Fixed Lowest Value Even After Stack Shrinks"
permalink: /pubs/pc/reference/microsoft/kb/Q40188/
---

## Q40188: FRE(-2) Returns Fixed Lowest Value Even After Stack Shrinks

	Article: Q40188
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 20-SEP-1990
	
	The FRE(-2) function returns in bytes the amount of unused stack space
	available for the program.
	
	However, when the stack-space allocation decreases, the value returned
	by FRE(-2) stays fixed at the smallest size that was unused by the
	stack up to that point of program execution. In other words, the
	values successively returned by FRE(-2) never increase -- they either
	decrease or stay the same.
	
	Microsoft has confirmed this to be a problem in QuickBASIC in versions
	4.00, 4.00b, and 4.50; in Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b); and in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
	
	The sample program below demonstrates this behavior. The example given
	is a recursive subprogram that reports the value of FRE(-2) on the way
	down and back up through 10 levels of subprogram recursion. As the
	stack space increases with the level of recursion, the value of
	FRE(-2) decreases as expected. However, as the stack space decreases
	with lower levels of recursion, the value reported by FRE(-2) stays
	"bottomed out" at the lowest value reached during recursion.
	
	The only way to reset the "bottomed-out" value returned by FRE(-2) is
	to end the program or execute a CLEAR statement. Note: CLEAR erases
	all variables and closes all files. In some cases, as shown in Example
	2, adding an INPUT statement before the FRE(-2) allows FRE(-2) to go
	back up. Adding INPUT does not help Example 1.
	
	Example 1
	---------
	
	The following code example demonstrates a case in which FRE(-2) goes
	down and stays down:
	
	   DECLARE SUB test (num)
	   CLS
	   PRINT "Before any calls, FRE(-2):"; FRE(-2)
	   CALL test(0)
	   END
	   SUB test (num)
	     PRINT "Call number"; num; "on the way DOWN, FRE(-2):"; FRE(-2)
	     IF num < 9 THEN
	       CALL test(num + 1)
	     ELSE
	       PRINT "Bottom of recursion reached."
	     END IF
	     PRINT "Call number"; num; "on the way UP, FRE(-2):"; FRE(-2)
	   END SUB
	
	Example 2
	---------
	
	The following example demonstrates a case in which adding an INPUT
	statement lets the value returned by FRE(-2) go back up:
	
	   DECLARE SUB foo ()
	   DEFINT A-Z
	   CLS
	   'INPUT k   ' Adding this INPUT statement makes FRE(-2) go back up.
	   PRINT FRE(-2)
	   a$ = "Test string"
	   CALL foo
	   PRINT FRE(-2)
	   END
	
	   SUB foo
	   SHARED a$
	   PRINT "hello "; a$
	   END SUB
