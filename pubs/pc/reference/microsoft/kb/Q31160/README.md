---
layout: page
title: "Q31160: POINT(0) and POINT(1) Problem after VIEW and WINDOW"
permalink: /pubs/pc/reference/microsoft/kb/Q31160/
---

## Q31160: POINT(0) and POINT(1) Problem after VIEW and WINDOW

	Article: Q31160
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 11-DEC-1989
	
	After a VIEW statement, the graphics functions POINT(0) and POINT(1)
	do not yield the expected results if a previous WINDOW statement has
	been executed with its x1 (minimum x) argument set to a number that is
	not an integral multiple of 0.5.
	
	For example, after executing a statement such as WINDOW
	(0.7,12.0)-(0.0,12.0) in any graphics screen mode, the coordinates
	returned by the POINT() functions will be relative to the upper-left
	corner of the screen, rather than to the viewport, as expected. This
	problem is dependent upon only the x1 argument; none of the other
	argument values cause this problem. The problem occurs both in the
	QB.EXE editor and in compiled EXE programs.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Version 6.00
	(buglist6.00) and the QB.EXE mode of Version 6.00b for MS-DOS and OS/2
	(buglist6.00b).
	
	This problem was corrected in QuickBASIC Version 4.50 (both compiled
	and QB.EXE) and under compiled mode of Microsoft BASIC Compiler
	Version 6.00b (fixlist6.00b).
	
	This problem does not exist in QuickBASIC Version 3.00.
	
	The POINT() function works correctly for x1 values that are integral
	multiples of 0.5.
	
	To recreate the problem, do the following:
	
	1. Set up a viewport in the center of the screen.
	
	2. Draw a box around the viewport.
	
	3. Define a logical coordinate system using any x and y values.
	
	4. Draw a line to the center of the viewport.
	
	5. Use POINT() functions to get the current physical coordinates.
	
	The following code demonstrates the problem:
	
	SCREEN 9
	PXMIN = 200
	PXMAX = 400
	PYMIN = 100
	PYMAX = 200
	VIEW (PXMIN, PYMIN)-(PXMAX, PYMAX)
	LINE (0, 0)-(PXMAX - PXMIN, PYMAX - PYMIN), , B
	
	XMIN = -.37   '<---(MULTIPLES OF 0.5 HERE YIELD CORRECT RESULTS)
	XMAX = 1    '      (OTHER REAL NUMBERS  GIVE DIFFERENT RESULTS)
	YMIN = 0
	YMAX = 1
	WINDOW (XMIN, YMIN)-(XMAX, YMAX)
	
	X = (XMIN + XMAX) / 2
	Y = (YMIN + YMAX) / 2
	LINE (XMIN, YMIN)-(X, Y)
	
	X = POINT(0)
	Y = POINT(1)
	LOCATE 20, 25: PRINT "POINT(0)="; X; " POINT(1)="; Y;
	LOCATE 21, 25: PRINT "CORRECT = 100            50"
	
	Given the source code above, the following is a workaround for this
	problem, using the POINT (2) and POINT(3) functions in place of the
	POINT(0) and POINT(1) functions:
	
	X = (POINT(2) - XMIN) * (PXMAX - PXMIN) / (XMAX - XMIN)
	Y = (POINT(3) - YMIN) * (PYMAX - PYMIN) / (YMAX - YMIN)
	LOCATE 22, 11: PRINT "(WORK AROUND) POINT(0)="; X; " POINT(1)="; Y;
	
	DO: LOOP UNTIL INKEY$ <> ""
	SCREEN 0
	END
