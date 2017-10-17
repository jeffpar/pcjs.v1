---
layout: page
title: "Q46773: Using C Run-Time Library Functions in .DLLs"
permalink: /pubs/pc/reference/microsoft/kb/Q46773/
---

## Q46773: Using C Run-Time Library Functions in .DLLs

	Article: Q46773
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | SR# G890705-21975
	Last Modified: 25-JUL-1989
	
	Question:
	
	In a .DLL, what C standard library functions are usable?
	
	Also, one reference mentions special re-entrant libraries for use in
	.DLLs. Is that correct, and if so, how do you get at them? Is there
	some place where this information is documented?
	
	Response:
	
	There's been a lot of confusion about the proper way to write .DLLs
	because what was legal and what's not legal has changed at least once
	during the lifetime of the OS/2 SDK.
	
	In the past, there were restrictions on which library functions you
	could use and how you could use them. These restrictions have been
	removed because we've created several specially-modified libraries
	that can be used freely in .DLLs. All library functions can be called.
	Any serialization needed is handled by the library.
	
	The proper way to create .DLLs is outlined in the file MTDYNA.DOC,
	which is included with the C 5.10 compiler. There are also examples
	included with the compiler that you can compile and modify. If you are
	developing for OS/2 1.10, instead of OS/2 1.00, with the OS/2 1.10
	Software Development Kit or Tool Kit, use the OS/2 1.10 library
	OS2.LIB in place of the OS/2 1.00 library DOSCALLS.LIB. Also make sure
	to include the OS/2 1.10 include files before, or instead of, the C
	5.10 regular and multi-thread include files with the same names, such
	as OS2.H and BSE.H. These C 5.10 OS/2 API-related include files are
	for OS/2 1.00.
	
	Note: There are two very important details about writing your .DEF
	file that MTDYNA.DOC doesn't mention:
	
	1. You MUST use a DATA MULTIPLE NONSHARED statement for any .DLL that
	   uses the C run-time library because each process that uses the .DLL
	   needs its .DLL to have a separate data area. Otherwise, multiple
	   instances of the .DLL will corrupt each other's C run-time library
	   static data.
	
	2. You also MUST use LIBRARY INITINSTANCE in any .DLL that calls the
	   C run-time library because each instance of the .DLL must have its
	   run-time library data area initialized separately.
	
	Aside from these two details and the new OS/2 1.10 library and header
	files, MTDYNA.DOC is an excellent guide for writing .DLLs.
