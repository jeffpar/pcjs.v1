---
layout: page
title: "Q40160: Error C2001: Newline in Constant for a String on Multiple Line"
permalink: /pubs/pc/reference/microsoft/kb/Q40160/
---

	Article: Q40160
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 9-JAN-1989
	
	If the program below, which contains a string literal that is
	incorrectly split over multiple lines, is compiled, the following
	error will occur:
	
	   error C 2001: newline in constant
	
	The incorrect program is as follows:
	
	#include <stdio.h>
	main() {
	    printf("\n %s
	            %s
	            %s",
	            "this", "is", "it");
	    }
	
	As indicated on Page 23 of the "Microsoft C for the MS-DOS Operating
	System: Language Reference" for Version 5.10, there are two methods to
	form a string that takes up more than one line.
	
	The best method is to change the format string as in the following
	example (this work because strings separated only by spaces, tabs,
	and/or newlines are concatenated):
	
	#include <stdio.h>
	main() {
	    printf("\n %s"
	           "%s"
	           "%s",
	           "this", "is", "it");
	    }
	
	The older and less-prefered method is to use continuation lines by
	typing a backslash followed by a carriage return at the end of a line,
	as in the following example:
	
	printf("\n %s\
	           %s\
	           %s",
	           "this", "is", "it");
	
	This is not as good as the previous example because the spaces at the
	beginning of the continuation line become part of the string, unlike
	example one.
