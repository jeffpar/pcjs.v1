---
layout: page
title: "Q49756: Expressions in Switch Block Must Be Integral"
permalink: /pubs/pc/reference/microsoft/kb/Q49756/
---

	Article: Q49756
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_C docerr
	Last Modified: 17-JUL-1990
	
	The "switch" statement is a control-flow statement that causes
	execution to jump to a different location based on case values. The
	destinations must be specified as integral values; therefore, they
	cannot evaluate to floats, doubles, or pointers. This is not
	documented in the on-line help facility.
	
	Code Example
	------------
	
	switch (expression)             /* This expression must evaluate */
	  {                             /*   to an integral value. */
	    case constant_expression_1:
	            statement body 1
	            break ;
	
	    case constant_expression_2:
	            statement body 2
	            break ;
	    .
	    .
	    .
	    case constant_expression_n:
	            statement body n
	            break ;
	
	    default:
	            statement
	            break ;
	  }
