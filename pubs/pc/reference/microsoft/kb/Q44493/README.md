---
layout: page
title: "Q44493: Arrays Declared Twice in COMMON, Do Not Give Error in QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q44493/
---

## Q44493: Arrays Declared Twice in COMMON, Do Not Give Error in QB.EXE

	Article: Q44493
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 27-FEB-1990
	
	If an array is declared twice in a COMMON or a COMMON SHARED
	statement, it does not give you an error while running in the
	QuickBASIC environment. The error is correctly flagged at compile time
	with a "duplicate definition" error.
	
	Microsoft has confirmed this to be a problem in the QB.EXE shipped
	with QuickBASIC Versions 4.00, 4.00b, and 4.50 and in the QB.EXE
	shipped with Microsoft BASIC Compiler Versions 6.00 and 6.00b
	(buglist6.00, buglist6.00b). This problem was corrected in the QBX.EXE
	environment of Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	Code Examples
	-------------
	
	The following examples reproduce the problem:
	
	   'example 1
	   COMMON SHARED A$(),A$()
	
	   'example 2
	   COMMON SHARED A$()
	   COMMON SHARED A$()
	
	   'example 3
	   DIM A(200) AS DOUBLE
	   COMMON SHARED A() AS DOUBLE, B$, C$, A() AS DOUBLE
	
	   'example 4
	   COMMON SHARED A%(),
	   COMMON SHARED B#,C#,A%()
