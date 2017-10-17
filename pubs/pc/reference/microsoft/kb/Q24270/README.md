---
layout: page
title: "Q24270: Tracking Down a Null Pointer Assignment Error"
permalink: /pubs/pc/reference/microsoft/kb/Q24270/
---

## Q24270: Tracking Down a Null Pointer Assignment Error

	Article: Q24270
	Version(s): 1.00 1.10 2.00 2.10 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS                        | OS/2
	Flags: ENDUSER | S_C
	Last Modified: 21-AUG-1989
	
	Question:
	
	I consistently get the error number R6001 "null pointer assignment"
	when I run my program. How can I use CodeView to determine the point
	at which the null pointer assignment is occurring?
	
	Response:
	
	Use a tracepoint, which can be set to watch a range of memory up to
	128 bytes. It will halt the execution of the program when any value in
	this range is changed. If you set a tracepoint over the entire range
	of the null segment, the program will halt immediately after the
	instruction that wrote over the null segment.
	
	The location of the null segment is available in the link maps of
	Microsoft compilers. It starts at DS:0 and is 42H bytes long. The
	Microsoft copyright notice is written there at program startup and
	if this area is written to during the course of the program, the
	error r6001 is generated. The most common cause of this error is
	using a pointer that has not been initialized to point to a memory
	area. Pointers that have not had space allocated for them (using
	malloc for example) or that have not been assigned to a specific
	data element (arrays or structures for example) are considered
	uninitialized.
	
	An example of using CodeView to determine where an unitialized pointer
	is being used follows:
	
	g main                  /* go to the beginning of main() */
	n16                     /* switch to hexadecimal (base 16) */
	tpb DS:0 DS:42          /* set a Trace Point of type Byte starting
	                              at address DS:0 and extending to DS:42 */
	
	When any value in the specified range changes, CodeView will stop the
	execution of your program. The previously executed line was probably
	the line that caused the R6001 error.
