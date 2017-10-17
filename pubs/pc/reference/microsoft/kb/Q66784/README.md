---
layout: page
title: "Q66784: Nesting for-loops Too Deep Gives C1026: Parser Stack OverFlow"
permalink: /pubs/pc/reference/microsoft/kb/Q66784/
---

## Q66784: Nesting for-loops Too Deep Gives C1026: Parser Stack OverFlow

	Article: Q66784
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 10-NOV-1990
	
	The Microsoft C Compiler versions 5.10, 6.00, and C 6.00a are limited
	in the number of levels deep allowed for nested for-loops. Attempts to
	nest for-loops too deep will result in the error "C1026: parser stack
	overflow, please simplify your program."
	
	There is no specific limit to the nesting level because the parser
	stack capacity depends on the actual contents of the code, but the
	overflow generally occurs with for-loop nesting about 10 to 15 levels
	deep. This is an arbitrary limit and it will be increased in the
	future to ensure compatibility with the 15 nesting-level minimum
	specified in the ANSI specification.
	
	Microsoft has confirmed this to be a problem in C versions 5.10, 6.00,
	and 6.00a. We are researching this problem and will post new
	information here as it becomes available.
