---
layout: page
title: "Q32889: Toggling the Sign Bit on a Float or Double"
permalink: /pubs/pc/reference/microsoft/kb/Q32889/
---

## Q32889: Toggling the Sign Bit on a Float or Double

	Article: Q32889
	Version(s): 3.00 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 20-JUL-1988
	
	Problem:
	   I want to toggle the sign bit on a float or double by either
	and'ing it with 0x7fff (make it positive) or or'ing it with 0x8000
	(make it negative). However, the compiler will not accept the
	following syntax:
	
	   fl &= 0x7fff;
	   fl |= 0x8000;
	
	Response:
	   The bitwise operators only works correctly with integral types; you
	need to cast the float to be an integral type.
	   The following are two macros that will allow you to toggle the sign
	bit on a float or a double (note that the same thing can be
	accomplished by multiplying the value by -1, but the macros are much
	faster because they do not make any calls to the floating-point
	library):
	
	/* Macro to make either a float or a double Negative by setting sign bit */
	#define NEG(arg) ((unsigned char *)&arg)[sizeof(arg)-1] |= \
	                   (unsigned char)0x8000
	
	/* Macro to make either a float or a double Positive by clearing sign bit */
	#define POS(arg) ((unsigned char *)&arg)[sizeof(arg)-1] &= \
	                   (unsigned char)0x7fff
