---
layout: page
title: "Q64686: Nested Nameless Structs Can Cause C2030 Error"
permalink: /pubs/pc/reference/microsoft/kb/Q64686/
---

## Q64686: Nested Nameless Structs Can Cause C2030 Error

	Article: Q64686
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 16-AUG-1990
	
	Using the same nameless structure as a member of two different
	structures will cause the compiler error: C2030: 'varname':
	struct/union member redefinition. The code sample below reproduces the
	error:
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	void main(void)
	 {
	
	   struct s1
	     {
	       int a,b,c;
	     };
	
	   struct s2
	     {
	       struct s1;
	       float y;
	       char str[10];
	     } *p_s2;
	
	   struct s3
	     {
	       struct s1;
	       float z;
	       char a[10];
	     } *p_s3;
	 }
	
	The error message names the structure member following the nameless
	struct. A second nameless struct may be used only if it contains
	different fields than the first nameless struct.
	
	Examples of nameless structures and unions are given on Page 434 of
	the "Advanced Programming Techniques" book provided with C version
	6.00. There is also mention of this problem in the README.DOC file.
	
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here when it
	becomes available.
