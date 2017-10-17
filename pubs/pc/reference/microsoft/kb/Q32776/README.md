---
layout: page
title: "Q32776: C2085 Error May Be the Result of a Missing Semicolon"
permalink: /pubs/pc/reference/microsoft/kb/Q32776/
---

## Q32776: C2085 Error May Be the Result of a Missing Semicolon

	Article: Q32776
	Version(s): 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 6-FEB-1991
	
	The compiler error "C2085 'identifier': not in formal parameter list"
	can occur when a semicolon (;) is missing at the end of a function
	prototype.
	
	The following program demonstrates this error:
	
	void foo(void)
	
	void main(void)
	{
	}
	
	When this code is compiled, the following errors occur:
	
	   error C2085: 'main' : not in formal parameter list
	   error C2143: syntax error : missing ';' before '{'
	
	The C2085 error normally means that the listed parameter was declared
	in a function definition for a nonexistent formal parameter, but it's
	misleading in this case. With no semicolon to mark the end of the
	prototype, the compiler interprets the prototype as the start of a
	function definition, and interprets the next line to follow the
	prototype as if it were the first declaration within a function
	definition.
