---
layout: page
title: "Q52170: Bad LINE Drawn Using Coordinates Far Outside WINDOW Viewport"
permalink: /pubs/pc/reference/microsoft/kb/Q52170/
---

## Q52170: Bad LINE Drawn Using Coordinates Far Outside WINDOW Viewport

	Article: Q52170
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 buglist4.00 buglist4.00b buglist4.50
	Last Modified: 20-SEP-1990
	
	Using the LINE statement with coordinate values that significantly
	exceed the coordinate limits set by the WINDOW statement can produce
	unexpected results.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	3.00, 4.00, 4.00b, and 4.50; in Microsoft BASIC Compiler versions 6.00
	and 6.00b (buglist6.00, buglist6.00b); and in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10
	(buglist7.00, buglist7.10). This problem was partially corrected in
	Microsoft BASIC PDS versions 7.00 and 7.10 (fixlist7.00, fixlist7.10)
	as shown in Example 1. At run time, BASIC PDS 7.00 and 7.10 correctly
	flag the negative number in Example 1 as an overflow. However, BASIC
	PDS 7.00 and 7.10 incorrectly handle the overflow case in Example 2
	(buglist7.00, buglist7.10), allowing an incorrect LINE statement
	(reversed top to bottom, and incorrect coordinate values) to be drawn.
	
	To work around these problems, a LINE statement should not be executed
	with coordinate values that significantly exceed the logical
	dimensions of the current viewport set by the WINDOW statement. The
	amount that you must exceed the coordinate limits to get the problem
	is variable and difficult to predict.
	
	Code Example 1
	--------------
	
	The problem occurs in Example 1 under the following conditions:
	
	1. The Y-coordinates for the WINDOW statement have a difference of 32
	   or less. For example: WINDOW (0, 1880)-(20, 1912)
	
	2. The parameters on the LINE statement are less than -1800 when the
	   coordinates of the WINDOW statement are greater than 1850.
	
	The following code shows the problem in QuickBASIC 3.00, 4.00, 4.00b,
	and 4.50, but correctly gives "Overflow" error in BASIC PDS 7.00 and
	7.10:
	
	CLS
	xl! = 0: xu! = 20!
	yl! = 1880!: yu! = 1912!   'Values that have a difference less than 32
	SCREEN 9
	COLOR 9
	VIEW (50, 56)-(639, 336)       'Set up maximum viewport coordinates
	WINDOW (xl!, yl!)-(xu!, yu!)   'Set up window to view
	READ r!
	PSET (0, r!)
	FOR j = 2 TO 13
	  READ r!
	  LINE -(j * 1.5, r!)
	NEXT j
	DATA 1881,1887,1881,1840,-1881,1887,1883,-1827,1890,1882,-1807,1883,1887
	          'DATA statement contains the numbers that fall within
	          'the needed range for the problem.
	END
	
	Code Example 2
	--------------
	
	This code displays the LINE problem in BASIC PDS 7.00 and 7.10, as
	well as in QuickBASIC 3.00, 4.00, 4.00b, 4.50. If you use a value for
	r! a little above 1069 in the LINE statement, the line should go down,
	but instead it goes up in this example. Note that PMAP invoked on the
	integer boundaries says you can use 1066 or 1067 as a minimum
	coordinate that could be trapped, but using 1069, which is above this
	limit, still incorrectly draws the line instead of giving an
	"Overflow" error.
	
	ON ERROR GOTO checkerror
	CLS
	xl! = 0: xu! = 20!
	yl! = 1880!: yu! = 1890!
	SCREEN 12
	COLOR 9
	VIEW (50, 64)-(639, 463)
	WINDOW (xl!, yl!)-(xu!, yu!)
	READ r!
	PRINT r!
	PSET (0, r!)
	FOR j = 2 TO 13
	   READ r!
	   PRINT r!, POINT(1), POINT(3)
	   LINE -(j * 1.5, r!)
	NEXT j
	DATA 1881,1887,1881,1887,1881,1887,1069
	DATA 1072,1890,1882,1840,-1887,1887
	END
	checkerror:
	   yll! = PMAP(32762, 3)
	   yul! = PMAP(-32762, 3)
	   xll! = PMAP(-32762, 2)
	   xul! = PMAP(32762, 2)
	   PRINT "Axis limits "; xll!; xul!; yll!; yul!
	RESUME NEXT
