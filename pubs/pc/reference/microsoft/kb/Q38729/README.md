---
layout: page
title: "Q38729: Mixing Old Declarations with Prototypes Causes Passing Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q38729/
---

## Q38729: Mixing Old Declarations with Prototypes Causes Passing Errors

	Article: Q38729
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G881107-5854
	Last Modified: 12-DEC-1988
	
	Question:
	
	It is my understanding that both of the following functions should
	produce identical results:
	
	float AAA(float x1, float x2)
	{
	    x1 = x2;
	}
	
	float BBB(x1,x2)
	float x1,x2;
	{
	    x1 = x2;
	}
	
	However, they don't. Looking at the code, I see that in BBB, the two
	parameters are treated as double instead of float. When I compile with
	the /Zg switch, which generates function prototypes, the following
	prototypes are generated:
	
	extern  float AAA(float x1, float x2);
	extern  float BBB(double x1, double x2);
	
	Why is this behavior occuring?
	
	Response:
	
	The following is from the May 5, 1988 ANSI draft, Section 3.3.2.2:
	
	"If the expression that denotes the called function has a type that
	does not include a prototype...arguments that have type float are
	promoted to double.
	
	"If the expression that denotes the called function has a type that
	includes a prototype, the arguments are implicitly converted, as if
	by assignment, to the types of the corresponding parameters."
	
	For AAA, you're using the new function definition style. Note that if
	you call this function (perhaps in another module) without a prototype
	in scope, you'll have problems because you'll pass doubles rather than
	floats (see first paragraph above).
	
	BBB uses the old style of definition as described in K & R. Because
	K & R specified that the floats are to be widened to doubles when
	they're passed to functions (and in a variety of other situations
	as well), the old style declarations maintain the old semantics.
	
	Therefore, the /Zg switch is correctly generating the function
	prototypes.
	
	Your program wouldn't run when you declared the following prototype
	before calling BBB because the prototype that was in scope when you
	CALLED BBB did not match the implicit prototype generated when the
	function was defined:
	
	   void BBB(float, float);
	
	As a result, you passed floats to a function that was expecting
	doubles.
