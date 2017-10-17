---
layout: page
title: "Q42473: &quot;Overflow&quot; Error Might Be the Result of 0/0"
permalink: /pubs/pc/reference/microsoft/kb/Q42473/
---

## Q42473: &quot;Overflow&quot; Error Might Be the Result of 0/0

	Article: Q42473
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890309-179 B_BasicCom
	Last Modified: 13-DEC-1989
	
	When the error "Overflow" is encountered in a Microsoft QuickBASIC
	program, one possibility is to check for a zero divided by zero (0/0)
	condition.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2; and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	Any numeric value divided by zero will produce the error "Division By
	Zero," but zero (0) being divided by zero produces a special floating-
	point exception. This error will cause the compiler to respond with an
	"Overflow" message.
	
	Both of these errors are correct. The machine could respond by either
	a "Division By Zero" error or an "Overflow" error, depending on the
	following factors:
	
	1. Is the computer using a coprocessor?
	
	2. Is the coprocessor functioning correctly?
	
	3. What operating system are you using? (There was a problem with
	   PC-DOS Version 3.20.)
	
	When diagnosing an "Overflow" error, you may wish to first determine
	if the expression reduces to zero divided by zero. This might save you
	work trying to figure out why your expression is overflowing (or
	exceeding some numerical limit).
	
	The following is a code example:
	
	b# = 5
	c# = 5
	PRINT (b#-c#) / (b#-c#) ' This will result in an "Overflow" error
