---
layout: page
title: "Q61188: C 6.00 README: Functions Declared as Float Now Return Float"
permalink: /pubs/pc/reference/microsoft/kb/Q61188/
---

## Q61188: C 6.00 README: Functions Declared as Float Now Return Float

	Article: Q61188
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 6-NOV-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	Functions Declared as Float
	---------------------------
	
	In Microsoft C 5.10, functions declared as float always return a
	result of type double. In C 6.00, functions declared as float return a
	value of type float for ANSI compliance. This difference will cause
	compatibility problems when linking C 6.00 objects with C 5.10 objects
	and libraries that contain functions that return values of type float.
	
	To remedy the problem, prototype each function in your C 5.10
	libraries that returns type float as type double in your C 6.00 source
	code. Then compile with C 6.00. For example:
	
	   double func_in_51_lib( float );
