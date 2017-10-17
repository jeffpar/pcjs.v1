---
layout: page
title: "Q35282: &quot;Subscript Out of Range&quot; Using SGN Function Compiled BC /d"
permalink: /pubs/pc/reference/microsoft/kb/Q35282/
---

## Q35282: &quot;Subscript Out of Range&quot; Using SGN Function Compiled BC /d

	Article: Q35282
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	An incorrect "Subscript out of range" error can occur at run time when
	a program using the SGN function in a formula is compiled with the
	debug (BC /d) option. To correct the problem, assign the SGN function
	to a temporary variable and use the temporary variable in the formula.
	
	The program below demonstrates the problem on machines with or without
	a coprocessor:
	
	a(1) = (b(1) + 1) * SGN(c)
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in QuickBASIC Version 4.50 and in Microsoft
	BASIC Compiler Version 7.00 (fixlist7.00).
	
	The problem happens more frequently on machines with coprocessors,
	although the problem may occur on machines without them. The problem
	seems to occur when a program has the following characteristics:
	
	1. The program is compiled to an executable .EXE program.
	
	2. The program is compiled using the debug option (/d).
	
	3. The program contains an assignment statement with the following
	   features:
	
	   a. The assignment is made to a real number array element.
	
	   b. The SGN expression is used in a formula that contains a
	      reference to an array element and another operation of some
	      kind.
