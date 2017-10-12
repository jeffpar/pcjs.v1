---
layout: page
title: "Q38328: C 5.10 Doesn't Implement Multibyte Integer Character Constants"
permalink: /pubs/pc/reference/microsoft/kb/Q38328/
---

	Article: Q38328
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 28-NOV-1988
	
	Page 28 of the ANSI C draft proposal X3J11/88-001 describes an integer
	character constant as being a sequence of one or more multibyte
	characters enclosed in single quotation marks, e.g. 'a' or 'ab'.
	
	Page 21 of the "Microsoft C 5.1 Optimizing Compiler Language
	Reference Guide" states that an integer character constant
	is formed by enclosing a single character from the representable
	character set within single quotation marks. It makes no reference to
	multibyte character constants (e.g. 'ab'). If a source file has the
	character constant defined as follows, the error "C2015: Too many
	chars in constant" is generated:
	
	   int ch = 'ab';
	
	This error is correct, because Microsoft C Version 5.10 does not
	implement multi-character integer character constants.  Note that
	page 29 of the draft standard says that such constructions are
	"implementation-defined."
