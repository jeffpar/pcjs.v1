---
layout: page
title: "Q62097: Line Continuation Evaluated Before Inline Comment in C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q62097/
---

	Article: Q62097
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 13-JUN-1990
	
	To maintain ANSI compliance, Microsoft C version 6.00 and QuickC
	versions 2.00 and later evaluate line continuation characters "\"
	before inline comment tokens "//". This is a change from the behavior
	of C version 5.10, which ignored continuation characters within
	inline comments.
	
	Section 2.1.1.2 of the ANSI Draft proposal dated December 7, 1988
	states the order in which source code translation is to take place.
	The second and third steps are paraphrased below.
	
	   2. Each instance of a new-line character and an immediately
	   preceding backslash character is deleted, splicing physical source
	   lines to form logical source lines. ...
	
	   3. The source file is decomposed into preprocessing tokens and
	   sequences of white-space characters ... Each comment is replaced by
	   one space character.
	
	As this indicates, the line concatenation should be performed before
	any and all evaluation of preprocessing tokens and comments. The
	change in interpretation can cause problems with programs that depend
	on the C 5.10 interpretation. The problem usually manifests itself in
	sections of code being ignored. This can be seen in the following
	program, which behaves differently under the different compilers.
	
	Code Example
	------------
	
	#include<stdio.h>
	
	#define INT1 1          //    In-line Comment    \
	#define INT2 2    //  This line is ignored under C6.00   \
	
	void main(void)
	{
	   printf("%d %d \n",INT1,INT2);
	}
