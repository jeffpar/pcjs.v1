---
layout: page
title: "Q43391: Handling Floating-Point Errors in C"
permalink: /pubs/pc/reference/microsoft/kb/Q43391/
---

	Article: Q43391
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 17-MAY-1989
	
	You can set up a floating-point error-handling routine by using the
	signal() function. Do not use the return() function to return to the
	calling process. If return() is used, the floating-point state is left
	undefined.
	
	Instead, use the function setjmp() to save the stack environment
	before each section of the calling process code that may potentially
	generate a floating-point error. In the error handler, use _fpreset()
	to reinitialize the floating-point package and longjmp() to return to
	the calling process.
	
	The sample program on Page 280 of the "Microsoft C Run-time Library
	Reference" demonstrates the use of setjmp(), _fpreset(), and longjmp()
	to handle a floating-point error.
	
	The function setjmp() saves the environment (bp, si, di, sp, and ds
	registers) and return address in a buffer. The buffer is used by
	longjmp() to restore the environment.
