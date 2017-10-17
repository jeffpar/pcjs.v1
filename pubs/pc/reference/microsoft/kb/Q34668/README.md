---
layout: page
title: "Q34668: Initialization of auto Arrays, Structs, Unions Not Allowed"
permalink: /pubs/pc/reference/microsoft/kb/Q34668/
---

## Q34668: Initialization of auto Arrays, Structs, Unions Not Allowed

	Article: Q34668
	Version(s): 4.00 5.00 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 17-AUG-1989
	
	Problem:
	
	Both the ANSI draft standard for C (May 1988) and "The C Programming
	Language," Second Edition (by Kernighan and Ritchie) show that
	initializing aggregate data items declared with auto storage class is
	allowed in Standard C; however, our compiler flags fatal errors when
	such attempts are made.
	
	The error message C2073 cannot initialize array if function is issued
	when attempting to compile an array initilization within a function
	such as the following:
	
	foo() {
	    char array[]="intialized local array will cause an error";
	}
	
	Response:
	
	This restriction is stated in the "Microsoft C 5.1 Optimizing Compiler
	Language Reference" on Page 89.
	
	One possible workaround is to use the static storage class rather than
	auto (auto is the default for declarations inside a function). This
	process has the advantage of making only one copy of the array and
	initializing it only ONCE, conceptually at the start of program
	execution; however, this can be a problem for recursive functions that
	may need a separate copy of the array for each invocation of the
	function.
	
	Another workaround is to declare two arrays: one static and one auto.
	Initialize the static array and copy it into the auto array (e.g.
	using the fast memcpy function) at the beginning of the function. Note
	that there is no speed or space penalty for this process because the
	second workaround is basically what the compiler would have to do if
	it allowed initialization of auto arrays.
	
	The first workaround will give a savings of both time and space over
	both the second workaround and over initializing an auto aggregate.
