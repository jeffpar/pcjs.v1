---
layout: page
title: "Q66560: &quot;Illegal Function Call&quot; Using Coprocessor in BASIC 7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q66560/
---

## Q66560: &quot;Illegal Function Call&quot; Using Coprocessor in BASIC 7.10

	Article: Q66560
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S901018-77 buglist7.00 buglist7.10
	Last Modified: 12-NOV-1990
	
	The following program gives an "Illegal Function Call" error when run
	as a .EXE program using a math coprocessor; however, it works
	correctly in the QBX.EXE environment or with the coprocessor disabled.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2. We are researching this problem and will post new
	information here as it becomes available.
	
	Workaround
	----------
	
	To work around this problem, do one of the following:
	
	1. Break the complex equation into smaller parts that are evaluated
	   separately.
	
	-or-
	
	2. Turn off use of the coprocessor with SET NO87="message" at the DOS
	   prompt.
	
	-or-
	
	3. Compile using the alternate math (/FPa) option.
	
	Code Example
	------------
	
	a = .475
	b = 75
	c = 62
	d = .007
	e = 22
	f = (b * e ^ 2 / d) * SQR(1 / ((2 * b * c * a) ^ 2 + (b ^ 2 - c ^ 2))
	
	Simplifying the equation eliminates the problem. For example, removing
	the (b * e ^ 2 / d) factor eliminates the error.
