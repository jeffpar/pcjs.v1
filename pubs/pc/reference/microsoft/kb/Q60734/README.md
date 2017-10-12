---
layout: page
title: "Q60734: C4127 Is Generated When Subexpression Evaluates to a Constant"
permalink: /pubs/pc/reference/microsoft/kb/Q60734/
---

	Article: Q60734
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 21-APR-1990
	
	Microsoft C Version 6.00 has a new compiler warning "C4127:
	conditional expression is constant." This warning is designed to
	inform you that the controlling expression of an if statement or while
	loop evaluates to a constant, so the body of the loop is ALWAYS
	executed or NEVER executed.
	
	The warning may appear in certain expressions that don't seem to be a
	constant, but this is because the compiler will generate this warning
	if ANY subexpression in a larger conditional expression evaluates to a
	constant. The warning is strictly informational and does not
	necessarily indicate any problems in the code.
	
	In the sample code below, warning C4127 is generated if the code is
	compiled at warning level three or four (/W3 or /W4). Looking at the
	following entire expression
	
	     ( hours >= 0 && hours <= 24 )
	
	it definitely appears that it is NOT a constant because hours could be
	EITHER in the range 0 (zero) to 24, or out of that range. This
	expression generates warning C4127, however, because the left
	subexpression
	
	      hours >= 0
	
	ALWAYS evaluates to true because hours is unsigned and an unsigned int
	is ALWAYS greater than or equal to zero. The compiler generates the
	warning to inform you of this situation.
	
	Note that this warning is generated only by the full optimizing
	compiler because the quick compiler (/qc) does not check for this
	situation.
	
	Sample Code:
	
	#include <stdio.h>
	
	void main(void)
	{
	    unsigned hours;
	
	    scanf ( "%ud", &hours );
	
	    if ( hours >= 0 && hours <= 24 )
	        printf("Hours OK\n");
	    else
	        printf("Hours BAD\n");
	}
	
	Making a simple change, such as replacing the ">=" with a ">",
	eliminates the warning because the left expression could now evaluate
	to either true or false (for example, false if hours = 0; true
	otherwise).
