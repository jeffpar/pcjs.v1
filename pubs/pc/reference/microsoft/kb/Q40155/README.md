---
layout: page
title: "Q40155: QB.EXE 4.50 Bad Alert Box if User TYPE &quot;Element Not Defined&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q40155/
---

## Q40155: QB.EXE 4.50 Bad Alert Box if User TYPE &quot;Element Not Defined&quot;

	Article: Q40155
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 SR# S890104-76 ptm234
	Last Modified: 8-MAR-1989
	
	In QuickBASIC Version 4.50, if you attempt to run a program that
	contains erroneous use of user-defined typed variables (specifically,
	an "element not defined" error), QuickBASIC may bring up an alert box
	that contains irrelevant information, and possibly garbage.
	
	This problem occurs only in Microsoft QuickBASIC Version 4.50 for
	MS-DOS. Microsoft is researching this problem and will post new
	information as it becomes available.
	
	This problem is not an issue if you always make sure to define all
	elements of a user-defined TYPE before using them.
	
	Consider the following program:
	
	TYPE Test
	  x AS INTEGER
	  y AS DOUBLE
	END TYPE
	DIM Var AS Test
	PRINT Var
	
	To reproduce the problem, do the following:
	
	1. Run this program as is. You should get a "Type mismatch" error
	   message on the PRINT statement.
	
	2. Change the PRINT statement line to print out an element of Var that
	   does not exist (for example, PRINT Var.z).
	
	Attempting to run the modified version of the program will produce an
	alert box that contains completely random, irrelevant information,
	often incomplete sentences, sometimes single words or characters, and,
	occasionally, incomprehensible garbage.
	
	If the program is run again without changing it, the same information
	will appear in the alert box. However, if the PRINT statement is
	changed again (i.e., to another element that does not exist), a new
	alert box is produced, with different, meaningless information. If
	this is repeated several times (making a change, running the program,
	making a change, running the program, etc., about 30 times), the alert
	box itself may be garbled or incomplete and the machine eventually
	will hang.
	
	However, if a change is made to the DIM statement line (even a
	noncritical edit, such as inserting a line before the DIM statement),
	you will get the correct "Element not defined" error when you run the
	program. The problem will not recur from this point on, until you
	change the PRINT statement back to just PRINT Var, and run to get the
	"Type Mismatch" error message.
