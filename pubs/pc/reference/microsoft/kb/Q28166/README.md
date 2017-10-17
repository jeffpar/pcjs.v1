---
layout: page
title: "Q28166: QB Uses Up Default String Space When Concatenating Far String"
permalink: /pubs/pc/reference/microsoft/kb/Q28166/
---

## Q28166: QB Uses Up Default String Space When Concatenating Far String

	Article: Q28166
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 2-FEB-1990
	
	Problem:
	
	When running the program below inside the QB.EXE environment, after
	about 72 iterations of concatenating a variable-length string onto a
	fixed-length string, an "Out of String Space" error is generated.
	However, the FRE("") and FRE(-1) functions both return the same value
	all the way through the loop. Note that the array of fixed-length
	strings is dynamically allocated, putting it into the far heap.
	
	The program runs properly when compiled and run as an EXE file.
	
	Response:
	
	The problem is that QuickBASIC assumes that a far fixed-length string
	will always stay far.
	
	However, the BASIC run-time routines must have the string in DGROUP in
	order to manipulate it with string functions like LTRIM$ and RTRIM$.
	LTRIM$ and RTRIM$ require two copies of the string at one point, and
	the program eventually runs out of string space in the default data
	segment in DGROUP. This will also happen in a version of the program
	compiled with BC /O if the strings are made longer. This limitation of
	BASIC is inherent in its construction, and Microsoft currently has no
	plans to change this construction.
	
	The following is a code example:
	
	   REM $DYNAMIC
	   DIM srv(0) AS STRING * 28000
	
	   abc$ = STRING$(330,"0")
	
	   srv(0) = abc$
	   FOR t = 1 to 79
	      srv(0) = RTRIM$(srv(0)) + abc$
	      PRINT t, LEN(RTRIM$(srv(0))), FRE(""), FRE(-1)
	   NEXT t
