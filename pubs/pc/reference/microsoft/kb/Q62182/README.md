---
layout: page
title: "Q62182: C4058 Error with /qc Compile Option"
permalink: /pubs/pc/reference/microsoft/kb/Q62182/
---

## Q62182: C4058 Error with /qc Compile Option

	Article: Q62182
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 17-JUL-1990
	
	The C4058 warning message can be generated in error if the /qc switch
	(quick compile) is used. If the warning disappears after the /qc
	switch is removed, the warning can be ignored.
	
	Sample Code
	-----------
	
	 1. #include <math.h>
	 2.
	 3. void main (void) ;
	 4.
	 5. void main (void)
	 6. {
	 7.    double a ;
	 8.
	 9.    a = cos (3.2) ;
	10.    a = sin (2.2) ;
	11.    a = atan (5.0) ;
	12. }
	
	Compile with the following options:
	
	   cl /c /qc /W4 /Alfw fpburgr.c
	
	The following warning is given on the three assignment statements that
	reference "a":
	
	   Warning C4058: address of automatic (local) variable taken, DS != SS
	
	The /Alfw switch (used in multithreaded programs, dynamic link
	libraries, and Windows programming), instructs the compiler to assume
	DS != SS with DS fixed. Typically, this warning will come about when a
	program de-references a near pointer that is automatic (local). In this
	case, the warning is invalid.
	
	The following are two different ways of working around the problem:
	
	1. Compile with /Alfu. This assumes that DS != SS, and causes DS to be
	   reloaded upon function entry.
	
	2. Turn off the /qc compile option.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
