---
layout: page
title: "Q62820: In SUB, Variable-Length Near String Array Element Losing Value"
permalink: /pubs/pc/reference/microsoft/kb/Q62820/
---

## Q62820: In SUB, Variable-Length Near String Array Element Losing Value

	Article: Q62820
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900603-3 buglist7.00 fixlist7.10
	Last Modified: 2-NOV-1990
	
	A program compiled with the Near Strings option (without BC /Fs) may
	lose the value of a variable-length string array element under the
	specific conditions described in this article.
	
	The same program will run correctly when run from the QBX.EXE
	environment or when compiled with the Far Strings option (with BC
	/Fs).
	
	Microsoft has confirmed this to be a problem with the BC.EXE 7.00
	compiler provided with Microsoft BASIC Professional Development System
	(PDS) version 7.00 for MS-DOS and MS OS/2. This problem was corrected
	in BASIC PDS 7.10.
	
	This problem does not occur in earlier versions of Microsoft BASIC
	Compiler (BC.EXE).
	
	Here is a description of the conditions under which the problem occurs
	(as shown in Examples 1 and 2):
	
	Two variable-length string arrays are dimensioned. Array "A" may be
	dimensioned either dynamically or statically. Array "B" must be
	dimensioned dynamically. Array "B" will lose a value even though the
	program never changes it. A string value is assigned to an element in
	array "B" and this array element is passed as a parameter to a SUB.
	Array "A" is passed to the same SUB either through a parameter list or
	by using SHARED in the DIM statement. Inside the SUB, an element in
	array "A" is directly assigned to a string value returned by the
	RTRIM$, LTRIM$, LEFT$, MID$, or RIGHT$ function. Array "B" is not
	assigned any values in the SUB. But when control is returned to the
	main-level code (or calling procedure), the string value that was
	assigned to an element in array "B" is lost.
	
	The following two examples exhibit the problem. Both examples pass an
	element in B$() as a parameter variable. In the first example, array
	A$() is declared globally in a DIM SHARED statement. In the second
	example, A$() is passed as a parameter to the SUB.
	
	Example 1
	---------
	
	DECLARE SUB TheSub (temp$)
	REM $DYNAMIC
	DIM SHARED A$(1)
	DIM B$(1)
	B$(1) = "bas"
	PRINT B$(1)
	CALL TheSub(B$(1))
	PRINT B$(1)         'There is no longer anything in B$(1).
	END
	
	SUB TheSub (temp$)
	     A$(1) = RTRIM$("   bob    ")
	END SUB
	
	Example 2
	---------
	
	DECLARE SUB TheSub (temp1$(), temp2$)
	REM $DYNAMIC
	DIM A$(1), B$(1)
	B$(1) = "bas"
	PRINT B$(1)
	CALL TheSub(A$(), B$(1))
	PRINT B$(1)        'There is no longer anything in B$(1).
	END
	
	SUB TheSub (temp1$(), temp2$)
	     temp1$(1) = RTRIM$("   bob    ")
	END SUB
	
	To work around the problem, alter the program with any one of the
	following choices:
	
	1. Compile with the Far Strings option (BC /Fs).
	
	2. Statically dimension the array that loses its value.
	
	3. Remove the RTRIM$ statement.
	
	4. Assign a temporary string variable to the string returned by
	   RTRIM$, then assign this temporary variable to the desired element
	   in array "B".
	
	The next program is an example of using workaround 4 described above:
	
	DECLARE SUB TheSub (temp$)
	REM $DYNAMIC
	DIM SHARED A$(1)
	DIM B$(1)
	B$(1) = "bas"
	PRINT B$(1)
	CALL TheSub(B$(1))
	PRINT B$(1)         'B$(1) now contains the correct value.
	END
	
	SUB TheSub (temp$)
	     dummy$ = RTRIM$("   bob    ")  'Use a temporary string variable
	     A$(1) = dummy$                 'to work around the problem.
	END SUB
