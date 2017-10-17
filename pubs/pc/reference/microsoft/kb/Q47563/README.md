---
layout: page
title: "Q47563: CTRL+A and CTRL+B Bytes Stripped from String Constants in .EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q47563/
---

## Q47563: CTRL+A and CTRL+B Bytes Stripped from String Constants in .EXE

	Article: Q47563
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890721-81 B_BasicCom
	Last Modified: 29-JAN-1991
	
	BC.EXE in QuickBASIC version 4.50 strips out the characters CTRL+A and
	CTRL+B (ASCII 1 and 2) from quoted strings at compile time, whereas
	QB.EXE allows these characters. Inside QB.EXE, a CONST or a variable
	assigned a value of a literal STRING consisting of the CTRL+A or
	CTRL+B characters correctly has both a length and a graphics
	representation. In an .EXE program compiled with BC.EXE, neither one
	has a length or a graphics representation. This is a limitation with
	BC.EXE in QuickBASIC version 4.50, but not with earlier versions.
	
	This design limitation also applies to BC.EXE in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2. QBX.EXE 7.00 and 7.10 allows ASCII 1 and 2 values
	in quoted strings.
	
	BC.EXE reserves the ASCII 1 and 2 bytes to internally represent
	end-of-statement and end-of-line. QB.EXE and QBX.EXE are more lenient
	in allowing ASCII 1 and 2 bytes to be used in strings.
	
	Code Example
	------------
	
	To enter the ASCII character 01 or 02 (smiley or inverse smiley face)
	into a quoted string within the QB.EXE or QBX.EXE environment, you
	must press CTRL+P followed by CTRL+A or CTRL+B. In the following
	program, the caret symbol (^) represents holding down the CTRL key
	while pressing the next key:
	
	   CONST a = "^P^A"    ' Smiley face representation of CTRL+A
	   CONST b = "^P^B"    ' Inverse smiley face representation of CTRL+B
	
	   a1$ = "^P^A"
	   b1$ = "^P^B"
	
	   PRINT a, a1$, CHR$(1), LEN(a1$)
	   PRINT b, b1$, CHR$(2), LEN(b1$)
	
	Note that the functions CHR$(1) and CHR$(2) return the same ASCII
	values (01 and 02) at run time as pressing CTRL+A and CTRL+B at edit
	time. The problem does not occur if you print the function CHR$(1) or
	CHR$(2), or assign either to a string variable. To work around the
	problem, assign CHR$(1) and CHR$(2) to a string variable (but not to a
	CONST constant). For example:
	
	   a1$ = CHR$(1)
	   b1$ = CHR$(2)
	   PRINT a1$, CHR$(1), LEN(a1$)   ' Works fine in .EXE
	   PRINT b1$, CHR$(2), LEN(b1$)   ' Works fine in .EXE
