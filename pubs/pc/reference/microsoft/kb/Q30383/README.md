---
layout: page
title: "Q30383: SUBSTR Directive Will Not Work if Target Is the Same as Source"
permalink: /pubs/pc/reference/microsoft/kb/Q30383/
---

## Q30383: SUBSTR Directive Will Not Work if Target Is the Same as Source

	Article: Q30383
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	The SUBSTR assignment to A in the following program should not be
	different than the SUBSTR assignment to B:
	
	    .MODEL SMALL
	    .CODE
	A   equ    <abcdef>
	B   substr A,4
	A   substr A,4
	    END
	
	   In this program, the assignment to B is "abcdef". The assignment to
	A is "def".
	   Microsoft is researching this problem and will post new information
	as it becomes available.
