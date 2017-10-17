---
layout: page
title: "Q57709: &quot;Typed Variable Not Allowed in Expression&quot; Using Nested Arrays"
permalink: /pubs/pc/reference/microsoft/kb/Q57709/
---

## Q57709: &quot;Typed Variable Not Allowed in Expression&quot; Using Nested Arrays

	Article: Q57709
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S891220-141 buglist7.00 fixlist7.10
	Last Modified: 20-SEP-1990
	
	Microsoft BASIC Professional Development System (PDS) version 7.00
	allows static arrays as fields of user-defined TYPEs. This feature
	allows programs to have complex data structures such as nested arrays
	(a nested array is an array of user-defined-TYPE records that contain
	an array).
	
	However, compile-time errors occur using the ERASE statement and the
	LBOUND and UBOUND functions on an array of arrays (nested in a
	user-defined TYPE) when subscripted by means of a user-defined TYPE.
	The BC.EXE compiler gives the messages "Syntax error" and "Typed
	variable not allowed in expression." This problem occurs only when the
	code is compiled with BC.EXE, not when it is compiled with QBX.EXE.
	
	The array reference needed to produce the problem looks like the
	following:
	
	   PRINT UBOUND(array2(typedvariable.field).nestedarray1)
	
	Microsoft has confirmed this to be a problem in BC.EXE in Microsoft
	BASIC Professional Development System (PDS) version 7.00 for MS-DOS
	and MS OS/2. This problem was corrected in BASIC PDS version 7.10.
	
	You can work around this problem by using a non-TYPEd variable as the
	subscript for the nested array (see the workaround example below).
	
	Code Example
	------------
	
	The following code example illustrates the problem:
	
	   TYPE Type1
	      Array1(1 TO 1) AS INTEGER
	   END TYPE
	   TYPE Type2
	      Number AS INTEGER
	   END TYPE
	   DIM Array2(1 TO 1) AS Type1
	   DIM Var AS Type2
	   Var.Number = 1
	   PRINT LBOUND(Array2(Var.Number).Array1)
	   '                   ^^^^^^^^^^ This TYPEd variable causes the error.
	
	The following code example shows a workaround for the problem:
	
	   TYPE Type1
	      Array1(1 TO 1) AS INTEGER
	   END TYPE
	   TYPE Type2
	      Number AS INTEGER
	   END TYPE
	   DIM Array2(1 TO 1) AS Type1
	   DIM Var AS Type2
	   Var.Number = 1
	   Var2% = Var.Number
	   PRINT LBOUND(Array2(Var2%).Array1)
	   '                   ^^^^^ Non-TYPEd variable will work.
