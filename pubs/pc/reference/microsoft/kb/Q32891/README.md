---
layout: page
title: "Q32891: &#95;&#95;fac Unresolved at Link Time"
permalink: /pubs/pc/reference/microsoft/kb/Q32891/
---

	Article: Q32891
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 19-JUL-1988
	
	Problem:
	   I am attempting to write a function to be used in a dynamic link
	library. The function returns a double. Whenever I compile and link
	with either of the multithread C run-time libraries (LLIBCMT.LIB
	or CRTLIB.LIB), I get the variable __fac unresolved.
	
	Response:
	   In a single thread environment, the C run-time uses a global variable
	__fac to store the return value of a function that returns double. In
	a multithread reentrant environment, it is not possible to have a global
	variable that will potentially be modified by several threads.
	   If you are writing functions that return doubles and you are using
	the multithread libraries, you need to declare the functions with the
	Pascal calling convention. Functions returning double with the Pascal
	calling convention pass the return value on the stack and allow you to
	work in a reentrant environment.
