---
layout: page
title: "Q27489: &quot;Out of String Space,&quot; Dynamic Array of Fixed-Length Strings"
permalink: /pubs/pc/reference/microsoft/kb/Q27489/
---

## Q27489: &quot;Out of String Space,&quot; Dynamic Array of Fixed-Length Strings

	Article: Q27489
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 7-FEB-1989
	
	When running the program below inside the QuickBASIC Version 4.00,
	4.00b, or 4.50 environment, an "Out of String Space" error is
	generated after fewer than 70 iterations of concatenating a variable
	length string onto a fixed-length string array element. However, the
	FRE("") and FRE(-1) functions both return the same value all the way
	through the loop. Note that the fixed-length string array element is
	part of a dynamic array, which puts it in the far heap; therefore, it
	normally does not use up any of the normal string space in the default
	data segment.
	
	The program below demonstrates an internal limitation of the QB.EXE
	interpreter that is rarely encountered. Microsoft currently does not
	plan to change this limitation.
	
	Note that fixed-length strings are not supported by QuickBASIC
	versions earlier than Version 4.00.
	
	As a workaround, please note that the problem only occurs inside the
	QuickBASIC Version 4.00 editor. When compiled to an .EXE file, the
	sample program works properly.
	
	The problem is that QuickBASIC assumes that a far fixed-length string
	will always stay far. The BASIC run-time routines must have the string
	in DGROUP to manipulate it with string functions like LTRIM$ and
	RTRIM$.
	
	LTRIM$ and RTRIM$ require two copies of the string at one point, and
	the program eventually runs out of string space in the default data
	segment, DGROUP. This behavior also occurs in a version of the
	program compiled with BC /O if the strings are made longer. This
	limitation of BASIC is inherent in its construction, and Microsoft
	currently has no plans to change this construction.
	
	The following is a code example:
	
	 REM $DYNAMIC
	 DIM srv(0) AS STRING * 28000
	 abc$ = STRING$(330,"0")
	 srv(0) = abc$
	 FOR t = 1 TO 79
	   srv(0) = RTRIM$(srv(0)) + abc$
	   PRINT t, LEN(RTRIM$(srv(0))), FRE(""), FRE(-1)
	 NEXT T
