---
layout: page
title: "Q36809: Do Not Nest FOR/NEXT Loops with Same Counter Index Variable"
permalink: /pubs/pc/reference/microsoft/kb/Q36809/
---

## Q36809: Do Not Nest FOR/NEXT Loops with Same Counter Index Variable

	Article: Q36809
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 28-DEC-1989
	
	Nesting FOR...NEXT loops that use the same counter index variable is
	not legal in compiled BASIC.
	
	BC.EXE properly gives you a "FOR index variable already in use" error
	message when you nest FOR...NEXT loops with the same counter index
	variable. However, the QB.EXE environment will mistakenly allow a
	program to run.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	The program below will run without any error message inside the QB.EXE
	editing environment (and also in the GW-BASIC Interpreter Versions
	3.20, 3.22, and 3.23). The result is an infinite loop, because T% is
	always equal to "6" upon exiting the inner loop and never makes it to
	20 to terminate the outer loop.
	
	BC.EXE correctly produces the error message "FOR Index variable
	already in use" when it attempts to compile this program. This is not
	a warning error, but a severe error. When you choose the Make EXE
	File command in the QB.EXE environment, the link step is skipped and
	no .EXE file is produced.
	
	Microsoft QuickBASIC Versions 3.00 and earlier correctly do not allow
	nested loops with the same index variable, either inside the
	environment or when compiled using the separate compilation method.
	
	The following code example shows the illegal counter-index (T%) usage:
	
	   10 FOR T% = 1 TO 20
	   20   PRINT "t% =";T%
	   30   FOR T% = 1 TO 5
	   40     PRINT "Inside loop, t% =";T%
	   50   NEXT T%
	   60 NEXT T%
