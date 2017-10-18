---
layout: page
title: "Q30412: Omitting Range Keyword after LABEL Directive Causes Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q30412/
---

## Q30412: Omitting Range Keyword after LABEL Directive Causes Errors

	Article: Q30412
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	When a LABEL directive is used without a range keyword, it will
	cause an "Unknown type specifier" error. This error will correctly
	occur if the LABEL directive is the first statement in the segment.
	   However, if you also have executable statements prior to the LABEL
	directive in the code segment, error messages will incorrectly occur
	on every statement.
	   The following program demonstrates the problem:
	
	   .MODEL small
	   .CODE
	   main    proc
	           mov ax, 1
	           pt1 label
	   main    endp
	   end     main
	
	   The "mov ax, 1" statement will incorrectly generate the error
	message "Symbol not defined: AX." The statement "pt1 label" will
	generate an "Unknown type specifier" error as well.
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
