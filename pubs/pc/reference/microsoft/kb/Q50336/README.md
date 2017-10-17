---
layout: page
title: "Q50336: Passing a Stream File Pointer (FILE &#42;) Between DLLs"
permalink: /pubs/pc/reference/microsoft/kb/Q50336/
---

## Q50336: Passing a Stream File Pointer (FILE &#42;) Between DLLs

	Article: Q50336
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 17-JUL-1990
	
	Question:
	
	Regarding single-thread DLLs built with the C 5.10 single-thread
	DLL support library LLIBCDLL.LIB:
	
	My main() function calls a function in my first DLL, which fopen()s a
	buffered stream file. The function in my first DLL calls a function
	in my second DLL, passing the stream pointer (FILE *) as an argument.
	When the function in my second DLL attempts to fread() the stream for
	the first time (which causes the allocation of the stream buffer), a
	General Protect fault (segment violation Trap 13 or 0xD) occurs. What
	went wrong, and how can I work around the problem?
	
	Response:
	
	This procedure cannot be done with LLIBCDLL-created DLLs because the
	second DLL has no way to know where the internal C run-time library
	data structures are, which in this case would be the data structures
	for the file stream that was opened in the first DLL.
	
	To share file streams between DLLs or between an .EXE and DLLs, use
	the dynamically linked, multithread support C run-time function
	CRTLIB.DLL. The correct way to do this is to have one of your DLLs
	export a version of the fread() function and/or fopen() function. The
	fopen() and fread() that get called must be in the same DLL.
