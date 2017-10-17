---
layout: page
title: "Q26006: &quot;Illegal Function Call&quot; from EXE Using Coprocessor"
permalink: /pubs/pc/reference/microsoft/kb/Q26006/
---

## Q26006: &quot;Illegal Function Call&quot; from EXE Using Coprocessor

	Article: Q26006
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | TAR68499
	Last Modified: 31-OCT-1988
	
	When compiled with BC (/o and /d options make no difference) and run
	on a machine equipped with a math coprocessor, the following program
	generates an "Illegal function call" message at run time.
	
	   SCREEN 1            'fails in any graphics mode
	   OPEN "file4" FOR RANDOM AS #4
	   CLOSE #4
	   WINDOW (-320, -100)-(320, 100)
	   FOR x = -202 TO 202 STEP 4
	      aspect = ABS(202 / x) * 5 / 12
	      IF aspect < 1 THEN
	         radius = 20 / aspect
	      ELSE radius = 20
	      END IF
	      y = 40 * SQR(1 - x ^ 2 / 40804)
	      CIRCLE (x, y), radius, , , , aspect
	      CIRCLE (x, -y), radius, , , , aspect
	   NEXT x
	
	In QuickBASIC Version 4.00, if you use the DOS command SET NO87="none"
	to turn off the coprocessor, or if you run inside the QuickBASIC
	editor, the program executes successfully. The program also runs
	properly in QB and QB87 in QuickBASIC Version 3.00.
	
	This is not an error in the QuickBASIC Version 4.00 software.
	
	The behavior of the above program in Version 4.00 is due to a
	difference in the way optimization is handled between the editor and
	BC. The error occurs in the following line:
	
	   y = 40 * SQR(1 - x ^ 2 / 40804)
	
	When the program is run inside the editor this line is ultimately
	evaluated as follows:
	
	   y = 40 * SQR( 0 )
	
	However, as an EXE, the same line results in an attempt to find the
	SQR of a negative number; the same number rounded to zero in the
	editor.
	
	To work around the problem, assign (1 - x^2 / 40804) to an
	intermediate variable, set the intermediate variable to zero if it is
	less than zero, and use the intermediate value in the SQR function.
