---
layout: page
title: "Q46379: C 5.10 Internal Compiler Error C1001: pgoMD.c : 1.134 Line 146"
permalink: /pubs/pc/reference/microsoft/kb/Q46379/
---

	Article: Q46379
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1989
	
	Using a structure as the conditional argument of a ternary expression
	causes an internal compiler error if the structure contains three or
	more elements. The following error message is displayed:
	
	   struct.c(15) : fatal error C1001: Internal Compiler Error
	             (compiler file '@(#)pgoMD.c:1.134', line 1467)
	             Contact Microsoft Technical Support
	
	The ternary operator, as defined in the Microsoft C Version 5.10
	user's guide, accepts three operands. The conditional operand is
	required by Microsoft C to be of type integral, float, or pointer. Any
	other type (including struct) is undefined.
	
	If the structure contains less than three elements, no error is
	produced but the code will be undefined.
	
	To work around the problem, use an if statement with appropriate
	assignments rather than the conditional operator.
	
	The following program produces the internal compiler error:
	
	#include <stdio.h>
	struct { int a;
	         int b;
	         int c; } s;
	void main(void)
	{
	  printf("the value %d\n", s ? 1 : 2);
	}
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
