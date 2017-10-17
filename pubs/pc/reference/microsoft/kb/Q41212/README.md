---
layout: page
title: "Q41212: Prototypes Must Be Used Before Intrinsic or Function Pragmas"
permalink: /pubs/pc/reference/microsoft/kb/Q41212/
---

## Q41212: Prototypes Must Be Used Before Intrinsic or Function Pragmas

	Article: Q41212
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G881031-5486
	Last Modified: 16-MAY-1989
	
	Question:
	
	I normally compile a certain program with the /Ox switch. Inside a few
	modules, I use the #pragma function(memcpy) statement to force the
	use of the function version of memcpy, which is required because I use
	memcpy with some "huge" pointers.
	
	This works correctly until I want to use CodeView. At that time, I
	recompile with the switches /Od /Zi. This produces the following error
	message:
	
	   Error C2164: 'memcpy': intrinsic was not declared.
	
	Editing each module to remove the #pragma function(memcpy), which is
	not required in the /Od case, eliminates the error message. However
	this is time consuming. Why is this required?
	
	Note: Error C2164 is not listed in the "Microsoft C for MS-DOS
	Operating System: User's Guide."
	
	Response:
	
	When you don't use the -Oi or -Ox option, you need to declare a
	function prototype before you can use the function or intrinsic
	pragmas. One method is to include the appropriate .h file -- for this
	function, either string.h or memory.h will work correctly.
	
	The C2164 error message is listed in errmsg.doc, which is supplied
	with the compiler. (It's a good idea to print out all the .doc files
	for reference; there's a lot of important information there that
	doesn't appear in the manuals.)
