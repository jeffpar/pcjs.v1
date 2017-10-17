---
layout: page
title: "Q28981: Compiled with BC, SHARED Long Integer Arrays Are Wrong in SUB"
permalink: /pubs/pc/reference/microsoft/kb/Q28981/
---

## Q28981: Compiled with BC, SHARED Long Integer Arrays Are Wrong in SUB

	Article: Q28981
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 31-JAN-1990
	
	In the programs below, which are compiled with BC /o/d or BC, using
	SHARED long integer arrays in a subprogram causes variables or array
	elements to be set at zero (0) or incorrect negative values.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	You can work around this problem by placing line numbers in the
	program.
	
	Note: This problem does not occur in QuickBASIC Versions 1.x, 2.x, and
	3.x because these versions do not support long integers.
	
	The following two programs demonstrate this problem:
	
	Example 1
	---------
	
	DECLARE SUB tvf (j%, tm$, w&)  'Order of arguments does not alter results.
	DEFLNG T
	'Declaring the array to be $STATIC or $DYNAMIC makes no difference.
	DIM SHARED te6(2), te5(2), te4(2), te2(2)
	te2(2) = 100&: te4(2) = 10000&: te5(2) = 100000: te6(2) = 1000000
	DO
	  PRINT "Enter up to 8 digits"
	  LINE INPUT a$
	  CALL tvf(2, a$, w&)            'If the 2 is not passed, then it works.
	  PRINT "Value of that is "; w&
	  LOOP UNTIL a$ = ""
	END
	
	SUB tvf (j%, tm$, w&) STATIC            'Same problems if this is a function.
	    PRINT te6(j%), te5(j%), te4(j%), te2(j%)     'This line always prints OK.
	    q$ = RIGHT$("00000000" + tm$, 8)
	    t = VAL(MID$(q$, 1, 2)) * te6(j%)  'If these lines are divided up, it
	    t = t + VAL(MID$(q$, 3, 1)) * te5(j%)  'makes no difference, but if there
	    t = t + VAL(MID$(q$, 4, 1)) * te4(j%)  'are line numbers on these lines,
	    t = t + VAL(MID$(q$, 5, 2)) * te2(j%)  'IT WILL WORK!
	    PRINT te6(j%), te5(j%), te4(j%), te2(j%)
	    w& = t + VAL(MID$(q$, 7, 2))
	END SUB
	
	Example 2
	---------
	
	'-------The program includes 1 subprogram
	DECLARE SUB logtran (ntn!)
	OPTION BASE 1
	COMMON SHARED cashp&, D&(), cash$, d1$
	DIM d&(1)
	OPEN "dt.dat" FOR RANDOM AS #1
	FIELD #1, 8 AS cash$, 4 AS d1$
	d&(1)=0
	cashp& = 0
	ntn! =1
	CALL logtran (ntn!)
	END
	
	SUB logtran (ntn!) STATIC
	PRINT "ntn!:";ntn!
	LSET cash$ = MKD$(CDBL(cashp&))
	PRINT "ntn!:";ntn!
	LSET d1$=MKS$(CSNG(d&(1)))
	PRINT "ntn!";ntn!
	CLOSE
	END SUB
	
	Output for the example 2:
	
	ntn! 1
	ntn! 1
	ntn! -5.965761E-30
