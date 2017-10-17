---
layout: page
title: "Q67107: Far FIELD Variable Assigned to Itself Doesn't UnFIELD in PDS"
permalink: /pubs/pc/reference/microsoft/kb/Q67107/
---

## Q67107: Far FIELD Variable Assigned to Itself Doesn't UnFIELD in PDS

	Article: Q67107
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S901114-86
	Last Modified: 5-DEC-1990
	
	When using far strings in the example below, BASIC Professional
	Development System (PDS) doesn't unFIELD a FIELDed variable when that
	variable is assigned to itself. The variable does get unFIELDed if the
	program is compiled with near strings or compiled in earlier versions
	of BASIC, or if the variable is assigned to a new value.
	
	This information applies to Microsoft BASIC PDS versions 7.00 and 7.10
	for MS-DOS and MS OS/2.
	
	This behavioral inconsistency emphasizes the point that you should
	never make your program depend on a variable being unFIELDed. You
	should set the contents of a FIELDed variable only with the LSET or
	RSET statement; never assign values to FIELDed variables with LET or
	direct assignment.
	
	If you want to use and reassign a variable without affecting the
	FIELDed buffer, copy the FIELDed variable to a permanent variable that
	is not used in a FIELD statement. Better yet, for easier programming,
	Microsoft recommends using user-defined TYPE variables instead of
	FIELD statements for defining random-access file records.
	
	Reference:
	
	The following is taken from the FIELD statement description on page
	131 of the "Microsoft BASIC 7.0: Language Reference" manual for
	versions 7.00 and 7.10:
	
	   Do not use a variable name defined as a field in an INPUT or
	   assignment statement if you want the variable to remain in a field.
	   Once a variable name is a field, it points to the correct place in
	   the random-access file buffer. If a subsequent INPUT or assignment
	   statement with that variable name is executed, the variable's
	   pointer no longer refers to the random-access record buffer, but to
	   string space.
	
	The example below describes a specific exception to the last sentence,
	where the variable still points to the random-access record buffer and
	not to a new location in string space.
	
	Code Example
	------------
	
	First, create a text file "data.dat" that contains the following
	data on one line:
	
	   abcd defg hijk lmno pqrs tuvw xyz1 2345 6789
	
	Then run the following program in QBX.EXE, or as an .EXE compiled with
	BC /Fs (the far variable-length strings option):
	
	DEFSTR A-Z
	OPEN "data.dat" FOR RANDOM AS #1 LEN = 15
	FIELD #1, 5 AS a, 5 AS b, 5 AS c
	GET #1   ' Get first 15 bytes.
	 PRINT a; b; c
	GET #1   ' Get next 15 bytes.
	a = a
	 PRINT a; b; c
	GET #1   ' Get next 15 bytes.
	 PRINT a; b; c
	CLOSE #1
	
	With far strings, the above example will give an output of the
	following:
	
	   abcd defg hijk
	   lmno pqrs tuvw
	   xyz1 2345 6789
	
	The above output shows that the variable "a" was retained as a FIELDed
	variable. Adding a null string, for example < a = a + "" >, also does
	not cause the variable to be unFIELDed.
	
	However, if the line < a = a > is changed to < a = "test" >, then the
	variable "a" becomes unFIELDed, and the output will be as follows:
	
	   abcd defg hijk
	   test pqrs tuvw
	   test 2345 6789
	
	The variable is only unFIELDed when it is changed.
