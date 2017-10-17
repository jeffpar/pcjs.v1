---
layout: page
title: "Q61191: C 6.00 README: Hexadecimal Constants in Strings"
permalink: /pubs/pc/reference/microsoft/kb/Q61191/
---

## Q61191: C 6.00 README: Hexadecimal Constants in Strings

	Article: Q61191
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 6-NOV-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	Hexadecimal Constants in Strings
	--------------------------------
	
	Hexadecimal escape sequences in strings now conform to the ANSI
	specification by treating every potential hexadecimal digit following
	the \x as part of the constant. In C 5.10 and QuickC 2.00, hexadecimal
	escape sequences are limited to three characters.
	
	Typically, you will notice this when using hexadecimal escape
	sequences for length-preceded strings. Consider the following example:
	
	   char TypeArray[] =
	       "\x005float\x006double";
	
	In C 5.10 and QuickC 2.00, TypeArray contains the following bytes:
	
	   <5>float<6>double<0>
	
	In C 6.00, TypeArray has the following bytes:
	
	   _loatmouble<0>
	
	This is because in C 6.00, \x005f and \x006d are legal hexadecimal
	sequences that represent the underscore and "m" characters,
	respectively.
	
	There are two ways to avoid this problem. The simplest is to use
	string concatenation, as follows:
	
	   char TypeArray[] =
	       "\x005""float""\x006""double";
	
	According to the ANSI standard, adjacent string literals are
	concatenated after escape sequences have been calculated.
	
	A second solution is to use octal, which can never be more than three
	digits. The use of octal requires a small calculation and also
	requires that you pad out the digits with zeros on the left if
	necessary. However, even older, non-ANSI compilers will support this
	solution if portability is a concern.
