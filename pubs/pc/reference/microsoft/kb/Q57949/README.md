---
layout: page
title: "Q57949: Use of the Stringizing Operator (#) in Macros"
permalink: /pubs/pc/reference/microsoft/kb/Q57949/
---

	Article: Q57949
	Product: Microsoft C
	Version(s): 3.x 4.x 5.00 5.10 | 5.10
	Operating System: MS-DOS            | OS/2
	Flags: ENDUSER | s_quickc s_quickasm 1.x 2.00 2.01
	Last Modified: 7-MAR-1990
	
	When you are writing a preprocessor macro that takes an argument that
	must appear in quotation marks, you can use the # sign to expand the
	argument. One implementation of this preprocessor directive is the use
	of printf() in the macro. The following code demonstrates an example:
	
	Code Example
	------------
	
	#define PR(fmt,value) printf("value = %" #fmt "\n", (value))
	
	#include <stdio.h>
	
	void main(void)
	{
	   float afl;
	
	   afl = 3.14f;
	   PR(5.2f, afl);
	}
	
	The sample code outputs the following string:
	
	   value =  3.14
	
	The # sign in front of the fmt variable allows the macro to be
	expanded out with quotation marks. Note that the preprocessor
	concatenates consecutive pairs of double quotation marks so that the
	following string
	
	   "value = %""5.2f""\n"
	
	is translated into the following:
	
	   "value = %5.2f\n"
