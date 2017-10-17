---
layout: page
title: "Q67353: Math Functions in LLIBCDLL May Not Return Zero on Domain Error"
permalink: /pubs/pc/reference/microsoft/kb/Q67353/
---

## Q67353: Math Functions in LLIBCDLL May Not Return Zero on Domain Error

	Article: Q67353
	Version(s): 6.00 6.00a
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 4-DEC-1990
	
	The C run-time math routines in the statically-linked DLL library
	(LLIBCDLL.LIB) that are designed to return zero when they encounter a
	domain error may not return zero. Domain errors are detected correctly
	but the return values are incorrect in these instances because they
	should be zero.
	
	For example, calling the sqrt() function with an argument of -1 should
	cause a DOMAIN error and cause the return value to be zero. The
	LLIBCDLL version of sqrt() does set errno to EDOM (domain error) in
	this case, but the return value from the function is non-zero. The
	sqrt() function in the standard library xLIBCEP.LIB, the multithreaded
	library LLIBCMT.LIB, and the version that goes into a C run-time DLL
	all correctly return zero.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
