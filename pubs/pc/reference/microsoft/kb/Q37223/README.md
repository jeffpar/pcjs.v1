---
layout: page
title: "Q37223: Domain Error"
permalink: /pubs/pc/reference/microsoft/kb/Q37223/
---

## Q37223: Domain Error

	Article: Q37223
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc h_fortran s_pascal
	Last Modified: 21-NOV-1988
	
	A domain error occurs when you pass an invalid value to a function.
	"Domain" refers to arguments to a function; "range" refers to the
	return values.
	
	For example, if you pass a -1 to sqrt(), you receive the math error
	"M6201 Domain Error" because -1 is not in the domain of the square
	root function (i.e., you can't take the square root of -1).
	
	This error also can occur if an incorrect type is passed to the
	function. (For example, passing an int to a function that expects
	double.) You should receive warnings in these cases if you have
	declared proper function prototypes (perhaps by including the math.h
	file).
	
	Make sure the value you pass to a function is of the proper type and
	the value is within that function's domain.
