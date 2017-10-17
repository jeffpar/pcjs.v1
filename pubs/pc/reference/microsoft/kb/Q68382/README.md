---
layout: page
title: "Q68382: Multithreaded fcvt() and ecvt() in C 6.00 May Cause GP Fault"
permalink: /pubs/pc/reference/microsoft/kb/Q68382/
---

## Q68382: Multithreaded fcvt() and ecvt() in C 6.00 May Cause GP Fault

	Article: Q68382
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00a
	Last Modified: 1-FEB-1991
	
	The multithreaded versions of the fcvt() and ecvt() functions that
	shipped with the Microsoft C version 6.00 compiler can cause a GP
	fault. This includes the versions in LLIBCMT.LIB, LLIBCDLL.LIB, and
	CDLLOBJS.LIB.
	
	Microsoft has confirmed this to be a problem in C version 6.00. This
	problem has been corrected in the C version 6.00a maintenance release.
	
	As a workaround, the gcvt() function can be used if the numbers are
	first coerced into the correct format. The gcvt() function will return
	fcvt() format if the number is greater than 0.1 and ecvt() format if
	the number is less than 0.1. In addition, sprintf() can be called with
	the %f or %e format specifier to return the required string.
