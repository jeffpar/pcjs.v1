---
layout: page
title: "Q51474: Character Parameters May Be Prototyped As Integers"
permalink: /pubs/pc/reference/microsoft/kb/Q51474/
---

	Article: Q51474
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 14-MAR-1990
	
	There are some functions in the run-time library that take character
	values as parameters (i.e., memccpy, memset, etc.) and that are
	prototyped as taking integers. This is not a documentation error and
	your program will work correctly if a character value is passed in the
	place of the integer parameter (automatic casting takes care of this).
	
	The integer value is specified because when the compiler pushes
	parameters on the stack so that the function being called can use
	them, it always pushes them in word increments. In other words,
	regardless of whether the value is an integer or a character, 2 bytes
	will be pushed on the stack. Therefore, to simplify, the function is
	prototyped as receiving an integer.
