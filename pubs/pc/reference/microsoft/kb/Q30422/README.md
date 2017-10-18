---
layout: page
title: "Q30422: % Operator Used in a Macro Call Generates Incorrect Output"
permalink: /pubs/pc/reference/microsoft/kb/Q30422/
---

## Q30422: % Operator Used in a Macro Call Generates Incorrect Output

	Article: Q30422
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	The following program, which contains a macro call using the %
	operator and a %out in the macro, will not always print out "assume
	nothing:"
	
	string  equ <assume nothing>
	
	usestr  macro   str
	        %out    str
	        endm
	
	        usestr  %string
	        .
	        .
	        .
	        .
	        usestr  %string
	
	end
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
