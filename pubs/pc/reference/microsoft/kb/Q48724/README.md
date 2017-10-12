---
layout: page
title: "Q48724: Incorrect Evaluation When Type Casting in while and for Loops"
permalink: /pubs/pc/reference/microsoft/kb/Q48724/
---

	Article: Q48724
	Product: Microsoft C
	Version(s): 1.01 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM buglist1.01 buglist2.00
	Last Modified: 10-OCT-1989
	
	The resulting value is incorrectly evaluated when you type cast an
	integer to a float (or double) in "for" loops and "while" loops in
	QuickC Versions 1.01 and 2.00 and QuickAssembler Version 2.01.
	
	The problem does not occur in the initialization expression, only
	in the conditional test expression and the increment expression.
	Workarounds include using a temporary variable and simplifying the
	assignment expression.
	
	Microsoft has confirmed this to be a problem with QuickC Versions 1.01
	and 2.00 and QuickAssembler Version 2.01 (buglist2.01). We are
	researching this problem and will post new information as it becomes
	available.
	
	The following program demonstrates the problem. Note that the problem
	also exists if you replace references to "float" by "double".
	
	#include <stdio.h>
	void main(void)
	{
	   float var;
	   float temp;
	
	   var = (float)1;               /* do-while statement:            */
	   do                            /* all casts work correctly       */
	     var += (float)2;
	   while (var <= (float)5);
	   printf ("var = %12f, expected 7.000000\n", var);
	
	   var = (float)1;               /* while statement:                */
	   while (var <= (float)5)       /* this cast works incorrectly     */
	     var += (float)2;            /* this cast works correctly       */
	   printf ("var = %12f, expected 7.000000\n", var);
	
	   for                           /* for statement:                  */
	       (var = (float)1;          /* this cast works correctly       */
	        var <= (float)5;         /* this cast works incorrectly     */
	        var += (float)2)         /* this cast and/or the assignment */
	                                 /* works incorrectly               */
	            continue;
	   printf("var = %12f, expected 7.000000\n", var);
	
	/* Workarounds for the while- and for-loops:                        */
	
	   var = (float)1;               /* while statement:                */
	   temp = (float)5;              /* this cast works correctly       */
	   while (var <= temp)           /* use a non-cast float here       */
	     var += (float)2;            /* this cast works correctly       */
	   printf ("var = %12f, expected 7.000000\n", var);
	
	   for                           /* for statement:                  */
	       (var = (float)1;          /* this cast works correctly       */
	        var <= (float)5;
	        var = var + (float)2)    /* use a different assignment      */
	            continue;
	   printf("var = %12f, expected 7.000000\n", var);
	}
