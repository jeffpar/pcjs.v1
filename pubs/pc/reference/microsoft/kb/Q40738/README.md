---
layout: page
title: "Q40738: C memcpy and Large Model"
permalink: /pubs/pc/reference/microsoft/kb/Q40738/
---

## Q40738: C memcpy and Large Model

	Article: Q40738
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G881031-5486
	Last Modified: 16-MAY-1989
	
	Question:
	
	I normally compile a certain program with the /Ox switch. Inside a few
	modules, I use the #pragma function(memcpy) statement, to force the
	use of the function version of memcpy, which is required because I use
	memcpy with some huge pointers.
	
	This works correctly, until I want to use CodeView. At that time, I
	recompile with the switches /Od /Zi. This produces the following error
	message:
	
	   Error C2164: 'memcpy': intrinsic was not declared
	
	Editing each module to remove the #pragma function(memcpy), which is
	not required in the /Od case, eliminates the error message. Editing
	the pragma in and out is a lot of work, however.
	
	Why is this required?
	
	Response:
	
	The C2164 error message is listed in ERRMSG.DOC, which is supplied
	with the compiler. (It's a good idea to print out all the .DOC files
	for reference; there's a lot of important information there that
	doesn't appear in the manuals.) When you don't use the -Oi or -Ox
	option, you need to declare a function prototype before you can use
	the function or intrinsic pragmas. An easy way to do this is to
	include the appropriate .H file: in this case, either STRING.H or
	MEMORY.H will do. This will work with or without intrinsics.
