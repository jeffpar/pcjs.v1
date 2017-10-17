---
layout: page
title: "Q63959: Using Unary &quot;+&quot; in QuickC Gives Incorrect Results"
permalink: /pubs/pc/reference/microsoft/kb/Q63959/
---

## Q63959: Using Unary &quot;+&quot; in QuickC Gives Incorrect Results

	Article: Q63959
	Version(s): 2.50
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm buglist2.50 plus
	Last Modified: 25-JUL-1990
	
	The ANSI C standard now defines the unary + operator. However, using
	this operator on a float or double precision float data type in QuickC
	version 2.50 gives inaccurate results. The following code will
	reproduce these results:
	
	/* This code will print out an inaccurate value for
	 * variable t
	 */
	
	static double t = +.5, tt = .5;
	
	void main(void)
	{
	        printf("t = %lg tt = %lg\n", t, tt);
	}
	
	The output from this program is as follows:
	
	   t = 0 tt = 0.5
	
	This behavior occurs only when using floating point numbers or
	doubles. Integers behave as expected.
