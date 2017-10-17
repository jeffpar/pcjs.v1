---
layout: page
title: "Q28163: Unexpected PRINT USING &quot;.##&quot; Rounding for .xx5"
permalink: /pubs/pc/reference/microsoft/kb/Q28163/
---

## Q28163: Unexpected PRINT USING &quot;.##&quot; Rounding for .xx5

	Article: Q28163
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	Problem:
	
	For the following statement
	
	   PRINT USING " ###.##"; .245, .255, .265, .275, .285
	
	the output is as follows
	
	   0.25  0.25  0.26  0.28  0.28
	
	whereas you would expect the following
	
	   0.25  0.26  0.27  0.28  0.29
	
	or with IEEE rounding, you would expect the following:
	
	      0.24  0.26  0.26  0.28  0.28
	
	Response:
	
	The internal representation of the numbers used by BASIC differs
	slightly from the decimal numbers typed into the source code.
	
	IEEE floating-point format cannot accurately represent numbers that
	are not of the form 1.x to the power of y (where x and y are base 2
	numbers). The internal representation will be slightly more or
	slightly less than the decimal numbers typed into the source code.
	
	The internal representations are correctly rounded and displayed. This
	is not a software problem.
