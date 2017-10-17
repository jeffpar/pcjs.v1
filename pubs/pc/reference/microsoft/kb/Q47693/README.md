---
layout: page
title: "Q47693: Initializing Unions Initializes the First Member of the Union"
permalink: /pubs/pc/reference/microsoft/kb/Q47693/
---

## Q47693: Initializing Unions Initializes the First Member of the Union

	Article: Q47693
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC S_QuickASM
	Last Modified: 16-AUG-1989
	
	When you initialize a union, the initialization value is applied to
	the first member of the union even if the type of the value matches a
	subsequent member. As stated in the ANSI Standard, Section 3.5.7:
	
	   A brace-enclosed initializer for a union object initializes the
	   member that appears first in the declaration list of the union
	   type.
	
	Since you cannot initialize the value of any member of a union other
	than the first one, you must assign their values in a separate
	statement. Initializing a union with a value intended for a subsequent
	member causes that value to be converted to the type of the first
	member.
	
	The following example demonstrates the issue:
	
	#include <stdio.h>
	union { int   a;         /* only external unions may be initialized */
	        float b;
	      } test = {3.6};    /* this is intended to initialize 'b'      */
	                         /* however, the value will be converted    */
	                         /* (first to a long and then to an int)    */
	                         /* in order to initialize 'a'              */
	
	void main (void)
	{
	   float dummy = 0.0;            /* this causes the floating point  */
	                                 /* math package to be initialized  */
	
	   printf ("test.a = %d,  test.b = %f\n", test.a, test.b);
	}
	
	The output from the example, though not what is intended, will be as
	follows:
	
	test.a = 3, test.b = 0.00000
	
	To associate a value with "b", you can reverse the order of the
	members, as in the following:
	
	union {
	        float b;
	        int a;
	      } test = {3.6};
	
	Or, you can retain the order of the elements and assign the value in a
	separate statement, as in the following:
	
	test.b = 3.6;
	
	Either of these methods creates the following output:
	
	test.a = 26214, test.b = 3.600000
