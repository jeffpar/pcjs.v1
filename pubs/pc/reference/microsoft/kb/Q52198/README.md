---
layout: page
title: "Q52198: Optimization Can Cause Integer Division to Always Return 1"
permalink: /pubs/pc/reference/microsoft/kb/Q52198/
---

## Q52198: Optimization Can Cause Integer Division to Always Return 1

	Article: Q52198
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm buglist2.00 buglist2.01
	Last Modified: 17-JAN-1990
	
	When optimizing code under QuickC (using either the Options menu from
	within the environment, or the -Ot or -Ox switches from the command
	line), integer division can generate incorrect code. This occurs only
	when all of the following conditions are satisfied:
	
	1. The -Ot or -Ox optimization level is chosen.
	
	2. The dividend and the divisor are both variables.
	
	3. The divisor is the product of a multiply (or shift) operation that
	   immediately precedes the division.
	
	To work around this problem, compile modules that meet all the above
	criteria with either -Od or -Ol.
	
	When this problem occurs, the divisor is being divided into itself.
	Therefore, if the returned value for the division is not exclusively
	1, you are not experiencing this problem.
	
	The sample program below demonstrates the problem. Microsoft has
	confirmed this to be a problem in QuickC Versions 2.00 and 2.01. We
	are researching this problem and will post new information here as it
	becomes available.
	
	The following program demonstrates this problem when compiled as
	specified (compile the module with either -Od or -Ol to generate code
	that runs correctly):
	
	/*
	    DIVISION.C
	    Compile: qcl -Ot (or -Ox) division.c
	*/
	
	#include <stdio.h>
	
	void main ( void )
	
	{
	    int a, b, c, d ;
	
	    a = 100 ;
	    b = 5 ;
	    c = b*5 ;
	    d = a/c ;
	
	/*
	    When compiling with -Ot or -Ox, the failed error message will
	    result AND the value of d will be set to one.
	*/
	
	  if (d == 4)
	    printf("Success, d is %d, should be 4!\n", d) ;
	  else
	    printf("Failed, d is %d, should be 4!\n", d) ;
	
	}
